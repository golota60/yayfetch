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
