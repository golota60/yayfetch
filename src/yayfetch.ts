#!/usr/bin/env node

import os from 'os';
import yargs from 'yargs';
import inquirer from 'inquirer';
import {
  DisplayAndGraphicsCard,
  MemoryInfoInterface,
} from './interfaces/systeminformation';
import {
  uptimeInMinutes,
  getColoredText,
  parseRGBStringToNumber,
  getColoredBoxes,
  handleReadJSON,
  printInColumns,
  normalizeASCII,
  readTextFile,
  mergeColumns,
} from './helpers/helpers';
import {
  getEndianness,
  getDisplaysAndGraphicsCards,
  getMemoryInfo,
  getOsInfo,
  getShellInfo,
  getSysInfOsInfo,
  getHWInfo,
} from './helpers/systeminformation';
import { RGBColors } from './interfaces/general';
import { yayfetchASCII } from './helpers/static';
import { allColors, ColorCodes } from './helpers/colors';
import { AnimationOptions, startAnimation } from './helpers/animations';

export const promptQuestionsChoices = [
  'OS',
  'Type',
  'Release',
  'Model',
  'Architecture',
  'Uptime',
  'CPUs',
  'GPUs',
  'Displays',
  'Endianness',
  'Memory',
  'Shell',
];

const promptQuestions = {
  type: 'checkbox',
  name: 'displayedValues',
  message: 'What information do you need?',
  choices: promptQuestionsChoices,
};

export interface SystemInformation {
  graphicsInfo: DisplayAndGraphicsCard;
  memoryInfo: MemoryInfoInterface;
  osInfo: {
    username: string;
  };
  shellInfo: string;
}

const getSystemInformation = async (): Promise<SystemInformation> => ({
  graphicsInfo: await getDisplaysAndGraphicsCards(),
  memoryInfo: await getMemoryInfo(),
  osInfo: {
    username: await getOsInfo(),
  },
  shellInfo: await getShellInfo(),
});

async function returnPickedData(
  valuesToDisplay: string[],
  color: ColorCodes | RGBColors | undefined
): Promise<string[]> {
  const allData: SystemInformation = await getSystemInformation();
  const sysinfOsInfo = await getSysInfOsInfo();
  const hwInfo = await getHWInfo();
  const pickedVals = [
    `${
      color
        ? getColoredText(
            `${allData.osInfo.username}@${sysinfOsInfo.hostname}`,
            color,
            { bolded: true }
          )
        : `${allData.osInfo.username}@${sysinfOsInfo.hostname}`
    } \n-----------------------------`,
  ];
  if (valuesToDisplay.includes('OS')) {
    pickedVals.push(
      `${color ? getColoredText('OS:', color, { bolded: true }) : 'OS:'} ${
        sysinfOsInfo.display
      }`
    );
  }

  if (valuesToDisplay.includes('Type')) {
    pickedVals.push(
      `${color ? getColoredText('Type:', color, { bolded: true }) : 'Type:'} ${
        sysinfOsInfo.distro
      }`
    );
  }

  if (valuesToDisplay.includes('Model')) {
    pickedVals.push(
      `${
        color ? getColoredText('Model:', color, { bolded: true }) : 'Model:'
      } ${hwInfo}`
    );
  }

  if (valuesToDisplay.includes('Release')) {
    pickedVals.push(
      `${
        color
          ? getColoredText('Release:', color, {
              bolded: true,
            })
          : 'Release:'
      } ${os.release()}`
    );
  }

  if (valuesToDisplay.includes('Architecture')) {
    pickedVals.push(
      `${
        color
          ? getColoredText('Architecture:', color, {
              bolded: true,
            })
          : 'Architecture'
      } ${os.arch()}`
    );
  }

  if (valuesToDisplay.includes('Uptime')) {
    pickedVals.push(
      `${
        color
          ? getColoredText('Uptime:', color, {
              bolded: true,
            })
          : 'Uptime'
      } ${uptimeInMinutes().toFixed(0)} min`
    );
  }

  if (valuesToDisplay.includes('CPUs')) {
    pickedVals.push(
      `${color ? getColoredText('CPU:', color, { bolded: true }) : 'CPU:'} ${
        os.cpus()[0].model
      }`
    );
  }

  if (valuesToDisplay.includes('GPUs')) {
    pickedVals.push(
      `${
        color ? getColoredText('GPU(s):', color, { bolded: true }) : 'GPU(s)'
      } ${allData.graphicsInfo.gpuInfo}`
    );
  }

  if (valuesToDisplay.includes('Displays')) {
    pickedVals.push(
      `${
        color
          ? getColoredText('Display(s):', color, { bolded: true })
          : 'Display(s):'
      } ${allData.graphicsInfo.displays}`
    );
  }

  if (valuesToDisplay.includes('Endianness')) {
    pickedVals.push(
      `${
        color
          ? getColoredText('Endianness:', color, {
              bolded: true,
            })
          : 'Endianness:'
      } ${getEndianness()}`
    );
  }

  if (valuesToDisplay.includes('Memory')) {
    pickedVals.push(
      `${
        color ? getColoredText('Memory:', color, { bolded: true }) : 'Memory:'
      } ${allData.memoryInfo.free}/${allData.memoryInfo.used}/${
        allData.memoryInfo.total
      } MiB (Free/Used/Total)`
    );
  }

  if (valuesToDisplay.includes('Shell')) {
    pickedVals.push(
      `${
        color ? getColoredText('Shell:', color, { bolded: true }) : 'Shell:'
      } ${allData.shellInfo}`
    );
  }

  return pickedVals;
}

