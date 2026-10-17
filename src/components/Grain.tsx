import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {useStopMotion} from './StopMotion';
import {hash} from '../timeline';

export const Grain: React.FC = () => {
  const {pose} = useStopMotion();
  const x = Math.floor(hash(pose * 1.3) * 512);
  const y = Math.floor(hash(pose * 2.1 + 7) * 512);

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        backgroundImage: `url(${staticFile('textures/grain.png')})`,
        backgroundRepeat: 'repeat',
        backgroundSize: '512px 512px',
        backgroundPosition: `${x}px ${y}px`,
        mixBlendMode: 'overlay',
        opacity: 0.5,
      }}
    />
  );
};

export const ExposureFlicker: React.FC = () => {
  const {pose} = useStopMotion();
  const v = hash(pose * 5.7 + 13);
  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        backgroundColor: v > 0.5 ? 'rgba(255,226,184,0.022)' : 'rgba(0,0,0,0.026)',
      }}
    />
  );
};
