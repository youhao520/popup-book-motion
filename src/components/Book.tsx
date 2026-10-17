import React from 'react';
import {staticFile} from 'remotion';
import {COLORS, FONT_SERIF} from '../theme';
import {clamp, easeOutBack} from '../timeline';
import {TabDef} from './Tabs';

const paperBg = `url(${staticFile('textures/paper.jpg')})`;
const tealBg = `url(${staticFile('textures/teal.jpg')})`;

const coverTitleStyle: React.CSSProperties = {
  fontFamily: FONT_SERIF,
  fontWeight: 900,
  fontSize: 90,
  letterSpacing: 12,
  lineHeight: 1,
  color: '#e3bd66',
  textShadow: '0 2px 0 rgba(70,45,12,0.55), 0 0 18px rgba(227,189,102,0.18)',
  whiteSpace: 'nowrap',
};

export const TABS: TabDef[] = [
  {label: '世界观·故事', color: COLORS.green, icon: 'globe'},
  {label: '时间跨度', color: COLORS.orange, icon: 'hourglass'},
  {label: '时代背景', color: COLORS.red, icon: 'calendar'},
  {label: '画面风格', color: COLORS.blue, icon: 'brush'},
  {label: '节奏·声音', color: COLORS.purple, icon: 'note'},
];

type BookProps = {
  x: number;
  y: number;
  scale?: number;
  tilt?: number;
  rotateZ?: number;
  open: number;
  cover?: number;
  tabs?: number;
  checks?: number[];
  children?: React.ReactNode;
  backArt?: React.ReactNode;
  frontPage?: React.ReactNode;
  ghost?: number;
};

const CoverTabTips: React.FC = () => (
  <>
    {[COLORS.green, COLORS.orange, COLORS.red, COLORS.blue, COLORS.purple].map((c, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: 300 + i * 120,
          top: 1064,
          width: 52,
          height: 22,
          borderRadius: 2,
          background: c,
          boxShadow: '0 4px 5px rgba(0,0,0,0.35)',
        }}
      />
    ))}
  </>
);

