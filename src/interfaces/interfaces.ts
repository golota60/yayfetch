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