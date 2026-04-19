"use client";

import { Syne, DM_Sans, Playfair_Display } from "next/font/google";
import { useRouter } from "next/navigation";


const syne = Syne({ subsets: ["latin"], weight: ["400", "600", "700", "800"], variable: "--font-syne" });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["300", "400", "500"], style: ["normal", "italic"], variable: "--font-dm-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["700", "800"], style: ["normal", "italic"], variable: "--font-playfair" });

// ─── Data ────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how", label: "How It Works" },
  { href: "#about", label: "About" },
];

const STATS = [
  { value: "96.4%", label: "Detection Accuracy" },
  { value: "< 3s",  label: "Analysis Time" },
  { value: "12+",   label: "Vocal Biomarkers" },
];

const BAR_HEIGHTS = [20, 45, 70, 55, 90, 65, 100, 80, 55, 35, 60, 40, 75, 50, 30, 20];

const CHIPS = [
  { label: "Jitter Index", value: "0.32%",  pos: { top: 40, left: 0 },    delay: "0s" },
  { label: "HNR Ratio",    value: "18.4 dB", pos: { top: 60, right: 10 },  delay: "1s" },
  { label: "Risk Score",   value: "Low ✓",   pos: { bottom: 60, left: 10 }, delay: "2s" },
];

const FEATURES = [
  {
    title: "Custom-Trained Local LLMs",
    desc: "Our models are trained exclusively on clinical voice datasets — not adapted from general-purpose LLMs. Fully local inference keeps your data private and latency near-zero.",
    tag: "Privacy-First",
    icon: <svg viewBox="0 0 24 24" width={22} height={22} stroke="var(--electric)" fill="none" strokeWidth="1.5"><path d="M12 2a10 10 0 110 20A10 10 0 0112 2zm0 4v4l3 3"/><circle cx="12" cy="12" r="1" fill="var(--electric)" stroke="none"/></svg>,
  },
  {
    title: "Deep Acoustic Feature Engineering",
    desc: "Analyzes 12+ biomarkers simultaneously: jitter, shimmer, HNR, MFCC coefficients, formant trajectories, and turbulence index — far beyond simple frequency analysis.",
    tag: "12+ Biomarkers",
    icon: <svg viewBox="0 0 24 24" width={22} height={22} stroke="var(--electric)" fill="none" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  },
  {
    title: "Rich Multi-Modal Health Reports",
    desc: "Every analysis generates an interactive clinical-grade report with spectrograms, temporal trend graphs, risk heatmaps, and plain-language summaries for patients and clinicians alike.",
    tag: "Clinical-Grade",
    icon: <svg viewBox="0 0 24 24" width={22} height={22} stroke="var(--electric)" fill="none" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
  },
  {
    title: "Zero-Dependency Accessibility",
    desc: "Runs in-browser with no app install, no specialist referral, and no lab setup. Designed for rural and underserved communities where ENT access is months away.",
    tag: "Instant Access",
    icon: <svg viewBox="0 0 24 24" width={22} height={22} stroke="var(--electric)" fill="none" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20"/></svg>,
  },
];

const PILLARS = [
  {
    num: "01",
    title: "Fully Custom, Locally Trained LLMs",
    desc: "Unlike competitors who fine-tune generic speech models, VocalWells trains specialized transformer architectures from scratch on curated pathological voice corpora. This yields 23% higher sensitivity on rare disorders and eliminates third-party data exposure entirely.",
  },
  {
    num: "02",
    title: "Rich, Multi-Modal Health Reporting",
    desc: "Our reporting engine fuses acoustic, temporal, and probabilistic signals into interactive dashboards. Clinicians receive structured SOAP-note exports; patients receive illustrated plain-language narratives. One analysis, two audiences, zero ambiguity.",
  },
  {
    num: "03",
    title: "Real-Time Analysis & Accessibility",
    desc: "WebAssembly-compiled inference runs full analysis in under 3 seconds on any modern device. No cloud round-trip, no Wi-Fi dependency for processing. Works in offline mode post-initialization — critical for field deployments in low-bandwidth environments.",
  },
];

