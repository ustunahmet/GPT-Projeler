import { describe, expect, it } from 'vitest';
import { calculateFullProject, goldenDatasets, validateOnly } from '../src/calculation-core';

describe('calculation core full flow', () => {
  it('GD-001 calculates traceable full project results with theoretical model warning', () => {
    const dataset = goldenDatasets.find((item) => item.id === 'GD-001')!;
    const result = calculateFullProject(dataset.input);

    expect(result.status).toBe('warning');
    expect(result.core_version).toBe('1.0.0');
    expect(result.results?.auw_kg).toBe(2.5);
    expect(result.results?.weight_n).toBe(24.52);
    expect(result.results?.thrust_to_weight_ratio).toBe(4.08);
    expect(result.results?.nominal_energy_wh).toBe(111);
    expect(result.warnings.some((warning) => warning.code === 'W_THEORETICAL_POWER_MODEL')).toBe(true);
    expect(result.assumptions).toContain('A-PROP-001');
    expect(result.formula_trace).toContain('F-MASS-004');
    expect(result.formula_trace).toContain('F-PWR-004');
  });

  it('GD-004 uses motor test table interpolation when available', () => {
    const dataset = goldenDatasets.find((item) => item.id === 'GD-004')!;
    const result = calculateFullProject(dataset.input);

    expect(result.status).toBe('warning');
    expect(result.validation_summary.model_confidence).toBe('high');
    expect(result.results?.estimated_hover_current_a).toBeCloseTo(22.1, 1);
    expect(result.formula_trace).toContain('F-INT-002');
    expect(result.warnings.some((warning) => warning.code === 'W_THEORETICAL_POWER_MODEL')).toBe(false);
  });

  it('rejects thrust extrapolation outside test table range', () => {
    const dataset = goldenDatasets.find((item) => item.id === 'GD-004')!;
    const result = calculateFullProject({ ...dataset.input, mass: { ...dataset.input.mass, frame_kg: 20 } });

    expect(result.status).toBe('error');
    expect(result.errors.some((error) => error.code === 'ERR_THRUST_DATA_RANGE')).toBe(true);
  });

  it('rejects negative mass and unsupported payload types', () => {
    const negativeMass = goldenDatasets.find((item) => item.id === 'GD-010')!;
    expect(calculateFullProject(negativeMass.input).errors.some((error) => error.code === 'ERR_NEGATIVE_MASS')).toBe(true);

    const validation = validateOnly({ project: { payload_type: 'mühimmat' } });
    expect(validation.status).toBe('error');
    expect(validation.errors.some((error) => error.code === 'ERR_UNSUPPORTED_PAYLOAD_TYPE')).toBe(true);
  });
});
