import { DEFAULT_ASSUMPTIONS } from '../constants/default-assumptions';
import type { CalculationError, CalculationWarning } from '../schemas/result.schema';
import { milliOhmToOhm, round } from '../units/unit-converter';

export function calculateBattery(input: { series_s?: number; parallel_p?: number; cell_capacity_ah?: number; cell_nominal_v?: number; pack_wh?: number; usable_dod?: number; eta_pack?: number; aging_factor?: number; temp_factor?: number; pack_internal_resistance_mohm?: number }, power: { average_power_w: number; reserve_percent?: number }) {
  const errors: CalculationError[] = [];
  const warnings: CalculationWarning[] = [];
  const assumptions: string[] = [];
  const formula_trace = ['F-BATT-001', 'F-BATT-003', 'F-BATT-004', 'F-BATT-005', 'F-BATT-006', 'F-BATT-007', 'F-END-001', 'F-END-002'];

  const seriesS = input.series_s;
  const parallelP = input.parallel_p ?? 1;
  const cellNominalV = input.cell_nominal_v ?? 3.7;
  const cellCapacityAh = input.cell_capacity_ah;
  const usableDod = input.usable_dod ?? DEFAULT_ASSUMPTIONS.USABLE_DOD;
  const etaPack = input.eta_pack ?? DEFAULT_ASSUMPTIONS.ETA_PACK;
  const agingFactor = input.aging_factor ?? DEFAULT_ASSUMPTIONS.AGING_FACTOR;
  const tempFactor = input.temp_factor ?? DEFAULT_ASSUMPTIONS.TEMP_FACTOR;
  const reservePercent = power.reserve_percent ?? DEFAULT_ASSUMPTIONS.RESERVE_PERCENT;

  if (!input.pack_wh && (!seriesS || !cellCapacityAh)) errors.push({ code: 'ERR_MISSING_REQUIRED_FIELD', field: 'battery', message: 'Batarya enerjisi için pack_wh veya series_s + cell_capacity_ah zorunludur.' });
  if (seriesS !== undefined && seriesS <= 0) errors.push({ code: 'ERR_MISSING_REQUIRED_FIELD', field: 'battery.series_s', message: 'Seri hücre sayısı pozitif olmalıdır.' });
  if (cellCapacityAh !== undefined && cellCapacityAh <= 0) errors.push({ code: 'ERR_MISSING_REQUIRED_FIELD', field: 'battery.cell_capacity_ah', message: 'Hücre kapasitesi pozitif olmalıdır.' });
  if (power.average_power_w <= 0) errors.push({ code: 'ERR_MISSING_REQUIRED_FIELD', field: 'power.average_power_w', message: 'Ortalama güç pozitif olmalıdır.' });

  if (input.usable_dod === undefined) assumptions.push('A-BATT-001');
  if (input.aging_factor === undefined) assumptions.push('A-BATT-002');

  const vNomPack = input.pack_wh && !seriesS ? undefined : (seriesS ?? 0) * cellNominalV;
  const capacityAh = input.pack_wh && !cellCapacityAh ? undefined : parallelP * (cellCapacityAh ?? 0);
  const nominalEnergyWh = input.pack_wh ?? (vNomPack ?? 0) * (capacityAh ?? 0);
  const usableEnergyBeforeReserveWh = nominalEnergyWh * usableDod * etaPack * agingFactor * tempFactor;
  const usableEnergyWh = usableEnergyBeforeReserveWh * (1 - reservePercent / 100);
  const enduranceMin = power.average_power_w > 0 ? (60 * usableEnergyWh) / power.average_power_w : 0;
  const averageCurrentA = vNomPack && vNomPack > 0 ? power.average_power_w / vNomPack : undefined;
  const cRateRequired = averageCurrentA && capacityAh ? averageCurrentA / capacityAh : undefined;

  if (cRateRequired !== undefined && cRateRequired > 20) warnings.push({ code: 'W_HIGH_C_RATE', level: 'red', message: 'Gerekli C-rate çok yüksek.', action: 'Daha yüksek kapasite veya uygun hücre kimyası kullanın.' });
  else if (cRateRequired !== undefined && cRateRequired > 10) warnings.push({ code: 'W_HIGH_C_RATE', level: 'yellow', message: 'Gerekli C-rate yüksek.' });

  const rPackOhm = input.pack_internal_resistance_mohm ? milliOhmToOhm(input.pack_internal_resistance_mohm) : undefined;
  const voltageDropV = rPackOhm && averageCurrentA ? averageCurrentA * rPackOhm : undefined;
  const voltageSagPercent = voltageDropV && vNomPack ? (voltageDropV / vNomPack) * 100 : undefined;
  if (voltageSagPercent !== undefined) {
    formula_trace.push('F-VSAG-001', 'F-VSAG-002', 'F-VSAG-003', 'F-VSAG-005');
    if (voltageSagPercent > 10) warnings.push({ code: 'W_HIGH_VOLTAGE_SAG', level: 'red', message: 'Gerilim düşümü kırmızı bölgede.', action: 'İç direnç, kablo, konnektör veya C-rate tasarımını revize edin.' });
    else if (voltageSagPercent > 5) warnings.push({ code: 'W_HIGH_VOLTAGE_SAG', level: 'yellow', message: 'Gerilim düşümü sarı bölgede.' });
  }

  return {
    errors,
    warnings,
    assumptions,
    formula_trace,
    results: {
      v_nom_pack: vNomPack ? round(vNomPack, 2) : undefined,
      capacity_ah: capacityAh ? round(capacityAh, 2) : undefined,
      nominal_energy_wh: round(nominalEnergyWh, 1),
      usable_energy_wh: round(usableEnergyWh, 1),
      estimated_hover_time_min: round(enduranceMin, 1),
      average_current_a: averageCurrentA ? round(averageCurrentA, 1) : undefined,
      c_rate_required: cRateRequired ? round(cRateRequired, 2) : undefined,
      voltage_drop_v: voltageDropV ? round(voltageDropV, 2) : undefined,
      voltage_sag_percent: voltageSagPercent ? round(voltageSagPercent, 2) : undefined,
    },
  };
}
