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

    const getStyleFilter = () => {
        if (isProcessing) return 'blur(10px) brightness(0.5)';
        switch (selectedStyle) {
            case 'Industrial': return 'contrast(1.3) brightness(0.7) saturate(0.5) sepia(0.3)';
            case 'Biofílico': return 'saturate(1.8) brightness(1.2) hue-rotate(15deg) contrast(1.1)';
            case 'Escandinavo': return 'brightness(1.4) contrast(0.8) saturate(0.4)';
            case 'Moderno': return 'contrast(1.2) brightness(1.1) saturate(1.1)';
            default: return 'none';
        }
    };

    const extractColors = (imgSrc) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imgSrc;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 100; canvas.height = 100;
            ctx.drawImage(img, 0, 0, 100, 100);
            const imageData = ctx.getImageData(0, 0, 100, 100).data;
            const colorCounts = {};
            for (let i = 0; i < imageData.length; i += 40) {
                const r = imageData[i], g = imageData[i+1], b = imageData[i+2];
                const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
                colorCounts[hex] = (colorCounts[hex] || 0) + 1;
            }
            const sortedColors = Object.entries(colorCounts)
                .sort((a, b) => b[1] - a[1]).slice(0, 4)
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
                setShowComparison(false); // Reset comparison to show only original
            };
            reader.readAsDataURL(file);
        }
    };

    const handleTransform = (styleName) => {
        if (styleName) setSelectedStyle(styleName);
        setIsProcessing(true);
        // Simulate API call (Stable Diffusion / Firefly)
        setTimeout(() => {
            setIsProcessing(false);
            setShowComparison(true);
        }, 1800); 
    };

    return (
        <div className="max-w-5xl mx-auto animate-slide-up">
            <div className="text-center mb-12">
                <span className="inline-block px-4 py-1.5 bg-olive-light/10 text-olive-dark rounded-full text-sm font-semibold mb-4 border border-olive-light/20">
                    Módulo de Transformação de Ambientes
                </span>
                <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 tracking-tight">IA Vision: <span className="text-olive-soft italic font-light">Renderização Ativa</span></h2>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                    Faça o upload e escolha um estilo para processar seu ambiente via IA.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upload & Preview Side */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="relative group overflow-hidden rounded-[40px] premium-shadow border border-gray-100 bg-white aspect-video flex flex-col items-center justify-center transition-all bg-gray-50 shadow-inner">
                        {image ? (
                            <div className="relative w-full h-full cursor-col-resize select-none overflow-hidden" 
                                 onMouseMove={(e) => {
                                     if (showComparison) {
                                         const rect = e.currentTarget.getBoundingClientRect();
                                         const x = ((e.clientX - rect.left) / rect.width) * 100;
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
                                <div 
                                    className="absolute inset-0 w-full h-full z-10 pointer-events-none"
                                    style={{ clipPath: showComparison ? `inset(0 ${100 - sliderPos}% 0 0)` : 'inset(0 0% 0 0)' }}
                                >
                                    <img src={image} className="w-full h-full object-cover" alt="Original" />
                                </div>

                                {/* Slider Handle */}
                                {showComparison && (
                                    <div 
                                        className="absolute top-0 bottom-0 z-20 w-1 bg-white shadow-xl flex items-center justify-center pointer-events-none"
                                        style={{ left: `${sliderPos}%` }}
                                    >
                                        <div className="w-10 h-10 bg-white rounded-full shadow-2xl flex items-center justify-center -ml-0 border border-gray-100">
                                            <i data-lucide="chevrons-left-right" className="w-5 h-5 text-olive-soft"></i>
                                        </div>
                                    </div>
                                )}

                                {!isProcessing && (
                                    <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
                                        <label className="bg-white/90 backdrop-blur p-2 rounded-full cursor-pointer hover:bg-white transition-all shadow-sm">
                                            <i data-lucide="camera" className="w-4 h-4 text-graphite"></i>
                                            <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
                                        </label>
                                    </div>
                                )}
                                
                                <div className="absolute bottom-4 left-4 flex gap-2 z-30">
                                    <div className="bg-graphite/90 backdrop-blur px-3 py-1 rounded-full text-[9px] font-bold shadow-sm uppercase tracking-widest text-white border border-white/10">
                                        {showComparison ? 'Render Ativo' : 'Antes (Original)'}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center p-8">
                                <div className="w-20 h-20 bg-white rounded-[30px] flex items-center justify-center mx-auto mb-6 border border-gray-100 group-hover:scale-110 group-hover:bg-olive-light/10 transition-all shadow-sm">
                                    <i data-lucide="image-plus" className="w-10 h-10 text-olive-soft"></i>
                                </div>
                                <p className="text-graphite font-display font-bold text-xl">Upload da Foto</p>
                                <p className="text-gray-400 text-sm mt-2">Clique para carregar seu ambiente</p>
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleUpload} accept="image/*" />
                            </div>
                        )}
                        
                        {isProcessing && (
                            <div className="absolute inset-0 bg-graphite/80 backdrop-blur-xl flex flex-col items-center justify-center text-white z-40 animate-fade-in rounded-[40px]">
                                <div className="w-16 h-16 border-[6px] border-white/20 border-t-white rounded-full animate-spin mb-6"></div>
                                <p className="font-display text-3xl font-medium tracking-tight">IA Rendering...</p>
                                <p className="text-white/60 text-sm mt-2 uppercase tracking-widest">Estilo {selectedStyle}</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-gray-100 premium-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-display font-bold text-xl uppercase tracking-tighter">Status do Render</h4>
                            <span className="text-xs px-3 py-1 bg-green-50 text-green-600 rounded-full font-bold">API Online</span>
                        </div>
                        <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                            O processamento IA utiliza algoritmos de difusão estável para reconstruir texturas no estilo <strong>{selectedStyle}</strong>.
                        </p>
                        <button 
                            disabled={!image || isProcessing}
                            onClick={() => handleTransform()}
                            className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${image && !isProcessing ? 'bg-olive-soft text-white hover:bg-olive-dark shadow-xl' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                        >
                            <i data-lucide="zap" className="w-6 h-6"></i>
                            Processar Agora
                        </button>
                    </div>
                </div>

                {/* Style Selector Side */}
                <div className="space-y-4">
                    <h3 className="font-display font-bold text-xl mb-6 flex items-center gap-2">
                        <i data-lucide="layout" className="w-5 h-5 text-olive-soft"></i>
                        Selecione o Estilo
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                        {styles.map((style) => (
                            <button
                                key={style.name}
                                disabled={!image || isProcessing}
                                onClick={() => handleTransform(style.name)}
                                className={`p-5 rounded-2xl border-2 text-left transition-all ${selectedStyle === style.name ? 'border-olive-soft bg-white premium-shadow' : 'border-gray-50 bg-white hover:border-gray-200'} ${(!image || isProcessing) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className={`p-2 rounded-lg ${selectedStyle === style.name ? 'bg-olive-soft text-white' : 'bg-gray-100 text-gray-400'}`}>
                                        <i data-lucide={style.icon} className="w-5 h-5"></i>
                                    </div>
                                    {selectedStyle === style.name && <div className="animate-pulse w-2 h-2 bg-olive-soft rounded-full"></div>}
                                </div>
                                <h4 className="font-bold text-lg text-graphite">{style.name}</h4>
                                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{style.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

window.VisionModule = VisionModule;
VisionModule;
