import React, { useState, useEffect, useRef } from 'react';
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
    ChevronUp
} from 'lucide-react';

// --- UI Text Configuration ---
// Centralized text for easy editing and source management

const UI_TEXT = {
    brand: {
        name: "Truth",
        suffix: "Initiative"
    },
    nav: {
        research: "Research & Data",
        quiz: "Interactive Game"
    },
    hero: {
        badge: "Global Perspective Project 2025/2026",
        titleMain: "Fighting Hoax in the",
        titleGradient: "Age of AI",
        description: "An in-depth analysis of the widespread of hoax, its dangers and the ways to prevent it. Especially in the modern era of AI technology.",
        btnPrimary: "Explore Data",
        btnSecondary: "Play the Game"
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
            title: "Identified Hoax in Indonesia",
            totalLabel: "Total Hoax Articles",
            politicsLabel: "Politics-Related",
            description: "Data shows how much number of hoaxes has increased over the years(including political hoaxes). This shows how hoaxes are a growing problem, especially due to how it can interfere with critical fields such as politics.",
            source: "Chairman of Mafindo - Septiaji Eko Nugroho in Kompas.com (2024)"
        },
        chart2: {
            title: "Hoax Medium Distribution",
            description: "The data shows how much hoaxes use images to convince the mass. From here we could see the problems ",
            source: "Dufour, Pathak, et al., 2024"
        }
    },
    protocol: {
        heading: "How to Identify",
        subtitle: "A simple approach to detect hoaxes for everyday users.",
        steps: [
            { step: "01", title: "Common Characteristics", desc: "Hoaxes often use provocative language to invoke panic while also urging viewers to share to support its widespread." },
            { step: "02", title: "Image Analysis", desc: "AI generated or edited images often look unnatural. Search for abnormalities in complex details such as lighting, physics, and reflection." },
            { step: "03", title: "Cross-checking", desc: "Verify the information by rechecking and comparing with credible sources. If it is also reported by those sources, it most likely is true." }
        ]
    },
    cta: {
        heading: "Can you spot the hoax?",
        subheading: "Test your ability to distinguish between what is real and what is fake. Ten questions with only two options. Is it real or is it hoax?",
        button: "Start Quiz"
    },
    quiz: {
        start: {
            title: "Real or Hoax?",
            description: "Ten questions. Two options. Can you really distinguish between real and fake news?",
            button: "Begin Quiz"
        },
        playing: {
            caseFile: "Question",
            artifactLabel: "Thumbnail",
            btnReal: "REAL",
            btnHoax: "HOAX",
            btnNext: "Next Question",
            correctTitle: "Right",
            incorrectTitle: "Wrong"
        },
        end: {
            title: "Assessment Complete",
            accuracyLabel: "Score",
            retryBtn: "Restart"
        }
    },
    footer: "Global Perspective Proof Of Action - Website by Mikael Krishna"
};

// --- Data & Constants ---
// Mafindo Findings Data (2018-2023)
const researchData = [
    { year: '2018', total: 997, politics: 487 },  // 48.9%
    { year: '2019', total: 1221, politics: 643 }, // 52.7%
    { year: '2020', total: 2298, politics: 700 }, // 30.5%
    { year: '2021', total: 1888, politics: 428 }, // 22.7%
    { year: '2022', total: 1698, politics: 548 }, // 32.3%
    { year: '2023', total: 2330, politics: 1293 }, // 55.5%
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
        explanation: "Although now most people can detect that this image is fake, it successfully tricked many in 2023 and briefly affected financial markets.",
        image: "images/q2.jpg"
    },
    {
        id: 3,
        headline: "Cargo plane slides off runway in Hong Kong, killing 2 airport staff",
        type: "REAL",
        explanation: "This is a real report about an aviation incident. Physical evidence and ATC recordings verified the event.",
        image: "images/q3.jpg"
    },
    {
        id: 4,
        headline: "Driving lesson ends gravely, killing 2 including driving instructor.",
        type: "HOAX",
        explanation: "Generated in under 3 minutes using AI. Lettering on POLRI is distorted and lighting is unnatural.",
        image: "images/q4.jpg"
    },
    {
        id: 5,
        headline: "Everyone Knew the Migrant Ship Was Doomed. No One Helped.",
        type: "REAL",
        explanation: "Investigative report by The New York Times (2023) detailing a real-world humanitarian crisis.",
        image: "images/q5.jpg"
    },
    {
        id: 6,
        headline: "$100M Smash and Grab Recorded By CCTV",
        type: "HOAX",
        explanation: "AI generated using Whisk. Abnormal human anatomy and light reflection inconsistencies reveal the fraud.",
        image: "images/q6.jpg"
    },
    {
        id: 7,
        headline: "Marshall Islands parliament burns down in overnight fire",
        type: "REAL",
        explanation: "Verified news published by international outlets reporting on regional incidents in 2025.",
        image: "images/q7.jpg"
    },
    {
        id: 8,
        headline: "Extinct species rediscovered at a small island near Australia",
        type: "HOAX",
        explanation: "False claim amplified using AI-generated imagery of fictional animals.",
        image: "images/q8.jpg"
    },
    {
        id: 9,
        headline: "Florida man in Batman pajamas nabs suspected burglar.",
        type: "REAL",
        explanation: "Verified news article published by CBS News regarding a real (though unusual) crime report.",
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

// --- Components ---

const SectionHeading = ({ children, subtitle }) => (
    <div className="mb-12 text-center">
        <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-slate-50 tracking-tight mb-4"
        >
            {children}
        </motion.h2>
        <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: 60 }}
            viewport={{ once: true }}
            className="h-1 bg-indigo-400 mx-auto mb-4"
        />
        <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-slate-400 max-w-2xl mx-auto"
        >
            {subtitle}
        </motion.p>
    </div>
);

