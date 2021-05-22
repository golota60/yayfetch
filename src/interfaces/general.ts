import { availableColors } from '../helpers/helpers';

export interface RGBColors {
  r: number;
  g: number;
  b: number;
}

export type PredefinedColors = typeof availableColors[number];
