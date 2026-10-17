import React, {useId} from 'react';
import {staticFile} from 'remotion';
import {COLORS, FONT_HAND, FONT_SERIF, FONT_TYPE} from '../theme';

type Props = {
  x?: number;
  y?: number;
  scale?: number;
  rotate?: number;
  lid?: number;
  note?: number;
  stamp?: number;
  tag?: number;
  rejected?: number;
  style?: React.CSSProperties;
};

const CardboardPattern: React.FC<{id: string}> = ({id}) => (
  <pattern id={id} width={260} height={260} patternUnits="userSpaceOnUse">
    <image href={staticFile('textures/cardboard.jpg')} width={260} height={260} preserveAspectRatio="xMidYMid slice" />
  </pattern>
);

const Note: React.FC<{
  x: number;
  y: number;
  rot: number;
  stamp: number;
  width?: number;
  paperId: string;
}> = ({x, y, rot, stamp, width = 330, paperId}) => {
  const h = width * 0.58;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} filter="url(#noteShadow)">
      <rect x={0} y={0} width={width} height={h} rx={3} fill="#eee1c4" />
      <rect x={0} y={0} width={width} height={h} rx={3} fill={`url(#${paperId})`} opacity={0.85} />
      <line x1={22} y1={h * 0.32} x2={width - 22} y2={h * 0.32} stroke="#b9a583" strokeWidth={1} />
      <line x1={22} y1={h * 0.78} x2={width - 22} y2={h * 0.78} stroke="#b9a583" strokeWidth={1} />
      <text x={24} y={h * 0.24} fontFamily={FONT_SERIF} fontSize={18} fill="#6b5840" letterSpacing={1}>
        一句话提示词
      </text>
      <text x={26} y={h * 0.64} fontFamily={FONT_HAND} fontSize={30} fill="#2b2118" letterSpacing={0.5}>
        海边 女孩 电影感
      </text>
      {stamp > 0 ? (
        <g transform={`translate(${width * 0.67} ${h * 0.56}) rotate(-13) scale(${stamp})`} opacity={0.88}>
          <circle r={40} fill="none" stroke={COLORS.red} strokeWidth={6} />
          <line x1={-27} y1={27} x2={27} y2={-27} stroke={COLORS.red} strokeWidth={7} strokeLinecap="round" />
          <circle r={46} fill="none" stroke={COLORS.red} strokeWidth={2} opacity={0.5} />
        </g>
      ) : null}
    </g>
  );
};

