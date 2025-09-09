
import { Guideline, FormData, Result } from '../types';
import { yearsBetween, yearsToToday, yearsToTodayFloat } from './dateUtils';

// Main exported function
export const calculateRisk = (guideline: Guideline, formData: FormData): Result => {
    switch (guideline) {
        case Guideline.NORDIC:
            return calculateNordicRisk(formData);
        case Guideline.US_PAKISTAN:
            return calculateUsPakistanRisk(formData);
        case Guideline.GERMANY:
            return calculateGermanyRisk(formData);
        case Guideline.SPAIN_PORTUGAL:
            return calculateSpainPortugalRisk(formData);
        case Guideline.UK:
            return calculateUkRisk(formData);
        case Guideline.CZECH_SLOVAK:
            return calculateCzechSlovakRisk(formData);
        case Guideline.ARGENTINA:
            return calculateArgentinaRisk(formData);
        case Guideline.MIWGUC:
            return calculateMiwgucRisk(formData);
        default:
            return { riskLevel: 'Error', recommendation: 'Guideline not found.', followUp: '', justification: '' };
    }
};

// --- Individual Guideline Calculations ---

function calculateNordicRisk(formData: FormData): Result {
    const age = yearsToToday(formData.birthDate);
    const timeu = yearsToToday(formData.diagDate);
    const age_at_onset = yearsBetween(formData.birthDate, formData.diagDate);
    
    let risk_level = "No Risk";
    let followup = "None";
    let recommendation = "None";
    let justification = "Standard risk calculation applied.";

    if (age > 16) {
        risk_level = "Very Low Risk";
        recommendation = "No screening required";
        justification = "Screening guidelines apply only until 16 years of age.";
    } else {
        const ana_y = formData.ana === 'Yes';
        const meth_y = formData.methotrexate === 'Yes';

        let subd = 0;
        const subDiagnosis = formData.subDiagnosis;
        if (["Oligoarthritis", "RF Negative Polyarthritis", "Psoriatic Arthritis", "Undifferentiated Arthritis"].includes(subDiagnosis)) subd = 1;
        else if (subDiagnosis === "Enthesitis related Arthritis") subd = 2;
        else if (["RF Positive Arthritis", "Systemic Onset Arthritis"].includes(subDiagnosis)) subd = 3;

        if (subd === 1) {
            if (age_at_onset <= 6) {
                if (ana_y && !meth_y && timeu <= 4) { risk_level = "High Risk"; recommendation = "Every 3 Months"; justification = "High risk due to ANA+ without methotrexate, onset ≤ 6 years."; }
                else if (ana_y && meth_y && timeu <= 4) { risk_level = "Medium Risk"; recommendation = "Every 6 Months"; justification = "Medium risk due to ANA+ with methotrexate, onset ≤ 6 years."; }
                else if (ana_y && !meth_y && timeu > 4 && timeu < 7) { risk_level = "Medium Risk"; recommendation = "Every 6 Months"; justification = "Medium risk due to ANA+ without methotrexate, time since diagnosis 4–7 years."; }
                else if (ana_y && meth_y && timeu > 4 && timeu < 7) { risk_level = "Low Risk"; recommendation = "Every 12 Months"; justification = "Low risk due to ANA+ with methotrexate, time since diagnosis 4–7 years."; }
                else if (ana_y && !meth_y && timeu >= 7) { risk_level = "Low Risk"; recommendation = "Every 12 Months"; justification = "Low risk due to ANA+ without methotrexate, time since diagnosis ≥ 7 years."; }
                else if (!ana_y && !meth_y && timeu <= 4) { risk_level = "Medium Risk"; recommendation = "Every 6 Months"; justification = "Medium risk due to ANA- without methotrexate, onset ≤ 6 years."; }
                else if (!ana_y && !meth_y && timeu > 4) { risk_level = "Low Risk"; recommendation = "Every 12 Months"; justification = "Low risk due to ANA- without methotrexate, time since diagnosis > 4 years."; }
                else if (!ana_y && meth_y && timeu > 4) { risk_level = "Low Risk"; recommendation = "Every 12 Months"; justification = "Low risk due to ANA- with methotrexate, time since diagnosis > 4 years."; }
                followup = "Follow-up continues until 16 Years of age";
            } else { // age_at_onset > 6
                if (ana_y && !meth_y && timeu <= 2) { risk_level = "Medium Risk"; recommendation = "Every 6 Months"; justification = "Medium risk due to ANA+ without methotrexate, onset > 6 years, time since diagnosis ≤ 2 years."; }
                else if (ana_y && !meth_y && timeu > 2) { risk_level = "Low Risk"; recommendation = "Every 12 Months"; justification = "Low risk due to ANA+ without methotrexate, onset > 6 years, time since diagnosis > 2 years."; }
                else if (ana_y && meth_y && timeu > 0) { risk_level = "Low Risk"; recommendation = "Every 12 Months"; justification = "Low risk due to ANA+ with methotrexate, onset > 6 years."; }
                else if (!ana_y) { risk_level = "Low Risk"; recommendation = "Every 12 Months"; justification = "Low risk due to ANA- regardless of methotrexate, onset > 6 years."; }
                followup = "Follow-up for 2 - 4 years, max 16 years of age";
            }
        } else if (subd === 2) {
             risk_level = "Low Risk"; recommendation = "Every 12 Months";
            if (age_at_onset <= 6) { followup = "Follow-up for 4 - 7 years, max 16 years of age"; justification = "Low risk: Enthesitis related arthritis with onset ≤ 6 years."; }
            else { followup = "Follow-up for 2 - 4 years, max 16 years of age"; justification = "Low risk: Enthesitis related arthritis with onset > 6 years."; }
        } else if (subd === 3) {
            risk_level = "Very Low Risk"; recommendation = "Screen at Diagnosis"; justification = "Very low risk: RF positive or systemic onset arthritis.";
        }

        const bio = formData.biologicTreatment;
        if (bio && bio !== "None / Other" && bio !== "Etanercept") {
            if (risk_level === "High Risk") { risk_level = "Medium Risk"; recommendation = "Every 6 Months"; justification = "Risk downgraded due to biological treatment."; }
            else if (risk_level === "Medium Risk") { risk_level = "Low Risk"; recommendation = "Every 12 Months"; justification = "Risk downgraded due to biological treatment."; }
        }
    }
    return { riskLevel: risk_level, recommendation, followUp: followup, justification };
}

