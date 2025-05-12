import React, { useState, useEffect } from 'react';
import { Trash2, Clock, Edit } from 'lucide-react';
import { ScenarioData } from '../types';
import { formatGPA } from '../utils/calculations';

interface ScenarioManagerProps {
  scenarios: ScenarioData[];
  onSelect: (scenario: ScenarioData) => void;
  onDelete: (id: string) => void;
}

const ScenarioManager: React.FC<ScenarioManagerProps> = ({ 
  scenarios, 
  onSelect, 
  onDelete 
}) => {
  const [sortedScenarios, setSortedScenarios] = useState<ScenarioData[]>([]);
  
  useEffect(() => {
    // Sort scenarios by timestamp (newest first)
    const sorted = [...scenarios].sort((a, b) => b.timestamp - a.timestamp);
    setSortedScenarios(sorted);
  }, [scenarios]);
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onDelete(id);
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Saved Predictions</h3>
      
      {sortedScenarios.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No predictions saved yet</p>
          <p className="text-sm mt-2">Your saved predictions will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedScenarios.map((scenario) => (
            <div 
              key={scenario.id}
              onClick={() => onSelect(scenario)}
              className="relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-150"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{scenario.name || 'Untitled Prediction'}</h4>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{formatDate(scenario.timestamp)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-lg font-semibold">{formatGPA(scenario.newCGPA)}</span>
                  <span className={`text-sm ${
                    scenario.trend === 'increase' 
                      ? 'text-green-500' 
                      : scenario.trend === 'decrease' 
                        ? 'text-red-500' 
                        : 'text-gray-500'
                  }`}>
                    {scenario.difference > 0 ? '+' : ''}{formatGPA(scenario.difference)}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Current: {formatGPA(scenario.currentCGPA)}
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                  Expected: {formatGPA(scenario.upcomingSGPA)}
                </span>
              </div>
              
              <button
                onClick={(e) => handleDelete(e, scenario.id)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors duration-150"
                aria-label="Delete scenario"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              
              <div className="absolute bottom-2 right-2 flex items-center text-blue-600 dark:text-blue-400">
                <Edit className="h-3 w-3 mr-1" />
                <span className="text-xs">Edit</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScenarioManager;