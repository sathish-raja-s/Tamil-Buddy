const fs = require('fs');

let content = fs.readFileSync('src/components/layout/Navbar.tsx', 'utf-8');

const newNavLinks = `
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Learn', path: '/learn' },
    { name: 'Games', path: '/games' },
    { name: 'Stories', path: '/stories' },
    { name: 'Rhymes', path: '/rhymes' },
    { name: 'Heritage', path: '/heritage' },
    { name: 'Adventure', path: '/adventure' },
    { name: 'Progress', path: '/progress' },
    { name: 'Chat', path: '/chat' },
  ];
`;

content = content.replace(/const navLinks = \[[\s\S]*?\];/, newNavLinks.trim());

fs.writeFileSync('src/components/layout/Navbar.tsx', content);