const STEPS = [
  { num: "1", title: "Record",  desc: "Speak a 5-second sustained vowel into your device microphone. No special hardware needed." },
  { num: "2", title: "Extract", desc: "12+ acoustic biomarkers extracted locally in real-time using our WASM inference engine." },
  { num: "3", title: "Analyze", desc: "Custom LLM classifies signals across 40+ pathological patterns learned from clinical data." },
  { num: "4", title: "Report",  desc: "Receive a rich multi-modal health report with risk scores, visualizations, and next steps." },
];

const METRICS = [
  { val: "30M+",  desc: "People affected by vocal disorders globally" },
  { val: "3mo",   desc: "Average wait time for ENT diagnosis" },
  { val: "96.4%", desc: "Model accuracy on held-out clinical test set" },
  { val: "0 data",desc: "Sent to any server — fully local processing" },
];

const REPORT_ROWS = [
  { label: "Jitter (local)", pct: 22, color: "#00e5a0", text: "0.32% — Normal",   bar: "#00e5a0" },
  { label: "Shimmer (dB)",   pct: 28, color: "#00e5a0", text: "0.24 dB — Normal", bar: "#00e5a0" },
  { label: "HNR Ratio",      pct: 58, color: "#f59e0b", text: "18.4 dB — Watch",  bar: "#f59e0b" },
  { label: "MFCC Variance",  pct: 42, color: "#cbd5e1", text: "1.82 — Stable",    bar: "#00e5ff" },
  { label: "F0 Stability",   pct: 82, color: "#00e5a0", text: "High — Normal",    bar: "#00e5a0" },
];

const FOOTER_LINKS = ["Privacy", "Terms", "Research", "Contact"];

// ─── CSS ─────────────────────────────────────────────────────────────────────

