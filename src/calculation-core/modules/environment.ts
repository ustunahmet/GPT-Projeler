import { PHYSICAL_CONSTANTS } from '../constants/physical.constants';
import type { CalculationWarning } from '../schemas/result.schema';
import { celsiusToKelvin, round } from '../units/unit-converter';

export type EnvironmentInput = { altitude_m?: number; temperature_c?: number; pressure_pa?: number; air_density_kg_m3?: number | null } | undefined;

export function calculateEnvironment(input: EnvironmentInput) {
  const warnings: CalculationWarning[] = [];
  const assumptions: string[] = [];
  const formula_trace: string[] = [];

  if (input?.air_density_kg_m3 && input.air_density_kg_m3 > 0) {
    assumptions.push('A-ENV-USER-RHO');
    formula_trace.push('F-ENV-004');
    return { air_density_kg_m3: input.air_density_kg_m3, temperature_k: celsiusToKelvin(input.temperature_c ?? 15), warnings, assumptions, formula_trace };
  }

  const altitudeM = input?.altitude_m ?? 0;
  const temperatureK = celsiusToKelvin(input?.temperature_c ?? 15);

  if (input?.pressure_pa && input.pressure_pa > 0) {
    formula_trace.push('F-ENV-001');
    return { air_density_kg_m3: round(input.pressure_pa / (PHYSICAL_CONSTANTS.R_AIR * temperatureK), 4), temperature_k: temperatureK, warnings, assumptions, formula_trace };
  }

  if (altitudeM !== 0 || input?.temperature_c !== undefined) {
    const isaTemperatureK = PHYSICAL_CONSTANTS.T0_K - PHYSICAL_CONSTANTS.ISA_LAPSE_RATE_K_M * altitudeM;
    const pressurePa = PHYSICAL_CONSTANTS.P0_PA * (isaTemperatureK / PHYSICAL_CONSTANTS.T0_K) ** (PHYSICAL_CONSTANTS.G0 / (PHYSICAL_CONSTANTS.R_AIR * PHYSICAL_CONSTANTS.ISA_LAPSE_RATE_K_M));
    formula_trace.push('F-ENV-002', 'F-ENV-003', 'F-ENV-001');
    assumptions.push('A-ENV-ISA-PRESSURE');
    return { air_density_kg_m3: round(pressurePa / (PHYSICAL_CONSTANTS.R_AIR * temperatureK), 4), temperature_k: temperatureK, warnings, assumptions, formula_trace };
  }

  warnings.push({ code: 'W_DEFAULT_AIR_DENSITY', level: 'yellow', message: 'Hava yoğunluğu varsayılan deniz seviyesi değeriyle alındı.', action: 'İrtifa, sıcaklık veya hava yoğunluğu girilmesi önerilir.' });
  assumptions.push('A-ENV-001');
  return { air_density_kg_m3: PHYSICAL_CONSTANTS.RHO0, temperature_k: PHYSICAL_CONSTANTS.T0_K, warnings, assumptions, formula_trace };
}
