import { DEFAULT_ASSUMPTIONS } from '../constants/default-assumptions';
import type { MotorTestPoint } from '../schemas/project.schema';
import type { CalculationError, CalculationWarning } from '../schemas/result.schema';
import { newtonToKgf, round } from '../units/unit-converter';

type PropulsionInput = {
  weightN: number;
  motorCount: number;
  maxThrustPerMotorN?: number;
  effectiveDiskAreaM2: number;
  airDensityKgM3: number;
  motorTestTable?: MotorTestPoint[];
  figureOfMerit?: number;
  etaMotor?: number;
  etaEsc?: number;
  etaWiring?: number;
};

function interpolateMotorTestTable(requiredThrustN: number, table: MotorTestPoint[]) {
  const sorted = [...table].sort((a, b) => a.thrust_n - b.thrust_n);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  if (!min || !max || requiredThrustN < min.thrust_n || requiredThrustN > max.thrust_n) return undefined;
  const upperIndex = sorted.findIndex((point) => point.thrust_n >= requiredThrustN);
  const lower = sorted[Math.max(upperIndex - 1, 0)];
  const upper = sorted[upperIndex];
  if (lower.thrust_n === upper.thrust_n) return upper;
  const ratio = (requiredThrustN - lower.thrust_n) / (upper.thrust_n - lower.thrust_n);
  const lerp = (a: number, b: number) => a + (b - a) * ratio;
  return {
    thrust_n: requiredThrustN,
    current_a: lerp(lower.current_a, upper.current_a),
    voltage_v: lerp(lower.voltage_v, upper.voltage_v),
    electrical_power_w: lerp(lower.electrical_power_w ?? lower.current_a * lower.voltage_v, upper.electrical_power_w ?? upper.current_a * upper.voltage_v),
    rpm: lower.rpm && upper.rpm ? lerp(lower.rpm, upper.rpm) : undefined,
    throttle_percent: lower.throttle_percent && upper.throttle_percent ? lerp(lower.throttle_percent, upper.throttle_percent) : undefined,
  };
}

