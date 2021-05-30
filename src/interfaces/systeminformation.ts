#!/usr/bin/env node

export interface DisplayAndGraphicsCard {
  displays: string[];
  gpuInfo: string[];
}

export interface MemoryInfoInterface {
  free: string;
  used: string;
  total: string;
}

export interface OSInfoInterface {
  distro: string;
  hostname: string;
  display: string;
}
