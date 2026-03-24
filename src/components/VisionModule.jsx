const VisionModule = ({ image, setImage, setExtractedColors }) => {
    const [selectedStyle, setSelectedStyle] = React.useState('Moderno');
    const [isProcessing, setIsProcessing] = React.useState(false);

    const styles = [
        { name: 'Industrial', icon: 'wrench', desc: 'Metais, tijolos e tons escuros.' },
        { name: 'Biofílico', icon: 'leaf', desc: 'Muita vegetação e luz natural.' },
        { name: 'Escandinavo', icon: 'snowflake', desc: 'Minimalismo, madeira e tons claros.' },
        { name: 'Moderno', icon: 'monitor', desc: 'Linhas retas e design funcional.' }
    ];

    const extractColors = (imgSrc) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imgSrc;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 100;
            canvas.height = 100;
            ctx.drawImage(img, 0, 0, 100, 100);
            
            const imageData = ctx.getImageData(0, 0, 100, 100).data;
            const colorCounts = {};
            
            for (let i = 0; i < imageData.length; i += 40) { // Sample every 10 pixels
                const r = imageData[i], g = imageData[i+1], b = imageData[i+2];
                const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
                colorCounts[hex] = (colorCounts[hex] || 0) + 1;
            }
            
            const sortedColors = Object.entries(colorCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 4)
                .map(([hex], index) => ({
                    name: `Cor Detectada ${index + 1}`,
                    color: hex,
                    type: index === 0 ? 'Dominante' : 'Acentuada'
                }));
            
            setExtractedColors(sortedColors);
        };
    };

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (f) => {
                setImage(f.target.result);
                extractColors(f.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const getStyleFilter = () => {
        if (isProcessing) return 'blur(8px) grayscale(100%)';
        switch (selectedStyle) {
            case 'Industrial': return 'contrast(1.2) brightness(0.8) saturate(0.6) sepia(0.2)';
            case 'Biofílico': return 'saturate(1.4) brightness(1.1) hue-rotate(10deg)';
            case 'Escandinavo': return 'brightness(1.2) contrast(0.9) saturate(0.5)';
            case 'Moderno': return 'contrast(1.1) brightness(1.05) saturate(0.9)';
            default: return 'none';
        }
    };

    const handleTransform = () => {
        setIsProcessing(true);
        setTimeout(() => setIsProcessing(false), 1500); 
    };

    return (
        <div className="max-w-5xl mx-auto animate-slide-up">
            <div className="text-center mb-12">
                <span className="inline-block px-4 py-1.5 bg-olive-light/10 text-olive-dark rounded-full text-sm font-semibold mb-4 border border-olive-light/20">
                    Módulo de Transformação de Ambientes
                </span>
                <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 tracking-tight">IA Vision: Seu Espaço, <span className="text-olive-soft italic font-light">Reimaginado</span></h2>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                    Faça upload de uma foto do seu ambiente atual e veja a mágica acontecer. Simulamos o estilo desejado instantaneamente.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upload & Preview Side */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="relative group overflow-hidden rounded-3xl premium-shadow border-2 border-dashed border-gray-200 bg-white aspect-video flex flex-col items-center justify-center transition-all hover:border-olive-soft">
                        {image ? (
                            <>
                                <img 
                                    src={image} 
                                    className="absolute inset-0 w-full h-full object-cover transition-all duration-1000" 
                                    style={{ filter: getStyleFilter() }}
                                    alt="Ambiente" 
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                    <label className="bg-white/90 p-3 rounded-full cursor-pointer hover:bg-white transition-all">
                                        <i data-lucide="refresh-cw" className="w-6 h-6 text-graphite"></i>
                                        <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
                                    </label>
                                </div>
                                {!isProcessing && (
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                        Renderizado: {selectedStyle}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center p-8">
                                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100 group-hover:scale-110 group-hover:bg-olive-light/10 transition-all">
                                    <i data-lucide="upload-cloud" className="w-8 h-8 text-gray-400 group-hover:text-olive-soft"></i>
                                </div>
                                <p className="text-gray-900 font-semibold text-lg">Clique para upload</p>
                                <p className="text-gray-400 text-sm mt-1">PNG, JPG até 10MB</p>
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleUpload} accept="image/*" />
                            </div>
                        )}
                        
                        {isProcessing && (
                            <div className="absolute inset-0 bg-olive-soft/80 backdrop-blur-sm flex flex-col items-center justify-center text-white z-10 animate-fade-in">
                                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="font-display text-xl font-medium">Renderizando em {selectedStyle}...</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-gray-100 premium-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-display font-bold text-xl">Estilo Selecionado</h4>
                            <span className="text-olive-soft font-bold">{selectedStyle}</span>
                        </div>
                        <p className="text-gray-500 mb-6 text-sm">
                            {styles.find(s => s.name === selectedStyle).desc}
                        </p>
                        <button 
                            disabled={!image || isProcessing}
                            onClick={handleTransform}
                            className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${image && !isProcessing ? 'bg-olive-soft text-white hover:bg-olive-dark shadow-lg shadow-olive-soft/20' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                        >
                            <i data-lucide="sparkles" className="w-6 h-6"></i>
                            Transformar Agora
                        </button>
                    </div>
                </div>

                {/* Style Selector Side */}
                <div className="space-y-4">
                    <h3 className="font-display font-bold text-xl mb-6 flex items-center gap-2">
                        <i data-lucide="sliders" className="w-5 h-5 text-olive-soft"></i>
                        Escolha um Estilo
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                        {styles.map((style) => (
                            <button
                                key={style.name}
                                onClick={() => setSelectedStyle(style.name)}
                                className={`p-5 rounded-2xl border-2 text-left transition-all ${selectedStyle === style.name ? 'border-olive-soft bg-olive-soft/5 premium-shadow' : 'border-gray-50 bg-white hover:border-gray-200'}`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className={`p-2 rounded-lg ${selectedStyle === style.name ? 'bg-olive-soft text-white' : 'bg-gray-100 text-gray-400'}`}>
                                        <i data-lucide={style.icon} className="w-5 h-5"></i>
                                    </div>
                                    {selectedStyle === style.name && <i data-lucide="check" className="w-5 h-5 text-olive-soft"></i>}
                                </div>
                                <h4 className="font-bold text-lg text-graphite">{style.name}</h4>
                                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{style.desc}</p>
                            </button>
                        ))}
                    </div>
                    
                    <div className="bg-terracotta/5 p-6 rounded-2xl border border-terracotta/10 mt-6">
                        <h4 className="font-bold text-terracotta flex items-center gap-2 mb-2">
                            <i data-lucide="zap" className="w-4 h-4"></i>
                            Dica de Design
                        </h4>
                        <p className="text-sm text-terracotta/80 leading-relaxed">
                            O estilo <strong>Biofílico</strong> está em alta para 2026. Prioriza elementos naturais para reduzir o estresse.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

window.VisionModule = VisionModule;
