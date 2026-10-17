import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {H, W} from '../theme';
import {hash} from '../timeline';

export const Desk: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame * 0.004) * 8;

  return (
    <AbsoluteFill style={{backgroundColor: '#170c06', overflow: 'hidden'}}>
      <Img
        src={staticFile('textures/wood.jpg')}
        style={{
          position: 'absolute',
          left: -40 + drift,
          top: -30,
          width: W + 80,
          height: H + 60,
          objectFit: 'cover',
          filter: 'blur(0.6px) brightness(0.82) saturate(0.92)',
        }}
      />

      {/* warm key light from the upper left */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 900px 700px at 33% 18%, rgba(255,206,142,0.30), rgba(255,186,110,0.10) 45%, transparent 72%)',
          mixBlendMode: 'soft-light',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 900px 800px at 72% 62%, rgba(255,184,104,0.13), transparent 70%)',
          mixBlendMode: 'screen',
        }}
      />

      {/* fall-off towards the corners */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 78% 72% at 50% 44%, transparent 42%, rgba(12,6,3,0.42) 76%, rgba(7,3,1,0.82) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(10,5,2,0.42) 0%, transparent 22%, transparent 72%, rgba(8,4,2,0.55) 100%)',
        }}
      />

      {/* dust specks catching the light */}
      <svg width={W} height={H} style={{position: 'absolute', inset: 0, opacity: 0.4}}>
        {Array.from({length: 26}, (_, i) => {
          const x = hash(i * 2.7) * W;
          const y = hash(i * 3.9 + 8) * H;
          const r = 0.6 + hash(i * 5.1) * 1.4;
          const tw = 0.3 + 0.7 * Math.abs(Math.sin(frame * 0.03 + i));
          return <circle key={i} cx={x} cy={y} r={r} fill="#ffd9a0" opacity={tw * 0.35} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background:
        'radial-gradient(ellipse 70% 64% at 50% 46%, transparent 55%, rgba(9,4,2,0.34) 88%, rgba(6,3,1,0.62) 100%)',
    }}
  />
);
