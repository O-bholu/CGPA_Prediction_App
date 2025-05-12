import React from 'react';
import { ArrowDown, ArrowUp, Minus, Save } from 'lucide-react';
import { PredictionResult, CalculatorInputs } from '../types';
import { formatGPA } from '../utils/calculations';

interface ResultDisplayProps {
  result: PredictionResult;
  inputs: CalculatorInputs;
  onSave?: () => void;
  showSaveButton?: boolean;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ 
  result, 
  inputs, 
  onSave,
  showSaveButton = true
}) => {
  const { newCGPA, difference, trend } = result;
  const { currentCGPA, lastSGPA, upcomingSGPA } = inputs;
  
  const getTrendIcon = () => {
    switch (trend) {
      case 'increase':
        return <ArrowUp className="h-6 w-6 text-green-500" />;
      case 'decrease':
        return <ArrowDown className="h-6 w-6 text-red-500" />;
      case 'stable':
        return <Minus className="h-6 w-6 text-gray-500" />;
    }
  };
  
  const getTrendColor = () => {
    switch (trend) {
      case 'increase':
        return 'text-green-500';
      case 'decrease':
        return 'text-red-500';
      case 'stable':
        return 'text-gray-500';
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800 transform transition-all duration-300 ease-in-out">
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-4 text-white">
        <h3 className="text-lg font-semibold">Prediction Result</h3>
      </div>
      
      <div className="p-6">
        <div className="flex flex-col items-center mb-6 space-y-4">
          <div className="flex items-center justify-center space-x-4">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1 dark:text-gray-400">Current CGPA</p>
              <p className="text-xl font-bold">{formatGPA(currentCGPA)}</p>
            </div>
            
            <div className="flex items-center justify-center h-10 w-10">
              {getTrendIcon()}
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1 dark:text-gray-400">Predicted CGPA</p>
              <p className="text-3xl font-bold">{formatGPA(newCGPA)}</p>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Change in CGPA</p>
            <p className={`text-xl font-medium ${getTrendColor()}`}>
              {difference > 0 ? '+' : ''}{formatGPA(difference)}
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gray-100 p-4 rounded-md dark:bg-gray-700">
            <h4 className="text-md font-medium mb-2">Calculation Details</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Current CGPA:</span>
                <span className="font-medium">{formatGPA(currentCGPA)}</span>
              </li>
              <li className="flex justify-between">
                <span>Last Semester SGPA:</span>
                <span className="font-medium">{formatGPA(lastSGPA)}</span>
              </li>
              <li className="flex justify-between">
                <span>Expected Upcoming SGPA:</span>
                <span className="font-medium">{formatGPA(upcomingSGPA)}</span>
              </li>
              {inputs.totalCredits && inputs.upcomingSemCredits && (
                <>
                  <li className="flex justify-between">
                    <span>Total Credits Completed:</span>
                    <span className="font-medium">{inputs.totalCredits}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Upcoming Semester Credits:</span>
                    <span className="font-medium">{inputs.upcomingSemCredits}</span>
                  </li>
                </>
              )}
            </ul>
          </div>
          
          {showSaveButton && onSave && (
            <button
              onClick={handleSave}
              className="flex items-center justify-center w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
            >
              <Save className="h-4 w-4 mr-1" />
              Save this prediction
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;