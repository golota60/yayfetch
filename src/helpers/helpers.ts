import os from 'os';
import chalk from 'chalk';
import columnify from 'columnify';

export const errorMessage = 'Error - check https://www.npmjs.com/package/yayfetch for more';

export const bitstoMegabytes = (numberToConvert: number): number => numberToConvert * 9.537 * Math.pow(10, -7);

export const uptimeInMinutes = (): number => os.uptime() / 60;

export const returnInPink = (textToPrint: string): string => chalk.rgb(255, 102, 147)(textToPrint);

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
}

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
