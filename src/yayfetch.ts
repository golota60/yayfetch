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
  returnPredefinedColoredText,
} from './helpers/helpers';
import {
  getEndianness,
  getDisplaysAndGraphicsCards,
  getMemoryInfo,
  getOsInfo,
  getShellInfo,
} from './helpers/systeminformation';

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

const allData = async (color: string): Promise<string> => {
  const allData: SystemInformation = await getSystemInformation();
  return ` ${returnPredefinedColoredText(
    allData.osInfo.username + '@' + os.platform(),
    color,
  )} \n -----------------------------\n
  ${returnPredefinedColoredText(`Platform:`, color)} ${os.platform().toLocaleUpperCase()}\n
  ${returnPredefinedColoredText(`Type:`, color)} ${os.type()}\n
  ${returnPredefinedColoredText(`Release:`, color)} ${os.release()}\n
  ${returnPredefinedColoredText(`Architecture:`, color)} ${os.arch()}\n
  ${returnPredefinedColoredText(`Uptime:`, color)} ${uptimeInMinutes().toFixed(0)} min\n
  ${returnPredefinedColoredText(`CPU:`, color)} ${os.cpus()[0].model}\n
  ${returnPredefinedColoredText(`GPU(s):`, color)} ${allData.graphicsInfo.gpuInfo}\n
  ${returnPredefinedColoredText(`Display(s):`, color)} ${allData.graphicsInfo.displays}\n
  ${returnPredefinedColoredText(`Endianness:`, color)} ${getEndianness()}\n
  ${returnPredefinedColoredText(`Memory:`, color)} ${allData.memoryInfo.free}/${allData.memoryInfo.used}/${
    allData.memoryInfo.total
  } MiB (Free/Used/Total)\n
  ${returnPredefinedColoredText(`Shell:`, color)} ${allData.shellInfo}`;
};

async function returnPickedData(valuesToDisplay: Array<string>, color: string): Promise<string> {
  const allData: SystemInformation = await getSystemInformation();
  const pickedVals = [
    `${returnPredefinedColoredText(
      allData.osInfo.username + '@' + os.platform(),
      color,
    )} \n -----------------------------`,
  ];
  valuesToDisplay.includes('Platform') &&
    pickedVals.push(`${returnPredefinedColoredText('Platform:', color)} ${os.platform().toLocaleUpperCase()}`);
  valuesToDisplay.includes('Type') && pickedVals.push(`${returnPredefinedColoredText('Type:', color)} ${os.type()}`);
  valuesToDisplay.includes('Release') &&
    pickedVals.push(`${returnPredefinedColoredText('Release:', color)} ${os.release()}`);
  valuesToDisplay.includes('Architecture') &&
    pickedVals.push(`${returnPredefinedColoredText('Architecture:', color)} ${os.arch()}`);
  valuesToDisplay.includes('Uptime') &&
    pickedVals.push(`${returnPredefinedColoredText('Uptime:', color)} ${uptimeInMinutes().toFixed(0)} min`);
  valuesToDisplay.includes('CPUs') &&
    pickedVals.push(`${returnPredefinedColoredText('CPU:', color)} ${os.cpus()[0].model}`);
  valuesToDisplay.includes('GPUs') &&
    pickedVals.push(`${returnPredefinedColoredText('GPU(s):', color)} ${allData.graphicsInfo.gpuInfo}`);
  valuesToDisplay.includes('Displays') &&
    pickedVals.push(`${returnPredefinedColoredText('Display(s):', color)} ${allData.graphicsInfo.displays}`);
  valuesToDisplay.includes('Endianness') &&
    pickedVals.push(`${returnPredefinedColoredText('Endianness:', color)} ${getEndianness()}`);
  valuesToDisplay.includes('Memory') &&
    pickedVals.push(
      `${returnPredefinedColoredText('Memory:', color)} ${allData.memoryInfo.free}/${allData.memoryInfo.used}/${
        allData.memoryInfo.total
      } MiB (Free/Used/Total)`,
    );
  valuesToDisplay.includes('Shell') &&
    pickedVals.push(`${returnPredefinedColoredText('Shell:', color)} ${allData.shellInfo}`);
  return pickedVals.join('\n\n');
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const args = yargs
  .command('$0', '', async () => {
    const customColor = String(yargs.argv.c || yargs.argv.color);
    if (yargs.argv.p || yargs.argv.pick) {
      const inquirerPrompt = await inquirer.prompt<{ displayedValues: Array<string> }>([promptQuestions]);
      const pickedData = await returnPickedData(inquirerPrompt.displayedValues, customColor);
      printInTwoColumns(returnPredefinedColoredText(yayfetchASCII, customColor), pickedData);
    } else {
      printInTwoColumns(returnPredefinedColoredText(yayfetchASCII, customColor), await allData(customColor));
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
  })
  .help()
  .version()
  .alias('help', 'h')
  .example('npx yayfetch', 'Returns information about your system').argv;
