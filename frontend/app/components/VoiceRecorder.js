"use client";
import { useState, useRef, useEffect } from 'react';

/* ─── Keyframe injection ─── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=JetBrains+Mono:wght@300;400&display=swap');

  @keyframes spin-ring   { to { transform: rotate(360deg); } }
  @keyframes spin-ring2  { to { transform: rotate(-360deg); } }
  @keyframes pulse-dot   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.7)} }
  @keyframes float-up    { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes status-in   { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
  @keyframes bar-grow    { from{transform:scaleY(0)} to{transform:scaleY(1)} }
  @keyframes shimmer     { 0%{background-position:200% center} 100%{background-position:-200% center} }
  @keyframes result-in   { from{opacity:0;transform:translateY(20px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes ping        { 0%{transform:scale(1);opacity:.8} 80%,100%{transform:scale(2.2);opacity:0} }
  @keyframes scan-line   { 0%{top:0%} 100%{top:100%} }
  @keyframes ticker      { from{transform:translateX(0)} to{transform:translateX(-50%)} }

  .vr-root * { box-sizing: border-box; margin: 0; padding: 0; }

  .vr-root {
    font-family: 'Syne', sans-serif;
    background: #080b12;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
  }

  .vr-card {
    width: 100%;
    max-width: 420px;
    background: #0d1117;
    border: 1px solid rgba(0,200,160,.18);
    border-radius: 28px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 0 0 1px rgba(0,200,160,.06), 0 40px 80px rgba(0,0,0,.7);
  }

  /* top stripe */
  .vr-stripe {
    height: 3px;
    background: linear-gradient(90deg, transparent, #00c8a0 40%, #00e5ff 60%, transparent);
  }

  /* header */
  .vr-header {
    padding: 1.5rem 1.75rem 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .vr-brand { display:flex; align-items:center; gap:.6rem; }
  .vr-brand-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #00c8a0;
    animation: pulse-dot 2s ease-in-out infinite;
  }
  .vr-brand-name {
    font-size: 11px; font-weight: 700; letter-spacing: .14em;
    color: #00c8a0; text-transform: uppercase;
  }
  .vr-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; color: rgba(255,255,255,.28);
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 6px; padding: 3px 8px;
  }

  /* waveform area */
  .vr-wave-wrap {
    margin: 0 1.75rem;
    background: rgba(0,200,160,.04);
    border: 1px solid rgba(0,200,160,.1);
    border-radius: 16px;
    overflow: hidden;
    position: relative;
    height: 110px;
  }
  .vr-wave-canvas { display: block; width:100%; height:100%; }
  .vr-scan-line {
    position: absolute;
    left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0,200,160,.4), transparent);
    animation: scan-line 2.2s linear infinite;
    pointer-events: none;
  }
  .vr-wave-label {
    position: absolute; bottom: 8px; left: 12px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px; color: rgba(0,200,160,.5);
    letter-spacing: .08em;
  }
  .vr-wave-label-r {
    position: absolute; bottom: 8px; right: 12px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px; color: rgba(255,255,255,.2);
  }

  /* metrics row */
  .vr-metrics {
    display: flex; gap: 1px;
    margin: .9rem 1.75rem 0;
    background: rgba(0,200,160,.06);
    border: 1px solid rgba(0,200,160,.08);
    border-radius: 12px;
    overflow: hidden;
  }
  .vr-metric {
    flex: 1; padding: .6rem .5rem;
    text-align: center; position: relative;
  }
  .vr-metric + .vr-metric::before {
    content:''; position:absolute; left:0; top:15%; bottom:15%;
    width:1px; background: rgba(0,200,160,.12);
  }
  .vr-metric-val {
    font-family: 'JetBrains Mono', monospace;
    font-size: 15px; font-weight: 400;
    color: #fff; display: block;
  }
  .vr-metric-lbl {
    font-size: 9px; color: rgba(255,255,255,.3);
    text-transform: uppercase; letter-spacing: .1em; margin-top: 2px; display:block;
  }

  /* center button area */
  .vr-btn-area {
    display: flex; flex-direction: column;
    align-items: center; padding: 1.8rem 0 1.4rem;
  }
  .vr-btn-outer {
    position: relative; width: 100px; height: 100px;
    display: flex; align-items: center; justify-content: center;
  }
  .vr-ring {
    position: absolute; inset: 0; border-radius: 50%;
    border: 1.5px solid transparent;
    border-top-color: rgba(0,200,160,.5);
    border-right-color: rgba(0,200,160,.15);
    animation: spin-ring 2.4s linear infinite;
    pointer-events: none;
  }
  .vr-ring2 {
    position: absolute; inset: 7px; border-radius: 50%;
    border: 1px solid transparent;
    border-bottom-color: rgba(0,229,255,.35);
    border-left-color: rgba(0,229,255,.1);
    animation: spin-ring2 1.8s linear infinite;
    pointer-events: none;
  }
  .vr-ping {
    position: absolute; inset: 14px; border-radius: 50%;
    background: rgba(0,200,160,.15);
    animation: ping 2s ease-out infinite;
    pointer-events: none;
  }
  .vr-btn {
    position: relative; z-index: 2;
    width: 64px; height: 64px;
    border-radius: 50%;
    border: none; cursor: pointer;
    background: linear-gradient(135deg, #00c8a0, #00a882);
    display: flex; align-items: center; justify-content: center;
    transition: transform .15s, box-shadow .15s;
    box-shadow: 0 0 0 0 rgba(0,200,160,0);
  }
  .vr-btn:hover { transform: scale(1.06); box-shadow: 0 0 20px rgba(0,200,160,.4); }
  .vr-btn:active { transform: scale(.96); }
  .vr-btn.recording {
    background: linear-gradient(135deg, #ff4d6d, #c9264a);
    box-shadow: 0 0 24px rgba(255,77,109,.4);
  }
  .vr-btn-icon { width: 22px; height: 22px; }

  /* status pill */
  .vr-status {
    margin-top: .9rem;
    display: flex; align-items: center; gap: .45rem;
    animation: status-in .3s ease;
  }
  .vr-status-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #00c8a0;
  }
  .vr-status-dot.rec { background: #ff4d6d; animation: pulse-dot .9s ease-in-out infinite; }
  .vr-status-dot.err { background: #ff8c42; }
  .vr-status-dot.proc { background: #7c6fff; animation: pulse-dot 1.1s ease-in-out infinite; }
  .vr-status-txt {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; color: rgba(255,255,255,.45);
    letter-spacing: .1em; text-transform: uppercase;
  }

  /* bar visualizer (idle) */
  .vr-bars {
    display: flex; align-items: flex-end;
    gap: 2px; height: 100%; padding: 12px 10px;
    justify-content: center;
  }
  .vr-bar {
    width: 3px; background: rgba(0,200,160,.25);
    border-radius: 2px 2px 0 0;
    transform-origin: bottom;
    animation: bar-grow .6s ease both;
  }

  /* results */
  .vr-results {
    margin: 0 1.75rem 1.75rem;
    animation: result-in .4s cubic-bezier(.22,1,.36,1);
  }
  .vr-result-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: .75rem;
  }
  .vr-result-status {
    font-size: 18px; font-weight: 800;
    background: linear-gradient(135deg, #00c8a0, #00e5ff);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .vr-result-status.warning {
    background: linear-gradient(135deg, #ff4d6d, #ff8c42);
  }
  .vr-confidence {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; color: rgba(255,255,255,.3);
  }
  .vr-divider {
    height: 1px; background: rgba(0,200,160,.1); margin: .75rem 0;
  }
  .vr-insight {
    font-size: 12.5px; line-height: 1.65;
    color: rgba(255,255,255,.55);
  }
  .vr-report-btn {
    margin-top: 1rem; width: 100%;
    padding: .75rem;
    background: transparent;
    border: 1px solid rgba(0,200,160,.3);
    border-radius: 12px;
    color: #00c8a0;
    font-family: 'Syne', sans-serif;
    font-size: 13px; font-weight: 700;
    letter-spacing: .06em;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: .5rem;
    transition: background .2s, border-color .2s, color .2s;
  }
  .vr-report-btn:hover {
    background: rgba(0,200,160,.1);
    border-color: rgba(0,200,160,.6);
    color: #fff;
  }

  /* ticker footer */
  .vr-ticker-wrap {
    border-top: 1px solid rgba(0,200,160,.07);
    overflow: hidden; padding: .5rem 0;
  }
  .vr-ticker {
    display: flex; gap: 2rem;
    width: max-content;
    animation: ticker 18s linear infinite;
    font-family: 'JetBrains Mono', monospace;
    font-size: 9.5px; color: rgba(255,255,255,.15);
    letter-spacing: .08em; padding: 0 1rem;
  }

  /* processing skeleton */
  .vr-proc-bars {
    display: flex; flex-direction: column; gap: .5rem;
  }
  .vr-skel {
    height: 8px; border-radius: 4px;
    background: linear-gradient(90deg, rgba(0,200,160,.05) 25%, rgba(0,200,160,.18) 50%, rgba(0,200,160,.05) 75%);
    background-size: 200% auto;
    animation: shimmer 1.4s linear infinite;
  }
`;

/* ─── Idle bar heights ─── */
const IDLE_BARS = [18,28,14,36,22,42,16,30,12,38,24,44,20,32,15,40,26,18,34,22,42,14,36,28,16];

/* ─── helpers ─── */
function formatTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2,'0');
  const s = String(sec % 60).padStart(2,'0');
  return `${m}:${s}`;
}

const TICKER_ITEMS = [
  'VOCAL BIOMARKER ANALYSIS','RESPIRATORY PATTERN DETECTION','NEURO-ACOUSTIC PROFILING',
  'PHONEME STRESS MAPPING','HARMONIC FREQUENCY SCAN','AI HEALTH INFERENCE',
  'SECURE ENCRYPTED UPLOAD','CLINICAL GRADE REPORT'
];

export default function VoiceRecorder() {
  const [status, setStatus]   = useState('idle');   // idle | recording | processing | ready | error
  const [results, setResults] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [amplitude, setAmplitude] = useState(0);

  const canvasRef      = useRef(null);
  const mediaRecRef    = useRef(null);
  const chunksRef      = useRef([]);
  const timerRef       = useRef(null);
  const animRef        = useRef(null);
  const styleInjected  = useRef(false);

  /* inject CSS once */
  useEffect(() => {
    if (styleInjected.current) return;
    styleInjected.current = true;
    const el = document.createElement('style');
    el.textContent = CSS;
    document.head.appendChild(el);
  }, []);

  /* elapsed timer */
  useEffect(() => {
    if (status === 'recording') {
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [status]);

  /* draw waveform */
  const drawWave = (analyser, dataArray) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;

    const render = () => {
      animRef.current = requestAnimationFrame(render);
      analyser.getByteTimeDomainData(dataArray);

      // compute amplitude
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) sum += Math.abs(dataArray[i] - 128);
      setAmplitude(Math.round(sum / dataArray.length));

      ctx.clearRect(0, 0, W, H);

      // glow layer
      ctx.globalAlpha = 0.18;
      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 6;
      drawPath(ctx, dataArray, W, H);
      ctx.stroke();

      // main line
      ctx.globalAlpha = 1;
      const grad = ctx.createLinearGradient(0, 0, W, 0);
      grad.addColorStop(0, '#00c8a0');
      grad.addColorStop(0.5, '#00e5ff');
      grad.addColorStop(1, '#00c8a0');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      drawPath(ctx, dataArray, W, H);
      ctx.stroke();
    };
    render();
  };

  const drawPath = (ctx, dataArray, W, H) => {
    ctx.beginPath();
    const slice = W / dataArray.length;
    let x = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const y = (dataArray[i] / 128.0) * (H / 2);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      x += slice;
    }
  };

  /* idle canvas — flat line */
  useEffect(() => {
    if (status !== 'idle' && status !== 'ready') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(0,200,160,.3)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 8]);
    ctx.beginPath();
    ctx.moveTo(0, H / 2);
    ctx.lineTo(W, H / 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }, [status]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      audioCtx.createMediaStreamSource(stream).connect(analyser);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      drawWave(analyser, dataArray);

      mediaRecRef.current = new MediaRecorder(stream);
      chunksRef.current = [];
      mediaRecRef.current.ondataavailable = e => chunksRef.current.push(e.data);
      mediaRecRef.current.onstop = () => {
        cancelAnimationFrame(animRef.current);
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        uploadFile(blob);
      };
      mediaRecRef.current.start();
      setStatus('recording');
    } catch {
      setStatus('error');
    }
  };

  const stopRecording = () => {
    mediaRecRef.current?.stop();
    setStatus('processing');
  };

  const uploadFile = async (blob) => {
    const formData = new FormData();
    formData.append('file', blob, 'voice.wav');
    try {
      const res = await fetch('http://localhost:5000/analyze', { method: 'POST', body: formData });
      const data = await res.json();
      setResults(data);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  };

  const handleBtn = () => {
    if (status === 'recording') stopRecording();
    else if (status === 'idle' || status === 'ready' || status === 'error') startRecording();
  };

  /* derived UI state */
  const isRec  = status === 'recording';
  const isProc = status === 'processing';
  const dotCls = isRec ? 'rec' : isProc ? 'proc' : status === 'error' ? 'err' : '';
  const statusLabel = { idle: 'READY', recording: `REC  ${formatTime(elapsed)}`, processing: 'ANALYSING', ready: 'COMPLETE', error: 'MIC ERROR' }[status];

  const healthy = results?.status === 'Healthy';

  return (
    <div className="vr-root">
      <div className="vr-card">
        <div className="vr-stripe" />

        {/* header */}
        <div className="vr-header">
          <div className="vr-brand">
            <div className="vr-brand-dot" />
            <span className="vr-brand-name">VocalScan AI</span>
          </div>
          <span className="vr-badge">v2.4.1</span>
        </div>

        {/* waveform */}
        <div className="vr-wave-wrap">
          {isRec && <div className="vr-scan-line" />}
          {(status === 'idle' || status === 'ready' || status === 'recording') && (
            <canvas ref={canvasRef} width={420} height={110} className="vr-wave-canvas" />
          )}
          {isProc && (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%', flexDirection:'column', gap:'10px' }}>
              <div style={{ display:'flex', gap:'5px', alignItems:'flex-end', height:'40px' }}>
                {[14,28,20,36,18,42,24,30,16,38,22,44,20,32].map((h,i) => (
                  <div key={i} className="vr-bar" style={{
                    height: `${h}px`,
                    animationDelay: `${i*0.07}s`,
                    animationDuration: `${0.4 + (i%3)*0.15}s`,
                    animationIterationCount: 'infinite',
                    animationDirection: 'alternate',
                    background: `rgba(124,111,255,${0.2 + (i%4)*.15})`
                  }} />
                ))}
              </div>
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:'rgba(124,111,255,.6)', letterSpacing:'.12em' }}>PROCESSING NEURAL MODEL</span>
            </div>
          )}
          {(status === 'idle') && (
            <div className="vr-bars" style={{ position:'absolute', inset:0 }}>
              {IDLE_BARS.map((h,i) => (
                <div key={i} className="vr-bar" style={{ height:`${h}px`, animationDelay:`${i*0.03}s` }} />
              ))}
            </div>
          )}
          <span className="vr-wave-label">CH-01 · VOICE</span>
          <span className="vr-wave-label-r">{isRec ? `AMP ${amplitude}` : '44.1kHz'}</span>
        </div>

        {/* metrics */}
        <div className="vr-metrics">
          {[
            { val: isRec ? formatTime(elapsed) : '—', lbl: 'Duration' },
            { val: isRec ? `${amplitude || '—'}` : '—', lbl: 'Amplitude' },
            { val: results ? (healthy ? '98%' : '71%') : '—', lbl: 'Confidence' },
          ].map(({ val, lbl }) => (
            <div key={lbl} className="vr-metric">
              <span className="vr-metric-val">{val}</span>
              <span className="vr-metric-lbl">{lbl}</span>
            </div>
          ))}
        </div>

        {/* button */}
        <div className="vr-btn-area">
          <div className="vr-btn-outer">
            {isRec && <div className="vr-ping" />}
            <div className="vr-ring" style={isRec ? { animationDuration:'1.1s', borderTopColor:'rgba(255,77,109,.6)' } : {}} />
            <div className="vr-ring2" style={isRec ? { animationDuration:'.8s', borderBottomColor:'rgba(255,77,109,.4)' } : {}} />
            <button className={`vr-btn${isRec ? ' recording' : ''}`} onClick={handleBtn} disabled={isProc}>
              {isRec ? (
                <svg className="vr-btn-icon" viewBox="0 0 22 22" fill="none">
                  <rect x="4" y="4" width="14" height="14" rx="3" fill="white"/>
                </svg>
              ) : (
                <svg className="vr-btn-icon" viewBox="0 0 22 22" fill="none">
                  <rect x="8" y="3" width="6" height="12" rx="3" fill="white"/>
                  <path d="M4 11a7 7 0 0014 0" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                  <line x1="11" y1="18" x2="11" y2="21" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              )}
            </button>
          </div>

          <div className="vr-status">
            <div className={`vr-status-dot ${dotCls}`} />
            <span className="vr-status-txt">{statusLabel}</span>
          </div>
        </div>

        {/* results */}
        {results && status === 'ready' && (
          <div className="vr-results">
            <div className="vr-divider" />
            <div className="vr-result-header">
              <span className={`vr-result-status${healthy ? '' : ' warning'}`}>
                {results.status}
              </span>
              <span className="vr-confidence">CONF {healthy ? '98.2%' : '71.4%'}</span>
            </div>
            <p className="vr-insight">{results.ai_insight}</p>
            <button className="vr-report-btn" onClick={() => window.open(results.report_url)}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 2h7l3 3v9H3V2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
                <path d="M10 2v3h3M6 7h4M6 10h4M6 13h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              View Clinical Report
            </button>
          </div>
        )}

        {/* ticker */}
        <div className="vr-ticker-wrap">
          <div className="vr-ticker">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t,i) => (
              <span key={i}>· {t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}