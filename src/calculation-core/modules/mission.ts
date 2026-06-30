import type { CalculationError, CalculationWarning } from '../schemas/result.schema';
import { round } from '../units/unit-converter';

export function calculateMission(input: { hoverMinutes?: number; hoverPowerW: number; usableEnergyWh: number; reservePercent?: number }) {
  const errors: CalculationError[] = [];
  const warnings: CalculationWarning[] = [];
  const formula_trace = ['F-END-003', 'F-END-004', 'F-END-005'];
  const hoverMinutes = input.hoverMinutes ?? 0;
  const reservePercent = input.reservePercent ?? 25;
  const energyRequiredWh = (input.hoverPowerW * (hoverMinutes / 60)) / (1 - reservePercent / 100);
  const energyMarginPercent = energyRequiredWh > 0 ? ((input.usableEnergyWh - energyRequiredWh) / energyRequiredWh) * 100 : undefined;

  if (hoverMinutes > 0 && energyRequiredWh > input.usableEnergyWh) errors.push({ code: 'ERR_ENERGY_INSUFFICIENT', field: 'mission.hover_minutes', message: 'Kullanılabilir enerji görev gereksinimini karşılamıyor.' });
  else if (energyMarginPercent !== undefined && energyMarginPercent < 20) warnings.push({ code: 'W_LOW_ENERGY_MARGIN', level: 'yellow', message: 'Görev enerji marjı düşük.' });

  return { errors, warnings, assumptions: [], formula_trace, results: { mission_energy_required_wh: round(energyRequiredWh, 1), energy_margin_percent: energyMarginPercent !== undefined ? round(energyMarginPercent, 1) : undefined } };
}
