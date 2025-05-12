import React, { useState, useEffect } from 'react';
import { AlertCircle, Info } from 'lucide-react';
import { CalculatorInputs } from '../types';
import { validateGPAInput, validatePositiveNumber } from '../utils/calculations';

interface InputFormProps {
  onSubmit: (inputs: CalculatorInputs) => void;
  loading?: boolean;
  initialValues?: Partial<CalculatorInputs>;
}

const InputForm: React.FC<InputFormProps> = ({ 
  onSubmit, 
  loading = false,
  initialValues
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const [inputs, setInputs] = useState<CalculatorInputs>({
    currentCGPA: initialValues?.currentCGPA || 0,
    lastSGPA: initialValues?.lastSGPA || 0,
    upcomingSGPA: initialValues?.upcomingSGPA || 0,
    totalCredits: initialValues?.totalCredits || 0,
    lastSemCredits: initialValues?.lastSemCredits || 0,
    upcomingSemCredits: initialValues?.upcomingSemCredits || 0,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialValues) {
      setInputs(prev => ({
        ...prev,
        ...initialValues
      }));
      
      if (initialValues.totalCredits || initialValues.lastSemCredits || initialValues.upcomingSemCredits) {
        setShowAdvanced(true);
      }
    }
  }, [initialValues]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    let error = '';
    if (value && !validateGPAInput(value) && ['currentCGPA', 'lastSGPA', 'upcomingSGPA'].includes(name)) {
      error = 'Please enter a valid GPA (0-10)';
    } else if (value && !validatePositiveNumber(value) && ['totalCredits', 'lastSemCredits', 'upcomingSemCredits'].includes(name)) {
      error = 'Please enter a positive number';
    }
    
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
    
    setInputs(prev => ({
      ...prev,
      [name]: value === '' ? 0 : parseFloat(value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const newErrors: Record<string, string> = {};
    if (inputs.currentCGPA === 0) newErrors.currentCGPA = 'Current CGPA is required';
    if (inputs.upcomingSGPA === 0) newErrors.upcomingSGPA = 'Expected SGPA is required';
    
    if (showAdvanced) {
      if (inputs.totalCredits === 0) newErrors.totalCredits = 'Total credits is required for advanced calculation';
      if (inputs.upcomingSemCredits === 0) newErrors.upcomingSemCredits = 'Upcoming semester credits is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit(inputs);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="currentCGPA" className="block text-sm font-medium mb-1">
            Current CGPA
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <input
              id="currentCGPA"
              name="currentCGPA"
              type="number"
              step="0.01"
              min="0"
              max="10"
              value={inputs.currentCGPA || ''}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black
                ${errors.currentCGPA ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter your current CGPA"
            />
            {errors.currentCGPA && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.currentCGPA && (
            <p className="mt-1 text-sm text-red-500">{errors.currentCGPA}</p>
          )}
        </div>

        <div>
          <label htmlFor="lastSGPA" className="block text-sm font-medium mb-1">
            Last Semester SGPA
          </label>
          <input
            id="lastSGPA"
            name="lastSGPA"
            type="number"
            step="0.01"
            min="0"
            max="10"
            value={inputs.lastSGPA || ''}
            onChange={handleInputChange}
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black
              ${errors.lastSGPA ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter your last semester SGPA"
          />
          {errors.lastSGPA && (
            <p className="mt-1 text-sm text-red-500">{errors.lastSGPA}</p>
          )}
        </div>

        <div>
          <label htmlFor="upcomingSGPA" className="block text-sm font-medium mb-1">
            Expected Upcoming SGPA
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <input
              id="upcomingSGPA"
              name="upcomingSGPA"
              type="number"
              step="0.01"
              min="0"
              max="10"
              value={inputs.upcomingSGPA || ''}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black
                ${errors.upcomingSGPA ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter your expected SGPA"
            />
            {errors.upcomingSGPA && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.upcomingSGPA && (
            <p className="mt-1 text-sm text-red-500">{errors.upcomingSGPA}</p>
          )}
        </div>
      </div>

      <div>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
        >
          <Info className="h-4 w-4 mr-1" />
          {showAdvanced ? 'Hide' : 'Show'} advanced options
        </button>
      </div>

      {showAdvanced && (
        <div className="space-y-4 bg-gray-50 p-4 rounded-md dark:bg-gray-800">
          <div>
            <label htmlFor="totalCredits" className="block text-sm font-medium mb-1">
              Total Credits Completed
              {showAdvanced && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              id="totalCredits"
              name="totalCredits"
              type="number"
              min="0"
              value={inputs.totalCredits || ''}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black
                ${errors.totalCredits ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter total credits completed so far"
            />
            {errors.totalCredits && (
              <p className="mt-1 text-sm text-red-500">{errors.totalCredits}</p>
            )}
          </div>

          <div>
            <label htmlFor="lastSemCredits" className="block text-sm font-medium mb-1">
              Last Semester Credits
            </label>
            <input
              id="lastSemCredits"
              name="lastSemCredits"
              type="number"
              min="0"
              value={inputs.lastSemCredits || ''}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black
                ${errors.lastSemCredits ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter credits for last semester"
            />
            {errors.lastSemCredits && (
              <p className="mt-1 text-sm text-red-500">{errors.lastSemCredits}</p>
            )}
          </div>

          <div>
            <label htmlFor="upcomingSemCredits" className="block text-sm font-medium mb-1">
              Upcoming Semester Credits
              {showAdvanced && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              id="upcomingSemCredits"
              name="upcomingSemCredits"
              type="number"
              min="0"
              value={inputs.upcomingSemCredits || ''}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black
                ${errors.upcomingSemCredits ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter credits for upcoming semester"
            />
            {errors.upcomingSemCredits && (
              <p className="mt-1 text-sm text-red-500">{errors.upcomingSemCredits}</p>
            )}
          </div>
        </div>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Calculating...' : 'Calculate Predicted CGPA'}
        </button>
      </div>
    </form>
  );
};

export default InputForm;