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
  /* eslint-disable-next-line no-mixed-operators */
  numberToConvert * 9.537 * 10 ** -7;

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

export const returnInPink = (text: string, bolded = false): string =>
  bolded ? chalk.rgb(255, 102, 147).bold(text) : chalk.rgb(255, 102, 147)(text);

export const returnInOrange = (text: string, bolded = false): string =>
  bolded ? chalk.rgb(255, 170, 16).bold(text) : chalk.rgb(255, 170, 16)(text);

export const returnInGreen = (text: string, bolded = false): string =>
  bolded ? chalk.green.bold(text) : chalk.green(text);

export const returnInWhite = (text: string, bolded = false): string =>
  bolded ? chalk.white.bold(text) : chalk.white(text);

export const returnInBlack = (text: string, bolded = false): string =>
  bolded ? chalk.black.bold(text) : chalk.black(text);

export const returnInRed = (text: string, bolded = false): string =>
  bolded ? chalk.red.bold(text) : chalk.red(text);

export const returnInBlue = (text: string, bolded = false): string =>
  bolded ? chalk.blue.bold(text) : chalk.blue(text);

export const returnInYellow = (text: string, bolded = false): string =>
  bolded ? chalk.rgb(255, 245, 99).bold(text) : chalk.rgb(255, 245, 99)(text);

export const returnInViolet = (text: string, bolded = false): string =>
  bolded ? chalk.rgb(186, 13, 255).bold(text) : chalk.rgb(186, 13, 255)(text);

export const returnInRainbow = (text: string, bolded = false): string => {
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
      return functionArray[i % functionArray.length](char, bolded);
    })
    .join('');
  return coloredText;
};

export const returnColoredText = (
  text: string,
  colorCode: PredefinedColors | RGBColors,
  bolded = false
): string => {
  if (typeof colorCode === 'object') {
    return chalk.rgb(colorCode.r, colorCode.g, colorCode.b)(text);
  }

  switch (colorCode) {
    case 'pink':
      return returnInPink(text, bolded);
    case 'orange':
      return returnInOrange(text, bolded);
    case 'blue':
      return returnInBlue(text, bolded);
    case 'green':
      return returnInGreen(text, bolded);
    case 'white':
      return returnInWhite(text, bolded);
    case 'black':
      return returnInBlack(text, bolded);
    case 'red':
      return returnInRed(text, bolded);
    case 'yellow':
      return returnInYellow(text, bolded);
    case 'violet':
      return returnInViolet(text, bolded);
    case 'rainbow':
      return returnInRainbow(text, bolded);
    default:
      return returnInPink(text, bolded);
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

export const yayfetchASCII = `-/-\`            \`-//-\`            \`-/- 
-////\`          .//////.          \`////-
\`/////\`       \`:////////:\`       \`/////\`      
 \`/////\`     ./////:://///.     \`/////\` 
  \`/////\`   -/////.  ./////-   \`/////\`  
   ./////--://///-    -/////:-://///.   
    ./////////////====:////////////.    
     ./////////:=======://///////.     
      .///////:\`        \`:///////.      
       .//////\`           ://///.       
        ./////\`          \`/////.        
         .////:\`        \`:////.         
          .////:\`      \`:////.          
           .////:\`     :////.           
            .////:    :////.            
             -////.  .////.             
              .:/.    .:\\.`;