const DataCard = ({ title, icon: Icon, children, description, source }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="p-6 md:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col h-full">
            <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-100 uppercase tracking-tight">
                    <Icon size={18} className="text-indigo-400" /> {title}
                </h3>
            </div>

            <div className="flex-grow w-full">
                {children}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
                <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-slate-500">
                    <div className="flex items-center gap-1">
                        <span className="font-black text-slate-400">Source:</span>
                        <span>{source}</span>
                    </div>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center gap-1 font-black text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                        {isExpanded ? "Hide Analysis" : "Expand Analysis"}
                        {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>
                </div>
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <p className="pt-4 text-sm text-slate-400 leading-relaxed italic border-l-2 border-indigo-500/30 pl-4 mt-4">
                                {description}
                            </p>
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
        <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex items-center justify-between py-6 sticky top-0 z-50 backdrop-blur-lg border-b border-slate-800/50">
                    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setActiveTab('research')}>
                        <div className="bg-indigo-600 text-white p-1.5 rounded-md shadow-lg shadow-indigo-500/20">
                            <ShieldAlert size={20} />
                        </div>
                        <span className="font-bold text-lg tracking-tight">
                            {UI_TEXT.brand.name}<span className="font-light text-slate-500">{UI_TEXT.brand.suffix}</span>
                        </span>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="flex space-x-1 bg-slate-900 p-1 rounded-full border border-slate-800">
                            <button
                                onClick={() => setActiveTab('research')}
                                className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all ${activeTab === 'research'
                                    ? 'bg-slate-800 text-indigo-400 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-300'
                                    }`}
                            >
                                {UI_TEXT.nav.research}
                            </button>
                            <button
                                onClick={() => setActiveTab('quiz')}
                                className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all ${activeTab === 'quiz'
                                    ? 'bg-slate-800 text-indigo-400 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-300'
                                    }`}
                            >
                                {UI_TEXT.nav.quiz}
                            </button>
                        </div>
                    </div>
                </nav>

                <main className="py-8">
                    <AnimatePresence mode="wait">
                        {activeTab === 'research' ? (
                            <ResearchSection key="research" setTab={setActiveTab} />
                        ) : (
                            <QuizSection key="quiz" />
                        )}
                    </AnimatePresence>
                </main>

                <footer className="border-t border-slate-800 mt-20 py-8 text-center text-slate-500 text-xs tracking-widest uppercase">
                    <p>{UI_TEXT.footer}</p>
                </footer>
            </div>
        </div>
    );
}

// --- Research Section ---

