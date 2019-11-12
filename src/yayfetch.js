#!/usr/bin/env node
const os = require('os');
const yargs = require('yargs');
const sysinf = require('systeminformation');
const chalk = require('chalk');
const inquirer = require('inquirer');

const errorMessage = 'Error - check https://www.npmjs.com/package/yayfetch for more';
function bitstoMegabytes(numberToConvert) {
    return numberToConvert * 9.537 * Math.pow(10, -7);
}

let systemInfo = {
    graphicsInfo: {
        gpuInfo: '',
        displays: ''
    },
    memoryInfo: {
        free: '',
        used: '',
        total: '',
    },
    osInfo: {
        username: ''
    },
    shellInfo: ''
}

let promptQuestions = {
    type: 'checkbox',
    name: 'displayedValues',
    message: 'What information do you need?',
    choices: ['Platform', 'Type', 'Release', 'Architecture', 'Uptime', 'CPUs', 'GPUs', 'Displays', 'Endianness', 'Memory', 'Shell']
}

const endianness = () => {
    switch (os.endianness()) {
        case 'LE':
            return 'Little Endian'
            break;
        case 'BE':
            return 'Big Endian'
            break;
        default:
            return os.endianness();
    }
}

const uptimeInMinutes = () => {
    return os.uptime() / 60;
}

async function getSystemInformation() {
    try {
        const gpu = await sysinf.graphics();

        let displays = '';
        let graphicsCards = '';
        gpu.controllers.forEach((elem) => {
            graphicsCards += `${elem.model} `;
        })
        gpu.displays.forEach((elem) => {
            displays += `${elem.resolutionx}x${elem.resolutiony} `
        })

        systemInfo.graphicsInfo = {
            gpuInfo: graphicsCards,
            displays: displays
        }
    } catch{
        systemInfo.graphicsInfo = {
            gpuInfo: errorMessage,
            displays: errorMessage,
        }
    }

    try {
        const memory = await sysinf.mem();

        const total = memory
            ? bitstoMegabytes(memory.total)
            : null;
        const used = memory
            ? bitstoMegabytes(memory.used)
            : null;
        const free = memory
            ? bitstoMegabytes(memory.free)
            : null;

        systemInfo.memoryInfo = {
            free: free.toFixed(0),
            used: used.toFixed(0),
            total: total.toFixed(0),
        }
    } catch{
        systemInfo.memoryInfo = {
            free: errorMessage,
            used: '',
            total: ''
        }
    }

    try {
        const osInfo = await sysinf.users()

        const username = osInfo
            ? osInfo[0].user
            : null;

        systemInfo.osInfo = {
            username: username,
            shell: shell
        }
    } catch{
        systemInfo.osInfo = {
            username: errorMessage
        }
    }

    try {
        const shellInfo = await sysinf.shell()
        systemInfo.shellInfo = shellInfo;
    } catch{
        if (os.platform() === 'win32') { //windows doesn't support .shell() feature - it's an edge case
            try {
                const osInfo = await sysinf.users()
                systemInfo.shellInfo = osInfo[0].tty;
            } catch{
                systemInfo.shellInfo = errorMessage;
            }
        } else {
            systemInfo.shellInfo = errorMessage;
        }
    }

    return systemInfo;
}

const args =
    yargs
        .command('$0', '', async () => {
            if (yargs.argv.p || yargs.argv.pick) {
                const inquirerPrompt = await inquirer.prompt([promptQuestions])
                const allData = await getSystemInformation();
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
                    console.log(`Endianness: ${endianness()}`);
                }
                if (inquirerPrompt.displayedValues.includes('Memory')) {
                    console.log(`Memory: ${allData.memoryInfo.free}/${allData.memoryInfo.used}/${allData.memoryInfo.total} MiB (Free/Used/Total)`);
                }
                if (inquirerPrompt.displayedValues.includes('Shell')) {
                    console.log(`Shell: ${allData.shellInfo}`);
                }

            } else {
                async function displayData() {
                    const allData = await getSystemInformation()
                    const yayfetch = (res) => {
                        res ? console.log(
                            ` ${chalk.blue(res.osInfo.username + '@' + os.platform())} \n -----------------------------\n`,
                            `Platform: ${os.platform().toLocaleUpperCase()}\n`,
                            `Type: ${os.type()}\n`,
                            `Release: ${os.release()}\n`,
                            `Architecture: ${os.arch()}\n`,
                            `Uptime: ${uptimeInMinutes().toFixed(0)} min\n`,
                            `CPU: ${os.cpus()[0].model}\n`, //supports only one cpu
                            `GPU(s): ${res.graphicsInfo.gpuInfo}\n`, //support only one GPU and display
                            `Display(s): ${res.graphicsInfo.displays}\n`,
                            `Endianness: ${endianness()}\n`,
                            `Memory: ${res.memoryInfo.free}/${res.memoryInfo.used}/${res.memoryInfo.total} MiB (Free/Used/Total)\n`,
                            `Shell: ${res.shellInfo}`
                        ) : null;
                    }
                    yayfetch(systemInfo);
                }
                displayData();
            }
        })
        .scriptName("")
        .usage('Usage: npx yayfetch')
        .option('p', {
            alias: 'pick',
            describe: 'Asks you which information you want displayed',
            boolean: 'true',
        })
        .help()
        .version()
        .alias('help', 'h')
        .example('npx yayfetch').argv