function calculateUsPakistanRisk(formData: FormData): Result {
    const timeu = yearsToToday(formData.diagDate);
    const onset_age = yearsBetween(formData.birthDate, formData.diagDate);
    const ana_y = formData.ana === 'Yes';
    
    let risk_level = "No Risk";
    let recommendation = "No screening required";
    let followup = "None";
    let justification = "";

    let subd = 0;
    const subDiagnosis = formData.subDiagnosis;
    if (["Extended Oligoarthritis", "Persistent Oligoarthritis", "RF Negative Polyarthritis", "Psoriatic Arthritis", "Undifferentiated Arthritis"].includes(subDiagnosis)) subd = 1;
    else if (["Enthesitis related Arthritis", "RF Positive Arthritis", "Systemic onset Arthritis"].includes(subDiagnosis)) subd = 2;

    if (subd === 1) {
        if (onset_age <= 7) {
            if (ana_y && timeu <= 4) { followup = "Every 3 Months"; risk_level = "High Risk"; justification = "High risk due to positive ANA and time since diagnosis ≤ 4 years for onset age ≤ 7."; }
            else if (ana_y && timeu >= 4 && timeu < 7) { followup = "Every 6 Months"; risk_level = "Medium Risk"; justification = "Medium risk due to positive ANA and time since diagnosis between 4 and 7 years for onset age ≤ 7."; }
            else if (ana_y && timeu >= 7) { followup = "Every 12 Months"; risk_level = "Low Risk"; justification = "Low risk due to positive ANA and time since diagnosis > 7 years for onset age ≤ 7."; }
            else if (!ana_y && timeu <= 4) { followup = "Every 6 Months"; risk_level = "Medium Risk"; justification = "Medium risk due to negative ANA and time since diagnosis ≤ 4 years for onset age ≤ 7."; }
            else if (!ana_y && timeu > 4) { followup = "Every 12 Months"; risk_level = "Low Risk"; justification = "Low risk due to negative ANA and time since diagnosis > 4 years for onset age ≤ 7."; }
        } else { // onset_age > 7
            if (ana_y && timeu <= 4) { followup = "Every 6 Months"; risk_level = "Medium Risk"; justification = "Medium risk due to positive ANA and time since diagnosis ≤ 4 years for onset age > 7."; }
            else if (ana_y && timeu > 4) { followup = "Every 12 Months"; risk_level = "Low Risk"; justification = "Low risk due to positive ANA and time since diagnosis > 4 years for onset age > 7."; }
            else { followup = "Every 12 Months"; risk_level = "Low Risk"; justification = "Low risk due to negative ANA for onset age > 7."; }
        }
    } else if (subd === 2) {
        followup = "Every 12 Months"; risk_level = "Low Risk"; justification = "Low risk due to sub-diagnosis in Group 2.";
    }

    return { riskLevel: risk_level, recommendation, followUp: followup, justification };
}

