const VisionModule = ({ image, setImage, setExtractedColors }) => {
    const [selectedStyle, setSelectedStyle] = React.useState('Moderno');
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [sliderPos, setSliderPos] = React.useState(50);
    const [showComparison, setShowComparison] = React.useState(false);

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
                setShowComparison(false);
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
        setTimeout(() => {
            setIsProcessing(false);
            setShowComparison(true);
        }, 1500); 
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
                    <div className="relative group overflow-hidden rounded-[40px] premium-shadow border border-gray-100 bg-white aspect-video flex flex-col items-center justify-center transition-all bg-gray-50">
                        {image ? (
                            <div className="relative w-full h-full cursor-col-resize select-none overflow-hidden" 
                                 onMouseMove={(e) => {
                                     if (showComparison) {
                                         const rect = e.currentTarget.getBoundingClientRect();
                                         const x = ((e.clientX - rect.left) / rect.width) * 100;
                                         setSliderPos(Math.max(0, Math.min(100, x)));
                                     }
                                 }}
                                 onTouchMove={(e) => {
                                     if (showComparison) {
                                         const rect = e.currentTarget.getBoundingClientRect();
                                         const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
                                         setSliderPos(Math.max(0, Math.min(100, x)));
                                     }
                                 }}
                            >
                                {/* Filtered Image (Result) */}
                                <img 
                                    src={image} 
                                    className="absolute inset-0 w-full h-full object-cover" 
                                    style={{ filter: getStyleFilter() }}
                                    alt="Result" 
                                />
                                
                                {/* Original Image (Overlayed with clip-path) */}
                                {showComparison && (
                                    <div 
                                        className="absolute inset-0 w-full h-full z-10 pointer-events-none"
                                        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                                    >
                                        <img src={image} className="w-full h-full object-cover" alt="Original" />
                                    </div>
                                )}

                                {/* Slider Handle */}
                                {showComparison && (
                                    <div 
                                        className="absolute top-0 bottom-0 z-20 w-1 bg-white shadow-xl flex items-center justify-center pointer-events-none"
                                        style={{ left: `${sliderPos}%` }}
                                    >
                                        <div className="w-10 h-10 bg-white rounded-full shadow-2xl flex items-center justify-center -ml-0">
                                            <i data-lucide="chevrons-left-right" className="w-5 h-5 text-olive-soft"></i>
                                        </div>
                                    </div>
                                )}

                                {!isProcessing && !showComparison && (
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100">
                                        <label className="bg-white/90 p-3 rounded-full cursor-pointer hover:bg-white transition-all scale-125">
                                            <i data-lucide="refresh-cw" className="w-6 h-6 text-graphite"></i>
                                            <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
                                        </label>
                                    </div>
                                )}
                                
                                <div className="absolute bottom-4 right-4 flex gap-2 z-30">
                                    <div className="bg-white/80 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold shadow-sm uppercase tracking-widest text-olive-dark">
                                        {showComparison ? 'Comparação Ativa' : (isProcessing ? 'Aguarde...' : selectedStyle)}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center p-8">
                                <div className="w-20 h-20 bg-white rounded-[30px] flex items-center justify-center mx-auto mb-6 border border-gray-100 group-hover:scale-110 group-hover:bg-olive-light/10 transition-all shadow-sm">
                                    <i data-lucide="camera" className="w-10 h-10 text-olive-soft"></i>
                                </div>
                                <p className="text-graphite font-display font-bold text-xl">Upload do Ambiente</p>
                                <p className="text-gray-400 text-sm mt-2">Arraste uma foto ou clique aqui</p>
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleUpload} accept="image/*" />
                            </div>
                        )}
                        
                        {isProcessing && (
                            <div className="absolute inset-0 bg-olive-soft/90 backdrop-blur-md flex flex-col items-center justify-center text-white z-40 animate-fade-in rounded-[40px]">
                                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="font-display text-2xl font-medium tracking-tight">Aplicando Estilo {selectedStyle}...</p>
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