yargs
  .command('$0', '', async () => {
    try {
      const configFilePath = yargs.argv['config'] as string;
      let configFile;
      if (configFilePath)
        configFile = (await handleReadJSON(configFilePath)) || [];
      const enhancedArgv = { ...yargs.argv, ...configFile };

      if (enhancedArgv.color && enhancedArgv.rgb) {
        throw new Error(
          '--rgb and --color are mutually exclusive - please specify only one'
        );
      }
      const predefinedColor = String(enhancedArgv.c || enhancedArgv.color);
      const customColors = enhancedArgv.rgb
        ? parseRGBStringToNumber(String(enhancedArgv.rgb))
        : false;

      const colorToUse = (customColors || predefinedColor) as
        | RGBColors
        | ColorCodes;

      const showLogo = Boolean(enhancedArgv['logo']);
      const coloredBoxes = Boolean(enhancedArgv['colored-boxes']);
      const customLines: string | object = enhancedArgv['custom-lines'];
      const animations: AnimationOptions = enhancedArgv['line-animations'];

      const customASCIIs: string[] = enhancedArgv['ascii'];

      let customASCIIsParsed;
      if (customASCIIs) {
        customASCIIsParsed = await Promise.all(
          customASCIIs.map(async (e) => await readTextFile(e))
        );
      }

      /* Get device data */
      let infoToPrint: string[];
      if (enhancedArgv.p || enhancedArgv.pick) {
        const inquirerPrompt = await inquirer.prompt<{
          displayedValues: string[];
        }>([promptQuestions]);
        infoToPrint = await returnPickedData(
          inquirerPrompt.displayedValues,
          animations ? undefined : colorToUse
        );
      } else {
        infoToPrint = await returnPickedData(
          promptQuestionsChoices,
          animations ? undefined : colorToUse
        );
      }

      /* Add custom lines if specified */
      if (customLines) {
        const customLinesParsed =
          typeof customLines === 'object'
            ? customLines
            : JSON.parse(customLines);
        infoToPrint = [
          ...infoToPrint,
          ...Object.entries(customLinesParsed).map((customLine) => {
            return `${
              animations
                ? customLine[0]
                : getColoredText(customLine[0], colorToUse, {
                    bolded: true,
                  })
            } ${customLine[1]}`;
          }),
        ];
      }

      if (coloredBoxes && !animations) {
        console.warn('Colored boxes will not show when using animations');
        /* Empty string to ensure space between boxes */
        infoToPrint = [...infoToPrint, '', getColoredBoxes()];
      }

      const asciis = showLogo
        ? (customASCIIsParsed || [yayfetchASCII]).map((e) =>
            normalizeASCII(e, 2)
          )
        : [];
      const joinedInfo = infoToPrint.join('\n');

      if (animations) {
        // Merge columns into one column for animations
        const mergedArgs = mergeColumns(...[...asciis, joinedInfo]).join('\n');
        startAnimation(mergedArgs, animations);
      } else {
        printInColumns(
          ...asciis.map((e) => getColoredText(e, colorToUse)),
          joinedInfo
        );
      }
    } catch (error) {
      console.error(`‼️ ${error} ‼️`);
    }
  })
  .scriptName('')
  .usage('Usage: npx yayfetch <flags>')
  .option('p', {
    alias: 'pick',
    describe: 'Asks you which information you want displayed',
    type: 'boolean',
    default: false,
  })
  .option('c', {
    alias: 'color',
    describe: 'Color in which the data will be printed',
    choices: allColors,
    type: 'string',
    default: 'pink',
  })
  .option('logo', {
    describe: 'Hides the ASCII logo',
    type: 'boolean',
    default: true,
  })
  .option('rgb', {
    describe: 'Same as color, but you provide r,g,b values ex. 128,5,67',
    type: 'string',
  })
  .option('custom-lines', {
    describe: 'String object of key-value pairs to add',
    type: 'string',
  })
  .option('colored-boxes', {
    describe: 'Hides colored boxes underneath the information',
    type: 'boolean',
    default: true,
  })
  .option('config', {
    describe: 'Specify a file path to a config file',
    type: 'string',
  })
  .help()
  .version()
  .alias('help', 'h')
  .example('npx yayfetch', 'Returns information about your system').argv;
