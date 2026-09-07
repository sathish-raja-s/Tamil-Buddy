import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();

  // Redirect to home if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel max-w-md w-full p-8 text-center flex flex-col items-center"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-xl shadow-purple-500/30 mb-6 transform rotate-3">
          <span className="text-white font-tamil font-bold text-5xl">அ</span>
        </div>
        
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 tracking-tight">
          Welcome to Tamil <span className="text-purple-600">Buddy</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mb-8 font-medium">
          Sign in to save your progress, unlock special badges, and continue your Tamil learning adventure!
        </p>

        <button 
          onClick={signIn}
          className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-800 text-slate-800 dark:text-white border-2 border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 px-6 py-4 rounded-2xl font-bold shadow-sm transition-all transform hover:-translate-y-1"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" referrerPolicy="no-referrer" />
          <span>Sign in with Google</span>
        </button>

        <p className="text-sm text-slate-400 dark:text-slate-500 mt-6">
          Your progress will be securely synced to your account.
        </p>
      </motion.div>
    </div>
  );
}
