import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    motion,
    AnimatePresence,
} from 'framer-motion';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area
} from 'recharts';
import {
    ShieldAlert,
    BrainCircuit,
    CheckCircle2,
    XCircle,
    BarChart3,
    ChevronRight,
    AlertTriangle,
    Share2,
    Eye,
    RefreshCcw,
    ScanSearch,
    ChevronDown,
    ChevronUp,
    Sparkles,
    ArrowRight,
    Fingerprint
} from 'lucide-react';

// --- UI Text Configuration ---
const UI_TEXT = {
    brand: {
        name: "Truth",
        suffix: "Initiative"
    },
    nav: {
        research: "Research & Data",
        quiz: "Interactive Quiz"
    },
    hero: {
        badge: "Global Perspective Project 25/26",
        titleMain: "Fighting Hoax in the",
        titleGradient: "Age of AI",
        description: "An in-depth analysis of the widespread of hoax, its dangers and the ways to prevent it. Especially in the modern era of AI technology.",
        btnPrimary: "Explore Data",
        btnSecondary: "Play Game"
    },
    abstract: [
        {
            icon: AlertTriangle,
            title: "Scale of Information",
            text: "Petabytes of information is being uploaded online every second. It is nearly impossible to verify that every piece of information is valid.",
            source: "Spectralplex"
        },
        {
            icon: BrainCircuit,
            title: "Effects of AI",
            text: "AI models can now generate realistic and convincing images in under a minute. This allows nearly anybody to create mass amounts of believable fake news.",
            source: "CNET (2025)"
        },
        {
            icon: Share2,
            title: "Online Activity",
            text: "In recent years, online activity has spiked. Including the consumption and sharing of information which has only helped the widespread of hoaxes.",
            source: "Bond Internet Trends (2024)"
        }
    ],
    stats: {
        heading: "Quantitative Data",
        subtitle: "Analyzing trends and findings based on Mafindo's annual hoax reports (2018-2023).",
        chart1: {
            title: "Identified Hoaxes in Indonesia",
            totalLabel: "Total Hoax Articles",
            politicsLabel: "Politics-Related",
            description: "Data shows how much number of hoaxes has increased over the years (including political hoaxes). This shows how hoaxes are a growing problem, especially due to how it can interfere with critical fields such as politics.",
            source: "Chairman of Mafindo - Septiaji Eko Nugroho in Kompas.com (2024)"
        },
        chart2: {
            title: "Hoax Medium Distribution",
            description: "The data shows how much hoaxes use images to convince the mass. From here we could see the problems visual media poses compared to video.",
            source: "Dufour, Pathak, et al., 2024"
        }
    },
    protocol: {
        heading: "How to Identify",
        subtitle: "A simple approach to detect hoaxes for everyday users.",
        steps: [
            { step: "1", title: "Common Characteristics", desc: "Hoaxes often use provocative language to invoke panic while also urging viewers to share to support its widespread." },
            { step: "2", title: "Image Analysis", desc: "AI generated or edited images often look unnatural. Search for abnormalities in complex details such as lighting, physics, and reflection." },
            { step: "3", title: "Cross-checking", desc: "Verify the information by rechecking and comparing with credible sources. If it is also reported by those sources, it most likely is true." }
        ]
    },
    cta: {
        heading: "Can you spot the hoax?",
        subheading: "Test your ability to distinguish between what is real and what is fake.",
        button: "Start Quiz"
    },
    quiz: {
        start: {
            title: "Real or Hoax?",
            description: "Ten questions. Two options. Can you really distinguish between real and fake news?",
            button: "Start Quiz"
        },
        playing: {
            caseFile: "Question",
            artifactLabel: "Visual Evidence",
            btnReal: "Real",
            btnHoax: "Hoax",
            btnNext: "Next Question",
            correctTitle: "Correct",
            incorrectTitle: "Incorrect"
        },
        end: {
            title: "Assessment Complete",
            accuracyLabel: "Final Score",
            retryBtn: "Play Again"
        }
    },
    footer: "Global Perspective Proof Of Action - Website by Mikael Krishna"
};

// --- Data & Constants ---
const researchData = [
    { year: '2018', total: 997, politics: 487 },
    { year: '2019', total: 1221, politics: 643 },
    { year: '2020', total: 2298, politics: 700 },
    { year: '2021', total: 1888, politics: 428 },
    { year: '2022', total: 1698, politics: 548 },
    { year: '2023', total: 2330, politics: 1293 },
];

