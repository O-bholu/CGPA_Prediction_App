import { CalculatorInputs, PredictionResult } from '../types';

/**
 * Calculates the new CGPA based on the provided inputs
 */
export function calculateNewCGPA(inputs: CalculatorInputs): PredictionResult {
  const { currentCGPA, lastSGPA, upcomingSGPA, totalCredits, lastSemCredits, upcomingSemCredits } = inputs;
  
  let newCGPA: number;
  
  // If we have detailed credit information, use the weighted calculation
  if (totalCredits && totalCredits > 0 && lastSemCredits && upcomingSemCredits) {
    // Calculate total credit points before the upcoming semester
    const prevTotalPoints = currentCGPA * totalCredits;
    
    // Calculate new total credits after the upcoming semester
    const newTotalCredits = totalCredits + upcomingSemCredits;
    
    // Calculate new total points including the upcoming semester
    const newTotalPoints = prevTotalPoints + (upcomingSGPA * upcomingSemCredits);
    
    // Calculate new CGPA
    newCGPA = newTotalPoints / newTotalCredits;
  } else {
    // Simple calculation (assuming equal credits for all semesters)
    // If we don't know the semester count, we'll assume the lastSGPA represents
    // the most recent semester in the current CGPA
    newCGPA = (currentCGPA + upcomingSGPA) / 2;
  }
  
  // Round to 2 decimal places
  newCGPA = Math.round(newCGPA * 100) / 100;
  
  const difference = Math.round((newCGPA - currentCGPA) * 100) / 100;
  
  return {
    newCGPA,
    difference,
    trend: difference > 0 ? 'increase' : difference < 0 ? 'decrease' : 'stable'
  };
}

/**
 * Validates that the input is a number and within the GPA range
 */
export function validateGPAInput(value: string): boolean {
  const num = parseFloat(value);
  return !isNaN(num) && num >= 0 && num <= 10;
}

/**
 * Validates that the input is a positive number
 */
export function validatePositiveNumber(value: string): boolean {
  const num = parseFloat(value);
  return !isNaN(num) && num > 0;
}

/**
 * Formats a number to display with 2 decimal places
 */
export function formatGPA(value: number): string {
  return value.toFixed(2);
}