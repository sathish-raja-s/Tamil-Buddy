import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Settings, LogOut, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { ThemeToggle } from '../common/ThemeToggle';
import { useAuth } from '../../context/AuthContext';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logOut } = useAuth();

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

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-panel mx-4 mt-4 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
          <span className="text-white font-tamil font-bold text-2xl">அ</span>
        </div>
        <span className="font-bold text-xl text-slate-800 dark:text-white tracking-tight">
          தமிழ் <span className="text-purple-600">Buddy</span>
        </span>
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-1 bg-white/50 dark:bg-slate-800/50 px-2 py-1 rounded-full border border-white/60 dark:border-slate-700/60">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300",
              isActive(link.path) 
                ? "bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-md shadow-purple-900/5" 
                : "text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-white/40 dark:hover:bg-slate-700/50"
            )}
          >
            {link.name}
          </Link>
        ))}
      </div>

      <div className="hidden md:flex items-center gap-3">
        <ThemeToggle variant="icon" />
        
        {/* User Auth */}
        {user ? (
          <div className="flex items-center gap-3 ml-2">
            <span className="hidden lg:inline-block text-sm font-medium text-slate-700 dark:text-slate-300">
              {user.displayName?.split(' ')[0]}
            </span>
            {user.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border-2 border-purple-200" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center border-2 border-purple-200"><UserIcon size={16}/></div>
            )}
            <button onClick={async () => { await logOut(); navigate('/login'); }} className="p-2 text-slate-500 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors" title="Log Out">
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <Link 
            to="/login"
            className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-full font-bold hover:bg-purple-200 dark:hover:bg-purple-800/60 transition-colors"
          >
            Sign In
          </Link>
        )}

        <Link 
           to="/parent" 
           className="p-2 text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-white/60 dark:hover:bg-slate-700/50 rounded-full transition-colors"
          title="Parent/Teacher Dashboard"
        >
          <Settings size={20} />
        </Link>
        <Link 
           to="/learn" 
           className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2.5 rounded-full font-bold shadow-3d hover:shadow-3d-hover active:shadow-3d-active transition-all transform hover:-translate-y-0.5"
        >
          Start Learning 🚀
        </Link>
      </div>

      {/* Mobile Menu Toggle */}
      <button 
        className="md:hidden p-2 text-slate-600 dark:text-slate-300 bg-white/50 dark:bg-slate-800/50 rounded-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-20 left-0 right-0 glass-panel p-4 flex flex-col gap-2 md:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "px-4 py-3 rounded-2xl text-base font-bold text-center transition-colors",
                  isActive(link.path) 
                    ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300" 
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                )}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="h-px bg-slate-200 dark:bg-slate-700 my-2" />
            
            {user ? (
              <button
                onClick={async () => { await logOut(); setIsOpen(false); navigate('/login'); }}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-base font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
              >
                <LogOut size={20} /> Sign Out
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-base font-bold bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 transition-colors"
              >
                Sign In
              </Link>
            )}

            <ThemeToggle variant="labeled" onClick={() => setIsOpen(false)} />

            <Link 
               to="/parent"
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 rounded-2xl text-base font-bold text-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              Parent/Teacher Area
            </Link>
            
            <Link 
               to="/learn"
              onClick={() => setIsOpen(false)}
              className="bg-purple-600 text-white px-4 py-3 rounded-2xl text-base font-bold text-center mt-2 shadow-lg"
            >
              Start Learning 🚀
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