const css = `
  :root {
    --navy: #060d1f;
    --navy-mid: #0d1a35;
    --navy-soft: #122040;
    --electric: #00e5ff;
    --electric-dim: rgba(0,229,255,0.12);
    --violet: #7c3aed;
    --slate: #94a3b8;
    --slate-light: #cbd5e1;
    --white: #f0f6ff;
    --card-bg: rgba(255,255,255,0.035);
    --card-border: rgba(0,229,255,0.1);
  }

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  html { scroll-behavior: smooth; }

  body {
    background: var(--navy);
    color: var(--slate-light);
    font-family: var(--font-dm-sans, 'DM Sans'), sans-serif;
    font-weight: 300;
    overflow-x: hidden;
    line-height: 1.7;
  }

  body::before {
    content: '';
    position: fixed; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none; z-index: 0; opacity: 0.4;
  }

  @keyframes pulse     { 0%,100%{opacity:1;transform:scale(1)}  50%{opacity:.4;transform:scale(.7)} }
  @keyframes ringPulse { 0%,100%{transform:scale(1);opacity:.5} 50%{transform:scale(1.03);opacity:1} }
  @keyframes waveAnim  { 0%,100%{transform:scaleY(.4);opacity:.5} 50%{transform:scaleY(1);opacity:1} }
  @keyframes floatAnim { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes fadeUp    { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }

  .vw-fade-1 { animation: fadeUp .7s ease forwards; }
  .vw-fade-2 { animation: fadeUp .7s .15s ease forwards; opacity: 0; }
  .vw-fade-3 { animation: fadeUp .7s .30s ease forwards; opacity: 0; }
  .vw-fade-4 { animation: fadeUp .7s .45s ease forwards; opacity: 0; }

  .vw-bar { width:4px; border-radius:2px; background:linear-gradient(to top,var(--electric),rgba(0,229,255,.3)); animation:waveAnim 1.4s ease-in-out infinite; }

  .vw-ring-1 { position:absolute; inset:0;  border-radius:50%; border:1px solid rgba(0,229,255,.08); animation:ringPulse 3s ease-in-out infinite; }
  .vw-ring-2 { position:absolute; inset:30px; border-radius:50%; border:1px solid rgba(0,229,255,.12); animation:ringPulse 3s .5s ease-in-out infinite; }
  .vw-ring-3 { position:absolute; inset:60px; border-radius:50%; border:1px solid rgba(0,229,255,.18); animation:ringPulse 3s 1s ease-in-out infinite; }

  .vw-chip { position:absolute; background:rgba(6,13,31,.85); border:1px solid rgba(0,229,255,.2); border-radius:12px; padding:10px 16px; backdrop-filter:blur(10px); animation:floatAnim 4s ease-in-out infinite; }

  .vw-nav-link { color:var(--slate); text-decoration:none; font-size:14px; font-weight:400; transition:color .2s; }
  .vw-nav-link:hover { color:var(--white); }

  .vw-feature-cell { background:var(--navy); padding:44px 40px; transition:background .3s; position:relative; overflow:hidden; }
  .vw-feature-cell::before { content:''; position:absolute; top:0; left:0; width:1px; height:0; background:linear-gradient(to bottom,var(--electric),transparent); transition:height .4s ease; }
  .vw-feature-cell:hover::before { height:100%; }
  .vw-feature-cell:hover { background:rgba(0,229,255,.03); }

  .vw-pillar { display:flex; gap:24px; align-items:flex-start; padding:28px; border-radius:14px; border:1px solid transparent; transition:all .25s; cursor:default; }
  .vw-pillar:hover { background:var(--card-bg); border-color:var(--card-border); }

  .vw-step-ring { position:relative; }
  .vw-step-ring::after { content:''; position:absolute; inset:-4px; border-radius:50%; border:1px solid rgba(0,229,255,.08); }

  .vw-steps-line::before { content:''; position:absolute; top:32px; left:12.5%; right:12.5%; height:1px; background:linear-gradient(90deg,transparent,var(--electric),var(--violet),transparent); opacity:.3; }

  .vw-btn-primary { padding:14px 32px; background:linear-gradient(135deg,var(--electric),#38bdf8); border:none; border-radius:10px; color:var(--navy); font-weight:600; font-size:15px; cursor:pointer; transition:all .25s; box-shadow:0 0 30px rgba(0,229,255,.2); }
  .vw-btn-primary:hover { transform:translateY(-2px); box-shadow:0 0 50px rgba(0,229,255,.35); }

  .vw-btn-ghost { padding:14px 28px; background:transparent; border:none; color:var(--slate); font-size:15px; cursor:pointer; display:flex; align-items:center; gap:8px; transition:color .2s; }
  .vw-btn-ghost:hover { color:var(--white); }

  .vw-btn-outline { padding:14px 32px; background:transparent; border:1px solid rgba(255,255,255,.15); border-radius:10px; color:var(--slate-light); font-size:15px; cursor:pointer; transition:all .2s; }
  .vw-btn-outline:hover { border-color:rgba(255,255,255,.3); color:var(--white); }

  .vw-report-top::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,var(--electric),var(--violet)); }

  .vw-nav-cta { padding:9px 22px; background:transparent; border:1px solid var(--electric); border-radius:8px; color:var(--electric); font-size:13px; font-weight:500; cursor:pointer; transition:all .2s; text-decoration:none; }
  .vw-nav-cta:hover { background:var(--electric-dim); }

  .vw-footer-link { font-size:13px; color:var(--slate); text-decoration:none; transition:color .2s; }
  .vw-footer-link:hover { color:var(--white); }

  @media(max-width:1024px) {
    .vw-hero      { grid-template-columns:1fr !important; padding-top:64px !important; min-height:auto !important; }
    .vw-hero-vis  { display:none !important; }
    .vw-about     { grid-template-columns:1fr !important; }
    .vw-feat-grid { grid-template-columns:1fr !important; }
    .vw-steps     { grid-template-columns:1fr 1fr !important; }
    .vw-pillars   { grid-template-columns:1fr !important; }
    .vw-px        { padding-left:28px !important; padding-right:28px !important; }
    .vw-footer    { flex-direction:column; gap:20px; text-align:center; }
  }
`;

// ─── Page Component ──────────────────────────────────────────────────────────

