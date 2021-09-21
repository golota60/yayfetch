import os from "os";
import sysinf from "systeminformation";
import { OSInfoInterface } from "../interfaces/systeminformation";
import { errorMessage, bitstoMegabytes } from "./helpers";
interface MemoryInfoInterface {
  free: string;
  used: string;
  total: string;
}

export const getEndianness = (): string => {
  switch (os.endianness()) {
    case "LE":
      return "Little Endian";
    case "BE":
      return "Big Endian";
    default:
      return os.endianness();
  }
};

interface DisplaysAndGraphicsCardsInterface {
  gpuInfo: string[];
  displays: string[];
}

export const getDisplaysAndGraphicsCards =
  async (): Promise<DisplaysAndGraphicsCardsInterface> => {
    try {
      const gpu = await sysinf.graphics();

      const gpuInfo = gpu.controllers.map(
        (gpu: sysinf.Systeminformation.GraphicsControllerData) => gpu.model
      );
      const displays = gpu.displays
        .map((gpu: sysinf.Systeminformation.GraphicsDisplayData) =>
          gpu.resolutionX & gpu.resolutionY
            ? `${gpu.resolutionX}x${gpu.resolutionY}`
            : null
        )
        .filter((element) => element !== null) as string[];
      return {
        gpuInfo,
        displays,
      };
    } catch {
      return {
        gpuInfo: [errorMessage],
        displays: [errorMessage],
      };
    }
  };

export const getMemoryInfo = async (): Promise<MemoryInfoInterface> => {
  try {
    const memory: sysinf.Systeminformation.MemData = await sysinf.mem();

    const free: number = memory ? bitstoMegabytes(memory.free) : 0;
    const used: number = memory ? bitstoMegabytes(memory.used) : 0;
    const total: number = memory ? bitstoMegabytes(memory.total) : 0;

    return {
      free: free.toFixed(0),
      used: used.toFixed(0),
      total: total.toFixed(0),
    };
  } catch {
    return {
      free: errorMessage,
      used: "",
      total: "",
    };
  }
};

export const getOsInfo = async (): Promise<string> => {
  try {
    const osInfo: sysinf.Systeminformation.UserData[] = await sysinf.users();

    return osInfo ? osInfo[0].user : "";
  } catch {
    return errorMessage;
  }
};

export const getShellInfo = async (): Promise<string> => {
  try {
    return await sysinf.shell();
  } catch {
    if (os.platform() === "win32") {
      // Windows doesn't support .shell() feature
      try {
        const osInfo: sysinf.Systeminformation.UserData[] =
          await sysinf.users();
        return osInfo ? osInfo[0].tty : "";
      } catch {
        return errorMessage;
      }
    } else {
      return errorMessage;
    }
  }
};

export const getSysInfOsInfo = async (): Promise<
  OSInfoInterface | undefined
> => {
  try {
    const osInfo = await sysinf.osInfo();
    return {
      distro: osInfo.distro,
      hostname: osInfo.hostname,
      display: `${osInfo.codename} ${osInfo.release} ${osInfo.build} ${osInfo.arch}`,
    };
  } catch (error: unknown) {
    console.error(error);
  }
};

export const getHWInfo = async (): Promise<
  sysinf.Systeminformation.SystemData | undefined
> => {
  try {
    const hwInfo = await sysinf.system();
    return hwInfo;
  } catch (error: unknown) {
    console.error(error);
  }
};
