import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
    ShieldAlert, BrainCircuit, CheckCircle2, XCircle,
    BarChart3, AlertTriangle, Share2, RefreshCcw,
    ChevronDown, ArrowRight, Fingerprint
} from 'lucide-react';

// ─── Design Token ─────────────────────────────────────────────────────────────
const AMBER = '#d4a843';

// ─── UI Text ──────────────────────────────────────────────────────────────────
const UI_TEXT = {
    brand: { name: 'Truth', suffix: 'Initiative' },
    nav: { research: 'Research & Data', quiz: 'Interactive Quiz' },
    ticker: [
        '2,330 hoaxes identified in Indonesia (2023)',
        '97% of all hoaxes rely on images to deceive',
        'AI can generate convincing images in under 1 minute',
        'Political hoaxes rose 136% from 2022 to 2023',
        'Always verify information with credible sources',
    ],
    hero: {
        badge: 'Global Perspective Project 25/26',
        titleA: 'Fighting Hoax',
        titleB: 'in the',
        titleC: 'Age of AI',
        description: 'An in-depth analysis of how hoaxes spread, their dangers, and the ways to fight them — especially in the modern era of AI.',
        btnPrimary: 'Explore Data',
        btnSecondary: 'Take the Quiz',
    },
    heroStats: [
        { value: 2330, suffix: '', label: 'Hoaxes Identified', note: 'Indonesia, 2023' },
        { value: 97, suffix: '%', label: 'Image-Based Hoaxes', note: 'Of all hoax types' },
        { value: 1, suffix: 'min', label: 'AI Image Gen Time', note: 'Realistic & convincing' },
    ],
    abstract: [
        { icon: AlertTriangle, num: '01', title: 'Scale of Information', text: 'Petabytes of information are uploaded online every second. It is nearly impossible to verify every piece.', source: 'Spectralplex' },
        { icon: BrainCircuit, num: '02', title: 'Effects of AI', text: 'AI models can generate realistic images in under a minute — enabling mass production of believable misinformation.', source: 'CNET (2025)' },
        { icon: Share2, num: '03', title: 'Online Activity', text: 'Online activity has spiked in recent years, accelerating the consumption and spread of unverified information.', source: 'Bond Internet Trends (2024)' },
    ],
    stats: {
        label: 'Quantitative Data',
        subtitle: "Analyzing trends based on Mafindo's annual hoax reports (2018–2023).",
        chart1: {
            title: 'Identified Hoaxes in Indonesia',
            totalLabel: 'Total Hoax Articles',
            politicsLabel: 'Politics-Related',
            description: 'Hoax volume has increased significantly over the years. Political hoaxes surged especially fast — demonstrating how misinformation threatens democratic processes.',
            source: 'Septiaji Eko Nugroho, Chairman of Mafindo, Kompas.com (2024)',
        },
        chart2: {
            title: 'Hoax Medium Distribution',
            description: 'Images overwhelmingly dominate as the medium for hoaxes. Visual deception is far more prevalent than video-based misinformation.',
            source: 'Dufour, Pathak, et al., 2024',
        },
    },
    protocol: {
        label: 'How to Identify',
        subtitle: 'A practical three-step approach to detecting hoaxes.',
        steps: [
            { num: '01', title: 'Common Characteristics', desc: 'Hoaxes often use provocative language to invoke panic, while urging viewers to share — accelerating their spread.' },
            { num: '02', title: 'Image Analysis', desc: 'AI-generated images often look unnatural. Look for abnormalities in lighting, physics, reflections, and fine details.' },
            { num: '03', title: 'Cross-checking', desc: 'Verify by comparing with credible sources. If multiple reputable outlets report it, it is most likely true.' },
        ],
    },
    cta: {
        label: 'Test Yourself',
        heading: 'Can you spot the',
        headingAccent: 'hoax?',
        subheading: 'Test your ability to distinguish real news from fabricated content.',
        button: 'Start Quiz',
    },
    quiz: {
        start: { label: 'Interactive Quiz', title: 'Real or Hoax?', description: 'Ten questions. Two options. Can you really distinguish between real and fake news?', button: 'Start the Test' },
        playing: { label: 'Question', evidenceLabel: 'Visual Evidence', btnReal: 'Real', btnHoax: 'Hoax', btnNext: 'Next Question', correctTitle: 'Correct', incorrectTitle: 'Incorrect' },
        end: { label: 'Assessment Complete', scoreLabel: 'Detection Score', retryBtn: 'Try Again' },
    },
    footer: 'Global Perspective Proof Of Action — Website by Mikael Krishna',
};