const sourceData = [
    { name: 'Image', value: 97 },
    { name: 'Video', value: 3 }
];

const quizQuestions = [
    {
        id: 1,
        headline: "North Korea's Kim Jong Un says country to increase number of nuclear weapons 'exponentially'.",
        type: "REAL",
        explanation: "News published by CNN in September 2024 about Kim Jong Un's controversial statement.",
        image: "images/q1.jpg"
    },
    {
        id: 2,
        headline: "Mysterious Explosion near Pentagon Sparks Fear and Chaos",
        type: "HOAX",
        explanation: "Although now to most people this clearly looks AI-generated, this image successfully tricked many in 2023 and briefly affected financial markets.",
        image: "images/q2.jpg"
    },
    {
        id: 3,
        headline: "Cargo plane slides off runway in Hong Kong, killing 2 airport staff",
        type: "REAL",
        explanation: "This is real news released by CBC about an airplane runway accident in October 2025.",
        image: "images/q3.jpg"
    },
    {
        id: 4,
        headline: "Driving lesson ends gravely, killing 2 including driving instructor.",
        type: "HOAX",
        explanation: "This was generated completely free using Whisk in under 3 minutes. The lettering on POLRI is weird and the blur is unnatural.",
        image: "images/q4.jpg"
    },
    {
        id: 5,
        headline: "Everyone Knew the Migrant Ship Was Doomed. No One Helped.",
        type: "REAL",
        explanation: "Investigative report by The New York Times (2023) about a real-world humanitarian crisis.",
        image: "images/q5.jpg"
    },
    {
        id: 6,
        headline: "$100M Smash and Grab Recorded By CCTV",
        type: "HOAX",
        explanation: "Generated using AI. The awkward postures and lighting inconsistencies indicate fabrication.",
        image: "images/q6.jpg"
    },
    {
        id: 7,
        headline: "Marshall Islands parliament burns down in overnight fire",
        type: "REAL",
        explanation: "Verified news published by international outlets reporting on a regional incident in 2025.",
        image: "images/q7.jpg"
    },
    {
        id: 8,
        headline: "Extinct species rediscovered at a small island near Australia",
        type: "HOAX",
        explanation: "The headline is taken from a legitimate news, but has been altered. The only way to really detect is by cross-checking.",
        image: "images/q8.jpg"
    },
    {
        id: 9,
        headline: "Florida man in Batman pajamas nabs suspected burglar.",
        type: "REAL",
        explanation: "Verified news article published by CBS News regarding a real (though absurd) crime report.",
        image: "images/q9.jpg"
    },
    {
        id: 10,
        headline: "Iran launches barrage of missiles at Israel following attack",
        type: "REAL",
        explanation: "Documented military conflict reported by CNN and BBC in 2025.",
        image: "images/q10.jpg"
    }
];

// --- Visual Assets ---

const FilmGrain = () => (
    <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-overlay">
        <svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'>
            <filter id='noise'>
                <feTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch' />
            </filter>
            <rect width='100%' height='100%' filter='url(#noise)' />
        </svg>
    </div>
);

const GlowSpot = ({ className }) => (
    <div className={`absolute rounded-full blur-[100px] opacity-20 pointer-events-none ${className}`} />
);

// --- Components ---

const SectionHeading = ({ children, subtitle }) => (
    <div className="mb-20">
        <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-medium text-white mb-6 tracking-tight"
        >
            {children}
        </motion.h2>
        <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-zinc-400 text-lg max-w-2xl leading-relaxed"
        >
            {subtitle}
        </motion.p>
    </div>
);

