import React from 'react';
import {staticFile} from 'remotion';
import {COLORS, FONT_SERIF} from '../theme';
import {clamp, easeOutBack, hash} from '../timeline';

const paperBg = `url(${staticFile('textures/paper.jpg')})`;

type Era = {
  index: number;
  year: string;
  style: string;
  accent: string;
};

const ERAS: Era[] = [
  {index: 1, year: '1925', style: '剪影', accent: '#8f5a35'},
  {index: 2, year: '1965', style: '网点', accent: COLORS.red},
  {index: 3, year: '1995', style: '像素', accent: COLORS.blue},
  {index: 4, year: '2035', style: '霓虹', accent: '#5bd6c4'},
];

const Art1925: React.FC = () => (
  <svg width={235} height={160} viewBox="0 0 235 160">
    <defs>
      <linearGradient id="a1925" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#c47c43" />
        <stop offset="55%" stopColor="#d99a5c" />
        <stop offset="100%" stopColor="#8e4f2c" />
      </linearGradient>
    </defs>
    <rect width={235} height={160} fill="url(#a1925)" />
    <circle cx={171} cy={50} r={27} fill="#f3dda4" opacity={0.92} />
    <rect y={105} width={235} height={55} fill="#6c3a24" />
    <path d="M 0 112 Q 40 104 80 112 T 160 112 T 240 112" fill="none" stroke="#d9a566" strokeWidth={2} opacity={0.55} />
    <g fill="#221812">
      <path d="M 18 108 L 96 108 L 88 124 L 26 124 Z" />
      <rect x={40} y={78} width={9} height={32} />
      <rect x={62} y={70} width={9} height={40} />
      <rect x={52} y={90} width={30} height={18} />
    </g>
    <g fill="#e8d9b8" opacity={0.85}>
      <circle cx={44} cy={74} r={5} />
      <circle cx={55} cy={66} r={7} />
      <circle cx={68} cy={62} r={5} />
    </g>
    <path d="M 108 118 L 118 118 L 114 108 Z" fill="#221812" />
  </svg>
);

const Art1965: React.FC = () => (
  <svg width={235} height={160} viewBox="0 0 235 160">
    <defs>
      <pattern id="halftone" width="10" height="10" patternUnits="userSpaceOnUse">
        <circle cx={2} cy={2} r={1.6} fill="#e05a45" opacity={0.55} />
      </pattern>
    </defs>
    <rect width={235} height={160} fill="#2e8f92" />
    <rect width={235} height={160} fill="url(#halftone)" />
    <rect y={105} width={235} height={55} fill="#d6a84f" />
    <rect y={96} width={235} height={18} fill="#1f6c7c" />
    <circle cx={176} cy={38} r={26} fill="#f2cc55" />
    <path d="M 50 108 Q 80 34 142 40" fill="none" stroke="#c94836" strokeWidth={3} strokeDasharray="5 4" />
    <g transform="translate(138 42) rotate(18)">
      <ellipse cx={0} cy={0} rx={16} ry={21} fill="#c94836" />
      <path d="M -14 8 Q 0 20 14 8 L 10 22 L -10 22 Z" fill="#a32d22" />
      <path d="M 0 21 L 0 34" stroke="#5a3a28" strokeWidth={2} />
    </g>
    <g transform="translate(24 100)">
      <rect x={0} y={10} width={34} height={28} fill="#f0e2c2" />
      <polygon points="-4,10 17,-6 38,10" fill="#c94836" />
      <rect x={6} y={20} width={7} height={8} fill="#2b2118" />
    </g>
    <g fill="#f0e2c2">
      <circle cx={78} cy={118} r={5} />
      <rect x={74} y={120} width={8} height={16} rx={3} />
    </g>
  </svg>
);

const Art1995: React.FC = () => (
  <svg width={235} height={160} viewBox="0 0 235 160">
    <rect width={235} height={160} fill="#2f6db1" />
    <circle cx={178} cy={40} r={22} fill="#f2d06a" />
    <rect y={112} width={235} height={48} fill="#2b8fae" />
    <g fill="#173f6b">
      <rect x={20} y={62} width={22} height={66} />
      <rect x={44} y={44} width={18} height={84} />
      <rect x={64} y={72} width={26} height={56} />
      <rect x={92} y={54} width={18} height={74} />
    </g>
    <g fill="#f2d06a">
      {Array.from({length: 18}, (_, i) => (
        <rect key={i} x={24 + (i % 4) * 15} y={70 + Math.floor(i / 4) * 13} width={5} height={5} />
      ))}
    </g>
    <g fill="#e8d9b8">
      <rect x={126} y={92} width={34} height={36} />
      <rect x={132} y={100} width={8} height={8} fill="#2b2118" />
      <rect x={146} y={100} width={8} height={8} fill="#2b2118" />
    </g>
    <g fill="#f2d06a">
      <rect x={188} y={128} width={34} height={4} />
      <rect x={196} y={136} width={28} height={3} />
    </g>
  </svg>
);

