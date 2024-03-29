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

Yayfetch works both with `npx` and `bunx`

- npm - `npx yayfetch`

- bun -`bunx yayfetch`


_or_ install it globally:

`bun install --global yayfetch`/`npm install -g yayfetch` and then just call `yayfetch`!

## Flag-defined features

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

## Config-specific features

Some more advanced features are almost impossible to implement through flags(to be quite honest, some are already pushing it e.g. `--custom-lines`).

- ### Custom ASCIIs

To customize the ASCIIs just define `"ascii"` line in the config. It should be an `Array<string>` with path(s) to the ASCII(s).

Example:

```json
{
  "ascii": ["./path/to/file.txt", "./path/to/2nd/file.txt"]
}
```

- ### Custom images

You can also defined iamges instead of ASCIIs, by defining `images` field. Note that this flag is mutually exclusive with `ascii` flag.
Uses [terminal-image](https://github.com/sindresorhus/terminal-image) underneath, so refer to it when specifying `options`.

```ts
interface ImageOptions {
  path: string;
  options?: {
    width?: string | number | undefined;
    height?: string | number | undefined;
    preserveAspectRatio?: boolean | undefined;
  };
}
```

Example:

```json
{
  "image": {
    "path": "./path/to/file.img",
    "options": { "preserveAspectRatio": false }
  }
}
```

- ### Line Animations

Output can be animated by `line-animations` flag in the config file. It should be an `AnimationOptions` object.

```ts
type Animations = 'colors' | 'flowing-rainbow';
interface AnimationOptions {
  type: Animations; // Animations - applied per column basis
  msFrequency: number; // How fast should the animation be
}
```

**Note: Printing to stdout is not performant, so it may not work well with less performant console environments**

Example:

```json
{
  "line-animations": {
    "type": "flowing-rainbow",
    "msFrequency": 150
  }
}
```

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

If it doesn't work for you make sure that you have the newest node(it's developed using node 18.18.0).

If you came here because of the `'Error - check https://www.npmjs.com/package/yayfetch for more'` error, then most likely the software just can't detect the information. Why? Because of the system you use. It may not work when:

1. You're using linux subsystem for windows
2. Your system is within virtual machine
