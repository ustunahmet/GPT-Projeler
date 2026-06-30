export type CalculationStatus = 'ok' | 'warning' | 'error' | 'unsupported';
export type WarningLevel = 'green' | 'yellow' | 'red';

export type CalculationWarning = {
  code: string;
  level: WarningLevel;
  message: string;
  action?: string;
};

export type CalculationError = {
  code: string;
  message: string;
  field?: string;
};

export type ValidationSummary = {
  input_valid: boolean;
  model_confidence: 'high' | 'medium' | 'low' | 'invalid';
};

export type CalculationResult<T> = {
  core_version: string;
  assumption_set_version: string;
  status: CalculationStatus;
  results?: T;
  warnings: CalculationWarning[];
  errors: CalculationError[];
  assumptions: string[];
  formula_trace: string[];
  validation_summary: ValidationSummary;
};
