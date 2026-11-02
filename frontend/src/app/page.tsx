export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-2xl space-y-8">
        <h1 className="text-6xl font-extrabold tracking-tight">
          Welcome to <span className="text-ethio-red">Ethio</span> <span className="text-ethio-yellow text-shadow-sm">Kitchen</span>
        </h1>
        
        <p className="text-xl text-zinc-600 dark:text-zinc-400">
          Experience the authentic flavors of Ethiopia. From our traditional Injera to our rich, aromatic coffee, we bring the heart of Ethiopia to your table.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <button className="px-8 py-3 bg-brand-primary text-white rounded-lg font-bold hover:bg-opacity-90 transition-all shadow-lg">
            View Menu
          </button>
          <button className="px-8 py-3 border-2 border-brand-secondary text-brand-secondary rounded-lg font-bold hover:bg-brand-secondary hover:text-white transition-all shadow-md">
            Our Story
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800">
            <div className="w-12 h-12 bg-ethio-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🥘</span>
            </div>
            <h3 className="font-bold text-lg mb-2">Authentic Wot</h3>
            <p className="text-sm text-zinc-500">Slow-cooked stews with hand-picked spices from Addis Ababa.</p>
          </div>
          
          <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800">
            <div className="w-12 h-12 bg-ethio-yellow/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🫓</span>
            </div>
            <h3 className="font-bold text-lg mb-2">Fresh Injera</h3>
            <p className="text-sm text-zinc-500">Sourdough flatbread made daily with high-quality Teff flour.</p>
          </div>

          <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800">
            <div className="w-12 h-12 bg-ethio-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">☕</span>
            </div>
            <h3 className="font-bold text-lg mb-2">Coffee Ceremony</h3>
            <p className="text-sm text-zinc-500">Traditional Ethiopian coffee ceremony experience.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
