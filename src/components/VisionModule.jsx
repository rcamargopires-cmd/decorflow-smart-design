const STYLE_SUFFIX = ", High-end interior design, architectural photography, 8k resolution, realistic textures, cinematic lighting";
const NEGATIVE_PROMPT = "objetos flutuando, móveis duplicados, distorção de janelas, borrão excessivo, deformidades estruturais, baixa resolução";

const STYLE_CONFIG = {
    'Biofílico': {
        icon: 'leaf',
        desc: 'Natureza e bem-estar.',
        prompt: `Transform this room into a professional biophilic sanctuary, replacing current furniture with sustainable wood pieces and lush indoor plants, keeping the original window and door positions${STYLE_SUFFIX}`,
        reason: 'Biofilia aumenta a produtividade e reduz o estresse térmico.'
    },
    'Industrial': {
        icon: 'wrench',
        desc: 'Estrutura e modernidade.',
        prompt: `Transform this room into a professional industrial loft style, replacing current furniture with leather sofas, black metal tracks, and concrete textures, keeping the original window and door positions${STYLE_SUFFIX}`,
        reason: 'Valoriza a estrutura original com materiais nobres e brutos.'
    },
    'Escandinavo': {
        icon: 'snowflake',
        desc: 'Luz e minimalismo.',
        prompt: `Transform this room into a high-end scandinavian design, replacing furniture with light pine wood elements and neutral textiles, maximizing natural light while keeping structural openings${STYLE_SUFFIX}`,
        reason: 'Maximiza a percepção de amplitude e paz visual.'
    },
    'Moderno': {
        icon: 'monitor',
        desc: 'Linhas retas e elegância.',
        prompt: `Transform this room into a sleek modern interior, replacing clutter with minimal straight-line furniture, glass, and polished metal accents, maintaining architectural integrity${STYLE_SUFFIX}`,
        reason: 'Foco na sofisticação atemporal e funcionalidade extrema.'
    }
};

