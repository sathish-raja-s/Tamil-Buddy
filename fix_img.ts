import fs from 'fs';

let navbar = fs.readFileSync('src/components/layout/Navbar.tsx', 'utf8');
navbar = navbar.replace('<img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border-2 border-purple-200" />', '<img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border-2 border-purple-200" referrerPolicy="no-referrer" />');
fs.writeFileSync('src/components/layout/Navbar.tsx', navbar);

let login = fs.readFileSync('src/pages/Login.tsx', 'utf8');
login = login.replace('<img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />', '<img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" referrerPolicy="no-referrer" />');
fs.writeFileSync('src/pages/Login.tsx', login);
