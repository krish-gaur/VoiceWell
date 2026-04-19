import VoiceRecorder from './components/VoiceRecorder';

export default function Analyse() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-start overflow-hidden bg-[#0A0A0F] px-6 py-10 text-slate-200">

      {/* Ambient background orbs */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -left-16 -top-20 h-[340px] w-[340px] animate-drift1 rounded-full bg-violet-600 opacity-20 blur-[80px]" />
        <div className="absolute -bottom-16 -right-10 h-[260px] w-[260px] animate-drift2 rounded-full bg-cyan-500 opacity-20 blur-[80px]" />
        <div className="absolute left-[60%] top-[40%] h-[200px] w-[200px] animate-drift3 rounded-full bg-pink-500 opacity-15 blur-[80px]" />
      </div>

      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-8">

        {/* Header */}
        <header className="flex flex-col items-center gap-1 text-center">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 text-xl shadow-lg">
              🎙
            </div>
            <h1 className="font-syne bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-4xl font-extrabold text-transparent">
              VoiceWell
            </h1>
          </div>
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Mental wellness through voice
          </p>
        </header>

        {/* Status pill */}
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_#4ade80]" />
          Ready to listen
        </div>

        {/* Recorder card */}
        <div className="w-full rounded-3xl border border-white/[0.07] bg-white/[0.03] p-6">
          <VoiceRecorder />
        </div>

        {/* Live transcript */}
        <div className="w-full rounded-2xl border border-white/[0.07] bg-white/[0.03] px-5 py-4">
          <p className="mb-2 text-[11px] uppercase tracking-widest text-slate-600">
            Live Transcript
          </p>
          <p className="min-h-[56px] text-sm leading-relaxed text-slate-300">
            Press record to begin your session...
          </p>
        </div>

        {/* Insight cards */}
        <div className="grid w-full grid-cols-3 gap-3">
          {[
            { label: 'Mood', value: '😌 Calm' },
            { label: 'Sessions', value: '12', sub: 'this week' },
            { label: 'Streak', value: '7 🔥', sub: 'days' },
          ].map(({ label, value, sub }) => (
            <div
              key={label}
              className="flex flex-col gap-1 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3 transition hover:border-violet-500/30"
            >
              <span className="text-[10px] uppercase tracking-wider text-slate-600">{label}</span>
              <span className="font-syne text-xl font-bold text-slate-100">{value}</span>
              {sub && <span className="text-[11px] text-slate-500">{sub}</span>}
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}