import React, { useState, useEffect } from 'react';
import { FormData, GuidelineDetails, Guideline } from '../types';
import DateInput from './ui/DateInput';
import SelectInput from './ui/SelectInput';
import RadioGroup from './ui/RadioGroup';
import Button from './ui/Button';
import { Question } from '../types';

const guidelines = [
    { name: 'Argentina', id: Guideline.ARGENTINA },
    { name: 'Czech', id: Guideline.CZECH_SLOVAK },
    { name: 'Germany', id: Guideline.GERMANY },
    { name: 'MIWGUC - Multinational Interdisciplinary Working Group for Uveitis in Childhood', id: Guideline.MIWGUC },
    { name: 'Nordic', id: Guideline.NORDIC },
    { name: 'Pakistan', id: Guideline.US_PAKISTAN },
    { name: 'Portugal', id: Guideline.SPAIN_PORTUGAL },
    { name: 'Slovakia', id: Guideline.CZECH_SLOVAK },
    { name: 'Spain', id: Guideline.SPAIN_PORTUGAL },
    { name: 'UK', id: Guideline.UK },
    { name: 'US', id: Guideline.US_PAKISTAN },
].sort((a, b) => a.name.localeCompare(b.name));


interface UveCheckFormProps {
    guideline: GuidelineDetails | null;
    selectedCountry: string;
    formData: FormData;
    onGuidelineChange: (selection: { country: string; guideline: Guideline } | null) => void;
    onFormChange: (field: keyof FormData, value: string) => void;
    onSubmit: () => void;
}

const UveCheckForm: React.FC<UveCheckFormProps> = ({ guideline, selectedCountry, formData, onGuidelineChange, onFormChange, onSubmit }) => {
    const [dateError, setDateError] = useState<string | null>(null);
    
    useEffect(() => {
        if (formData.birthDate && formData.diagDate) {
            const birth = new Date(formData.birthDate);
            const diag = new Date(formData.diagDate);
            if (diag < birth) {
                setDateError("Diagnosis date cannot be before birth date.");
            } else {
                setDateError(null);
            }
        } else {
            setDateError(null);
        }
    }, [formData.birthDate, formData.diagDate]);

    const isFormValid = guideline && !dateError ? guideline.questions.every(q => {
        const value = formData[q.key];
        return value !== '' && value !== null && value !== undefined;
    }) : false;

    const renderQuestion = (q: Question) => {
        const isDiagDate = q.key === 'diagDate';
        switch (q.type) {
            case 'date':
                return (
                    <div key={q.key}>
                        <DateInput
                            id={q.key}
                            label={q.label}
                            value={formData[q.key] as string}
                            onChange={(e) => onFormChange(q.key, e.target.value)}
                            minDate={isDiagDate ? formData.birthDate : undefined}
                            error={isDiagDate ? dateError : null}
                        />
                        {isDiagDate && dateError && <p className="text-red-600 text-xs mt-1">{dateError}</p>}
                    </div>
                );
            case 'select':
                return (
                    <SelectInput
                        key={q.key}
                        id={q.key}
                        label={q.label}
                        value={formData[q.key] as string}
                        onChange={(e) => onFormChange(q.key, e.target.value)}
                        options={q.options || []}
                    />
                );
            case 'radio':
                return (
                    <RadioGroup
                        key={q.key}
                        label={q.label}
                        name={q.key}
                        selectedValue={formData[q.key] as string}
                        onChange={(e) => onFormChange(q.key, e.target.value)}
                        options={q.options || []}
                    />
                );
            default:
                return null;
        }
    };
    
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const countryName = e.target.value;
        if (!countryName) {
            onGuidelineChange(null);
            return;
        }
        const selected = guidelines.find(g => g.name === countryName);
        if (selected) {
            onGuidelineChange({ country: selected.name, guideline: selected.id });
        }
    };

    const guidelineOptions = [{ value: '', label: 'Select an option' }, ...guidelines.map(g => ({ value: g.name, label: g.name }))];

    const dateQuestions = guideline?.questions.filter(q => q.key === 'birthDate' || q.key === 'diagDate') || [];
    const otherQuestions = guideline?.questions.filter(q => q.key !== 'birthDate' && q.key !== 'diagDate') || [];


    return (
        <div className="animate-fade-in">
             <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
                <SelectInput
                    id="guideline-selector"
                    label="Select Algorithm"
                    value={selectedCountry}
                    onChange={handleSelectChange}
                    options={guidelineOptions}
                />
            
                {guideline && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="grid sm:grid-cols-2 gap-6">
                            {dateQuestions.map(renderQuestion)}
                        </div>
                        {otherQuestions.map(renderQuestion)}
                        
                        <div className="pt-6 text-center">
                            <Button type="submit" disabled={!isFormValid}>
                                Calculate Risk
                            </Button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default UveCheckForm;
