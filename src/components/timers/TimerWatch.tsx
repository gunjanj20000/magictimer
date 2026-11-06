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

  // Remaining time in seconds and mm:ss
  const remainingSec = Math.max(0, Math.ceil((totalDurationMs - elapsedMs) / 1000));
  const mins = Math.floor(remainingSec / 60);
  const secs = remainingSec % 60;
  const timeFormatted = `${mins}:${secs.toString().padStart(2, '0')}`;

  // Pie slice calculations: radius 32, center (40, 44)
  const cx = 40;
  const cy = 44;
  const r = 30;

  // Angle in radians (clockwise from 12 o'clock)
  const angleRad = visualProgress * 2 * Math.PI;
  const x = cx + r * Math.sin(angleRad);
  const y = cy - r * Math.cos(angleRad);

  const largeArcFlag = visualProgress > 0.5 ? 1 : 0;

  // Hand rotation angle in degrees for total sitting progress
  const handAngleDeg = visualProgress * 360;

  // Active 60-second sweep angle so the watch visibly plays/moves every second
  const secondAngleDeg = !isPaused ? ((elapsedMs % 60000) / 60000) * 360 : handAngleDeg;

  return (
    <div
      className={`relative select-none flex flex-col items-center filter drop-shadow-md transition-all ${className}`}
      title={`Time remaining: ${timeFormatted}`}
    >
      <svg width="84" height="92" viewBox="0 0 80 88" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Watch Case Metallic / Pastel Gradient */}
          <linearGradient id="watchBezelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FDE047" />
            <stop offset="50%" stop-color="#FACC15" />
            <stop offset="100%" stop-color="#F59E0B" />
          </linearGradient>

          {/* Wedge fill gradient */}
          <linearGradient id="watchWedgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#F472B6" />
            <stop offset="50%" stop-color="#FB7185" />
            <stop offset="100%" stop-color="#F43F5E" />
          </linearGradient>

          <radialGradient id="watchFaceGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#FFFFFF" />
            <stop offset="100%" stop-color="#F8FAFC" />
          </radialGradient>
        </defs>

        {/* Watch Crown / Top Button */}
        <rect x="35" y="2" width="10" height="7" rx="2.5" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />
        <rect x="33" y="7" width="14" height="3" rx="1.5" fill="#FACC15" />

        {/* Watch Strap Lugs */}
        <path d="M 24 14 L 28 8 L 52 8 L 56 14" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.4" />
        <path d="M 24 74 L 28 80 L 52 80 L 56 74" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.4" />

        {/* Outer Golden Bezel */}
        <circle cx={cx} cy={cy} r="35" fill="url(#watchBezelGrad)" stroke="#D97706" strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r="32.5" fill="#FEF08A" opacity="0.6" />

        {/* Watch Face Interior */}
        <circle cx={cx} cy={cy} r={r} fill="url(#watchFaceGrad)" stroke="#E2E8F0" strokeWidth="1" />

        {/* Faint Background Guide Ring */}
        <circle cx={cx} cy={cy} r={r - 1} fill="none" stroke="#F1F5F9" strokeWidth="4" />

        {/* Visual Progress Pie Wedge (Time Timer style) */}
        {visualProgress > 0 && visualProgress < 0.999 ? (
          <path
            d={`M ${cx} ${cy} L ${cx} ${cy - r} A ${r} ${r} 0 ${largeArcFlag} 1 ${x} ${y} Z`}
            fill="url(#watchWedgeGrad)"
            opacity="0.82"
          />
        ) : visualProgress >= 0.999 ? (
          <circle cx={cx} cy={cy} r={r} fill="url(#watchWedgeGrad)" opacity="0.85" />
        ) : null}

        {/* Hour / Checkpoint Marks on watch face */}
        {/* 12 o'clock */}
        <line x1={cx} y1={cy - r + 2} x2={cx} y2={cy - r + 6} stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
        {/* 3 o'clock */}
        <line x1={cx + r - 6} y1={cy} x2={cx + r - 2} stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
        {/* 6 o'clock */}
        <line x1={cx} y1={cy + r - 6} x2={cx} y2={cy + r - 2} stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
        {/* 9 o'clock */}
        <line x1={cx - r + 2} y1={cy} x2={cx - r + 6} stroke="#64748B" strokeWidth="2" strokeLinecap="round" />

        {/* Watch Hand pointing to progress */}
        <g transform={`rotate(${handAngleDeg} ${cx} ${cy})`}>
          <line
            x1={cx}
            y1={cy}
            x2={cx}
            y2={cy - r + 4}
            stroke="#1E293B"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Star at the tip of the hand */}
          <polygon
            points={`${cx},${cy - r + 3} ${cx + 2.5},${cy - r + 6} ${cx},${cy - r + 5} ${cx - 2.5},${cy - r + 6}`}
            fill="#FACC15"
            stroke="#F59E0B"
            strokeWidth="0.8"
          />
        </g>

        {/* Center Pin */}
        <circle cx={cx} cy={cy} r="3.5" fill="#FACC15" stroke="#D97706" strokeWidth="1" />
        <circle cx={cx} cy={cy} r="1.5" fill="#FFFFFF" />

        {/* Active second-sweep rotating dot so kid sees the watch playing in real-time */}
        {!isPaused && (
          <g transform={`rotate(${secondAngleDeg} ${cx} ${cy})`}>
            <circle cx={cx} cy={cy - r + 1} r="2" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="0.8" />
          </g>
        )}

        {/* Paused Indicator */}
        {isPaused && (
          <g transform={`translate(${cx - 7}, ${cy - 7})`}>
            <circle cx="7" cy="7" r="7" fill="#F59E0B" />
            <rect x="5" y="4" width="1.5" height="6" fill="#FFFFFF" rx="0.5" />
            <rect x="8" y="4" width="1.5" height="6" fill="#FFFFFF" rx="0.5" />
          </g>
        )}
      </svg>

      {/* Digital Time Badge directly under the watch face */}
      <div className="bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full border border-amber-200 shadow-sm -mt-2">
        <span className="text-[11px] sm:text-xs font-black text-slate-700 tracking-wider">
          {timeFormatted}
        </span>
      </div>
    </div>
  );
};
