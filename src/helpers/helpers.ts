import os from 'os';
import { promises } from 'fs';
import { exit } from 'process';
import chalk from 'chalk';
import { RGBColors } from '../interfaces/general';

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
  'rainbow',
];

export type PredefinedColors = typeof availableColors[number];

export const bitstoMegabytes = (numberToConvert: number): number =>
  numberToConvert * 9.537 * 10 ** -7;

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

const customColorCodes = {
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

export const uptimeInMinutes = (): number => os.uptime() / 60;

export const returnInPink = (text: string, bolded = false): string =>
  bolded
    ? chalk
        .rgb(
          customColorCodes.pink.r,
          customColorCodes.pink.g,
          customColorCodes.pink.b
        )
        .bold(text)
    : chalk.rgb(
        customColorCodes.pink.r,
        customColorCodes.pink.g,
        customColorCodes.pink.b
      )(text);

export const returnInOrange = (text: string, bolded = false): string =>
  bolded
    ? chalk
        .rgb(
          customColorCodes.orange.r,
          customColorCodes.orange.g,
          customColorCodes.orange.b
        )
        .bold(text)
    : chalk.rgb(
        customColorCodes.orange.r,
        customColorCodes.orange.g,
        customColorCodes.orange.b
      )(text);

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
  bolded
    ? chalk
        .rgb(
          customColorCodes.yellow.r,
          customColorCodes.yellow.g,
          customColorCodes.yellow.b
        )
        .bold(text)
    : chalk.rgb(
        customColorCodes.yellow.r,
        customColorCodes.yellow.g,
        customColorCodes.yellow.b
      )(text);

export const returnInViolet = (text: string, bolded = false): string =>
  bolded
    ? chalk
        .rgb(
          customColorCodes.violet.r,
          customColorCodes.violet.g,
          customColorCodes.violet.b
        )
        .bold(text)
    : chalk.rgb(
        customColorCodes.violet.r,
        customColorCodes.violet.g,
        customColorCodes.violet.b
      )(text);

export const returnInRainbow = (text: string, bolded = false): string => {
  const functionArray = [
    returnInRed,
    returnInOrange,
    returnInYellow,
    returnInGreen,
    returnInBlue,
    returnInViolet,
    returnInPink,
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

  // TODO: Improve the algorithm so that it auto adjusts the amount of spaces in every row
  console.log(mergedArgs.join('\n'));
};

export const printData = (
  { logo, data }: { logo: string; data: string },
  showLogo = true
): void => {
  if (!showLogo) {
    console.log(data);
  } else {
    printInColumns(logo, data);
  }
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

export const yayfetchASCII = `-/-\`             \`-//-\`            \`-/-   
-////\`          .//////.          \`////- 
\`/////\`       \`:////////:\`       \`/////\`  
 \`/////\`     ./////:://///.     \`/////\`   
  \`/////\`   -/////.  ./////-   \`/////\`    
   ./////--://///-    -/////:-://///.     
    ./////////////====:////////////.      
     ./////////:=======://////////.       
      .///////:\`        \`:///////.        
       .//////\`           ://///.         
        ./////\`          \`/////.          
         .////:\`        \`:////.           
          .////:\`      \`:////.            
           .////:\`     :////.             
            .////:    :////.              
             -////.  .////.               
              .:/.    .:\\.                `;

export const handleReadFile = async (path: string): Promise<any> => {
  try {
    const file = await promises.readFile(path, 'utf-8');
    return JSON.parse(file);
  } catch (err) {
    console.error(`Error when reading file: ${err}`);
    exit();
  }
};
