import { DEFAULT_ASSUMPTIONS } from '../constants/default-assumptions';
import type { CalculationError, CalculationWarning } from '../schemas/result.schema';
import { inchToMeter, round } from '../units/unit-converter';

export function calculateGeometry(input: { prop_diameter_in?: number; prop_diameter_m?: number; rotor_count: number; coaxial?: boolean; k_disk_effective?: number }) {
  const errors: CalculationError[] = [];
  const warnings: CalculationWarning[] = [];
  const assumptions: string[] = [];
  const formula_trace = ['F-GEO-001', 'F-GEO-002', 'F-GEO-003', 'F-GEO-004'];
  const diameterM = input.prop_diameter_m ?? (input.prop_diameter_in !== undefined ? inchToMeter(input.prop_diameter_in) : undefined);

  if (!diameterM || diameterM <= 0) errors.push({ code: 'ERR_MISSING_REQUIRED_FIELD', field: 'geometry.prop_diameter', message: 'Pervane çapı pozitif olmalıdır.' });
  if (input.rotor_count <= 0) errors.push({ code: 'ERR_ZERO_ROTOR_COUNT', field: 'airframe.rotor_count', message: 'Rotor sayısı pozitif tam sayı olmalıdır.' });

  const kDiskEffective = input.k_disk_effective ?? (input.coaxial ? DEFAULT_ASSUMPTIONS.K_COAX_DISK_EFFECTIVE : DEFAULT_ASSUMPTIONS.K_DISK_EFFECTIVE);
  if (input.coaxial && input.k_disk_effective === undefined) {
    warnings.push({ code: 'W_COAXIAL_ASSUMPTION', level: 'yellow', message: 'Coaxial efektif disk alanı varsayılan katsayıyla düşürüldü.', action: 'Coaxial test verisiyle katsayıyı kalibre edin.' });
    assumptions.push('A-COAX-001');
  }
  if (!input.coaxial && input.k_disk_effective === undefined) assumptions.push('A-GEO-001');

  const singleDiskAreaM2 = diameterM ? Math.PI * (diameterM / 2) ** 2 : 0;
  const totalDiskAreaM2 = singleDiskAreaM2 * Math.max(input.rotor_count, 0);
  const effectiveDiskAreaM2 = totalDiskAreaM2 * kDiskEffective;

  return { errors, warnings, assumptions, formula_trace, results: { prop_diameter_m: round(diameterM ?? 0, 4), single_disk_area_m2: round(singleDiskAreaM2, 4), total_disk_area_m2: round(totalDiskAreaM2, 4), effective_disk_area_m2: round(effectiveDiskAreaM2, 4), k_disk_effective: kDiskEffective } };
}
