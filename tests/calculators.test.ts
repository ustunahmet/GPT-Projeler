import { describe, expect, it } from 'vitest';
import {
  calculateBatteryEndurance,
  calculateCurrent,
  calculateDiskLoading,
  calculatePayloadMargin,
  calculateThrust,
} from '../services/calculators';
import {
  batteryModels,
  calculateBatteryContinuousCurrentA,
  calculateBatteryEnergyWh,
  calculateMotorTotalThrustKg,
  motorModels,
} from '../lib/parts';

describe('calculator formulas', () => {
  it('calculates the thrust sample', () => {
    expect(calculateThrust({ auwKg: 2, motorCount: 4, safetyFactor: 2 })).toMatchObject({
      totalRequiredThrustKgf: 4,
      requiredThrustPerMotorKgf: 1,
      weightNewton: 19.62,
    });
  });

  it('calculates the battery endurance sample', () => {
    expect(
      calculateBatteryEndurance({ nominalVoltageV: 14.8, capacityAh: 5, reservePercent: 20, averagePowerW: 200 }),
    ).toMatchObject({ totalWh: 74, usableWh: 59.2, estimatedMinutes: 17.76 });
  });

  it('calculates the current sample', () => {
    expect(calculateCurrent({ totalPowerW: 800, voltageV: 16, motorCount: 4, marginPercent: 20 }).totalCurrentA).toBe(50);
  });

  it('calculates the disk loading sample', () => {
    expect(calculateDiskLoading({ propDiameterInch: 10, motorCount: 4, auwKg: 2 }).totalDiskAreaM2).toBeCloseTo(0.203, 3);
  });

  it('calculates the payload margin sample', () => {
    expect(
      calculatePayloadMargin({ mtowKg: 5, emptyWeightKg: 2, batteryWeightKg: 1, payloadKg: 1.2, accessoryWeightKg: 0.3 }),
    ).toMatchObject({ totalWeightKg: 4.5, remainingMarginKg: 0.5 });
  });
});

describe('part catalog helpers', () => {
  it('calculates battery energy and C-rating current from catalog data', () => {
    const battery = batteryModels.find((item) => item.id === 'battery-4s-5000-30c');

    expect(battery).toBeDefined();
    expect(calculateBatteryEnergyWh(battery!)).toBe(74);
    expect(calculateBatteryContinuousCurrentA(battery!)).toBe(150);
  });

  it('calculates total motor thrust for a quad from catalog data', () => {
    const motor = motorModels.find((item) => item.id === 'motor-eco-2212-920kv');

    expect(motor).toBeDefined();
    expect(calculateMotorTotalThrustKg(motor!, 4)).toBe(3.4);
  });
});