// ─── Data ─────────────────────────────────────────────────────────────────────
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
    { name: 'Video', value: 3 },
];

const quizQuestions = [
    { id: 1, headline: "North Korea's Kim Jong Un says country to increase number of nuclear weapons 'exponentially'.", type: 'REAL', explanation: "News published by CNN in September 2024 about Kim Jong Un's controversial statement.", image: 'images/q1.jpg' },
    { id: 2, headline: 'Mysterious Explosion near Pentagon Sparks Fear and Chaos', type: 'HOAX', explanation: 'Although now to most people this clearly looks AI-generated, this image successfully tricked many in 2023 and briefly affected financial markets.', image: 'images/q2.jpg' },
    { id: 3, headline: 'Cargo plane slides off runway in Hong Kong, killing 2 airport staff', type: 'REAL', explanation: 'This is real news released by CBC about an airplane runway accident in October 2025.', image: 'images/q3.jpg' },
    { id: 4, headline: 'Driving lesson ends gravely, killing 2 including driving instructor.', type: 'HOAX', explanation: 'This was generated completely free using Whisk in under 3 minutes. The lettering on POLRI is weird and the blur is unnatural.', image: 'images/q4.jpg' },
    { id: 5, headline: 'Everyone Knew the Migrant Ship Was Doomed. No One Helped.', type: 'REAL', explanation: 'Investigative report by The New York Times (2023) about a real-world humanitarian crisis.', image: 'images/q5.jpg' },
    { id: 6, headline: '$100M Smash and Grab Recorded By CCTV', type: 'HOAX', explanation: 'Generated using AI. The awkward postures and lighting inconsistencies indicate fabrication.', image: 'images/q6.jpg' },
    { id: 7, headline: 'Marshall Islands parliament burns down in overnight fire', type: 'REAL', explanation: 'Verified news published by international outlets reporting on a regional incident in 2025.', image: 'images/q7.jpg' },
    { id: 8, headline: 'Extinct species rediscovered at a small island near Australia', type: 'HOAX', explanation: 'The headline is taken from a legitimate news, but has been altered. The only way to really detect is by cross-checking.', image: 'images/q8.jpg' },
    { id: 9, headline: 'Florida man in Batman pajamas nabs suspected burglar.', type: 'REAL', explanation: 'Verified news article published by CBS News regarding a real (though absurd) crime report.', image: 'images/q9.jpg' },
    { id: 10, headline: 'Iran launches barrage of missiles at Israel following attack', type: 'REAL', explanation: 'Documented military conflict reported by CNN and BBC in 2025.', image: 'images/q10.jpg' },
];

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useCountUp(end, duration = 2.5) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isInView) return;
        let frame;
        let start = null;
        const tick = (ts) => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / (duration * 1000), 1);
            setCount(Math.round((1 - Math.pow(1 - p, 3)) * end));
            if (p < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [isInView, end, duration]);

    return [ref, count];
}

// ─── Animation Variants ───────────────────────────────────────────────────────
const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

// ─── Visual Primitives ────────────────────────────────────────────────────────
const FilmGrain = () => (
    <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.02] mix-blend-overlay">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <filter id="fg">
                <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#fg)" />
        </svg>
    </div>
);

const DotGrid = () => (
    <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.022) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
        }}
    />
);

const TickerTape = () => {
    const doubled = [...UI_TEXT.ticker, ...UI_TEXT.ticker];
    return (
        <div className="overflow-hidden py-2.5 border-b border-amber-400/10" style={{ backgroundColor: 'rgba(212,168,67,0.025)' }}>
            <div className="flex whitespace-nowrap" style={{ animation: 'ticker 32s linear infinite' }}>
                {doubled.map((item, i) => (
                    <span
                        key={i}
                        className="flex-shrink-0 px-10 text-[10px] font-mono uppercase tracking-[0.2em]"
                        style={{ color: 'rgba(212,168,67,0.5)' }}
                    >
                        ◆ {item}
                    </span>
                ))}
            </div>
        </div>
    );
};

