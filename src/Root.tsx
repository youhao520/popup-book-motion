import React from 'react';
import {Composition} from 'remotion';
import {AssetLoader} from './components/AssetLoader';
import {FontLoader} from './components/FontLoader';
import {DURATION_FRAMES, FPS, H, W} from './theme';
import {PopupBookVideo} from './Video';

const PopupBook: React.FC = () => (
  <FontLoader>
    <AssetLoader>
      <PopupBookVideo />
    </AssetLoader>
  </FontLoader>
);

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="PopupBook"
      component={PopupBook}
      durationInFrames={DURATION_FRAMES}
      fps={FPS}
      width={W}
      height={H}
    />
  );
};
