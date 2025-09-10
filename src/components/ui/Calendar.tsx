import React, { useState, useEffect, useMemo } from 'react';

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

interface CalendarProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectDate: (date: Date) => void;
    value: string; // YYYY-MM-DD
    minDate?: string; // YYYY-MM-DD
}

const Calendar: React.FC<CalendarProps> = ({ isOpen, onClose, onSelectDate, value, minDate }) => {
    const selectedDate = useMemo(() => value ? new Date(value + 'T00:00:00') : null, [value]);
    const minimumDate = useMemo(() => minDate ? new Date(minDate + 'T00:00:00') : null, [minDate]);
    const [currentDate, setCurrentDate] = useState(value ? new Date(value + 'T00:00:00') : new Date());
    
    const years = useMemo(() => {
        const currentYear = new Date().getFullYear();
        return Array.from({ length: 101 }, (_, i) => currentYear - i);
    }, []);

    useEffect(() => {
        setCurrentDate(value ? new Date(value + 'T00:00:00') : new Date());
    }, [value, isOpen]);
    
    if (!isOpen) return null;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const calendarDays = [];
    for (let i = 0; i < firstDay; i++) {
        calendarDays.push(<div key={`prev-${i}`} className="p-2"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
        const isToday = date.toDateString() === new Date().toDateString();
        const isDisabled = minimumDate ? date < minimumDate : false;

        let dayClasses = "w-10 h-10 flex items-center justify-center rounded-full transition-colors";
        if (isDisabled) {
            dayClasses += " text-slate-300 cursor-not-allowed";
        } else if (isSelected) {
            dayClasses += " bg-slate-800 text-white";
        } else if (isToday) {
            dayClasses += " bg-slate-200 text-slate-800";
        } else {
            dayClasses += " hover:bg-slate-100 cursor-pointer";
        }

        calendarDays.push(
            <div key={day} className="flex justify-center items-center">
                <button type="button" onClick={() => onSelectDate(date)} className={dayClasses} disabled={isDisabled}>
                    {day}
                </button>
            </div>
        );
    }

    const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newYear = parseInt(e.target.value, 10);
        setCurrentDate(new Date(newYear, month, 1));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-25" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl p-4 w-full max-w-xs" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <button type="button" onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-slate-100">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                    <div className="font-bold text-slate-800 flex items-center space-x-2">
                        <span>{MONTH_NAMES[month]}</span>
                        <div className="relative flex items-center">
                            <select value={year} onChange={handleYearChange} className="font-bold bg-white border-none appearance-none focus:ring-0 p-1 pr-6 cursor-pointer">
                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-1 pointer-events-none">
                                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>
                    <button type="button" onClick={handleNextMonth} className="p-2 rounded-full hover:bg-slate-100">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-sm text-slate-500 mb-2">
                    <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
                </div>
                <div className="grid grid-cols-7 gap-y-1">
                    {calendarDays}
                </div>
            </div>
        </div>
    );
};

export default Calendar;
