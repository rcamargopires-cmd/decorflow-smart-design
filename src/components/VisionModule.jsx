const STYLE_CONFIG = {
    'Biofílico': {
        icon: 'leaf',
        desc: 'Natureza e bem-estar.',
        prompt: 'Mantenha a estrutura da sala, mas remova móveis antigos e adicione plantas, texturas de madeira e tons de verde.',
        reason: 'Biofilia aumenta a produtividade em 15%.'
    },
    'Industrial': {
        icon: 'wrench',
        desc: 'Estrutura e modernidade.',
        prompt: 'Remova os objetos atuais e adicione acabamento de cimento queimado, trilhos pretos e móveis de couro.',
        reason: 'Estilo atemporal que valoriza a estrutura.'
    },
    'Escandinavo': {
        icon: 'snowflake',
        desc: 'Luz e minimalismo.',
        prompt: 'Limpe o ambiente e aplique tons claros, madeira de pinus e iluminação minimalista funcional.',
        reason: 'Maximiza a percepção de espaço e luz.'
    },
    'Moderno': {
        icon: 'monitor',
        desc: 'Linhas retas e elegância.',
        prompt: 'Remova excessos e aplique linhas retas, vidro, metal e uma paleta monocromática elegante.',
        reason: 'Foco na funcionalidade e sofisticação.'
    }
};

