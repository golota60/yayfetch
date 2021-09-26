import chalk from "chalk";
import {
  baseFlags,
  execAsPromise,
  getYayfetchOutput,
} from "../helpers/helpers";

describe("yayfetch", () => {
  it("returns info w/o flags", async () => {
    const output = await getYayfetchOutput();
    baseFlags.forEach((val) => {
      expect(output.stdout).toContain(val);
    });
  });
  it("returns info in green", async () => {
    const output = await getYayfetchOutput("--color green");
    baseFlags.forEach((val) => {
      expect(output.stdout).toContain(chalk.green.bold(val));
    });
  });
  it("prints custom lines", async () => {
    const output = await getYayfetchOutput(
      `--custom-lines '{"Funny:": "joke"}'`
    );
    const baseFlagsEnhanced = [...baseFlags, "Funny"];
    baseFlagsEnhanced.forEach((val) => {
      expect(output.stdout).toContain(val);
    });
  });
  it("prints multiple custom lines", async() => {
    const output = await getYayfetchOutput(
      `--custom-lines '{"Funny:": "joke", "Funnier": "joke"}'`
    );
    const baseFlagsEnhanced = [...baseFlags, "Funny", "Funnier"];
    baseFlagsEnhanced.forEach((val) => {
      expect(output.stdout).toContain(val);
    });
  })
  it('reads config from file', async () => {
    const output = await getYayfetchOutput('--config tests/__tests__/testfile.json');
    const baseFlagsEnhanced = [...baseFlags, "Funny:", "exampleline:"];
    baseFlagsEnhanced.forEach((val) => {
      expect(output.stdout).toContain(val);
    });
  })
});
