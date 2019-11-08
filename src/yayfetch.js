#!/usr/bin/env node
const os = require('os');
const yargs = require('yargs');
const sysinf = require('systeminformation');
const chalk = require('chalk');
const inquirer = require('inquirer');

//TODO:investigate why the uptime is always so high and why free memory seems to be unreasonably high
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
    username: '',
    shell: ''
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
    const GPU = await sysinf.graphics().then((data) => {
        let displays = '';
        let graphicsCards = '';
        data.controllers.forEach((elem) => {
            graphicsCards += `${elem.model} `;
        })
        data.displays.forEach((elem) => {
            displays += `${elem.resolutionx}x${elem.resolutiony} `
        })
        return {
            gpuInfo: graphicsCards,
            displays: displays
        }
    })

    const memory = await sysinf.mem().then((data) => {
        const total = data ? data.total * 9.537 * Math.pow(10, -7) : null; //conversion to Mb
        const used = data ? data.used * 9.537 * Math.pow(10, -7) : null;
        const free = data ? data.free * 9.537 * Math.pow(10, -7) : null;
        return memoryInfo = {
            free: free.toFixed(0),
            used: used.toFixed(0),
            total: total.toFixed(0),
        }
    })

    const osInfo = await sysinf.users().then((data) => {
        const username = data ? data[0].user : null;
        const shell = data ? data[0].tty : null;
        return br = {
            username: username,
            shell: shell,
        }
    })

    systemInfo = {
        graphicsInfo: GPU,
        memoryInfo: memory,
        username: osInfo.username,
        shell: osInfo.shell
    }
    return systemInfo;
}


const args =
    yargs
        .command('$0', '', () => {

            if (yargs.argv.p || yargs.argv.pick) {
                inquirer
                    .prompt([promptQuestions])
                    .then((data) => {
                        getSystemInformation().then((res) => {
                            console.log(` ${chalk.blue(res.username + '@' + os.platform())} \n -----------------------------`);
                            if (data.displayedValues.includes('Platform')) {
                                console.log(`Platform: ${os.platform().toLocaleUpperCase()}`);
                            }
                            if (data.displayedValues.includes('Type')) {
                                console.log(`Type: ${os.type()}`);
                            }
                            if (data.displayedValues.includes('Release')) {
                                console.log(`Release: ${os.release()}`);
                            }
                            if (data.displayedValues.includes('Architecture')) {
                                console.log(`Architecture: ${os.arch()}`);
                            }
                            if (data.displayedValues.includes('Uptime')) {
                                console.log(`Uptime: ${uptimeInMinutes().toFixed(0)} min`);
                            }
                            if (data.displayedValues.includes('CPUs')) {
                                console.log(`CPU: ${os.cpus()[0].model}`);
                            }
                            if (data.displayedValues.includes('GPUs')) {
                                console.log(`GPU(s): ${res.graphicsInfo.gpuInfo}`);
                            }
                            if (data.displayedValues.includes('Displays')) {
                                console.log(`Display(s): ${res.graphicsInfo.displays}`);
                            }
                            if (data.displayedValues.includes('Endianness')) {
                                console.log(`Endianness: ${endianness()}`);
                            }
                            if (data.displayedValues.includes('Memory')) {
                                console.log(`Memory: ${res.memoryInfo.free}/${res.memoryInfo.used}/${res.memoryInfo.total} MiB (Free/Used/Total)`);
                            }
                            if (data.displayedValues.includes('Shell')) {
                                console.log(`Shell: ${res.shell}`);
                            }
                        })
                    })
            } else {

                getSystemInformation().then((systemInfo) => {
                    yayfetch(systemInfo);
                })

                const yayfetch = (res) => {
                    res ? console.log(
                        ` ${chalk.blue(res.username + '@' + os.platform())} \n -----------------------------\n`,
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
                        `Shell: ${res.shell}\n`
                    ) : null;
                }
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