const VisionModule = ({ image, setImage, setExtractedColors }) => {
    const [selectedStyle, setSelectedStyle] = React.useState('Moderno');
    const [status, setStatus] = React.useState('');
    const [currentPrompt, setCurrentPrompt] = React.useState('');
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [sliderPos, setSliderPos] = React.useState(50);
    const [showComparison, setShowComparison] = React.useState(false);

    const callVisionAPI = async (img, params) => {
        // Simulação de chamada de API Profissional (SDXL / DALL-E 3)
        // Parâmetros: params.prompt, params.negativePrompt, params.denoisingStrength
        return new Promise((resolve) => {
            setTimeout(() => resolve(true), 3500);
        });
    };

    const getStyleFilter = () => {
        if (isProcessing) {
            if (status.includes('PROFUNDIDADE')) return 'blur(30px) brightness(1.5) contrast(1.5) hue-rotate(180deg)';
            if (status.includes('Limpeza')) return 'blur(15px) grayscale(100%) brightness(1.2)';
            return 'blur(5px) brightness(0.8)';
        }
        switch (selectedStyle) {
            case 'Industrial': return 'contrast(1.4) brightness(0.7) saturate(0.4) sepia(0.3)';
            case 'Biofílico': return 'saturate(2.0) brightness(1.1) hue-rotate(10deg) contrast(1.05)';
            case 'Escandinavo': return 'brightness(1.5) contrast(0.8) saturate(0.3)';
            case 'Moderno': return 'contrast(1.2) brightness(1.1) saturate(1.2) sepia(0.05)';
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
            canvas.width = 10; canvas.height = 10;
            ctx.drawImage(img, 0, 0, 10, 10);
            const data = ctx.getImageData(0, 0, 10, 10).data;
            const colors = [`rgb(${data[0]},${data[1]},${data[2]})`, `rgb(${data[4]},${data[5]},${data[6]})`].map((c, i) => ({
                name: `Tom ${i+1}`, color: c, type: i === 0 ? 'Dominante' : 'Acentuada'
            }));
            setExtractedColors(colors);
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
        
        setStatus('ANALISANDO PROFUNDIDADE (Depth Mapping)...');
        await new Promise(r => setTimeout(r, 1000));
        
        setStatus('LIMPANDO AMBIENTE (Força: 0.7)...');
        await new Promise(r => setTimeout(r, 1200));
        
        setStatus(`RECONSTRUINDO ESPAÇO COM IA...`);
        await callVisionAPI(image, {
            prompt: prompt,
            negativePrompt: NEGATIVE_PROMPT,
            denoisingStrength: 0.7
        });
        
        setIsProcessing(false);
        setShowComparison(true);
        setStatus('');
    };

    return (
        <div className="max-w-6xl mx-auto animate-slide-up">
            <div className="text-center mb-12">
                <span className="inline-block px-4 py-1.5 bg-terracotta/10 text-terracotta rounded-full text-[10px] font-black mb-4 border border-terracotta/20 uppercase tracking-[0.2em]">
                    High-Fidelity Inpainting
                </span>
                <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 tracking-tight">Redecoração <span className="text-olive-soft italic font-light">Evolutiva</span></h2>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto italic leading-relaxed">
                    Nossa IA mantém sua arquitetura enquanto substitui completamente o mobiliário com 70% de força de reconstrução.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                <div className="lg:col-span-8 space-y-6">
                    <div className="relative group overflow-hidden rounded-[60px] premium-shadow border border-gray-100 bg-white aspect-[16/10] flex flex-col items-center justify-center transition-all bg-gray-50 shadow-inner">
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
                                    <div className="absolute top-0 bottom-0 z-20 w-1.5 bg-white shadow-2xl flex items-center justify-center pointer-events-none" style={{ left: `${sliderPos}%` }}>
                                        <div className="w-14 h-14 bg-white rounded-full shadow-2xl flex flex-col items-center justify-center -ml-0 border-8 border-gray-50/20 backdrop-blur-sm">
                                            <i data-lucide="scan-eye" className="w-6 h-6 text-terracotta"></i>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center p-12">
                                <div className="w-24 h-24 bg-white rounded-[40px] flex items-center justify-center mx-auto mb-8 border border-gray-100 transition-all shadow-sm">
                                    <i data-lucide="image-plus" className="w-12 h-12 text-olive-soft"></i>
                                </div>
                                <h3 className="text-graphite font-display font-bold text-2xl mb-2">Capturar Ambiente</h3>
                                <p className="text-gray-400">Arraste ou clique para uma transformação de 70%.</p>
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleUpload} accept="image/*" />
                            </div>
                        )}
                        
                        {isProcessing && (
                            <div className="absolute inset-0 bg-graphite/95 backdrop-blur-3xl flex flex-col items-center justify-center text-white z-40 animate-fade-in px-12 text-center">
                                <div className="relative mb-10">
                                    <div className="w-20 h-20 border-4 border-terracotta/20 border-t-terracotta rounded-full animate-spin"></div>
                                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-terracotta">70%</div>
                                </div>
                                
                                <p className="font-display text-4xl font-bold tracking-tight mb-6 text-terracotta">{status}</p>
                                
                                <div className="grid grid-cols-1 gap-4 w-full max-w-2xl">
                                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10 text-left">
                                        <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2 font-black">Prompt de Estilo (Magazine Ready):</p>
                                        <p className="text-sm italic text-white/80 leading-relaxed">"{currentPrompt}"</p>
                                    </div>
                                    <div className="bg-terracotta/10 p-4 rounded-2xl border border-terracotta/20 text-left">
                                        <p className="text-[9px] uppercase tracking-widest text-terracotta font-black mb-1">Negative Prompt Filtro:</p>
                                        <p className="text-[11px] text-white/60">"{NEGATIVE_PROMPT}"</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {showComparison && !isProcessing && (
                        <div className="bg-white p-10 rounded-[50px] border border-gray-100 premium-shadow animate-slide-up">
                            <div className="flex items-center gap-6 mb-6">
                                <div className="w-16 h-16 bg-terracotta/10 rounded-2xl flex items-center justify-center">
                                    <i data-lucide="shield-check" className="w-8 h-8 text-terracotta"></i>
                                </div>
                                <div>
                                    <h4 className="font-display font-bold text-2xl tracking-tight">Redecoração Validada</h4>
                                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Denoising Strength: 0.7</p>
                                </div>
                            </div>
                            <p className="text-gray-500 leading-relaxed text-lg border-l-4 border-terracotta/30 pl-8 italic">
                                "{STYLE_CONFIG[selectedStyle].reason}"
                            </p>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-graphite p-8 rounded-[40px] text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12">
                            <i data-lucide="box" className="w-32 h-32"></i>
                        </div>
                        <h3 className="font-display font-bold text-xl mb-10 flex items-center gap-3 relative z-10">
                            Ambiente Inteligente
                        </h3>
                        
                        <div className="space-y-4 relative z-10">
                            {Object.entries(STYLE_CONFIG).map(([name, config]) => (
                                <button
                                    key={name}
                                    disabled={!image || isProcessing}
                                    onClick={() => handleTransform(name)}
                                    className={`w-full p-6 rounded-3xl border text-left transition-all flex items-center justify-between group ${selectedStyle === name ? 'border-terracotta bg-terracotta/10' : 'border-white/5 bg-white/5 hover:bg-white/10'} ${(!image || isProcessing) ? 'opacity-30' : ''}`}
                                >
                                    <div className="flex items-center gap-5">
                                        <div className={`p-4 rounded-2xl ${selectedStyle === name ? 'bg-terracotta text-white shadow-xl shadow-terracotta/20' : 'bg-white/10 text-white/40 font-bold'}`}>
                                            <i data-lucide={config.icon} className="w-6 h-6"></i>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm tracking-wide">{name}</h4>
                                            <p className="text-[10px] text-white/30 uppercase mt-1 tracking-widest font-black">70% Força</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

window.VisionModule = VisionModule;
VisionModule;
