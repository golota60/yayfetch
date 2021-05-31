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
      `--custom-lines '{"key": "Funny", "value": "joke"}'`
    );
    const baseFlagsEnhanced = [...baseFlags, "Funny"];
    baseFlagsEnhanced.forEach((val) => {
      expect(output.stdout).toContain(chalk.bold(val));
    });
  });
});
