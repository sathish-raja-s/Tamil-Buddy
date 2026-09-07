const fs = require('fs');
let code = fs.readFileSync('src/components/layout/Navbar.tsx', 'utf-8');

// Ensure import ThemeToggle
if (!code.includes("import { ThemeToggle } from")) {
  code = "import { ThemeToggle } from '../common/ThemeToggle';\n" + code;
}

// Ensure useTheme isn't strictly necessary if it's not used, but let's just leave it if it's there.

// Replace Desktop Nav parent link area
code = code.replace(
  /<Link \n           to="\/parent" \n           className="p-2 text-slate-500 hover:text-purple-600 hover:bg-white\/60 rounded-full transition-colors"/,
  '<ThemeToggle variant="icon" />\n        <Link \n           to="/parent" \n           className="p-2 text-slate-500 hover:text-purple-600 hover:bg-white/60 dark:text-slate-400 dark:hover:text-purple-400 dark:hover:bg-slate-700/50 rounded-full transition-colors"'
);

// Replace Mobile Nav parent link area
code = code.replace(
  /<Link \n               to="\/parent"\n              onClick=\{/,
  '<ThemeToggle variant="labeled" onClick={() => setIsOpen(false)} />\n            <Link \n               to="/parent"\n              onClick=\{'
);

fs.writeFileSync('src/components/layout/Navbar.tsx', code);
