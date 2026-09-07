const fs = require('fs');
let code = fs.readFileSync('src/pages/Heritage.tsx', 'utf-8');

const dailyWidget = `
  const dailyItem = HERITAGE_DATA[new Date().getDay() % HERITAGE_DATA.length];

  return (
    <div className="space-y-8 w-full max-w-6xl mx-auto pb-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500 pb-2">
          தமிழ் மரபு 🏛️
        </h1>
        <p className="text-xl text-slate-600">Discover Tamil Heritage, Literature, and Classical Works</p>
      </div>

      {/* Daily Feature */}
      {!search && filter === 'All' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-yellow-50 to-amber-100 p-6 md:p-8 rounded-3xl border border-yellow-200 shadow-sm flex flex-col md:flex-row items-center gap-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedItem(dailyItem.id)}>
          <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center text-5xl shadow-sm shrink-0">
            🌞
          </div>
          <div className="flex-1 space-y-2 text-center md:text-left">
            <h2 className="text-sm font-bold text-amber-600 uppercase tracking-widest">இன்றைய தமிழ் (Today's Feature)</h2>
            <h3 className="text-2xl font-tamil font-bold text-slate-800">{dailyItem.titleTamil}</h3>
            <p className="text-slate-600 line-clamp-2">{dailyItem.simpleMeaning}</p>
          </div>
          <button className="bg-amber-500 text-white px-6 py-3 rounded-full font-bold hover:bg-amber-600 transition-colors shrink-0">
            Learn Now 🚀
          </button>
        </motion.div>
      )}
`;

code = code.replace(/return \(\s*<div className="space-y-8 w-full max-w-6xl mx-auto pb-12">\s*<div className="text-center space-y-4">\s*<h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500 pb-2">\s*தமிழ் மரபு 🏛️\s*<\/h1>\s*<p className="text-xl text-slate-600">Discover Tamil Heritage, Literature, and Classical Works<\/p>\s*<\/div>/m, dailyWidget.trim());

fs.writeFileSync('src/pages/Heritage.tsx', code);
