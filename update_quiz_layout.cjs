const fs = require('fs');
let code = fs.readFileSync('src/features/quiz/QuizPage.tsx', 'utf8');

const target1 = `{/* Entertaining & Gamified Options */}
          <div className="space-y-4 mb-10">
            {question.options.map((opt, index) => {`;

const replacement1 = `{/* Entertaining & Gamified Options with Side Navigation */}
          <div className="flex items-center gap-4 md:gap-6 mb-10 relative">
            {/* Left Button */}
            <button 
              onClick={handlePrev} 
              disabled={currentIdx === 0}
              className={\`hidden md:flex w-14 h-14 rounded-full items-center justify-center shrink-0 transition-all duration-300 \${currentIdx === 0 ? 'opacity-30 cursor-not-allowed bg-white/5 text-gray-500' : 'bg-white/10 hover:bg-white/20 text-white shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:scale-110'}\`}
            >
              <ArrowLeft size={24} />
            </button>

            {/* Options */}
            <div className="flex-1 space-y-4">
            {question.options.map((opt, index) => {`;

const target2 = `                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Explanation */}`;

const replacement2 = `                  </span>
                </motion.button>
              );
            })}
            </div>

            {/* Right Button */}
            <button 
              onClick={handleNext} 
              disabled={!selectedOptionId && currentIdx + 1 < activeQuestions.length}
              className={\`hidden md:flex w-14 h-14 rounded-full items-center justify-center shrink-0 transition-all duration-300 \${!selectedOptionId ? 'bg-white/5 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-tr from-blue-500 to-indigo-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.8)] hover:scale-110'}\`}
            >
              <ArrowRight size={24} />
            </button>
          </div>

          {/* Explanation */}`;

const target3 = `{/* Interactive Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-black/40 backdrop-blur-2xl border-t border-white/10 flex items-center justify-between z-50">
        <div className="max-w-3xl w-full mx-auto flex items-center justify-between gap-4">
          <Button 
            variant="ghost" 
            size="lg" 
            onClick={handlePrev} 
            disabled={currentIdx === 0}
            className={\`font-bold \${currentIdx === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10 hover:text-white text-gray-300'}\`}
          >
            <ArrowLeft size={20} className="mr-2" /> Back
          </Button>

          <Button 
            variant="primary" 
            size="lg" 
            onClick={handleNext} 
            className={\`font-extrabold shadow-lg px-8 py-3 rounded-full transition-all duration-300 \${!selectedOptionId ? 'opacity-80 hover:opacity-100 bg-white/10 text-white' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] scale-105'}\`}
          >
            {currentIdx + 1 >= activeQuestions.length ? 'View Results' : 'Next Question'}
            <ArrowRight size={20} className="ml-2" />
          </Button>
        </div>
      </div>`;

// Wait, the Next Question button for results also needs to be handled.
// The side button can just do handleNext, which goes to results if it's the last question.
// I'll replace target3 with mobile-only navigation, so it's not completely broken on small screens.
const replacement3 = `{/* Mobile Navigation (Visible only on small screens) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-black/40 backdrop-blur-2xl border-t border-white/10 flex items-center justify-between z-50">
        <div className="w-full mx-auto flex items-center justify-between gap-2">
          <button 
            onClick={handlePrev} 
            disabled={currentIdx === 0}
            className={\`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 \${currentIdx === 0 ? 'opacity-30 cursor-not-allowed bg-white/5 text-gray-500' : 'bg-white/10 hover:bg-white/20 text-white shadow-lg'}\`}
          >
            <ArrowLeft size={20} />
          </button>
          
          <button 
            onClick={handleNext} 
            disabled={!selectedOptionId && currentIdx + 1 < activeQuestions.length}
            className={\`px-6 py-3 rounded-full flex-1 font-bold text-center transition-all duration-300 \${!selectedOptionId ? 'bg-white/5 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-tr from-blue-500 to-indigo-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]'}\`}
          >
            {currentIdx + 1 >= activeQuestions.length ? 'View Results' : 'Next Question'}
          </button>
        </div>
      </div>`;

code = code.replace(target1, replacement1);
code = code.replace(target2, replacement2);
code = code.replace(target3, replacement3);

fs.writeFileSync('src/features/quiz/QuizPage.tsx', code);
console.log("Successfully updated layout!");
