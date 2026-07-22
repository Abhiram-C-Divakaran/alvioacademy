const fs = require('fs');
let content = fs.readFileSync('src/features/profile/ProfilePage.tsx', 'utf-8');
content = content.replace('Flame,', 'Flame,\n  CheckCircle2,');
fs.writeFileSync('src/features/profile/ProfilePage.tsx', content);
