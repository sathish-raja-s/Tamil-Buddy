import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background blobs for depth */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/50 rounded-full blur-3xl" />
        <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-blue-200/50 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-indigo-200/50 rounded-full blur-3xl" />
      </div>

      <Navbar />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 flex flex-col">
        <Outlet />
      </main>

      <footer className="mt-auto py-6 text-center text-slate-500 font-medium text-sm">
        <p>Built with ❤️ for kids to learn Tamil.</p>
      </footer>
    </div>
  );
}
