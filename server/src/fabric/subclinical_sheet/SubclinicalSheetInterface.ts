export interface SubclinicalSheet {
    subclinical_sheet_id: string;
    subclinical_name: string;
    subclinical_sheet_medical_bill_id: string;
    subclinical_sheet_results: string;
    subclinical_sheet_images?: [];
    subclinical_sheet_deleted?: boolean;
    docType?: string;
}