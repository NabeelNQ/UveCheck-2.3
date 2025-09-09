import React from 'react';
import Button from './ui/Button';

interface IntroPageProps {
    onNext: () => void;
}

const guidelines = [
    { name: 'Argentina – National Clinical Practice Guidelines for JIA (2011)', url: 'https://www.reumatologia.org.ar/recursos/guia_artritis_idiopatica_2011.pdf' },
    { name: 'Czech Republic & Slovakia – SHARE Initiative Adaptation (2020)', url: 'https://doi.org/10.31348/2020/7' },
    { name: 'Germany – Nationwide study with proposed guideline modifications (2007)', url: 'https://doi.org/10.1093/rheumatology/kem053' },
    { name: 'MIWGUC (Multinational Group) – Practical global approach (2024)', url: 'https://doi.org/10.1136/bjo-2023-324406' },
    { name: 'Nordic Countries – Nordic screening guideline (2022)', url: 'https://doi.org/10.1111/aos.15299' },
    { name: 'Portugal – Joint Ophthalmology & Paediatric Rheumatology guidelines (2021)', url: 'https://arpopenrheumatology.com/article/view/15556' },
    { name: 'Spain – Treatment recommendations for JIA-associated uveitis (2014)', url: 'https://doi.org/10.1007/s11926-014-0437-4' },
    { name: 'United Kingdom Guidelines', url: null },
    { name: 'United States & Pakistan – ACR/Arthritis Foundation guideline (2019)', url: 'https://doi.org/10.1002/acr.23871' },
].sort((a,b) => a.name.localeCompare(b.name));

const IntroPage: React.FC<IntroPageProps> = ({ onNext }) => {
    return (
        <div className="animate-fade-in text-slate-700 space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-slate-900">UveCheck</h2>
                <p className="text-slate-600 mt-2 text-lg">Predict the risk of uveitis in children</p>
            </div>
            
            <p>UveCheck is a specialized health screening app designed to support the early detection of uveitis in children with juvenile idiopathic arthritis (JIA).</p>
            <p>By applying advanced algorithms to key risk factors, the app generates personalized screening recommendations. It equips healthcare professionals with actionable insights, enabling timely clinical decisions and improving patient outcomes.</p>

            <div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Guideline-Driven, Globally Informed</h3>
                <p className="mb-4">UveCheck integrates evidence-based recommendations from leading global guidelines:</p>
                <ul className="space-y-2 text-sm">
                    {guidelines.map(g => (
                        <li key={g.name} className="flex items-start">
                            <span className="mr-2">👉</span>
                            {g.url ? (
                                <a href={g.url} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-slate-900 hover:underline transition-colors">
                                    {g.name}
                                </a>
                            ) : (
                                <span className="text-slate-600">{g.name}</span>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            
            <p>This multi-regional foundation makes UveCheck adaptable to diverse healthcare systems while maintaining scientific rigor and clinical reliability.</p>
            
            <div>
                 <h3 className="text-xl font-bold text-slate-800 mb-3">Why UveCheck?</h3>
                 <ul className="space-y-2">
                    <li className="flex items-center"><span className="mr-2">✅</span><strong>Evidence-based</strong> – Built on international best practices</li>
                    <li className="flex items-center"><span className="mr-2">✅</span><strong>Personalized</strong> – Tailored screening recommendations per child</li>
                    <li className="flex items-center"><span className="mr-2">✅</span><strong>Proactive</strong> – Helps prevent avoidable vision loss</li>
                </ul>
            </div>

            <p className="font-semibold">Stay informed. Stay proactive. Strengthen uveitis care with UveCheck.</p>

            <div className="pt-6 text-center">
                <Button onClick={onNext}>
                    Start Assessment
                </Button>
            </div>
        </div>
    );
};

export default IntroPage;