// ─── Shared Components ────────────────────────────────────────────────────────
const SectionLabel = ({ children }) => (
    <div className="flex items-center gap-3 mb-5">
        <span className="block w-5 h-px" style={{ backgroundColor: 'rgba(212,168,67,0.45)' }} />
        <span className="text-[10px] font-mono uppercase tracking-[0.25em]" style={{ color: 'rgba(212,168,67,0.6)' }}>
            {children}
        </span>
    </div>
);

function StatCounter({ value, suffix, label, note }) {
    const [ref, count] = useCountUp(value);
    return (
        <div ref={ref}>
            <div className="font-mono font-bold text-white tabular-nums leading-none" style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)' }}>
                {count.toLocaleString()}
                {suffix && <span style={{ color: AMBER }}>{suffix}</span>}
            </div>
            <div className="text-sm text-zinc-400 mt-2 font-medium">{label}</div>
            <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mt-0.5">{note}</div>
        </div>
    );
}

function LegendItem({ color, label }) {
    return (
        <div className="flex items-center gap-2">
            <div className="w-5 h-px rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[10px] font-mono text-zinc-500">{label}</span>
        </div>
    );
}

const DataCard = ({ title, icon: Icon, children, description, source }) => {
    const [expanded, setExpanded] = useState(false);
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col rounded-2xl border overflow-hidden"
            style={{ backgroundColor: '#111111', borderColor: 'rgba(255,255,255,0.06)' }}
        >
            <div className="flex items-center gap-3 px-7 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(212,168,67,0.1)' }}>
                    <Icon size={15} style={{ color: AMBER }} />
                </div>
                <span className="text-sm font-medium text-white">{title}</span>
            </div>
            <div className="px-7 pt-6 pb-4 flex-grow">{children}</div>
            <div className="px-7 pb-6 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                <button
                    onClick={() => setExpanded(v => !v)}
                    className="flex items-center justify-between w-full text-[10px] font-mono uppercase tracking-[0.2em] transition-colors duration-200"
                    style={{ color: expanded ? '#888' : '#555' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#aaa'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = expanded ? '#888' : '#555'; }}
                >
                    <span>{expanded ? 'Hide Analysis' : 'View Analysis'}</span>
                    <ChevronDown
                        size={12}
                        style={{ transition: 'transform 0.3s', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    />
                </button>
                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                        >
                            <p className="text-sm text-zinc-400 leading-relaxed mt-5 mb-4">{description}</p>
                            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
                                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: 'rgba(212,168,67,0.5)' }} />
                                {source}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
    const [activeTab, setActiveTab] = useState('research');

    useEffect(() => {
        document.documentElement.classList.add('dark');
    }, []);

    return (
        <div className="min-h-screen text-zinc-100 font-sans overflow-x-hidden" style={{ backgroundColor: '#0b0b0b' }}>
            <FilmGrain />
            <DotGrid />
            <TickerTape />
            <div className="relative z-10 max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-14">
                {/* Navbar */}
                <nav className="flex items-center justify-between py-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    <button className="flex items-center gap-3" onClick={() => setActiveTab('research')}>
                        <div className="w-8 h-8 flex items-center justify-center rounded-lg border"
                            style={{ backgroundColor: 'rgba(212,168,67,0.08)', borderColor: 'rgba(212,168,67,0.2)' }}>
                            <ShieldAlert size={15} style={{ color: AMBER }} />
                        </div>
                        <div className="flex flex-col leading-none text-left">
                            <span className="font-semibold text-sm text-white tracking-tight">{UI_TEXT.brand.name}</span>
                            <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-[0.2em] mt-0.5">{UI_TEXT.brand.suffix}</span>
                        </div>
                    </button>

                    <div className="hidden md:flex items-center gap-0.5 p-1 rounded-full border"
                        style={{ backgroundColor: '#111111', borderColor: 'rgba(255,255,255,0.06)' }}>
                        {[{ id: 'research', label: UI_TEXT.nav.research }, { id: 'quiz', label: UI_TEXT.nav.quiz }].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className="px-5 py-2 text-xs font-medium rounded-full transition-all duration-300"
                                style={{
                                    backgroundColor: activeTab === tab.id ? '#fff' : 'transparent',
                                    color: activeTab === tab.id ? '#111' : '#555',
                                }}
                                onMouseEnter={e => { if (activeTab !== tab.id) e.currentTarget.style.color = '#ccc'; }}
                                onMouseLeave={e => { if (activeTab !== tab.id) e.currentTarget.style.color = '#555'; }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </nav>

                <main className="py-14 md:py-20">
                    <AnimatePresence mode="wait">
                        {activeTab === 'research'
                            ? <ResearchSection key="research" setTab={setActiveTab} />
                            : <QuizSection key="quiz" />
                        }
                    </AnimatePresence>
                </main>

                <footer className="border-t py-9 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono uppercase tracking-wider"
                    style={{ borderColor: 'rgba(255,255,255,0.05)', color: '#444' }}>
                    <p>{UI_TEXT.footer}</p>
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: AMBER, opacity: 0.5 }} />
                        <span>Active</span>
                    </div>
                </footer>
            </div>
        </div>
    );
}

// ─── Research Section ─────────────────────────────────────────────────────────
function ResearchSection({ setTab }) {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>

            {/* ── Hero ── */}
            <section className="pt-6 pb-28 md:pb-36">
                <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
                    className="inline-flex items-center gap-2.5 mb-10 px-3.5 py-1.5 rounded-full border"
                    style={{ borderColor: 'rgba(212,168,67,0.25)', backgroundColor: 'rgba(212,168,67,0.05)' }}
                >
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: AMBER }} />
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em]" style={{ color: 'rgba(212,168,67,0.8)' }}>
                        {UI_TEXT.hero.badge}
                    </span>
                </motion.div>

                <motion.h1
                    initial="hidden" animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.14 } } }}
                    className="font-bold tracking-tighter leading-[0.88] mb-10"
                    style={{ fontSize: 'clamp(3.5rem,11vw,9rem)' }}
                >
                    <motion.span variants={fadeUp} className="block text-white">{UI_TEXT.hero.titleA}</motion.span>
                    <motion.span variants={fadeUp} className="block">
                        <span className="text-zinc-700">{UI_TEXT.hero.titleB} </span>
                        <span style={{ color: AMBER, animation: 'glitch 8s ease-in-out 2s infinite' }}>
                            {UI_TEXT.hero.titleC}
                        </span>
                    </motion.span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.7 }}
                    className="text-base md:text-lg text-zinc-500 leading-relaxed max-w-lg mb-10 font-light"
                >
                    {UI_TEXT.hero.description}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.5 }}
                    className="flex flex-wrap gap-3"
                >
                    <button
                        onClick={() => document.getElementById('data').scrollIntoView({ behavior: 'smooth' })}
                        className="flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-full transition-all duration-300"
                        style={{ backgroundColor: '#fff', color: '#111' }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = AMBER; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#fff'; }}
                    >
                        {UI_TEXT.hero.btnPrimary} <ArrowRight size={14} />
                    </button>
                    <button
                        onClick={() => setTab('quiz')}
                        className="flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-full transition-all duration-300 border"
                        style={{ borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', color: '#666' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#ccc'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#666'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                    >
                        {UI_TEXT.hero.btnSecondary}
                    </button>
                </motion.div>

                {/* Stats Row */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85, duration: 0.6 }}
                    className="mt-20 pt-10 grid grid-cols-3 gap-6 md:gap-12 max-w-xl border-t"
                    style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                >
                    {UI_TEXT.heroStats.map((s, i) => <StatCounter key={i} {...s} />)}
                </motion.div>
            </section>

            {/* ── Why It Matters ── */}
            <section className="mb-28">
                <SectionLabel>Why It Matters</SectionLabel>
                <div className="grid md:grid-cols-3 gap-4">
                    {UI_TEXT.abstract.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.55 }}
                            className="group p-7 rounded-2xl border flex flex-col transition-all duration-500"
                            style={{ backgroundColor: '#111111', borderColor: 'rgba(255,255,255,0.06)' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,168,67,0.2)'; e.currentTarget.style.backgroundColor = '#131311'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.backgroundColor = '#111111'; }}
                        >
                            <div className="flex items-start justify-between mb-7">
                                <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(212,168,67,0.08)' }}>
                                    <item.icon size={16} style={{ color: AMBER }} />
                                </div>
                                <span className="font-mono text-[10px] text-zinc-700">{item.num}</span>
                            </div>
                            <h3 className="text-base font-semibold text-white tracking-tight mb-2.5">{item.title}</h3>
                            <p className="text-sm text-zinc-500 leading-relaxed flex-grow">{item.text}</p>
                            <div className="mt-7 pt-5 border-t" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                                <span className="text-[10px] font-mono text-zinc-700 uppercase tracking-[0.15em]">Source: {item.source}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── Quantitative Data ── */}
            <section id="data" className="mb-28 scroll-mt-20">
                <SectionLabel>{UI_TEXT.stats.label}</SectionLabel>
                <p className="text-sm text-zinc-500 mb-10 max-w-md leading-relaxed">{UI_TEXT.stats.subtitle}</p>
                <div className="grid lg:grid-cols-2 gap-5">
                    <DataCard title={UI_TEXT.stats.chart1.title} icon={BarChart3}
                        description={UI_TEXT.stats.chart1.description} source={UI_TEXT.stats.chart1.source}>
                        <div className="h-64 w-full mt-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={researchData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="gTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={AMBER} stopOpacity={0.22} />
                                            <stop offset="100%" stopColor={AMBER} stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="gPolitics" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#e85555" stopOpacity={0.18} />
                                            <stop offset="100%" stopColor="#e85555" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.04)" vertical={false} />
                                    <XAxis dataKey="year" stroke="transparent"
                                        tick={{ fontSize: 10, fill: '#444', fontFamily: 'monospace' }} tickLine={false} dy={8} />
                                    <YAxis stroke="transparent"
                                        tick={{ fontSize: 10, fill: '#444', fontFamily: 'monospace' }} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f0f0f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '11px', padding: '8px 12px' }}
                                        itemStyle={{ color: '#bbb' }}
                                        labelStyle={{ color: '#666', fontFamily: 'monospace', fontSize: '10px', marginBottom: 4 }}
                                        cursor={{ stroke: 'rgba(255,255,255,0.06)', strokeWidth: 1 }}
                                    />
                                    <Area type="monotone" dataKey="total" stroke={AMBER} strokeWidth={1.5}
                                        fill="url(#gTotal)" name={UI_TEXT.stats.chart1.totalLabel}
                                        dot={false} activeDot={{ r: 3, fill: AMBER, strokeWidth: 0 }} />
                                    <Area type="monotone" dataKey="politics" stroke="#e85555" strokeWidth={1.5}
                                        fill="url(#gPolitics)" name={UI_TEXT.stats.chart1.politicsLabel}
                                        dot={false} activeDot={{ r: 3, fill: '#e85555', strokeWidth: 0 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 flex gap-5">
                            <LegendItem color={AMBER} label={UI_TEXT.stats.chart1.totalLabel} />
                            <LegendItem color="#e85555" label={UI_TEXT.stats.chart1.politicsLabel} />
                        </div>
                    </DataCard>

                    <DataCard title={UI_TEXT.stats.chart2.title} icon={Share2}
                        description={UI_TEXT.stats.chart2.description} source={UI_TEXT.stats.chart2.source}>
                        <div className="h-64 w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={sourceData} cx="50%" cy="50%"
                                        innerRadius={78} outerRadius={106}
                                        paddingAngle={4} dataKey="value" stroke="none"
                                        startAngle={90} endAngle={-270} cornerRadius={5}>
                                        <Cell fill={AMBER} />
                                        <Cell fill="rgba(255,255,255,0.06)" />
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f0f0f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '11px' }}
                                        itemStyle={{ color: '#bbb' }}
                                        formatter={(v) => [`${v}%`, '']}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="font-mono font-bold text-white tabular-nums" style={{ fontSize: '2.1rem' }}>97%</span>
                                <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mt-1">Images</span>
                            </div>
                        </div>
                        <div className="mt-3 flex justify-center gap-6">
                            {sourceData.map((d, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: i === 0 ? AMBER : 'rgba(255,255,255,0.1)' }} />
                                    <span className="text-[10px] font-mono text-zinc-500">
                                        {d.name}: <span className="text-zinc-200">{d.value}%</span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </DataCard>
                </div>
            </section>

            {/* ── How to Identify ── */}
            <section className="mb-28">
                <SectionLabel>{UI_TEXT.protocol.label}</SectionLabel>
                <p className="text-sm text-zinc-500 mb-2 max-w-md leading-relaxed">{UI_TEXT.protocol.subtitle}</p>
                <div className="mt-8">
                    {UI_TEXT.protocol.steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.55 }}
                            className="group flex gap-8 md:gap-14 py-9 px-3 -mx-3 rounded-xl transition-all duration-300"
                            style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(212,168,67,0.02)'; }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                        >
                            <div className="flex-shrink-0 w-10 pt-0.5">
                                <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: 'rgba(212,168,67,0.5)' }}>
                                    {step.num}
                                </span>
                            </div>
                            <div className="flex-grow min-w-0">
                                <h3 className="text-lg font-semibold text-white tracking-tight mb-2 transition-colors group-hover:text-amber-50">
                                    {step.title}
                                </h3>
                                <p className="text-sm text-zinc-500 leading-relaxed">{step.desc}</p>
                            </div>
                            <div className="flex-shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <ArrowRight size={14} style={{ color: AMBER }} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="mb-16">
                <div className="relative overflow-hidden rounded-3xl border px-10 py-20 md:py-28 text-center"
                    style={{ backgroundColor: '#111111', borderColor: 'rgba(255,255,255,0.06)' }}>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 rounded-full pointer-events-none"
                        style={{ backgroundColor: AMBER, opacity: 0.04, filter: 'blur(60px)' }} />
                    <div className="relative z-10">
                        <SectionLabel>{UI_TEXT.cta.label}</SectionLabel>
                        <h2 className="font-bold tracking-tighter text-white mb-5"
                            style={{ fontSize: 'clamp(2.5rem,7vw,5rem)' }}>
                            {UI_TEXT.cta.heading}{' '}
                            <span style={{ color: AMBER, animation: 'glitch 7s ease-in-out 1s infinite' }}>
                                {UI_TEXT.cta.headingAccent}
                            </span>
                        </h2>
                        <p className="text-sm text-zinc-500 mb-10 max-w-xs mx-auto leading-relaxed">
                            {UI_TEXT.cta.subheading}
                        </p>
                        <button
                            onClick={() => setTab('quiz')}
                            className="px-9 py-3.5 text-sm font-bold rounded-full transition-all duration-300"
                            style={{ backgroundColor: AMBER, color: '#111' }}
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#e8c060'; e.currentTarget.style.boxShadow = '0 0 40px rgba(212,168,67,0.3)'; }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = AMBER; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                            {UI_TEXT.cta.button}
                        </button>
                    </div>
                </div>
            </section>
        </motion.div>
    );
}