const Art2035: React.FC = () => (
  <svg width={235} height={160} viewBox="0 0 235 160">
    <defs>
      <linearGradient id="neonSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#241a4a" />
        <stop offset="62%" stopColor="#3a2660" />
        <stop offset="100%" stopColor="#14213e" />
      </linearGradient>
      <filter id="neonGlow" x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur stdDeviation="2.6" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <rect width={235} height={160} fill="url(#neonSky)" />
    {Array.from({length: 22}, (_, i) => (
      <circle key={i} cx={hash(i * 3.2) * 230} cy={hash(i * 4.1) * 70} r={0.8 + hash(i) * 1.2} fill="#bff5ea" opacity={0.7} />
    ))}
    <circle cx={54} cy={44} r={20} fill="#e9c7f2" opacity={0.85} />
    <rect y={118} width={235} height={42} fill="#0b2436" />
    <g stroke="#5bd6c4" strokeWidth={2} filter="url(#neonGlow)">
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M 10 ${128 + i * 7} Q 120 ${120 + i * 7} 228 ${128 + i * 7}`} fill="none" opacity={0.55} />
      ))}
    </g>
    {[50, 118, 186].map((x, i) => (
      <g key={x} transform={`translate(${x} 116) scale(${0.85 + i * 0.08})`} stroke="#7fe8d0" strokeWidth={2} fill="none" filter="url(#neonGlow)">
        <line x1={0} y1={0} x2={0} y2={-56} />
        <path d="M -18 -56 L 18 -56 L 12 -32 L -12 -32 Z" />
        <path d="M -10 -42 L 10 -42 M -14 -34 L 14 -34" opacity={0.6} />
        <path d="M 0 -56 L -20 -50 M 0 -56 L 20 -50" />
      </g>
    ))}
  </svg>
);

const PanelArt: React.FC<{index: number}> = ({index}) => {
  if (index === 1) return <Art1925 />;
  if (index === 2) return <Art1965 />;
  if (index === 3) return <Art1995 />;
  return <Art2035 />;
};

export const Timeline: React.FC<{
  unfold: number;
  styles: number;
  labels: number;
}> = ({unfold, styles, labels}) => {
  return (
    <>
      {ERAS.map((era, i) => {
        const p = clamp((unfold - i * 0.08) / 0.55);
        if (p <= 0) return null;
        const left = 46 + i * 294;
        const bottom = 980;
        const height = 216;
        const rotY = i % 2 === 0 ? -5 : 5;
        return (
          <div
            key={era.year}
            style={{
              position: 'absolute',
              left,
              top: bottom - height,
              width: 284,
              height,
              transformOrigin: 'bottom center',
              transform: `translateZ(${22 + i * 2}px) rotateX(${-72 * p}deg) rotateY(${rotY}deg)`,
              opacity: Math.min(1, p * 2),
            }}
          >
            {/* style chip */}
            <div
              style={{
                position: 'absolute',
                left: 30,
                top: -36,
                width: 158,
                height: 34,
                background: '#2f5d7c',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `scale(${easeOutBack(clamp((labels - i * 0.1) / 0.4), 1.8)})`,
                opacity: clamp((labels - i * 0.1) / 0.3),
                boxShadow: '0 8px 10px rgba(0,0,0,0.3)',
              }}
            >
              <span style={{fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 24, color: '#f3e8cf', letterSpacing: 4}}>{era.style}</span>
            </div>

            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: COLORS.paperLight,
                backgroundImage: paperBg,
                backgroundSize: 'cover',
                borderRadius: 2,
                boxShadow: '0 16px 20px rgba(0,0,0,0.42)',
                overflow: 'hidden',
              }}
            >
              {/* header */}
              <div style={{position: 'absolute', left: 0, top: 0, width: '100%', height: 42, display: 'flex', alignItems: 'center', padding: '0 10px'}}>
                <span style={{fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 22, color: '#2b2118'}}>镜头{era.index}</span>
                <span style={{marginLeft: 'auto', fontFamily: FONT_SERIF, fontWeight: 900, fontSize: 37, color: era.accent, letterSpacing: 1}}>{era.year}</span>
              </div>
              <div style={{position: 'absolute', left: 8, right: 8, top: 43, height: 1, background: 'rgba(80,55,30,0.22)'}} />
              {/* art */}
              <div style={{position: 'absolute', left: 6, right: 6, top: 48, bottom: 6, overflow: 'hidden'}}>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    clipPath: 'inset(0 0 0 0)',
                    transform: 'scaleX(1.2)',
                    transformOrigin: 'left top',
                    filter: `saturate(${0.66 + styles * 0.24}) brightness(${0.88 + styles * 0.08})`,
                  }}
                >
                  <PanelArt index={era.index} />
                </div>
                {/* paper grain over the art */}
                <div style={{position: 'absolute', inset: 0, backgroundImage: paperBg, backgroundSize: 'cover', opacity: 0.12, mixBlendMode: 'multiply'}} />
              </div>
              {/* perforations */}
              <div style={{position: 'absolute', left: 0, right: 0, top: 44, display: 'flex', justifyContent: 'space-around'}}>
                {Array.from({length: 12}, (_, k) => (
                  <div key={k} style={{width: 5, height: 5, borderRadius: 3, background: 'rgba(90,64,34,0.35)'}} />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};
