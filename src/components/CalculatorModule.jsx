const CalculatorModule = () => {
    const [area, setArea] = React.useState(20);
    const [wallHeight, setWallHeight] = React.useState(2.7);
    
    // Simple logic
    const paintLiters = (area / 10).toFixed(1);
    const flooringM2 = (area * 1.1).toFixed(1); // 10% waste
    const wallpaperRolls = Math.ceil((area * wallHeight) / 5);

    return (
        <div className="max-w-4xl mx-auto animate-slide-up">
            <div className="text-center mb-12">
                <span className="inline-block px-4 py-1.5 bg-terracotta/10 text-terracotta-dark rounded-full text-sm font-semibold mb-4 border border-terracotta/20">
                    Cálculo & Orçamento
                </span>
                <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 tracking-tight">Lista de <span className="text-terracotta italic font-light">Compras</span></h2>
                <p className="text-gray-500 text-lg max-w-xl mx-auto">
                    Converta seu design em medidas reais e saiba exatamente o que comprar.
                </p>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-[50px] premium-shadow border border-gray-100 flex flex-col md:flex-row gap-12">
                {/* Inputs */}
                <div className="md:w-1/3 space-y-8 border-b md:border-b-0 md:border-r border-gray-100 pb-8 md:pb-0 md:pr-12">
                    <h3 className="font-display font-bold text-xl mb-6">Dimensões</h3>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-500 mb-2">Área do Piso (m²)</label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    value={area}
                                    onChange={(e) => setArea(e.target.value)}
                                    className="w-full bg-gray-50 border-2 border-gray-50 focus:border-terracotta/20 focus:bg-white p-4 rounded-2xl transition-all outline-none font-bold text-lg"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">m²</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-500 mb-2">Altura das Paredes (m)</label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    value={wallHeight}
                                    onChange={(e) => setWallHeight(e.target.value)}
                                    className="w-full bg-gray-50 border-2 border-gray-50 focus:border-terracotta/20 focus:bg-white p-4 rounded-2xl transition-all outline-none font-bold text-lg"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">m</span>
                            </div>
                        </div>

                        <div className="p-6 bg-olive-soft/10 rounded-2xl border border-olive-soft/10 text-olive-dark text-sm flex items-start gap-3">
                            <i data-lucide="info" className="w-5 h-5 shrink-0"></i>
                            <p>Baseamos o rendimento em produtos premium com alta cobertura.</p>
                        </div>
                    </div>
                </div>

                {/* Results List */}
                <div className="flex-grow">
                    <h3 className="font-display font-bold text-xl mb-8">Quantidades Necessárias</h3>
                    <div className="space-y-4">
                        {/* Paint */}
                        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100 group">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-xl shadow-sm group-hover:text-terracotta transition-colors">
                                    <i data-lucide="droplet"></i>
                                </div>
                                <div>
                                    <h4 className="font-bold">Tinta (Acetinada)</h4>
                                    <p className="text-sm text-gray-400">Rendimento: 10m²/L</p>
                                </div>
                            </div>
                            <div className="text-right flex items-center gap-6">
                                <div className="text-xl font-bold font-display">{paintLiters} Litros</div>
                                <button className="bg-terracotta text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-terracotta-dark transition-all premium-shadow">Comprar Agora</button>
                            </div>
                        </div>

                        {/* Flooring */}
                        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100 group">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-xl shadow-sm group-hover:text-gold transition-colors">
                                    <i data-lucide="grid-3x3"></i>
                                </div>
                                <div>
                                    <h4 className="font-bold">Piso Laminado/Vinílico</h4>
                                    <p className="text-sm text-gray-400">+10% margem de erro</p>
                                </div>
                            </div>
                            <div className="text-right flex items-center gap-6">
                                <div className="text-xl font-bold font-display">{flooringM2} m²</div>
                                <button className="bg-gold text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-gold-dark transition-all premium-shadow">Comprar Agora</button>
                            </div>
                        </div>

                        {/* Wallpaper */}
                        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100 group">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-xl shadow-sm group-hover:text-olive-soft transition-colors">
                                    <i data-lucide="scroll"></i>
                                </div>
                                <div>
                                    <h4 className="font-bold">Papel de Parede</h4>
                                    <p className="text-sm text-gray-400">Rolos de 5m²</p>
                                </div>
                            </div>
                            <div className="text-right flex items-center gap-6">
                                <div className="text-xl font-bold font-display">{wallpaperRolls} Rolos</div>
                                <button className="bg-graphite text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-graphite-light transition-all premium-shadow">Comprar Agora</button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-12 p-8 bg-gray-900 rounded-[30px] text-white flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <p className="text-gray-400 text-sm mb-1 uppercase tracking-widest font-bold">Total Estimado</p>
                            <h4 className="text-3xl font-display font-bold">R$ 2.450,00</h4>
                        </div>
                        <button className="w-full md:w-auto bg-white text-graphite px-10 py-4 rounded-2xl font-bold hover:bg-olive-soft hover:text-white transition-all flex items-center justify-center gap-2">
                            <i data-lucide="file-text" className="w-5 h-5"></i>
                            Exportar Orçamento Completo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

window.CalculatorModule = CalculatorModule;
