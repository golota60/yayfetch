import os from 'os';

export const errorMessage = 'Error - check https://www.npmjs.com/package/yayfetch for more';

export const bitstoMegabytes = (numberToConvert: number): number => numberToConvert * 9.537 * Math.pow(10, -7);

export const uptimeInMinutes = (): number => os.uptime() / 60;
