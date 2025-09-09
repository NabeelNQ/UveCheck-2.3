
import React from 'react';
import { Result, FormData, Question } from '../types';
import Button from './ui/Button';
import Card from './ui/Card';
import { formatDateForDisplay } from '../services/dateUtils';

interface ResultsPageProps {
    result: Result;
    onReset: () => void;
    formData: FormData;
    questions: Question[];
}

const ResultsPage: React.FC<ResultsPageProps> = ({ result, onReset, formData, questions }) => {
    
    const getRiskColor = (riskLevel: string) => {
        const level = riskLevel.toLowerCase();
        if (level.includes('high')) return 'bg-red-50 text-red-800 border-red-200';
        if (level.includes('medium')) return 'bg-yellow-50 text-yellow-800 border-yellow-200';
        if (level.includes('low')) return 'bg-green-50 text-green-800 border-green-200';
        return 'bg-slate-100 text-slate-800 border-slate-200';
    };

    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Assessment Result</h2>
            
            <Card className={`mb-6 text-center ${getRiskColor(result.riskLevel)} border`}>
                <span className="text-sm font-semibold uppercase tracking-wider">Risk Level</span>
                <p className="text-3xl font-bold mt-1">{result.riskLevel}</p>
            </Card>

            <div className="text-left space-y-4">
                 <Card>
                    <h3 className="font-bold text-lg text-slate-800">Recommendation</h3>
                    <p className="text-slate-700 mt-1">{result.recommendation}</p>
                </Card>
                 <Card>
                    <h3 className="font-bold text-lg text-slate-800">Follow Up</h3>
                    <p className="text-slate-700 mt-1">{result.followUp}</p>
                </Card>
                 <Card>
                    <h3 className="font-bold text-lg text-slate-800">Justification</h3>
                    <p className="text-slate-700 mt-1">{result.justification}</p>
                </Card>
            </div>

            <div className="mt-8 text-left">
                <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">Input Summary</h3>
                 <Card className="space-y-4 bg-slate-50 border-slate-200">
                    {questions.map((q, index) => (
                        <div key={q.key}>
                            <p className="text-sm font-bold text-slate-700">{index + 1}. {q.label}</p>
                            <p className="text-slate-800 mt-1 pl-4">
                                {q.type === 'date' ? formatDateForDisplay(formData[q.key] as string) : (formData[q.key] || 'N/A')}
                            </p>
                        </div>
                    ))}
                </Card>
            </div>

            <div className="mt-8 text-center">
                <Button onClick={onReset} variant="primary">
                    Start New Assessment
                </Button>
            </div>
        </div>
    );
};

export default ResultsPage;