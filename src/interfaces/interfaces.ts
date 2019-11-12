export interface systemInformation {
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

export interface gpuControllers {
    vendor: string,
    model: string,
    bus: string,
    vram: number,
    vramDynamic: boolean
}

export interface gpuDisplays {
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

export interface gpuInterface {
    controllers: gpuControllers[],
    displays: gpuDisplays[]
}

export interface memoryInterface {
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

export interface osInfoObjectInterface {
        user: string,
        tty: string,
        date: string,
        time: string,
        ip: string,
        command: string
}