export function calculatePropulsion(input: PropulsionInput) {
  const errors: CalculationError[] = [];
  const warnings: CalculationWarning[] = [];
  const assumptions: string[] = [];
  const formula_trace = ['F-THR-001', 'F-THR-002', 'F-PWR-001'];

  if (input.motorCount <= 0) errors.push({ code: 'ERR_ZERO_ROTOR_COUNT', field: 'propulsion.motor_count', message: 'Motor sayısı pozitif olmalıdır.' });
  if (input.effectiveDiskAreaM2 <= 0) errors.push({ code: 'ERR_MISSING_REQUIRED_FIELD', field: 'geometry.effective_disk_area_m2', message: 'Efektif disk alanı pozitif olmalıdır.' });

  const requiredHoverThrustTotalN = input.weightN;
  const requiredHoverThrustPerMotorN = requiredHoverThrustTotalN / Math.max(input.motorCount, 1);
  const maxThrustTotalN = input.maxThrustPerMotorN ? input.maxThrustPerMotorN * input.motorCount : undefined;
  const thrustToWeightRatio = maxThrustTotalN ? maxThrustTotalN / input.weightN : undefined;
  const hoverThrottleEstimate = input.maxThrustPerMotorN ? requiredHoverThrustPerMotorN / input.maxThrustPerMotorN : undefined;

  if (thrustToWeightRatio !== undefined) {
    formula_trace.push('F-THR-004', 'F-THR-005', 'F-THR-006');
    if (thrustToWeightRatio < 1.5) warnings.push({ code: 'W_LOW_THRUST_MARGIN', level: 'red', message: 'İtki/ağırlık oranı kırmızı bölgede.', action: 'Kütleyi azaltın veya motor/pervane seçimini revize edin.' });
    else if (thrustToWeightRatio < 2) warnings.push({ code: 'W_LOW_THRUST_MARGIN', level: 'yellow', message: 'İtki/ağırlık oranı sınırlı.', action: 'En az 2.0 T/W hedefi değerlendirilebilir.' });
  }
  if (hoverThrottleEstimate !== undefined && hoverThrottleEstimate > 0.75) warnings.push({ code: 'W_HIGH_HOVER_THROTTLE', level: 'red', message: 'Hover throttle tahmini çok yüksek.', action: 'Daha yüksek itki rezervi hedefleyin.' });
  else if (hoverThrottleEstimate !== undefined && (hoverThrottleEstimate > 0.6 || hoverThrottleEstimate < 0.25)) warnings.push({ code: 'W_HIGH_HOVER_THROTTLE', level: 'yellow', message: 'Hover throttle tahmini önerilen orta bölgenin dışında.' });

  const interpolated = input.motorTestTable?.length ? interpolateMotorTestTable(requiredHoverThrustPerMotorN, input.motorTestTable) : undefined;
  let estimatedHoverPowerW: number;
  let estimatedHoverCurrentA: number | undefined;
  let modelConfidence: 'high' | 'medium' | 'low' = 'low';

  if (input.motorTestTable?.length) {
    formula_trace.push('F-INT-001', 'F-INT-002', 'F-INT-003');
    if (!interpolated) {
      errors.push({ code: 'ERR_THRUST_DATA_RANGE', field: 'propulsion.motor_test_table', message: 'Gereken itki motor test tablosu aralığı dışında; MVP extrapolasyon yapmaz.' });
      estimatedHoverPowerW = 0;
    } else {
      estimatedHoverPowerW = interpolated.electrical_power_w * input.motorCount;
      estimatedHoverCurrentA = interpolated.current_a * input.motorCount;
      modelConfidence = 'high';
    }
  } else {
    formula_trace.push('F-PWR-002', 'F-PWR-003', 'F-PWR-004', 'F-PWR-005');
    warnings.push({ code: 'W_THEORETICAL_POWER_MODEL', level: 'yellow', message: 'Motor test tablosu yok; momentum teorisi tabanlı teorik hover güç tahmini kullanıldı.', action: 'Üretici datasheet veya thrust stand tablosu ekleyin.' });
    assumptions.push('A-PROP-001', 'A-PROP-002');
    const inducedVelocity = Math.sqrt(requiredHoverThrustTotalN / (2 * input.airDensityKgM3 * input.effectiveDiskAreaM2));
    const idealInducedPowerW = requiredHoverThrustTotalN * inducedVelocity;
    const fm = input.figureOfMerit ?? DEFAULT_ASSUMPTIONS.FIGURE_OF_MERIT;
    const etaMotor = input.etaMotor ?? DEFAULT_ASSUMPTIONS.ETA_MOTOR;
    const etaEsc = input.etaEsc ?? DEFAULT_ASSUMPTIONS.ETA_ESC;
    const etaWiring = input.etaWiring ?? DEFAULT_ASSUMPTIONS.ETA_WIRING;
    estimatedHoverPowerW = idealInducedPowerW / (fm * etaMotor * etaEsc * etaWiring);
  }

  const diskLoadingNM2 = input.weightN / input.effectiveDiskAreaM2;
  if (diskLoadingNM2 > 150) warnings.push({ code: 'W_HIGH_DISK_LOADING', level: 'yellow', message: 'Disk loading yüksek; hover güç ihtiyacı artabilir.', action: 'Pervane çapı veya rotor alanını artırmayı değerlendirin.' });

  return {
    errors,
    warnings,
    assumptions,
    formula_trace,
    modelConfidence,
    results: {
      required_hover_thrust_total_n: round(requiredHoverThrustTotalN),
      required_hover_thrust_per_motor_n: round(requiredHoverThrustPerMotorN),
      required_hover_thrust_per_motor_kgf: round(newtonToKgf(requiredHoverThrustPerMotorN)),
      max_thrust_total_n: maxThrustTotalN ? round(maxThrustTotalN) : undefined,
      thrust_to_weight_ratio: thrustToWeightRatio ? round(thrustToWeightRatio, 2) : undefined,
      hover_throttle_estimate: hoverThrottleEstimate ? round(hoverThrottleEstimate, 2) : undefined,
      disk_loading_n_m2: round(diskLoadingNM2, 1),
      estimated_hover_power_w: round(estimatedHoverPowerW, 1),
      estimated_hover_current_a: estimatedHoverCurrentA ? round(estimatedHoverCurrentA, 1) : undefined,
      estimated_hover_power_per_motor_w: round(estimatedHoverPowerW / Math.max(input.motorCount, 1), 1),
    },
  };
}
