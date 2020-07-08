import os from 'os';
import chalk from 'chalk';

export const errorMessage = 'Error - check https://www.npmjs.com/package/yayfetch for more';

export const bitstoMegabytes = (numberToConvert: number): number => numberToConvert * 9.537 * Math.pow(10, -7);

export const uptimeInMinutes = (): number => os.uptime() / 60;

export const returnInPink = (textToPrint: string): string => chalk.rgb(255, 102, 147)(textToPrint);

export const yayfetchASCII = `
  ████                  ████████                 ████
 ██████                ██████████              ███████
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
