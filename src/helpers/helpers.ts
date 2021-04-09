import os from 'os';
import chalk from 'chalk';
import columnify from 'columnify';

export const errorMessage =
  'Error - check https://www.npmjs.com/package/yayfetch or https://github.com/golota60/yayfetch for more';

export const bitstoMegabytes = (numberToConvert: number): number => numberToConvert * 9.537 * Math.pow(10, -7);

export const uptimeInMinutes = (): number => os.uptime() / 60;

export const returnInPink = (text: string): string => chalk.rgb(255, 102, 147)(text);

export const returnInOrange = (text: string): string => chalk.rgb(255, 170, 16)(text);

export const returnInGreen = (text: string): string => chalk.green(text);

export const returnInWhite = (text: string): string => chalk.white(text);

export const returnInBlack = (text: string): string => chalk.black(text);

export const returnInRed = (text: string): string => chalk.red(text);

export const returnInBlue = (text: string): string => chalk.blue(text);

export const returnInYellow = (text: string): string => chalk.rgb(255, 245, 99)(text);

export const returnPredefinedColoredText = (text: string, colorCode: string): string => {
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
