const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf-8');

const newSection = `
      {/* Tamil Heritage Section */}
      <section className="w-full max-w-6xl mx-auto flex flex-col items-center text-center gap-12 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50 to-transparent -z-10 rounded-3xl" />
        <div className="space-y-4 pt-10">
          <h2 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500">
            தமிழ் மரபு 🏛️
          </h2>
          <p className="text-xl md:text-2xl text-slate-600">Discover our rich Tamil Heritage & Literature</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full">
          {[
            { icon: '🎵', title: 'Bharathiyar', color: 'bg-orange-50 hover:bg-orange-100 border-orange-200' },
            { icon: '📜', title: 'Thirukkural', color: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200' },
            { icon: '🌸', title: 'Aathichudi', color: 'bg-pink-50 hover:bg-pink-100 border-pink-200' },
            { icon: '🌿', title: 'Sangam', color: 'bg-green-50 hover:bg-green-100 border-green-200' },
            { icon: '👵', title: 'Avvaiyar', color: 'bg-purple-50 hover:bg-purple-100 border-purple-200' },
            { icon: '💬', title: 'Proverbs', color: 'bg-blue-50 hover:bg-blue-100 border-blue-200' }
          ].map((item, i) => (
            <Link key={i} to="/heritage" className={\`flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all transform hover:-translate-y-2 hover:shadow-xl \${item.color}\`}>
              <span className="text-4xl mb-3">{item.icon}</span>
              <span className="font-bold text-slate-700">{item.title}</span>
            </Link>
          ))}
        </div>

        <Link to="/heritage" className="bg-amber-500 text-white px-8 py-4 rounded-full font-bold text-xl shadow-lg hover:bg-amber-400 hover:-translate-y-1 transition-all flex items-center gap-2">
          தமிழ் மரபை கற்போம்! <ArrowRight />
        </Link>
      </section>

      {/* Features Section */}
`;

code = code.replace(/\{\/\* Features Section \*\/\}/, newSection.trim());

fs.writeFileSync('src/pages/Home.tsx', code);