// ─── Quiz Section ─────────────────────────────────────────────────────────────
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
                setTimeLeft(prev => {
                    if (prev <= 1) { handleAnswer(null); return 0; }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
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
            setCurrentQuestion(p => p + 1);
            setTimeLeft(15);
            setShowExplanation(false);
            setUserAnswer(null);
        } else {
            setGameState('end');
        }
    };

    const q = quizQuestions[currentQuestion];
    const isCorrect = userAnswer === q?.type;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <AnimatePresence mode="wait">
                {/* ── Start ── */}
                {gameState === 'start' && (
                    <motion.div key="start"
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5 }}
                        className="min-h-[68vh] flex flex-col items-center justify-center text-center px-6 py-20"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}
                            className="mb-8 p-6 border rounded-2xl"
                            style={{ borderColor: 'rgba(212,168,67,0.2)', backgroundColor: 'rgba(212,168,67,0.05)' }}
                        >
                            <Fingerprint size={52} style={{ color: AMBER }} />
                        </motion.div>
                        <SectionLabel>{UI_TEXT.quiz.start.label}</SectionLabel>
                        <h1 className="font-bold tracking-tighter text-white mb-5" style={{ fontSize: 'clamp(2.8rem,8vw,5.5rem)' }}>
                            {UI_TEXT.quiz.start.title}
                        </h1>
                        <p className="text-sm text-zinc-500 mb-12 max-w-xs leading-relaxed">{UI_TEXT.quiz.start.description}</p>
                        <button
                            onClick={startGame}
                            className="px-9 py-3.5 text-sm font-bold rounded-full transition-all duration-300"
                            style={{ backgroundColor: AMBER, color: '#111' }}
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#e8c060'; e.currentTarget.style.boxShadow = '0 0 40px rgba(212,168,67,0.25)'; }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = AMBER; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                            {UI_TEXT.quiz.start.button}
                        </button>
                    </motion.div>
                )}

                {/* ── Playing ── */}
                {gameState === 'playing' && (
                    <motion.div key="playing"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
                        className="max-w-5xl mx-auto"
                    >
                        {/* Progress bar */}
                        <div className="mb-6 h-0.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                            <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: AMBER }}
                                animate={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>

                        {/* Meta row */}
                        <div className="flex items-center justify-between mb-7">
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-600">
                                    {UI_TEXT.quiz.playing.label} {currentQuestion + 1} / {quizQuestions.length}
                                </span>
                                <div className="flex gap-1.5">
                                    {quizQuestions.map((_, i) => (
                                        <div key={i} className="w-1.5 h-1.5 rounded-full transition-all duration-500"
                                            style={{
                                                backgroundColor: i < currentQuestion ? 'rgba(212,168,67,0.35)' : i === currentQuestion ? AMBER : 'rgba(255,255,255,0.08)',
                                                transform: i === currentQuestion ? 'scale(1.3)' : 'scale(1)',
                                            }} />
                                    ))}
                                </div>
                            </div>

                            {/* Timer pill */}
                            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border"
                                style={{ backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.07)' }}>
                                <svg className="w-3.5 h-3.5 -rotate-90" viewBox="0 0 14 14">
                                    <circle cx="7" cy="7" r="5" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" fill="none" />
                                    <motion.circle cx="7" cy="7" r="5"
                                        stroke={timeLeft < 5 ? '#f87171' : AMBER}
                                        strokeWidth="1.5" fill="none"
                                        strokeDasharray="31.4"
                                        animate={{ strokeDashoffset: 31.4 * (1 - timeLeft / 15) }}
                                        transition={{ duration: 0.9, ease: 'linear' }}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <span className="text-xs font-mono font-bold tabular-nums"
                                    style={{ color: timeLeft < 5 ? '#f87171' : '#fff' }}>
                                    {String(timeLeft).padStart(2, '0')}s
                                </span>
                            </div>
                        </div>

                        {/* Question content — fades per question */}
                        <AnimatePresence mode="wait">
                            <motion.div key={currentQuestion}
                                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }} transition={{ duration: 0.28 }}
                            >
                                <div className="grid md:grid-cols-2 gap-6 items-start">
                                    {/* Evidence image */}
                                    <div className="relative rounded-2xl overflow-hidden border group"
                                        style={{ backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.06)', aspectRatio: '4/3' }}>
                                        <img src={q.image} alt="Evidence"
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                                            onError={e => { e.target.style.display = 'none'; }}
                                        />
                                        <div className="absolute inset-0 pointer-events-none"
                                            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)' }} />

                                        {/* Scan line */}
                                        {showExplanation && (
                                            <motion.div
                                                initial={{ top: '-1px' }} animate={{ top: 'calc(100% + 1px)' }}
                                                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                                className="absolute left-0 right-0 h-px z-20"
                                                style={{
                                                    background: `linear-gradient(90deg, transparent 0%, ${AMBER} 40%, ${AMBER} 60%, transparent 100%)`,
                                                    boxShadow: `0 0 10px 1px rgba(212,168,67,0.6)`,
                                                }}
                                            />
                                        )}

                                        {/* Labels */}
                                        <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between">
                                            <span className="text-[9px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full border"
                                                style={{ backgroundColor: 'rgba(0,0,0,0.6)', borderColor: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', color: '#888' }}>
                                                Ref {q.id}X
                                            </span>
                                            {showExplanation && (
                                                <motion.span
                                                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                                    className="text-[9px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border"
                                                    style={q.type === 'REAL'
                                                        ? { backgroundColor: 'rgba(74,222,128,0.15)', borderColor: 'rgba(74,222,128,0.3)', color: '#4ade80' }
                                                        : { backgroundColor: 'rgba(248,113,113,0.15)', borderColor: 'rgba(248,113,113,0.3)', color: '#f87171' }
                                                    }
                                                >
                                                    {q.type}
                                                </motion.span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Answer panel */}
                                    <div className="flex flex-col py-1">
                                        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-600 mb-4">
                                            {UI_TEXT.quiz.playing.evidenceLabel}
                                        </p>
                                        <h2 className="text-xl md:text-2xl font-semibold text-white leading-snug tracking-tight mb-8">
                                            "{q.headline}"
                                        </h2>

                                        {!showExplanation ? (
                                            <div className="flex flex-col gap-3">
                                                <button
                                                    onClick={() => handleAnswer('REAL')}
                                                    className="flex items-center justify-between p-5 rounded-xl border transition-all duration-200"
                                                    style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.07)' }}
                                                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(74,222,128,0.3)'; e.currentTarget.style.backgroundColor = 'rgba(74,222,128,0.04)'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'; }}
                                                >
                                                    <span className="text-base font-semibold text-white">{UI_TEXT.quiz.playing.btnReal}</span>
                                                    <CheckCircle2 size={17} className="text-zinc-700" />
                                                </button>
                                                <button
                                                    onClick={() => handleAnswer('HOAX')}
                                                    className="flex items-center justify-between p-5 rounded-xl border transition-all duration-200"
                                                    style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.07)' }}
                                                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(248,113,113,0.3)'; e.currentTarget.style.backgroundColor = 'rgba(248,113,113,0.04)'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'; }}
                                                >
                                                    <span className="text-base font-semibold text-white">{UI_TEXT.quiz.playing.btnHoax}</span>
                                                    <XCircle size={17} className="text-zinc-700" />
                                                </button>
                                            </div>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                                                className="p-5 rounded-xl border"
                                                style={isCorrect
                                                    ? { borderColor: 'rgba(74,222,128,0.2)', backgroundColor: 'rgba(74,222,128,0.04)' }
                                                    : { borderColor: 'rgba(248,113,113,0.2)', backgroundColor: 'rgba(248,113,113,0.04)' }
                                                }
                                            >
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="p-1.5 rounded-lg"
                                                        style={{ backgroundColor: isCorrect ? 'rgba(74,222,128,0.12)' : 'rgba(248,113,113,0.12)' }}>
                                                        {isCorrect
                                                            ? <CheckCircle2 size={16} style={{ color: '#4ade80' }} />
                                                            : <XCircle size={16} style={{ color: '#f87171' }} />
                                                        }
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider"
                                                            style={{ color: isCorrect ? '#4ade80' : '#f87171' }}>
                                                            {isCorrect ? UI_TEXT.quiz.playing.correctTitle : UI_TEXT.quiz.playing.incorrectTitle}
                                                        </span>
                                                        <p className="text-[10px] font-mono text-zinc-600 mt-0.5">
                                                            Verdict: <span className="text-zinc-400">{q.type}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-zinc-400 leading-relaxed mb-5">{q.explanation}</p>
                                                <button
                                                    onClick={nextQuestion}
                                                    className="w-full py-3 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                                                    style={{ backgroundColor: '#fff', color: '#111' }}
                                                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#e8e8e8'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#fff'; }}
                                                >
                                                    {UI_TEXT.quiz.playing.btnNext} <ArrowRight size={14} />
                                                </button>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* ── End ── */}
                {gameState === 'end' && (
                    <motion.div key="end"
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
                        className="min-h-[68vh] flex flex-col items-center justify-center py-20"
                    >
                        <SectionLabel>{UI_TEXT.quiz.end.label}</SectionLabel>

                        {/* Score ring */}
                        <div className="relative mb-10">
                            <svg className="w-52 h-52 -rotate-90" viewBox="0 0 200 200">
                                <circle cx="100" cy="100" r="88" stroke="rgba(255,255,255,0.05)" strokeWidth="3" fill="none" />
                                <motion.circle cx="100" cy="100" r="88"
                                    stroke="url(#scoreGrad)" strokeWidth="3" fill="none"
                                    strokeDasharray="552.9"
                                    initial={{ strokeDashoffset: 552.9 }}
                                    animate={{ strokeDashoffset: 552.9 - (552.9 * score / quizQuestions.length) }}
                                    transition={{ duration: 1.8, ease: 'circOut', delay: 0.3 }}
                                    strokeLinecap="round"
                                />
                                <defs>
                                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#d4a843" />
                                        <stop offset="100%" stopColor="#f0cc60" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <motion.span
                                    className="font-mono font-bold text-white tabular-nums leading-none"
                                    style={{ fontSize: '3rem' }}
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                                >
                                    {score * 10}%
                                </motion.span>
                                <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mt-2">
                                    {UI_TEXT.quiz.end.scoreLabel}
                                </span>
                            </div>
                        </div>

                        <p className="text-sm text-zinc-400 max-w-xs text-center leading-relaxed mb-10">
                            {score >= 8
                                ? "Excellent — your media literacy is sharp. You're hard to fool."
                                : score >= 5
                                    ? 'Decent awareness. Stay vigilant — hoaxes are evolving.'
                                    : 'You may be vulnerable to misinformation. Review the detection protocols.'
                            }
                        </p>

                        <button
                            onClick={startGame}
                            className="px-8 py-3.5 text-sm font-bold rounded-full transition-all duration-300"
                            style={{ backgroundColor: AMBER, color: '#111' }}
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#e8c060'; }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = AMBER; }}
                        >
                            {UI_TEXT.quiz.end.retryBtn}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
