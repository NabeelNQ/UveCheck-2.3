
import { useState, useCallback } from 'react';
import { Guideline, FormData, Result, GuidelineDetails } from '../types';
import { calculateRisk } from '../services/riskCalculator';
import { GUIDELINE_QUESTIONS } from '../constants';


const GUIDELINE_DETAILS_MAP: Record<Guideline, {name: string}> = {
    [Guideline.NORDIC]: { name: "Nordic Guidelines" },
    [Guideline.US_PAKISTAN]: { name: "US / Pakistan Guidelines" },
    [Guideline.GERMANY]: { name: "Germany Guidelines" },
    [Guideline.SPAIN_PORTUGAL]: { name: "Spain / Portugal Guidelines" },
    [Guideline.UK]: { name: "UK Guidelines" },
    [Guideline.CZECH_SLOVAK]: { name: "Czech / Slovak Guidelines" },
    [Guideline.ARGENTINA]: { name: "Argentina Guidelines" },
    [Guideline.MIWGUC]: { name: "MIWGUC Guidelines" },
};


const initialFormData: FormData = {
    birthDate: '',
    diagDate: '',
    subDiagnosis: '',
    ana: '',
    methotrexate: '',
    biologicTreatment: '',
};

type Step = 'intro' | 'form' | 'results';

export const useUveCheck = () => {
    const [currentStep, setCurrentStep] = useState<Step>('intro');
    const [selectedGuideline, setSelectedGuideline] = useState<Guideline | null>(null);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [result, setResult] = useState<Result | null>(null);

    const handleStart = useCallback(() => {
        setCurrentStep('form');
    }, []);

    const handleGuidelineChange = useCallback((guideline: Guideline | null) => {
        setSelectedGuideline(guideline);
        
        if (guideline) {
            const questions = GUIDELINE_QUESTIONS[guideline];
            const defaultSubDiagnosis = questions.find(q => q.key === 'subDiagnosis')?.options?.[0] || '';
            const defaultBiologic = questions.find(q => q.key === 'biologicTreatment')?.options?.[0] || '';
            
            setFormData({
                ...initialFormData,
                subDiagnosis: defaultSubDiagnosis,
                biologicTreatment: defaultBiologic,
            });
        } else {
             setFormData(initialFormData);
        }
    }, []);

    const handleFormChange = useCallback((field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);
    
    const handleSubmit = useCallback(() => {
        if (selectedGuideline) {
            const calculatedResult = calculateRisk(selectedGuideline, formData);
            setResult(calculatedResult);
            setCurrentStep('results');
        }
    }, [selectedGuideline, formData]);

    const handleReset = useCallback(() => {
        setCurrentStep('intro');
        setSelectedGuideline(null);
        setFormData(initialFormData);
        setResult(null);
    }, []);
    
    const guidelineDetails: GuidelineDetails | null = selectedGuideline ? {
        id: selectedGuideline,
        name: GUIDELINE_DETAILS_MAP[selectedGuideline].name,
        questions: GUIDELINE_QUESTIONS[selectedGuideline],
    } : null;

    return {
        currentStep,
        selectedGuideline,
        formData,
        result,
        handleStart,
        handleGuidelineChange,
        handleFormChange,
        handleSubmit,
        handleReset,
        guidelineDetails,
    };
};
