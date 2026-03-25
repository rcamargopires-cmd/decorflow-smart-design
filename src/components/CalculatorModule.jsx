const CalculatorModule = () => {
    const [area, setArea] = React.useState(20);
    const [height, setHeight] = React.useState(2.7);
    
    // Calculation logic
    const wallArea = Math.sqrt(area) * 4 * height;
    const flooring = Math.ceil(area * 1.1); // +10% waste
    const paint = Math.ceil(wallArea / 10); // 10m²/L
    const wallpaper = Math.ceil(wallArea / 5); // 5m²/roll

    const handlePrint = () => {
        window.print();
    };

    const budgetItems = [
        { name: 'Tinta Premium (Latas)', qty: paint, price: 180, icon: 'droplet', color: 'text-blue-500' },
        { name: 'Piso Vinílico (m²)', qty: flooring, price: 95, icon: 'box', color: 'text-amber-600' },
        { name: 'Papel de Parede (Rolos)', qty: wallpaper, price: 220, icon: 'scroll', color: 'text-terracotta' }
    ];

    const total = budgetItems.reduce((acc, item) => acc + (item.qty * item.price), 0);

    return (
        <div className="max-w-6xl mx-auto animate-slide-up pb-20">
            {/* Header section hidden on print */}
            <div className="text-center mb-12 print:hidden">
                <span className="inline-block px-4 py-1.5 bg-terracotta/10 text-terracotta rounded-full text-sm font-semibold mb-4 border border-terracotta/20">
                    Módulo de Cálculo
                </span>
                <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 tracking-tight">Orçamento <span className="text-terracotta italic font-light">Inteligente</span></h2>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                    Converta suas medidas em uma lista de compras técnica e profissional.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Inputs area - hidden on print */}
                <div className="lg:col-span-4 space-y-6 print:hidden">
                    <div className="bg-white p-8 rounded-[40px] border border-gray-100 premium-shadow">
                        <h3 className="font-display font-bold text-xl mb-8">Medidas do Ambiente</h3>
                        
                        <div className="space-y-8">
                            <div>
                                <div className="flex justify-between mb-4">
                                    <label className="text-sm font-bold text-graphite uppercase tracking-wider">Área do Piso (m²)</label>
                                    <span className="text-olive-soft font-bold text-lg">{area} m²</span>
                                </div>
                                <input 
                                    type="range" min="5" max="100" value={area} 
                                    onChange={(e) => setArea(e.target.value)}
                                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-olive-soft"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between mb-4">
                                    <label className="text-sm font-bold text-graphite uppercase tracking-wider">Pé Direito (m)</label>
                                    <span className="text-olive-soft font-bold text-lg">{height} m</span>
                                </div>
                                <input 
                                    type="range" min="2" max="4" step="0.1" value={height} 
                                    onChange={(e) => setHeight(e.target.value)}
                                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-olive-soft"
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-graphite p-8 rounded-[40px] text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <i data-lucide="info" className="w-20 h-20"></i>
                        </div>
                        <h4 className="text-gold font-bold mb-2">Nota Técnica</h4>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Cálculos incluem margem de segurança de 10% para recortes e desperdício padrão de obra.
                        </p>
                    </div>
                </div>

                {/* Results area - optimized for print */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white p-10 rounded-[50px] border border-gray-100 premium-shadow relative overflow-hidden">
                        {/* Print Header (Only visible on print) */}
                        <div className="hidden print:block mb-10 border-b pb-8">
                            <h1 className="text-3xl font-display font-bold">DecorFlow - Orçamento Técnico</h1>
                            <p className="text-gray-500">Documento gerado em {new Date().toLocaleDateString('pt-BR')}</p>
                        </div>

                        <div className="flex items-center justify-between mb-10 print:mb-6">
                            <h3 className="font-display font-bold text-2xl tracking-tight">Lista de Materiais</h3>
                            <button 
                                onClick={handlePrint}
                                className="bg-white text-graphite border border-gray-200 px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition-all print:hidden"
                            >
                                <i data-lucide="file-text" className="w-4 h-4"></i>
                                Exportar PDF
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-50">
                                        <th className="py-4 font-bold text-xs uppercase tracking-widest text-gray-400">Item</th>
                                        <th className="py-4 font-bold text-xs uppercase tracking-widest text-gray-400 text-center">Quant.</th>
                                        <th className="py-4 font-bold text-xs uppercase tracking-widest text-gray-400 text-right">Estimativa</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {budgetItems.map((item) => (
                                        <tr key={item.name} className="group hover:bg-gray-50/50 transition-colors">
                                            <td className="py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-3 rounded-xl bg-gray-50 ${item.color} print:text-black`}>
                                                        <i data-lucide={item.icon} className="w-6 h-6"></i>
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-graphite">{item.name}</p>
                                                        <p className="text-xs text-gray-400">Qualidade Premium</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6 text-center font-bold text-lg">{item.qty}</td>
                                            <td className="py-6 text-right font-display font-bold text-xl text-graphite">
                                                R$ {(item.qty * item.price).toLocaleString('pt-BR')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-10 pt-10 border-t flex items-center justify-between">
                            <div className="print:block">
                                <p className="text-sm text-gray-400 uppercase tracking-widest font-bold">Total Estimado</p>
                                <h4 className="text-4xl font-display font-bold text-olive-dark">R$ {total.toLocaleString('pt-BR')}</h4>
                            </div>
                            <button className="bg-olive-soft text-white px-10 py-4 rounded-2xl font-bold hover:bg-olive-dark transition-all shadow-xl shadow-olive-soft/20 flex items-center gap-3 print:hidden">
                                <i data-lucide="shopping-cart" className="w-6 h-6"></i>
                                Comprar Tudo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

window.CalculatorModule = CalculatorModule;
