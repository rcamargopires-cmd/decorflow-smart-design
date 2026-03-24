const Header = ({ activeModule, setActiveModule }) => (
    <header className="sticky top-0 z-50 glass-effect border-b border-gray-100 px-6 py-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-olive-soft rounded-xl flex items-center justify-center text-white premium-shadow">
                    <i data-lucide="palette" className="w-6 h-6"></i>
                </div>
                <h1 className="font-display text-2xl font-bold tracking-tight text-graphite group cursor-pointer" onClick={() => setActiveModule('vision')}>
                    Decor<span className="text-olive-soft group-hover:text-olive-dark transition-colors">Flow</span>
                </h1>
            </div>
            
            <nav className="flex items-center gap-1 bg-gray-100 p-1 rounded-2xl overflow-hidden shrink-0">
                <button 
                    onClick={() => setActiveModule('vision')}
                    className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 text-sm flex items-center gap-2 ${activeModule === 'vision' ? 'bg-white text-graphite shadow-sm' : 'text-gray-500 hover:text-graphite'}`}
                >
                    <i data-lucide="eye" className="w-4 h-4"></i>
                    <span>IA Vision</span>
                </button>
                <button 
                    onClick={() => setActiveModule('moodboard')}
                    className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 text-sm flex items-center gap-2 ${activeModule === 'moodboard' ? 'bg-white text-graphite shadow-sm' : 'text-gray-500 hover:text-graphite'}`}
                >
                    <i data-lucide="layout" className="w-4 h-4"></i>
                    <span>Moodboard</span>
                </button>
                <button 
                    onClick={() => setActiveModule('calculator')}
                    className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 text-sm flex items-center gap-2 ${activeModule === 'calculator' ? 'bg-white text-graphite shadow-sm' : 'text-gray-500 hover:text-graphite'}`}
                >
                    <i data-lucide="calculator" className="w-4 h-4"></i>
                    <span>Calculadora</span>
                </button>
            </nav>

            <div className="hidden lg:flex items-center gap-4">
                <button className="text-graphite hover:text-olive-soft transition-colors font-medium text-sm">Entrar</button>
                <button className="bg-graphite text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-graphite-light hover:scale-[1.02] active:scale-[0.98] transition-all premium-shadow">
                    Começar
                </button>
            </div>
        </div>
    </header>
);

window.Header = Header;
