const MoodboardModule = ({ image, colors, setColors }) => {
    const [detecting, setDetecting] = React.useState(false);
    
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

    return (
        <div className="max-w-6xl mx-auto animate-slide-up">
            <div className="text-center mb-12">
                <span className="inline-block px-4 py-1.5 bg-gold/10 text-gold-dark rounded-full text-sm font-semibold mb-4 border border-gold/20">
                    Módulo de Harmonização
                </span>
                <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 tracking-tight">Moodboard <span className="text-gold italic font-light">Dinâmico</span></h2>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                    Identificamos as cores do seu móvel favorito e sugerimos a paleta perfeita de tintas e revestimentos.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                {/* Identification Area */}
                <div className="bg-white p-8 rounded-[40px] border border-gray-100 premium-shadow">
                    <div className="mb-6 rounded-2xl overflow-hidden h-40 bg-gray-100 border border-gray-50 flex items-center justify-center">
                        {image ? (
                            <img src={image} className="w-full h-full object-cover" alt="Sua Foto" />
                        ) : (
                            <div className="text-gray-400 text-sm flex flex-col items-center gap-2">
                                <i data-lucide="image-plus"></i>
                                <span>Faça upload no IA Vision para analisar</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-display font-bold text-2xl">Paleta Sugerida</h3>
                        <button 
                            onClick={() => { setDetecting(true); setTimeout(() => setDetecting(false), 1500); }}
                            className="text-gold font-semibold flex items-center gap-2 hover:underline"
                        >
                            <i data-lucide="crosshair" className={detecting ? 'animate-spin' : ''}></i>
                            {detecting ? 'Analisando...' : 'Re-detectar cores'}
                        </button>
                    </div>

                    <div className="space-y-6">
                        {displayColors.map((c) => (
                            <div key={c.name} className="flex items-center gap-4 group">
                                <div 
                                    className="w-20 h-20 rounded-2xl shadow-inner transition-transform group-hover:scale-105" 
                                    style={{ backgroundColor: c.color }}
                                ></div>
                                <div className="flex-grow">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-bold text-graphite">{c.name}</h4>
                                        <span className="text-xs font-mono text-gray-400">{c.color}</span>
                                    </div>
                                    <p className="text-sm text-gray-500">{c.type}</p>
                                    <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                                        <div className="bg-gold h-full rounded-full" style={{ width: c.type === 'Principal' ? '70%' : '30%' }}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Textures area */}
                <div className="space-y-8">
                    <div>
                        <h3 className="font-display font-bold text-2xl mb-6">Texturas e Revestimentos</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {textures.map((t) => (
                                <div key={t.name} className="group relative overflow-hidden rounded-3xl aspect-square border border-gray-100 premium-shadow hover:scale-[1.02] transition-all cursor-pointer">
                                    <img src={t.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={t.name} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                                        <h4 className="text-white font-bold text-lg">{t.name}</h4>
                                        <p className="text-white/70 text-sm">{t.desc}</p>
                                    </div>
                                </div>
                            ))}
                            <div className="rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-6 text-center hover:border-gold/40 transition-all group cursor-pointer">
                                <i data-lucide="plus" className="w-8 h-8 text-gray-300 group-hover:text-gold mb-2"></i>
                                <span className="text-sm font-medium text-gray-400 group-hover:text-gold">Adicionar Revestimento</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-graphite text-white p-8 rounded-[40px] premium-shadow border border-white/10 relative overflow-hidden">
                        <div className="absolute -top-12 -right-12 w-40 h-40 bg-gold/10 rounded-full blur-3xl"></div>
                        <h4 className="text-gold font-bold mb-4 flex items-center gap-2 uppercase tracking-widest text-xs">
                            <i data-lucide="shopping-bag" className="w-4 h-4"></i>
                            Recomendação Premium
                        </h4>
                        <p className="text-lg leading-relaxed mb-6">
                            Para este estilo, recomendamos o uso de <strong>Madeira de Reflorestamento</strong> combinada com <strong>Verde Oliva Suave</strong>.
                        </p>
                        <button className="bg-gold text-white font-bold px-8 py-3 rounded-xl hover:bg-gold-dark transition-all flex items-center gap-2">
                            Ver Lista de Materiais
                            <i data-lucide="arrow-right" className="w-5 h-5"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

window.MoodboardModule = MoodboardModule;
