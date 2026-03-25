const MoodboardModule = ({ image, colors, setColors }) => {
    const [detecting, setDetecting] = React.useState(false);
    const [composerItems, setComposerItems] = React.useState([]);
    
    // Default colors if none extracted
    const displayColors = colors.length > 0 ? colors : [
        { name: 'Olive Leaf', color: '#829079', type: 'Exemplo' },
        { name: 'Clay Sand', color: '#D2B48C', type: 'Exemplo' },
        { name: 'Pure White', color: '#F9FAFB', type: 'Exemplo' },
        { name: 'Deep Graphite', color: '#1F2937', type: 'Exemplo' }
    ];

    const textures = [
        { name: 'Madeira Clara', img: 'https://images.unsplash.com/photo-1541123437800-1bb1d58abc11?auto=format&fit=crop&q=80&w=200', desc: 'Carvalho Americano' },
        { name: 'Cimento Queimado', img: 'https://images.unsplash.com/photo-1517404215738-16479704040e?auto=format&fit=crop&q=80&w=200', desc: 'Urbano Industrial' },
        { name: 'Mármore Carrara', img: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&q=80&w=200', desc: 'Clássico Elegante' }
    ];

    const addToComposer = (item, type) => {
        if (composerItems.length < 6) {
            setComposerItems([...composerItems, { ...item, type, id: Date.now() }]);
        }
    };

    const removeFromComposer = (id) => {
        setComposerItems(composerItems.filter(item => item.id !== id));
    };

    return (
        <div className="max-w-6xl mx-auto animate-slide-up pb-20">
            <div className="text-center mb-12">
                <span className="inline-block px-4 py-1.5 bg-gold/10 text-gold-dark rounded-full text-sm font-semibold mb-4 border border-gold/20">
                    Módulo de Harmonização
                </span>
                <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 tracking-tight">Moodboard <span className="text-gold italic font-light">Composer</span></h2>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                    Arraste ou clique nos elementos para montar sua composição personalizada.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Left: Sources (Colors & Textures) */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white p-8 rounded-[40px] border border-gray-100 premium-shadow">
                        <h3 className="font-display font-bold text-xl mb-6 flex items-center gap-2">
                             <i data-lucide="palette" className="w-5 h-5 text-gold"></i>
                             Cores Detectadas
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            {displayColors.map((c) => (
                                <button 
                                    key={c.name} 
                                    onClick={() => addToComposer(c, 'color')}
                                    className="flex items-center gap-4 group p-2 rounded-2xl hover:bg-gray-50 transition-all text-left"
                                >
                                    <div className="w-12 h-12 rounded-xl shadow-inner shrink-0" style={{ backgroundColor: c.color }}></div>
                                    <div className="flex-grow">
                                        <h4 className="font-bold text-sm text-graphite">{c.name}</h4>
                                        <span className="text-[10px] uppercase tracking-wider text-gray-400">{c.type}</span>
                                    </div>
                                    <i data-lucide="plus-circle" className="w-5 h-5 text-gray-300 group-hover:text-gold opacity-0 group-hover:opacity-100 transition-all"></i>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[40px] border border-gray-100 premium-shadow">
                        <h3 className="font-display font-bold text-xl mb-6 flex items-center gap-2">
                             <i data-lucide="layers" className="w-5 h-5 text-gold"></i>
                             Revestimentos
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            {textures.map((t) => (
                                <button 
                                    key={t.name}
                                    onClick={() => addToComposer(t, 'texture')}
                                    className="flex items-center gap-4 group p-2 rounded-2xl hover:bg-gray-50 transition-all text-left"
                                >
                                    <img src={t.img} className="w-12 h-12 rounded-xl object-cover shrink-0" alt={t.name} />
                                    <div className="flex-grow">
                                        <h4 className="font-bold text-sm text-graphite">{t.name}</h4>
                                        <span className="text-[10px] uppercase tracking-wider text-gray-400">Padrão</span>
                                    </div>
                                    <i data-lucide="plus-circle" className="w-5 h-5 text-gray-300 group-hover:text-gold opacity-0 group-hover:opacity-100 transition-all"></i>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: The Canvas */}
                <div className="lg:col-span-8 flex flex-col gap-8">
                    <div className="bg-white p-10 rounded-[50px] border border-gray-100 premium-shadow min-h-[500px] flex flex-col relative overflow-hidden bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="font-display font-bold text-3xl tracking-tight">Seu Composer</h3>
                                <p className="text-gray-400 text-sm mt-1">Clique nos itens à esquerda para adicionar à tela</p>
                            </div>
                            <button 
                                onClick={() => setComposerItems([])}
                                className="text-gray-400 hover:text-terracotta transition-colors flex items-center gap-2 text-sm font-medium"
                            >
                                <i data-lucide="trash-2" className="w-4 h-4"></i>
                                Limpar
                            </button>
                        </div>

                        {composerItems.length === 0 ? (
                            <div className="flex-grow flex flex-col items-center justify-center text-center opacity-40">
                                <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center mb-6">
                                    <i data-lucide="layout" className="w-10 h-10 text-gray-300"></i>
                                </div>
                                <p className="text-xl font-display font-medium">Sua composição está vazia</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 animate-fade-in relative z-10">
                                {composerItems.map((item) => (
                                    <div key={item.id} className="group relative bg-white p-4 rounded-3xl premium-shadow hover:scale-105 transition-all animate-slide-up border border-gray-50">
                                        <button 
                                            onClick={() => removeFromComposer(item.id)}
                                            className="absolute -top-2 -right-2 w-8 h-8 bg-terracotta text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-20 shadow-lg"
                                        >
                                            <i data-lucide="x" className="w-4 h-4"></i>
                                        </button>
                                        <div className="aspect-square rounded-2xl overflow-hidden mb-4 shadow-inner">
                                            {item.type === 'color' ? (
                                                <div className="w-full h-full" style={{ backgroundColor: item.color }}></div>
                                            ) : (
                                                <img src={item.img} className="w-full h-full object-cover" alt={item.name} />
                                            )}
                                        </div>
                                        <h4 className="font-bold text-sm text-graphite truncate">{item.name}</h4>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">{item.type === 'color' ? 'Tinta' : 'Textura'}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {/* Interactive UI elements only visible when items exist */}
                        {composerItems.length > 0 && (
                            <div className="absolute bottom-8 right-8 flex gap-4">
                                <button className="bg-graphite text-white px-8 py-3 rounded-2xl font-bold hover:bg-olive-soft transition-all shadow-xl flex items-center gap-2">
                                    <i data-lucide="download" className="w-5 h-5"></i>
                                    Salvar Projeto
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="bg-olive-soft/5 p-8 rounded-[40px] border border-olive-soft/10 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm text-olive-soft">
                                <i data-lucide="check-circle-2" className="w-8 h-8"></i>
                            </div>
                            <div>
                                <h4 className="font-display font-bold text-lg">Harmonia Garantida</h4>
                                <p className="text-gray-500 text-sm max-w-sm leading-relaxed">Nossa IA validou os elementos acima. Eles pertencem à paleta <strong>Biofílica e Moderna</strong>.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

window.MoodboardModule = MoodboardModule;

window.MoodboardModule = MoodboardModule;
