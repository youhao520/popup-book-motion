import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {AssetLoader} from './components/AssetLoader';
import {Book} from './components/Book';
import {ChatBubbles, FlatBook, SideCard} from './components/FlatBook';
import {Desk, Vignette} from './components/Desk';
import {FontLoader} from './components/FontLoader';
import {Girl} from './components/Girl';
import {ExposureFlicker, Grain} from './components/Grain';
import {OmniBox} from './components/OmniBox';
import {PaperStorm} from './components/PaperStorm';
import {Clapperboard, Gramophone, PropForEra, Standing} from './components/Props';
import {SeasideArt} from './components/SeasideArt';
import {Subtitle} from './components/Subtitle';
import {Timeline} from './components/Timeline';
import {cameraJitter, useStopMotion} from './components/StopMotion';
import {COLORS, DURATION_FRAMES, FONT_SERIF, H, W} from './theme';
import {clamp, easeInOutCubic, hash, lerp, phase} from './timeline';

const mix = (a: number, b: number, p: number) => lerp(a, b, easeInOutCubic(p));

export const PopupBookVideo: React.FC = () => {
  const {pose, time: t, smoothTime} = useStopMotion();
  const jit = cameraJitter(pose);
  const push = 1.004 + 0.026 * phase(t, 0, 38.2);

  // ---------- scene 1: the box ----------
  let lid = 0;
  if (t >= 0.7 && t < 2.62) lid = phase(t, 0.7, 1.15) * (1 - phase(t, 2.45, 2.75));
  let emerging = 0;
  if (t >= 1.25 && t < 2.12) emerging = phase(t, 1.25, 1.75);
  else if (t >= 2.12 && t < 2.65) emerging = 1 - phase(t, 2.12, 2.55);
  const stamp = phase(t, 2.18, 2.38);
  const rejected = phase(t, 2.85, 3.08);

  // ---------- scene 2: flat chat book ----------
  const flatGhost = t < 3.75 ? 0 : t < 8.82 ? 1 : 1 - phase(t, 8.82, 9.02);
  const rainbow = phase(t, 6.22, 6.8);
  const panel = phase(t, 7.12, 7.7);
  const bubbles = phase(t, 4.38, 6.5);
  const cardsGhost = t < 3.8 ? 0 : t < 8.82 ? 1 : 1 - phase(t, 8.82, 9.02);

  // ---------- book: closed -> open ----------
  let open = 0;
  if (t >= 10.32) open = easeInOutCubic(phase(t, 10.32, 11.42));
  if (t >= 30.68) open = 1 - easeInOutCubic(phase(t, 30.68, 31.55));
  if (t >= 35.52) open = easeInOutCubic(phase(t, 35.52, 36.55));

  let cover = 1;
  if (t >= 10.5) cover = 1 - phase(t, 10.5, 11.28);
  if (t >= 30.72) cover = phase(t, 30.86, 31.62);
  if (t >= 35.48) cover = 1 - phase(t, 35.52, 36.28);

  let tabs = 0;
  if (t >= 11.45) tabs = phase(t, 11.45, 12.45);
  if (t >= 30.66) tabs = 1 - phase(t, 30.66, 31.16);
  if (t >= 35.76) tabs = phase(t, 35.76, 36.88);

  const checks = [0, 1, 2, 3, 4].map((i) => {
    let c = 0;
    if (t >= 22.52 + i * 0.075) c = phase(t, 22.52 + i * 0.075, 22.88 + i * 0.075);
    if (t >= 30.66 && t < 36.15) c = 0;
    if (t >= 36.15) c = 1;
    return c;
  });

  let seaside = 0;
  if (t >= 14.24) seaside = phase(t, 14.24, 15.12);
  if (t >= 30.66) seaside = 1 - phase(t, 30.66, 31.12);
  if (t >= 35.52) seaside = phase(t, 35.52, 36.5);

  let timeline = 0;
  if (t >= 14.55) timeline = phase(t, 14.55, 15.65);
  if (t >= 30.66) timeline = 1 - phase(t, 30.66, 31.1);
  if (t >= 35.78) timeline = phase(t, 35.78, 36.85);

  let styles = 0;
  if (t >= 19.15) styles = phase(t, 19.15, 21.0);
  if (t >= 30.66) styles = 1 - phase(t, 30.66, 31.1);
  if (t >= 35.8) styles = phase(t, 35.8, 36.8);

  let labels = 0;
  if (t >= 20.32) labels = phase(t, 20.32, 20.95);
  if (t >= 30.66) labels = 1 - phase(t, 30.66, 31.0);
  if (t >= 35.9) labels = phase(t, 35.9, 36.8);

  const eraRise = (i: number) => {
    const s = 19.32 + (i - 1) * 0.42;
    let r = phase(t, s, s + 0.46);
    if (t >= 30.66) r *= 1 - phase(t, 30.66, 31.1);
    if (t >= 35.8) r = Math.max(r, phase(t, 35.8 + (i - 1) * 0.12, 36.3 + (i - 1) * 0.12));
    return r;
  };

  let girlRise = phase(t, 14.95, 15.5);
  if (t >= 30.66) girlRise *= 1 - phase(t, 30.66, 31.1);
  if (t >= 35.85) girlRise = Math.max(girlRise, phase(t, 35.85, 36.5));
  const waveA = phase(t, 16.0, 16.35) * (1 - phase(t, 17.15, 17.5));
  const waveB = phase(t, 22.5, 22.8) * (1 - phase(t, 23.45, 23.8));
  const wave = Math.max(waveA, waveB);
  const sway = Math.sin(t * 1.7) * 1.3;

  let gram = phase(t, 22.32, 22.78);
  if (t >= 25.8) gram *= 1 - phase(t, 25.8, 26.1);
  if (t >= 35.95) gram = Math.max(gram, phase(t, 35.95, 36.45));
  let clap = phase(t, 23.36, 23.8) * (1 - phase(t, 25.8, 26.1));
  const flag = phase(t, 22.1, 22.55) * (1 - phase(t, 30.66, 31.05)) + phase(t, 36.0, 36.5);

  // ---------- compare layout ----------
  let bookX = 960;
  let bookY = 640;
  let bookScale = 0.92;
  let bookTilt = 63;
  if (t < 10.42) {
    bookY = 630;
    bookScale = 0.74;
    bookTilt = 70;
  }
  if (t >= 10.42 && t < 11.5) {
    const p = phase(t, 10.42, 11.5);
    bookY = mix(630, 640, p);
    bookScale = mix(0.74, 0.92, p);
    bookTilt = mix(70, 63, p);
  }
  if (t >= 25.9) {
    const p = phase(t, 25.9, 26.45);
    bookX = mix(960, 1045, p);
    bookY = mix(640, 654, p);
    bookScale = mix(0.92, 0.9, p);
  }
  if (t >= 28.18) {
    const p = phase(t, 28.18, 28.7);
    bookX = mix(1045, 1330, p);
    bookY = mix(654, 640, p);
    bookScale = mix(0.9, 0.47, p);
  }
  if (t >= 30.68) {
    const p = phase(t, 30.68, 31.3);
    bookX = mix(1330, 960, p);
    bookY = mix(640, 700, p);
    bookScale = mix(0.47, 0.65, p);
    bookTilt = mix(63, 70, p);
  }
  if (t >= 35.48) {
    const p = phase(t, 35.48, 36.05);
    bookY = mix(700, 640, p);
    bookScale = mix(0.65, 0.92, p);
    bookTilt = mix(70, 63, p);
  }

  const bookGhost = t < 8.84 ? 0 : t < 9.06 ? phase(t, 8.84, 9.06) : 1;

  // ---------- box ----------
  const boxScene1 = t < 3.95;
  const boxScene8 = t >= 25.9;
  let boxX = 610;
  let boxY = 185;
  let boxScale = 1;
  let boxRot = 0;
  let boxGhost = 1;
  if (boxScene1 && t > 3.6) boxGhost = 1 - phase(t, 3.6, 3.95);
  if (boxScene8) {
    const inP = phase(t, 25.9, 26.5);
    boxX = mix(-340, 120, inP);
    boxY = 380;
    boxScale = 0.62;
    boxRot = 0;
    if (t >= 28.18) {
      const p = phase(t, 28.18, 28.7);
      boxX = mix(120, 230, p);
      boxY = mix(380, 390, p);
      boxScale = mix(0.62, 0.52, p);
    }
    if (t >= 30.62) {
      const p = phase(t, 30.62, 31.15);
      boxX = mix(230, 40, p);
      boxY = mix(390, 440, p);
      boxScale = mix(0.52, 0.55, p);
      boxRot = -22 * p;
      if (t > 33.0) boxGhost = 1 - phase(t, 33.0, 33.8);
    }
    boxGhost *= phase(t, 25.9, 26.15);
  }

  const boxVisible = boxScene1 || (boxScene8 && t < 33.9);

  // ---------- paper storm ----------
  const stormOn = t >= 30.62;

  // ---------- compare symbol ----------
  const neq = phase(t, 28.55, 29.0) * (1 - phase(t, 30.55, 30.85));
  const neqTag = phase(t, 28.72, 29.17) * (1 - phase(t, 30.55, 30.85));

  return (
    <AbsoluteFill style={{backgroundColor: '#120a05'}}>
      <Desk />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${push}) translate(${jit.x}px, ${jit.y}px) rotate(${jit.rot}deg)`,
          transformOrigin: '50% 46%',
        }}
      >
        <AbsoluteFill style={{perspective: 4200, perspectiveOrigin: '50% 40%', transformStyle: 'preserve-3d'}}>
          {/* scene 2 flat book */}
          {flatGhost > 0.001 ? (
            <FlatBook x={960} y={580} scale={0.8} rainbow={rainbow} panel={panel} ghost={flatGhost} />
          ) : null}

          {cardsGhost > 0.001 ? (
            <>
              <SideCard x={292} y={560} text="我" accent={COLORS.gold} hand rot={-4} scale={0.9 * cardsGhost} />
              <SideCard x={1630} y={548} text="Gemini" accent={COLORS.purple} rot={4} scale={0.9 * cardsGhost} />
            </>
          ) : null}

          {bubbles > 0.001 && t < 9.1 ? <ChatBubbles progress={bubbles} time={t} /> : null}

          {/* the book */}
          {bookGhost > 0.001 ? (
            <Book
              x={bookX}
              y={bookY}
              scale={bookScale}
              tilt={bookTilt}
              rotateZ={-1.1}
              open={open}
              cover={cover}
              tabs={tabs}
              checks={checks}
              ghost={bookGhost}
              backArt={<SeasideArt rise={seaside} time={t} beam={0.58 + 0.26 * Math.sin(t * 0.5)} flag={clamp(flag)} />}
            >
              <Timeline unfold={timeline} styles={styles} labels={labels} />
              {[1, 2, 3, 4].map((i) => (
                <PropForEra key={i} index={i} rise={eraRise(i)} />
              ))}
              <Standing x={1275} bottom={1004} width={188} height={278} rise={girlRise} z={54}>
                <Girl wave={wave} sway={sway} rise={1} />
              </Standing>
              <Standing x={18} bottom={996} width={194} height={196} rise={gram} z={60} rotZ={-3}>
                <Gramophone time={t} />
              </Standing>
              <Standing x={300} bottom={1012} width={158} height={142} rise={clap} z={66} rotZ={3}>
                <Clapperboard />
              </Standing>
            </Book>
          ) : null}

          {/* paper slips */}
          {stormOn ? <PaperStorm time={t} /> : null}
        </AbsoluteFill>

        {/* the Omni box, kept in screen space so its paper cut-out stays crisp */}
        {boxVisible ? (
          <OmniBox
            x={boxX}
            y={boxY}
            scale={boxScale}
            rotate={boxRot}
            lid={boxScene1 ? lid : 0}
            note={boxScene1 ? emerging : 0}
            stamp={boxScene1 ? stamp : 0}
            rejected={boxScene1 ? rejected : t > 28.5 ? 1 : 0}
            tag={0}
            style={{opacity: boxGhost}}
          />
        ) : null}

        {/* hanging average-level tag, screen space so it never clips */}
        {neqTag > 0.001 ? (
          <div
            style={{
              position: 'absolute',
              left: boxX + 152 * boxScale,
              top: boxY + 535 * boxScale,
              width: 206,
              height: 66,
              transform: `rotate(-2.5deg) scale(${0.75 + 0.25 * neqTag})`,
              opacity: neqTag,
              filter: 'drop-shadow(7px 9px 7px rgba(0,0,0,0.4))',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: '#f0e4c8',
                backgroundImage: `url(${staticFile('textures/paper.jpg')})`,
                backgroundSize: 'cover',
                borderRadius: 3,
              }}
            />
            <div style={{position: 'absolute', left: 12, top: 31, width: 8, height: 8, borderRadius: 4, background: '#2c2117'}} />
            <div style={{position: 'absolute', left: 32, top: 0, width: 2, height: 66, background: 'rgba(120,90,50,0.18)'}} />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingLeft: 28,
                fontFamily: '"NotoSerifSC", serif',
                fontWeight: 900,
                fontSize: 35,
                letterSpacing: 2,
                color: '#2c2117',
              }}
            >
              平均水平
            </div>
          </div>
        ) : null}

        {/* the not-equal paper cut-out, kept outside the 3D stage so it always reads */}
        {neq > 0.001 ? (
          <div
            style={{
              position: 'absolute',
              left: 960,
              top: 600,
              width: 166,
              height: 176,
              transform: `translate(-50%, -50%) rotate(-5deg) scale(${0.7 + 0.3 * neq})`,
              opacity: neq,
              filter: 'drop-shadow(10px 14px 8px rgba(0,0,0,0.45))',
            }}
          >
            <svg width={166} height={176} viewBox="0 0 200 210">
              <g transform="translate(100 108) rotate(-3)">
                <rect x={-56} y={-26} width={112} height={19} rx={7} fill={COLORS.red} />
                <rect x={-56} y={12} width={112} height={19} rx={7} fill={COLORS.red} />
                <rect x={-17} y={-66} width={34} height={132} rx={11} fill={COLORS.red} transform="rotate(29)" />
                <rect x={-12} y={-61} width={10} height={122} rx={5} fill="#e06a50" transform="rotate(29)" opacity={0.55} />
              </g>
            </svg>
          </div>
        ) : null}
      </div>

      <Subtitle />
      <ExposureFlicker />
      <Grain />
      <Vignette />

      <Audio src={staticFile('audio/soundtrack.m4a')} />
    </AbsoluteFill>
  );
};

export const durationInFrames = DURATION_FRAMES;
export const compositionWidth = W;
export const compositionHeight = H;
