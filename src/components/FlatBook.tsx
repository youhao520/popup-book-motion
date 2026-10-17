import React from 'react';
import {staticFile} from 'remotion';
import {COLORS, FONT_HAND, FONT_SERIF, FONT_TYPE} from '../theme';
import {clamp, easeOutBack, hash} from '../timeline';

const paperBg = `url(${staticFile('textures/paper.jpg')})`;
const tealBg = `url(${staticFile('textures/teal.jpg')})`;

export const FlatBook: React.FC<{
  x: number;
  y: number;
  scale: number;
  rainbow: number;
  panel: number;
  ghost?: number;
}> = ({x, y, scale, rainbow, panel, ghost = 1}) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 1180,
        height: 840,
        transform: `translate(-50%, -50%) rotateX(60deg) rotateZ(-1.2deg) scale(${scale})`,
        transformStyle: 'preserve-3d',
        opacity: ghost,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 28,
          top: 30,
          width: 1124,
          height: 780,
          borderRadius: 10,
          backgroundColor: COLORS.tealDeep,
          backgroundImage: tealBg,
          backgroundSize: 'cover',
          boxShadow: '0 30px 44px rgba(0,0,0,0.5)',
        }}
      />
      {/* upper page */}
      <div
        style={{
          position: 'absolute',
          left: 50,
          top: 48,
          width: 1080,
          height: 350,
          backgroundColor: COLORS.paper,
          backgroundImage: paperBg,
          backgroundSize: 'cover',
          borderRadius: 2,
          boxShadow: 'inset 0 -12px 18px rgba(90,64,32,0.16)',
        }}
      />
      {/* lower page */}
      <div
        style={{
          position: 'absolute',
          left: 50,
          top: 424,
          width: 1080,
          height: 358,
          backgroundColor: COLORS.paper,
          backgroundImage: paperBg,
          backgroundSize: 'cover',
          borderRadius: 2,
          boxShadow: 'inset 0 12px 18px rgba(90,64,32,0.16)',
        }}
      />
      {/* dark hinge */}
      <div style={{position: 'absolute', left: 50, top: 396, width: 1080, height: 28, background: 'rgba(20,50,52,0.55)'}} />
      <div style={{position: 'absolute', left: 50, top: 404, width: 1080, height: 3, background: 'rgba(255,245,220,0.35)'}} />

      {/* rainbow stack of prompt sheets */}
      {rainbow > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: 220,
            top: 470,
            width: 700,
            height: 230,
            opacity: Math.min(1, rainbow * 2),
            transform: `translateY(${(1 - rainbow) * 40}px)`,
          }}
        >
          {['#c94836', '#d99033', '#e8c777', '#4f9b6d', '#3f8f86', '#3b5f9e', '#6b4a86'].map((c, i) => (
            <div
              key={c}
              style={{
                position: 'absolute',
                left: 20 + i * 8,
                top: 150 - i * 20,
                width: 660 - i * 16,
                height: 34,
                background: c,
                borderRadius: 2,
                boxShadow: '0 5px 8px rgba(0,0,0,0.25)',
              }}
            />
          ))}
          <div style={{position: 'absolute', left: 12, top: 174, width: 690, height: 44, background: '#efe2c6', borderRadius: 3, boxShadow: '0 8px 12px rgba(0,0,0,0.25)'}} />
        </div>
      ) : null}

      {/* the prompt deck cover lands on top */}
      {panel > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: 170,
            top: 452,
            width: 748,
            height: 268,
            opacity: Math.min(1, panel * 1.6),
            transform: `translateY(${(1 - panel) * -24}px) scale(${0.92 + 0.08 * panel})`,
            borderRadius: 5,
            backgroundImage: tealBg,
            backgroundSize: 'cover',
            backgroundColor: COLORS.teal,
            boxShadow: '0 22px 28px rgba(0,0,0,0.46)',
          }}
        >
          <div style={{position: 'absolute', inset: 18, border: `1.5px solid ${COLORS.gold}`, opacity: 0.8}} />
          <div style={{position: 'absolute', inset: 25, border: `1px solid rgba(201,162,74,0.5)`}} />
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{transform: 'scaleY(1.58)', textAlign: 'center'}}>
              <div
                style={{
                  fontFamily: FONT_SERIF,
                  fontWeight: 900,
                  fontSize: 74,
                  letterSpacing: 10,
                  color: '#e3bd66',
                  textShadow: '0 2px 0 rgba(70,45,12,0.55)',
                  whiteSpace: 'nowrap',
                }}
              >
                视频生成提示词
              </div>
              <div style={{display: 'flex', justifyContent: 'center', gap: 14, marginTop: 18}}>
                {['#c94836', '#d99033', '#3f7a5a', '#3b5f9e'].map((c) => (
                  <div key={c} style={{width: 9, height: 9, borderRadius: 5, background: c}} />
                ))}
              </div>
            </div>
          </div>
          <div style={{position: 'absolute', left: 75, bottom: -12, display: 'flex', gap: 68}}>
            {['#3f7a5a', '#d99033', '#c94836', '#3b5f9e'].map((c) => (
              <div key={c} style={{width: 40, height: 16, background: c, borderRadius: 1, boxShadow: '0 4px 4px rgba(0,0,0,0.3)'}} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export const SideCard: React.FC<{
  x: number;
  y: number;
  text: string;
  accent: string;
  hand?: boolean;
  rot?: number;
  scale?: number;
}> = ({x, y, text, accent, hand = false, rot = 0, scale = 1}) => {
  const w = hand ? 168 : 208;
  const h = 132;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        transform: `translate(-50%, -50%) rotateX(55deg) rotateZ(${rot}deg) scale(${scale})`,
        transformStyle: 'preserve-3d',
      }}
    >
      <div style={{position: 'absolute', inset: 0, background: COLORS.paperLight, backgroundImage: paperBg, backgroundSize: 'cover', borderRadius: 2, boxShadow: '0 16px 20px rgba(0,0,0,0.42)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 8, background: accent}} />
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <span
          style={{
            fontFamily: hand ? FONT_HAND : FONT_TYPE,
            fontWeight: hand ? 400 : 400,
            fontSize: hand ? 78 : 34,
            color: COLORS.ink,
            transform: `scaleY(${1 / Math.cos((55 * Math.PI) / 180)})`,
            letterSpacing: hand ? 0 : 1,
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};

const BUBBLES = [
  {text: '文', color: COLORS.red, x: 640, y: 420, r: -12},
  {text: '画', color: COLORS.green, x: 560, y: 500, r: 8},
  {text: '音', color: COLORS.blue, x: 640, y: 545, r: -5},
  {text: '影', color: '#b8862f', x: 1330, y: 430, r: 10},
  {text: '光', color: '#b8862f', x: 1400, y: 505, r: -9},
  {text: '剪', color: COLORS.red, x: 1275, y: 540, r: 6},
  {text: '色', color: COLORS.purple, x: 590, y: 360, r: -4},
  {text: '景', color: COLORS.green, x: 1350, y: 360, r: 7},
];

export const ChatBubbles: React.FC<{progress: number; time: number}> = ({progress, time}) => {
  return (
    <>
      {BUBBLES.map((b, i) => {
        const p = clamp((progress - i * 0.07) / 0.4);
        if (p <= 0) return null;
        const s = easeOutBack(p, 2.1);
        const bob = Math.sin(time * 2.2 + i * 1.4) * 4;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: b.x,
              top: b.y + bob,
              width: 64,
              height: 64,
              transform: `translate(-50%, -50%) rotate(${b.r}deg) scale(${s})`,
              filter: 'drop-shadow(0 10px 9px rgba(0,0,0,0.35))',
            }}
          >
            <svg width={64} height={64} viewBox="0 0 78 78">
              <path d="M 12 8 H 66 Q 72 8 72 14 V 56 Q 72 62 66 62 H 44 L 34 74 L 32 62 H 12 Q 6 62 6 56 V 14 Q 6 8 12 8 Z" fill={b.color} />
              <path d="M 12 8 H 66 Q 72 8 72 14 V 22 H 6 V 14 Q 6 8 12 8 Z" fill="#fff" opacity={0.16} />
            </svg>
            <span
              style={{
                position: 'absolute',
                left: 0,
                top: 2,
                width: 64,
                textAlign: 'center',
                fontFamily: FONT_SERIF,
                fontWeight: 900,
                fontSize: 29,
                color: '#f7ecd2',
              }}
            >
              {b.text}
            </span>
          </div>
        );
      })}
    </>
  );
};

export const RainbowBurst: React.FC<{progress: number}> = ({progress}) => {
  return (
    <div style={{position: 'absolute', left: 960, top: 500, transform: 'translate(-50%,-50%)'}}>
      {Array.from({length: 22}, (_, i) => {
        const a = (i / 22) * Math.PI * 2;
        const d = 60 + progress * 180;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 16,
              height: 46,
              background: ['#c94836', '#d99033', '#e8c777', '#4f9b6d', '#3f8f86', '#6b4a86'][i % 6],
              transform: `translate(${Math.cos(a) * d}px, ${Math.sin(a) * d}px) rotate(${(a * 180) / Math.PI}deg) scale(${progress})`,
              opacity: progress,
              borderRadius: 2,
            }}
          />
        );
      })}
    </div>
  );
};
