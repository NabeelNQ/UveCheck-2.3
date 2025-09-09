import React from 'react';

type SelectOption = string | { value: string; label: string };

interface SelectInputProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: SelectOption[];
    id: string;
}

const SelectInput: React.FC<SelectInputProps> = ({ label, value, onChange, options, id }) => {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-bold text-slate-700 mb-2">
                {label}
            </label>
            <div className="relative">
                 <select
                    id={id}
                    value={value}
                    onChange={onChange}
                    className="w-full appearance-none pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                >
                    {options.map((option) => {
                        const optionValue = typeof option === 'string' ? option : option.value;
                        const optionLabel = typeof option === 'string' ? option : option.label;
                        return (
                            <option key={optionValue} value={optionValue}>
                                {optionLabel}
                            </option>
                        );
                    })}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default SelectInput;