#!/usr/bin/env node

import { DisplayAndGraphicsCard, MemoryInfoInterface } from './interfaces/systeminformation';

import os from 'os';
import yargs from 'yargs';
import chalk from 'chalk';
import inquirer from 'inquirer';
import {
  uptimeInMinutes,
  returnInPink,
  yayfetchASCII,
  printInTwoColumns,
  returnColoredText,
  parseRGBStringToNumber,
} from './helpers/helpers';
import {
  getEndianness,
  getDisplaysAndGraphicsCards,
  getMemoryInfo,
  getOsInfo,
  getShellInfo,
} from './helpers/systeminformation';
import { RGBColors } from './interfaces/general';

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
    'Shell',
  ],
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

const allData = async (color: string | RGBColors): Promise<string> => {
  const allData: SystemInformation = await getSystemInformation();
  return ` ${returnColoredText(allData.osInfo.username + '@' + os.platform(), color)} \n -----------------------------\n
  ${returnColoredText(`Platform:`, color)} ${os.platform().toLocaleUpperCase()}\n
  ${returnColoredText(`Type:`, color)} ${os.type()}\n
  ${returnColoredText(`Release:`, color)} ${os.release()}\n
  ${returnColoredText(`Architecture:`, color)} ${os.arch()}\n
  ${returnColoredText(`Uptime:`, color)} ${uptimeInMinutes().toFixed(0)} min\n
  ${returnColoredText(`CPU:`, color)} ${os.cpus()[0].model}\n
  ${returnColoredText(`GPU(s):`, color)} ${allData.graphicsInfo.gpuInfo}\n
  ${returnColoredText(`Display(s):`, color)} ${allData.graphicsInfo.displays}\n
  ${returnColoredText(`Endianness:`, color)} ${getEndianness()}\n
  ${returnColoredText(`Memory:`, color)} ${allData.memoryInfo.free}/${allData.memoryInfo.used}/${
    allData.memoryInfo.total
  } MiB (Free/Used/Total)\n
  ${returnColoredText(`Shell:`, color)} ${allData.shellInfo}`;
};

async function returnPickedData(valuesToDisplay: Array<string>, color: string | RGBColors): Promise<string> {
  const allData: SystemInformation = await getSystemInformation();
  const pickedVals = [
    `${returnColoredText(allData.osInfo.username + '@' + os.platform(), color)} \n -----------------------------`,
  ];
  valuesToDisplay.includes('Platform') &&
    pickedVals.push(`${returnColoredText('Platform:', color)} ${os.platform().toLocaleUpperCase()}`);
  valuesToDisplay.includes('Type') && pickedVals.push(`${returnColoredText('Type:', color)} ${os.type()}`);
  valuesToDisplay.includes('Release') && pickedVals.push(`${returnColoredText('Release:', color)} ${os.release()}`);
  valuesToDisplay.includes('Architecture') &&
    pickedVals.push(`${returnColoredText('Architecture:', color)} ${os.arch()}`);
  valuesToDisplay.includes('Uptime') &&
    pickedVals.push(`${returnColoredText('Uptime:', color)} ${uptimeInMinutes().toFixed(0)} min`);
  valuesToDisplay.includes('CPUs') && pickedVals.push(`${returnColoredText('CPU:', color)} ${os.cpus()[0].model}`);
  valuesToDisplay.includes('GPUs') &&
    pickedVals.push(`${returnColoredText('GPU(s):', color)} ${allData.graphicsInfo.gpuInfo}`);
  valuesToDisplay.includes('Displays') &&
    pickedVals.push(`${returnColoredText('Display(s):', color)} ${allData.graphicsInfo.displays}`);
  valuesToDisplay.includes('Endianness') &&
    pickedVals.push(`${returnColoredText('Endianness:', color)} ${getEndianness()}`);
  valuesToDisplay.includes('Memory') &&
    pickedVals.push(
      `${returnColoredText('Memory:', color)} ${allData.memoryInfo.free}/${allData.memoryInfo.used}/${
        allData.memoryInfo.total
      } MiB (Free/Used/Total)`,
    );
  valuesToDisplay.includes('Shell') && pickedVals.push(`${returnColoredText('Shell:', color)} ${allData.shellInfo}`);
  return pickedVals.join('\n\n');
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const args = yargs
  .command('$0', '', async () => {
    const predefinedColor = String(yargs.argv.c || yargs.argv.color);
    const customColors = yargs.argv.rgb ? parseRGBStringToNumber(String(yargs.argv.rgb)) : false;
    const colorToUse = customColors || predefinedColor;
    if (yargs.argv.p || yargs.argv.pick) {
      const inquirerPrompt = await inquirer.prompt<{ displayedValues: Array<string> }>([promptQuestions]);
      const pickedData = await returnPickedData(inquirerPrompt.displayedValues, colorToUse);
      printInTwoColumns(returnColoredText(yayfetchASCII, colorToUse), pickedData);
    } else {
      printInTwoColumns(returnColoredText(yayfetchASCII, colorToUse), await allData(colorToUse));
    }
  })
  .scriptName('')
  .usage('Usage: npx yayfetch')
  .option('p', {
    alias: 'pick',
    describe: 'Asks you which information you want displayed',
  })
  .option('c', {
    alias: 'color',
    describe: 'Color in which the data will be printed',
    default: 'pink',
    choices: ['pink', 'orange', 'green', 'white', 'black', 'red', 'blue', 'yellow'],
    type: 'string',
  })
  .option('rgb', {
    describe: 'Same as color, but you provide r,g,b values ex. 128,5,67',
    type: 'string',
    conflicts: ['color'],
  })
  .help()
  .version()
  .alias('help', 'h')
  .example('npx yayfetch', 'Returns information about your system').argv;
