const fs = require('fs');
let c = fs.readFileSync('src/features/coding/CodingPage.tsx', 'utf8');

// Search Bar
c = c.replace(/bg-\[#262626\] text-gray-200 border-0 rounded-full pl-10 pr-4 py-2 text-sm placeholder-gray-500 outline-none focus:bg-\[#333333\]/g, 'bg-black/30 backdrop-blur-md border border-white/10 text-gray-200 rounded-full pl-10 pr-4 py-2 text-sm placeholder-gray-500 outline-none focus:bg-black/50 focus:border-white/30');

// Sort Button
c = c.replace(/'bg-\[#333333\] border-gray-600 text-gray-200' : 'bg-\[#262626\] border-gray-800 text-gray-400 hover:text-gray-200'/g, "'bg-white/10 backdrop-blur-md border-white/30 text-gray-200' : 'bg-black/30 backdrop-blur-md border-white/10 text-gray-400 hover:text-gray-200 hover:bg-white/5'");

// Filter Button
c = c.replace(/'bg-\[#333333\] border-gray-600 text-gray-200' \n\s*: 'bg-\[#262626\] border-gray-800 text-gray-400 hover:text-gray-200 hover:border-gray-700'/g, "'bg-white/10 backdrop-blur-md border-white/30 text-gray-200' \n                            : 'bg-black/30 backdrop-blur-md border-white/10 text-gray-400 hover:text-gray-200 hover:bg-white/5'");

// Filter Dropdown
c = c.replace(/bg-\[#262626\] border border-gray-700 rounded-xl shadow-2xl/g, 'bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl');

// Progress Circle background stroke
c = c.replace(/stroke="#333333"/g, 'stroke="rgba(255,255,255,0.1)"');

// Shuffle Button
c = c.replace(/bg-\[#262626\] hover:bg-\[#333333\]/g, 'bg-black/30 backdrop-blur-md border border-white/10 hover:bg-white/10');

// Empty State
c = c.replace(/bg-\[#262626\]\/30 border border-gray-800\/50/g, 'bg-black/20 backdrop-blur-sm border border-white/5');

// Problems List Row
c = c.replace(/bg-\[#262626\] hover:bg-\[#2e2e2e\] border border-gray-800\/40/g, 'bg-black/30 backdrop-blur-md border border-white/5 hover:bg-white/10 hover:border-white/20');

// Also border-gray-800 in the list header
c = c.replace(/border-b border-gray-800"/g, 'border-b border-white/10"');

fs.writeFileSync('src/features/coding/CodingPage.tsx', c);
console.log('done');
