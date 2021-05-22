#!/usr/bin/env node

import os from 'os';
import yargs from 'yargs';
import inquirer from 'inquirer';
import {
  DisplayAndGraphicsCard,
  MemoryInfoInterface
} from './interfaces/systeminformation';
import {
  uptimeInMinutes,
  yayfetchASCII,
  returnColoredText,
  parseRGBStringToNumber,
  printData,
  availableColors,
  PredefinedColors
} from './helpers/helpers';
import {
  getEndianness,
  getDisplaysAndGraphicsCards,
  getMemoryInfo,
  getOsInfo,
  getShellInfo
} from './helpers/systeminformation';
import {RGBColors} from './interfaces/general';

const promptQuestions = {
  type: 'checkbox',
  name: 'displayedValues',
  message: 'What information do you need?',
  choices: [
    'Platform',
    'Type',
    'Release',
    'Architecture',
    'Uptime',
    'CPUs',
    'GPUs',
    'Displays',
    'Endianness',
    'Memory',
    'Shell'
  ]
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

const allData = async (
  color: PredefinedColors | RGBColors
): Promise<string> => {
  const allData: SystemInformation = await getSystemInformation();
  return `${returnColoredText(
    `${allData.osInfo.username}@${os.platform()}`,
    color
  )} \n -----------------------------\n
  ${returnColoredText('Platform:', color)} ${os
  .platform()
  .toLocaleUpperCase()}\n
  ${returnColoredText('Type:', color)} ${os.type()}\n
  ${returnColoredText('Release:', color)} ${os.release()}\n
  ${returnColoredText('Architecture:', color)} ${os.arch()}\n
  ${returnColoredText('Uptime:', color)} ${uptimeInMinutes().toFixed(0)} min\n
  ${returnColoredText('CPU:', color)} ${os.cpus()[0].model}\n
  ${returnColoredText('GPU(s):', color)} ${allData.graphicsInfo.gpuInfo}\n
  ${returnColoredText('Display(s):', color)} ${allData.graphicsInfo.displays}\n
  ${returnColoredText('Endianness:', color)} ${getEndianness()}\n
  ${returnColoredText('Memory:', color)} ${allData.memoryInfo.free}/${
  allData.memoryInfo.used
}/${allData.memoryInfo.total} MiB (Free/Used/Total)\n
  ${returnColoredText('Shell:', color)} ${allData.shellInfo}`;
};

async function returnPickedData(
  valuesToDisplay: string[],
  color: PredefinedColors | RGBColors
): Promise<string> {
  const allData: SystemInformation = await getSystemInformation();
  const pickedVals = [
    `${returnColoredText(
      `${allData.osInfo.username}@${os.platform()}`,
      color
    )} \n -----------------------------`
  ];
  if (valuesToDisplay.includes('Platform')) {
    pickedVals.push(
      `${returnColoredText('Platform:', color)} ${os
        .platform()
        .toLocaleUpperCase()}`
    );
  }

  if (valuesToDisplay.includes('Type')) {
    pickedVals.push(`${returnColoredText('Type:', color)} ${os.type()}`);
  }

  if (valuesToDisplay.includes('Release')) {
    pickedVals.push(`${returnColoredText('Release:', color)} ${os.release()}`);
  }

  if (valuesToDisplay.includes('Architecture')) {
    pickedVals.push(
      `${returnColoredText('Architecture:', color)} ${os.arch()}`
    );
  }

  if (valuesToDisplay.includes('Uptime')) {
    pickedVals.push(
      `${returnColoredText('Uptime:', color)} ${uptimeInMinutes().toFixed(
        0
      )} min`
    );
  }

  if (valuesToDisplay.includes('CPUs')) {
    pickedVals.push(
      `${returnColoredText('CPU:', color)} ${os.cpus()[0].model}`
    );
  }

  if (valuesToDisplay.includes('GPUs')) {
    pickedVals.push(
      `${returnColoredText('GPU(s):', color)} ${allData.graphicsInfo.gpuInfo}`
    );
  }

  if (valuesToDisplay.includes('Displays')) {
    pickedVals.push(
      `${returnColoredText('Display(s):', color)} ${
        allData.graphicsInfo.displays
      }`
    );
  }

  if (valuesToDisplay.includes('Endianness')) {
    pickedVals.push(
      `${returnColoredText('Endianness:', color)} ${getEndianness()}`
    );
  }

  if (valuesToDisplay.includes('Memory')) {
    pickedVals.push(
      `${returnColoredText('Memory:', color)} ${allData.memoryInfo.free}/${
        allData.memoryInfo.used
      }/${allData.memoryInfo.total} MiB (Free/Used/Total)`
    );
  }

  if (valuesToDisplay.includes('Shell')) {
    pickedVals.push(
      `${returnColoredText('Shell:', color)} ${allData.shellInfo}`
    );
  }

  return pickedVals.join('\n\n');
}

/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-implicit-any-catch */
const args = yargs
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

      let infoToPrint: string;
      if (yargs.argv.p || yargs.argv.pick) {
        const inquirerPrompt = await inquirer.prompt<{
          displayedValues: string[];
        }>([promptQuestions]);
        infoToPrint = await returnPickedData(
          inquirerPrompt.displayedValues,
          colorToUse
        );
      } else {
        infoToPrint = await allData(colorToUse);
      }

      printData(
        {
          logo: returnColoredText(yayfetchASCII, colorToUse),
          data: infoToPrint
        },
        hideLogoFlag
      );
    } catch (error) {
      console.error(`‼️  ${error} ‼️`);
    }
  })
  .scriptName('')
  .usage('Usage: npx yayfetch')
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
  .help()
  .version()
  .alias('help', 'h')
  .example('npx yayfetch', 'Returns information about your system').argv;
/* eslint-enable @typescript-eslint/no-unused-vars, @typescript-eslint/no-implicit-any-catch */