function ResearchSection({ setTab }) {
    const COLORS = ['#818cf8', '#34d399', '#f472b6', '#94a3b8'];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <section className="relative min-h-[70vh] flex flex-col justify-center items-center text-center mb-20 overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl"
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-indigo-900/30 border border-indigo-800/50 text-[10px] font-black uppercase tracking-widest mb-6 text-indigo-300">
                        {UI_TEXT.hero.badge}
                    </span>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-slate-50">
                        {UI_TEXT.hero.titleMain} <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-slate-400">
                            {UI_TEXT.hero.titleGradient}
                        </span>
                    </h1>
                    <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10">
                        {UI_TEXT.hero.description}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={() => document.getElementById('stats').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2">
                            {UI_TEXT.hero.btnPrimary} <ChevronRight size={18} />
                        </button>
                        <button onClick={() => setTab('quiz')} className="px-8 py-4 rounded-lg border border-slate-700 text-slate-100 font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                            {UI_TEXT.hero.btnSecondary} <BrainCircuit size={18} />
                        </button>
                    </div>
                </motion.div>
            </section>

            <section className="grid md:grid-cols-3 gap-8 mb-32">
                {UI_TEXT.abstract.map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                        className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/30 transition-colors group flex flex-col h-full"
                    >
                        <div className="p-3 bg-indigo-900/20 rounded-lg w-fit mb-6">
                            <item.icon className="w-6 h-6 text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-slate-100">{item.title}</h3>
                        <p className="text-slate-400 leading-relaxed text-sm flex-grow">{item.text}</p>
                        <div className="mt-4 pt-4 border-t border-slate-800 text-[10px] text-slate-500 flex items-center gap-1 font-mono uppercase">
                            <span className="font-bold">Source:</span> {item.source}
                        </div>
                    </motion.div>
                ))}
            </section>

            <div id="stats" className="scroll-mt-24">
                <SectionHeading subtitle={UI_TEXT.stats.subtitle}>
                    {UI_TEXT.stats.heading}
                </SectionHeading>

                <div className="grid lg:grid-cols-2 gap-8 mb-20 items-start">
                    <DataCard
                        title={UI_TEXT.stats.chart1.title}
                        icon={BarChart3}
                        description={UI_TEXT.stats.chart1.description}
                        source={UI_TEXT.stats.chart1.source}
                    >
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={researchData}>
                                    <defs>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorPolitics" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f472b6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#f472b6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="year" stroke="#64748b" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                                    <YAxis stroke="#64748b" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                                        itemStyle={{ color: '#f8fafc' }}
                                    />
                                    <Area type="monotone" dataKey="total" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" name={UI_TEXT.stats.chart1.totalLabel} />
                                    <Area type="monotone" dataKey="politics" stroke="#f472b6" strokeWidth={3} fillOpacity={1} fill="url(#colorPolitics)" name={UI_TEXT.stats.chart1.politicsLabel} />
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
                        <div className="h-[300px] w-full flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={sourceData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {sourceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                                        itemStyle={{ color: '#f8fafc' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-center gap-6 text-xs text-slate-400 mt-4 flex-wrap font-mono uppercase tracking-widest">
                            {sourceData.map((entry, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                                    <span>{entry.name}: {entry.value}%</span>
                                </div>
                            ))}
                        </div>
                    </DataCard>
                </div>
            </div>

            <section className="mb-32">
                <SectionHeading subtitle={UI_TEXT.protocol.subtitle}>
                    {UI_TEXT.protocol.heading}
                </SectionHeading>
                <div className="grid md:grid-cols-3 gap-8">
                    {UI_TEXT.protocol.steps.map((item, i) => (
                        <motion.div
                            key={i}
                            className="bg-slate-900 p-8 rounded-2xl border border-slate-800 text-center shadow-sm hover:border-indigo-500/30 transition-all"
                        >
                            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-2xl font-bold text-indigo-400 mx-auto mb-6 border border-slate-700">
                                {item.step}
                            </div>
                            <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                            <p className="text-sm text-slate-400">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            <div className="bg-indigo-900 rounded-3xl p-12 text-center relative overflow-hidden">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 relative z-10">{UI_TEXT.cta.heading}</h2>
                <p className="text-indigo-100 mb-8 max-w-2xl mx-auto relative z-10">
                    {UI_TEXT.cta.subheading}
                </p>
                <button
                    onClick={() => setTab('quiz')}
                    className="relative z-10 px-10 py-4 bg-white text-indigo-900 rounded-lg font-bold hover:scale-105 transition-transform shadow-lg"
                >
                    {UI_TEXT.cta.button}
                </button>
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

    const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

    // Fixed: handleAnswer is defined before the useEffect that calls it
    const handleAnswer = (answer) => {
        if (timerRef.current) clearInterval(timerRef.current);
        setUserAnswer(answer);
        setShowExplanation(true);
        if (answer === quizQuestions[currentQuestion].type) {
            setScore(s => s + 1);
        }
    };

    useEffect(() => {
        if (gameState === 'playing' && !showExplanation) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        handleAnswer(null); // Force move on timeout
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [gameState, currentQuestion, showExplanation]);

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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-3xl mx-auto">
            {gameState === 'start' && (
                <div className="text-center py-20">
                    <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-800">
                        <ScanSearch size={48} className="text-indigo-400" />
                    </div>
                    <h1 className="text-4xl font-bold mb-6 text-slate-100">{UI_TEXT.quiz.start.title}</h1>
                    <p className="text-lg text-slate-400 mb-10 max-w-lg mx-auto">
                        {UI_TEXT.quiz.start.description}
                    </p>
                    <button onClick={startGame} className="px-12 py-4 bg-indigo-600 text-white rounded-lg font-bold text-lg hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 uppercase tracking-widest">
                        {UI_TEXT.quiz.start.button}
                    </button>
                </div>
            )}

            {gameState === 'playing' && (
                <div className="relative">
                    <div className="w-full h-2 bg-slate-800 rounded-full mb-8 overflow-hidden">
                        <motion.div className="h-full bg-indigo-400" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                        <div className="flex justify-between items-center p-6 border-b border-slate-800/50 bg-slate-900/50">
                            <span className="text-xs font-black tracking-widest text-slate-500 uppercase">{UI_TEXT.quiz.playing.caseFile} {currentQuestion + 1} / {quizQuestions.length}</span>
                            <div className={`flex items-center gap-2 font-mono font-bold ${timeLeft < 5 ? 'text-rose-500' : 'text-slate-100'}`}>
                                <RefreshCcw className={`w-4 h-4 ${timeLeft > 0 && !showExplanation ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
                                00:{timeLeft.toString().padStart(2, '0')}
                            </div>
                        </div>

                        <div className="p-6 md:p-8">
                            <h2 className="text-xl md:text-2xl font-bold text-slate-50 mb-8 leading-tight italic">"{quizQuestions[currentQuestion].headline}"</h2>

                            <div className="w-full aspect-video bg-slate-950 rounded-xl mb-8 flex flex-col items-center justify-center border border-slate-800 relative group overflow-hidden">
                                <img
                                    src={quizQuestions[currentQuestion].image}
                                    alt="Evidence"
                                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/800x450?text=Visual+Artifact'; }}
                                />
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/20 pointer-events-none">
                                    <p className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-bold">{UI_TEXT.quiz.playing.artifactLabel}</p>
                                </div>
                            </div>

                            {!showExplanation ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <button onClick={() => handleAnswer('REAL')} className="py-4 rounded-xl border-2 border-emerald-900/50 hover:bg-emerald-900/20 text-emerald-400 font-bold transition-all uppercase tracking-widest text-xs">{UI_TEXT.quiz.playing.btnReal}</button>
                                    <button onClick={() => handleAnswer('HOAX')} className="py-4 rounded-xl border-2 border-rose-900/50 hover:bg-rose-900/20 text-rose-400 font-bold transition-all uppercase tracking-widest text-xs">{UI_TEXT.quiz.playing.btnHoax}</button>
                                </div>
                            ) : (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`rounded-xl p-6 ${userAnswer === quizQuestions[currentQuestion].type ? 'bg-emerald-900/20 border border-emerald-900/40' : 'bg-rose-900/20 border border-rose-900/40'}`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        {userAnswer === quizQuestions[currentQuestion].type ? <CheckCircle2 className="w-6 h-6 text-emerald-400" /> : <XCircle className="w-6 h-6 text-rose-400" />}
                                        <h3 className="text-xl font-bold text-slate-100 uppercase tracking-tight">{userAnswer === quizQuestions[currentQuestion].type ? UI_TEXT.quiz.playing.correctTitle : UI_TEXT.quiz.playing.incorrectTitle}</h3>
                                    </div>
                                    <p className="text-slate-400 text-sm leading-relaxed mb-6 italic border-l-2 border-slate-700 pl-4">"{quizQuestions[currentQuestion].explanation}"</p>
                                    <button onClick={nextQuestion} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 uppercase tracking-widest text-sm">
                                        {UI_TEXT.quiz.playing.btnNext}
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {gameState === 'end' && (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center shadow-2xl relative overflow-hidden">
                    <h2 className="text-3xl font-bold mb-2 text-slate-100">{UI_TEXT.quiz.end.title}</h2>
                    <div className="flex justify-center my-10">
                        <div className="text-6xl font-black text-indigo-400 drop-shadow-[0_0_15px_rgba(129,140,248,0.3)]">
                            {score * 10}%
                            <span className="text-[10px] block text-slate-500 uppercase tracking-[0.3em] mt-3 font-bold">{UI_TEXT.quiz.end.accuracyLabel}</span>
                        </div>
                    </div>
                    <p className="text-slate-400 mb-10 max-w-xs mx-auto text-sm leading-relaxed">
                        {score >= 8 ? "Excellent digital literacy. You possess strong critical thinking skills." :
                            score >= 5 ? "Average results. Be cautious of provocative headlines and verify sources." :
                                "Digital literacy calibration recommended. Review the identification protocols."}
                    </p>
                    <button onClick={startGame} className="px-10 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors uppercase tracking-widest text-xs shadow-xl shadow-indigo-600/20">
                        {UI_TEXT.quiz.end.retryBtn}
                    </button>
                </motion.div>
            )}
        </motion.div>
    );
}