const VisionModule = ({ image, setImage, setExtractedColors }) => {
    const [selectedStyle, setSelectedStyle] = React.useState('Moderno');
    const [status, setStatus] = React.useState('');
    const [currentPrompt, setCurrentPrompt] = React.useState('');
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [sliderPos, setSliderPos] = React.useState(50);
    const [showComparison, setShowComparison] = React.useState(false);

    const callVisionAPI = async (img, prompt) => {
        // Simulação de chamada de API (DALL-E 3 / Stable Diffusion)
        return new Promise((resolve) => {
            setTimeout(() => resolve(true), 3000);
        });
    };

    const getStyleFilter = () => {
        if (isProcessing) {
            if (status.includes('Limpeza')) return 'blur(20px) contrast(0.5)';
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

    const handleTransform = async (styleName) => {
        const style = styleName || selectedStyle;
        setSelectedStyle(style);
        const prompt = STYLE_CONFIG[style].prompt;
        setCurrentPrompt(prompt);
        setIsProcessing(true);
        
        setStatus('CONECTANDO À API DE VISION...');
        await new Promise(r => setTimeout(r, 800));
        
        setStatus('LIMPANDO AMBIENTE (Inpainting)...');
        await new Promise(r => setTimeout(r, 1200));
        
        setStatus(`RENDERIZANDO COM IA...`);
        await callVisionAPI(image, prompt);
        
        setIsProcessing(false);
        setShowComparison(true);
        setStatus('');
    };

    return (
        <div className="max-w-6xl mx-auto animate-slide-up">
            <div className="text-center mb-12">
                <span className="inline-block px-4 py-1.5 bg-gold/10 text-gold-dark rounded-full text-[10px] font-black mb-4 border border-gold/20 uppercase tracking-[0.2em]">
                    Ativação Vision API
                </span>
                <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 tracking-tight">Transformação <span className="text-olive-soft italic font-light">Rede IA</span></h2>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto italic">
                    Utilizamos prompts estruturados para reconstruir seu ambiente em tempo real.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
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
                                <img src={image} className="absolute inset-0 w-full h-full object-cover" style={{ filter: getStyleFilter() }} alt="Result" />
                                <div className="absolute inset-0 w-full h-full z-10 pointer-events-none" style={{ clipPath: showComparison ? `inset(0 ${100 - sliderPos}% 0 0)` : 'inset(0 0% 0 0)' }}>
                                    <img src={image} className="w-full h-full object-cover" alt="Original" />
                                </div>

                                {showComparison && (
                                    <div className="absolute top-0 bottom-0 z-20 w-1 bg-white shadow-xl flex items-center justify-center pointer-events-none" style={{ left: `${sliderPos}%` }}>
                                        <div className="w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center -ml-0 border-4 border-gray-50">
                                            <i data-lucide="zap" className="w-6 h-6 text-gold"></i>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="absolute bottom-6 left-6 z-30 flex gap-2">
                                    <div className="bg-graphite/60 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-bold text-white uppercase tracking-widest border border-white/10">
                                        {showComparison ? (sliderPos > 50 ? 'IA Render' : 'Original') : 'Original'}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center p-12">
                                <div className="w-24 h-24 bg-white rounded-[40px] flex items-center justify-center mx-auto mb-8 border border-gray-100 transition-all shadow-sm">
                                    <i data-lucide="image-plus" className="w-12 h-12 text-olive-soft"></i>
                                </div>
                                <h3 className="text-graphite font-display font-bold text-2xl mb-2">Upload da Foto</h3>
                                <p className="text-gray-400">Arraste ou clique para enviar a imagem do seu ambiente.</p>
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleUpload} accept="image/*" />
                            </div>
                        )}
                        
                        {isProcessing && (
                            <div className="absolute inset-0 bg-graphite/95 backdrop-blur-3xl flex flex-col items-center justify-center text-white z-40 animate-fade-in px-12 text-center">
                                <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mb-10"></div>
                                <p className="font-display text-4xl font-bold tracking-tight mb-4 text-gold">{status}</p>
                                <div className="bg-white/5 p-8 rounded-3xl border border-white/10 max-w-lg">
                                    <div className="flex items-center gap-3 mb-4 justify-center">
                                        <div className="w-2 h-2 bg-gold rounded-full animate-pulse"></div>
                                        <p className="text-[10px] uppercase tracking-widest text-white/40 font-black">Prompt de Engenharia Enviado</p>
                                    </div>
                                    <p className="text-md italic text-white/80 leading-relaxed font-light">"{currentPrompt}"</p>
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
                                <h4 className="font-display font-bold text-2xl mb-2">Expertise Técnica Aplicada</h4>
                                <p className="text-gray-500 leading-relaxed text-lg">
                                    {STYLE_CONFIG[selectedStyle].reason}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-graphite p-8 rounded-[40px] text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12">
                            <i data-lucide="cpu" className="w-32 h-32"></i>
                        </div>
                        <h3 className="font-display font-bold text-xl mb-10 flex items-center gap-3 relative z-10">
                            <i data-lucide="sliders" className="w-5 h-5 text-gold"></i>
                            Configuração IA
                        </h3>
                        
                        <div className="space-y-4 relative z-10">
                            {Object.entries(STYLE_CONFIG).map(([name, config]) => (
                                <button
                                    key={name}
                                    disabled={!image || isProcessing}
                                    onClick={() => handleTransform(name)}
                                    className={`w-full p-6 rounded-3xl border text-left transition-all flex items-center justify-between group ${selectedStyle === name ? 'border-gold bg-gold/10' : 'border-white/5 bg-white/5 hover:bg-white/10'} ${(!image || isProcessing) ? 'opacity-30' : ''}`}
                                >
                                    <div className="flex items-center gap-5">
                                        <div className={`p-4 rounded-2xl ${selectedStyle === name ? 'bg-gold text-graphite shadow-lg shadow-gold/20' : 'bg-white/10 text-white/40'}`}>
                                            <i data-lucide={config.icon} className="w-6 h-6"></i>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-md tracking-wide">{name}</h4>
                                            <p className="text-[10px] text-white/30 uppercase mt-1 tracking-widest font-bold">{config.desc}</p>
                                        </div>
                                    </div>
                                    {selectedStyle === name && <div className="w-2 h-2 bg-gold rounded-full animate-ping"></div>}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <button 
                        disabled={!image || isProcessing}
                        onClick={() => handleTransform()}
                        className={`w-full py-6 rounded-[30px] font-display font-bold text-xl shadow-2xl transition-all flex items-center justify-center gap-4 active:scale-95 ${image && !isProcessing ? 'bg-olive-soft text-white hover:bg-olive-dark shadow-olive-soft/20' : 'bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed'}`}
                    >
                        <i data-lucide="zap" className={`w-6 h-6 ${isProcessing ? 'animate-bounce' : ''}`}></i>
                        {isProcessing ? 'Processando...' : 'Regerar com IA'}
                    </button>
                    
                    <div className="p-6 bg-terracotta/5 rounded-3xl border border-terracotta/10">
                        <p className="text-[10px] font-black text-terracotta uppercase tracking-widest mb-2">Nota de Segurança</p>
                        <p className="text-[11px] text-terracotta/70 font-medium leading-relaxed">
                            Esta interface simula a conexão com APIs de alta latência como DALL-E e Stable Diffusion para demonstração técnica.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

window.VisionModule = VisionModule;
VisionModule;