function calculateGermanyRisk(formData: FormData): Result {
    const timeu = yearsToToday(formData.diagDate);
    const age_at_onset = yearsBetween(formData.birthDate, formData.diagDate);
    const ana_y = formData.ana === 'Yes';
    
    let risk_level = "No Risk";
    let recommendation = "";
    let followup = "";
    let justification = "";

    if (timeu > 7) {
        risk_level = "Very Low Risk"; recommendation = "No screening required"; followup = "None"; justification = "Very low risk due to time since diagnosis > 7 years.";
    } else {
        let subd = 0;
        const subDiagnosis = formData.subDiagnosis;
        if (["Persistent Oligoarthritis", "Extended Oligoarthritis", "RF Negative Polyarthritis", "Psoriatic Arthritis", "Undifferentiated Arthritis"].includes(subDiagnosis)) subd = 1;
        else if (["Enthesitis related Arthritis", "RF Positive Arthritis", "Systemic onset Arthritis"].includes(subDiagnosis)) subd = 2;
        
        if (subd === 1) {
            recommendation = "Follow-up continues for 7 years from diagnosis";
            if (age_at_onset <= 6) {
                if (ana_y && timeu <= 4) { followup = "Every 3 Months"; risk_level = "High Risk"; justification = "High risk due to positive ANA, onset age ≤ 6, and time since diagnosis ≤ 4 years."; }
                else if (ana_y && timeu > 4) { followup = "Every 6 Months"; risk_level = "Medium Risk"; justification = "Medium risk due to positive ANA, onset age ≤ 6, and time since diagnosis > 4 years."; }
                else if (!ana_y && timeu <= 4) { followup = "Every 6 Months"; risk_level = "Medium Risk"; justification = "Medium risk due to negative ANA, onset age ≤ 6, and time since diagnosis ≤ 4 years."; }
                else if (!ana_y && timeu > 4) { followup = "Every 12 Months"; risk_level = "Low Risk"; justification = "Low risk due to negative ANA, onset age ≤ 6, and time since diagnosis > 4 years."; }
            } else { // age_at_onset > 6
                if (ana_y && timeu <= 2) { followup = "Every 6 Months"; risk_level = "Medium Risk"; justification = "Medium risk due to positive ANA, onset age > 6, and time since diagnosis ≤ 2 years."; }
                else if (ana_y && timeu > 2) { followup = "Every 12 Months"; risk_level = "Low Risk"; justification = "Low risk due to positive ANA, onset age > 6, and time since diagnosis > 2 years."; }
                else { followup = "Every 12 Months"; risk_level = "Low Risk"; justification = "Low risk due to negative ANA and onset age > 6."; }
            }
        } else if (subd === 2) {
            followup = "Every 12 Months"; risk_level = "Low Risk"; recommendation = "Follow-up continues for 7 years from diagnosis"; justification = "Low risk due to sub-diagnosis in Group 2.";
        }
    }
    return { riskLevel: risk_level, recommendation, followUp: followup, justification };
}

