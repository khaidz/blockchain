export interface Prescription {
    prescription_id?: string;
    prescription_medical_bill_id?: string;
    prescription_drug_name: string;
    prescription_drug_instruction?: string;
    prescription_drug_unit: string;
    prescription_drug_dosage_form: string;
    prescription_drug_route: string;
    prescription_deleted?: boolean;
    prescription_doctor_instruction?: string;
    drug_numbers?: string; 
    docType?: string;
}