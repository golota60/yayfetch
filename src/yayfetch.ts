#!/usr/bin/env node

import os from 'os';
import yargs from 'yargs';
import inquirer from 'inquirer';
import {Systeminformation} from 'systeminformation';
import {
  DisplayAndGraphicsCard,
  MemoryInfoInterface,
  OSInfoInterface
} from './interfaces/systeminformation';
import {
  uptimeInMinutes,
  yayfetchASCII,
  returnColoredText,
  parseRGBStringToNumber,
  printData,
  availableColors,
  PredefinedColors,
  getColoredBoxes
} from './helpers/helpers';
import {
  getEndianness,
  getDisplaysAndGraphicsCards,
  getMemoryInfo,
  getOsInfo,
  getShellInfo,
  getSysInfOsInfo,
  getHWInfo
} from './helpers/systeminformation';
import {RGBColors} from './interfaces/general';

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
  'Shell'
];

const promptQuestions = {
  type: 'checkbox',
  name: 'displayedValues',
  message: 'What information do you need?',
  choices: promptQuestionsChoices
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
    username: await getOsInfo()
  },
  shellInfo: await getShellInfo()
});

async function returnPickedData(
  valuesToDisplay: string[],
  color: PredefinedColors | RGBColors
): Promise<string[]> {
  const allData: SystemInformation = await getSystemInformation();
  const sysinfOsInfo = (await getSysInfOsInfo()) ?? ({} as OSInfoInterface);
  const hwInfo = (await getHWInfo()) ?? ({} as Systeminformation.SystemData);
  const pickedVals = [
    `${returnColoredText(
      `${allData.osInfo.username}@${sysinfOsInfo.hostname}`,
      color,
      true
    )} \n -----------------------------`
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
    pickedVals.push(
      `${returnColoredText('Model:', color, true)} ${hwInfo.model}`
    );
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

/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-implicit-any-catch */
const _args = yargs
  .command('$0', '', async () => {
    try {
      if (yargs.argv.color && yargs.argv.rgb) {
        throw new Error(
          '--rgb and --color are mutually exclusive - please specify only one'
        );
      }

      const predefinedColor = String(yargs.argv.c || yargs.argv.color);
      const customColors = yargs.argv.rgb ?
        parseRGBStringToNumber(String(yargs.argv.rgb)) :
        false;
      const colorToUse = customColors || predefinedColor;
      const hideLogoFlag = Boolean(yargs.argv['hide-logo']);
      const coloredBoxes = Boolean(yargs.argv['colored-boxes']);
      const customLines = yargs.argv['custom-lines'] as string[];

      let infoToPrint: string[];
      if (yargs.argv.p || yargs.argv.pick) {
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

      if (customLines) {
        const customLinesParsed = customLines.map(line =>
          JSON.parse(line)
        ) as Array<{
          key: string;
          value: string;
        }>;
        infoToPrint = [
          ...infoToPrint,
          ...customLinesParsed.map(customLine => {
            return `${returnColoredText(customLine.key, colorToUse, true)} ${
              customLine.value
            }`;
          })
        ];
      }

      if (coloredBoxes) {
        /* Empty string to ensure space between boxes */
        infoToPrint = [...infoToPrint, '', getColoredBoxes()];
      }

      printData(
        {
          logo: returnColoredText(yayfetchASCII, colorToUse),
          data: infoToPrint.join('\n')
        },
        hideLogoFlag
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
    default: false
  })
  .option('c', {
    alias: 'color',
    describe: 'Color in which the data will be printed',
    choices: availableColors,
    type: 'string'
  })
  .option('hide-logo', {
    describe: 'Hides the ASCII logo',
    type: 'boolean',
    default: false
  })
  .option('rgb', {
    describe: 'Same as color, but you provide r,g,b values ex. 128,5,67',
    type: 'string'
  })
  .option('custom-lines', {
    describe: 'Array of lines you want to add(objects with key, value pairs)',
    type: 'array'
  })
  .option('colored-boxes', {
    describe: 'Hides colored boxes underneath the information',
    type: 'boolean',
    default: true
  })
  .help()
  .version()
  .alias('help', 'h')
  .example('npx yayfetch', 'Returns information about your system').argv;
/* eslint-enable @typescript-eslint/no-unused-vars, @typescript-eslint/no-implicit-any-catch */