function calculateSpainPortugalRisk(formData: FormData): Result {
    const current_age = yearsToToday(formData.birthDate);
    const timeu = yearsToToday(formData.diagDate);
    const onset_age = yearsBetween(formData.birthDate, formData.diagDate);
    const ana_y = formData.ana === 'Yes';

    let risk_level = "No Risk";
    let recommendation = "";
    let followup = "";
    let justification = "";

    if (current_age > 16) {
        risk_level = "Very Low Risk"; recommendation = "No screening required"; followup = "None"; justification = "Very low risk due to current age > 16 years.";
    } else {
        let subd = 0;
        const subDiagnosis = formData.subDiagnosis;
        if (["Persistent Oligoarthritis", "Extended Oligoarthritis", "RF Negative Polyarthritis", "Psoriatic Arthritis"].includes(subDiagnosis)) subd = 1;
        else if (["Enthesitis related Arthritis", "RF Positive Arthritis", "Systemic onset Arthritis"].includes(subDiagnosis)) subd = 2;
        
        recommendation = "Follow-up continues until 16 years of age";
        if (subd === 1) {
            if (onset_age <= 6) {
                if (ana_y && timeu <= 4) { followup = "Every 3 Months"; risk_level = "High Risk"; justification = "High risk due to positive ANA, onset age ≤ 6, and time since diagnosis ≤ 4 years."; }
                else if (ana_y && timeu > 4 && timeu <= 7) { followup = "Every 6 Months"; risk_level = "Medium Risk"; justification = "Medium risk due to positive ANA, onset age ≤ 6, and time since diagnosis between 4 and 7 years."; }
                else if (ana_y && timeu > 7) { followup = "Every 12 Months"; risk_level = "Low Risk"; justification = "Low risk due to positive ANA, onset age ≤ 6, and time since diagnosis > 7 years."; }
                else if (!ana_y && timeu <= 4) { followup = "Every 6 Months"; risk_level = "Medium Risk"; justification = "Medium risk due to negative ANA, onset age ≤ 6, and time since diagnosis ≤ 4 years."; }
                else if (!ana_y && timeu > 4) { followup = "Every 12 Months"; risk_level = "Low Risk"; justification = "Low risk due to negative ANA, onset age ≤ 6, and time since diagnosis > 4 years."; }
            } else { // onset_age > 6
                if (ana_y && timeu <= 2) { followup = "Every 6 Months"; risk_level = "Medium Risk"; justification = "Medium risk due to positive ANA, onset age > 6, and time since diagnosis ≤ 2 years."; }
                else if (ana_y && timeu > 2) { followup = "Every 12 Months"; risk_level = "Low Risk"; justification = "Low risk due to positive ANA, onset age > 6, and time since diagnosis > 2 years."; }
                else { followup = "Every 12 Months"; risk_level = "Low Risk"; justification = "Low risk due to negative ANA and onset age > 6."; }
            }
        } else if (subd === 2) {
            followup = "Every 12 Months"; risk_level = "Low Risk"; justification = "Low risk due to diagnosis of Enthesitis related Arthritis, RF Positive Arthritis, or Systemic onset Arthritis.";
        }
    }
    return { riskLevel: risk_level, recommendation, followUp: followup, justification };
}

