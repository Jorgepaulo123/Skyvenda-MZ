import React from 'react';
import { Check } from 'lucide-react';

export default function StepIndicator({ currentStep, steps }) {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-center space-x-4">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 
              ${index + 1 <= currentStep 
                ? 'border-indigo-600 bg-indigo-600 text-white' 
                : 'border-gray-300 text-gray-300'}`}
            >
              {index + 1 < currentStep ? (
                <Check className="w-4 h-4" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-12 h-1 mx-2 ${
                index + 1 < currentStep ? 'bg-indigo-600' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-around mt-2">
        {steps.map((step) => (
          <span key={step} className="text-xs text-gray-500">{step}</span>
        ))}
      </div>
    </div>
  );
}