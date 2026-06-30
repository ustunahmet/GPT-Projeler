import { PHYSICAL_CONSTANTS } from '../constants/physical.constants';

export const round = (value: number, digits = 2) => Number(value.toFixed(digits));
export const inchToMeter = (inch: number) => inch * 0.0254;
export const gramToKg = (gram: number) => gram / 1000;
export const kgToNewton = (kg: number) => kg * PHYSICAL_CONSTANTS.G0;
export const newtonToKgf = (newton: number) => newton / PHYSICAL_CONSTANTS.G0;
export const celsiusToKelvin = (celsius: number) => celsius + 273.15;
export const mm2ToM2 = (mm2: number) => mm2 * 1e-6;
export const milliOhmToOhm = (milliOhm: number) => milliOhm / 1000;

export function assertFiniteNumber(value: unknown, field: string) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`${field} sayısal ve sonlu olmalıdır.`);
  }
}
