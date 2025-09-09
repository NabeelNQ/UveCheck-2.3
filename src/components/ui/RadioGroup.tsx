import React from 'react';

interface RadioGroupProps {
    label: string;
    name: string;
    options: string[];
    selectedValue: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ label, name, options, selectedValue, onChange }) => {
    return (
        <div>
            <span className="block text-sm font-bold text-gray-700 mb-2">{label}</span>
            <div className="flex items-center space-x-4">
                {options.map((option) => (
                    <label key={option} className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="radio"
                            name={name}
                            value={option}
                            checked={selectedValue === option}
                            onChange={onChange}
                            className="h-4 w-4 text-gray-800 border-gray-300 focus:ring-gray-500"
                        />
                        <span className="text-gray-800">{option}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default RadioGroup;