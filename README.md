  <a href="https://www.npmjs.com/package/yayfetch">
    <img alt="downloads" src="https://img.shields.io/npm/dm/yayfetch.svg" target="_blank" />
  </a>
  <a href="https://github.com/xojs/xo">
    <img alt="xojs" src="https://img.shields.io/badge/code_style-XO-5ed9c7.svg" target="_blank" />
  </a>
<br>

<p align="center">
<img src="https://github.com/golota60/yayfetch/blob/master/assets/textlogo.svg" width="500">
</p>

<p align="center">
<img src="https://github.com/golota60/yayfetch/blob/master/assets/examplegif.gif" width="700">
</p>

## What is yayfetch?

Yayfetch is a tool similar to screenfetch - except you can use it on a non-linux machine via npx/npm

## Usage

**Note: It is NOT reccomended to install the package globally, because it is subject to often changes**

`npx yayfetch` - returns info about your system

### Flags

`-p` or `--pick` - first asks you what information you want to display, then displays it

`-c <color>` or `--color <color>` - allows to specify in which color the data will be shown in predefined colors. Cannot be used with --rgb flag. Available predefined colors:
`pink`(default), `orange`, `green`, `white`, `black`, `red`, `blue`, `yellow`, `violet`, `rainbow`

`--rgb r,g,b` - specify RGB values in which data will be shown. Cannot be used with -c(--color) flag. Example `npx yayfetch --rgb 125,25,78`

`--hide-logo` - prints data without ASCII art

`-h` or `--help` - shows available flags.

More features to come!

## It doesn't work!

If it doesn't work for you make sure that you have the newest node(it's developed using node 14.17.0, although it should work with everything >=8.6)

If you came here because of the `'Error - check https://www.npmjs.com/package/yayfetch for more'` error, then most likely the software just can't detect the information. Why? Because of the system you use. It may not work when:

1. You're using linux subsystem for windows
2. Your system is within virtual machine
