const fs = require('fs');
let code = fs.readFileSync('src/components/layout/Navbar.tsx', 'utf-8');

const updatedNavLinks = `
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
    { name: 'Pad ✍️', path: '/pad' },
  ];
`;

code = code.replace(/const navLinks = \[[\s\S]*?\];/, updatedNavLinks.trim());
fs.writeFileSync('src/components/layout/Navbar.tsx', code);
