#!/usr/bin/env node

import { SystemInformation } from './interfaces/systeminformation';

import os from 'os';
import yargs from 'yargs';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { uptimeInMinutes } from './helpers/helpers';
import {
  getEndianness,
  getDisplaysAndGraphicsCards,
  getMemoryInfo,
  getOsInfo,
  getShellInfo,
} from './helpers/systeminformation';

function printInOrange(textToPrint: string): string {
  return chalk.rgb(255, 117, 26)(textToPrint);
}

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

const getSystemInformation = async (): Promise<SystemInformation> => ({
  graphicsInfo: await getDisplaysAndGraphicsCards(),
  memoryInfo: await getMemoryInfo(),
  osInfo: {
    username: await getOsInfo(),
  },
  shellInfo: await getShellInfo(),
});

async function displayData(): Promise<void> {
  const allData: SystemInformation = await getSystemInformation();
  allData
    ? console.log(
        ` ${printInOrange(allData.osInfo.username + '@' + os.platform())} \n -----------------------------\n`,
        `${printInOrange(`Platform:`)} ${os.platform().toLocaleUpperCase()}\n`,
        `${printInOrange(`Type:`)} ${os.type()}\n`,
        `${printInOrange(`Release:`)} ${os.release()}\n`,
        `${printInOrange(`Architecture:`)} ${os.arch()}\n`,
        `${printInOrange(`Uptime:`)} ${uptimeInMinutes().toFixed(0)} min\n`,
        `${printInOrange(`CPU:`)} ${os.cpus()[0].model}\n`, //supports only one cpu
        `${printInOrange(`GPU(s):`)} ${allData.graphicsInfo.gpuInfo}\n`,
        `${printInOrange(`Display(s):`)} ${allData.graphicsInfo.displays}\n`,
        `${printInOrange(`Endianness:`)} ${getEndianness()}\n`,
        `${printInOrange(`Memory:`)} ${allData.memoryInfo.free}/${allData.memoryInfo.used}/${
          allData.memoryInfo.total
        } MiB (Free/Used/Total)\n`,
        `${printInOrange(`Shell:`)} ${allData.shellInfo}`,
      )
    : null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const args = yargs
  .command('$0', '', async () => {
    if (yargs.argv.p || yargs.argv.pick) {
      const inquirerPrompt = await inquirer.prompt<{ displayedValues: string }>([promptQuestions]);
      const allData: SystemInformation = await getSystemInformation();
      console.log(` ${chalk.blue(allData.osInfo.username + '@' + os.platform())} \n -----------------------------`);
      if (inquirerPrompt.displayedValues.includes('Platform')) {
        console.log(`Platform: ${os.platform().toLocaleUpperCase()}`);
      }
      if (inquirerPrompt.displayedValues.includes('Type')) {
        console.log(`Type: ${os.type()}`);
      }
      if (inquirerPrompt.displayedValues.includes('Release')) {
        console.log(`Release: ${os.release()}`);
      }
      if (inquirerPrompt.displayedValues.includes('Architecture')) {
        console.log(`Architecture: ${os.arch()}`);
      }
      if (inquirerPrompt.displayedValues.includes('Uptime')) {
        console.log(`Uptime: ${uptimeInMinutes().toFixed(0)} min`);
      }
      if (inquirerPrompt.displayedValues.includes('CPUs')) {
        console.log(`CPU: ${os.cpus()[0].model}`);
      }
      if (inquirerPrompt.displayedValues.includes('GPUs')) {
        console.log(`GPU(s): ${allData.graphicsInfo.gpuInfo}`);
      }
      if (inquirerPrompt.displayedValues.includes('Displays')) {
        console.log(`Display(s): ${allData.graphicsInfo.displays}`);
      }
      if (inquirerPrompt.displayedValues.includes('Endianness')) {
        console.log(`Endianness: ${getEndianness()}`);
      }
      if (inquirerPrompt.displayedValues.includes('Memory')) {
        console.log(
          `Memory: ${allData.memoryInfo.free}/${allData.memoryInfo.used}/${allData.memoryInfo.total} MiB (Free/Used/Total)`,
        );
      }
      if (inquirerPrompt.displayedValues.includes('Shell')) {
        console.log(`Shell: ${allData.shellInfo}`);
      }
    } else {
      displayData();
    }
  })
  .scriptName('')
  .usage('Usage: npx yayfetch')
  .option('p', {
    alias: 'pick',
    describe: 'Asks you which information you want displayed',
  })
  .help()
  .version()
  .alias('help', 'h')
  .example('npx yayfetch', 'Returns information about your system').argv;
