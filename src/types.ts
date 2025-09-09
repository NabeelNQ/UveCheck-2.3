export enum Guideline {
    NORDIC = 'NORDIC',
    US_PAKISTAN = 'US_PAKISTAN',
    GERMANY = 'GERMANY',
    SPAIN_PORTUGAL = 'SPAIN_PORTUGAL',
    UK = 'UK',
    CZECH_SLOVAK = 'CZECH_SLOVAK',
    ARGENTINA = 'ARGENTINA',
    MIWGUC = 'MIWGUC',
}

export type YesNo = 'Yes' | 'No' | '';
export type YesNoOther = 'Yes' | 'No' | 'Other' | '';

export interface FormData {
    birthDate: string;
    diagDate: string;
    subDiagnosis: string;
    ana: YesNo;
    methotrexate: YesNo;
    biologicTreatment: string;
}

export interface Result {
    riskLevel: string;
    recommendation: string;
    followUp: string;
    justification: string;
    inputs?: Partial<FormData> & {
        currentAge?: string;
        timeSinceDiagnosis?: string;
        ageAtOnset?: string;
    };
}

export type QuestionType = 'date' | 'select' | 'radio' | 'text';

export interface Question {
    key: keyof FormData;
    label: string;
    type: QuestionType;
    options?: string[];
}

export interface GuidelineDetails {
    id: Guideline;
    name: string;
    questions: Question[];
}