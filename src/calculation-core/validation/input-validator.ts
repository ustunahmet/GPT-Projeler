import type { CalculationCoreInput } from '../schemas/project.schema';
import type { CalculationError } from '../schemas/result.schema';

const UNSUPPORTED_PAYLOAD_TERMS = ['weapon', 'munition', 'ammo', 'explosive', 'silah', 'mühimmat', 'patlayıcı', 'hedefleme'];

export function validateCalculationInput(input: Partial<CalculationCoreInput>) {
  const errors: CalculationError[] = [];

  if (!input.airframe) errors.push({ code: 'ERR_MISSING_REQUIRED_FIELD', field: 'airframe', message: 'airframe alanı zorunludur.' });
  if (!input.mass) errors.push({ code: 'ERR_MISSING_REQUIRED_FIELD', field: 'mass', message: 'mass alanı zorunludur.' });
  if (!input.geometry) errors.push({ code: 'ERR_MISSING_REQUIRED_FIELD', field: 'geometry', message: 'geometry alanı zorunludur.' });
  if (!input.propulsion) errors.push({ code: 'ERR_MISSING_REQUIRED_FIELD', field: 'propulsion', message: 'propulsion alanı zorunludur.' });
  if (!input.battery) errors.push({ code: 'ERR_MISSING_REQUIRED_FIELD', field: 'battery', message: 'battery alanı zorunludur.' });

  if (input.airframe?.rotor_count !== undefined && input.airframe.rotor_count <= 0) errors.push({ code: 'ERR_ZERO_ROTOR_COUNT', field: 'airframe.rotor_count', message: 'Rotor sayısı sıfır veya negatif olamaz.' });
  if (input.propulsion?.motor_count !== undefined && input.propulsion.motor_count <= 0) errors.push({ code: 'ERR_ZERO_ROTOR_COUNT', field: 'propulsion.motor_count', message: 'Motor sayısı sıfır veya negatif olamaz.' });

  const payloadType = `${input.project?.payload_type ?? input.project?.use_case ?? ''}`.toLowerCase();
  if (UNSUPPORTED_PAYLOAD_TERMS.some((term) => payloadType.includes(term))) errors.push({ code: 'ERR_UNSUPPORTED_PAYLOAD_TYPE', field: 'project.payload_type', message: 'Sivil/eğitim dışı veya zarar verici payload tanımı desteklenmez.' });

  return { valid: errors.length === 0, errors };
}