export const OmniBox: React.FC<Props> = ({
  x = 0,
  y = 0,
  scale = 1,
  rotate = 0,
  lid = 0,
  note = 0,
  stamp = 0,
  tag = 0,
  rejected = 0,
  style,
}) => {
  const uid = useId().replace(/[:]/g, '');
  const cardId = `card${uid}`;
  const paperId = `paper${uid}`;
  const shadowId = `boxshadow${uid}`;

  // lid lifts up and slightly back, exposing the dark mouth of the box
  const lidY = -lid * 16;
  const lidX = lid * 4;

  return (
    <div style={{position: 'absolute', left: x, top: y, width: 720, height: 620, transform: `scale(${scale}) rotate(${rotate}deg)`, transformOrigin: '0 0', ...style}}>
      <svg width={720} height={620} viewBox="0 0 720 620">
        <defs>
          <CardboardPattern id={cardId} />
          <pattern id={paperId} width={260} height={260} patternUnits="userSpaceOnUse">
            <image href={staticFile('textures/paper.jpg')} width={260} height={260} preserveAspectRatio="xMidYMid slice" />
          </pattern>
          <filter id={shadowId} x="-30%" y="-30%" width="160%" height="170%">
            <feDropShadow dx="18" dy="24" stdDeviation="16" floodColor="#0a0402" floodOpacity="0.55" />
          </filter>
          <filter id="noteShadow" x="-40%" y="-40%" width="190%" height="200%">
            <feDropShadow dx="8" dy="10" stdDeviation="5" floodColor="#0a0402" floodOpacity="0.42" />
          </filter>
          <linearGradient id="frontLight" x1="0" y1="0" x2="0.6" y2="1">
            <stop offset="0%" stopColor="#fff6df" stopOpacity="0.30" />
            <stop offset="52%" stopColor="#fff2d6" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#1b120b" stopOpacity="0.20" />
          </linearGradient>
          <linearGradient id="sideShade" x1="0" y1="0" x2="1" y2="0.3">
            <stop offset="0%" stopColor="#1b120b" stopOpacity="0.10" />
            <stop offset="55%" stopColor="#1b120b" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#120b06" stopOpacity="0.52" />
          </linearGradient>
          <radialGradient id="gauge" cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#fbf5e6" />
            <stop offset="100%" stopColor="#cdc4ae" />
          </radialGradient>
        </defs>

        {/* contact shadow */}
        <ellipse cx={350} cy={536} rx={292} ry={40} fill="#080402" opacity={0.5} filter="url(#boxshadow)" />

        <g filter={`url(#${shadowId})`}>
          {/* front */}
          <polygon points="55,155 470,155 470,505 55,505" fill={`url(#${cardId})`} />
          <polygon points="55,155 470,155 470,505 55,505" fill="url(#frontLight)" />
          {/* side */}
          <polygon points="470,155 570,78 570,424 470,505" fill={`url(#${cardId})`} />
          <polygon points="470,155 570,78 570,424 470,505" fill="url(#sideShade)" />
          {/* dark mouth sits under the lid */}
          {lid > 0.02 ? (
            <g opacity={Math.min(1, lid * 1.8)}>
              <polygon points="70,150 160,82 552,82 458,150" fill="#120d08" />
              <polygon points="82,142 168,90 540,90 452,142" fill="#1e150e" opacity={0.9} />
              <polygon points="100,132 180,98 520,98 440,132" fill="#efe3c9" opacity={0.14} />
            </g>
          ) : null}
        {/* paper coming out of the box */}
        {note > 0 ? (
          <g
            transform={`translate(${276 + (1 - note) * 3} ${150 - note * 122}) rotate(${-6 + note * 8})`}
            opacity={Math.min(1, note * 1.9)}
          >
            <rect x={0} y={0} width={180} height={112} rx={2} fill="#ece0c6" filter="url(#noteShadow)" />
            <rect x={0} y={0} width={180} height={112} rx={2} fill={`url(#${paperId})`} opacity={0.8} />
            <line x1={18} y1={38} x2={162} y2={38} stroke="#c0ad8a" strokeWidth={1} />
            <line x1={18} y1={78} x2={162} y2={78} stroke="#c0ad8a" strokeWidth={1} />
            {stamp > 0.05 ? (
              <g transform="translate(108 58) rotate(-12) scale(0.62)" opacity={0.85}>
                <circle r={40} fill="none" stroke={COLORS.red} strokeWidth={6} />
                <line x1={-27} y1={27} x2={27} y2={-27} stroke={COLORS.red} strokeWidth={7} strokeLinecap="round" />
              </g>
            ) : null}
          </g>
        ) : null}

          {/* lid / top */}
          <g transform={`translate(${lidX} ${lidY}) skewX(${-lid * 1.6})`}>
            <polygon points="55,155 155,72 570,72 470,155" fill={`url(#${cardId})`} />
            <polygon points="55,155 155,72 570,72 470,155" fill="#fff3d8" opacity={0.16} />
            <polygon points="95,135 405,135 390,150 108,150" fill="#241c16" opacity={0.9} />
            <text x={252} y={151} fontFamily={FONT_TYPE} fontSize={15} fill="#3a3026" letterSpacing={5} opacity={0.85}>
              PROMPT IN
            </text>
          </g>

          {/* front label */}
          <text x={262} y={334} textAnchor="middle" fontFamily={FONT_TYPE} fontSize={104} letterSpacing={12} fill="#211a13">
            OMNI
          </text>
          <text x={262} y={334} textAnchor="middle" fontFamily={FONT_TYPE} fontSize={104} letterSpacing={12} fill="#5a4a38" opacity={0.18} transform="translate(2 -2)">
            OMNI
          </text>
          <text x={262} y={392} textAnchor="middle" fontFamily={FONT_TYPE} fontSize={23} letterSpacing={9} fill="#3b3127" opacity={0.9}>
            AI VIDEO MODEL
          </text>

          {/* front slot */}
          <rect x={92} y={414} width={302} height={30} rx={3} fill="#17110d" />
          <rect x={92} y={414} width={302} height={4} rx={2} fill="#7c7262" opacity={0.6} />

          {/* corner screws */}
          {[
            [66, 166],
            [459, 166],
            [66, 494],
            [459, 494],
          ].map(([sx, sy], i) => (
            <g key={i}>
              <circle cx={sx} cy={sy} r={4.2} fill="#6f6657" />
              <circle cx={sx - 1} cy={sy - 1} r={1.4} fill="#cfc6b3" opacity={0.7} />
            </g>
          ))}

          {/* gauge on the side */}
          <g transform="translate(520 182)">
            <circle r={23} fill="url(#gauge)" stroke="#5f5748" strokeWidth={2.5} />
            <circle r={17} fill="none" stroke="#8a806c" strokeWidth={1} />
            <line x1={0} y1={2} x2={8} y2={-12} stroke={COLORS.red} strokeWidth={2.6} strokeLinecap="round" />
            <circle r={2.6} fill="#3a3228" />
            <path d="M -10 12 A 14 14 0 0 1 10 12" fill="none" stroke="#8a806c" strokeWidth={1} />
          </g>

          {/* crank */}
          <g>
            <rect x={536} y={244} width={12} height={58} rx={5} fill="#b08a2f" />
            <rect x={542} y={238} width={10} height={52} rx={4} fill="#d6b25b" />
            <circle cx={542} cy={246} r={7} fill="#5b4c35" />
            <rect x={542} y={286} width={64} height={14} rx={6} fill="#a53427" />
            <rect x={548} y={287} width={52} height={5} rx={2} fill="#d9634e" opacity={0.8} />
            <rect x={600} y={282} width={17} height={22} rx={6} fill="#c94a37" />
          </g>
        </g>

        {/* the handwritten prompt card on the desk */}
        <Note x={438} y={452} rot={-7} stamp={rejected} width={318} paperId={paperId} />

        {/* hanging average tag */}
        {tag > 0 ? (
          <g transform={`translate(${-24 - tag * 10} ${512 + (1 - tag) * 12}) rotate(${-2 + tag * 1.5})`} opacity={Math.min(1, tag * 1.6)}>
            <line x1={116} y1={-2} x2={70} y2={-38} stroke="#8b6b45" strokeWidth={2.4} />
            <circle cx={110} cy={8} r={6} fill="#6b4a2c" />
            <rect x={-42} y={4} width={300} height={76} rx={5} fill="#f0e4c8" />
            <rect x={-42} y={4} width={300} height={76} rx={5} fill={`url(#${paperId})`} opacity={0.8} />
            <circle cx={-18} cy={42} r={6} fill="#2c2117" />
            <text x={62} y={54} textAnchor="middle" fontFamily={FONT_SERIF} fontWeight={900} fontSize={42} fill="#2c2117" letterSpacing={3}>
              平均水平
            </text>
          </g>
        ) : null}
      </svg>
    </div>
  );
};
