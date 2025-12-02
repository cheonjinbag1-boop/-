
export const BASE_HTML_TEMPLATE = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI 생성 수학 문제 풀이</title>
    <!-- Removed polyfill.io due to security/stability issues -->
    <script type="text/javascript" id="MathJax-script" async
      src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js">
    </script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap');
        :root{--primary-color:#16a085;--secondary-color:#117a65;--highlight-bg:#e8f8f5;--box-shadow:0 6px 12px rgba(0,0,0,0.1);--border-radius:8px;--transition-speed:1s;--emphasis-color:#1abc9c;}
        html,body{margin:0;padding:0;overflow:hidden;background-color:#1a1a1a;font-family:'Noto Sans KR',sans-serif;color:#333;}
        .aspect-ratio-wrapper{position:absolute;top:50%;left:50%;width:100vw;height:56.25vw;max-height:100vh;max-width:177.78vh;transform:translate(-50%,-50%);}
        .presentation-container{position:relative;width:100%;height:100%;background-color:#f8f9fa;perspective:2000px;}
        .slide{position:absolute;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;transform-style:preserve-3d;backface-visibility:hidden;transition:transform var(--transition-speed) ease-in-out;padding:2.5%;box-sizing:border-box;overflow:hidden;transform:rotateY(180deg);}
        .slide.active{transform:rotateY(0deg);z-index:2;}
        .slide.flipped{transform:rotateY(-180deg);z-index:1;}
        .container{width:100%;height:100%;background-color:#fff;padding:3% 5%;border-radius:var(--border-radius);box-shadow:0 4px 8px rgba(0,0,0,0.05);overflow-y:auto;position:relative;font-size:1.4vw;line-height:1.7;display:flex;flex-direction:column;}
        h1,h2,h3{color:#2c3e50;font-weight:700;transition:all 0.2s ease-in-out;}
        h1{font-size:2em;border-bottom:2px solid var(--primary-color);padding-bottom:10px;margin-top:0;}
        h2{font-size:1.6em;border-bottom:1px solid #e0e0e0;padding-bottom:8px;margin-top:1em;}
        h1:hover,h2:hover{transform:scale(1.02);color:var(--primary-color);}
        #progress-bar{position:fixed;top:0;left:0;height:5px;background-color:var(--primary-color);width:0%;transition:width .3s ease-out;z-index:10;}
        .navigation{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);display:flex;gap:20px;z-index:20;padding:10px;align-items:center;background:rgba(255,255,255,0.8);border-radius:50px;box-shadow:var(--box-shadow);}
        .nav-button{background-color:var(--secondary-color);color:#fff;border:none;width:50px;height:50px;border-radius:50%;cursor:pointer;font-size:20px;display:flex;align-items:center;justify-content:center;opacity:.8;transition:all .3s ease-in-out;}
        .nav-button:not(:disabled):hover{background-color:var(--primary-color);transform:scale(1.1);opacity:1;}
        .nav-button:disabled{cursor:not-allowed;opacity:.3 !important;}
        .context-button{background-color:var(--primary-color);color:#fff;border:none;padding:10px 20px;border-radius:50px;cursor:pointer;transition:background-color .3s;font-size:18px;}
        .context-button:hover:not(:disabled){background-color:var(--secondary-color);}
        .context-button:disabled{background-color:#ccc;cursor:not-allowed;}
        .keyword-emphasis{position:relative;display:inline-block;font-weight:700;color:var(--emphasis-color);transition:all .2s ease-in-out;margin:0 2px;padding:0 3px;border-radius:3px;cursor:pointer;}
        .keyword-emphasis:hover{color:#fff;background-color:var(--emphasis-color);transform:scale(1.15) translateY(-2px);box-shadow:0 4px 12px rgba(0,0,0,0.2);z-index:5;}
        mjx-container{display:inline-block;transition:all .2s ease-in-out;cursor:pointer;}
        mjx-container:hover{transform:scale(1.1);text-shadow:0 0 8px var(--primary-color);}
        .highlight-box{background-color:#e8f8f5;border-left:5px solid var(--primary-color);padding:15px 20px;margin:20px 0;border-radius:0 var(--border-radius) var(--border-radius) 0;box-shadow:var(--box-shadow);}
        .problem-box{background-color:#f8f9fa;border:1px solid #dee2e6;border-radius:8px;padding:25px;margin:20px 0;}
        .problem-number{font-size:2.5em;font-weight:700;color:var(--primary-color);text-align:center;}
        .final-answer{background-color:#d1e7dd;border:1px solid #a3cfbb;border-radius:5px;padding:15px;font-size:1.5em;text-align:center;margin-top:20px;font-weight:700;}
        .equation-block{background-color:#f8f9fa;padding:15px;border-radius:var(--border-radius);border:1px solid #dee2e6;margin:1em 0;text-align:center;transition:transform .2s ease-in-out,box-shadow .2s ease-in-out;cursor:pointer;}
        .equation-block:hover{transform:scale(1.03);box-shadow:var(--box-shadow);}
        .reveal-item{opacity:0;transform:translateY(20px);transition:opacity .5s ease,transform .5s ease;}
        .reveal-item.visible{opacity:1;transform:translateY(0);}
        .fifo-container{position:relative;flex-grow:1;min-height:50%;margin-top:1em;overflow:hidden;}
        .fifo-container .reveal-item{position:absolute;top:50%;left:50%;width:95%;transform:translate(-50%,-50%) translateY(150px) scale(0.9);opacity:0;transition:transform 0.6s ease-in-out,opacity 0.6s ease-in-out;}
        .fifo-container .reveal-item.fifo-active{transform:translate(-50%,-50%) translateY(0) scale(1);opacity:1;}
        .fifo-container .reveal-item.fifo-past{transform:translate(-50%,-50%) translateY(-150px) scale(0.9);opacity:0;}
    </style>
</head>
<body>
    <div id="progress-bar"></div>
    <div class="aspect-ratio-wrapper">
        <div class="presentation-container">
            <!-- SLIDES_PLACEHOLDER -->
        </div>
    </div>
    <div class="navigation">
         <button id="prev-btn" class="nav-button" disabled>&#10094;</button>
         <button id="reveal-btn" class="context-button" style="display:none;">다음</button>
         <button id="next-btn" class="nav-button">&#10095;</button>
    </div>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const container = document.querySelector('.presentation-container');
            const slides = Array.from(container.querySelectorAll('.slide'));
            const prevBtn = document.getElementById('prev-btn');
            const nextBtn = document.getElementById('next-btn');
            const progressBar = document.getElementById('progress-bar');
            const revealBtn = document.getElementById('reveal-btn');
            
            let currentSlide = 0;
            let revealItems = [];
            let revealedCount = 0;
            let isFifoSlide = false;
            let fifoItems = [];
            let fifoIndex = 0;
            let isAnimating = false;

            function showSlide(newIndex) {
                if (isAnimating || newIndex === currentSlide) return;
                isAnimating = true;
                
                const oldIndex = currentSlide;
                const oldSlide = slides[oldIndex];
                const newSlide = slides[newIndex];

                // Determine direction and apply 3D flip effect
                if (newIndex > oldIndex) {
                    oldSlide.style.transformOrigin = '100% 50%';
                    oldSlide.style.zIndex = slides.length - oldIndex;
                    newSlide.style.zIndex = slides.length - newIndex;
                    oldSlide.classList.remove('active');
                    oldSlide.classList.add('flipped');
                    newSlide.classList.add('active');
                    newSlide.classList.remove('flipped');
                } else {
                    newSlide.style.transformOrigin = '100% 50%';
                    newSlide.style.zIndex = slides.length - newIndex;
                    oldSlide.style.zIndex = slides.length - oldIndex;
                    oldSlide.classList.remove('active');
                    oldSlide.classList.add('flipped');
                    newSlide.classList.remove('flipped');
                    newSlide.classList.add('active');
                }

                currentSlide = newIndex;
                
                // Reset animation flag after transition
                const transitionSpeed = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--transition-speed')) * 1000;
                setTimeout(() => { isAnimating = false; }, transitionSpeed);

                // Update progress bar
                const progress = ((currentSlide + 1) / slides.length) * 100;
                progressBar.style.width = \`\${progress}%\`;

                // Update navigation buttons
                prevBtn.disabled = currentSlide === 0;
                nextBtn.disabled = currentSlide === slides.length - 1;

                // Handle reveal items for the new slide
                const activeSlide = slides[currentSlide];
                const fifoContainer = activeSlide.querySelector('.fifo-container');

                if (fifoContainer) {
                    isFifoSlide = true;
                    fifoItems = fifoContainer.querySelectorAll('.reveal-item');
                    fifoIndex = -1;
                    fifoItems.forEach(item => {
                        item.classList.remove('fifo-active', 'fifo-past', 'visible');
                    });
                    revealBtn.style.display = 'inline-block';
                    revealBtn.disabled = false;
                    revealBtn.textContent = \`다음 (0/\${fifoItems.length})\`;
                } else {
                    isFifoSlide = false;
                    revealItems = activeSlide.querySelectorAll('.reveal-item');
                    revealedCount = 0;
                    revealItems.forEach(item => item.classList.remove('visible'));
                    
                    if (revealItems.length > 0) {
                        revealBtn.style.display = 'inline-block';
                        revealBtn.disabled = false;
                        revealBtn.textContent = \`다음 (\${revealedCount}/\${revealItems.length})\`;
                    } else {
                        revealBtn.style.display = 'none';
                    }
                }
            }

            nextBtn.addEventListener('click', () => {
                if (currentSlide < slides.length - 1) showSlide(currentSlide + 1);
            });

            prevBtn.addEventListener('click', () => {
                if (currentSlide > 0) showSlide(currentSlide - 1);
            });

            revealBtn.addEventListener('click', () => {
                if (isFifoSlide) {
                    // FIFO Logic: One item visible at a time
                    if (fifoIndex >= 0 && fifoIndex < fifoItems.length) {
                        fifoItems[fifoIndex].classList.remove('fifo-active');
                        fifoItems[fifoIndex].classList.add('fifo-past');
                    }
                    fifoIndex++;
                    
                    if (fifoIndex < fifoItems.length) {
                        const item = fifoItems[fifoIndex];
                        item.classList.add('fifo-active');
                        if (window.MathJax) MathJax.typesetPromise([item]);
                        revealBtn.textContent = \`다음 (\${fifoIndex + 1}/\${fifoItems.length})\`;
                    }
                    
                    if (fifoIndex >= fifoItems.length - 1) {
                        revealBtn.disabled = true;
                        revealBtn.textContent = '완료';
                    }
                } else {
                    // Standard Reveal Logic: Accumulate items
                    if (revealedCount < revealItems.length) {
                        const item = revealItems[revealedCount];
                        item.classList.add('visible');
                        if (window.MathJax) MathJax.typesetPromise([item]);
                        revealedCount++;
                        revealBtn.textContent = \`다음 (\${revealedCount}/\${revealItems.length})\`;
                    }
                    
                    if (revealedCount >= revealItems.length) {
                        revealBtn.disabled = true;
                        revealBtn.textContent = '완료';
                    }
                }
            });

            // Initial setup
            (function() {
                slides.forEach((slide, i) => {
                    slide.style.zIndex = slides.length - i;
                });
                slides[0].classList.add('active');
                slides[0].classList.remove('flipped');
                
                const progress = ((currentSlide + 1) / slides.length) * 100;
                progressBar.style.width = \`\${progress}%\`;
                
                prevBtn.disabled = currentSlide === 0;
                nextBtn.disabled = currentSlide === slides.length - 1;
                
                const activeSlide = slides[currentSlide];
                const fifoContainer = activeSlide.querySelector('.fifo-container');
                
                if (fifoContainer) {
                    isFifoSlide = true;
                    revealItems = [];
                    fifoItems = fifoContainer.querySelectorAll('.reveal-item');
                    fifoIndex = -1;
                    revealBtn.textContent = \`다음 (0/\${fifoItems.length})\`;
                } else {
                    isFifoSlide = false;
                    fifoItems = [];
                    revealItems = activeSlide.querySelectorAll('.reveal-item');
                    revealedCount = 0;
                    if (revealItems.length > 0) {
                        revealBtn.textContent = \`다음 (0/\${revealItems.length})\`;
                    } else {
                        revealBtn.style.display = 'none';
                    }
                }
            })();
        });
    </script>
</body>
</html>
`;

export const SYSTEM_PROMPT = `
# Persona
당신은 세계 최고의 수학 교육 콘텐츠 개발자이자, 프론트엔드 기술을 활용하여 상호작용적인 학습 경험을 설계하는 전문가입니다. 
당신의 임무는 학생이 제공하는 하나 이상의 수학 문제(텍스트, 이미지, PDF)와 해설을 분석하여, 주어진 HTML 템플릿 구조에 맞춰 완벽한 '인터랙티브 문제 풀이 전략 HTML'을 생성하는 것입니다.

# Task
사용자가 제공하는 수학 문제(들)과 해설을 기반으로, 하나의 완전한 HTML 코드 블록을 생성합니다.
입력에 **여러 문제(예: 1번~5번)**가 포함된 경우, **각 문제별로 슬라이드 세트를 반복 생성**하여 모든 문제의 풀이 전략을 하나의 파일에 담아야 합니다.

# Constraints (엄격 준수)
1. **[절대 규칙] 최종 답을 계산하지 마십시오.** 문제를 끝까지 풀지 마십시오.
2. **[로드맵 집중]** 계산 과정(Arithmetic)이나 최종 정답은 보이지 않게 처리하십시오.
   - 오직 문제 해결을 위한 **'풀이 전략(Roadmap)'**과 **'논리적 설계(Logic)'**에만 집중합니다.
   - 수식을 세우는 과정(Formula Setup)은 보여주되, 이를 계산하여 값을 줄이는 과정은 생략합니다.
   - 당신의 역할은 **최종 답을 구하기 직전의 식(Expression)**을 보여주는 것에서 끝납니다. 
   - 예시: 이차방정식 근의 공식을 대입한 형태 $\frac{-3 \pm \sqrt{3^2 - 4(1)(1)}}{2}$ 까지만 보여주고, 이를 계산한 결과는 보여주지 않습니다.
3. **[다중 문제 처리]** 사용자가 문제 번호 범위(예: 1~10번)를 지정했거나 다수의 문제가 식별되는 경우:
   - **문제 1**에 대한 전체 슬라이드 세트 생성 -> **간지(구분 슬라이드)** -> **문제 2**에 대한 전체 슬라이드 세트 생성 -> ... 순서로 이어집니다.
   - 모든 문제는 하나의 HTML 파일 내에 연속된 슬라이드로 구성되어야 합니다.

# Slide Structure (각 문제마다 반복)
1. **문제 분석 및 목표 (Slide 1):** 
   - 문제 원본(텍스트/이미지 내용) 제시.
   - 무엇을 구해야 하는지(Goal)와 주어진 조건(Given)을 명확히 정리.
2. **핵심 개념 (Slide 2):** 
   - 이 문제를 푸는 데 필요한 핵심 수학 공식이나 정리(Theorem) 2~3가지 소개.
3. **풀이 전략 로드맵 (Slide 3):** 
   - 문제 해결 전체 흐름을 3~4단계로 요약하여 시각화. (계산 과정이 아닌 전략적 단계).
4. **단계별 상세 전략 (Slide 4 ~ N):** 
   - 로드맵의 각 단계를 구체화하여 설명.
   - 구체적인 숫자를 대입하여 식을 세우는 과정은 보여줍니다.
   - 하지만 **계산 과정은 생략**합니다.
   - **마지막 슬라이드**에서는 최종 답을 계산하기 위한 **완성된 식**만 보여주고 마무리합니다.
5. **추가 분석 (Optional):** 
   - 출제자의 의도, 자주 범하는 실수 등 교육적 가치 제공.

# Output Format
- 제공된 HTML 템플릿의 \`<!-- SLIDES_PLACEHOLDER -->\` 영역에 들어갈 **전체 HTML 코드**를 출력하십시오.
- \`<div class="presentation-container">\` 태그 내부 뿐만 아니라, \`<html>...</html>\` 전체를 포함해야 합니다.
- 단, script와 style 태그 내부는 원본 템플릿의 내용을 그대로 유지하십시오.
- 응답은 \`\`\`html 로 시작하고 \`\`\` 로 끝내십시오.
`;
