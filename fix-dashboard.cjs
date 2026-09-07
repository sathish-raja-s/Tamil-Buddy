const fs = require('fs');

let content = fs.readFileSync('src/pages/ParentDashboard.tsx', 'utf-8');

const newStatCard = `
        <StatCard icon={<Music className="text-blue-500" />} title="Rhymes & Heritage" value={progress.completedRhymes.length.toString()} subtitle="Songs & Literature" />
`;

content = content.replace(/<StatCard icon=\{<Music className="text-blue-500" \/>\} title="Rhymes Learned" value=\{progress\.completedRhymes\.length\.toString\(\)\} subtitle="Sing-along rhymes" \/>/, newStatCard.trim());

fs.writeFileSync('src/pages/ParentDashboard.tsx', content);
