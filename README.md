  <a href="https://www.npmjs.com/package/yayfetch">
    <img alt="downloads" src="https://img.shields.io/npm/dm/yayfetch.svg" target="_blank" />
  </a>
<br>

<p align="center">
</p>

<div align="center">
<img src="https://github.com/golota60/yayfetch/blob/master/assets/logo.svg" width="200">
	<h1>Yayfetch</h1>
	<p>
		<b>🧁Multi-platform customizable screenfetch tool🧁</b>
	</p>
	<br>
</div>

<p align="center">
<img src="https://github.com/golota60/yayfetch/blob/master/assets/examplegif.gif" width="600">
</p>

<br>

Yayfetch is a tool similar to screenfetch, it just displays info about your computer in a prettified format - except you can use it on a non-linux machine via npx, thanks to the wonders of node

## Usage

**Note: It is NOT reccomended to install the package globally, because it is subject to often changes**

`npx yayfetch@latest` - returns info about your system(`@latest` should be added, cause sometimes npx can display a cached version)

### Flags

`-p` or `--pick` - first asks you what information you want to display, then displays it

`-c <color>` or `--color <color>` - allows to specify in which color the data will be shown in predefined colors. Cannot be used with --rgb flag. Available predefined colors:
`pink`(default), `orange`, `green`, `white`, `black`, `red`, `blue`, `yellow`, `violet`, `rainbow`

`--rgb r,g,b` - specify RGB values in which data will be shown. Cannot be used with -c(--color) flag. Example `npx yayfetch --rgb 125,25,78`

`--no-logo` - prints data without ASCII art

`--custom-lines {[key]: value, [key2]: value2, ...}` - object with {[key]: value} string pairs separated by spaces ex.
`'{"Funny:": "joke", "exampleline:": "examplevalue"}'`. This is being parsed using JSON.parse, so if you encounter any problem, make sure that string you provided can be parsed by it.

`--no-colored-boxes` - hides the colored boxes underneath the information.

`-h` or `--help` - shows available flags.

`--config <path_to_file>` - specify a file path to a custom config. See [here](#example-config)

More features to come!

### Config-specific features

Some more advanced features are almost impossible to implement through flags(to be quite honest, some are already pushing it e.g. `--custom-lines`).

- Custom ASCII

To customize the ASCII just define `"ascii"` line in the config. It can either be a string or an array, if you want to define multiple ASCIIs.

```json
{
  "ascii": ["          .=     ,        =.
  _  _   /'/    )\,/,/(_   \ \
   `//-.|  (  ,\\)\//\)\/_  ) |
   //___\   `\\\/\\/\/\\///'  /
,-"~`-._ `"--'_   `"""`  _ \`'"~-,_
\       `-.  '_`.      .'_` \ ,-"~`/
 `.__.-'`/   (-\        /-) |-.__,'
   ||   |     \O)  /^\ (O/  |
   `\\  |         /   `\    /
     \\  \       /      `\ /
      `\\ `-.  /' .---.--.\
        `\\/`~(, '()      ('
         /(O) \\   _,.-.,_)
        //  \\ `\'`      /
  jgs  / |  ||   `""""~"`
     /'  |__||
           `o"]
}
```

<!-- - Line Animations

Each and every one of the lines you provide can be animated.

Since there can be a lot of different lines, you describe their behavior by providing `line-animations` entry in config file of array type which index represents its' position from top to bottom.

Each line can be of type of `"preserve"`(default), which will keep the original behavior of the line. Other options are:
`rainbow`,
`pulse`,
`glitch`,
`radar`,
`neon`,
`karaoke`. You can see how each one looks [here](https://www.npmjs.com/package/chalk-animation) or you can see them in action [here](https://www.example.com).

```json
{
  "line-animations": ["preserve", "rainbow", "pulse", "glitch", "radar"]
}
``` -->

## Example config

You can specify options through a file and use them by using `--config <path_to_file>`. Config file should contain a JSON object with keys representing flags.

Note that every flag with a prefix of `--no-` just negates the flag that is on by default. For example CLI flag `--no-colored-boxes` negates `colored-boxes` flag, which is `true` by default. This is important for creating a config, because if you want to invoke `--no-colored-boxes` through config, you would provide a `"colored-boxes": false` in JSON object.

Example config:

```
{
	"color": "blue",
	"colored-boxes": false,
	"logo": false,
	"custom-lines": {"Funny:": "joke", "exampleline:": "examplevalue"}
}
```

## It doesn't work!

If it doesn't work for you make sure that you have the newest node(it's developed using node 14.17.0, although it should work with everything >=8.6)

If you came here because of the `'Error - check https://www.npmjs.com/package/yayfetch for more'` error, then most likely the software just can't detect the information. Why? Because of the system you use. It may not work when:

1. You're using linux subsystem for windows
2. Your system is within virtual machine
