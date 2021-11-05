#!/usr/bin/env node

/* 
  Generally it's best to use systeminformation types, write your own here only if needed
*/

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
