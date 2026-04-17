"use client";
import { useState, useRef, useEffect } from "react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@300;400;500&display=swap');

  .vw-root {
    min-height: 100vh;
    background: #020608;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Mono', monospace;
    overflow: hidden;
    position: relative;
  }

  .vw-bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }

  .vw-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(0,210,150,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,210,150,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  .vw-orb1 {
    position: absolute;
    width: 600px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,210,150,0.08) 0%, transparent 70%);
    top: -200px; left: -200px;
    animation: vwPulseOrb 6s ease-in-out infinite;
  }

  .vw-orb2 {
    position: absolute;
    width: 400px; height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,120,255,0.06) 0%, transparent 70%);
    bottom: -100px; right: -100px;
    animation: vwPulseOrb 8s ease-in-out infinite reverse;
  }

  @keyframes vwPulseOrb {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.15); opacity: 0.6; }
  }

  .vw-card {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 480px;
    padding: 2.5rem 2rem;
    margin: 2rem 1rem;
    background: rgba(8, 16, 14, 0.85);
    border: 1px solid rgba(0,210,150,0.18);
    border-radius: 24px;
    backdrop-filter: blur(20px);
    box-shadow: 0 0 60px rgba(0,210,150,0.06), inset 0 1px 0 rgba(0,210,150,0.1);
  }

  .vw-header {
    text-align: center;
    margin-bottom: 2.5rem;
  }

  .vw-logo {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 0.5rem;
  }

  .vw-logo-icon {
    width: 36px; height: 36px;
    position: relative;
  }

  .vw-logo-icon svg {
    width: 100%; height: 100%;
  }

  .vw-title {
    font-family: 'Syne', sans-serif;
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    background: linear-gradient(135deg, #00d296 0%, #00a8ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
  }

  .vw-tagline {
    font-size: 0.7rem;
    color: rgba(0,210,150,0.5);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-top: 4px;
  }

  .vw-divider {
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0,210,150,0.3), transparent);
    margin: 1.5rem 0;
  }

  /* Waveform canvas */
  .vw-wave-container {
    position: relative;
    height: 72px;
    margin: 0 0 2rem;
    border-radius: 12px;
    overflow: hidden;
    background: rgba(0,0,0,0.3);
    border: 1px solid rgba(0,210,150,0.1);
  }

  .vw-wave-canvas {
    width: 100%;
    height: 100%;
    display: block;
  }

  .vw-wave-label {
    position: absolute;
    top: 8px; left: 12px;
    font-size: 0.6rem;
    color: rgba(0,210,150,0.4);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  /* Record button */
  .vw-btn-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.2rem;
    margin-bottom: 2rem;
  }

  .vw-btn-ring {
    position: relative;
    width: 120px; height: 120px;
  }

  .vw-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 1.5px solid rgba(0,210,150,0.25);
    animation: vwRingExpand 2.4s ease-out infinite;
  }
  .vw-ring:nth-child(2) { animation-delay: 0.8s; }
  .vw-ring:nth-child(3) { animation-delay: 1.6s; }

  .vw-ring.active {
    border-color: rgba(0,210,150,0.5);
    animation-duration: 1.2s;
  }
  .vw-ring.active:nth-child(2) { animation-delay: 0.4s; }
  .vw-ring.active:nth-child(3) { animation-delay: 0.8s; }

  @keyframes vwRingExpand {
    0% { transform: scale(0.85); opacity: 0.7; }
    100% { transform: scale(1.4); opacity: 0; }
  }

  .vw-btn {
    position: absolute;
    inset: 10px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 0.7rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    transition: all 0.25s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 4px;
  }

  .vw-btn.idle {
    background: linear-gradient(145deg, rgba(0,210,150,0.15), rgba(0,210,150,0.05));
    color: #00d296;
    border: 1.5px solid rgba(0,210,150,0.5);
    box-shadow: 0 0 30px rgba(0,210,150,0.15), inset 0 1px 0 rgba(0,210,150,0.2);
  }

  .vw-btn.idle:hover {
    background: linear-gradient(145deg, rgba(0,210,150,0.25), rgba(0,210,150,0.1));
    box-shadow: 0 0 50px rgba(0,210,150,0.3), inset 0 1px 0 rgba(0,210,150,0.3);
    transform: scale(1.04);
  }

  .vw-btn.recording {
    background: linear-gradient(145deg, rgba(255,60,90,0.2), rgba(255,60,90,0.08));
    color: #ff3c5a;
    border: 1.5px solid rgba(255,60,90,0.5);
    box-shadow: 0 0 40px rgba(255,60,90,0.2), inset 0 1px 0 rgba(255,60,90,0.2);
    animation: vwBtnPulse 1s ease-in-out infinite;
  }

  @keyframes vwBtnPulse {
    0%, 100% { box-shadow: 0 0 40px rgba(255,60,90,0.2); }
    50% { box-shadow: 0 0 60px rgba(255,60,90,0.4); }
  }

  .vw-btn.processing {
    background: rgba(0,168,255,0.1);
    color: #00a8ff;
    border: 1.5px solid rgba(0,168,255,0.4);
    cursor: not-allowed;
    animation: vwSpin 1.5s linear infinite;
  }

  @keyframes vwSpin {
    0% { box-shadow: 0 0 0 0 rgba(0,168,255,0.3); }
    50% { box-shadow: 0 0 40px 5px rgba(0,168,255,0.15); }
    100% { box-shadow: 0 0 0 0 rgba(0,168,255,0.3); }
  }

  .vw-btn-icon {
    font-size: 1.4rem;
    line-height: 1;
  }

  /* Status bar */
  .vw-status-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 0.65rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  .vw-status-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
  }
  .vw-status-dot.idle { background: rgba(0,210,150,0.4); }
  .vw-status-dot.recording { background: #ff3c5a; animation: vwBlink 0.8s step-end infinite; }
  .vw-status-dot.processing { background: #00a8ff; animation: vwBlink 0.5s ease-in-out infinite; }
  .vw-status-dot.done { background: #00d296; }
  .vw-status-dot.error { background: #ff3c5a; }

  @keyframes vwBlink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.2; }
  }

  .vw-status-text { color: rgba(0,210,150,0.6); }
  .vw-status-text.recording { color: rgba(255,60,90,0.8); }
  .vw-status-text.processing { color: rgba(0,168,255,0.8); }
  .vw-status-text.done { color: rgba(0,210,150,0.9); }
  .vw-status-text.error { color: rgba(255,60,90,0.8); }

  /* Results */
  .vw-result {
    margin-top: 1.5rem;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid rgba(0,210,150,0.15);
    animation: vwSlideUp 0.4s ease;
  }

  @keyframes vwSlideUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .vw-result-header {
    padding: 1.2rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .vw-result-header.risk {
    background: linear-gradient(135deg, rgba(255,60,90,0.12), rgba(255,60,90,0.04));
    border-bottom: 1px solid rgba(255,60,90,0.2);
  }

  .vw-result-header.safe {
    background: linear-gradient(135deg, rgba(0,210,150,0.12), rgba(0,210,150,0.04));
    border-bottom: 1px solid rgba(0,210,150,0.2);
  }

  .vw-result-badge {
    width: 40px; height: 40px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem;
    flex-shrink: 0;
  }
  .vw-result-badge.risk { background: rgba(255,60,90,0.15); }
  .vw-result-badge.safe { background: rgba(0,210,150,0.15); }

  .vw-result-label {
    font-size: 0.6rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 2px;
    opacity: 0.5;
    color: #ccc;
  }

  .vw-result-prediction {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 1rem;
    letter-spacing: 0.02em;
  }
  .vw-result-prediction.risk { color: #ff3c5a; }
  .vw-result-prediction.safe { color: #00d296; }

  .vw-metrics {
    padding: 1rem 1.5rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    background: rgba(0,0,0,0.2);
  }

  .vw-metric {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 10px;
    padding: 0.75rem 1rem;
  }

  .vw-metric-label {
    font-size: 0.58rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.3);
    margin-bottom: 4px;
  }

  .vw-metric-value {
    font-family: 'Syne', sans-serif;
    font-size: 1.3rem;
    font-weight: 700;
    color: #00d296;
  }

  .vw-metric-bar {
    margin-top: 6px;
    height: 3px;
    background: rgba(255,255,255,0.06);
    border-radius: 2px;
    overflow: hidden;
  }

  .vw-metric-fill {
    height: 100%;
    border-radius: 2px;
    background: linear-gradient(90deg, #00d296, #00a8ff);
    transition: width 0.8s ease;
  }

  .vw-download {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 0.9rem 1.5rem;
    background: rgba(0,210,150,0.08);
    border: none;
    border-top: 1px solid rgba(0,210,150,0.12);
    color: #00d296;
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    text-decoration: none;
    cursor: pointer;
    transition: background 0.2s;
    width: 100%;
  }

  .vw-download:hover {
    background: rgba(0,210,150,0.14);
  }

  /* Footer */
  .vw-footer {
    text-align: center;
    margin-top: 1.5rem;
    font-size: 0.58rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(0,210,150,0.2);
  }

  /* Scan line effect */
  .vw-scanline {
    position: fixed;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(0,210,150,0.3), transparent);
    animation: vwScanDown 6s linear infinite;
    z-index: 0;
    pointer-events: none;
  }
  @keyframes vwScanDown {
    0% { top: -2px; }
    100% { top: 100vh; }
  }
`;

function WaveformCanvas({ isRecording, analyserNode }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const phaseRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    const H = canvas.height = canvas.offsetHeight * window.devicePixelRatio;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "transparent";

      if (isRecording && analyserNode) {
        const bufLen = analyserNode.frequencyBinCount;
        const data = new Uint8Array(bufLen);
        analyserNode.getByteTimeDomainData(data);
        ctx.beginPath();
        ctx.strokeStyle = "rgba(0,210,150,0.9)";
        ctx.lineWidth = 1.5 * window.devicePixelRatio;
        ctx.shadowColor = "#00d296";
        ctx.shadowBlur = 6;
        const sliceW = W / bufLen;
        let x = 0;
        for (let i = 0; i < bufLen; i++) {
          const v = data[i] / 128.0;
          const y = (v * H) / 2;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          x += sliceW;
        }
        ctx.lineTo(W, H / 2);
        ctx.stroke();
      } else {
        phaseRef.current += isRecording ? 0.06 : 0.015;
        const ph = phaseRef.current;
        ctx.beginPath();
        const opacity = isRecording ? 0.8 : 0.25;
        ctx.strokeStyle = `rgba(0,210,150,${opacity})`;
        ctx.lineWidth = 1.5 * window.devicePixelRatio;
        for (let x = 0; x <= W; x += 2) {
          const t = x / W;
          const amp = isRecording ? H * 0.35 : H * 0.1;
          const y = H / 2 + amp * Math.sin(t * 12 + ph) * Math.sin(t * 3.5 + ph * 0.3);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [isRecording, analyserNode]);

  return <canvas ref={canvasRef} className="vw-wave-canvas" />;
}

export default function VoiceWell() {
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const mediaRef = useRef(null);
  const chunks = useRef([]);
  const analyserRef = useRef(null);
  const audioCtxRef = useRef(null);

  const isRisk = result?.prediction?.toUpperCase().includes("RISK");

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtxRef.current.createMediaStreamSource(stream);
      const analyser = audioCtxRef.current.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;

      mediaRef.current = new MediaRecorder(stream);
      chunks.current = [];
      mediaRef.current.ondataavailable = e => { if (e.data.size > 0) chunks.current.push(e.data); };
      mediaRef.current.onstop = async () => {
        const blob = new Blob(chunks.current, { type: "audio/webm" });
        const wav = await convertToWav(blob);
        upload(wav);
      };
      mediaRef.current.start();
      setStatus("recording");
    } catch {
      setStatus("error");
    }
  };

  const stop = () => {
    if (mediaRef.current && status === "recording") {
      mediaRef.current.stop();
      mediaRef.current.stream?.getTracks().forEach(t => t.stop());
      setStatus("processing");
    }
  };

  const upload = async (blob) => {
    const fd = new FormData();
    fd.append("audio", blob, "voice.wav");
    try {
      const res = await fetch("http://127.0.0.1:5000/analyze", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setResult(data);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  const convertToWav = async (blob) => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const buffer = await blob.arrayBuffer();
    const audio = await ctx.decodeAudioData(buffer);
    const samples = audio.getChannelData(0);
    const wav = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(wav);
    const ws = (o, s) => { for (let i = 0; i < s.length; i++) view.setUint8(o + i, s.charCodeAt(i)); };
    ws(0, "RIFF"); view.setUint32(4, 36 + samples.length * 2, true); ws(8, "WAVE");
    ws(12, "fmt "); view.setUint32(16, 16, true); view.setUint16(20, 1, true);
    view.setUint16(22, 1, true); view.setUint32(24, audio.sampleRate, true);
    view.setUint32(28, audio.sampleRate * 2, true); view.setUint16(32, 2, true);
    view.setUint16(34, 16, true); ws(36, "data"); view.setUint32(40, samples.length * 2, true);
    for (let i = 0, o = 44; i < samples.length; i++, o += 2) {
      const s = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(o, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return new Blob([wav], { type: "audio/wav" });
  };

  const btnClass = ["idle", "recording", "processing"].includes(status) ? status : "idle";

  const statusLabels = {
    idle: "Ready — tap to begin",
    recording: "Recording — tap to stop",
    processing: "Analyzing voice patterns...",
    done: "Analysis complete",
    error: "Connection failed",
  };

  const btnIcons = { idle: "🎙", recording: "⏹", processing: "⏳", done: "🎙", error: "🎙" };

  return (
    <>
      <style>{CSS}</style>
      <div className="vw-root">
        <div className="vw-bg">
          <div className="vw-grid" />
          <div className="vw-orb1" />
          <div className="vw-orb2" />
        </div>
        <div className="vw-scanline" />

        <div className="vw-card">
          <div className="vw-header">
            <div className="vw-logo">
              <div className="vw-logo-icon">
                <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="18" cy="18" r="17" stroke="url(#lg1)" strokeWidth="1.5"/>
                  <path d="M6 18 Q9 10 12 18 Q15 26 18 18 Q21 10 24 18 Q27 26 30 18" stroke="url(#lg1)" strokeWidth="2" strokeLinecap="round" fill="none"/>
                  <defs>
                    <linearGradient id="lg1" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#00d296"/>
                      <stop offset="1" stopColor="#00a8ff"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h1 className="vw-title">VoiceWell</h1>
            </div>
            <p className="vw-tagline">Neural Voice Analysis · Parkinsons Detection</p>
          </div>

          <div className="vw-wave-container">
            <span className="vw-wave-label">Voice Signal</span>
            <WaveformCanvas isRecording={status === "recording"} analyserNode={analyserRef.current} />
          </div>

          <div className="vw-btn-area">
            <div className="vw-btn-ring">
              <div className={`vw-ring ${status === "recording" ? "active" : ""}`} />
              <div className={`vw-ring ${status === "recording" ? "active" : ""}`} />
              <div className={`vw-ring ${status === "recording" ? "active" : ""}`} />
              <button
                className={`vw-btn ${btnClass}`}
                onClick={status === "recording" ? stop : (status === "idle" || status === "done" || status === "error") ? start : undefined}
                disabled={status === "processing"}
              >
                <span className="vw-btn-icon">{btnIcons[status] || "🎙"}</span>
                <span>{status === "recording" ? "STOP" : "SCAN"}</span>
              </button>
            </div>

            <div className="vw-status-bar">
              <div className={`vw-status-dot ${status === "error" ? "error" : status}`} />
              <span className={`vw-status-text ${status === "error" ? "error" : status}`}>
                {statusLabels[status] || status}
              </span>
            </div>
          </div>

          {result && (
            <div className="vw-result">
              <div className={`vw-result-header ${isRisk ? "risk" : "safe"}`}>
                <div className={`vw-result-badge ${isRisk ? "risk" : "safe"}`}>
                  {isRisk ? "⚠" : "✓"}
                </div>
                <div>
                  <div className="vw-result-label">Diagnosis Output</div>
                  <div className={`vw-result-prediction ${isRisk ? "risk" : "safe"}`}>
                    {result.prediction}
                  </div>
                </div>
              </div>

              <div className="vw-metrics">
                {[
                  { label: "Jitter", value: result.metrics?.jitter, unit: "%" },
                  { label: "Shimmer", value: result.metrics?.shimmer, unit: "%" },
                  { label: "HNR", value: result.metrics?.hnr, unit: "dB" },
                  { label: "Confidence", value: result.metrics?.confidence, unit: "%" },
                ].filter(m => m.value !== undefined).map((m) => (
                  <div className="vw-metric" key={m.label}>
                    <div className="vw-metric-label">{m.label}</div>
                    <div className="vw-metric-value">{parseFloat(m.value).toFixed(2)}{m.unit}</div>
                    <div className="vw-metric-bar">
                      <div className="vw-metric-fill" style={{ width: `${Math.min(parseFloat(m.value), 100)}%` }} />
                    </div>
                  </div>
                ))}
                {result.metrics?.jitter !== undefined && result.metrics?.shimmer !== undefined && (
                  <>
                    <div className="vw-metric">
                      <div className="vw-metric-label">Jitter</div>
                      <div className="vw-metric-value">{parseFloat(result.metrics.jitter).toFixed(2)}%</div>
                      <div className="vw-metric-bar">
                        <div className="vw-metric-fill" style={{ width: `${Math.min(parseFloat(result.metrics.jitter), 100)}%` }} />
                      </div>
                    </div>
                    <div className="vw-metric">
                      <div className="vw-metric-label">Shimmer</div>
                      <div className="vw-metric-value">{parseFloat(result.metrics.shimmer).toFixed(2)}%</div>
                      <div className="vw-metric-bar">
                        <div className="vw-metric-fill" style={{ width: `${Math.min(parseFloat(result.metrics.shimmer), 100)}%` }} />
                      </div>
                    </div>
                  </>
                )}
              </div>

              <a
                href={`http://127.0.0.1:5000${result.report_url}`}
                target="_blank"
                rel="noreferrer"
                className="vw-download"
              >
                ↓ &nbsp; Download Clinical Report &nbsp; · &nbsp; PDF
              </a>
            </div>
          )}

          <div className="vw-divider" />
          <div className="vw-footer">PNN-Powered · Clinical Grade · Real-time Analysis</div>
        </div>
      </div>
    </>
  );
}