const App = () => {
    const [activeModule, setActiveModule] = React.useState('vision');
    const [image, setImage] = React.useState(null);
    const [extractedColors, setExtractedColors] = React.useState([]);

    const renderModule = () => {
        switch (activeModule) {
            case 'vision':
                return <VisionModule image={image} setImage={setImage} setExtractedColors={setExtractedColors} />;
            case 'moodboard':
                return <MoodboardModule image={image} colors={extractedColors} setColors={setExtractedColors} />;
            case 'calculator':
                return <CalculatorModule />;
            default:
                return <VisionModule image={image} setImage={setImage} setExtractedColors={setExtractedColors} />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Header activeModule={activeModule} setActiveModule={setActiveModule} />
            
            <main className="flex-grow container mx-auto px-4 py-8 md:py-12 animate-fade-in text-graphite">
                {renderModule()}
            </main>

            <footer className="bg-graphite text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <i data-lucide="palette" className="text-olive-light"></i>
                                <span className="font-display text-2xl font-bold tracking-tight">Decor<span className="text-olive-light">Flow</span></span>
                            </div>
                            <p className="text-gray-400 max-w-xs">
                                Transformando espaços com inteligência artificial e design Biofílico para um futuro mais sustentável e harmônico.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-display text-lg font-semibold mb-6">Módulos</h4>
                            <ul className="space-y-3 text-gray-400">
                                <li><a href="#" onClick={() => setActiveModule('vision')} className="hover:text-olive-light transition-colors">IA Vision</a></li>
                                <li><a href="#" onClick={() => setActiveModule('moodboard')} className="hover:text-olive-light transition-colors">Moodboard Dinâmico</a></li>
                                <li><a href="#" onClick={() => setActiveModule('calculator')} className="hover:text-olive-light transition-colors">Calculadora Smart</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-display text-lg font-semibold mb-6">Contato</h4>
                            <p className="text-gray-400">contato@decorflow.com.br</p>
                            <div className="flex gap-4 mt-6">
                                <a href="#" className="p-2 bg-graphite-light rounded-full hover:bg-olive-soft transition-all"><i data-lucide="instagram" className="w-5 h-5"></i></a>
                                <a href="#" className="p-2 bg-graphite-light rounded-full hover:bg-olive-soft transition-all"><i data-lucide="linkedin" className="w-5 h-5"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
                        &copy; 2026 DecorFlow. Todos os direitos reservados.
                    </div>
                </div>
            </footer>
        </div>
    );
};

window.App = App;
