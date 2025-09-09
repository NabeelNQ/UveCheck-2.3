
import React from 'react';
import { useUveCheck } from './hooks/useUveCheck';
import IntroPage from './components/IntroPage';
import UveCheckForm from './components/UveCheckForm';
import ResultsPage from './components/ResultsPage';

const App: React.FC = () => {
    const {
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
    } = useUveCheck();

    const Header = () => (
        currentStep !== 'intro' && (
             <header className="text-center mb-8">
                <h1 className="text-3xl font-bold text-slate-900">UveCheck</h1>
                <p className="text-slate-600 mt-2">Predict the risk of uveitis in children</p>
            </header>
        )
    );

    const renderStep = () => {
        switch (currentStep) {
            case 'intro':
                return <IntroPage onNext={handleStart} />;
            case 'form':
                return (
                    <UveCheckForm
                        guideline={guidelineDetails}
                        selectedGuideline={selectedGuideline}
                        formData={formData}
                        onGuidelineChange={handleGuidelineChange}
                        onFormChange={handleFormChange}
                        onSubmit={handleSubmit}
                    />
                );
            case 'results':
                if (!result || !guidelineDetails) return null;
                return (
                    <ResultsPage 
                        result={result} 
                        onReset={handleReset} 
                        formData={formData}
                        questions={guidelineDetails.questions}
                    />
                );
            default:
                 return <IntroPage onNext={handleStart} />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
            <div className="w-full max-w-2xl mx-auto">
                <Header />
                <main className="bg-white p-6 sm:p-10 rounded-xl shadow-md">
                    {renderStep()}
                </main>
                 {currentStep !== 'intro' && (
                    <footer className="text-center mt-8 text-xs text-slate-400 max-w-lg mx-auto">
                        <p>UveCheck is for informational purposes only and does not constitute medical advice. Consult with a qualified healthcare professional for any medical concerns.</p>
                    </footer>
                 )}
            </div>
        </div>
    );
};

export default App;
