const fs = require('fs');
let code = fs.readFileSync('src/components/layout/Navbar.tsx', 'utf-8');

if (!code.includes('useAuth')) {
  code = code.replace(
    "import { Moon, Sun, Menu, X, BookOpen, Gamepad2, PenTool, LayoutDashboard, MessageSquare } from 'lucide-react';",
    "import { Moon, Sun, Menu, X, BookOpen, Gamepad2, PenTool, LayoutDashboard, MessageSquare, LogIn, LogOut, User as UserIcon } from 'lucide-react';\nimport { useAuth } from '../../context/AuthContext';"
  );

  code = code.replace(
    "const { theme, toggleTheme } = useTheme();",
    "const { theme, toggleTheme } = useTheme();\n  const { user, signIn, logOut } = useAuth();"
  );
  
  const authUI = `
          {/* User Auth */}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block text-sm font-medium text-slate-700 dark:text-slate-300">
                {user.displayName?.split(' ')[0]}
              </span>
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border-2 border-purple-200" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center border-2 border-purple-200"><UserIcon size={16}/></div>
              )}
              <button onClick={logOut} className="p-2 text-slate-500 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors" title="Log Out">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button 
              onClick={signIn}
              className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-full font-bold hover:bg-purple-200 dark:hover:bg-purple-800/60 transition-colors"
            >
              <LogIn size={18} /> <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

          {/* Theme Toggle */}
  `;
  
  code = code.replace(
    "{/* Theme Toggle */}",
    authUI.trim()
  );
  
  fs.writeFileSync('src/components/layout/Navbar.tsx', code);
}
