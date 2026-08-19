"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowUpRight, 
  Sparkles, 
  Database, 
  FileSpreadsheet, 
  Check, 
  TrendingUp, 
  Sun, 
  Moon,
  Terminal,
  Activity,
  Plus,
  Trash2,
  ChevronDown,
  Layers,
  Cpu,
  CheckCircle2,
  Clock,
  Compass,
  AlertOctagon,
  Volume2
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// Web Audio API Synthesizer (Zero asset dependency)
const playSynthesizedSound = (type: "click" | "sonar" | "chime") => {
  try {
    if (typeof window === "undefined") return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    if (type === "click") {
      // Soft mechanical tick
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(750, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } else if (type === "chime") {
      // Warm organic chord chime
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
      osc.frequency.exponentialRampToValueAtTime(554.37, ctx.currentTime + 0.12); // C#5
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === "sonar") {
      // Classic deep marine sonar ping
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
      osc.frequency.exponentialRampToValueAtTime(820, ctx.currentTime + 1.2);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.8);
    }
  } catch (err) {
    console.warn("Audio Context blocked by browser safety standard.", err);
  }
};

// Types
interface Annotation {
  x: number;
  date: string;
  label: string;
  desc: string;
  category: "marketing" | "code" | "infra" | "product";
}

interface Dataset {
  type: string;
  title: string;
  value: string;
  growth: string;
  points: number[];
  annotations: Annotation[];
  simulatedLogs: string[];
  commandText: string;
  language: string;
  color: string;
}

const DATA_SETS: Record<string, Dataset> = {
  stripe: {
    type: "Stripe revenue",
    title: "Stripe Revenue (MRR)",
    value: "$48,920/mo",
    growth: "+18.4% this month",
    points: [30, 45, 38, 70, 65, 110, 140, 135, 180],
    annotations: [
      { x: 3, date: "Apr 12", label: "Launched V2 Pricing", desc: "Switched plan tiering. Average order value increased from $49 to $79.", category: "product" },
      { x: 6, date: "Jul 19", label: "HN Front Page #3", desc: "Spike of 12,000 visitors over 18 hours. Server load peaked at 88%.", category: "marketing" }
    ],
    simulatedLogs: [
      "GET /v1/charges?limit=100 ... 200 OK",
      "Parsing 1,482 charges...",
      "Detected inflection point at Month 4 (confidence: 94%)",
      "Synced. Online."
    ],
    commandText: "curl https://api.stripe.com/v1/charges \\\n  -u sk_live_••••: \\\n  -d limit=100",
    language: "bash",
    color: "var(--primary)"
  },
  postgres: {
    type: "active users",
    title: "Active Users (DB Query)",
    value: "12,481 MAU",
    growth: "+4.2% weekly",
    points: [60, 65, 78, 75, 90, 85, 95, 115, 130],
    annotations: [
      { x: 2, date: "Mar 04", label: "New Auth Flow", desc: "Passwordless login enabled. Sign-up conversion rate improved by 9.4%.", category: "code" },
      { x: 7, date: "Aug 11", label: "Server Migration", desc: "Moved query replicas to EU-central. Latency dropped by 180ms.", category: "infra" }
    ],
    simulatedLogs: [
      "Connecting to postgresql://db.tidemark.internal:5432...",
      "Executing query: SELECT count(1) FROM events GROUP BY month...",
      "Fetched 9 rows (14ms)",
      "Inflection auto-pin initialized."
    ],
    commandText: "SELECT\n  date_trunc('month', created_at) AS month,\n  COUNT(DISTINCT user_id) AS active_users\nFROM events\nGROUP BY 1 ORDER BY 1;",
    language: "sql",
    color: "var(--accent)"
  },
  csv: {
    type: "NPS scores",
    title: "Custom CSV Import",
    value: "84.2% NPS",
    growth: "+2.1% from Q1",
    points: [80, 82, 81, 83, 85, 84, 86, 88, 89],
    annotations: [
      { x: 4, date: "May 22", label: "Released Dark Mode", desc: "Customer satisfaction score reached all-time high of 86%.", category: "product" }
    ],
    simulatedLogs: [
      "Reading satisfaction_q2.csv (14.2 KB)...",
      "Mapped columns: [Date -> Date, Score -> NPS]",
      "Calculated moving average trend lines",
      "Import completed."
    ],
    commandText: "date,nps_score\n2026-01-01,80\n2026-02-01,82\n2026-03-01,81\n2026-04-01,83\n2026-05-01,85",
    language: "csv",
    color: "var(--primary)"
  }
};

const FAQ_ITEMS = [
  {
    q: "Do you store our database credentials?",
    a: "Absolutely not. Your connection credentials are encrypted using AES-256 and stored locally in your browser's local storage or processed via serverless functions that never write to a permanent disc database. We only request read-only permissions."
  },
  {
    q: "How does the inflection point detection work?",
    a: "We calculate standard deviation envelopes (Bollinger-style bands) on the rate of change of your metrics. When a data point breaches the dynamic boundary, we flag it as an inflection point and prompt you to write an annotation."
  },
  {
    q: "Can we share these annotated charts with investors?",
    a: "Yes. Every chart workspace can generate a secure, obfuscated, read-only URL. You can password-protect it, revoke it at any time, or embed it inside Notion/Slides."
  },
  {
    q: "Is there a limit to how many sources we can connect?",
    a: "Our Hobby plan connects up to 2 sources. The Pro plan allows unlimited database, API, and spreadsheet connections with real-time multi-member editing."
  }
];

const INTEGRATIONS = [
  { name: "Stripe", latency: "API Hook", desc: "Fetch subscription data", icon: <TrendingUp size={20} /> },
  { name: "PostgreSQL", latency: "SQL Query", desc: "Query replicas directly", icon: <Database size={20} /> },
  { name: "CSV Import", latency: "Local Parse", desc: "Upload and map sheets", icon: <FileSpreadsheet size={20} /> },
  { name: "MySQL", latency: "SQL Query", desc: "Connect relational DBs", icon: <Database size={20} className="opacity-75" /> },
  { name: "Shopify", latency: "OAuth Hook", desc: "Sync ecommerce checkout", icon: <Layers size={20} /> },
  { name: "ClickHouse", latency: "OLAP SQL", desc: "Query huge timeseries", icon: <Cpu size={20} /> }
];

