import React from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame} from 'remotion';
import {COLORS, FONT_SERIF, W} from '../theme';
import {clamp, easeOutBack, hash, LINES} from '../timeline';

const torn = (seed: number, amp = 5) => {
  const pts: string[] = [];
  const n = 22;
  for (let i = 0; i <= n; i++) {
    const x = (i / n) * 100;
    const y = (i === 0 || i === n ? amp * 0.6 : hash(seed + i * 1.7) * amp);
    pts.push(`${x.toFixed(2)}% ${y.toFixed(1)}px`);
  }
  for (let i = n; i >= 0; i--) {
    const x = (i / n) * 100;
    const y = (i === 0 || i === n ? amp * 0.6 : hash(seed + 40 + i * 2.3) * amp);
    pts.push(`${x.toFixed(2)}% calc(100% - ${y.toFixed(1)}px)`);
  }
  return `polygon(${pts.join(',')})`;
};

const unitsOf = (text: string) =>
  Array.from(text).reduce((acc, ch) => acc + (/[\x00-\x7F]/.test(ch) ? 0.56 : 1), 0);

export const Subtitle: React.FC = () => {
  const frame = useCurrentFrame();
  const time = frame / 30;
  const line = LINES.find((l) => time >= l.start && time < l.end);
  if (!line) return null;

  const width = Math.min(1660, unitsOf(line.text) * 45 + 108);
  const pop = clamp((time - line.start) / 0.12);
  const scale = 0.965 + 0.035 * easeOutBack(pop, 1.6);
  const seed = line.text.length * 13.7 + line.start * 5.1;
  const wobble = (hash(frame * 0.7 + seed) - 0.5) * 0.35;

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: W / 2 - width / 2,
          top: 936,
          width,
          height: 96,
          transform: `rotate(${-0.55 + wobble}deg) scale(${scale})`,
          filter: 'drop-shadow(0 12px 16px rgba(0,0,0,0.45))',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            clipPath: torn(seed, 5.5),
            backgroundColor: COLORS.paperLight,
            backgroundImage: `url(${staticFile('textures/paper.jpg')})`,
            backgroundSize: 'cover',
            boxShadow: 'inset 0 0 24px rgba(120,92,54,0.13)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 34px',
          }}
        >
          <span
            style={{
              fontFamily: FONT_SERIF,
              fontWeight: 900,
              fontSize: 44,
              lineHeight: 1,
              letterSpacing: 0.6,
              color: '#241a10',
              whiteSpace: 'nowrap',
            }}
          >
            {line.text}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
