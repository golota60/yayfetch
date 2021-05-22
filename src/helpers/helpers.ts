import os from 'os';
import chalk from 'chalk';
import columnify from 'columnify';
import {RGBColors} from '../interfaces/general';

export const errorMessage =
  'Error - check https://www.npmjs.com/package/yayfetch or https://github.com/golota60/yayfetch for more';

export const availableColors = [
  'pink',
  'orange',
  'green',
  'white',
  'black',
  'red',
  'blue',
  'yellow',
  'violet',
  'rainbow'
];

export type PredefinedColors = typeof availableColors[number];

export const bitstoMegabytes = (numberToConvert: number): number =>
  numberToConvert * 9.537 * 10 * -7;

export const parseRGBStringToNumber = (rgbString: string): RGBColors => {
  const split = rgbString.split(',');
  const RGBAsNumericalArray = split.map((color: string) => {
    const colorNumber = Number(color);
    if (Number.isNaN(colorNumber) || colorNumber < 0 || colorNumber > 255) {
      throw new Error(
        'One of the numbers wasn\'t provided in correct format(has to be a number between 0 and 255)'
      );
    }

    return colorNumber;
  });
  if (split.length !== 3) {
    throw new Error(
      'Specified RGB color was provided in incorrect form. Please remember that there has to be exactly 3 colors, they need to be separated by comas and numbers must be between 0 and 255'
    );
  }

  return {
    r: RGBAsNumericalArray[0],
    g: RGBAsNumericalArray[1],
    b: RGBAsNumericalArray[2]
  };
};

export const uptimeInMinutes = (): number => os.uptime() / 60;

export const returnInPink = (text: string): string =>
  chalk.rgb(255, 102, 147)(text);

export const returnInOrange = (text: string): string =>
  chalk.rgb(255, 170, 16)(text);

export const returnInGreen = (text: string): string => chalk.green(text);

export const returnInWhite = (text: string): string => chalk.white(text);

export const returnInBlack = (text: string): string => chalk.black(text);

export const returnInRed = (text: string): string => chalk.red(text);

export const returnInBlue = (text: string): string => chalk.blue(text);

export const returnInYellow = (text: string): string =>
  chalk.rgb(255, 245, 99)(text);

export const returnInViolet = (text: string): string =>
  chalk.rgb(186, 13, 255)(text);

export const returnInRainbow = (text: string): string => {
  const functionArray = [
    returnInRed,
    returnInOrange,
    returnInYellow,
    returnInGreen,
    returnInBlue,
    returnInViolet,
    returnInPink
  ];
  const coloredText = text
    .split('')
    .map((char, i) => {
      return functionArray[i % functionArray.length](char);
    })
    .join('');
  return coloredText;
};

export const returnColoredText = (
  text: string,
  colorCode: PredefinedColors | RGBColors
): string => {
  if (typeof colorCode === 'object') {
    return chalk.rgb(colorCode.r, colorCode.g, colorCode.b)(text);
  }

  switch (colorCode) {
    case 'pink':
      return returnInPink(text);
    case 'orange':
      return returnInOrange(text);
    case 'blue':
      return returnInBlue(text);
    case 'green':
      return returnInGreen(text);
    case 'white':
      return returnInWhite(text);
    case 'black':
      return returnInBlack(text);
    case 'red':
      return returnInRed(text);
    case 'yellow':
      return returnInYellow(text);
    case 'violet':
      return returnInViolet(text);
    case 'rainbow':
      return returnInRainbow(text);
    default:
      return returnInPink(text);
  }
};

export const printInTwoColumns = (col1: string, col2: string): void => {
  const data = [
    {
      logo: col1,
      specs: col2
    }
  ];
  console.log(
    columnify(data, {
      preserveNewLines: true,
      config: {logo: {showHeaders: false}, specs: {showHeaders: false}}
    })
  );
};

export const printData = (
  {logo, data}: {logo: string; data: string},
  hideLogo = false
): void => {
  if (hideLogo) {
    console.log(data);
  } else {
    printInTwoColumns(logo, data);
  }
};

export const yayfetchASCII = `
  ████                  ████████                 ████
 ███████               ██████████              ███████
  ███████             ████████████            ███████
   ███████          ███████████████          ███████
    ███████        █████████████████        ███████
     ███████     █████████▒ ▒█████████     ███████
      ███████████████████▒   ▒███████████████████
       █████████████████▒     ▒█████████████████
        ███████████████████████████████████████
         █████████████████████████████████████
          ██████████▒             ▒██████████
           ████████▒               ▒████████
            ███████▒               ▒███████
             ███████▒             ▒███████
              ███████▒           ▒███████
               ███████▒         ▒███████
                ███████▒       ▒███████
                 ███████▒     ▒███████
                  ███████▒   ▒███████
                   █████▒     ▒█████
                     ██▒       ▒██ `;
