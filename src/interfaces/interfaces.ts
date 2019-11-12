#!/usr/bin/env node
export interface SystemInformation {
    graphicsInfo: {
        gpuInfo: string,
        displays: string
    },
    memoryInfo: {
        free: string,
        used: string,
        total: string,
    },
    osInfo: {
        username: string
    },
    shellInfo: string
}

export interface GpuControllers {
    vendor: string,
    model: string,
    bus: string,
    vram: number,
    vramDynamic: boolean
}

export interface GpuDisplays {
    vendor: string,
    model: string,
    main: boolean,
    builtin: boolean,
    connection: string,
    resolutionx: number,
    resolutiony: number,
    sizex: number,
    sizey: number,
    pixeldepth: number,
    currentResX: number,
    currentResY: number,
    positionX: number,
    positionY: number,
    currentRefreshRate: number
}

export interface GpuInterface {
    controllers: GpuControllers[],
    displays: GpuDisplays[]
}

export interface MemoryInterface {
    total: number,
    free: number,
    used: number,
    active: number,
    available: number,
    buffcache: number,
    swaptotal: number,
    swapused: number,
    swapfree: number
}

export interface OsInfoObjectInterface {
        user: string,
        tty: string,
        date: string,
        time: string,
        ip: string,
        command: string
}