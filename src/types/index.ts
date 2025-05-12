export interface CalculatorInputs {
  currentCGPA: number;
  lastSGPA: number;
  upcomingSGPA: number;
  totalCredits?: number;
  lastSemCredits?: number;
  upcomingSemCredits?: number;
}

export interface PredictionResult {
  newCGPA: number;
  difference: number;
  trend: 'increase' | 'decrease' | 'stable';
}

export interface ScenarioData extends CalculatorInputs, PredictionResult {
  id: string;
  name: string;
  timestamp: number;
}