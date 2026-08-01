const fs = require('fs');
let c = fs.readFileSync('src/features/coding/CodingWorkspace.tsx', 'utf8');
c = c.replace(/bg-\[#1e1e1e\]/gi, 'bg-black/20 backdrop-blur-sm');
c = c.replace(/bg-\[#(1E1E22|282828|262626|323232)\]/gi, 'bg-white/5');
c = c.replace(/bg-\[#(333333|3A3A3A|4A4A4A|2C2C32)\]/gi, 'bg-white/10');
c = c.replace(/bg-\[#2D2D2D\]/gi, 'bg-black/40 backdrop-blur-md');
fs.writeFileSync('src/features/coding/CodingWorkspace.tsx', c);
console.log('done');
