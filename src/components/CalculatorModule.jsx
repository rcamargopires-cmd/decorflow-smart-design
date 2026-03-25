const CalculatorModule = () => {
    const [area, setArea] = React.useState(20);
    const [height, setHeight] = React.useState(2.7);
    
    // Logic from USER: 
    // Tinta: (Área / 10) = Litros totais.
    // Piso: (Área * 1.1) = m² totais com quebra.
    // Papel de Parede: (Área / 4.5) = Quantidade de rolos.
    
    const paint = (area / 10).toFixed(1);
    const flooring = (area * 1.1).toFixed(1);
    const wallpaper = Math.ceil(area / 4.5);

    const handlePrint = () => {
        window.print();
    };

    const handleBuy = (itemName) => {
        const query = encodeURIComponent(itemName);
        window.open(`https://www.google.com/search?tbm=shop&q=${query}`, '_blank');
    };

    const budgetItems = [
        { name: 'Tinta Premium Acetinada', qty: paint, unit: 'L', price: 45, icon: 'droplet', color: 'text-blue-500' },
        { name: 'Piso Vinílico / Laminado', qty: flooring, unit: 'm²', price: 95, icon: 'box', color: 'text-amber-600' },
        { name: 'Papel de Parede Decorativo', qty: wallpaper, unit: 'Rolos', price: 210, icon: 'scroll', color: 'text-terracotta' }
    ];

    const total = budgetItems.reduce((acc, item) => acc + (item.qty * item.price), 0);

    return (
        <div className="max-w-6xl mx-auto animate-slide-up pb-20">
            {/* Header section hidden on print */}
            <div className="text-center mb-12 print:hidden">
                <span className="inline-block px-4 py-1.5 bg-terracotta/10 text-terracotta rounded-full text-sm font-semibold mb-4 border border-terracotta/20">
                    Módulo de Cálculo e Orçamento
                </span>
                <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 tracking-tight">Cálculo <span className="text-terracotta italic font-light">Matemático Automático</span></h2>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                    Medições técnicas precisas baseadas nos padrões de rendimento de mercado.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Inputs area - hidden on print */}
                <div className="lg:col-span-4 space-y-6 print:hidden">
                    <div className="bg-white p-8 rounded-[40px] border border-gray-100 premium-shadow">
                        <h3 className="font-display font-bold text-xl mb-8">Área do Ambiente</h3>
                        
                        <div className="space-y-8">
                            <div>
                                <div className="flex justify-between mb-4">
                                    <label className="text-sm font-bold text-graphite uppercase tracking-wider">Metragem Quadrada (m²)</label>
                                    <span className="text-olive-soft font-bold text-lg">{area} m²</span>
                                </div>
                                <input 
                                    type="range" min="5" max="200" value={area} 
                                    onChange={(e) => setArea(e.target.value)}
                                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-terracotta"
                                />
                                <div className="flex justify-between mt-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                    <span>5m²</span>
                                    <span>200m²</span>
                                </div>
                            </div>

                            <div className="p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-widest">Fórmulas Aplicadas</h4>
                                <ul className="text-[11px] space-y-2 text-gray-500 font-medium">
                                    <li className="flex justify-between"><span>Tinta:</span> <span>Área / 10</span></li>
                                    <li className="flex justify-between"><span>Piso (+10%):</span> <span>Área * 1.1</span></li>
                                    <li className="flex justify-between"><span>Papel de Parede:</span> <span>Área / 4.5</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results area - optimized for print */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white p-10 rounded-[50px] border border-gray-100 premium-shadow relative overflow-hidden">
                        {/* Print Header (Only visible on print) */}
                        <div className="hidden print:block mb-10 border-b pb-8">
                            <h1 className="text-3xl font-display font-bold">DecorFlow - Lista Técnica de Compras</h1>
                            <p className="text-gray-500">Relatório gerado automaticamente para área de {area}m²</p>
                        </div>

                        <div className="flex items-center justify-between mb-10 print:mb-6">
                            <h3 className="font-display font-bold text-2xl tracking-tight">Quantidades Necessárias</h3>
                            <button 
                                onClick={handlePrint}
                                className="bg-white text-graphite border border-gray-200 px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition-all print:hidden"
                            >
                                <i data-lucide="printer" className="w-4 h-4"></i>
                                Imprimir Orçamento
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-50">
                                        <th className="py-4 font-bold text-xs uppercase tracking-widest text-gray-400">Item Sugerido</th>
                                        <th className="py-4 font-bold text-xs uppercase tracking-widest text-gray-400 text-center">Calculado</th>
                                        <th className="py-4 font-bold text-xs uppercase tracking-widest text-gray-400 text-right print:hidden">Ação</th>
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
                                                        <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Estimativa Técnica</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6 text-center">
                                                <span className="font-display font-bold text-xl text-graphite">{item.qty}</span>
                                                <span className="text-xs text-gray-400 ml-1 font-bold">{item.unit}</span>
                                            </td>
                                            <td className="py-6 text-right print:hidden">
                                                <button 
                                                    onClick={() => handleBuy(item.name)}
                                                    className="inline-flex items-center gap-2 bg-graphite text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-olive-soft transition-all shadow-md active:scale-95"
                                                >
                                                    Ver Preços
                                                    <i data-lucide="external-link" className="w-3 h-3"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-10 pt-10 border-t flex items-center justify-between">
                            <div className="print:block">
                                <p className="text-sm text-gray-400 uppercase tracking-widest font-bold">Investimento Estimado</p>
                                <h4 className="text-4xl font-display font-bold text-terracotta">R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}*</h4>
                                <p className="text-[10px] text-gray-400 mt-2">*Valores baseados em médias de mercado.</p>
                            </div>
                            <div className="flex gap-3 print:hidden">
                                <button className="bg-olive-soft text-white px-8 py-4 rounded-2xl font-bold hover:bg-olive-dark transition-all shadow-xl shadow-olive-soft/20 flex items-center gap-3">
                                    <i data-lucide="shopping-cart" className="w-6 h-6"></i>
                                    Lista Completa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

window.CalculatorModule = CalculatorModule;
