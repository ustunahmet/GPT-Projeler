import { calculateBattery } from './modules/battery';
import { calculateElectrical } from './modules/electrical';
import { calculateEnvironment } from './modules/environment';
import { calculateGeometry } from './modules/geometry';
import { calculateCenterOfGravity, calculateMass } from './modules/mass';
import { calculateMission } from './modules/mission';
import { calculatePropulsion } from './modules/propulsion';
import { createResult } from './modules/result';
import type { CalculationCoreInput } from './schemas/project.schema';
import { validateCalculationInput } from './validation/input-validator';

export type { CalculationCoreInput } from './schemas/project.schema';
export type { CalculationResult } from './schemas/result.schema';
export { goldenDatasets } from './validation/golden-datasets';
export { calculateBattery } from './modules/battery';
export { calculateEnvironment } from './modules/environment';
export { calculateGeometry } from './modules/geometry';
export { calculateMass, calculateCenterOfGravity } from './modules/mass';
export { calculatePropulsion } from './modules/propulsion';

export function calculateFullProject(input: CalculationCoreInput) {
  const validation = validateCalculationInput(input);
  if (!validation.valid) return createResult({ status: validation.errors.some((error) => error.code === 'ERR_UNSUPPORTED_PAYLOAD_TYPE') ? 'unsupported' : 'error', errors: validation.errors });

  const environment = calculateEnvironment(input.environment);
  const mass = calculateMass(input.mass);
  const geometry = calculateGeometry({ ...input.geometry, rotor_count: input.airframe.rotor_count, coaxial: input.airframe.coaxial });
  const earlyErrors = [...mass.errors, ...geometry.errors];

  if (earlyErrors.length) {
    return createResult({ status: 'error', errors: earlyErrors, warnings: [...environment.warnings, ...mass.warnings, ...geometry.warnings], assumptions: [...environment.assumptions, ...mass.assumptions, ...geometry.assumptions], formula_trace: [...environment.formula_trace, ...mass.formula_trace, ...geometry.formula_trace] });
  }

  const propulsion = calculatePropulsion({
    weightN: mass.results.weight_n,
    motorCount: input.propulsion.motor_count,
    maxThrustPerMotorN: input.propulsion.max_thrust_per_motor_n,
    effectiveDiskAreaM2: geometry.results.effective_disk_area_m2,
    airDensityKgM3: environment.air_density_kg_m3,
    motorTestTable: input.propulsion.motor_test_table,
    figureOfMerit: input.propulsion.figure_of_merit,
    etaMotor: input.propulsion.eta_motor,
    etaEsc: input.propulsion.eta_esc,
    etaWiring: input.propulsion.eta_wiring,
  });

  const averagePowerW = input.mission?.average_power_w ?? propulsion.results.estimated_hover_power_w;
  const battery = calculateBattery(input.battery, { average_power_w: averagePowerW, reserve_percent: input.mission?.reserve_percent });
  const electrical = calculateElectrical({ currentA: battery.results.average_current_a, motorCount: input.propulsion.motor_count, escContinuousA: input.electrical?.esc_continuous_a, wireLengthM: input.electrical?.wire_length_m, wireAreaMm2: input.electrical?.wire_area_mm2, connectorContinuousA: input.electrical?.connector_continuous_a, voltageV: battery.results.v_nom_pack });
  const mission = calculateMission({ hoverMinutes: input.mission?.hover_minutes, hoverPowerW: averagePowerW, usableEnergyWh: battery.results.usable_energy_wh, reservePercent: input.mission?.reserve_percent });
  const cg = calculateCenterOfGravity(input.mass.components, input.geometry.arm_length_m ?? 1);

  const errors = [...propulsion.errors, ...battery.errors, ...mission.errors];
  const warnings = [...environment.warnings, ...mass.warnings, ...geometry.warnings, ...propulsion.warnings, ...battery.warnings, ...electrical.warnings, ...mission.warnings];
  const assumptions = [...environment.assumptions, ...mass.assumptions, ...geometry.assumptions, ...propulsion.assumptions, ...battery.assumptions, ...electrical.assumptions];
  const formulaTrace = [...environment.formula_trace, ...mass.formula_trace, ...geometry.formula_trace, ...propulsion.formula_trace, ...battery.formula_trace, ...electrical.formula_trace, ...mission.formula_trace];
  const modelConfidence = errors.length ? 'invalid' : propulsion.modelConfidence;

  return createResult({
    status: errors.length ? 'error' : warnings.length ? 'warning' : 'ok',
    errors,
    warnings,
    assumptions: Array.from(new Set(assumptions)),
    formula_trace: Array.from(new Set(formulaTrace)),
    validation_summary: { input_valid: errors.length === 0, model_confidence: modelConfidence },
    results: {
      ...mass.results,
      center_of_gravity: cg,
      air_density_kg_m3: environment.air_density_kg_m3,
      ...geometry.results,
      ...propulsion.results,
      ...battery.results,
      ...electrical.results,
      ...mission.results,
      standard_notice: 'Bu hesaplama erken tasarım ve eğitim amaçlı mühendislik tahminidir; test ve bağımsız mühendislik doğrulaması gerektirir.',
    },
  });
}

export function validateOnly(input: Partial<CalculationCoreInput>) {
  const validation = validateCalculationInput(input);
  return createResult({ status: validation.valid ? 'ok' : 'error', errors: validation.errors, results: { valid: validation.valid } });
}
