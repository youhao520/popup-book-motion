import React from 'react';
import {COLORS} from '../theme';
import {clamp} from '../timeline';

export const Girl: React.FC<{wave: number; sway: number; rise: number}> = ({wave, sway, rise}) => {
  const arm = -18 - clamp(wave) * 58 + Math.sin(wave * 9) * 4;
  return (
    <svg width={210} height={320} viewBox="0 0 210 320" style={{overflow: 'visible'}}>
      <defs>
        <filter id="girlShadow" x="-40%" y="-30%" width="180%" height="180%">
          <feDropShadow dx="8" dy="12" stdDeviation="6" floodColor="#061416" floodOpacity="0.42" />
        </filter>
      </defs>
      <g opacity={rise} transform={`translate(0 ${(1 - rise) * 24}) rotate(${sway} 105 300)`} filter="url(#girlShadow)">
        {/* legs */}
        <rect x={78} y={228} width={18} height={72} rx={8} fill="#223c4a" />
        <rect x={112} y={228} width={18} height={72} rx={8} fill="#223c4a" />
        <rect x={72} y={292} width={30} height={18} rx={7} fill="#b6362a" />
        <rect x={108} y={292} width={30} height={18} rx={7} fill="#b6362a" />
        {/* coat */}
        <path d="M 62 142 Q 60 122 82 116 H 128 Q 150 122 148 142 L 156 246 Q 105 262 54 246 Z" fill="#e5ad33" />
        <path d="M 62 142 Q 60 122 82 116 H 128 Q 150 122 148 142 L 150 170 H 60 Z" fill="#f0c04f" />
        <line x1={105} y1={130} x2={105} y2={250} stroke="#b9851d" strokeWidth={2} opacity={0.55} />
        <circle cx={105} cy={185} r={3.4} fill="#8c6318" />
        <circle cx={105} cy={212} r={3.4} fill="#8c6318" />
        {/* scarf */}
        <path d="M 76 118 Q 105 134 134 118 Q 129 140 105 142 Q 81 140 76 118 Z" fill="#b6362a" />
        <path d="M 118 132 l 12 54 l -16 3 l -8 -52 Z" fill="#9e2c22" />
        {/* arms */}
        <g transform={`rotate(${arm} 68 150)`}>
          <rect x={54} y={146} width={18} height={74} rx={9} fill="#e5ad33" />
          <circle cx={63} cy={222} r={10} fill="#f0d1ad" />
        </g>
        <g transform="rotate(8 145 150)">
          <rect x={138} y={146} width={18} height={70} rx={9} fill="#e5ad33" />
          <circle cx={147} cy={218} r={10} fill="#f0d1ad" />
        </g>
        {/* head */}
        <circle cx={105} cy={82} r={47} fill="#f0d1ad" />
        <path d="M 58 82 Q 54 30 105 27 Q 156 30 152 82 Q 150 58 132 54 Q 118 68 96 58 Q 78 66 66 58 Q 58 66 58 82 Z" fill="#4a2f22" />
        <path d="M 60 80 Q 52 112 66 130 L 74 98 Z" fill="#4a2f22" />
        <path d="M 150 80 Q 158 112 144 130 L 136 98 Z" fill="#4a2f22" />
        <circle cx={88} cy={86} r={4.2} fill="#2a2118" />
        <circle cx={122} cy={86} r={4.2} fill="#2a2118" />
        <circle cx={76} cy={100} r={8} fill="#e98f7e" opacity={0.5} />
        <circle cx={134} cy={100} r={8} fill="#e98f7e" opacity={0.5} />
        <path d="M 95 104 Q 105 112 115 104" fill="none" stroke="#8a4a3a" strokeWidth={3} strokeLinecap="round" />
      </g>
    </svg>
  );
};