export default function Home() {
  const [selectedSource, setSelectedSource] = useState<"stripe" | "postgres" | "csv">("stripe");
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeAnnotation, setActiveAnnotation] = useState<number | null>(0);
  
  // Easter Egg (Konami Code Active)
  const [sonarActive, setSonarActive] = useState(false);
  const konamiSeq = useRef<string[]>([]);
  const targetSeq = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

  // Autoplay control
  const [isAutoplay, setIsAutoplay] = useState(true);

  // Pricing State
  const [dataPoints, setDataPoints] = useState(25000);

  // FAQ State
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Simulation states
  const [isSimulating, setIsSimulating] = useState(false);
  const [simLogs, setSimLogs] = useState<string[]>([]);

  // Custom Annotations Override
  const [customLabel, setCustomLabel] = useState("");
  const [customDesc, setCustomDesc] = useState("");
  const [customX, setCustomX] = useState(4);
  const [datasetOverrides, setDatasetOverrides] = useState<Record<string, Annotation[]>>({});

  const [syncedPipelines, setSyncedPipelines] = useState(4821);
  const [averageLatency, setAverageLatency] = useState(12.4);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "signup">("signup");
  const [authSuccess, setAuthSuccess] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [nameInput, setNameInput] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setSyncedPipelines(prev => prev + (Math.random() > 0.45 ? 1 : 0));
      setAverageLatency(prev => {
        const diff = (Math.random() - 0.5) * 0.3;
        return Math.max(9.0, Math.min(15.0, Number((prev + diff).toFixed(1))));
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Hover Crosshair Snapping math on Chart
  const [chartHoverX, setChartHoverX] = useState<number | null>(null);
  const [chartHoverY, setChartHoverY] = useState<number | null>(null);
  const [chartHoverNodeIdx, setChartHoverNodeIdx] = useState<number | null>(null);

  // Listen to mouse coordinates
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Listen to Konami Code sequence
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key === "b" || e.key === "B" ? "b" : e.key === "a" || e.key === "A" ? "a" : e.key;
      konamiSeq.current = [...konamiSeq.current, key].slice(-10);

      if (JSON.stringify(konamiSeq.current) === JSON.stringify(targetSeq)) {
        setSonarActive(true);
        playSynthesizedSound("sonar");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Sync theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // Autoplay loop
  useEffect(() => {
    if (!isAutoplay || sonarActive) return;

    const sources: ("stripe" | "postgres" | "csv")[] = ["stripe", "postgres", "csv"];
    const interval = setInterval(() => {
      setSelectedSource(current => {
        const nextIdx = (sources.indexOf(current) + 1) % sources.length;
        return sources[nextIdx];
      });
      setActiveAnnotation(0);
    }, 7000);

    return () => clearInterval(interval);
  }, [isAutoplay, sonarActive]);

  // Logs simulation
  useEffect(() => {
    setIsSimulating(true);
    setSimLogs([]);
    const logs = DATA_SETS[selectedSource].simulatedLogs;
    let idx = 0;
    
    const interval = setInterval(() => {
      if (idx < logs.length) {
        setSimLogs(prev => [...prev, logs[idx]]);
        idx++;
      } else {
        setIsSimulating(false);
        clearInterval(interval);
      }
    }, 250);

    return () => clearInterval(interval);
  }, [selectedSource]);

  const getCurrentAnnotations = () => {
    return datasetOverrides[selectedSource] || DATA_SETS[selectedSource].annotations;
  };

  const addCustomAnnotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customLabel.trim() || !customDesc.trim()) return;

    setIsAutoplay(false);
    playSynthesizedSound("click");

    const newAnnot: Annotation = {
      x: Number(customX),
      date: `Month ${Number(customX) + 1}`,
      label: customLabel,
      desc: customDesc,
      category: "product"
    };

    const currentAnnots = getCurrentAnnotations();
    const updated = [...currentAnnots.filter(a => a.x !== newAnnot.x), newAnnot].sort((a, b) => a.x - b.x);

    setDatasetOverrides(prev => ({
      ...prev,
      [selectedSource]: updated
    }));

    setCustomLabel("");
    setCustomDesc("");
    
    const newIdx = updated.findIndex(a => a.x === newAnnot.x);
    if (newIdx !== -1) {
      setActiveAnnotation(newIdx);
    }
  };

  const deleteAnnotation = (idxToDelete: number) => {
    playSynthesizedSound("click");
    const currentAnnots = getCurrentAnnotations();
    const updated = currentAnnots.filter((_, idx) => idx !== idxToDelete);
    setDatasetOverrides(prev => ({
      ...prev,
      [selectedSource]: updated
    }));
    setActiveAnnotation(updated.length > 0 ? 0 : null);
  };

  const activeData = DATA_SETS[selectedSource];
  const activeAnnotations = getCurrentAnnotations();

  // SVG parameters
  const width = 600;
  const height = 280;
  const padding = 45;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Compute SVG coordinates
  const pointsCoords = activeData.points.map((val, idx) => {
    const maxVal = Math.max(...activeData.points) * 1.1;
    const minVal = Math.min(...activeData.points) * 0.9;
    const x = padding + (idx / (activeData.points.length - 1)) * chartWidth;
    const y = height - padding - ((val - minVal) / (maxVal - minVal)) * chartHeight;
    return { x, y, value: val, index: idx };
  });

  const pathD = pointsCoords.reduce((acc, point, idx, arr) => {
    if (idx === 0) return `M ${point.x} ${point.y}`;
    const prev = arr[idx - 1];
    const cpX1 = prev.x + (point.x - prev.x) / 3;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (2 * (point.x - prev.x)) / 3;
    const cpY2 = point.y;
    return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${point.x} ${point.y}`;
  }, "");

  const areaD = `${pathD} L ${pointsCoords[pointsCoords.length - 1].x} ${height - padding} L ${pointsCoords[0].x} ${height - padding} Z`;

  // Custom cursor crosshair tracking on SVG
  const handleChartMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * width;
    
    // Find closest index
    let closestIdx = 0;
    let minDiff = Infinity;
    pointsCoords.forEach((pt, idx) => {
      const diff = Math.abs(pt.x - mouseX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });

    const targetPt = pointsCoords[closestIdx];
    setChartHoverX(targetPt.x);
    setChartHoverY(targetPt.y);
    setChartHoverNodeIdx(closestIdx);
  };

  const handleChartMouseLeave = () => {
    setChartHoverX(null);
    setChartHoverY(null);
    setChartHoverNodeIdx(null);
  };

  const getPricingPlan = () => {
    if (dataPoints <= 10000) {
      return { plan: "Hobby Plan", cost: 0, features: ["2 integrations", "10,000 metrics limit", "Community Slack support", "Local data logs"] };
    } else if (dataPoints <= 100000) {
      return { plan: "Startup Plan", cost: 29, features: ["Unlimited integrations", "100,000 metrics limit", "Priority email support", "Auto-inflection logs"] };
    } else if (dataPoints <= 500000) {
      return { plan: "Grower Plan", cost: 79, features: ["Unlimited integrations", "500,000 metrics limit", "Shared Slack Channel", "Postgres read-replicas"] };
    } else {
      return { plan: "Scale Plan", cost: 149, features: ["Unlimited integrations", "1,000,000+ metrics limit", "Dedicated success engineer", "SAML/SSO integration"] };
    }
  };

  const activePlan = getPricingPlan();

  return (
    <div 
      ref={containerRef}
      className={cn(
        "min-h-screen transition-colors duration-300 relative select-none font-sans overflow-x-hidden",
        sonarActive 
          ? "bg-emerald-950/20 text-[#00ff66]" 
          : "bg-[#fcfaf7] dark:bg-[#040914] text-[#091224] dark:text-[#f3f5f8]"
      )}
    >
      
      {/* Easter Egg Sonar Scanlines / Retro CRT overlay */}
      {sonarActive && (
        <div className="fixed inset-0 pointer-events-none z-50 bg-[radial-gradient(circle_at_center,rgba(0,255,102,0.1),transparent)] opacity-40 scanlines" />
      )}

      {/* ARCHITECTURAL BLUEPRINT GRID */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-100"
        style={{
          backgroundImage: sonarActive
            ? `radial-gradient(circle 350px at ${mousePos.x}px ${mousePos.y}px, rgba(0, 255, 102, 0.15), transparent 85%), 
               linear-gradient(to right, rgba(0, 255, 102, 0.05) 1px, transparent 1px), 
               linear-gradient(to bottom, rgba(0, 255, 102, 0.05) 1px, transparent 1px)`
            : theme === "dark" 
              ? `radial-gradient(circle 400px at ${mousePos.x}px ${mousePos.y}px, rgba(45, 212, 191, 0.09), transparent 85%), 
                 linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px), 
                 linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)`
              : `radial-gradient(circle 400px at ${mousePos.x}px ${mousePos.y}px, rgba(13, 148, 136, 0.05), transparent 85%), 
                 linear-gradient(to right, rgba(9, 18, 36, 0.035) 1px, transparent 1px), 
                 linear-gradient(to bottom, rgba(9, 18, 36, 0.035) 1px, transparent 1px)`,
          backgroundSize: "100%, 32px 32px, 32px 32px",
          height: "1000px"
        }}
      >
        <div className="absolute top-24 left-8 text-[9px] font-mono text-muted/30 tracking-widest hidden lg:block">
          {sonarActive ? "RADAR_SWEEP // ACTIVE" : "SYS_LOC // [ 52.5200° N, 13.4050° E ]"}
        </div>
        <div className="absolute top-24 right-8 text-[9px] font-mono text-muted/30 tracking-widest hidden lg:block">
          {sonarActive ? "SONAR_PING // DETECTED" : "RADAR_SCALE // TIDE_REPLICAS_V1.0"}
        </div>
      </div>

      {/* Global Nav */}
      <nav className="fixed top-0 w-full z-50 bg-[#fcfaf7]/70 dark:bg-[#040914]/70 backdrop-blur-xl border-b border-border/30 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-serif italic text-2xl font-bold tracking-tight text-[#0d9488] dark:text-[#2dd4bf]">Tidemark</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-muted/80">
            <a href="#interactive" className="hover:text-foreground transition-colors">Workspace</a>
            <a href="#compose" className="hover:text-foreground transition-colors">Composer</a>
            <a href="#integrations" className="hover:text-foreground transition-colors">Integrations</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                setTheme(theme === "dark" ? "light" : "dark");
                playSynthesizedSound("click");
              }}
              className="p-2 rounded-full border border-border/40 bg-surface/30 text-muted/80 hover:text-foreground hover:bg-surface transition-all duration-200"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <motion.button 
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setAuthModalOpen(true);
                setAuthTab("signup");
                playSynthesizedSound("chime");
              }}
              className="text-xs font-bold uppercase tracking-wider text-white bg-[#0d9488] dark:bg-[#2dd4bf] hover:bg-[#0f766e] dark:hover:bg-[#14b8a6] px-5 py-2.5 rounded-none shadow-md transition-colors duration-200 shimmer-btn"
            >
              Start Free
            </motion.button>
          </div>
        </div>
      </nav>

      {/* ASYMMETRIC EDITORIAL HERO SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-8">
        
        {/* Warning notification banner if sonar mode is active */}
        {sonarActive && (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-8 p-3 border border-[#00ff66] bg-[#00ff66]/10 text-[#00ff66] text-xs font-mono flex items-center justify-between gap-3 uppercase tracking-wider"
          >
            <span className="flex items-center gap-2"><AlertOctagon size={16} /> Warning: Deep Sea Sonar Calibration Mode Enabled. PING active.</span>
            <button 
              onClick={() => {
                setSonarActive(false);
                playSynthesizedSound("chime");
              }}
              className="px-2 py-0.5 border border-[#00ff66] hover:bg-[#00ff66] hover:text-emerald-950 transition-colors"
            >
              Surface Mode
            </button>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-b border-border/30 pb-16">
          
          {/* Left Column: Heavy Editorial Statement */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#0d9488]/10 dark:bg-[#2dd4bf]/10 text-[10px] font-mono uppercase tracking-widest text-[#0d9488] dark:text-[#2dd4bf]">
              <Compass size={10} /> Release 1.0 — Chronological Telemetry
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.08] text-foreground font-sans">
              What if <br />
              your charts <br />
              <span className="font-serif italic font-light text-[#0d9488] dark:text-[#2dd4bf]">could talk?</span>
            </h1>

            <p className="text-sm sm:text-base text-muted max-w-lg leading-relaxed font-sans">
              Tidemark auto-detects metrics inflection points and pins permanent, chronological annotations directly to your Stripe, SQL, and CSV dashboards. Never guess why a spike occurred again.
            </p>

            {/* Live Ticker Stats */}
            <div className="text-[10px] font-mono text-[#0d9488] dark:text-[#2dd4bf] tracking-wide flex items-center gap-2 pb-1.5 pt-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0d9488] dark:bg-[#2dd4bf] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0d9488] dark:bg-[#2dd4bf]"></span>
              </span>
              <span>[ connection latency: {averageLatency}ms // {syncedPipelines.toLocaleString()} pipelines synced today ]</span>
            </div>

            {/* CTAs with sharp editorial outlines */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <motion.button 
                onClick={() => {
                  setAuthModalOpen(true);
                  setAuthTab("signup");
                  playSynthesizedSound("chime");
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.96 }}
                animate={{ scale: [1, 1.025, 1] }}
                transition={{
                  scale: { repeat: Infinity, duration: 2.5, ease: "easeInOut" }
                }}
                className="px-8 py-3.5 font-bold uppercase tracking-wider text-xs text-white bg-[#0d9488] dark:bg-[#2dd4bf] hover:bg-[#0f766e] dark:hover:bg-[#14b8a6] transition-colors duration-300 text-center shadow-[0_0_20px_rgba(13,148,136,0.25)] dark:shadow-[0_0_35px_rgba(45,212,191,0.2)] shimmer-btn"
              >
                Connect Stripe (Free)
              </motion.button>
              <a 
                href="#compose" 
                onClick={() => playSynthesizedSound("click")}
                className="px-8 py-3.5 font-bold uppercase tracking-wider text-xs border border-border bg-surface/30 hover:bg-surface transition-all duration-200 inline-flex items-center justify-center gap-2 text-center"
              >
                Pin Custom Mark
                <ArrowUpRight size={14} />
              </a>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 pt-3 text-[10px] font-mono text-muted/65">
              <span className="text-muted/40 font-bold uppercase tracking-wider">Avail:</span>
              <span className="flex items-center gap-1.5 border border-border/40 px-2 py-0.5 bg-surface/30">
                <svg className="w-3 h-3 fill-[#00adef]" viewBox="0 0 24 24"><path d="M0 3.449L9.75 2.1v9.45H0V3.449zM0 12.45h9.75v9.45L0 20.551v-8.1zM10.95 1.95L24 0v11.55H10.95V1.95zm0 10.5H24v11.55l-13.05-1.95V12.45z"/></svg>
                Windows x64
              </span>
              <span className="flex items-center gap-1.5 border border-border/40 px-2 py-0.5 bg-surface/30">
                <svg className="w-3 h-3 fill-[#8c8c8c] dark:fill-[#d2d2d2]" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.1.09 2.23-.55 2.95-1.39z"/></svg>
                macOS Client
              </span>
              <span className="flex items-center gap-1.5 border border-border/40 px-2 py-0.5 bg-surface/30">
                CLI Tool
              </span>
            </div>
            
            <div className="text-[10px] font-mono text-muted/50 flex items-center gap-1.5 pt-2">
              <Volume2 size={12} className="text-[#0d9488] dark:text-[#2dd4bf]" /> Clicking elements triggers acoustic telemetry feedback. Try typing the Konami Code.
            </div>
          </div>

          {/* Right Column: Chronological Tide Ledger */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border/30 pb-2">
              <span className="text-[10px] font-mono text-muted uppercase tracking-widest flex items-center gap-1.5">
                <Clock size={12} className="text-[#0d9488] dark:text-[#2dd4bf]" /> Historical Timeline Ledger
              </span>
              {isAutoplay && !sonarActive && (
                <span className="text-[9px] font-mono text-[#0d9488] dark:text-[#2dd4bf] flex items-center gap-1 animate-pulse">
                  <Activity size={10} /> Autoplaying demo
                </span>
              )}
            </div>

            {/* Stack of Polaroid-like Chronology index cards */}
            <div className="space-y-3">
              {activeAnnotations.map((annot, idx) => {
                const isActive = activeAnnotation === idx;
                return (
                  <motion.div
                    key={idx}
                    onClick={() => {
                      setActiveAnnotation(idx);
                      setIsAutoplay(false);
                      playSynthesizedSound("click");
                    }}
                    className={cn(
                      "p-4 border transition-all duration-300 cursor-pointer flex items-start gap-4 select-text relative",
                      isActive 
                        ? sonarActive
                          ? "border-[#00ff66] bg-[#00ff66]/5 shadow-[0_0_15px_rgba(0,255,102,0.1)] translate-x-2"
                          : "border-[#0d9488] dark:border-[#2dd4bf] bg-white dark:bg-[#0a1324] shadow-md translate-x-2" 
                        : "border-border/60 bg-white/40 dark:bg-[#0a1324]/30 hover:bg-white/70 dark:hover:bg-[#0a1324]/60"
                    )}
                    layoutId={`annot-card-${annot.label}`}
                  >
                    <div className="flex flex-col items-center justify-center text-center shrink-0 border border-border/80 px-2 py-1 bg-surface font-mono">
                      <span className="text-[9px] text-muted uppercase">Date</span>
                      <span className="text-xs font-bold text-foreground">{annot.date}</span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold tracking-tight text-foreground">{annot.label}</span>
                        <span className={cn(
                          "text-[8px] font-mono uppercase px-1.5 py-0.2 border",
                          annot.category === "marketing" ? "border-amber-400/40 text-amber-500 bg-amber-500/5" :
                          annot.category === "infra" ? "border-blue-400/40 text-blue-500 bg-blue-500/5" :
                          "border-[#0d9488]/40 text-[#0d9488] bg-[#0d9488]/5"
                        )}>
                          {annot.category}
                        </span>
                      </div>
                      <p className="text-xs text-muted leading-relaxed">{annot.desc}</p>
                    </div>

                    {isActive && (
                      <div className="absolute top-2 right-2 flex items-center gap-1.5">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteAnnotation(idx);
                          }}
                          className="p-1 rounded text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors"
                          title="Delete mark"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                  </motion.div>
                );
              })}
              {activeAnnotations.length === 0 && (
                <div className="p-8 border border-dashed border-border/40 text-center text-xs text-muted">
                  Timeline empty. Pin a custom annotation below to start the ledger.
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* CORE INSTRUMENT PANEL: THE TELEMETRY WAVEFORM (Chart + Pipeline) */}
      <section id="interactive" className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Connection source telemetry column */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className={cn(
              "p-6 border bg-white/40 dark:bg-[#0a1324]/40 backdrop-blur-md space-y-4",
              sonarActive ? "border-[#00ff66]/30" : "border-border/60"
            )}>
              <div>
                <span className="text-[9px] font-mono text-muted uppercase tracking-widest">Pipeline Select</span>
                <h3 className="text-lg font-bold tracking-tight mt-1">1. Connected Telemetry</h3>
              </div>

              <div className="space-y-2">
                {[
                  { id: "stripe", name: "Stripe API charges", icon: <TrendingUp size={14} />, detail: "api.stripe.com/charges" },
                  { id: "postgres", name: "PostgreSQL events", icon: <Database size={14} />, detail: "db.tidemark.internal:5432" },
                  { id: "csv", name: "Custom NPS imports", icon: <FileSpreadsheet size={14} />, detail: "nps_satisfaction_q2.csv" }
                ].map((src) => (
                  <button
                    key={src.id}
                    onClick={() => {
                      setSelectedSource(src.id as any);
                      setActiveAnnotation(0);
                      setIsAutoplay(false);
                      playSynthesizedSound("chime");
                    }}
                    className={cn(
                      "w-full flex items-center justify-between p-3.5 border transition-all duration-200 text-left",
                      selectedSource === src.id 
                        ? sonarActive
                          ? "border-[#00ff66] bg-[#00ff66]/5"
                          : "border-[#0d9488] dark:border-[#2dd4bf] bg-white dark:bg-[#0a1324] shadow-sm" 
                        : "border-border/60 bg-transparent text-muted hover:text-foreground hover:bg-white dark:hover:bg-[#0a1324]"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("p-1.5 border border-border/50", selectedSource === src.id ? "text-primary bg-primary/5" : "text-muted")}>
                        {src.icon}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-foreground">{src.name}</div>
                        <div className="text-[9px] font-mono text-muted mt-0.5">{src.detail}</div>
                      </div>
                    </div>
                    {selectedSource === src.id && <Check size={14} className={sonarActive ? "text-[#00ff66]" : "text-primary"} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Terminal logs showing structural logs */}
            <div className={cn(
              "p-5 border bg-black/95 font-mono text-[11px] flex flex-col justify-between h-[210px] shadow-2xl relative select-text",
              sonarActive ? "border-[#00ff66]/30 text-[#00ff66]" : "border-border text-emerald-400"
            )}>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between border-b border-white/10 pb-2 text-muted">
                  <span className="flex items-center gap-1.5 text-[9px] tracking-wider uppercase"><Terminal size={12} /> Live stream logs</span>
                  <span className={cn("w-1.5 h-1.5 rounded-full animate-ping", sonarActive ? "bg-[#00ff66]" : "bg-emerald-400")} />
                </div>
                <div className="space-y-1 overflow-y-auto max-h-[100px] pr-1">
                  {simLogs.map((log, idx) => (
                    <div key={idx} className="flex gap-2">
                      <span className="text-zinc-600 shrink-0">&gt;</span>
                      <span className={cn(idx === simLogs.length - 1 && !isSimulating ? "text-primary" : "")}>{log}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-white/10 pt-2 text-muted text-[10px] overflow-x-auto">
                <code>{activeData.commandText}</code>
              </div>
            </div>

          </div>

          {/* Graphical Waveform Canvas Column */}
          <div className="lg:col-span-8">
            <div className={cn(
              "border bg-white dark:bg-[#0a1324] p-6 sm:p-8 flex flex-col justify-between h-full relative",
              sonarActive ? "border-[#00ff66]/30 bg-emerald-950/10" : "border-border/60"
            )}>
              
              {/* Graphic crosshair details to resemble technical drawing */}
              <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-border/40 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-border/40 pointer-events-none" />
              
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 border-b border-border/20 pb-4">
                  <div>
                    <span className="text-[9px] font-mono text-muted uppercase tracking-widest">Active Canvas</span>
                    <h3 className="text-2xl font-bold mt-0.5">{activeData.title}</h3>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <div className="text-2xl font-mono font-bold tracking-tight">{activeData.value}</div>
                    <span className="text-xs font-semibold text-primary">{activeData.growth}</span>
                  </div>
                </div>

                {/* SVG waveform canvas with interactive crosshair snap tracking */}
                <div className="relative w-full aspect-[2/1] min-h-[220px] bg-black/[0.01] dark:bg-white/[0.01] border border-border/30 p-2 flex items-center justify-center">
                  <svg 
                    viewBox={`0 0 ${width} ${height}`} 
                    className="w-full h-full overflow-visible"
                    onMouseMove={handleChartMouseMove}
                    onMouseLeave={handleChartMouseLeave}
                  >
                    {/* Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                      const yVal = padding + ratio * chartHeight;
                      return (
                        <line 
                          key={idx} 
                          x1={padding} 
                          y1={yVal} 
                          x2={width - padding} 
                          y2={yVal} 
                          stroke="currentColor" 
                          className="text-border/20" 
                          strokeWidth="0.5" 
                          strokeDasharray="2 4"
                        />
                      );
                    })}

                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.12" />
                        <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Gradient area */}
                    <motion.path 
                      key={`${selectedSource}-area-${activeAnnotations.length}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      d={areaD} 
                      fill="url(#chartGradient)" 
                    />

                    {/* Core tide waveform */}
                    <motion.path 
                      key={`${selectedSource}-path-${activeAnnotations.length}`}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                      d={pathD} 
                      fill="none" 
                      stroke={sonarActive ? "#00ff66" : "var(--primary)"} 
                      strokeWidth="2.5" 
                      strokeLinecap="round"
                    />

                    {/* Active Snapped Crosshair Drawing */}
                    {chartHoverX !== null && chartHoverY !== null && (
                      <g className="pointer-events-none">
                        {/* Vertical line */}
                        <line 
                          x1={chartHoverX} 
                          y1={padding} 
                          x2={chartHoverX} 
                          y2={height - padding} 
                          stroke={sonarActive ? "#00ff66" : "var(--primary)"} 
                          strokeWidth="1" 
                          strokeDasharray="3 3"
                          opacity="0.6"
                        />
                        {/* Horizontal line */}
                        <line 
                          x1={padding} 
                          y1={chartHoverY} 
                          x2={width - padding} 
                          y2={chartHoverY} 
                          stroke={sonarActive ? "#00ff66" : "var(--primary)"} 
                          strokeWidth="1" 
                          strokeDasharray="3 3"
                          opacity="0.6"
                        />
                        {/* Crosshair coordinate node text */}
                        <text 
                          x={chartHoverX + 8} 
                          y={chartHoverY - 8} 
                          fill="currentColor" 
                          className="font-mono text-[9px] fill-current"
                          opacity="0.8"
                        >
                          Val: {pointsCoords[chartHoverNodeIdx || 0].value} (Month: {(chartHoverNodeIdx || 0) + 1})
                        </text>
                      </g>
                    )}

                    {/* Circular Radar Sweep for Sonar Mode */}
                    {sonarActive && (
                      <g className="pointer-events-none">
                        <circle cx={width/2} cy={height/2} r="50" fill="none" stroke="#00ff66" strokeWidth="0.5" opacity="0.3" strokeDasharray="2 3" />
                        <circle cx={width/2} cy={height/2} r="100" fill="none" stroke="#00ff66" strokeWidth="0.5" opacity="0.2" strokeDasharray="2 3" />
                        <motion.line 
                          x1={width/2}
                          y1={height/2}
                          x2={width/2 + 150}
                          y2={height/2}
                          stroke="#00ff66"
                          strokeWidth="1"
                          opacity="0.5"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                          style={{ originX: `${width/2}px`, originY: `${height/2}px` }}
                        />
                      </g>
                    )}

                    {/* Interactive points */}
                    {pointsCoords.map((point, idx) => {
                      const hasAnnot = activeAnnotations.find(a => a.x === idx);
                      const annotIdx = hasAnnot ? activeAnnotations.indexOf(hasAnnot) : -1;
                      const isAnnotActive = annotIdx !== -1 && annotIdx === activeAnnotation;

                      return (
                        <g key={idx} className="cursor-pointer">
                          <circle 
                            cx={point.x} 
                            cy={point.y} 
                            r="16" 
                            fill="transparent"
                            onClick={() => {
                              playSynthesizedSound("click");
                              if (hasAnnot) {
                                setActiveAnnotation(annotIdx);
                                setIsAutoplay(false);
                              }
                            }}
                          />
                          <circle 
                            cx={point.x} 
                            cy={point.y} 
                            r={hoveredNode === idx || chartHoverNodeIdx === idx ? "6" : "4"} 
                            fill="var(--background)" 
                            stroke={hasAnnot ? "var(--accent)" : sonarActive ? "#00ff66" : "var(--primary)"} 
                            strokeWidth={hoveredNode === idx || chartHoverNodeIdx === idx || isAnnotActive ? "4" : "2"} 
                            className="transition-all duration-150"
                          />
                          {isAnnotActive && (
                            <motion.circle 
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0.4, 0.8] }}
                              transition={{ duration: 1.8, repeat: Infinity }}
                              cx={point.x} 
                              cy={point.y} 
                              r="10" 
                              fill="none"
                              stroke="var(--accent)"
                              strokeWidth="1"
                            />
                          )}
                        </g>
                      );
                    })}
                  </svg>

                  {/* Absolute Chart Tooltip for Active Annotation */}
                  <AnimatePresence mode="wait">
                    {activeAnnotation !== null && activeAnnotations[activeAnnotation] && (
                      <motion.div
                        key={`${selectedSource}-${activeAnnotation}-${activeAnnotations.length}`}
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                          "absolute bottom-4 left-4 right-4 p-4 border text-xs flex gap-3 shadow-md justify-between items-start",
                          sonarActive ? "border-[#00ff66]/35 bg-[#040914] text-[#00ff66]" : "border-accent/20 bg-background/90"
                        )}
                      >
                        <div className="flex gap-3">
                          <div className="w-5 h-5 bg-accent/15 flex items-center justify-center text-accent shrink-0 font-mono text-[10px]">
                            A
                          </div>
                          <div className="space-y-0.5">
                            <span className="font-bold text-foreground text-xs uppercase tracking-wide">
                              {activeAnnotations[activeAnnotation].label}
                            </span>
                            <p className="text-muted leading-relaxed select-text text-[11px]">
                              {activeAnnotations[activeAnnotation].desc}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Bottom markings list */}
              <div className="border-t border-border/20 pt-4 mt-4">
                <span className="text-[9px] font-mono text-muted uppercase tracking-widest block mb-2">Tidemark Ledger Registers</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeAnnotations.map((annot, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveAnnotation(idx);
                        setIsAutoplay(false);
                        playSynthesizedSound("click");
                      }}
                      className={cn(
                        "px-3 py-1 text-[10px] font-mono border transition-all duration-200",
                        activeAnnotation === idx 
                          ? "bg-accent/15 border-accent text-foreground"
                          : "bg-surface border-border/60 text-muted hover:text-foreground"
                      )}
                    >
                      [{annot.date}] {annot.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* COMPOSITION ENGINE */}
      <section id="compose" className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="p-8 border border-border/60 bg-white/40 dark:bg-[#0a1324]/40 backdrop-blur-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[10px] font-mono text-primary uppercase tracking-widest block">Telemetry Editor</span>
              <h3 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
                2. Write a custom annotation
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Manually register a chronological event mark. Select a coordinate offset (Month), type a title label, and input details to update the blueprint.
              </p>
            </div>

            <form onSubmit={addCustomAnnotation} className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono uppercase tracking-wider text-muted">Annotation Title</label>
                  <input
                    type="text"
                    required
                    value={customLabel}
                    onChange={(e) => setCustomLabel(e.target.value)}
                    placeholder="e.g. Launched checkout-v2"
                    className="w-full bg-background/50 border border-border px-4 py-2.5 text-xs focus:outline-none focus:border-primary transition-colors text-foreground font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono uppercase tracking-wider text-muted">Chart Position (Month)</label>
                  <select
                    value={customX}
                    onChange={(e) => setCustomX(Number(e.target.value))}
                    className="w-full bg-background/50 border border-border px-4 py-2.5 text-xs focus:outline-none focus:border-primary transition-colors text-foreground font-mono"
                  >
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((val) => (
                      <option key={val} value={val}>Month {val + 1} ({activeData.points[val]})</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[9px] font-mono uppercase tracking-wider text-muted">Details / Context</label>
                <textarea
                  required
                  rows={2}
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  placeholder="Explain why this inflection happened..."
                  className="w-full bg-background/50 border border-border px-4 py-2.5 text-xs focus:outline-none focus:border-primary transition-colors text-foreground resize-none font-sans leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#091224] dark:bg-white text-white dark:text-[#091224] font-bold uppercase tracking-wider text-xs transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:opacity-90"
              >
                <Plus size={14} /> Register Annotation mark
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Dynamic Integrations Grid */}
      <section id="integrations" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-border/40">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-[10px] font-mono text-primary uppercase tracking-widest">Connect any stack</span>
          <h2 className="text-4xl font-bold font-sans">Supported Integrations</h2>
          <p className="text-xs text-muted">Hook up data queries from any modern warehousing, analytics, or application layer in seconds.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {INTEGRATIONS.map((int, idx) => (
            <div 
              key={idx}
              onClick={() => playSynthesizedSound("click")}
              className="p-5 border border-border/80 bg-white/40 dark:bg-[#0a1324]/40 hover:bg-white dark:hover:bg-[#0a1324] hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between text-left group cursor-pointer"
            >
              <div className="w-9 h-9 border border-border/60 flex items-center justify-center text-primary mb-4 group-hover:scale-105 transition-transform duration-200">
                {int.icon}
              </div>
              <div>
                <h4 className="font-bold text-xs text-foreground">{int.name}</h4>
                <span className="text-[8px] font-mono text-accent uppercase">{int.latency}</span>
                <p className="text-[10px] text-muted mt-1 leading-normal">{int.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dynamic Interactive Pricing Section */}
      <section id="pricing" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-border/40">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-[10px] font-mono text-primary uppercase tracking-widest font-sans font-bold">Transparent Scale</span>
          <h2 className="text-4xl font-bold">Metrics-Based Pricing</h2>
          <p className="text-xs text-muted">Use the slider below to calculate your plan based on the total monthly data events your team tracks.</p>
        </div>

        <div className="p-8 border border-border/80 bg-white/30 dark:bg-[#0a1324]/30 backdrop-blur-md max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Slider Column */}
            <div className="md:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-[9px] font-mono uppercase text-muted font-bold">Estimated volume</span>
                  <span className="text-base font-bold text-foreground font-mono">
                    {dataPoints.toLocaleString()} events/mo
                  </span>
                </div>
                <input 
                  type="range" 
                  min="5000" 
                  max="1000000" 
                  step="5000"
                  value={dataPoints} 
                  onChange={(e) => {
                    setDataPoints(Number(e.target.value));
                    playSynthesizedSound("click");
                  }}
                  className="w-full h-1.5 bg-border/60 rounded appearance-none cursor-pointer accent-primary focus:outline-none"
                />
                <div className="flex justify-between text-[9px] text-muted font-mono">
                  <span>5k (Hobby)</span>
                  <span>100k (Startup)</span>
                  <span>500k (Grower)</span>
                  <span>1M+ (Scale)</span>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-border/30">
                <span className="text-[9px] font-mono text-muted uppercase tracking-widest block font-bold">Plan features:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activePlan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-muted">
                      <CheckCircle2 size={12} className="text-primary shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Price Showcase Column */}
            <div className="md:col-span-5 p-6 border border-primary/20 bg-primary/5 flex flex-col justify-between items-center text-center h-full">
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest">{activePlan.plan}</span>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-mono font-bold text-foreground">${activePlan.cost}</span>
                  <span className="text-xs text-muted">/mo</span>
                </div>
                <p className="text-[10px] text-muted mt-2">No setup fees. Cancel or scale down any time.</p>
              </div>

              <button 
                onClick={() => {
                  setAuthModalOpen(true);
                  setAuthTab("signup");
                  playSynthesizedSound("chime");
                }}
                className="w-full mt-6 py-3 bg-[#0d9488] dark:bg-[#2dd4bf] text-white dark:text-[#040914] font-bold uppercase tracking-wider text-xs shadow-md transition-all duration-200"
              >
                Choose Plan
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Collapsible FAQ Section */}
      <section id="faq" className="relative z-10 max-w-4xl mx-auto px-6 py-20 border-t border-border/40">
        <div className="text-center mb-16 space-y-3">
          <span className="text-[10px] font-mono text-primary uppercase tracking-widest font-sans font-bold">Learn more</span>
          <h2 className="text-4xl font-bold">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx}
                className="border border-border/60 bg-white/40 dark:bg-[#0a1324]/40 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => {
                    setActiveFaq(isOpen ? null : idx);
                    playSynthesizedSound("click");
                  }}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-foreground focus:outline-none"
                >
                  <span className="font-serif text-base sm:text-lg">{faq.q}</span>
                  <ChevronDown 
                    size={16} 
                    className={cn("text-muted shrink-0 transition-transform duration-300", isOpen && "rotate-180")} 
                  />
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-1 text-xs text-muted leading-relaxed border-t border-border/20 select-text">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* Concept statement */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-20 border-t border-border/40">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-serif text-4xl font-bold mb-4">The problem with dashboard metrics</h2>
          <p className="text-xs text-muted leading-relaxed">Most dashboards show you *what* happened but completely hide *why* it happened. You waste hours cross-checking old Slack messages, commit logs, or calendar entries just to reconstruct why conversion rate spiked in June.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 border border-border/60 bg-white/30 dark:bg-[#0a1324]/30">
            <div className="w-10 h-10 border border-border/60 flex items-center justify-center text-primary mb-4">
              <Sparkles size={20} />
            </div>
            <h3 className="font-serif text-xl font-bold mb-2">Automated Inflection</h3>
            <p className="text-xs text-muted leading-relaxed">Our detection engine reads your Stripe database or API stream, automatically flagging anomalies and major rate changes.</p>
          </div>

          <div className="p-6 border border-border/60 bg-white/30 dark:bg-[#0a1324]/30">
            <div className="w-10 h-10 border border-border/60 flex items-center justify-center text-primary mb-4">
              <Clock size={20} />
            </div>
            <h3 className="font-serif text-xl font-bold mb-2">Permanent Pins</h3>
            <p className="text-xs text-muted leading-relaxed">Pin descriptions directly onto dates. If you change pricing, launch a feature, or get featured on HN, lock the context in forever.</p>
          </div>

          <div className="p-6 border border-border/60 bg-white/30 dark:bg-[#0a1324]/30">
            <div className="w-10 h-10 border border-border/60 flex items-center justify-center text-primary mb-4">
              <Terminal size={20} />
            </div>
            <h3 className="font-serif text-xl font-bold mb-2">Read-Only Safety</h3>
            <p className="text-[#475569] dark:text-[#94a3b8] text-xs leading-relaxed">Connect securely to your Postgres read replica or upload CSV dumps. We never write to your databases or capture personal data.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-surface/20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="font-serif italic text-xl font-bold text-muted">Tidemark</span>
          <div className="text-xs text-muted">
            © 2026 Tidemark Software. Built honestly.
          </div>
          <div className="flex gap-6 text-xs text-muted font-mono uppercase tracking-widest text-[9px]">
            <a href="#" className="hover:text-foreground transition-colors font-bold">Twitter</a>
            <a href="#" className="hover:text-foreground transition-colors font-bold">GitHub</a>
          </div>
        </div>
      </footer>

      {/* Auth Modal Overlay */}
      <AnimatePresence>
        {authModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setAuthModalOpen(false);
                playSynthesizedSound("click");
              }}
              className="absolute inset-0 bg-[#040914]/80 backdrop-blur-sm"
            />
            
            {/* Modal Body */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-md border border-border bg-white dark:bg-[#070e1b] p-8 shadow-[0_0_50px_rgba(13,148,136,0.15)] dark:shadow-[0_0_60px_rgba(45,212,191,0.08)] text-foreground z-10"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/30 pb-4 mb-6">
                <span className="font-serif italic text-xl font-bold tracking-tight text-primary">Tidemark Auth Gateway</span>
                <button 
                  onClick={() => {
                    setAuthModalOpen(false);
                    playSynthesizedSound("click");
                  }}
                  className="text-xs font-mono border border-border hover:bg-surface/30 px-2 py-0.5"
                >
                  ESC // CLOSE
                </button>
              </div>

              {authSuccess ? (
                /* Success State */
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-6 space-y-4"
                >
                  <div className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center mx-auto text-primary animate-pulse">
                    <Check size={24} />
                  </div>
                  <h3 className="font-serif text-2xl font-bold">Access Granted</h3>
                  <p className="text-xs text-muted font-mono uppercase tracking-widest">[ SYSTEM INIT // WELCOME BACK COMMANDER ]</p>
                  <p className="text-xs text-muted leading-relaxed max-w-xs mx-auto">
                    Your database read pipeline has successfully handshake-verified. Setting up metrics ledger...
                  </p>
                  <button
                    onClick={() => {
                      setAuthModalOpen(false);
                      setAuthSuccess(false);
                      playSynthesizedSound("chime");
                    }}
                    className="w-full py-3 bg-[#0d9488] dark:bg-[#2dd4bf] text-white dark:text-[#040914] font-bold uppercase tracking-wider text-xs shadow-md"
                  >
                    Enter Workspace
                  </button>
                </motion.div>
              ) : (
                /* Form State */
                <div className="space-y-5">
                  {/* Tabs */}
                  <div className="grid grid-cols-2 border border-border/60 bg-surface/30 p-1 mb-2">
                    <button 
                      onClick={() => {
                        setAuthTab("signup");
                        playSynthesizedSound("click");
                      }}
                      className={cn(
                        "py-1.5 text-xs font-mono uppercase tracking-wider font-bold transition-all duration-200",
                        authTab === "signup" 
                          ? "bg-[#0d9488] dark:bg-[#2dd4bf] text-white dark:text-[#040914]" 
                          : "text-muted hover:text-foreground"
                      )}
                    >
                      Sign Up
                    </button>
                    <button 
                      onClick={() => {
                        setAuthTab("login");
                        playSynthesizedSound("click");
                      }}
                      className={cn(
                        "py-1.5 text-xs font-mono uppercase tracking-wider font-bold transition-all duration-200",
                        authTab === "login" 
                          ? "bg-[#0d9488] dark:bg-[#2dd4bf] text-white dark:text-[#040914]" 
                          : "text-muted hover:text-foreground"
                      )}
                    >
                      Log In
                    </button>
                  </div>

                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      playSynthesizedSound("chime");
                      setAuthSuccess(true);
                    }}
                    className="space-y-4"
                  >
                    {authTab === "signup" && (
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-muted uppercase tracking-wider block font-bold">Commander Name</label>
                        <input 
                          type="text" 
                          required
                          value={nameInput}
                          onChange={(e) => setNameInput(e.target.value)}
                          placeholder="e.g. John Doe"
                          className="w-full px-3 py-2 text-xs bg-surface/20 border border-border/80 focus:outline-none focus:border-primary text-foreground font-mono"
                        />
                      </div>
                    )}
                    
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-muted uppercase tracking-wider block font-bold">Database Admin Email</label>
                      <input 
                        type="email" 
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="admin@company.io"
                        className="w-full px-3 py-2 text-xs bg-surface/20 border border-border/80 focus:outline-none focus:border-primary text-foreground font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-muted uppercase tracking-wider block font-bold">Secure Access Key (Password)</label>
                      <input 
                        type="password" 
                        required
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-3 py-2 text-xs bg-surface/20 border border-border/80 focus:outline-none focus:border-primary text-foreground font-mono"
                      />
                    </div>

                    <div className="pt-2">
                      <button 
                        type="submit"
                        className="w-full py-3 bg-[#0d9488] dark:bg-[#2dd4bf] text-white dark:text-[#040914] font-bold uppercase tracking-wider text-xs shadow-md transition-all duration-200 shimmer-btn"
                      >
                        {authTab === "signup" ? "Initialize Pipelines (Free)" : "Decrypt Account"}
                      </button>
                    </div>
                  </form>

                  {/* SSO Dividers */}
                  <div className="relative flex items-center justify-center my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border/30"></div>
                    </div>
                    <span className="relative px-3 text-[9px] font-mono bg-white dark:bg-[#070e1b] text-muted/50 uppercase">sso integration</span>
                  </div>

                  {/* SSO Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => {
                        playSynthesizedSound("click");
                        setAuthSuccess(true);
                      }}
                      className="py-2 border border-border/60 hover:bg-surface/30 flex items-center justify-center gap-2 text-[10px] font-mono uppercase font-bold"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                      GitHub
                    </button>
                    <button 
                      onClick={() => {
                        playSynthesizedSound("click");
                        setAuthSuccess(true);
                      }}
                      className="py-2 border border-border/60 hover:bg-surface/30 flex items-center justify-center gap-2 text-[10px] font-mono uppercase font-bold"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-6.887 4.114-4.647 0-8.4-3.753-8.4-8.4s3.753-8.4 8.4-8.4c2.25 0 4.3.85 5.88 2.36l3.07-3.07c-2.43-2.28-5.59-3.69-8.95-3.69-7.5 0-13.5 6-13.5 13.5s6 13.5 13.5 13.5c7.05 0 13.32-4.95 13.32-13.5 0-.9-.1-1.5-.23-2.04h-13.09z"/></svg>
                      Google
                    </button>
                  </div>
                  
                  {/* Demo Account Quick Access */}
                  <div className="text-center pt-2">
                    <button 
                      onClick={() => {
                        playSynthesizedSound("chime");
                        setAuthSuccess(true);
                      }}
                      className="text-[9px] font-mono uppercase tracking-widest text-[#0d9488] dark:text-[#2dd4bf] hover:underline"
                    >
                      ⚡ Quick Bypass: Open as Demo Account
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
