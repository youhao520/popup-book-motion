import React from 'react';
import {staticFile} from 'remotion';
import {COLORS} from '../theme';
import {clamp, easeOutCubic, hash} from '../timeline';

const paperBg = `url(${staticFile('textures/paper.jpg')})`;

type Slip = {
  x: number;
  y: number;
  rot: number;
  delay: number;
  dur: number;
  w: number;
  h: number;
  stamp: boolean;
  tint: number;
};

const SLIPS: Slip[] = Array.from({length: 42}, (_, i) => {
  let x = 110 + hash(i * 3.17) * 1700;
  let y = 330 + hash(i * 5.73 + 3) * 600;
  if (x > 520 && x < 1420 && y > 470 && y < 900) {
    if (i % 2 === 0) x = 90 + hash(i * 7.1) * 360;
    else x = 1500 + hash(i * 8.3) * 330;
  }
  return {
    x,
    y,
    rot: -78 + hash(i * 2.31 + 5) * 156,
    delay: hash(i * 4.91) * 0.45,
    dur: 0.85 + hash(i * 6.13) * 0.9,
    w: 128 + hash(i * 9.07) * 64,
    h: 86 + hash(i * 12.3) * 38,
    stamp: hash(i * 14.7 + 2) < 0.16,
    tint: hash(i * 16.1),
  };
});

export const PaperStorm: React.FC<{time: number; start?: number}> = ({time, start = 30.62}) => {
  if (time < start) return null;
  const t = time - start;

  return (
    <>
      {SLIPS.map((s, i) => {
        const p = clamp((t - s.delay) / s.dur);
        if (p <= 0) return null;
        const e = easeOutCubic(p);
        const x = 960 + (s.x - 960) * e;
        const baseY = 660 + (s.y - 660) * e;
        const lift = Math.sin(Math.PI * p) * (90 + hash(i * 3.3) * 210);
        const y = baseY - lift;
        const flat = clamp((p - 0.55) / 0.45);
        const spin = (hash(i * 4.4) - 0.5) * 220;
        const rot = s.rot + spin * (1 - flat);
        const flip = 1 - Math.sin(Math.PI * p) * (0.45 + hash(i * 5.5) * 0.4);
        const scale = 0.35 + 0.65 * e;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: s.w,
              height: s.h,
              transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${scale}) scaleY(${Math.max(0.18, flip)})`,
              opacity: Math.min(1, p * 3),
              filter: 'drop-shadow(7px 9px 6px rgba(0,0,0,0.38))',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: s.tint > 0.75 ? '#e3d5b7' : COLORS.paperLight,
                backgroundImage: paperBg,
                backgroundSize: 'cover',
                borderRadius: 2,
              }}
            />
            <div style={{position: 'absolute', left: 14, top: 12, width: '42%', height: 7, background: 'rgba(90,72,48,0.22)'}} />
            <div style={{position: 'absolute', left: 14, top: 26, width: '68%', height: 4, background: 'rgba(90,72,48,0.16)'}} />
            <div style={{position: 'absolute', left: 14, top: 36, width: '58%', height: 4, background: 'rgba(90,72,48,0.16)'}} />
            <div style={{position: 'absolute', left: 14, bottom: 12, width: s.w * 0.36, height: s.h * 0.26, border: '1px solid rgba(90,72,48,0.22)'}} />
            {s.stamp ? (
              <svg width={s.w} height={s.h} style={{position: 'absolute', inset: 0}}>
                <g transform={`translate(${s.w * 0.7} ${s.h * 0.55}) rotate(-11)`} opacity={0.72}>
                  <circle r={Math.min(s.w, s.h) * 0.19} fill="none" stroke={COLORS.red} strokeWidth={3} />
                  <line x1={-13} y1={13} x2={13} y2={-13} stroke={COLORS.red} strokeWidth={4} strokeLinecap="round" />
                </g>
              </svg>
            ) : null}
          </div>
        );
      })}
    </>
  );
};
