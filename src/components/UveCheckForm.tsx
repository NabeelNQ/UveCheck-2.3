import React from 'react';
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
    selectedGuideline: Guideline | null;
    formData: FormData;
    onGuidelineChange: (guideline: Guideline | null) => void;
    onFormChange: (field: keyof FormData, value: string) => void;
    onSubmit: () => void;
}

const UveCheckForm: React.FC<UveCheckFormProps> = ({ guideline, selectedGuideline, formData, onGuidelineChange, onFormChange, onSubmit }) => {
    const isFormValid = guideline ? guideline.questions.every(q => {
        const value = formData[q.key];
        // For radio buttons, '' is a valid initial state but not a valid final answer.
        // For other inputs, we just check for presence.
        return value !== '' && value !== null && value !== undefined;
    }) : false;

    const renderQuestion = (q: Question) => {
        switch (q.type) {
            case 'date':
                return (
                    <DateInput
                        key={q.key}
                        id={q.key}
                        label={q.label}
                        value={formData[q.key] as string}
                        onChange={(e) => onFormChange(q.key, e.target.value)}
                    />
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
    
    const guidelineOptions = [{ value: '', label: 'Select an option' }, ...guidelines.map(g => ({ value: g.id, label: g.name }))];

    const dateQuestions = guideline?.questions.filter(q => q.key === 'birthDate' || q.key === 'diagDate') || [];
    const otherQuestions = guideline?.questions.filter(q => q.key !== 'birthDate' && q.key !== 'diagDate') || [];


    return (
        <div className="animate-fade-in">
             <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
                <SelectInput
                    id="guideline-selector"
                    label="Select Algorithm"
                    value={selectedGuideline || ''}
                    onChange={(e) => onGuidelineChange(e.target.value as Guideline || null)}
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