export const Book: React.FC<BookProps> = ({
  x,
  y,
  scale = 1,
  tilt = 63,
  rotateZ = -1.1,
  open,
  cover = 1,
  tabs = 0,
  checks = [0, 0, 0, 0, 0],
  children,
  backArt,
  frontPage,
  ghost = 1,
}) => {
  const o = clamp(open);
  const lidLift = clamp(o * 2.4);
  const upright = o;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 1180,
        height: 1080,
        transformStyle: 'preserve-3d',
        transform: `translate(-50%, -50%) rotateX(${tilt}deg) rotateZ(${rotateZ}deg) scale(${scale})`,
        opacity: ghost,
      }}
    >
      {/* cast shadow on the desk */}
      <div
        style={{
          position: 'absolute',
          left: 40,
          top: 50,
          width: 1220,
          height: 1010,
          borderRadius: 18,
          background: 'rgba(0,0,0,0.45)',
          filter: `blur(${26 + 16 * o}px)`,
          transform: `translate(${34 + 22 * o}px, ${26 + 8 * o}px)`,
          opacity: 0.8,
        }}
      />

      {/* back cover, visible as the teal frame around the pages */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 10,
          backgroundColor: COLORS.tealDeep,
          backgroundImage: tealBg,
          backgroundSize: 'cover',
          boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5), 0 6px 0 rgba(0,0,0,0.35)',
        }}
      />

      {/* flat front page */}
      <div
        style={{
          position: 'absolute',
          left: 32,
          top: 548,
          width: 1116,
          height: 504,
          backgroundColor: COLORS.paper,
          backgroundImage: paperBg,
          backgroundSize: 'cover',
          borderRadius: 3,
          opacity: 0.25 + 0.75 * o,
          boxShadow: 'inset 0 14px 22px rgba(92,66,34,0.20), inset 0 -6px 12px rgba(92,66,34,0.10)',
        }}
      />
      {frontPage}

      {/* the page that stands up */}
      <div
        style={{
          position: 'absolute',
          left: 32,
          top: 44,
          width: 1116,
          height: 504,
          transformOrigin: 'bottom center',
          transform: `rotateX(${-82 * upright}deg)`,
          transformStyle: 'preserve-3d',
          opacity: open > 0.015 ? 1 : 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: -12,
            borderRadius: 4,
            backgroundColor: COLORS.teal,
            backgroundImage: tealBg,
            backgroundSize: 'cover',
            boxShadow: '0 26px 36px rgba(0,0,0,0.42)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            backgroundColor: COLORS.paper,
            backgroundImage: paperBg,
            backgroundSize: 'cover',
            boxShadow: 'inset 0 0 34px rgba(95,70,38,0.18)',
            transform: 'translateZ(1px)',
          }}
        >
          {backArt}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(255,246,220,0.14), transparent 16%, transparent 82%, rgba(70,45,20,0.16))',
            }}
          />
        </div>
      </div>

      {/* closed cover */}
      {cover > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 10,
            backgroundImage: tealBg,
            backgroundSize: 'cover',
            backgroundColor: COLORS.teal,
            opacity: cover,
            transform: `translateY(${-lidLift * 26}px) rotateX(${-lidLift * 7}deg)`,
            transformOrigin: 'center 78%',
            boxShadow: 'inset 0 0 46px rgba(0,0,0,0.45)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 26,
              border: `1.5px solid ${COLORS.gold}`,
              opacity: 0.8,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 36,
              border: `1px solid rgba(201,162,74,0.55)`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{transform: 'scaleY(1.52) translateZ(0.6px)', textAlign: 'center'}}>
              <div style={coverTitleStyle}>视频生成提示词</div>
              <div
                style={{
                  marginTop: 26,
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 22,
                }}
              >
                {[COLORS.green, COLORS.orange, COLORS.red, COLORS.blue].map((c, i) => (
                  <div key={i} style={{width: 13, height: 13, borderRadius: 7, background: c, opacity: 0.95}} />
                ))}
              </div>
            </div>
          </div>
          <CoverTabTips />
        </div>
      ) : null}

      {/* five section tabs standing on the front edge */}
      {TABS.map((tab, i) => {
        const rise = clamp(tabs * 1.35 - i * 0.08);
        const scaleUp = 0.6 + 0.4 * rise;
        return (
          <div
            key={tab.label}
            style={{
              position: 'absolute',
              left: 38 + i * 222,
              top: 982,
              width: 212,
              height: 74,
              transformOrigin: 'bottom center',
              transform: `translateZ(${8 + i}px) rotateX(${-70 * rise}deg) scale(${scaleUp})`,
              opacity: rise,
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: COLORS.paperLight,
                backgroundImage: paperBg,
                backgroundSize: 'cover',
                borderRadius: 2,
                boxShadow: '0 12px 16px rgba(0,0,0,0.38), inset 0 -6px 10px rgba(120,90,50,0.10)',
              }}
            />
            <div style={{position: 'absolute', left: 4, right: 4, top: 3, height: 7, background: tab.color, borderRadius: 1}} />
            <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', paddingLeft: 18}}>
              <TabIcon kind={tab.icon} color={tab.color} />
              <span
                style={{
                  marginLeft: 10,
                  fontFamily: FONT_SERIF,
                  fontWeight: 700,
                  fontSize: 30,
                  color: tab.color,
                  letterSpacing: 1,
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </span>
            </div>
            {checks[i] > 0 ? (
              <svg
                width={34}
                height={34}
                viewBox="0 0 42 42"
                style={{
                  position: 'absolute',
                  right: -8,
                  top: -10,
                  transform: `scale(${easeOutBack(clamp(checks[i]), 2.2)})`,
                  transformOrigin: '50% 100%',
                }}
              >
                <path d="M7 23 L17 33 L36 8" fill="none" stroke={COLORS.red} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : null}
          </div>
        );
      })}

      {children}
    </div>
  );
};

const TabIcon: React.FC<{kind: string; color: string}> = ({kind, color}) => {
  if (kind === 'globe') {
    return (
      <svg width={31} height={31} viewBox="0 0 27 27">
        <circle cx={13.5} cy={13.5} r={10} fill="none" stroke={color} strokeWidth={1.7} />
        <ellipse cx={13.5} cy={13.5} rx={4.6} ry={10} fill="none" stroke={color} strokeWidth={1.5} />
        <line x1={3.5} y1={13.5} x2={23.5} y2={13.5} stroke={color} strokeWidth={1.5} />
      </svg>
    );
  }
  if (kind === 'hourglass') {
    return (
      <svg width={31} height={31} viewBox="0 0 27 27">
        <path d="M6 3 H21 L14.5 13.5 L21 24 H6 L12.5 13.5 Z" fill="none" stroke={color} strokeWidth={1.7} strokeLinejoin="round" />
      </svg>
    );
  }
  if (kind === 'calendar') {
    return (
      <svg width={31} height={31} viewBox="0 0 27 27">
        <rect x={3.5} y={5} width={20} height={18} rx={2} fill="none" stroke={color} strokeWidth={1.7} />
        <line x1={3.5} y1={11} x2={23.5} y2={11} stroke={color} strokeWidth={1.5} />
        {[0, 1, 2].map((r) =>
          [0, 1, 2].map((c) => (
            <rect key={`${r}-${c}`} x={7.5 + c * 5} y={14 + r * 4} width={2.4} height={2.4} fill={color} />
          ))
        )}
      </svg>
    );
  }
  if (kind === 'brush') {
    return (
      <svg width={31} height={31} viewBox="0 0 27 27">
        <path d="M20.5 3.5 L23.5 6.5 L12 18 L7.5 19.5 L9 15 Z" fill="none" stroke={color} strokeWidth={1.7} strokeLinejoin="round" />
        <path d="M9 15 L12 18" stroke={color} strokeWidth={1.7} />
      </svg>
    );
  }
  return (
    <svg width={31} height={31} viewBox="0 0 27 27">
      <path d="M10 20 V6 L21 3 V17" fill="none" stroke={color} strokeWidth={1.7} strokeLinejoin="round" />
      <ellipse cx={7.2} cy={20.5} rx={3.4} ry={2.6} fill={color} />
      <ellipse cx={18.2} cy={17.5} rx={3.4} ry={2.6} fill={color} />
    </svg>
  );
};
