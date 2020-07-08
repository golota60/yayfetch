#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = __importDefault(require("os"));
const yargs_1 = __importDefault(require("yargs"));
const chalk_1 = __importDefault(require("chalk"));
const inquirer_1 = __importDefault(require("inquirer"));
const helpers_1 = require("./helpers/helpers");
const systeminformation_1 = require("./helpers/systeminformation");
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
const getSystemInformation = () => __awaiter(void 0, void 0, void 0, function* () {
    return ({
        graphicsInfo: yield systeminformation_1.getDisplaysAndGraphicsCards(),
        memoryInfo: yield systeminformation_1.getMemoryInfo(),
        osInfo: {
            username: yield systeminformation_1.getOsInfo(),
        },
        shellInfo: yield systeminformation_1.getShellInfo(),
    });
});
function displayData() {
    return __awaiter(this, void 0, void 0, function* () {
        const allData = yield getSystemInformation();
        allData
            ? console.log(` ${helpers_1.printInOrange(allData.osInfo.username + '@' + os_1.default.platform())} \n -----------------------------\n`, `${helpers_1.printInOrange(`Platform:`)} ${os_1.default.platform().toLocaleUpperCase()}\n`, `${helpers_1.printInOrange(`Type:`)} ${os_1.default.type()}\n`, `${helpers_1.printInOrange(`Release:`)} ${os_1.default.release()}\n`, `${helpers_1.printInOrange(`Architecture:`)} ${os_1.default.arch()}\n`, `${helpers_1.printInOrange(`Uptime:`)} ${helpers_1.uptimeInMinutes().toFixed(0)} min\n`, `${helpers_1.printInOrange(`CPU:`)} ${os_1.default.cpus()[0].model}\n`, //supports only one cpu
            `${helpers_1.printInOrange(`GPU(s):`)} ${allData.graphicsInfo.gpuInfo}\n`, `${helpers_1.printInOrange(`Display(s):`)} ${allData.graphicsInfo.displays}\n`, `${helpers_1.printInOrange(`Endianness:`)} ${systeminformation_1.getEndianness()}\n`, `${helpers_1.printInOrange(`Memory:`)} ${allData.memoryInfo.free}/${allData.memoryInfo.used}/${allData.memoryInfo.total} MiB (Free/Used/Total)\n`, `${helpers_1.printInOrange(`Shell:`)} ${allData.shellInfo}`)
            : null;
    });
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const args = yargs_1.default
    .command('$0', '', () => __awaiter(void 0, void 0, void 0, function* () {
    if (yargs_1.default.argv.p || yargs_1.default.argv.pick) {
        const inquirerPrompt = yield inquirer_1.default.prompt([promptQuestions]);
        const allData = yield getSystemInformation();
        console.log(` ${chalk_1.default.blue(allData.osInfo.username + '@' + os_1.default.platform())} \n -----------------------------`);
        if (inquirerPrompt.displayedValues.includes('Platform')) {
            console.log(`Platform: ${os_1.default.platform().toLocaleUpperCase()}`);
        }
        if (inquirerPrompt.displayedValues.includes('Type')) {
            console.log(`Type: ${os_1.default.type()}`);
        }
        if (inquirerPrompt.displayedValues.includes('Release')) {
            console.log(`Release: ${os_1.default.release()}`);
        }
        if (inquirerPrompt.displayedValues.includes('Architecture')) {
            console.log(`Architecture: ${os_1.default.arch()}`);
        }
        if (inquirerPrompt.displayedValues.includes('Uptime')) {
            console.log(`Uptime: ${helpers_1.uptimeInMinutes().toFixed(0)} min`);
        }
        if (inquirerPrompt.displayedValues.includes('CPUs')) {
            console.log(`CPU: ${os_1.default.cpus()[0].model}`);
        }
        if (inquirerPrompt.displayedValues.includes('GPUs')) {
            console.log(`GPU(s): ${allData.graphicsInfo.gpuInfo}`);
        }
        if (inquirerPrompt.displayedValues.includes('Displays')) {
            console.log(`Display(s): ${allData.graphicsInfo.displays}`);
        }
        if (inquirerPrompt.displayedValues.includes('Endianness')) {
            console.log(`Endianness: ${systeminformation_1.getEndianness()}`);
        }
        if (inquirerPrompt.displayedValues.includes('Memory')) {
            console.log(`Memory: ${allData.memoryInfo.free}/${allData.memoryInfo.used}/${allData.memoryInfo.total} MiB (Free/Used/Total)`);
        }
        if (inquirerPrompt.displayedValues.includes('Shell')) {
            console.log(`Shell: ${allData.shellInfo}`);
        }
    }
    else {
        displayData();
    }
}))
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
