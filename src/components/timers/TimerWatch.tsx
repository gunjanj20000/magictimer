import React from 'react';

interface TimerWatchProps {
  progress: number; // 0.0 to 1.0
  elapsedMs: number;
  totalDurationMs: number;
  isPaused: boolean;
  direction?: 'grow' | 'disappear';
  className?: string;
}

export const TimerWatch: React.FC<TimerWatchProps> = ({
  progress,
  elapsedMs,
  totalDurationMs,
  isPaused,
  direction = 'grow',
  className = '',
}) => {
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const visualProgress = direction === 'disappear' ? 1 - clampedProgress : clampedProgress;

  // Remaining time in seconds and formatted mm:ss
  const remainingSec = Math.max(0, Math.ceil((totalDurationMs - elapsedMs) / 1000));
  const mins = Math.floor(remainingSec / 60);
  const secs = remainingSec % 60;
  const timeFormatted = `${mins}:${secs.toString().padStart(2, '0')}`;

  // Round clock dimensions: center (60, 64), radius 44
  const cx = 60;
  const cy = 64;
  const r = 44;

  // Pie slice calculations: angle in radians (clockwise from 12 o'clock)
  const angleRad = visualProgress * 2 * Math.PI;
  const x = cx + r * Math.sin(angleRad);
  const y = cy - r * Math.cos(angleRad);
  const largeArcFlag = visualProgress > 0.5 ? 1 : 0;

  // Hand rotation angle in degrees for total sitting progress
  const handAngleDeg = visualProgress * 360;

  // Active 60-second sweep angle so the watch visibly moves every second
  const secondAngleDeg = !isPaused ? ((elapsedMs % 60000) / 60000) * 360 : handAngleDeg;

  return (
    <div
      className={`relative select-none flex items-center justify-center gap-3 sm:gap-6 md:gap-8 transition-all ${className}`}
      title={`Time Remaining: ${timeFormatted}`}
    >
      {/* 1. EXTRA-LARGE DIGITAL CLOCK - Prominently visible to kid across room & on iPad */}
      <div className="flex items-center justify-center px-4 py-1.5 sm:px-6 sm:py-2.5 md:px-8 md:py-3.5 lg:px-10 lg:py-4 rounded-3xl sm:rounded-4xl bg-white/95 backdrop-blur-md border-3 sm:border-4 md:border-5 border-amber-300 shadow-lg ring-2 ring-amber-200/50">
        <span className="font-mono sm:font-sans font-black text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-slate-800 tracking-wider tabular-nums leading-none">
          {timeFormatted}
        </span>
      </div>

      {/* 2. ROUND CLOCK - Analog visual countdown pie wedge right next to digital clock */}
      <div className="relative flex items-center justify-center shrink-0 filter drop-shadow-lg">
        <svg
          viewBox="0 0 120 128"
          className="w-16 h-18 xs:w-20 xs:h-22 sm:w-24 sm:h-26 md:w-32 md:h-34 lg:w-36 lg:h-40 block"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Watch Case Golden Gradient */}
            <linearGradient id="largeWatchBezel" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="35%" stopColor="#FACC15" />
              <stop offset="85%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>

            {/* Time Timer Sweeping Pie Gradient (Warm gentle coral-pink) */}
            <linearGradient id="largeWatchWedge" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FB7185" />
              <stop offset="50%" stopColor="#F43F5E" />
              <stop offset="100%" stopColor="#E11D48" />
            </linearGradient>

            {/* Face Background */}
            <radialGradient id="largeWatchFace" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="85%" stopColor="#F8FAFC" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </radialGradient>
          </defs>

          {/* Watch Crown / Top Plinth */}
          <rect x="52" y="2" width="16" height="10" rx="3.5" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
          <rect x="50" y="9" width="20" height="4" rx="2" fill="#FACC15" />

          {/* Outer Heavy Golden Bezel */}
          <circle cx={cx} cy={cy} r="52" fill="url(#largeWatchBezel)" stroke="#B45309" strokeWidth="2" />
          <circle cx={cx} cy={cy} r="48" fill="#FEF08A" opacity="0.65" />

          {/* Inner Watch Dial Face */}
          <circle cx={cx} cy={cy} r={r} fill="url(#largeWatchFace)" stroke="#CBD5E1" strokeWidth="1.5" />

          {/* Outer Rim Guide Ring */}
          <circle cx={cx} cy={cy} r={r - 1} fill="none" stroke="#F1F5F9" strokeWidth="5" />

          {/* Visual Progress Pie Wedge (Time Timer Visual Countdown) */}
          {visualProgress > 0 && visualProgress < 0.999 ? (
            <path
              d={`M ${cx} ${cy} L ${cx} ${cy - r} A ${r} ${r} 0 ${largeArcFlag} 1 ${x} ${y} Z`}
              fill="url(#largeWatchWedge)"
              opacity="0.85"
            />
          ) : visualProgress >= 0.999 ? (
            <circle cx={cx} cy={cy} r={r} fill="url(#largeWatchWedge)" opacity="0.88" />
          ) : null}

          {/* Clock Hour Tick Marks (12, 3, 6, 9 Bold; others dotted) */}
          {/* 12 o'clock */}
          <line x1={cx} y1={cy - r + 2} x2={cx} y2={cy - r + 7} stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
          {/* 3 o'clock */}
          <line x1={cx + r - 7} y1={cy} x2={cx + r - 2} stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
          {/* 6 o'clock */}
          <line x1={cx} y1={cy + r - 7} x2={cx} y2={cy + r - 2} stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
          {/* 9 o'clock */}
          <line x1={cx - r + 2} y1={cy} x2={cx - r + 7} stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />

          {/* Minor ticks (1, 2, 4, 5, 7, 8, 10, 11) */}
          {[30, 60, 120, 150, 210, 240, 300, 330].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const x1 = cx + (r - 5) * Math.sin(rad);
            const y1 = cy - (r - 5) * Math.cos(rad);
            const x2 = cx + (r - 2) * Math.sin(rad);
            const y2 = cy - (r - 2) * Math.cos(rad);
            return (
              <line
                key={deg}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#94A3B8"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            );
          })}

          {/* Clock Hand pointing to total sitting progress */}
          <g transform={`rotate(${handAngleDeg} ${cx} ${cy})`}>
            <line
              x1={cx}
              y1={cy}
              x2={cx}
              y2={cy - r + 6}
              stroke="#0F172A"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Big Golden Star at tip of hand */}
            <g transform={`translate(${cx}, ${cy - r + 4})`}>
              <polygon
                points="0,-6 2,-1 6,-1 3,2 4,6 0,3 -4,6 -3,2 -6,-1 -2,-1"
                fill="#FACC15"
                stroke="#D97706"
                strokeWidth="1"
              />
            </g>
          </g>

          {/* Center Pivot Pin with Smiley Face */}
          <circle cx={cx} cy={cy} r="5" fill="#FACC15" stroke="#B45309" strokeWidth="1.5" />
          <circle cx={cx - 1.5} cy={cy - 1} r="0.8" fill="#1E293B" />
          <circle cx={cx + 1.5} cy={cy - 1} r="0.8" fill="#1E293B" />
          <path d={`M ${cx - 1.5} ${cy + 1} Q ${cx} ${cy + 2.5} ${cx + 1.5} ${cy + 1}`} stroke="#1E293B" strokeWidth="0.8" strokeLinecap="round" fill="none" />

          {/* Live Second-Sweep Star Dot (active rotation so kid sees real movement) */}
          {!isPaused && (
            <g transform={`rotate(${secondAngleDeg} ${cx} ${cy})`}>
              <circle cx={cx} cy={cy - r + 1} r="3" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1.2" />
            </g>
          )}

          {/* Paused Badge */}
          {isPaused && (
            <g transform={`translate(${cx - 10}, ${cy - 10})`}>
              <circle cx="10" cy="10" r="10" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="1.5" />
              <rect x="7" y="6" width="2" height="8" fill="#FFFFFF" rx="1" />
              <rect x="11" y="6" width="2" height="8" fill="#FFFFFF" rx="1" />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};
