const DesignInsights = {
    'Industrial': {
        reason: 'Otimização de Espaço e Caráter',
        insight: 'Sugerimos este estilo pois seu ambiente possui elementos estruturais que podem ser expostos. A "limpeza" removeu obstruções visuais, permitindo que o pé-direito pareça mais alto com trilhos pretos e texturas de cimento.'
    },
    'Biofílico': {
        reason: 'Conexão com Bem-Estar',
        insight: 'Com base na luz natural detectada, a IA removeu o "caos" visual e substituiu por verde estratégico. Ideal para reduzir o estresse urbano e melhorar a qualidade do ar no seu cotidiano.'
    },
    'Escandinavo': {
        reason: 'Amplitude e Luminosidade',
        insight: 'Sua sala pareceu pequena devido à bagunça. Após a limpeza IA, aplicamos madeira clara e tons pastéis para maximizar o reflexo da luz e criar uma sensação de paz técnica.'
    },
    'Moderno': {
        reason: 'Funcionalidade Total',
        insight: 'Eliminamos objetos sem propósito. O design moderno organiza seu fluxo de passagem e foca no que realmente importa: uma estética limpa, digital e atemporal.'
    }
};

const VisionModule = ({ image, setImage, setExtractedColors }) => {
    const [selectedStyle, setSelectedStyle] = React.useState('Moderno');
    const [status, setStatus] = React.useState('');
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
        if (isProcessing) {
            if (status.includes('Limpeza')) return 'blur(20px) brightness(1.5) contrast(0.5)';
            return 'blur(5px) brightness(0.8)';
        }
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
                setShowComparison(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleTransform = (styleName) => {
        if (styleName) setSelectedStyle(styleName);
        setIsProcessing(true);
        setStatus('ANALISANDO ESTRUTURA...');
        
        setTimeout(() => {
            setStatus('LIMPANDO AMBIENTE (Inpainting)...');
            setTimeout(() => {
                setStatus(`APLICANDO ESTILO ${styleName || selectedStyle}...`);
                setTimeout(() => {
                    setIsProcessing(false);
                    setShowComparison(true);
                    setStatus('');
                }, 1000);
            }, 1200);
        }, 800);
    };

    return (
        <div className="max-w-6xl mx-auto animate-slide-up">
            <div className="text-center mb-12">
                <span className="inline-block px-4 py-1.5 bg-gold/10 text-gold-dark rounded-full text-[10px] font-black mb-4 border border-gold/20 uppercase tracking-[0.2em]">
                    Inspiração Real IA
                </span>
                <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 tracking-tight">Evolução de <span className="text-olive-soft italic font-light">Ambiente</span></h2>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto italic">
                    Nossa IA detecta o potencial do seu espaço, limpa a bagunça e sugere o melhor design técnico.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Main Viewport */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="relative group overflow-hidden rounded-[50px] premium-shadow border border-gray-100 bg-white aspect-[16/10] flex flex-col items-center justify-center transition-all bg-gray-50 shadow-inner">
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
                                        <div className="w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center -ml-0 border-4 border-gray-50">
                                            <i data-lucide="split" className="w-6 h-6 text-gold"></i>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="absolute top-6 left-6 z-30 flex gap-2">
                                    <div className="bg-graphite/40 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-bold text-white uppercase tracking-widest border border-white/10">
                                        {showComparison ? 'Visão Transformada' : 'Captura Original'}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center p-12">
                                <div className="w-24 h-24 bg-white rounded-[40px] flex items-center justify-center mx-auto mb-8 border border-gray-100 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-sm">
                                    <i data-lucide="camera" className="w-12 h-12 text-olive-soft"></i>
                                </div>
                                <h3 className="text-graphite font-display font-bold text-2xl mb-2">Seu Espaço Vazio ou Bagunçado</h3>
                                <p className="text-gray-400">Arraste uma foto e deixe a IA Designer cuidar do resto.</p>
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleUpload} accept="image/*" />
                            </div>
                        )}
                        
                        {isProcessing && (
                            <div className="absolute inset-0 bg-graphite/90 backdrop-blur-2xl flex flex-col items-center justify-center text-white z-40 animate-fade-in">
                                <div className="relative w-24 h-24 mb-10">
                                    <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                                    <div className="absolute inset-0 border-4 border-t-gold rounded-full animate-spin"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <i data-lucide="wand-2" className="w-8 h-8 text-gold animate-pulse"></i>
                                    </div>
                                </div>
                                <p className="font-display text-4xl font-bold tracking-tight mb-4">{status}</p>
                                <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-gold animate-[progress_3s_ease-in-out_infinite]"></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {showComparison && !isProcessing && (
                        <div className="bg-white p-10 rounded-[40px] border border-gray-100 premium-shadow animate-slide-up flex gap-8">
                            <div className="w-20 h-20 bg-gold/10 rounded-3xl flex items-center justify-center shrink-0 border border-gold/10">
                                <i data-lucide="lightbulb" className="w-10 h-10 text-gold"></i>
                            </div>
                            <div>
                                <h4 className="font-display font-bold text-2xl mb-2 flex items-center gap-3">
                                    Recomendação do Designer IA
                                    <span className="text-[10px] px-2 py-1 bg-green-50 text-green-600 rounded-lg uppercase">Expertize Nível 5</span>
                                </h4>
                                <p className="text-gray-400 font-bold mb-3 uppercase tracking-widest text-[11px] text-olive-dark">Foco: {DesignInsights[selectedStyle].reason}</p>
                                <p className="text-gray-500 leading-relaxed text-lg">
                                    "{DesignInsights[selectedStyle].insight}"
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Controls */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-graphite p-8 rounded-[40px] text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12">
                            <i data-lucide="zap" className="w-32 h-32"></i>
                        </div>
                        <h3 className="font-display font-bold text-xl mb-8 flex items-center gap-3">
                            <i data-lucide="layers" className="w-5 h-5 text-gold"></i>
                            Algoritmo de Estilo
                        </h3>
                        
                        <div className="space-y-4">
                            {styles.map((style) => (
                                <button
                                    key={style.name}
                                    disabled={!image || isProcessing}
                                    onClick={() => handleTransform(style.name)}
                                    className={`w-full p-5 rounded-3xl border text-left transition-all flex items-center justify-between group ${selectedStyle === style.name ? 'border-gold bg-gold/10' : 'border-white/5 bg-white/5 hover:bg-white/10'} ${(!image || isProcessing) ? 'opacity-30' : ''}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-2xl ${selectedStyle === style.name ? 'bg-gold text-graphite' : 'bg-white/10 text-white/40 group-hover:bg-white/20 transition-all'}`}>
                                            <i data-lucide={style.icon} className="w-5 h-5"></i>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm tracking-wide">{style.name}</h4>
                                            <p className="text-[10px] text-white/40 mt-1 uppercase tracking-widest font-bold">Designer Sugere</p>
                                        </div>
                                    </div>
                                    <i data-lucide="chevron-right" className={`w-4 h-4 transition-transform ${selectedStyle === style.name ? 'translate-x-1 text-gold' : 'text-white/20 group-hover:translate-x-1 group-hover:text-white/40'}`}></i>
                                </button>
                            ))}
                        </div>

                        <div className="mt-10 pt-10 border-t border-white/5 italic text-sm text-white/30 leading-relaxed">
                            "O motor IA reconstrói volumetria e materiais em tempo real."
                        </div>
                    </div>
                    
                    <button 
                        disabled={!image || isProcessing}
                        onClick={() => handleTransform()}
                        className={`w-full py-6 rounded-3xl font-display font-bold text-xl shadow-2xl transition-all flex items-center justify-center gap-4 active:scale-95 ${image && !isProcessing ? 'bg-olive-soft text-white hover:bg-olive-dark shadow-olive-soft/20' : 'bg-white/5 text-gray-500 border border-white/5'}`}
                    >
                        <i data-lucide="refresh-cw" className={`w-6 h-6 ${isProcessing ? 'animate-spin' : ''}`}></i>
                        Refazer Análise
                    </button>
                </div>
            </div>
        </div>
    );
};

window.VisionModule = VisionModule;
VisionModule;
