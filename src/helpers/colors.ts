import chalk, { Chalk, ColorSupport } from 'chalk';
import { Options } from './helpers';

export const chalkColors = [
  'black',
  'red',
  'green',
  'yellow',
  'blue',
  'magenta',
  'cyan',
  'white',
] as const;

export const availableColors = [
  ...chalkColors,
  'pink',
  'orange',
  'violet',
] as const;

export const allColors = [
  ...availableColors,
  'rainbow',
  'randomrainbow', //implement later
] as const;

// Colors prepared for rainbow animation
const rainbowColors = [
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'violet',
] as const;

export type PredefinedColors = typeof availableColors[number];
export type ColorCodes = typeof allColors[number];

export const customColorCodes = {
  pink: { r: 255, g: 102, b: 147 },
  orange: { r: 255, g: 170, b: 16 },
  yellow: { r: 255, g: 245, b: 99 },
  violet: { r: 186, g: 13, b: 255 },
  lightgrey: { r: 224, g: 224, b: 224 },
  darkgrey: { r: 152, g: 152, b: 152 },
  burgundy: { r: 146, g: 36, b: 36 },
  darkgreen: { r: 63, g: 163, b: 38 },
  lightgreen: { r: 95, g: 235, b: 61 },
  darkyellow: { r: 179, g: 203, b: 0 },
  deepBlue: { r: 0, g: 47, b: 255 },
  darkDeepBlue: { r: 0, g: 30, b: 161 },
  darkViolet: { r: 181, g: 47, b: 191 },
  darkCyan: { r: 0, g: 171, b: 186 },
};

export const customColors = {
  pink: chalk.rgb(
    customColorCodes.pink.r,
    customColorCodes.pink.g,
    customColorCodes.pink.b
  ),
  orange: chalk.rgb(
    customColorCodes.orange.r,
    customColorCodes.orange.g,
    customColorCodes.orange.b
  ),
  violet: chalk.rgb(
    customColorCodes.violet.r,
    customColorCodes.violet.g,
    customColorCodes.violet.b
  ),
};

export const getColoringFunc = (
  colorCode: PredefinedColors
): Chalk & { supportsColor: ColorSupport } =>
  (chalk as any)[colorCode] || (customColors as any)[colorCode];

interface RainbowOptions extends Options {
  random?: boolean;
}

export const returnInRainbow = (
  text: string,
  options?: RainbowOptions
): string => {
  const functionArray = rainbowColors.map((e) => getColoringFunc(e));
  const coloredText = text
    .split('')
    .map((char, i) => {
      return options?.bolded
        ? functionArray[i % functionArray.length].bold(char)
        : functionArray[i % functionArray.length](char);
    })
    .join('');
  return coloredText;
};