function calculateUkRisk(formData: FormData): Result {
    const timeu = yearsToTodayFloat(formData.diagDate);
    const age_at_onset = yearsBetween(formData.birthDate, formData.diagDate);
    const ana_y = formData.ana === 'Yes';

    let risk_level = "No Risk";
    let recommendation = "None";
    let followup = "None";
    let justification = "None";

    let group = 0;
    const subDiagnosis = formData.subDiagnosis;
    if (["Persistent Oligoarthritis", "Extended Oligoarthritis", "Psoriatic Arthritis", "Enthesitis-related Arthritis"].includes(subDiagnosis)) group = 1;
    else if (subDiagnosis === "RF Negative Polyarthritis") group = 2;
    else if (["Systemic Onset Arthritis", "RF Positive Polyarthritis"].includes(subDiagnosis)) group = 3;

    if ( (group === 1 && ((age_at_onset < 3 && timeu > 8) || (age_at_onset >= 3 && age_at_onset < 5 && timeu > 6) || (age_at_onset >= 5 && age_at_onset < 9 && timeu > 3) || (age_at_onset >= 9 && timeu > 1))) ||
         (group === 2 && ana_y && ((age_at_onset < 6 && timeu > 5) || (age_at_onset >= 6 && age_at_onset < 9 && timeu > 2) || (age_at_onset >= 9 && timeu > 1))) ||
         (group === 2 && !ana_y && ((age_at_onset < 7 && timeu > 5) || (age_at_onset >= 7 && timeu > 1))) ) {
        risk_level = "Very Low Risk"; recommendation = "No screening required"; justification = "Very low risk due to long time since diagnosis.";
    } else {
        if (group === 1) {
            risk_level = "High Risk"; recommendation = "Every 3 - 4 Months";
            if (age_at_onset < 3) { followup = "Follow up continues for 8 years"; justification = "High risk due to early onset age."; }
            else if (age_at_onset < 5) { followup = "Follow up continues for 6 years"; justification = "High risk due to onset age between 3 and 5 years."; }
            else if (age_at_onset < 9) { followup = "Follow up continues for 3 years"; justification = "High risk due to onset age between 5 and 9 years."; }
            else if (age_at_onset < 12) { followup = "Follow up continues for 1 year"; justification = "High risk due to onset age between 9 and 12 years."; }
        } else if (group === 2) {
            risk_level = "High Risk"; recommendation = "Every 3 - 4 Months";
            if (ana_y) {
                if (age_at_onset < 6) { followup = "Follow up continues for 5 years"; justification = "High risk due to early onset age with positive ANA."; }
                else if (age_at_onset < 9) { followup = "Follow up continues for 2 years"; justification = "High risk due to onset age between 6 and 9 years with positive ANA."; }
                else if (age_at_onset < 12) { followup = "Follow up continues for 1 year"; justification = "High risk due to onset age between 9 and 12 years with positive ANA."; }
            } else {
                if (age_at_onset < 7) { followup = "Follow up continues for 5 years"; justification = "High risk due to early onset age with negative ANA."; }
                else { followup = "Follow up continues for 1 year"; justification = "High risk due to onset age at or after 7 years with negative ANA."; }
            }
        } else if (group === 3) {
            risk_level = "N/A"; recommendation = "Screen at diagnosis"; followup = "N/A"; justification = "Screening required at diagnosis due to sub-diagnosis.";
        }
    }
    return { riskLevel: risk_level, recommendation, followUp: followup, justification };
}

function calculateCzechSlovakRisk(formData: FormData): Result {
    const age = yearsToTodayFloat(formData.birthDate);
    const timeu = yearsToTodayFloat(formData.diagDate);
    const age_at_onset = yearsBetween(formData.birthDate, formData.diagDate);
    const ana_y = formData.ana === 'Yes';
    
    let risk_level = "No Risk";
    let recommendation = "";
    let followup = "";
    let justification = "";

    const subDiagnosis = formData.subDiagnosis;
    if (["RF Positive Polyarthritis", "Systemic Onset Arthritis"].includes(subDiagnosis)) {
        return { riskLevel: "Medium Risk", recommendation: "Screen at diagnosis, then every 6 months until 18 years of age", followUp: "", justification: "Medium risk due to diagnosis of RF Positive Polyarthritis or Systemic Onset Arthritis."};
    }

    let group = 0;
    if (["Persistent Oligoarthritis", "Extended Oligoarthritis", "Psoriatic Arthritis", "RF Negative Polyarthritis"].includes(subDiagnosis)) group = 1;
    else if (subDiagnosis === "HLAB27+ Arthritis") group = 2;

    if (age > 18 && !ana_y) {
        risk_level = "Very Low Risk"; recommendation = "No screening required"; followup = "None"; justification = "Very low risk due to age > 18 years and negative ANA.";
    } else {
        if (group === 1 || group === 2) { // Logic is similar for both groups
            if (age_at_onset < 6 || ana_y) {
                followup = "Continue into adulthood";
                if (timeu < 0.5) { recommendation = "Every 2 months"; risk_level = "High Risk"; justification = "High risk due to onset age < 6 or positive ANA, and time since diagnosis < 0.5 years."; }
                else if (timeu <= 4) { recommendation = "Every 3 months"; risk_level = "High Risk"; justification = "High risk due to onset age < 6 or positive ANA, and time since diagnosis ≤ 4 years."; }
                else if (timeu > 4 && age < 18) { recommendation = "Every 6 months"; risk_level = "Medium Risk"; justification = "Medium risk due to onset age < 6 or positive ANA, time since diagnosis > 4 years, and age < 18."; }
                else if (age > 18 && ana_y) { recommendation = "Every 6–12 months"; risk_level = "Low to Medium Risk"; justification = "Low to medium risk due to age > 18 and positive ANA."; }
            } else if (age_at_onset >= 6 && !ana_y) {
                 followup = "Until 18 years of age";
                 if(timeu < 4) { recommendation = "Every 3 months"; risk_level = "High Risk"; justification = "High risk due to negative ANA, onset age > 6, and time since diagnosis < 4 years.";}
                 else { recommendation = "Every 6 months"; risk_level = "Medium Risk"; justification = "Medium risk due to negative ANA, onset age > 6, and time since diagnosis ≥ 4 years."; }
            }
        }
    }
    return { riskLevel: risk_level, recommendation, followUp: followup, justification };
}

function calculateArgentinaRisk(formData: FormData): Result {
    const age_years = yearsToToday(formData.birthDate);
    const diag_years = yearsToToday(formData.diagDate);
    const age_onset_years = yearsBetween(formData.birthDate, formData.diagDate);
    const ana_y = formData.ana === 'Yes';
    
    let risk_level = "No Risk";
    let recommendation = "";
    let followup = "";
    let justification = "";
    
    if (age_years > 21) {
        risk_level = "Very Low Risk"; recommendation = "No screening required"; followup = "None"; justification = "Very low risk due to age > 21 years.";
    } else {
        followup = "Until 21 years";
        if (formData.subDiagnosis === "Systemic onset Arthritis") {
            risk_level = "Low Risk"; recommendation = "Every 12 Months"; justification = "Low risk due to diagnosis of Systemic onset Arthritis.";
        } else {
            if (age_onset_years <= 6) {
                if (ana_y && diag_years <= 4) { risk_level = "High Risk"; recommendation = "Every 3 Months"; justification = "High risk due to positive ANA, onset age ≤ 6, and time since diagnosis ≤ 4 years."; }
                else if (ana_y && diag_years > 4 && diag_years <= 7) { risk_level = "Medium Risk"; recommendation = "Every 6 Months"; justification = "Medium risk due to positive ANA, onset age ≤ 6, and time since diagnosis between 4 and 7 years."; }
                else if (ana_y && diag_years > 7) { risk_level = "Low Risk"; recommendation = "Every 12 Months"; justification = "Low risk due to positive ANA, onset age ≤ 6, and time since diagnosis > 7 years."; }
                else if (!ana_y && diag_years <= 4) { risk_level = "Medium Risk"; recommendation = "Every 6 Months"; justification = "Medium risk due to negative ANA, onset age ≤ 6, and time since diagnosis ≤ 4 years."; }
                else if (!ana_y && diag_years > 4) { risk_level = "Low Risk"; recommendation = "Every 12 Months"; justification = "Low risk due to negative ANA, onset age ≤ 6, and time since diagnosis > 4 years."; }
            } else { // onset > 6
                if (ana_y && diag_years <= 4) { risk_level = "Medium Risk"; recommendation = "Every 6 Months"; justification = "Medium risk due to positive ANA, onset age > 6, and time since diagnosis ≤ 4 years."; }
                else { risk_level = "Low Risk"; recommendation = "Every 12 Months"; justification = "Low risk due to onset age > 6 and lower risk profile."; }
            }
        }
    }
    return { riskLevel: risk_level, recommendation, followUp: followup, justification };
}

