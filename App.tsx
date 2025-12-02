import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { UploadedFile, GenerationRequest } from './types';
import { generateMathContent } from './services/geminiService';
import { BookOpen, Sparkles, Download, RefreshCw, Layers } from 'lucide-react';

function App() {
  const [problemText, setProblemText] = useState('');
  const [problemFiles, setProblemFiles] = useState<UploadedFile[]>([]);
  const [solutionText, setSolutionText] = useState('');
  const [solutionFiles, setSolutionFiles] = useState<UploadedFile[]>([]);
  
  const [startNum, setStartNum] = useState('');
  const [endNum, setEndNum] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!problemText && problemFiles.length === 0) {
      alert("문제를 입력하거나 이미지를 업로드해주세요.");
      return;
    }

    setIsLoading(true);
    setGeneratedHtml(null);

    const request: GenerationRequest = {
      problemText,
      problemFiles,
      solutionText,
      solutionFiles,
      problemSet: {
        startNumber: startNum,
        endNumber: endNum
      }
    };

    try {
      const html = await generateMathContent(request);
      setGeneratedHtml(html);
    } catch (error) {
      console.error(error);
      alert("콘텐츠 생성에 실패했습니다. API 키를 확인하거나 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedHtml) return;
    const blob = new Blob([generatedHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `math-strategy-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">MathSolv <span className="text-indigo-600">Pro</span></h1>
          </div>
          <div className="text-sm text-gray-500 hidden sm:block">
            Powered by Gemini 3.0
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {!generatedHtml ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column: Inputs */}
            <div className="space-y-6">
              
              {/* Problem Metadata */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Layers className="w-5 h-5 text-indigo-500" />
                  <h2 className="text-lg font-semibold text-gray-900">문제 범위 지정 (다중 문제 시)</h2>
                </div>
                <p className="text-sm text-gray-500 mb-4">여러 문제를 한 번에 처리하려면 번호 범위를 입력하세요.</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">시작 번호 (예: 1)</label>
                    <input 
                      type="text" 
                      value={startNum}
                      onChange={(e) => setStartNum(e.target.value)}
                      placeholder="Start #"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">끝 번호 (예: 10)</label>
                    <input 
                      type="text" 
                      value={endNum}
                      onChange={(e) => setEndNum(e.target.value)}
                      placeholder="End #"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Problem Input */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">문제 업로드 (필수)</h2>
                <div className="space-y-4">
                  <textarea
                    value={problemText}
                    onChange={(e) => setProblemText(e.target.value)}
                    placeholder="문제를 텍스트로 직접 입력하거나, 문제 이미지를 아래에 업로드하세요."
                    className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none transition-all"
                  />
                  <FileUpload 
                    label="문제 이미지/PDF 업로드" 
                    files={problemFiles} 
                    onFilesChange={setProblemFiles} 
                  />
                </div>
              </div>

              {/* Solution Input (Optional) */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">해설/정답 (선택사항)</h2>
                  <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded">정확도 향상</span>
                </div>
                <div className="space-y-4">
                   <textarea
                    value={solutionText}
                    onChange={(e) => setSolutionText(e.target.value)}
                    placeholder="해설이나 정답 텍스트를 입력하면 AI가 더 정확한 전략을 생성합니다."
                    className="w-full h-24 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-none transition-all"
                  />
                  <FileUpload 
                    label="해설/답안지 이미지 업로드" 
                    files={solutionFiles} 
                    onFilesChange={setSolutionFiles} 
                  />
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                }`}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-6 h-6 animate-spin" />
                    <span>분석 및 생성 중...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6" />
                    <span>풀이 전략 생성하기</span>
                  </>
                )}
              </button>
            </div>

            {/* Right Column: Instructions/Guide */}
            <div className="hidden lg:block space-y-6">
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6">
                <h3 className="text-lg font-bold text-indigo-900 mb-2">사용 가이드</h3>
                <ul className="space-y-3 text-indigo-800">
                    <li className="flex items-start">
                        <span className="bg-indigo-200 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0">1</span>
                        <span><strong>다중 문제 처리:</strong> 문제집의 여러 페이지를 한 번에 캡처하여 업로드하고, 시작/끝 번호(예: 1~10)를 지정하면 순서대로 풀이 슬라이드가 생성됩니다.</span>
                    </li>
                    <li className="flex items-start">
                        <span className="bg-indigo-200 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0">2</span>
                        <span><strong>붙여넣기 지원:</strong> 캡처한 이미지를 업로드 영역을 클릭한 후 <strong>Ctrl+V</strong>로 빠르게 추가할 수 있습니다.</span>
                    </li>
                    <li className="flex items-start">
                        <span className="bg-indigo-200 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0">3</span>
                        <span><strong>계산 과정 생략:</strong> 이 앱은 최종 정답을 알려주지 않습니다. 학생이 직접 계산하도록 식을 세우는 '전략'과 '로드맵'만 제공합니다.</span>
                    </li>
                     <li className="flex items-start">
                        <span className="bg-indigo-200 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0">4</span>
                        <span><strong>오프라인 활용:</strong> 생성된 HTML 파일은 다운로드하여 인터넷 없이 수업이나 학습 자료로 활용할 수 있습니다.</span>
                    </li>
                </ul>
              </div>

               <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center h-64 opacity-50">
                    <Sparkles className="w-16 h-16 text-gray-300 mb-4" />
                    <p className="text-gray-400 font-medium">결과 화면이 여기에 표시됩니다</p>
               </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-[calc(100vh-140px)]">
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <Sparkles className="w-6 h-6 text-yellow-500 mr-2" />
                    생성 완료
                </h2>
                <div className="flex space-x-3">
                    <button 
                        onClick={() => setGeneratedHtml(null)}
                        className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        뒤로가기
                    </button>
                    <button 
                        onClick={handleDownload}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md flex items-center transition-colors"
                    >
                        <Download className="w-5 h-5 mr-2" />
                        HTML 다운로드
                    </button>
                </div>
             </div>
             
             <div className="flex-grow bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden relative">
                <iframe 
                    title="Preview"
                    srcDoc={generatedHtml}
                    className="w-full h-full border-0"
                />
             </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;