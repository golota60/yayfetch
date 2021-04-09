import os, { type } from 'os';
import chalk from 'chalk';
import columnify from 'columnify';
import { RGBColors } from '../interfaces/general';

export const errorMessage =
  'Error - check https://www.npmjs.com/package/yayfetch or https://github.com/golota60/yayfetch for more';

export const bitstoMegabytes = (numberToConvert: number): number => numberToConvert * 9.537 * Math.pow(10, -7);

export const parseRGBStringToNumber = (rgbString: string): RGBColors => {
  const split = rgbString.split(',');
  const RGBAsNumericalArray = split.map((color: string) => {
    const colorNumber = Number(color);
    if (isNaN(colorNumber) || colorNumber < 0 || colorNumber > 255)
      throw new Error("One of the numbers wasn't provided in correct format(has to be a number between 0 and 255)");
    return colorNumber;
  });
  if (split.length !== 3)
    throw new Error(
      'Specified RGB color was provided in incorrect form. Please remember that there has to be exactly 3 colors, they need to be separated by comas and numbers must be between 0 and 255',
    );
  return { r: RGBAsNumericalArray[0], g: RGBAsNumericalArray[1], b: RGBAsNumericalArray[2] };
};

export const uptimeInMinutes = (): number => os.uptime() / 60;

export const returnInPink = (text: string): string => chalk.rgb(255, 102, 147)(text);

export const returnInOrange = (text: string): string => chalk.rgb(255, 170, 16)(text);

export const returnInGreen = (text: string): string => chalk.green(text);

export const returnInWhite = (text: string): string => chalk.white(text);

export const returnInBlack = (text: string): string => chalk.black(text);

export const returnInRed = (text: string): string => chalk.red(text);

export const returnInBlue = (text: string): string => chalk.blue(text);

export const returnInYellow = (text: string): string => chalk.rgb(255, 245, 99)(text);

export const returnColoredText = (text: string, colorCode: string | RGBColors): string => {
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
    case 'blue':
      return returnInBlue(text);
    case 'yellow':
      return returnInYellow(text);
    default:
      return returnInPink(text);
  }
};

export const printInTwoColumns = (col1: string, col2: string): void => {
  const data = [
    {
      logo: col1,
      specs: col2,
    },
  ];
  console.log(
    columnify(data, {
      preserveNewLines: true,
      config: { logo: { showHeaders: false }, specs: { showHeaders: false } },
    }),
  );
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
