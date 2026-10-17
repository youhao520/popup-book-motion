import fs from 'node:fs';
import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setConcurrency(8);

// On Windows the Chrome Headless Shell download can be unavailable. Use an
// installed Chromium/Edge when one is present, otherwise let Remotion fetch its
// own browser. Override with REMOTION_BROWSER if needed.
const browser =
  process.env.REMOTION_BROWSER ??
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

if (fs.existsSync(browser)) {
  Config.setBrowserExecutable(browser);
}
