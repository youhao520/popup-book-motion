import React from 'react';
import {COLORS, FONT_SERIF} from '../theme';
import {clamp, easeOutBack, hash} from '../timeline';

export const Standing: React.FC<{
  x: number;
  bottom: number;
  width: number;
  height: number;
  rise: number;
  rotZ?: number;
  z?: number;
  children: React.ReactNode;
}> = ({x, bottom, width, height, rise, rotZ = 0, z = 26, children}) => {
  if (rise <= 0.001) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - width / 2,
        top: bottom - height,
        width,
        height,
        transformOrigin: 'bottom center',
        transform: `translateZ(${z}px) rotateX(${-72 * Math.min(1, rise * 1.2)}deg) rotateZ(${rotZ}deg) scaleY(${0.32 + 0.68 * clamp(rise)})`,
        opacity: clamp(rise * 1.8),
        filter: 'drop-shadow(9px 12px 7px rgba(0,0,0,0.38))',
      }}
    >
      {children}
    </div>
  );
};

export const Train: React.FC = () => (
  <svg width={190} height={135} viewBox="0 0 190 135">
    <rect x={16} y={62} width={116} height={46} rx={4} fill="#2b2118" />
    <rect x={16} y={62} width={116} height={9} fill="#5a4632" />
    <rect x={108} y={40} width={54} height={68} rx={4} fill="#3a2c20" />
    <rect x={116} y={48} width={38} height={24} rx={2} fill="#e8c777" opacity={0.9} />
    <rect x={116} y={78} width={38} height={18} rx={2} fill="#1b1510" />
    <rect x={42} y={34} width={16} height={30} fill="#1f1812" />
    <rect x={38} y={28} width={24} height={10} rx={3} fill="#1f1812" />
    <rect x={78} y={44} width={5} height={20} fill="#c9a24a" />
    {[38, 72, 116, 144].map((cx) => (
      <g key={cx}>
        <circle cx={cx} cy={110} r={16} fill="#1a1410" />
        <circle cx={cx} cy={110} r={11} fill="#c94836" />
        <circle cx={cx} cy={110} r={4} fill="#e8c777" />
      </g>
    ))}
    <g fill="#e8d9b8" opacity={0.85}>
      <circle cx={36} cy={20} r={8} />
      <circle cx={50} cy={9} r={6} />
      <circle cx={24} cy={8} r={5} />
    </g>
    <rect x={10} y={124} width={170} height={5} fill="#4a3524" />
  </svg>
);

export const Rocket: React.FC = () => (
  <svg width={95} height={195} viewBox="0 0 95 195">
    <path d="M 47 4 Q 72 48 72 108 L 22 108 Q 22 48 47 4 Z" fill="#f0e2c2" />
    <path d="M 47 4 Q 60 26 65 46 L 29 46 Q 34 26 47 4 Z" fill="#c94836" />
    <circle cx={47} cy={72} r={14} fill="#3b5f9e" />
    <circle cx={47} cy={72} r={9} fill="#9fd2df" />
    <path d="M 22 92 L 4 128 L 22 120 Z" fill="#c94836" />
    <path d="M 72 92 L 90 128 L 72 120 Z" fill="#c94836" />
    <rect x={34} y={108} width={26} height={10} fill="#2b2118" />
    <path d="M 36 120 Q 47 138 58 120 L 54 146 Q 47 154 40 146 Z" fill="#d99033" />
    <path d="M 42 124 Q 47 136 52 124 L 50 140 Q 47 144 44 140 Z" fill="#e8c777" />
  </svg>
);

export const Computer: React.FC = () => (
  <svg width={165} height={145} viewBox="0 0 165 145">
    <rect x={22} y={8} width={120} height={96} rx={6} fill="#d9cfb8" />
    <rect x={22} y={8} width={120} height={10} rx={4} fill="#efe5cf" />
    <rect x={34} y={24} width={96} height={64} rx={3} fill="#203a2e" />
    <rect x={40} y={30} width={84} height={52} fill="#163a2c" />
    <g stroke="#7be39a" strokeWidth={3} opacity={0.85}>
      <line x1={46} y1={40} x2={84} y2={40} />
      <line x1={46} y1={50} x2={100} y2={50} />
      <line x1={46} y1={60} x2={76} y2={60} />
      <line x1={46} y1={70} x2={92} y2={70} />
    </g>
    <rect x={64} y={104} width={36} height={20} fill="#c9bfa8" />
    <rect x={42} y={124} width={80} height={12} rx={3} fill="#d9cfb8" />
    {Array.from({length: 9}, (_, i) => (
      <rect key={i} x={47 + i * 8} y={127} width={6} height={3} fill="#8c8272" />
    ))}
    <rect x={140} y={96} width={8} height={22} fill="#2b2118" />
  </svg>
);

