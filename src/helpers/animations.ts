import logUpdate from 'log-update';

const DEFAULT_FREQUENCY = 150;

export const calculateFrames = (
  string: string,
  type: Animation
): Array<string> => {
  switch (type) {
    case 'colors':
      return [''];
  }
  return [''];
};

type Animation = 'colors' | 'flowing-rainbow';
export interface AnimationOptions {
  msFrequency?: number;
  type: Array<Animation>;
}

export const startAnimation = (string: string, options: AnimationOptions) => {
  let index = 0;
  const frames = ''; //calculateFrames(string, options.type);
  return setInterval(() => {
    const frame = frames[(index = ++index % frames.length)];
    logUpdate(frame);
  }, options.msFrequency || DEFAULT_FREQUENCY);
};
