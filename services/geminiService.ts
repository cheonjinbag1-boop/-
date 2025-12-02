import { GoogleGenAI } from "@google/genai";
import { UploadedFile, GenerationRequest } from "../types";
import { SYSTEM_PROMPT, BASE_HTML_TEMPLATE } from "../constants";

const getClient = () => {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateMathContent = async (request: GenerationRequest): Promise<string> => {
    const ai = getClient();
    
    // Using gemini-3-pro-preview for complex reasoning and structure following
    const modelId = "gemini-3-pro-preview";

    const parts: any[] = [];

    // 1. Add System Instruction / Context
    parts.push({
        text: SYSTEM_PROMPT
    });

    // 2. Add Problem Context
    let problemContext = `\n# 문제 정보\n`;
    if (request.problemSet.startNumber || request.problemSet.endNumber) {
        problemContext += `문제 번호: ${request.problemSet.startNumber} ~ ${request.problemSet.endNumber}\n`;
    }
    if (request.problemText) {
        problemContext += `문제 텍스트: ${request.problemText}\n`;
    }
    parts.push({ text: problemContext });

    // 3. Add Problem Images/PDFs
    for (const file of request.problemFiles) {
        parts.push({
            inlineData: {
                mimeType: file.mimeType,
                data: file.base64
            }
        });
    }

    // 4. Add Solution Context
    if (request.solutionText) {
        parts.push({ text: `\n# 해설/정답 정보 (참고용)\n${request.solutionText}` });
    }

    // 5. Add Solution Images/PDFs
    for (const file of request.solutionFiles) {
        parts.push({
            inlineData: {
                mimeType: file.mimeType,
                data: file.base64
            }
        });
    }

    // 6. Explicit instruction to use the template
    parts.push({
        text: `\n\n위 정보를 바탕으로 아래 HTML 템플릿을 채워서 전체 HTML 코드를 작성해주세요. CSS/JS는 건드리지 마세요.\n\nTemplate:\n${BASE_HTML_TEMPLATE}`
    });

    try {
        const response = await ai.models.generateContent({
            model: modelId,
            contents: {
                role: 'user',
                parts: parts
            },
            config: {
                thinkingConfig: { thinkingBudget: 1024 }, // Enable thinking for better logical flow
            }
        });

        const text = response.text;
        if (!text) throw new Error("No response from AI");

        // Extract HTML from markdown code block if present
        const match = text.match(/```html([\s\S]*?)```/);
        return match ? match[1].trim() : text;

    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
};