export const Satellite: React.FC = () => (
  <svg width={150} height={190} viewBox="0 0 150 190">
    <rect x={72} y={92} width={7} height={86} fill="#5a4a38" />
    <path d="M 45 186 L 106 186 L 98 176 L 53 176 Z" fill="#3a2c20" />
    <g transform="translate(75 74) rotate(-16)">
      <ellipse cx={0} cy={0} rx={44} ry={22} fill="#e8d9b8" />
      <ellipse cx={0} cy={-4} rx={36} ry={16} fill="#f3ead4" />
      <ellipse cx={0} cy={0} rx={44} ry={22} fill="none" stroke="#b9a583" strokeWidth={2} />
      <line x1={0} y1={0} x2={0} y2={16} stroke="#6b5840" strokeWidth={4} />
      <circle cx={0} cy={-8} r={4} fill="#c94836" />
    </g>
    <g fill="none" stroke="#4ea3a8" strokeWidth={3} opacity={0.85}>
      <path d="M 34 42 Q 16 22 44 8" />
      <path d="M 116 42 Q 136 22 108 8" />
      <path d="M 42 54 Q 22 36 38 24" opacity={0.6} />
    </g>
  </svg>
);

export const Gramophone: React.FC<{time: number}> = ({time}) => (
  <svg width={210} height={205} viewBox="0 0 210 205">
    <rect x={40} y={150} width={110} height={44} rx={5} fill="#3a2c20" />
    <rect x={40} y={150} width={110} height={9} fill="#6b5840" />
    <circle cx={96} cy={160} r={20} fill="#1b1510" />
    <circle cx={96} cy={160} r={6} fill="#c9a24a" />
    <path d="M 96 150 C 90 118 76 96 66 84" fill="none" stroke="#a9862f" strokeWidth={8} strokeLinecap="round" />
    <path d="M 66 84 Q 52 48 74 32 Q 96 16 118 34 Q 136 50 124 78 Q 112 100 82 92 Z" fill="#6b3d78" />
    <path d="M 70 80 Q 60 50 78 38 Q 96 26 112 40 Q 126 54 116 76 Q 106 94 82 88 Z" fill="#86509a" />
    <path d="M 80 78 Q 72 54 84 44 Q 98 34 108 46 Q 118 58 110 74 Q 102 88 84 84 Z" fill="#431f4d" opacity={0.65} />
    <rect x={142} y={168} width={18} height={6} rx={3} fill="#c9a24a" />
    <g stroke="#7fd0d2" strokeWidth={3} fill="none" opacity={0.9}>
      <path d={`M 18 ${42 + Math.sin(time * 5) * 4} q 12 -12 24 0 q 12 12 24 0 q 12 -12 24 0 q 12 12 24 0`} />
    </g>
    <circle cx={18} cy={42 + Math.sin(time * 5) * 4} r={4} fill="#7fd0d2" />
  </svg>
);

export const Clapperboard: React.FC = () => (
  <svg width={175} height={155} viewBox="0 0 175 155">
    <g transform="rotate(-4 88 90)">
      <rect x={20} y={52} width={136} height={86} rx={3} fill="#241f1a" />
      <rect x={20} y={52} width={136} height={20} fill="#efe4cb" />
      <g fill="#241f1a">
        {Array.from({length: 6}, (_, i) => (
          <polygon key={i} points={`${24 + i * 23},52 ${38 + i * 23},52 ${30 + i * 23},72 ${16 + i * 23},72`} />
        ))}
      </g>
      <text x={36} y={98} fontFamily={FONT_SERIF} fontWeight={700} fontSize={20} fill="#efe4cb">SCENE 01</text>
      <text x={36} y={122} fontFamily={FONT_SERIF} fontWeight={700} fontSize={14} fill="#c9a24a">TAKE 03</text>
      <circle cx={140} cy={125} r={7} fill="#c9a24a" />
      <rect x={20} y={52} width={136} height={4} fill="#5a4a38" />
    </g>
    <g transform="rotate(-13 88 40)">
      <rect x={20} y={20} width={136} height={24} rx={2} fill="#efe4cb" />
      <g fill="#241f1a">
        {Array.from({length: 6}, (_, i) => (
          <polygon key={i} points={`${24 + i * 23},20 ${38 + i * 23},20 ${32 + i * 23},44 ${18 + i * 23},44`} />
        ))}
      </g>
    </g>
  </svg>
);

export const PropForEra: React.FC<{index: number; rise: number}> = ({index, rise}) => {
  const positions = [
    {x: 280, bottom: 992, w: 150, h: 108, z: 70},
    {x: 470, bottom: 1002, w: 78, h: 158, z: 68},
    {x: 700, bottom: 1002, w: 132, h: 116, z: 66},
    {x: 890, bottom: 1002, w: 120, h: 152, z: 64},
  ];
  const p = positions[index - 1];
  return (
    <Standing x={p.x} bottom={p.bottom} width={p.w} height={p.h} rise={rise} z={p.z} rotZ={index === 2 ? -5 : index === 4 ? 4 : 0}>
      {index === 1 ? <Train /> : index === 2 ? <Rocket /> : index === 3 ? <Computer /> : <Satellite />}
    </Standing>
  );
};
