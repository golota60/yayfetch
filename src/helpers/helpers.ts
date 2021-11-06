import os from 'os';
import { promises } from 'fs';
import { exit } from 'process';
import chalk from 'chalk';
import { RGBColors } from '../interfaces/general';
import {
  ColorCodes,
  customColorCodes,
  getColoringFunc,
  returnInRainbow,
} from './colors';

export interface Options {
  bolded?: boolean;
}

export const errorMessage =
  'Error - check https://www.npmjs.com/package/yayfetch or https://github.com/golota60/yayfetch for more';

export const bitstoMegabytes = (numberToConvert: number): number =>
  numberToConvert * 9.537 * 10 ** -7;

export const uptimeInMinutes = (): number => os.uptime() / 60;

export const parseRGBStringToNumber = (rgbString: string): RGBColors => {
  const split = rgbString.split(',');
  const RGBAsNumericalArray = split.map((color: string) => {
    const colorNumber = Number(color);
    if (Number.isNaN(colorNumber) || colorNumber < 0 || colorNumber > 255) {
      throw new Error(
        "One of the numbers wasn't provided in correct format(has to be a number between 0 and 255)"
      );
    }

    return colorNumber;
  });
  if (split.length !== 3) {
    throw new Error(
      'Specified RGB color was provided in incorrect form. Please remember that there has to be exactly 3 colors, separated by comas, and numbers have to be between 0 and 255'
    );
  }

  return {
    r: RGBAsNumericalArray[0],
    g: RGBAsNumericalArray[1],
    b: RGBAsNumericalArray[2],
  };
};

export const returnColoredText = (
  text: string,
  colorCode: ColorCodes | RGBColors,
  options?: Options
) => {
  if (typeof colorCode === 'object') {
    return options?.bolded
      ? chalk.rgb(colorCode.r, colorCode.g, colorCode.b).bold(text)
      : chalk.rgb(colorCode.r, colorCode.g, colorCode.b)(text);
  }
  if (colorCode === 'rainbow') {
    return returnInRainbow(text, { bolded: options?.bolded });
  }
  if (colorCode === 'randomrainbow') {
    return returnInRainbow(text, { bolded: options?.bolded, random: true });
  }
  return options?.bolded
    ? getColoringFunc(colorCode).bold(text)
    : getColoringFunc(colorCode)(text);
};

/* 
  In order for this function to work as intended, all the arguments must have the exact same horizontal length(except last one)
*/
export const printInColumns = (...cols: string[]): void => {
  // First element is the logo, second one is the data, each of which has lines separated by \n
  // Splitting those creates a string[][] where the elements of nested arrays are lines
  const colsSplit = cols.map((element) => element.split('\n'));

  // Find the vertically longest argument
  // Length of which is going the be the iterator on how many times we have to print a line
  const verticallyLongestArg = colsSplit.reduce(
    (acc, value) => (value.length > acc ? value.length : acc),
    0
  );
  const argsNumber = cols.length;
  const mergedArgs = [] as string[];
  for (const [i] of [...new Array(verticallyLongestArg)].entries()) {
    let nextLine = '';
    for (const [i2] of [...new Array(argsNumber)].entries()) {
      if (!colsSplit[i2][i]) continue;

      nextLine += colsSplit[i2][i];
    }

    mergedArgs.push(nextLine);
  }

  console.log(mergedArgs.join('\n'));
};

export const getColoredBoxes = () => {
  return `${chalk.bgBlack('   ')}${chalk.bgRgb(
    customColorCodes.burgundy.r,
    customColorCodes.burgundy.g,
    customColorCodes.burgundy.b
  )('   ')}${chalk.bgRgb(
    customColorCodes.darkgreen.r,
    customColorCodes.darkgreen.g,
    customColorCodes.darkgreen.b
  )('   ')}${chalk.bgRgb(
    customColorCodes.darkyellow.r,
    customColorCodes.darkyellow.g,
    customColorCodes.darkyellow.b
  )('   ')}${chalk.bgRgb(
    customColorCodes.darkDeepBlue.r,
    customColorCodes.darkDeepBlue.g,
    customColorCodes.darkDeepBlue.b
  )('   ')}${chalk.bgRgb(
    customColorCodes.darkViolet.r,
    customColorCodes.darkViolet.g,
    customColorCodes.darkViolet.b
  )('   ')}${chalk.bgRgb(
    customColorCodes.darkCyan.r,
    customColorCodes.darkCyan.g,
    customColorCodes.darkCyan.b
  )('   ')}${chalk.bgRgb(
    customColorCodes.lightgrey.r,
    customColorCodes.lightgrey.g,
    customColorCodes.lightgrey.b
  )('   ')}\n${chalk.bgRgb(
    customColorCodes.darkgrey.r,
    customColorCodes.darkgrey.g,
    customColorCodes.darkgrey.b
  )('   ')}${chalk.bgRed('   ')}${chalk.bgRgb(
    customColorCodes.lightgreen.r,
    customColorCodes.lightgreen.g,
    customColorCodes.lightgreen.b
  )('   ')}${chalk.bgYellow('   ')}${chalk.bgRgb(
    customColorCodes.deepBlue.r,
    customColorCodes.deepBlue.g,
    customColorCodes.deepBlue.b
  )('   ')}${chalk.bgMagenta('   ')}${chalk.bgCyanBright('   ')}${chalk.bgWhite(
    '   '
  )}`;
};

export const handleReadFile = async (path: string): Promise<any> => {
  try {
    const file = await promises.readFile(path, 'utf-8');
    return JSON.parse(file);
  } catch (err) {
    console.error(`Error when reading file: ${err}`);
    exit();
  }
};

export const getRandomArrayElement = (arr: any[]) =>
  arr[Math.floor(Math.random() * arr.length)];
