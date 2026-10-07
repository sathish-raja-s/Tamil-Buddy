import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Settings, LogOut, User as UserIcon, Activity, ClipboardCheck, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { ThemeToggle } from '../common/ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import { useNetwork } from '../../context/NetworkContext';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logOut } = useAuth();
  const { isOnline, isLowBandwidth } = useNetwork();

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
    { name: 'Validation', path: '/validation' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-panel mx-4 mt-4 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
            <span className="text-white font-tamil font-bold text-2xl">அ</span>
          </div>
          <span className="font-bold text-xl text-slate-800 dark:text-white tracking-tight">
            தமிழ் <span className="text-purple-600">Buddy</span>
          </span>
        </Link>

        {/* Network & Low-Bandwidth indicators */}
        {!isOnline && (
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 dark:bg-amber-900/50 dark:text-amber-300 px-2.5 py-0.5 rounded-md">
            <WifiOff size={12} /> Offline Mode
          </span>
        )}
        {isLowBandwidth && isOnline && (
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-100 dark:bg-indigo-900/50 dark:text-indigo-300 px-2.5 py-0.5 rounded-md">
            📶 Low Data Mode Active
          </span>
        )}
      </div>

      {/* Desktop Nav */}
      <div className="hidden lg:flex items-center gap-1 bg-white/50 dark:bg-slate-800/50 px-2 py-1 rounded-full border border-white/60 dark:border-slate-700/60">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={cn(
              'px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 whitespace-nowrap',
              isActive(link.path)
                ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-md shadow-purple-900/5'
                : 'text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-white/40 dark:hover:bg-slate-700/50'
            )}
          >
            {link.name}
          </Link>
        ))}
      </div>

      <div className="hidden md:flex items-center gap-2">
        <ThemeToggle variant="icon" />

        {/* Telemetry / Performance link */}
        <Link
          to="/performance"
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-white/60 dark:hover:bg-slate-700/50 rounded-full transition-colors"
          title="System Performance Telemetry"
        >
          <Activity size={18} />
        </Link>

        {/* Parent / Teacher Dashboard */}
        <Link
          to="/parent"
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-white/60 dark:hover:bg-slate-700/50 rounded-full transition-colors"
          title="Parent/Teacher Dashboard"
        >
          <Settings size={18} />
        </Link>

        {/* User Auth */}
        {user ? (
          <div className="flex items-center gap-2 ml-1">
            <span className="hidden xl:inline-block text-xs font-medium text-slate-700 dark:text-slate-300">
              {user.displayName?.split(' ')[0]}
            </span>
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-8 h-8 rounded-full border-2 border-purple-200"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center border-2 border-purple-200">
                <UserIcon size={14} />
              </div>
            )}
            <button
              onClick={async () => {
                await logOut();
                navigate('/login');
              }}
              className="p-2 text-slate-500 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              title="Log Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="px-3.5 py-1.5 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-full font-bold text-xs hover:bg-purple-200 transition-colors"
          >
            Sign In
          </Link>
        )}

        <Link
          to="/learn"
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2 rounded-full font-bold text-xs shadow-3d hover:shadow-3d-hover active:shadow-3d-active transition-all transform hover:-translate-y-0.5 whitespace-nowrap"
        >
          Start Learning 🚀
        </Link>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        className="lg:hidden p-2 text-slate-600 dark:text-slate-300 bg-white/50 dark:bg-slate-800/50 rounded-full"
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
            className="absolute top-20 left-0 right-0 glass-panel p-4 flex flex-col gap-2 lg:hidden max-h-[85vh] overflow-y-auto"
          >
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'px-4 py-2.5 rounded-2xl text-sm font-bold text-center transition-colors',
                    isActive(link.path)
                      ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="h-px bg-slate-200 dark:bg-slate-700 my-2" />

            <div className="flex justify-between items-center px-2">
              <Link
                to="/performance"
                onClick={() => setIsOpen(false)}
                className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
              >
                <Activity size={14} /> System Telemetry
              </Link>
              <Link
                to="/parent"
                onClick={() => setIsOpen(false)}
                className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:underline"
              >
                Parent Dashboard
              </Link>
            </div>

            <div className="h-px bg-slate-200 dark:bg-slate-700 my-2" />

            {user ? (
              <button
                onClick={async () => {
                  await logOut();
                  setIsOpen(false);
                  navigate('/login');
                }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
              >
                <LogOut size={18} /> Sign Out
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 transition-colors"
              >
                Sign In
              </Link>
            )}

            <ThemeToggle variant="labeled" onClick={() => setIsOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
