#!/usr/bin/env node

export interface DisplayAndGraphicsCard {
  displays: Array<string>;
  gpuInfo: Array<string>;
}

export interface MemoryInfoInterface {
  free: string;
  used: string;
  total: string;
}
