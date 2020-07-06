import os from 'os';
import { errorMessage, bitstoMegabytes } from './helpers';
import { GpuControllers, GpuDisplays, MemoryInterface, OsInfoInterface } from '../interfaces/systeminformation';
import sysinf from 'systeminformation';

interface DisplayAndGraphicsCard {
  displays: Array<string>;
  gpuInfo: Array<string>;
}

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

export const getDisplaysAndGraphicsCards = async (): Promise<DisplayAndGraphicsCard> => {
  try {
    const gpu = await sysinf.graphics();

    const gpuInfo = gpu.controllers.reduce(
      (_acc: Array<string>, _gpu: GpuControllers) => (_gpu.model ? [..._acc, _gpu.model] : [..._acc]),
      [],
    );
    const displays = gpu.displays.reduce(
      (_acc: Array<string>, _gpu: GpuDisplays) =>
        _gpu.resolutionx && _gpu.resolutiony ? [..._acc, `${_gpu.resolutionx}x${_gpu.resolutiony}`] : [..._acc],
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
    const memory: MemoryInterface = await sysinf.mem();

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
    const osInfo: Array<OsInfoInterface> = await sysinf.users();

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
        const osInfo: OsInfoInterface[] = await sysinf.users();
        return osInfo ? osInfo[0].tty : '';
      } catch {
        return errorMessage;
      }
    } else {
      return errorMessage;
    }
  }
};
