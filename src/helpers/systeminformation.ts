import os from 'os';
import { errorMessage, bitstoMegabytes } from './helpers';
import sysinf from 'systeminformation';
interface MemoryInfoInterface {
  free: string;
  used: string;
  total: string;
}

export const getEndianness = (): string => {
  switch (os.endianness()) {
    case 'LE':
      return 'Little Endian';
    case 'BE':
      return 'Big Endian';
    default:
      return os.endianness();
  }
};

interface DisplaysAndGraphicsCardsInterface {
  gpuInfo: Array<string>;
  displays: Array<string>;
}

export const getDisplaysAndGraphicsCards = async (): Promise<DisplaysAndGraphicsCardsInterface> => {
  try {
    const gpu = await sysinf.graphics();

    const gpuInfo = gpu.controllers.reduce(
      (_acc: Array<string>, _gpu: sysinf.Systeminformation.GraphicsControllerData) =>
        _gpu.model ? [..._acc, _gpu.model] : [..._acc],
      [],
    );
    const displays = gpu.displays.reduce(
      (_acc: Array<string>, _gpu: sysinf.Systeminformation.GraphicsDisplayData) =>
        _gpu.resolutionX && _gpu.resolutionY ? [..._acc, `${_gpu.resolutionX}x${_gpu.resolutionY}`] : [..._acc],
      [],
    );
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
      used: '',
      total: '',
    };
  }
};

export const getOsInfo = async (): Promise<string> => {
  try {
    const osInfo: Array<sysinf.Systeminformation.UserData> = await sysinf.users();

    return osInfo ? osInfo[0].user : '';
  } catch {
    return errorMessage;
  }
};

export const getShellInfo = async (): Promise<string> => {
  try {
    return await sysinf.shell();
  } catch {
    if (os.platform() === 'win32') {
      //windows doesn't support .shell() feature
      try {
        const osInfo: Array<sysinf.Systeminformation.UserData> = await sysinf.users();
        return osInfo ? osInfo[0].tty : '';
      } catch {
        return errorMessage;
      }
    } else {
      return errorMessage;
    }
  }
};