export default function VocalWellsPage({ onStart }) {
    const router = useRouter();
  return (
    <div className={`${syne.variable} ${dmSans.variable} ${playfair.variable}`}>
      <style>{css}</style>

      {/* Background Orbs */}
      {[
        { w:600, h:600, top:-200, left:-150, color:"rgba(0,229,255,0.07)" },
        { w:500, h:500, top:"30%", right:-100, color:"rgba(124,58,237,0.09)" },
        { w:400, h:400, bottom:"10%", left:"20%", color:"rgba(0,229,255,0.05)" },
      ].map((orb, i) => (
        <div key={i} style={{ position:"fixed", width:orb.w, height:orb.h, borderRadius:"50%", filter:"blur(90px)", pointerEvents:"none", zIndex:0, background:`radial-gradient(circle,${orb.color} 0%,transparent 70%)`, ...orb }} />
      ))}

      {/* ── HEADER ──────────────────────────────────── */}
      <header className="vw-px" style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"24px 72px", position:"sticky", top:0, zIndex:100, background:"rgba(6,13,31,0.7)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(0,229,255,0.06)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, fontFamily:"var(--font-syne)", fontWeight:800, fontSize:22, color:"var(--white)", letterSpacing:"-0.5px" }}>
          <div style={{ width:34, height:34, background:"linear-gradient(135deg,var(--electric),var(--violet))", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="#060d1f" strokeWidth="2"><path d="M3 12h2l2-6 3 12 3-9 2 3h6"/></svg>
          </div>
          VocalWell
        </div>
        <nav style={{ display:"flex", alignItems:"center", gap:36 }}>
          {NAV_LINKS.map(({ href, label }) => (
            <a key={href} href={href} className="vw-nav-link">{label}</a>
          ))}
          <a href="#contact" className="vw-nav-cta">Get Started</a>
        </nav>
      </header>

      {/* ── HERO ────────────────────────────────────── */}
      <section className="vw-hero vw-px" style={{ position:"relative", zIndex:1, padding:"88px 72px 72px", display:"grid", gridTemplateColumns:"1fr 1fr", alignItems:"center", gap:64, minHeight:"82vh" }}>
        <div>
          {/* Eyebrow */}
          <div className="vw-fade-1" style={{ display:"inline-flex", alignItems:"center", gap:8, background:"var(--electric-dim)", border:"1px solid rgba(0,229,255,0.2)", borderRadius:100, padding:"6px 16px", fontSize:12, fontWeight:500, color:"var(--electric)", letterSpacing:1, textTransform:"uppercase", marginBottom:16 }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:"var(--electric)", animation:"pulse 2s infinite", display:"inline-block" }} />
            AI-Powered Vocal Diagnostics
          </div>

          {/* Title */}
          <h1 className="vw-fade-2" style={{ fontFamily:"var(--font-playfair)", fontSize:"clamp(38px,4.8vw,60px)", fontWeight:800, lineHeight:1.1, color:"var(--white)", letterSpacing:"-1px", marginBottom:22 }}>
            Hear what<br />your voice<br />
            <em style={{ fontStyle:"italic", fontWeight:700, background:"linear-gradient(90deg,var(--electric),#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              is telling you
            </em>
          </h1>

          {/* Subtitle */}
          <p className="vw-fade-3" style={{ fontSize:15.5, color:"var(--slate)", maxWidth:460, marginBottom:36, lineHeight:1.82 }}>
            VocalWells uses locally-trained machine learning models and multi-modal acoustic feature engineering to detect vocal disorders earlier than traditional clinical methods — no specialist required.
          </p>

          {/* Buttons */}
          <div className="vw-fade-4" style={{ display:"flex", alignItems:"center", gap:16 }}>
            <button className="vw-btn-primary" style={{ fontFamily:"var(--font-dm-sans)" }}>Start Free Analysis</button>
            <button className="vw-btn-ghost" style={{ fontFamily:"var(--font-dm-sans)" }}>
              <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none"/></svg>
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div style={{ display:"flex", gap:36, marginTop:44, paddingTop:36, borderTop:"1px solid rgba(255,255,255,0.06)" }}>
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <span style={{ fontFamily:"var(--font-syne)", fontSize:28, fontWeight:700, color:"var(--white)", display:"block" }}>{value}</span>
                <div style={{ fontSize:12, color:"var(--slate)", textTransform:"uppercase", letterSpacing:"0.8px", marginTop:4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Waveform Visual */}
       <div className="vw-hero-vis" style={{ position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }}>
  <div style={{ width:420, height:420, position:"relative" }}>
    
    <div className="vw-ring-1" />
    <div className="vw-ring-2" />
    <div className="vw-ring-3" />

    {/* Center glow */}
    <div
      style={{
        position:"absolute",
        inset:90,
        borderRadius:"50%",
        background:"radial-gradient(circle,rgba(0,229,255,0.15) 0%,rgba(0,229,255,0.05) 50%,transparent 70%)"
      }}
    />

    {/* ✅ FIXED WAVEFORM (centered) */}
    <div
      style={{
        position:"absolute",
        top:"50%",
        left:"50%",
        transform:"translate(-50%, -50%)",
        display:"flex",
        alignItems:"flex-end",
        gap:4,
        height:80   // thoda bada for better look
      }}
    >
      {BAR_HEIGHTS.map((h, i) => (
        <div
          key={i}
          className="vw-bar"
          style={{
            height:`${h}%`,
            animationDelay:`${i * 0.1}s`
          }}
        />
      ))}
    </div>

  </div>

  {/* Chips */}
  {CHIPS.map(({ label, value, pos, delay }) => (
    <div key={label} className="vw-chip" style={{ animationDelay: delay, ...pos }}>
      <div style={{ color:"var(--slate)", fontSize:11, textTransform:"uppercase", letterSpacing:"0.8px" }}>
        {label}
      </div>
      <div style={{ color:"var(--electric)", fontFamily:"var(--font-syne)", fontWeight:700, fontSize:18 }}>
        {value}
      </div>
    </div>
  ))}
</div>
        </section>

      {/* ── FEATURES ────────────────────────────────── */}
      <section id="features" className="vw-px" style={{ padding:"76px 72px", position:"relative", zIndex:1, background:"linear-gradient(180deg,transparent 0%,rgba(0,229,255,0.02) 50%,transparent 100%)" }}>
        <div style={{ textAlign:"center", marginBottom:52 }}>
          <div style={{ fontSize:11, textTransform:"uppercase", letterSpacing:2, color:"var(--electric)", fontWeight:500, marginBottom:10 }}>Core Capabilities</div>
          <h2 style={{ fontFamily:"var(--font-syne)", fontSize:"clamp(28px,4vw,44px)", fontWeight:700, color:"var(--white)", letterSpacing:"-1px", lineHeight:1.1, marginBottom:14 }}>Built different, by design</h2>
          <p style={{ maxWidth:500, margin:"0 auto", color:"var(--slate)" }}>Every component of VocalWells is purpose-engineered for clinical-grade accuracy — not retrofitted from generic AI tools.</p>
        </div>
        <div className="vw-feat-grid" style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:1, background:"rgba(0,229,255,0.06)", borderRadius:20, overflow:"hidden" }}>
          {FEATURES.map(({ title, desc, tag, icon }) => (
            <div key={title} className="vw-feature-cell">
              <div style={{ width:48, height:48, background:"var(--electric-dim)", border:"1px solid rgba(0,229,255,0.2)", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:24 }}>{icon}</div>
              <h4 style={{ fontFamily:"var(--font-syne)", fontSize:20, fontWeight:700, color:"var(--white)", marginBottom:12, letterSpacing:"-0.3px" }}>{title}</h4>
              <p style={{ color:"var(--slate)", fontSize:15, lineHeight:1.75 }}>{desc}</p>
              <span style={{ display:"inline-block", marginTop:20, fontSize:11, textTransform:"uppercase", letterSpacing:1, color:"var(--electric)", background:"var(--electric-dim)", border:"1px solid rgba(0,229,255,0.15)", padding:"4px 12px", borderRadius:100 }}>{tag}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── PILLARS ─────────────────────────────────── */}
      <section id="pillars" className="vw-px" style={{ padding:"72px 72px", position:"relative", zIndex:1 }}>
        <div className="vw-pillars" style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:80, alignItems:"start" }}>
          <div style={{ position:"sticky", top:120 }}>
            <div style={{ fontSize:11, textTransform:"uppercase", letterSpacing:2, color:"var(--electric)", fontWeight:500, marginBottom:10 }}>Innovation</div>
            <h2 style={{ fontFamily:"var(--font-syne)", fontSize:"clamp(28px,4vw,44px)", fontWeight:700, color:"var(--white)", letterSpacing:"-1px", lineHeight:1.1, marginBottom:14 }}>What makes VocalWells different</h2>
            <p style={{ color:"var(--slate)", marginTop:16, maxWidth:280, fontSize:15 }}>Three pillars of technical differentiation that set a new standard for vocal health AI.</p>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
            {PILLARS.map(({ num, title, desc }) => (
              <div key={num} className="vw-pillar">
                <div style={{ fontFamily:"var(--font-syne)", fontSize:13, fontWeight:700, color:"var(--electric)", opacity:.5, flexShrink:0, marginTop:4 }}>{num}</div>
                <div>
                  <h5 style={{ fontFamily:"var(--font-syne)", fontSize:18, fontWeight:700, color:"var(--white)", marginBottom:8, letterSpacing:"-0.2px" }}>{title}</h5>
                  <p style={{ color:"var(--slate)", fontSize:14, lineHeight:1.75 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────── */}
      <section id="how" className="vw-px" style={{ padding:"80px 72px", position:"relative", zIndex:1 }}>
        <div style={{ textAlign:"center", marginBottom:52 }}>
          <div style={{ fontSize:11, textTransform:"uppercase", letterSpacing:2, color:"var(--electric)", fontWeight:500, marginBottom:10 }}>Process</div>
          <h2 style={{ fontFamily:"var(--font-syne)", fontSize:"clamp(28px,4vw,44px)", fontWeight:700, color:"var(--white)", letterSpacing:"-1px", lineHeight:1.1 }}>From voice to insight in seconds</h2>
        </div>
        <div className="vw-steps vw-steps-line" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", position:"relative" }}>
          {STEPS.map(({ num, title, desc }) => (
            <div key={num} style={{ padding:"0 24px", textAlign:"center" }}>
              <div className="vw-step-ring" style={{ width:64, height:64, borderRadius:"50%", border:"1px solid rgba(0,229,255,0.25)", background:"var(--navy-soft)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", fontFamily:"var(--font-syne)", fontSize:20, fontWeight:800, color:"var(--electric)" }}>{num}</div>
              <h5 style={{ fontFamily:"var(--font-syne)", fontSize:17, fontWeight:700, color:"var(--white)", marginBottom:8 }}>{title}</h5>
              <p style={{ color:"var(--slate)", fontSize:13 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT ───────────────────────────────────── */}
      <section id="about" className="vw-px" style={{ padding:"80px 72px", position:"relative", zIndex:1, background:"linear-gradient(135deg,rgba(124,58,237,0.04) 0%,rgba(0,229,255,0.04) 100%)" }}>
        <div className="vw-about" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"center" }}>
          <div>
            <div style={{ fontSize:11, textTransform:"uppercase", letterSpacing:2, color:"var(--electric)", fontWeight:500, marginBottom:10 }}>Mission</div>
            <h2 style={{ fontFamily:"var(--font-syne)", fontSize:"clamp(28px,4vw,44px)", fontWeight:700, color:"var(--white)", letterSpacing:"-1px", lineHeight:1.1, marginBottom:20 }}>Healthcare shouldn&apos;t wait for a specialist&apos;s schedule</h2>
            <p style={{ color:"var(--slate)", fontSize:16, lineHeight:1.85, marginBottom:20 }}>Vocal disorders affect over 30 million people globally, yet the average wait time for an ENT consultation exceeds 3 months. By the time many patients are diagnosed, conditions that were once reversible have progressed significantly.</p>
            <p style={{ color:"var(--slate)", fontSize:16, lineHeight:1.85 }}>VocalWells was built to close this gap — not by replacing clinicians, but by giving every person on the planet a first line of detection that&apos;s fast, private, and accurate.</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginTop:32 }}>
              {METRICS.map(({ val, desc }) => (
                <div key={val} style={{ background:"var(--card-bg)", border:"1px solid var(--card-border)", borderRadius:14, padding:"20px 24px" }}>
                  <span style={{ fontFamily:"var(--font-syne)", fontSize:32, fontWeight:800, display:"block", background:"linear-gradient(135deg,var(--white),var(--electric))", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>{val}</span>
                  <p style={{ fontSize:13, color:"var(--slate)", marginTop:6 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Report Preview */}
          <div className="vw-report-top" style={{ background:"var(--navy-mid)", border:"1px solid rgba(0,229,255,0.1)", borderRadius:20, padding:28, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(90deg,var(--electric),var(--violet))" }} />
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
              <div style={{ fontFamily:"var(--font-syne)", fontSize:15, fontWeight:700, color:"var(--white)" }}>Voice Analysis Report</div>
              <div style={{ padding:"4px 12px", borderRadius:100, background:"rgba(0,229,255,0.1)", color:"var(--electric)", fontSize:11, fontWeight:500 }}>Live Preview</div>
            </div>
            {REPORT_ROWS.map(({ label, pct, color, text, bar }, i) => (
              <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom: i < REPORT_ROWS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                <span style={{ fontSize:13, color:"var(--slate)" }}>{label}</span>
                <div style={{ width:100, height:4, background:"rgba(255,255,255,0.06)", borderRadius:2, margin:"0 16px" }}>
                  <div style={{ width:`${pct}%`, height:"100%", borderRadius:2, background:bar }} />
                </div>
                <span style={{ fontSize:13, fontWeight:500, color }}>{text}</span>
              </div>
            ))}
            <div style={{ marginTop:20, padding:16, background:"var(--electric-dim)", borderRadius:12, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ fontSize:13, color:"var(--slate)" }}>Overall Vocal Health Score</div>
                <div style={{ fontSize:12, color:"var(--slate)", marginTop:4 }}>Based on 12 biomarkers analyzed</div>
              </div>
              <div style={{ fontFamily:"var(--font-syne)", fontSize:28, fontWeight:800, color:"var(--electric)" }}>84 <span style={{ fontSize:16, color:"var(--slate)" }}>/100</span></div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="vw-px" style={{ padding:"56px 72px 80px", position:"relative", zIndex:1 }}>
        <div style={{ background:"linear-gradient(135deg,var(--navy-soft) 0%,rgba(124,58,237,0.2) 100%)", border:"1px solid rgba(0,229,255,0.15)", borderRadius:24, padding:"72px 80px", textAlign:"center", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-60, left:"50%", transform:"translateX(-50%)", width:400, height:400, background:"radial-gradient(circle,rgba(0,229,255,0.08) 0%,transparent 70%)", pointerEvents:"none" }} />
          <div style={{ fontSize:11, textTransform:"uppercase", letterSpacing:2, color:"var(--electric)", fontWeight:500, marginBottom:10 }}>Get Started</div>
          <h2 style={{ fontFamily:"var(--font-syne)", fontSize:"clamp(28px,4vw,46px)", fontWeight:700, color:"var(--white)", letterSpacing:"-1px", lineHeight:1.1, marginBottom:16 }}>Take control of your vocal health today</h2>
          <p style={{ color:"var(--slate)", fontSize:16, marginBottom:40 }}>No app download. No account required. Just your voice and 5 seconds of your time.</p>
          <div style={{ display:"flex", justifyContent:"center", gap:16 }}>
            
    <button
  className="vw-btn-primary"
  style={{ fontFamily:"var(--font-dm-sans)" }}
  onClick={() => {
  console.log("CLICKED");
  onStart && onStart();
}}
>
  Run Free Analysis
</button>
            <button className="vw-btn-outline" style={{ fontFamily:"var(--font-dm-sans)" }} >
              Request Clinical Access
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}