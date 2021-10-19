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
  yayfetchASCII,
  returnColoredText,
  parseRGBStringToNumber,
  printData,
  availableColors,
  PredefinedColors,
  getColoredBoxes,
  handleReadFile,
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
  color: PredefinedColors | RGBColors
): Promise<string[]> {
  const allData: SystemInformation = await getSystemInformation();
  const sysinfOsInfo = await getSysInfOsInfo();
  const hwInfo = await getHWInfo();
  const pickedVals = [
    `${returnColoredText(
      `${allData.osInfo.username}@${sysinfOsInfo.hostname}`,
      color,
      true
    )} \n -----------------------------`,
  ];
  if (valuesToDisplay.includes('OS')) {
    pickedVals.push(
      `${returnColoredText('OS:', color, true)} ${sysinfOsInfo.display}`
    );
  }

  if (valuesToDisplay.includes('Type')) {
    pickedVals.push(
      `${returnColoredText('Type:', color, true)} ${sysinfOsInfo.distro}`
    );
  }

  if (valuesToDisplay.includes('Model')) {
    pickedVals.push(`${returnColoredText('Model:', color, true)} ${hwInfo}`);
  }

  if (valuesToDisplay.includes('Release')) {
    pickedVals.push(
      `${returnColoredText('Release:', color, true)} ${os.release()}`
    );
  }

  if (valuesToDisplay.includes('Architecture')) {
    pickedVals.push(
      `${returnColoredText('Architecture:', color, true)} ${os.arch()}`
    );
  }

  if (valuesToDisplay.includes('Uptime')) {
    pickedVals.push(
      `${returnColoredText('Uptime:', color, true)} ${uptimeInMinutes().toFixed(
        0
      )} min`
    );
  }

  if (valuesToDisplay.includes('CPUs')) {
    pickedVals.push(
      `${returnColoredText('CPU:', color, true)} ${os.cpus()[0].model}`
    );
  }

  if (valuesToDisplay.includes('GPUs')) {
    pickedVals.push(
      `${returnColoredText('GPU(s):', color, true)} ${
        allData.graphicsInfo.gpuInfo
      }`
    );
  }

  if (valuesToDisplay.includes('Displays')) {
    pickedVals.push(
      `${returnColoredText('Display(s):', color, true)} ${
        allData.graphicsInfo.displays
      }`
    );
  }

  if (valuesToDisplay.includes('Endianness')) {
    pickedVals.push(
      `${returnColoredText('Endianness:', color, true)} ${getEndianness()}`
    );
  }

  if (valuesToDisplay.includes('Memory')) {
    pickedVals.push(
      `${returnColoredText('Memory:', color, true)} ${
        allData.memoryInfo.free
      }/${allData.memoryInfo.used}/${
        allData.memoryInfo.total
      } MiB (Free/Used/Total)`
    );
  }

  if (valuesToDisplay.includes('Shell')) {
    pickedVals.push(
      `${returnColoredText('Shell:', color, true)} ${allData.shellInfo}`
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
        configFile = (await handleReadFile(configFilePath)) || [];
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

      const colorToUse = customColors || predefinedColor;
      const showLogo = Boolean(enhancedArgv['logo']);
      const coloredBoxes = Boolean(enhancedArgv['colored-boxes']);
      const customLines: string | object = enhancedArgv['custom-lines'];

      /* Get device data */
      let infoToPrint: string[];
      if (enhancedArgv.p || enhancedArgv.pick) {
        const inquirerPrompt = await inquirer.prompt<{
          displayedValues: string[];
        }>([promptQuestions]);
        infoToPrint = await returnPickedData(
          inquirerPrompt.displayedValues,
          colorToUse
        );
      } else {
        infoToPrint = await returnPickedData(
          promptQuestionsChoices,
          colorToUse
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
            return `${returnColoredText(customLine[0], colorToUse, true)} ${
              customLine[1]
            }`;
          }),
        ];
      }

      if (coloredBoxes) {
        /* Empty string to ensure space between boxes */
        infoToPrint = [...infoToPrint, '', getColoredBoxes()];
      }

      printData(
        {
          logo: returnColoredText(yayfetchASCII, colorToUse),
          data: infoToPrint.join('\n'),
        },
        showLogo
      );
    } catch (error) {
      console.error(`‼️  ${error} ‼️`);
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
    choices: availableColors,
    type: 'string',
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
