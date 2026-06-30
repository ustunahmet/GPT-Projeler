import type { CalculationCoreInput } from '../schemas/project.schema';

export const goldenDatasets: Array<{ id: string; description: string; input: CalculationCoreInput; expected: Record<string, number | string> }> = [
  {
    id: 'GD-001',
    description: 'Basit quad, varsayılan ortam, teorik hover güç uyarısı.',
    input: {
      project: { name: 'Demo Eğitim Quad', use_case: 'education', payload_type: 'camera' },
      environment: {},
      airframe: { configuration: 'quad', rotor_count: 4, coaxial: false },
      mass: { frame_kg: 1.2, battery_kg: 0.8, payload_kg: 0.3, electronics_kg: 0.2, margin_percent: 0 },
      geometry: { prop_diameter_in: 13, arm_length_m: 0.35, frontal_area_m2: 0.08, cd_estimate: 1.1 },
      propulsion: { motor_count: 4, max_thrust_per_motor_n: 25 },
      battery: { series_s: 6, parallel_p: 1, cell_capacity_ah: 5, cell_nominal_v: 3.7, usable_dod: 0.8, eta_pack: 0.97, aging_factor: 0.9 },
      electrical: { esc_continuous_a: 40, wire_length_m: 0.35, wire_area_mm2: 5.26, connector_continuous_a: 90 },
      mission: { hover_minutes: 10, reserve_percent: 25 },
    },
    expected: { auw_kg: 2.5, weight_n: 24.52, thrust_to_weight_ratio: 4.08, nominal_energy_wh: 111 },
  },
  {
    id: 'GD-004',
    description: 'Motor test tablosu içinde lineer interpolasyon.',
    input: {
      project: { name: 'Interpolation Quad', use_case: 'education' },
      environment: { air_density_kg_m3: 1.225 },
      airframe: { configuration: 'quad', rotor_count: 4 },
      mass: { frame_kg: 1.0, battery_kg: 0.5, electronics_kg: 0.3, payload_kg: 0.2, margin_percent: 0 },
      geometry: { prop_diameter_in: 10 },
      propulsion: { motor_count: 4, max_thrust_per_motor_n: 12, motor_test_table: [{ thrust_n: 4, current_a: 4, voltage_v: 14.8 }, { thrust_n: 6, current_a: 7, voltage_v: 14.6 }] },
      battery: { series_s: 4, parallel_p: 1, cell_capacity_ah: 5, cell_nominal_v: 3.7 },
      mission: { reserve_percent: 25 },
    },
    expected: { auw_kg: 2.0, estimated_hover_current_a: 22.1 },
  },
  {
    id: 'GD-010',
    description: 'Negatif kütle reddedilir.',
    input: {
      airframe: { configuration: 'quad', rotor_count: 4 },
      mass: { frame_kg: -1, battery_kg: 1 },
      geometry: { prop_diameter_in: 10 },
      propulsion: { motor_count: 4, max_thrust_per_motor_n: 10 },
      battery: { series_s: 4, cell_capacity_ah: 5 },
    },
    expected: { error_code: 'ERR_NEGATIVE_MASS' },
  },
];
