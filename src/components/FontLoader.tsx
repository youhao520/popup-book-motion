import React, {useEffect, useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';

const FACES = [
  {family: 'NotoSerifSC', file: 'fonts/NotoSerifSC-VF.ttf', weight: '100 900'},
  {family: 'SpecialElite', file: 'fonts/SpecialElite-Regular.ttf', weight: '400'},
  {family: 'MaShanZheng', file: 'fonts/MaShanZheng-Regular.ttf', weight: '400'},
];

export const FontLoader: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [handle] = useState(() => delayRender('Loading paper-craft fonts'));

  useEffect(() => {
    const style = document.createElement('style');
    style.setAttribute('data-popup-book-fonts', 'true');
    style.innerHTML = FACES.map(
      (f) => `@font-face {
        font-family: '${f.family}';
        src: url('${staticFile(f.file)}') format('truetype');
        font-weight: ${f.weight};
        font-style: normal;
        font-display: block;
      }`
    ).join('\n');
    document.head.appendChild(style);

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      continueRender(handle);
    };

    Promise.all([
      document.fonts.load(`900 80px 'NotoSerifSC'`),
      document.fonts.load(`700 80px 'NotoSerifSC'`),
      document.fonts.load(`400 40px 'SpecialElite'`),
      document.fonts.load(`400 40px 'MaShanZheng'`),
    ])
      .then(() => document.fonts.ready)
      .then(finish)
      .catch(finish);

    const timer = window.setTimeout(finish, 10000);
    return () => window.clearTimeout(timer);
  }, [handle]);

  return <>{children}</>;
};
