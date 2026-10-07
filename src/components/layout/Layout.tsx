import React, { useEffect, useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Navbar } from './Navbar';
import { useProgress } from '../../hooks/useProgress';
import { audioService, AudioStatusInfo } from '../../services/audioService';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Volume2, AlertCircle } from 'lucide-react';

export function Layout() {
  const { recordActivityTime } = useProgress();
  const [audioStatus, setAudioStatus] = useState<AudioStatusInfo>({ state: 'idle' });
  const { isInstallable, install } = usePWAInstall();

  useEffect(() => {
    // Record learning time every minute
    const interval = setInterval(() => {
      recordActivityTime(1);
    }, 60000);
    return () => clearInterval(interval);
  }, [recordActivityTime]);

  useEffect(() => {
    const unsub = audioService.subscribe((status) => {
      setAudioStatus(status);
    });
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-slate-50/50 dark:bg-slate-900">
      {/* Background blobs for depth */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/40 dark:bg-purple-950/20 rounded-full blur-3xl" />
        <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-blue-200/40 dark:bg-blue-950/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-indigo-200/40 dark:bg-indigo-950/20 rounded-full blur-3xl" />
      </div>

      <Navbar />

      {/* Floating Audio State Banner when Loading / Retrying / Failed */}
      {(audioStatus.state === 'loading' ||
        audioStatus.state === 'retrying' ||
        audioStatus.state === 'failed') &&
        audioStatus.message && (
          <div
            role="status"
            aria-live="polite"
            className="fixed top-24 right-6 z-40 px-4 py-2 rounded-xl text-xs font-semibold shadow-md flex items-center gap-2 animate-in fade-in transition bg-white/95 dark:bg-slate-800/95 border border-purple-200 dark:border-purple-800 text-slate-700 dark:text-slate-200"
          >
            {audioStatus.state === 'failed' ? (
              <AlertCircle size={14} className="text-amber-500 shrink-0" />
            ) : (
              <Volume2 size={14} className="text-purple-600 animate-pulse shrink-0" />
            )}
            <span>{audioStatus.message}</span>
          </div>
        )}

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 flex flex-col">
        <Outlet />
      </main>

      <footer className="mt-auto py-6 px-6 border-t border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
        <p>© 2026 Tamil Buddy · Interactive AI Learning Platform for Kids</p>

        <div className="flex items-center gap-4">
          {isInstallable && (
            <button
              onClick={install}
              className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-bold hover:underline"
            >
              <Download size={14} /> Install App
            </button>
          )}
          <Link to="/validation" className="hover:text-slate-800 dark:hover:text-slate-300 transition">
            User Validation
          </Link>
          <span aria-hidden="true">·</span>
          <Link to="/performance" className="hover:text-slate-800 dark:hover:text-slate-300 transition">
            System Telemetry
          </Link>
          <span aria-hidden="true">·</span>
          <Link to="/parent" className="hover:text-slate-800 dark:hover:text-slate-300 transition">
            Teacher Area
          </Link>
        </div>
      </footer>
    </div>
  );
}
