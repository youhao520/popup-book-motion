import React, {useEffect, useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';

const ASSETS = [
  'textures/wood.jpg',
  'textures/paper.jpg',
  'textures/cardboard.jpg',
  'textures/teal.jpg',
  'textures/grain.png',
];

export const AssetLoader: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [handle] = useState(() => delayRender('Loading paper textures'));

  useEffect(() => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      continueRender(handle);
    };
    Promise.all(
      ASSETS.map(
        (src) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => resolve();
            img.src = staticFile(src);
          })
      )
    ).then(finish);
    const timer = window.setTimeout(finish, 8000);
    return () => window.clearTimeout(timer);
  }, [handle]);

  return <>{children}</>;
};
