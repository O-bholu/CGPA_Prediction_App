import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import InputForm from './InputForm';
import ResultDisplay from './ResultDisplay';
import CGPAChart from './CGPAChart';
import ScenarioManager from './ScenarioManager';
import ExplanationSection from './ExplanationSection';
import { CalculatorInputs, PredictionResult, ScenarioData } from '../types';
import { calculateNewCGPA } from '../utils/calculations';
import { Save, Sun, Moon } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'cgpa-calculator-scenarios';

const CGPACalculator: React.FC = () => {
  const [inputs, setInputs] = useState<CalculatorInputs | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [scenarios, setScenarios] = useState<ScenarioData[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [scenarioName, setScenarioName] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [editScenario, setEditScenario] = useState<ScenarioData | null>(null);
  
  // Chart data state
  const [chartData, setChartData] = useState({
    labels: ['Current', 'Predicted'],
    values: [0, 0]
  });
  
  // Initialize dark mode based on user preference
  useEffect(() => {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDarkMode);
    
    if (prefersDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  // Load saved scenarios from local storage
  useEffect(() => {
    const savedScenarios = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedScenarios) {
      try {
        setScenarios(JSON.parse(savedScenarios));
      } catch (error) {
        console.error('Failed to load scenarios from local storage:', error);
      }
    }
  }, []);
  
  // Save scenarios to local storage whenever they change
  useEffect(() => {
    if (scenarios.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(scenarios));
    }
  }, [scenarios]);
  
  // Update chart data when results change
  useEffect(() => {
    if (inputs && result) {
      setChartData({
        labels: ['Current', 'Predicted'],
        values: [inputs.currentCGPA, result.newCGPA]
      });
    }
  }, [inputs, result]);
  
  const handleCalculate = (formInputs: CalculatorInputs) => {
    setInputs(formInputs);
    const calculationResult = calculateNewCGPA(formInputs);
    setResult(calculationResult);
    setShowResult(true);
    setEditScenario(null);
  };
  
  const handleSaveScenario = () => {
    if (!inputs || !result) return;
    
    const newScenario: ScenarioData = {
      id: editScenario ? editScenario.id : uuidv4(),
      name: scenarioName || `Prediction ${scenarios.length + 1}`,
      timestamp: Date.now(),
      ...inputs,
      ...result
    };
    
    if (editScenario) {
      setScenarios(prev => prev.map(s => s.id === editScenario.id ? newScenario : s));
    } else {
      setScenarios(prev => [...prev, newScenario]);
    }
    
    setScenarioName('');
    setShowSaveForm(false);
  };
  
  const handleDeleteScenario = (id: string) => {
    setScenarios(prev => prev.filter(s => s.id !== id));
    
    // If the currently edited scenario is deleted, clear the edit state
    if (editScenario && editScenario.id === id) {
      setEditScenario(null);
      setShowResult(false);
    }
  };
  
  const handleSelectScenario = (scenario: ScenarioData) => {
    setEditScenario(scenario);
    setInputs({
      currentCGPA: scenario.currentCGPA,
      lastSGPA: scenario.lastSGPA,
      upcomingSGPA: scenario.upcomingSGPA,
      totalCredits: scenario.totalCredits,
      lastSemCredits: scenario.lastSemCredits,
      upcomingSemCredits: scenario.upcomingSemCredits
    });
    setResult({
      newCGPA: scenario.newCGPA,
      difference: scenario.difference,
      trend: scenario.trend
    });
    setScenarioName(scenario.name);
    setShowResult(true);
  };
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };
  
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 transition-colors duration-200 dark:bg-gray-900 dark:text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">CGPA Prediction Calculator</h1>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-150"
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Enter Your Details</h2>
            <InputForm 
              onSubmit={handleCalculate} 
              initialValues={editScenario ? {
                currentCGPA: editScenario.currentCGPA,
                lastSGPA: editScenario.lastSGPA,
                upcomingSGPA: editScenario.upcomingSGPA,
                totalCredits: editScenario.totalCredits,
                lastSemCredits: editScenario.lastSemCredits,
                upcomingSemCredits: editScenario.upcomingSemCredits
              } : undefined}
            />
          </div>
          
          {scenarios.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <ScenarioManager 
                scenarios={scenarios} 
                onSelect={handleSelectScenario} 
                onDelete={handleDeleteScenario} 
              />
            </div>
          )}
          
          <div className="hidden lg:block">
            <ExplanationSection />
          </div>
        </div>
        
        <div className="lg:col-span-7 space-y-6">
          {showResult && inputs && result && (
            <div className="space-y-6 animate-fadeIn">
              <ResultDisplay 
                result={result} 
                inputs={inputs} 
                onSave={() => setShowSaveForm(true)}
              />
              
              {showSaveForm && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-medium mb-4">Save This Prediction</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="scenarioName" className="block text-sm font-medium mb-1">
                        Scenario Name
                      </label>
                      <input
                        id="scenarioName"
                        type="text"
                        value={scenarioName}
                        onChange={(e) => setScenarioName(e.target.value)}
                        placeholder={`Prediction ${scenarios.length + 1}`}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleSaveScenario}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out flex items-center justify-center"
                      >
                        <Save className="h-4 w-4 mr-1" />
                        {editScenario ? 'Update Scenario' : 'Save Scenario'}
                      </button>
                      <button
                        onClick={() => setShowSaveForm(false)}
                        className="flex-1 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 py-2 px-4 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium mb-4">CGPA Progression</h3>
                <CGPAChart data={chartData} height={250} />
              </div>
            </div>
          )}
          
          {!showResult && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
              <h3 className="text-xl font-medium mb-4">Welcome to CGPA Predictor</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Enter your current CGPA and expected SGPA to predict your new cumulative GPA.
              </p>
              <div className="flex justify-center">
                <img 
                  src="https://images.pexels.com/photos/4145354/pexels-photo-4145354.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Students studying" 
                  className="rounded-lg max-h-64 object-cover"
                />
              </div>
            </div>
          )}
          
          <div className="lg:hidden">
            <ExplanationSection />
          </div>
        </div>
      </div>
      
      <footer className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© {new Date().getFullYear()} CGPA Prediction App</p>
        <p className="mt-1">Made by Bholu Yadav</p>
      </footer>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CGPACalculator;