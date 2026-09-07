import React from 'react';
import { motion } from 'motion/react';
import { audio } from '../lib/audio';
import { Link } from 'react-router-dom';
import { Mascot } from '../components/mascot/Mascot';
import { Play, BookOpen, MessageSquare, Gamepad2, ArrowRight, Brain, Trophy } from 'lucide-react';
import { cn } from '../lib/utils';

export function Home() {
  return (
    <div className="flex flex-col items-center justify-center space-y-32 py-10">
      
      {/* Hero Section */}
      <section className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left pt-10">
        <div className="flex-1 space-y-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 bg-yellow-100 text-yellow-800 font-bold rounded-full text-sm shadow-sm"
          >
            🌟 Fun • Interactive • AI-Powered
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black font-tamil text-slate-800 dark:text-slate-100 leading-tight"
          >
            தமிழ் கற்போம்!<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
              விளையாடி வளர்வோம்!
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 dark:text-slate-300 font-medium"
          >
            Learn Tamil with your friendly AI Buddy.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-4"
          >
            <Link 
              to="/learn"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-bold text-lg shadow-3d hover:shadow-3d-hover active:shadow-3d-active transition-all flex items-center justify-center gap-2"
            >
              Start Learning 🚀
            </Link>
            <Link 
              to="/chat"
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 text-purple-600 border-2 border-purple-200 rounded-full font-bold text-lg hover:bg-purple-50 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              Meet Your AI Buddy
            </Link>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm font-bold text-slate-400 tracking-wider uppercase mt-8"
          >
            Learn • Speak • Play • Improve
          </motion.p>
        </div>
        
        <div className="flex-1 relative flex justify-center items-center min-h-[400px]">
          {/* Floating Decorators */}
          <motion.div 
            animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }} 
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-10 left-10 text-4xl font-tamil text-purple-500 font-bold opacity-80"
          >அ</motion.div>
          <motion.div 
            animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }} 
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute bottom-20 left-4 text-5xl font-tamil text-blue-500 font-bold opacity-70"
          >ஆ</motion.div>
          <motion.div 
            animate={{ y: [0, -10, 0], rotate: [0, 15, 0] }} 
            transition={{ duration: 3.5, repeat: Infinity }}
            className="absolute top-20 right-10 text-5xl font-tamil text-yellow-500 font-bold opacity-90"
          >இ</motion.div>
          
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-300/30 to-blue-300/30 rounded-full blur-3xl -z-10 scale-75" />
          
          <Mascot size="xl" state="happy" />
        </div>
      </section>

      {/* Why Tamil Buddy */}
      <section className="w-full max-w-6xl mx-auto text-center space-y-12">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-800 dark:text-slate-100">Why Tamil Buddy?</h2>
          <p className="text-xl text-slate-600 dark:text-slate-300">Learning Tamil doesn't have to be boring.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard 
            icon={<Gamepad2 className="w-8 h-8 text-blue-500" />}
            title="Play & Learn"
            desc="Interactive games that make vocabulary fun."
            color="bg-blue-50"
            borderColor="border-blue-200"
          />
          <FeatureCard 
            icon={<MessageSquare className="w-8 h-8 text-purple-500" />}
            title="Practice Speaking"
            desc="Talk to AI Buddy to improve pronunciation."
            color="bg-purple-50"
            borderColor="border-purple-200"
          />
          <FeatureCard 
            icon={<BookOpen className="w-8 h-8 text-pink-500" />}
            title="Explore Stories"
            desc="Read colorful animated Tamil stories."
            color="bg-pink-50"
            borderColor="border-pink-200"
          />
          <FeatureCard 
            icon={<Brain className="w-8 h-8 text-yellow-500" />}
            title="Learn with AI"
            desc="Personalized lessons adapted to your pace."
            color="bg-yellow-50"
            borderColor="border-yellow-200"
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full max-w-6xl mx-auto space-y-16 py-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[120%] bg-white dark:bg-slate-800/40 blur-3xl -z-10 rounded-full pointer-events-none" />
        
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-800 dark:text-slate-100">How It Works</h2>
          <p className="text-xl text-slate-600 dark:text-slate-300">Your journey to mastering Tamil is simple and fun!</p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center relative gap-8 md:gap-4">
          <div className="hidden md:block absolute top-1/2 left-10 right-10 h-2 bg-purple-100 -translate-y-1/2 -z-10 rounded-full" />
          
          {[
            { step: '1', title: 'Choose a lesson', icon: '📚' },
            { step: '2', title: 'Learn with Buddy', icon: '🤖' },
            { step: '3', title: 'Play & Practice', icon: '🎮' },
            { step: '4', title: 'Earn XP & Badges', icon: '🏆' },
            { step: '5', title: 'Track Progress', icon: '📈' },
          ].map((item, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="flex flex-col items-center text-center gap-4 w-40"
            >
              <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-4xl shadow-md border-4 border-purple-200 relative">
                {item.icon}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm">
                  {item.step}
                </div>
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">{item.title}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Explore Learning */}
      <section className="w-full max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-800 dark:text-slate-100">Explore Learning</h2>
          <p className="text-xl text-slate-600 dark:text-slate-300">Dive into exciting activities tailored for kids.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ExploreCard title="Tamil Letters" path="/learn" icon="அ" color="bg-purple-100" />
          <ExploreCard title="Vocabulary Games" path="/games" icon="🎲" color="bg-blue-100" />
          <ExploreCard title="Interactive Stories" path="/stories" icon="📖" color="bg-pink-100" />
          <ExploreCard title="Nursery Rhymes" path="/rhymes" icon="🎵" color="bg-teal-100" />
          <ExploreCard title="Speaking Practice" path="/chat" icon="🎤" color="bg-orange-100" />
          <ExploreCard title="Track Progress" path="/progress" icon="⭐" color="bg-yellow-100" />
        </div>
      </section>

      {/* Meet Buddy & CTA */}
      <section className="w-full max-w-5xl mx-auto bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[3rem] p-8 md:p-16 text-white text-center flex flex-col items-center shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CiAgPGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPgo8L3N2Zz4=')] opacity-50" />
        
        <div className="relative z-10 flex flex-col items-center space-y-8">
          <Mascot size="lg" state="celebrating" className="mb-4 drop-shadow-2xl" />
          
          <h2 className="text-4xl md:text-5xl font-bold">Start Your Tamil Adventure!</h2>
          <p className="text-xl text-purple-100 max-w-2xl">
            Join thousands of kids learning Tamil the fun way. Your AI Buddy is waiting for you!
          </p>
          
          <Link 
            to="/learn"
            className="mt-8 px-10 py-5 bg-white dark:bg-slate-800 text-purple-700 rounded-full font-black text-2xl shadow-[0_8px_0_0_rgba(0,0,0,0.15)] hover:shadow-[0_4px_0_0_rgba(0,0,0,0.15)] hover:translate-y-1 active:shadow-none active:translate-y-2 transition-all"
          >
            Start Learning 🚀
          </Link>
        </div>
      </section>

    </div>
  );
}

function FeatureCard({ icon, title, desc, color, borderColor }: { icon: React.ReactNode, title: string, desc: string, color: string, borderColor: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={cn("p-8 rounded-3xl border-2 flex flex-col items-center text-center gap-4 shadow-sm bg-white dark:bg-slate-800 hover:shadow-md transition-shadow", borderColor)}
    >
      <div className={cn("p-4 rounded-2xl shadow-inner", color)}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h3>
      <p className="text-slate-600 dark:text-slate-300 font-medium">{desc}</p>
    </motion.div>
  );
}

function ExploreCard({ title, path, icon, color }: { title: string, path: string, icon: string, color: string }) {
  return (
    <Link onClick={() => audio.playPop()} to={path}>
      <motion.div 
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="glass-panel p-6 flex items-center justify-between group cursor-pointer hover:border-purple-300 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm", color)}>
            {icon}
          </div>
          <h3 className="font-bold text-xl text-slate-800 dark:text-slate-100 group-hover:text-purple-600 transition-colors">{title}</h3>
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-400 group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors">
          <ArrowRight size={20} />
        </div>
      </motion.div>
    </Link>
  );
}
