
import { Question, Guideline } from './types';

const SUBDIAGNOSIS_NORDIC = [
    "Oligoarthritis", "RF Negative Polyarthritis", "Psoriatic Arthritis", 
    "RF Positive Arthritis", "Enthesitis related Arthritis", "Systemic Onset Arthritis", 
    "Undifferentiated Arthritis"
];
const BIOLOGIC_TREATMENT_NORDIC = ["Adalimumab", "Certolizumab", "Golimumab", "Infliximab", "Etanercept", "None / Other"];

const SUBDIAGNOSIS_US_PAKISTAN = [
    "Extended Oligoarthritis", "Persistent Oligoarthritis", "RF Negative Polyarthritis",
    "Psoriatic Arthritis", "RF Positive Arthritis", "Enthesitis related Arthritis",
    "Systemic onset Arthritis", "Undifferentiated Arthritis"
];

const SUBDIAGNOSIS_GERMANY_SPAIN_PORTUGAL_ARGENTINA = [
    "Persistent Oligoarthritis", "Extended Oligoarthritis", "RF Negative Polyarthritis",
    "Psoriatic Arthritis", "RF Positive Arthritis", "Enthesitis related Arthritis",
    "Systemic onset Arthritis", "Undifferentiated Arthritis"
];

const SUBDIAGNOSIS_UK = [
    "Persistent Oligoarthritis", "Extended Oligoarthritis", "RF Negative Polyarthritis",
    "Psoriatic Arthritis", "Enthesitis-related Arthritis", "RF Positive Polyarthritis",
    "Systemic Onset Arthritis"
];

const SUBDIAGNOSIS_CZECH_SLOVAK = [
    "Persistent Oligoarthritis", "Extended Oligoarthritis", "RF Negative Polyarthritis",
    "Psoriatic Arthritis", "RF Positive Polyarthritis", "Systemic Onset Arthritis",
    "HLAB27+ Arthritis"
];

const SUBDIAGNOSIS_MIWGUC = ["Juvenile Idiopathic Arthritis", "Systemic-onset Arthritis"];

const commonQuestions: { [key: string]: Question } = {
    birthDate: { key: 'birthDate', label: "Patient's Date of Birth", type: 'date' },
    diagDate: { key: 'diagDate', label: 'Date of Diagnosis of Arthritis', type: 'date' },
    ana: { key: 'ana', label: 'Antinuclear Antibody (ANA)', type: 'radio', options: ['Yes', 'No'] },
};

export const GUIDELINE_QUESTIONS: Record<Guideline, Question[]> = {
    [Guideline.NORDIC]: [
        commonQuestions.birthDate,
        commonQuestions.diagDate,
        { key: 'subDiagnosis', label: 'Sub-diagnosis of Arthritis', type: 'select', options: SUBDIAGNOSIS_NORDIC },
        commonQuestions.ana,
        { key: 'methotrexate', label: 'On Methotrexate?', type: 'radio', options: ['Yes', 'No'] },
        { key: 'biologicTreatment', label: 'Biologic Treatment', type: 'select', options: BIOLOGIC_TREATMENT_NORDIC },
    ],
    [Guideline.US_PAKISTAN]: [
        commonQuestions.birthDate,
        commonQuestions.diagDate,
        { key: 'subDiagnosis', label: 'Sub-diagnosis of Arthritis', type: 'select', options: SUBDIAGNOSIS_US_PAKISTAN },
        commonQuestions.ana,
    ],
    [Guideline.GERMANY]: [
        commonQuestions.birthDate,
        commonQuestions.diagDate,
        { key: 'subDiagnosis', label: 'Sub-diagnosis of Arthritis', type: 'select', options: SUBDIAGNOSIS_GERMANY_SPAIN_PORTUGAL_ARGENTINA },
        commonQuestions.ana,
    ],
    [Guideline.SPAIN_PORTUGAL]: [
        commonQuestions.birthDate,
        commonQuestions.diagDate,
        { key: 'subDiagnosis', label: 'Sub-diagnosis of Arthritis', type: 'select', options: SUBDIAGNOSIS_GERMANY_SPAIN_PORTUGAL_ARGENTINA },
        commonQuestions.ana,
    ],
    [Guideline.UK]: [
        commonQuestions.birthDate,
        commonQuestions.diagDate,
        { key: 'subDiagnosis', label: 'Sub-diagnosis of Arthritis', type: 'select', options: SUBDIAGNOSIS_UK },
        commonQuestions.ana,
    ],
    [Guideline.CZECH_SLOVAK]: [
        commonQuestions.birthDate,
        commonQuestions.diagDate,
        { key: 'subDiagnosis', label: 'Sub-diagnosis of Arthritis', type: 'select', options: SUBDIAGNOSIS_CZECH_SLOVAK },
        commonQuestions.ana,
    ],
    [Guideline.ARGENTINA]: [
        commonQuestions.birthDate,
        commonQuestions.diagDate,
        { key: 'subDiagnosis', label: 'Sub-diagnosis of Arthritis', type: 'select', options: SUBDIAGNOSIS_GERMANY_SPAIN_PORTUGAL_ARGENTINA.filter(d => d !== "Undifferentiated Arthritis") },
        commonQuestions.ana,
    ],
    [Guideline.MIWGUC]: [
        commonQuestions.birthDate,
        commonQuestions.diagDate,
        { key: 'subDiagnosis', label: 'Sub-diagnosis of Arthritis', type: 'select', options: SUBDIAGNOSIS_MIWGUC },
    ],
};
