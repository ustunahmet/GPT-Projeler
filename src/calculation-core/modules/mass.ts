import { DEFAULT_ASSUMPTIONS } from '../constants/default-assumptions';
import type { ComponentMass } from '../schemas/project.schema';
import type { CalculationError, CalculationWarning } from '../schemas/result.schema';
import { kgToNewton, round } from '../units/unit-converter';

export function calculateMass(input: { frame_kg?: number; battery_kg?: number; payload_kg?: number; electronics_kg?: number; motor_kg_total?: number; propeller_kg_total?: number; esc_kg_total?: number; margin_percent?: number; components?: ComponentMass[] }) {
  const errors: CalculationError[] = [];
  const warnings: CalculationWarning[] = [];
  const assumptions: string[] = [];
  const formula_trace = ['F-MASS-001', 'F-MASS-002', 'F-MASS-003', 'F-MASS-004'];
  const componentValues = [input.frame_kg, input.battery_kg, input.payload_kg, input.electronics_kg, input.motor_kg_total, input.propeller_kg_total, input.esc_kg_total].filter((value): value is number => value !== undefined);
  const listValues = input.components?.map((component) => component.mass_kg) ?? [];

  [...componentValues, ...listValues].forEach((value) => {
    if (value < 0) errors.push({ code: 'ERR_NEGATIVE_MASS', message: 'Kütle değerleri negatif olamaz.' });
  });

  const baseMassKg = componentValues.reduce((sum, value) => sum + value, 0) + listValues.reduce((sum, value) => sum + value, 0);
  if (baseMassKg <= 0) errors.push({ code: 'ERR_MISSING_REQUIRED_FIELD', field: 'mass', message: 'En az bir pozitif kütle kalemi girilmelidir.' });

  const marginPercent = input.margin_percent ?? DEFAULT_ASSUMPTIONS.MASS_MARGIN_PERCENT;
  if (input.margin_percent === undefined) assumptions.push('A-MASS-001');
  if (marginPercent === 0) warnings.push({ code: 'W_ZERO_MASS_MARGIN', level: 'yellow', message: 'Kütle marjı 0 girildi; ölçülmemiş küçük parçalar hesaba katılmayabilir.' });

  const marginKg = baseMassKg * (marginPercent / 100);
  const auwKg = baseMassKg + marginKg;
  const payloadFraction = auwKg > 0 ? (input.payload_kg ?? 0) / auwKg : 0;

  return { errors, warnings, assumptions, formula_trace, results: { base_mass_kg: round(baseMassKg), margin_kg: round(marginKg), auw_kg: round(auwKg), weight_n: round(kgToNewton(auwKg)), payload_fraction: round(payloadFraction, 4) } };
}

export function calculateCenterOfGravity(components: ComponentMass[] = [], referenceArmLengthM = 1) {
  const totalMass = components.reduce((sum, component) => sum + component.mass_kg, 0);
  if (totalMass <= 0 || components.some((component) => component.x_m === undefined || component.y_m === undefined || component.z_m === undefined)) return undefined;
  const x = components.reduce((sum, component) => sum + component.mass_kg * component.x_m!, 0) / totalMass;
  const y = components.reduce((sum, component) => sum + component.mass_kg * component.y_m!, 0) / totalMass;
  const z = components.reduce((sum, component) => sum + component.mass_kg * component.z_m!, 0) / totalMass;
  const offset = Math.sqrt(x ** 2 + y ** 2);
  return { x_cg_m: round(x, 3), y_cg_m: round(y, 3), z_cg_m: round(z, 3), cg_offset_xy_m: round(offset, 3), cg_offset_percent: round((offset / referenceArmLengthM) * 100, 2) };
}
