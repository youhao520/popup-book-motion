import React from 'react';
import {COLORS} from '../theme';
import {clamp, hash} from '../timeline';

type Props = {
  rise: number;
  time: number;
  beam?: number;
  flag?: number;
};

export const SeasideArt: React.FC<Props> = ({rise, time, beam = 0, flag = 0}) => {
  const layer = (i: number) => clamp((rise - i * 0.075) / 0.55);
  const r = (i: number) => 1 - Math.pow(1 - layer(i), 2);

  return (
    <svg width={1116} height={504} viewBox="0 0 1116 504" style={{position: 'absolute', inset: 0}}>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0c3a45" />
          <stop offset="46%" stopColor="#18545a" />
          <stop offset="74%" stopColor="#3d7a70" />
          <stop offset="88%" stopColor="#b98452" />
          <stop offset="100%" stopColor="#d9a566" />
        </linearGradient>
        <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#16525d" />
          <stop offset="100%" stopColor="#0d3c4a" />
        </linearGradient>
        <linearGradient id="beamGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffe9a0" stopOpacity="0.72" />
          <stop offset="100%" stopColor="#ffe9a0" stopOpacity="0" />
        </linearGradient>
        <filter id="paperShadow" x="-20%" y="-30%" width="150%" height="170%">
          <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#061a1c" floodOpacity="0.45" />
        </filter>
        <filter id="softShadow" x="-30%" y="-30%" width="180%" height="190%">
          <feDropShadow dx="0" dy="8" stdDeviation="7" floodColor="#061a1c" floodOpacity="0.38" />
        </filter>
      </defs>

      {/* sky page */}
      <g opacity={r(0)} transform={`translate(0 ${(1 - r(0)) * 26})`}>
        <rect x={0} y={0} width={1116} height={504} fill="url(#sky)" />
        {Array.from({length: 74}, (_, i) => {
          const x = hash(i * 3.1 + 5) * 1060 + 20;
          const y = hash(i * 4.7 + 9) * 250 + 20;
          const tw = 0.35 + 0.65 * Math.abs(Math.sin(time * 1.1 + i * 1.7));
          return <circle key={i} cx={x} cy={y} r={0.9 + hash(i * 2.3) * 1.7} fill="#f7e9c8" opacity={tw * 0.75} />;
        })}
        {[0, 1, 2].map((i) => (
          <g key={i} opacity={0.55 + 0.45 * Math.abs(Math.sin(time * 0.7 + i))}>
            <path d={`M ${180 + i * 260} ${50 + i * 26} h 16 M ${188 + i * 260} ${42 + i * 26} v 16`} stroke="#f7e9c8" strokeWidth={1.4} />
          </g>
        ))}
      </g>

      {/* moon */}
      <g opacity={r(1)} transform={`translate(0 ${(1 - r(1)) * 34})`} filter="url(#softShadow)">
        <circle cx={330} cy={150} r={104} fill="#f0e1bd" />
        <circle cx={330} cy={150} r={104} fill="#fbf2d8" opacity={0.35} />
        <circle cx={296} cy={126} r={16} fill="#d9c7a0" opacity={0.55} />
        <circle cx={356} cy={190} r={11} fill="#d9c7a0" opacity={0.45} />
        <circle cx={348} cy={118} r={7} fill="#d9c7a0" opacity={0.4} />
      </g>

      {/* far mountains */}
      <g opacity={r(2)} transform={`translate(0 ${(1 - r(2)) * 30})`} filter="url(#paperShadow)">
        <path d="M 0 330 L 70 296 L 130 318 L 200 286 L 270 320 L 340 292 L 410 322 L 480 300 L 560 326 L 650 292 L 730 320 L 820 298 L 900 324 L 980 300 L 1060 322 L 1116 308 L 1116 350 L 0 350 Z" fill="#376c68" />
      </g>

      {/* mid mountains */}
      <g opacity={r(3)} transform={`translate(0 ${(1 - r(3)) * 26})`} filter="url(#paperShadow)">
        <path d="M 0 336 L 80 314 L 150 334 L 230 306 L 310 338 L 390 312 L 470 338 L 560 316 L 650 340 L 740 312 L 830 338 L 920 318 L 1010 340 L 1116 320 L 1116 360 L 0 360 Z" fill="#255955" />
      </g>

      {/* sea */}
      <g opacity={r(4)} transform={`translate(0 ${(1 - r(4)) * 24})`}>
        <rect x={0} y={330} width={1116} height={146} fill="url(#sea)" />
        {Array.from({length: 26}, (_, i) => {
          const y = 344 + (i % 13) * 8;
          const x = 40 + hash(i * 5.9) * 760;
          const w = 24 + hash(i * 2.1) * 50;
          return <line key={i} x1={x} y1={y} x2={x + w} y2={y} stroke="#7fb0ab" strokeWidth={2} opacity={0.35 + hash(i) * 0.35} />;
        })}
        <path d="M 330 330 h 120 l -10 46 l -100 0 Z" fill="#f2e5c4" opacity={0.12} />
      </g>

      {/* little town on the far shore */}
      <g opacity={r(5)} transform={`translate(0 ${(1 - r(5)) * 22})`} filter="url(#paperShadow)">
        {[
          [58, 300, 44, 54, '#c94836', '#e8d9b8'],
          [108, 310, 40, 44, '#d99033', '#eadcc0'],
          [154, 296, 50, 58, '#3f7a5a', '#e8d9b8'],
          [210, 308, 40, 46, '#6b4a86', '#f0e2c2'],
          [256, 300, 46, 54, '#c94836', '#e0cfa8'],
          [308, 312, 40, 42, '#d99033', '#e8d9b8'],
          [354, 304, 44, 50, '#3f7a5a', '#f0e2c2'],
        ].map(([x, y, w, h, roof, body], i) => (
          <g key={i}>
            <rect x={x} y={Number(y)} width={Number(w)} height={Number(h)} fill={String(body)} />
            <polygon points={`${Number(x) - 4},${Number(y)} ${Number(x) + Number(w) / 2},${Number(y) - 18} ${Number(x) + Number(w) + 4},${Number(y)}`} fill={String(roof)} />
            {Array.from({length: 3}, (_, j) => (
              <rect key={j} x={Number(x) + 7 + (j % 2) * 18} y={Number(y) + 12 + Math.floor(j / 2) * 18} width={7} height={9} fill="#f2d06a" opacity={0.9} />
            ))}
          </g>
        ))}
      </g>

      {/* cliff on the right */}
      <g opacity={r(6)} transform={`translate(0 ${(1 - r(6)) * 20})`} filter="url(#paperShadow)">
        <path d="M 790 504 L 810 392 L 840 340 L 872 318 L 920 306 L 990 300 L 1060 306 L 1116 322 L 1116 504 Z" fill="#2a1e16" />
        <path d="M 812 356 L 850 330 L 900 316 L 980 308 L 1050 312 L 1116 330 L 1116 350 L 1010 340 L 900 336 L 840 352 Z" fill="#3c6a3c" />
        <path d="M 830 340 L 860 326 L 890 322" fill="none" stroke="#6e9a52" strokeWidth={3} opacity={0.5} />
      </g>

      {/* lighthouse */}
      <g opacity={r(7)} transform={`translate(0 ${(1 - r(7)) * 24})`} filter="url(#softShadow)">
        <g transform="translate(1010 198)">
          <polygon points="-27,108 27,108 21,-34 -21,-34" fill="#f1e4c6" />
          {[0, 1, 2, 3].map((i) => (
            <polygon key={i} points={`${-26 + i * 1.2},${82 - i * 30} ${26 - i * 1.2},${82 - i * 30} ${24.5 - i * 1.2},${62 - i * 30} ${-24.5 + i * 1.2},${62 - i * 30}`} fill="#c94836" />
          ))}
          <rect x={-30} y={-46} width={60} height={14} fill="#8a3a2c" />
          <rect x={-24} y={-70} width={48} height={26} rx={3} fill="#e8c777" />
          <rect x={-17} y={-64} width={34} height={15} fill="#f6e2a4" />
          <path d="M -28 -72 Q 0 -96 28 -72 Z" fill="#c94836" />
          <circle cx={0} cy={-88} r={4} fill="#e8c777" />
          <rect x={-4} y={-38} width={8} height={146} fill="rgba(0,0,0,0.10)" />
        </g>
      </g>

      {/* rotating beam */}
      <g opacity={clamp(beam) * r(7)} transform={`translate(1010 120)`} style={{mixBlendMode: 'screen'}}>
        <g transform={`rotate(${beam * 360})`}>
          <polygon points="18,0 430,-46 430,44" fill="url(#beamGrad)" opacity={0.85} />
          <polygon points="18,0 380,-22 380,20" fill="#fff0b8" opacity={0.22} />
        </g>
      </g>

      {/* waves at the shoreline */}
      {[0, 1, 2].map((i) => {
        const p = i * 0.06;
        const rr = clamp((rise - 0.35 - p) / 0.4);
        return (
          <g key={i} opacity={rr} transform={`translate(0 ${(1 - rr) * 22})`} filter="url(#paperShadow)">
            <path
              d={`M -20 ${424 + i * 18} ${Array.from({length: 13}, (_, k) => {
                const x = k * 92;
                return `Q ${x + 23} ${404 + i * 18 + Math.sin(time * 1.4 + k + i) * 2} ${x + 46} ${424 + i * 18} Q ${x + 69} ${444 + i * 18} ${x + 92} ${424 + i * 18}`;
              }).join(' ')} L 1136 504 L -20 504 Z`}
              fill={['#3f8f86', '#4fa49a', '#63b3a5'][i]}
            />
            <path
              d={`M -20 ${424 + i * 18} ${Array.from({length: 13}, (_, k) => {
                const x = k * 92;
                return `Q ${x + 23} ${404 + i * 18} ${x + 46} ${424 + i * 18} Q ${x + 69} ${444 + i * 18} ${x + 92} ${424 + i * 18}`;
              }).join(' ')}`}
              fill="none"
              stroke="#a7d4c6"
              strokeWidth={3}
              opacity={0.55}
            />
          </g>
        );
      })}

      {/* grass blades along the front edge */}
      <g opacity={clamp((rise - 0.6) / 0.3)}>
        {Array.from({length: 44}, (_, i) => {
          const x = 10 + i * 25 + hash(i * 2.7) * 8;
          const h = 10 + hash(i * 3.3) * 16;
          return (
            <g key={i}>
              <path d={`M ${x} 504 Q ${x + 2} ${504 - h} ${x + 8} ${504 - h - 4}`} fill="none" stroke="#3d7440" strokeWidth={2.2} />
              <path d={`M ${x + 4} 504 Q ${x + 7} ${504 - h * 0.7} ${x + 13} ${504 - h * 0.7}`} fill="none" stroke="#5c8e4a" strokeWidth={1.8} />
            </g>
          );
        })}
      </g>

      {/* little red flag */}
      {flag > 0.01 ? (
        <g opacity={flag} transform={`translate(560 318) scale(${0.7 + 0.3 * flag})`} filter="url(#paperShadow)">
          <line x1={0} y1={0} x2={0} y2={-92} stroke="#4a3824" strokeWidth={4} />
          <polygon points="2,-90 70,-76 2,-56" fill={COLORS.red} />
        </g>
      ) : null}
    </svg>
  );
};
