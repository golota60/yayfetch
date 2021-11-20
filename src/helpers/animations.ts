import logUpdate from 'log-update';
import { availableColors, getColoredLetters, rainbowColors } from './colors';
import { getColoredText } from './helpers';

const DEFAULT_FREQUENCY = 150;
type Animation = 'colors' | 'flowing-rainbow';

interface AnimationObject {
  col: string;
  animation?: Animation;
}

const animations = {
  colors: (col: string) => {
    return availableColors
      .filter((e) => e !== 'black')
      .map((e) => getColoredText(col, e));
  },
  'flowing-rainbow': (col: string) => {
    return rainbowColors.map((e, i) =>
      getColoredLetters(col, {
        indexOffset: i,
        colorPalette: rainbowColors,
      })
    );
  },
};

// Creates column-animation binded objects
export const parseAnimations = (
  cols: Array<string>,
  colors: Array<Animation>
): Array<AnimationObject> =>
  cols.map((col, i) => ({ col, animation: colors[i] || undefined }));

// Create animation for a given column
export const getAnimationFrames = (
  col: string,
  type?: Animation
): Array<string> | string => {
  return type ? animations[type](col) : col;
};

export interface AnimationOptions {
  msFrequency?: number;
  type: Animation;
}

export const startAnimation = (col: string, options: AnimationOptions) => {
  let index = 0;

  // get an array of frames for column
  const frames = getAnimationFrames(col, options.type);
  return setInterval(() => {
    const frame = frames[(index = ++index % frames.length)];
    logUpdate(frame);
  }, options.msFrequency || DEFAULT_FREQUENCY);
};
