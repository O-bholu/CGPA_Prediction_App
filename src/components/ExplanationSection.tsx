import React from 'react';
import { BookOpen, HelpCircle, AlertTriangle } from 'lucide-react';

const ExplanationSection: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-400 p-4 text-white flex items-center">
        <BookOpen className="h-5 w-5 mr-2" />
        <h3 className="text-lg font-semibold">Understanding CGPA Calculation</h3>
      </div>
      
      <div className="p-6 space-y-6">
        <div>
          <h4 className="text-md font-medium mb-2 flex items-center">
            <HelpCircle className="h-4 w-4 mr-1 text-indigo-500" />
            How is CGPA calculated?
          </h4>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Cumulative Grade Point Average (CGPA) is a weighted average of all semester SGPAs. 
            The weight for each semester is proportional to the number of credits taken in that semester.
          </p>
          <div className="mt-4 bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
            <p className="text-center font-medium mb-2">CGPA Formula</p>
            <div className="flex justify-center">
              <div className="text-center">
                <div className="border-b-2 border-gray-400 dark:border-gray-500 pb-1 mb-1">
                  <span>Σ (SGPA × Credits per semester)</span>
                </div>
                <div>
                  <span>Σ (Total credits)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-md font-medium mb-2 flex items-center">
            <HelpCircle className="h-4 w-4 mr-1 text-indigo-500" />
            Basic vs Advanced Calculation
          </h4>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            This calculator provides two calculation methods:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-2 text-gray-600 dark:text-gray-300">
            <li>
              <span className="font-medium">Basic Calculation</span>: Assumes equal credits for all semesters, 
              using a simple averaging method. This is a rough estimate.
            </li>
            <li>
              <span className="font-medium">Advanced Calculation</span>: Uses the actual credit hours for each semester 
              to calculate a weighted average, providing more accurate results.
            </li>
          </ul>
        </div>
        
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Important Note</h4>
              <p className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                This calculator provides an estimate based on the information you provide. The actual CGPA calculation may 
                vary based on your institution's specific policies regarding grade points, credit hours, and rounding methods.
              </p>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-md font-medium mb-2 flex items-center">
            <HelpCircle className="h-4 w-4 mr-1 text-indigo-500" />
            Tips for Accurate Predictions
          </h4>
          <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
            <li>Use the advanced options for more accurate results</li>
            <li>Ensure you enter the correct total credits completed so far</li>
            <li>Be realistic about your expected upcoming SGPA</li>
            <li>Save different scenarios to compare possible outcomes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExplanationSection;