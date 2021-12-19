export interface Drug{
    drug_id: string;
    drug_name: string;
    drug_instruction: string;
    drug_unit: string;
    drug_dosage_form: string;
    drug_route: string;
    drug_is_deleted: boolean;
    docType?: string; 
}