import { ASSUMPTION_SET_VERSION, CORE_VERSION } from '../constants/physical.constants';
import type { CalculationError, CalculationResult, CalculationStatus, CalculationWarning, ValidationSummary } from '../schemas/result.schema';

export function createResult<T>(params: {
  status?: CalculationStatus;
  results?: T;
  warnings?: CalculationWarning[];
  errors?: CalculationError[];
  assumptions?: string[];
  formula_trace?: string[];
  validation_summary?: ValidationSummary;
}): CalculationResult<T> {
  const errors = params.errors ?? [];
  const warnings = params.warnings ?? [];
  const status = params.status ?? (errors.length ? 'error' : warnings.some((warning) => warning.level === 'red') ? 'warning' : warnings.length ? 'warning' : 'ok');

  return {
    core_version: CORE_VERSION,
    assumption_set_version: ASSUMPTION_SET_VERSION,
    status,
    results: params.results,
    warnings,
    errors,
    assumptions: params.assumptions ?? [],
    formula_trace: params.formula_trace ?? [],
    validation_summary: params.validation_summary ?? { input_valid: errors.length === 0, model_confidence: errors.length ? 'invalid' : warnings.length ? 'medium' : 'high' },
  };
}
