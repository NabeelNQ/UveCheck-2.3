import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';

interface DateInputProps {
    label: string;
    value: string; // YYYY-MM-DD
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    id: string;
}

const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
};

const DateInput: React.FC<DateInputProps> = ({ label, value, onChange, id }) => {
    const [isCalendarOpen, setCalendarOpen] = useState(false);
    const [displayValue, setDisplayValue] = useState(formatDateForDisplay(value));

    // Sync display value when the prop changes (e.g., from calendar selection)
    useEffect(() => {
        setDisplayValue(formatDateForDisplay(value));
    }, [value]);

    const handleDateSelect = (date: Date) => {
        // Format to YYYY-MM-DD for consistency with input[type=date]
        const formattedDate = date.toISOString().split('T')[0];
        const event = {
            target: {
                id,
                value: formattedDate,
                name: id,
            },
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
        setCalendarOpen(false);
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDisplayValue(e.target.value);
    };

    const handleBlur = () => {
        const parts = displayValue.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        if (parts) {
            const day = parseInt(parts[1], 10);
            const month = parseInt(parts[2], 10);
            const year = parseInt(parts[3], 10);

            if (month > 0 && month <= 12 && day > 0 && day <= 31) {
                const date = new Date(year, month - 1, day);
                // Final check to prevent invalid dates like 31/02/2023
                if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) {
                    const formattedDate = date.toISOString().split('T')[0];
                    const event = { target: { id, value: formattedDate, name: id } } as unknown as React.ChangeEvent<HTMLInputElement>;
                    onChange(event);
                    return;
                }
            }
        }
        // If input is invalid, revert to the last valid value from props
        setDisplayValue(formatDateForDisplay(value));
    };

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-bold text-slate-700 mb-2">
                {label}
            </label>
            <div className="relative">
                <input
                    type="text"
                    id={id}
                    value={displayValue}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                    placeholder="dd/mm/yyyy"
                />
                <button type="button" onClick={() => setCalendarOpen(true)} className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </button>
            </div>
            <Calendar
                isOpen={isCalendarOpen}
                onClose={() => setCalendarOpen(false)}
                onSelectDate={handleDateSelect}
                value={value}
            />
        </div>
    );
};

export default DateInput;