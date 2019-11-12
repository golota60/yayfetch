## Usage

**Note: It is NOT reccomended to install the package globally, because it is subject to often changes**

```npx yayfetch``` - returns info about your system

```npx yayfetch -p``` - first asks you what information you want to display, then displays it

More features to come!

## It doesn't work!

If it doesn't work for you make sure that you have the newest node(it's developed using node 12.13.0)
  
If you came here because of the ```'Error - check https://www.npmjs.com/package/yayfetch for more'``` error, then most likely the software just can't detect the information. Why? Because of the system you use. It may not work when:

1. You're using linux subsystem for windows
2. Your system is within virtual machine

## Changelog

### 1.1.10 

Introduced TypeScript!

### 1.1.6

Fixed shell display bug. It does not support Windows.

### 1.1.5
Added handling of rejected promises - now, even if software can't detect your system information, it will at least display what it could get. Also code refactor.

### 1.1.2
Added github homepage, so everybody can help improve this project: https://github.com/golota60/yayfetch

### 1.1.1
Added '-p' flag, updated readme and implemented yargs.

### <1.1.1

Nothing really, it was just returning basic information about your system
