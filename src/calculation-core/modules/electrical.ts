import { DEFAULT_ASSUMPTIONS } from '../constants/default-assumptions';
import { PHYSICAL_CONSTANTS } from '../constants/physical.constants';
import type { CalculationWarning } from '../schemas/result.schema';
import { mm2ToM2, round } from '../units/unit-converter';

export function calculateElectrical(input: { currentA?: number; motorCount: number; escContinuousA?: number; wireLengthM?: number; wireAreaMm2?: number; connectorContinuousA?: number; voltageV?: number }) {
  const warnings: CalculationWarning[] = [];
  const assumptions: string[] = ['A-ELEC-001'];
  const formula_trace: string[] = [];
  const currentA = input.currentA ?? 0;
  const currentPerMotorA = input.motorCount > 0 ? currentA / input.motorCount : 0;

  if (input.escContinuousA && currentPerMotorA > 0) {
    formula_trace.push('F-ELEC-002', 'F-ELEC-003');
    const escMargin = input.escContinuousA / currentPerMotorA;
    if (escMargin < 1.2) warnings.push({ code: 'W_ESC_MARGIN_LOW', level: 'red', message: 'ESC sürekli akım marjı düşük.' });
    else if (escMargin < DEFAULT_ASSUMPTIONS.K_ESC_MARGIN) warnings.push({ code: 'W_ESC_MARGIN_LOW', level: 'yellow', message: 'ESC sürekli akım marjı sınırlı.' });
  }

  let wireVoltageDropPercent: number | undefined;
  if (input.wireLengthM && input.wireAreaMm2 && input.voltageV && currentA > 0) {
    formula_trace.push('F-WIRE-001', 'F-WIRE-003', 'F-WIRE-004');
    const roundTripLengthM = input.wireLengthM * 2;
    const wireResistance = PHYSICAL_CONSTANTS.R_CU_20C_OHM_M * roundTripLengthM / mm2ToM2(input.wireAreaMm2);
    const wireVoltageDropV = currentA * wireResistance;
    wireVoltageDropPercent = (wireVoltageDropV / input.voltageV) * 100;
    if (wireVoltageDropPercent > 5) warnings.push({ code: 'W_WIRE_DROP_HIGH', level: 'red', message: 'Kablo gerilim düşümü kırmızı bölgede.' });
    else if (wireVoltageDropPercent > 2) warnings.push({ code: 'W_WIRE_DROP_HIGH', level: 'yellow', message: 'Kablo gerilim düşümü sarı bölgede.' });
  }

  if (input.connectorContinuousA && currentA > 0) {
    formula_trace.push('F-CONN-001');
    const connectorMargin = input.connectorContinuousA / currentA;
    if (connectorMargin < 1) warnings.push({ code: 'W_CONNECTOR_MARGIN_LOW', level: 'red', message: 'Konnektör sürekli akım limiti yetersiz.' });
    else if (connectorMargin < DEFAULT_ASSUMPTIONS.K_CONNECTOR_MARGIN) warnings.push({ code: 'W_CONNECTOR_MARGIN_LOW', level: 'yellow', message: 'Konnektör akım marjı sınırlı.' });
  }

  return { warnings, assumptions, formula_trace, results: { current_total_a: round(currentA, 1), current_per_motor_a: round(currentPerMotorA, 1), wire_voltage_drop_percent: wireVoltageDropPercent ? round(wireVoltageDropPercent, 2) : undefined } };
}