const DataCard = ({ title, icon: Icon, children, description, source }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 flex flex-col h-full hover:bg-zinc-900/60 transition-all duration-500 group">
            <div className="flex justify-between items-start mb-8">
                <h3 className="text-xl font-medium flex items-center gap-3 text-white">
                    <span className="p-2.5 bg-white/5 rounded-2xl group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition-colors">
                        <Icon size={20} className="text-zinc-300 group-hover:text-indigo-300" />
                    </span>
                    {title}
                </h3>
            </div>

            <div className="flex-grow w-full relative z-10">
                {children}
            </div>

            <div className="mt-8 pt-6 border-t border-white/5">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex justify-between items-center text-sm font-medium text-zinc-400 hover:text-white transition-colors group"
                >
                    <span className="flex items-center gap-2">
                        {isExpanded ? "Hide Analysis" : "View Analysis"}
                    </span>
                    <div className={`p-1.5 rounded-full bg-white/5 group-hover:bg-white/10 transition-all ${isExpanded ? 'rotate-180' : ''}`}>
                        <ChevronDown size={14} />
                    </div>
                </button>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="pt-6 pb-2">
                                <p className="text-sm text-zinc-300 leading-relaxed">
                                    {description}
                                </p>
                                <div className="mt-6 flex items-center gap-3 text-xs text-zinc-500">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                    <span className="uppercase tracking-widest">{source}</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

// --- Main App ---

export default function App() {
    const [activeTab, setActiveTab] = useState('research');

    useEffect(() => {
        document.documentElement.classList.add('dark');
    }, []);

    return (
        <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-indigo-500/20 selection:text-indigo-200 overflow-x-hidden">
            <FilmGrain />

            <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
                {/* Navbar */}
                <nav className="flex items-center justify-between py-8">
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveTab('research')}>
                        <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center rounded-xl backdrop-blur-md">
                            <ShieldAlert size={18} className="text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-lg tracking-tight text-white">{UI_TEXT.brand.name}</span>
                            <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{UI_TEXT.brand.suffix}</span>
                        </div>
                    </div>

                    <div className="hidden md:flex bg-zinc-900/50 p-1.5 rounded-full border border-white/5 backdrop-blur-xl">
                        <button
                            onClick={() => setActiveTab('research')}
                            className={`px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-300 ${activeTab === 'research'
                                ? 'bg-zinc-800 text-white shadow-sm border border-white/5'
                                : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                        >
                            {UI_TEXT.nav.research}
                        </button>
                        <button
                            onClick={() => setActiveTab('quiz')}
                            className={`px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-300 ${activeTab === 'quiz'
                                ? 'bg-zinc-800 text-white shadow-sm border border-white/5'
                                : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                        >
                            {UI_TEXT.nav.quiz}
                        </button>
                    </div>
                </nav>

                <main className="py-12 md:py-24">
                    <AnimatePresence mode="wait">
                        {activeTab === 'research' ? (
                            <ResearchSection key="research" setTab={setActiveTab} />
                        ) : (
                            <QuizSection key="quiz" />
                        )}
                    </AnimatePresence>
                </main>

                <footer className="border-t border-white/5 py-12 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-zinc-500">
                    <p>{UI_TEXT.footer}</p>
                    <div className="flex gap-2">
                        <span className="w-2 h-2 rounded-full bg-zinc-800"></span>
                        <span className="w-2 h-2 rounded-full bg-zinc-800"></span>
                    </div>
                </footer>
            </div>
        </div>
    );
}

// --- Research Section ---

function ResearchSection({ setTab }) {
    const COLORS = ['#818cf8', '#34d399', '#fb7185', '#94a3b8'];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
            {/* Ambient Background Lights */}
            <GlowSpot className="top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20" />
            <GlowSpot className="bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/10" />

            {/* Hero */}
            <section className="mb-40 pt-10">
                <div className="flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-300 mb-8 backdrop-blur-md"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                        {UI_TEXT.hero.badge}
                    </motion.div>

                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-semibold tracking-tighter text-white mb-8 leading-[0.95]">
                        {UI_TEXT.hero.titleMain} <br />
                        <span className="text-zinc-600">
                            {UI_TEXT.hero.titleGradient}
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-zinc-400 font-light leading-relaxed mb-12 max-w-2xl">
                        {UI_TEXT.hero.description}
                    </p>

                    <div className="flex flex-wrap gap-4 justify-center">
                        <button
                            onClick={() => document.getElementById('stats').scrollIntoView({ behavior: 'smooth' })}
                            className="px-8 py-4 bg-white text-zinc-950 font-semibold rounded-full hover:bg-zinc-200 transition-colors flex items-center gap-2"
                        >
                            {UI_TEXT.hero.btnPrimary}
                            <ArrowRight size={18} />
                        </button>
                        <button
                            onClick={() => setTab('quiz')}
                            className="px-8 py-4 bg-zinc-900 border border-zinc-800 text-white font-semibold rounded-full hover:bg-zinc-800 transition-all"
                        >
                            {UI_TEXT.hero.btnSecondary}
                        </button>
                    </div>
                </div>
            </section>

            {/* Abstract Cards */}
            <section className="grid md:grid-cols-3 gap-6 mb-40">
                {UI_TEXT.abstract.map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-zinc-900/30 border border-white/5 p-8 rounded-[2rem] hover:bg-zinc-900/50 transition-colors flex flex-col justify-between h-full"
                    >
                        <div>
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-zinc-300 mb-6">
                                <item.icon size={22} />
                            </div>
                            <h3 className="text-xl font-medium text-white mb-4">{item.title}</h3>
                            <p className="text-base text-zinc-400 leading-relaxed font-light">{item.text}</p>
                        </div>
                        <div className="mt-8 text-xs text-zinc-600 font-medium uppercase tracking-wider">
                            Source: {item.source}
                        </div>
                    </motion.div>
                ))}
            </section>

            {/* Stats */}
            <div id="stats" className="scroll-mt-32 mb-40">
                <SectionHeading subtitle={UI_TEXT.stats.subtitle}>
                    {UI_TEXT.stats.heading}
                </SectionHeading>

                <div className="grid lg:grid-cols-2 gap-8">
                    <DataCard
                        title={UI_TEXT.stats.chart1.title}
                        icon={BarChart3}
                        description={UI_TEXT.stats.chart1.description}
                        source={UI_TEXT.stats.chart1.source}
                    >
                        <div className="h-[350px] w-full mt-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={researchData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#818cf8" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorPolitics" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#fb7185" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                    <XAxis dataKey="year" stroke="#52525b" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} dy={10} />
                                    <YAxis stroke="#52525b" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} dx={-10} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                                        itemStyle={{ color: '#e4e4e7', fontSize: '13px' }}
                                        cursor={{ stroke: '#52525b', strokeWidth: 1 }}
                                    />
                                    <Area type="monotone" dataKey="total" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" name={UI_TEXT.stats.chart1.totalLabel} />
                                    <Area type="monotone" dataKey="politics" stroke="#fb7185" strokeWidth={3} fillOpacity={1} fill="url(#colorPolitics)" name={UI_TEXT.stats.chart1.politicsLabel} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </DataCard>

                    <DataCard
                        title={UI_TEXT.stats.chart2.title}
                        icon={Share2}
                        description={UI_TEXT.stats.chart2.description}
                        source={UI_TEXT.stats.chart2.source}
                    >
                        <div className="h-[350px] w-full flex items-center justify-center mt-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={sourceData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={120}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                        cornerRadius={10}
                                    >
                                        {sourceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px' }}
                                        itemStyle={{ color: '#e4e4e7', fontSize: '13px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-center gap-8 text-sm text-zinc-400 mt-6">
                            {sourceData.map((entry, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                                    <span className="font-medium text-white">{entry.name}: {entry.value}%</span>
                                </div>
                            ))}
                        </div>
                    </DataCard>
                </div>
            </div>

            <section className="mb-40">
                <SectionHeading subtitle={UI_TEXT.protocol.subtitle}>
                    {UI_TEXT.protocol.heading}
                </SectionHeading>
                <div className="grid md:grid-cols-3 gap-6">
                    {UI_TEXT.protocol.steps.map((item, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -5 }}
                            className="bg-zinc-900/30 border border-white/5 p-10 rounded-[2.5rem] hover:bg-zinc-900/50 transition-all"
                        >
                            <span className="text-6xl font-semibold text-zinc-800 block mb-6">{item.step}</span>
                            <h3 className="text-xl font-medium mb-4 text-white">{item.title}</h3>
                            <p className="text-base text-zinc-400 leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            <div className="relative rounded-[3rem] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 to-purple-900/50"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>

                <div className="relative z-10 py-24 md:py-32 px-6 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-md mb-8">
                        <Sparkles className="text-indigo-200" size={32} />
                    </div>
                    <h2 className="text-4xl md:text-6xl font-semibold text-white mb-6 tracking-tight">
                        {UI_TEXT.cta.heading}
                    </h2>
                    <p className="text-indigo-200/80 mb-12 max-w-2xl mx-auto text-xl font-light">
                        {UI_TEXT.cta.subheading}
                    </p>
                    <button
                        onClick={() => setTab('quiz')}
                        className="px-12 py-5 bg-white text-indigo-950 text-lg font-bold rounded-full hover:scale-105 transition-transform shadow-2xl shadow-indigo-900/50"
                    >
                        {UI_TEXT.cta.button}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

// --- Quiz Section ---

function QuizSection() {
    const [gameState, setGameState] = useState('start');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15);
    const [showExplanation, setShowExplanation] = useState(false);
    const [userAnswer, setUserAnswer] = useState(null);
    const timerRef = useRef(null);

    const handleAnswer = useCallback((answer) => {
        if (timerRef.current) clearInterval(timerRef.current);
        setUserAnswer(answer);
        setShowExplanation(true);
        if (answer === quizQuestions[currentQuestion].type) {
            setScore(s => s + 1);
        }
    }, [currentQuestion]);

    useEffect(() => {
        if (gameState === 'playing' && !showExplanation) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        handleAnswer(null);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [gameState, currentQuestion, showExplanation, handleAnswer]);

    const startGame = () => {
        setGameState('playing');
        setCurrentQuestion(0);
        setScore(0);
        setTimeLeft(15);
        setShowExplanation(false);
        setUserAnswer(null);
    };

    const nextQuestion = () => {
        if (currentQuestion < quizQuestions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
            setTimeLeft(15);
            setShowExplanation(false);
            setUserAnswer(null);
        } else {
            setGameState('end');
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto min-h-[60vh] flex flex-col justify-center">
            {gameState === 'start' && (
                <div className="text-center py-20 px-8">
                    <div className="flex justify-center mb-10">
                        <div className="p-8 bg-zinc-900 rounded-[2.5rem] border border-zinc-800 shadow-2xl">
                            <Fingerprint size={64} className="text-indigo-400" />
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-semibold mb-8 text-white tracking-tight">{UI_TEXT.quiz.start.title}</h1>
                    <p className="text-xl text-zinc-400 mb-12 max-w-xl mx-auto leading-relaxed font-light">
                        {UI_TEXT.quiz.start.description}
                    </p>
                    <button
                        onClick={startGame}
                        className="px-12 py-5 bg-indigo-500 text-white font-bold text-lg rounded-full hover:bg-indigo-400 transition-all shadow-lg shadow-indigo-500/20"
                    >
                        {UI_TEXT.quiz.start.button}
                    </button>
                </div>
            )}

            {gameState === 'playing' && (
                <div className="flex flex-col gap-8">
                    <div className="flex justify-between items-center bg-zinc-900/50 p-6 rounded-[2rem] border border-zinc-800/50 backdrop-blur-xl">
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider bg-zinc-800/50 px-4 py-2 rounded-full">
                                {UI_TEXT.quiz.playing.caseFile} {currentQuestion + 1} / {quizQuestions.length}
                            </span>
                            <div className="flex gap-1.5">
                                {quizQuestions.map((_, i) => (
                                    <div key={i} className={`h-2 w-2 rounded-full transition-all duration-500 ${i <= currentQuestion ? 'bg-indigo-500' : 'bg-zinc-800'}`} />
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`text-xl font-bold font-mono ${timeLeft < 5 ? 'text-rose-500' : 'text-white'}`}>
                                00:{String(timeLeft).padStart(2, '0')}
                            </span>
                            <RefreshCcw size={18} className={`text-zinc-500 ${!showExplanation ? 'animate-spin' : ''}`} />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 items-start">
                        <div className="relative group rounded-[2.5rem] overflow-hidden shadow-2xl border border-zinc-800 bg-zinc-900">
                            <div className="aspect-[4/3] relative">
                                <img
                                    src={quizQuestions[currentQuestion].image}
                                    alt="Evidence"
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/800x600?text=Image+Unavailable'; }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent pointer-events-none"></div>

                                {showExplanation && (
                                    <motion.div
                                        initial={{ top: '0%' }}
                                        animate={{ top: '100%' }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        className="absolute left-0 right-0 h-0.5 bg-indigo-400 shadow-[0_0_20px_#818cf8] z-20"
                                    />
                                )}
                            </div>
                            <div className="absolute bottom-6 left-6 right-6 flex justify-between text-xs font-medium text-zinc-300">
                                <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/5">Ref: {quizQuestions[currentQuestion].id}X</span>
                            </div>
                        </div>

                        <div className="flex flex-col h-full justify-center py-4">
                            <h2 className="text-2xl md:text-3xl font-medium text-white leading-snug mb-10">
                                "{quizQuestions[currentQuestion].headline}"
                            </h2>

                            {!showExplanation ? (
                                <div className="flex flex-col gap-4">
                                    <button
                                        onClick={() => handleAnswer('REAL')}
                                        className="p-6 bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/50 hover:bg-emerald-500/5 rounded-3xl text-left transition-all group flex items-center justify-between"
                                    >
                                        <span className="text-xl font-medium text-white group-hover:text-emerald-300">{UI_TEXT.quiz.playing.btnReal}</span>
                                        <div className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center group-hover:border-emerald-500 group-hover:bg-emerald-500/20">
                                            <div className="w-2 h-2 rounded-full bg-zinc-700 group-hover:bg-emerald-400 transition-colors"></div>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => handleAnswer('HOAX')}
                                        className="p-6 bg-zinc-900/50 border border-zinc-800 hover:border-rose-500/50 hover:bg-rose-500/5 rounded-3xl text-left transition-all group flex items-center justify-between"
                                    >
                                        <span className="text-xl font-medium text-white group-hover:text-rose-300">{UI_TEXT.quiz.playing.btnHoax}</span>
                                        <div className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center group-hover:border-rose-500 group-hover:bg-rose-500/20">
                                            <div className="w-2 h-2 rounded-full bg-zinc-700 group-hover:bg-rose-400 transition-colors"></div>
                                        </div>
                                    </button>
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`p-8 rounded-[2rem] border ${userAnswer === quizQuestions[currentQuestion].type ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'}`}
                                >
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className={`p-3 rounded-full ${userAnswer === quizQuestions[currentQuestion].type ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                            {userAnswer === quizQuestions[currentQuestion].type
                                                ? <CheckCircle2 size={24} />
                                                : <XCircle size={24} />
                                            }
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white">
                                                {userAnswer === quizQuestions[currentQuestion].type ? UI_TEXT.quiz.playing.correctTitle : UI_TEXT.quiz.playing.incorrectTitle}
                                            </h3>
                                            <p className="text-sm text-zinc-400">
                                                Verdict: <span className="font-medium text-white">{quizQuestions[currentQuestion].type}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <p className="text-zinc-300 mb-8 leading-relaxed text-sm">
                                        {quizQuestions[currentQuestion].explanation}
                                    </p>

                                    <button
                                        onClick={nextQuestion}
                                        className="w-full py-4 bg-white text-zinc-950 font-bold rounded-2xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                                    >
                                        {UI_TEXT.quiz.playing.btnNext} <ArrowRight size={18} />
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {gameState === 'end' && (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="relative mb-12">
                        <svg className="w-64 h-64 -rotate-90">
                            <circle cx="128" cy="128" r="120" stroke="#27272a" strokeWidth="6" fill="none" />
                            <motion.circle
                                cx="128" cy="128" r="120" stroke="#6366f1" strokeWidth="6" fill="none"
                                strokeDasharray="753"
                                initial={{ strokeDashoffset: 753 }}
                                animate={{ strokeDashoffset: 753 - (753 * (score / quizQuestions.length)) }}
                                transition={{ duration: 1.5, ease: "circOut" }}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-6xl font-bold text-white tracking-tight">{score * 10}%</span>
                            <span className="text-sm text-zinc-500 font-medium uppercase tracking-widest mt-2">{UI_TEXT.quiz.end.accuracyLabel}</span>
                        </div>
                    </div>

                    <h2 className="text-3xl font-semibold text-white mb-6">{UI_TEXT.quiz.end.title}</h2>
                    <p className="text-zinc-400 max-w-md text-center mb-12 text-lg font-light leading-relaxed">
                        {score >= 8 ? "Excellent work! Your digital literacy skills are sharp." :
                            score >= 5 ? "Not bad. But stay vigilant—hoaxes are getting harder to spot." :
                                "It looks like you might be vulnerable to misinformation. Review the identification protocols."}
                    </p>

                    <button
                        onClick={startGame}
                        className="px-10 py-4 bg-white text-zinc-950 font-bold rounded-full hover:bg-zinc-200 transition-colors"
                    >
                        {UI_TEXT.quiz.end.retryBtn}
                    </button>
                </div>
            )}
        </motion.div>
    );
}
