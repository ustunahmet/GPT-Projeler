export type ComponentMass = {
  id: string;
  label: string;
  mass_kg: number;
  x_m?: number;
  y_m?: number;
  z_m?: number;
};

export type CalculationCoreInput = {
  project?: { name?: string; use_case?: string; payload_type?: string };
  environment?: { altitude_m?: number; temperature_c?: number; pressure_pa?: number; air_density_kg_m3?: number | null; wind_m_s?: number };
  airframe: { configuration: 'quad' | 'hex' | 'octo' | 'x8' | 'custom'; rotor_count: number; coaxial?: boolean; arm_count?: number };
  mass: { frame_kg?: number; battery_kg?: number; payload_kg?: number; electronics_kg?: number; motor_kg_total?: number; propeller_kg_total?: number; esc_kg_total?: number; margin_percent?: number; components?: ComponentMass[] };
  geometry: { prop_diameter_in?: number; prop_diameter_m?: number; arm_length_m?: number; frontal_area_m2?: number; cd_estimate?: number; k_disk_effective?: number };
  propulsion: { motor_count: number; max_thrust_per_motor_n?: number; motor_test_table?: MotorTestPoint[]; figure_of_merit?: number; eta_motor?: number; eta_esc?: number; eta_wiring?: number };
  battery: { series_s?: number; parallel_p?: number; cell_capacity_ah?: number; cell_nominal_v?: number; pack_wh?: number; usable_dod?: number; eta_pack?: number; aging_factor?: number; temp_factor?: number; pack_internal_resistance_mohm?: number };
  electrical?: { esc_continuous_a?: number; esc_peak_a?: number; wire_length_m?: number; wire_area_mm2?: number; connector_continuous_a?: number; fuse_nominal_a?: number };
  mission?: { hover_minutes?: number; average_power_w?: number; reserve_percent?: number; forward_speed_m_s?: number };
};

export type MotorTestPoint = {
  thrust_n: number;
  current_a: number;
  voltage_v: number;
  electrical_power_w?: number;
  rpm?: number;
  throttle_percent?: number;
  air_density_kg_m3?: number;
};