function calculateMiwgucRisk(formData: FormData): Result {
    const timeu = yearsToToday(formData.diagDate);
    const age_at_onset = yearsBetween(formData.birthDate, formData.diagDate);

    let risk_level = "No Risk";
    let recommendation = "No screening required";
    let followup = "None";
    let justification = "None";

    if (formData.subDiagnosis === "Systemic-onset Arthritis") {
        risk_level = "Very Low Risk"; justification = "Very low risk due to diagnosis of Systemic-onset Arthritis, which has a low likelihood of uveitis.";
    } else if (formData.subDiagnosis === "Juvenile Idiopathic Arthritis") {
        if (age_at_onset < 7) {
            if (timeu <= 1) { risk_level = "High Risk"; recommendation = "Frequent screening required"; followup = "Every 2 Months"; justification = "High risk due to Juvenile Idiopathic Arthritis diagnosed before 7 years of age and within the last year, requiring frequent monitoring for uveitis."; }
            else if (timeu <= 4) { risk_level = "High Risk"; recommendation = "Frequent screening required"; followup = "Every 3–4 Months"; justification = "High risk due to Juvenile Idiopathic Arthritis diagnosed before 7 years of age and within 4 years, maintaining a need for frequent uveitis screening."; }
            else if (timeu <= 7) { risk_level = "Medium Risk"; recommendation = "Moderate screening required"; followup = "Every 6 Months"; justification = "Medium risk due to Juvenile Idiopathic Arthritis diagnosed before 7 years of age and within 7 years, with a decreasing but still notable uveitis risk."; }
            else { risk_level = "Low Risk"; recommendation = "Routine screening required"; followup = "Every 12 Months"; justification = "Low risk due to Juvenile Idiopathic Arthritis diagnosed before 7 years of age and over 7 years ago, with reduced uveitis risk over time."; }
        } else { // age_at_onset >= 7
            if (timeu <= 1) { risk_level = "High Risk"; recommendation = "Frequent screening required"; followup = "Every 3–4 Months"; justification = "High risk due to Juvenile Idiopathic Arthritis diagnosed at or after 7 years of age and within the last year, requiring frequent uveitis monitoring."; }
            else if (timeu <= 4) { risk_level = "Medium Risk"; recommendation = "Moderate screening required"; followup = "Every 6 Months"; justification = "Medium risk due to Juvenile Idiopathic Arthritis diagnosed at or after 7 years of age and within 4 years, with a moderate uveitis risk."; }
            else { risk_level = "Low Risk"; recommendation = "Routine screening required"; followup = "Every 12 Months"; justification = "Low risk due to Juvenile Idiopathic Arthritis diagnosed at or after 7 years of age and over 4 years ago, with a lower uveitis risk."; }
        }
    }
    return { riskLevel: risk_level, recommendation, followUp: followup, justification };
}
