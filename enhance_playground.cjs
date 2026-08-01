const fs = require('fs');
let code = fs.readFileSync('src/features/coding/CodingPage.tsx', 'utf8');

// 1. Add relative z-10 to the max-w container to put it above the localized background
code = code.replace(
  'className="absolute inset-0 p-6 md:p-10 overflow-y-auto"',
  'className="absolute inset-0 p-6 md:p-10 overflow-y-auto relative"'
);

code = code.replace(
  '<div className="max-w-[1200px] mx-auto space-y-6">',
  `<div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none z-0" />
            <div className="absolute -top-[200px] -right-[100px] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0" />
            <div className="absolute top-[20%] -left-[100px] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none z-0" />
            <div className="max-w-[1200px] mx-auto space-y-6 relative z-10">`
);

// 2. Enhance Header with Stats Cards
const headerTarget = `<div className="flex flex-col gap-1.5 pb-2">
                <TypewriterHeading text="Coding Playground" />
                <p className="text-gray-400 text-sm max-w-xl">
                  Master key algorithm techniques and data structures. Solve challenges and track your progress in real-time.
                </p>
              </div>`;

const headerReplacement = `<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4">
                <div className="flex flex-col gap-2">
                  <TypewriterHeading text="Coding Playground" />
                  <p className="text-gray-400 text-sm max-w-xl">
                    Master key algorithm techniques and data structures. Solve challenges and track your progress in real-time.
                  </p>
                </div>
                
                {/* Mini Stat Cards */}
                <div className="flex gap-4">
                  <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center min-w-[120px] hover:border-blue-500/30 hover:bg-white/5 transition-all">
                    <span className="text-blue-400 text-2xl font-bold">{completedProblems.size}</span>
                    <span className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider mt-1">Solved</span>
                  </div>
                  <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center min-w-[120px] hover:border-purple-500/30 hover:bg-white/5 transition-all">
                    <span className="text-purple-400 text-2xl font-bold">{problems.length}</span>
                    <span className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider mt-1">Total</span>
                  </div>
                </div>
              </div>`;

code = code.replace(headerTarget, headerReplacement);

// 3. Enhance search bar focus state
code = code.replace(
  'focus:bg-black/50 focus:border-white/30',
  'focus:bg-black/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 focus:shadow-[0_0_15px_rgba(59,130,246,0.2)]'
);

// 4. Enhance problem list rows (lines ~438)
const rowTarget = 'className="grid grid-cols-[30px_1fr_100px_90px] items-center px-4 py-3 bg-black/30 backdrop-blur-md border border-white/5 hover:bg-white/10 hover:border-white/20 rounded-lg cursor-pointer transition-all duration-150 group"';
const rowReplacement = 'className="grid grid-cols-[30px_1fr_100px_90px] items-center px-4 py-3 bg-black/40 backdrop-blur-md border border-white/5 hover:bg-gradient-to-r hover:from-white/5 hover:to-transparent hover:border-l-blue-500 hover:border-white/20 rounded-lg cursor-pointer transition-all duration-200 group hover:shadow-[0_0_20px_rgba(0,0,0,0.5)] transform hover:-translate-y-[1px]"';

code = code.replace(rowTarget, rowReplacement);

fs.writeFileSync('src/features/coding/CodingPage.tsx', code);
console.log("Done upgrading aesthetics.");
