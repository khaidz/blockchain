export declare class Room {
    room_id: string;
    room_name: string;
    room_department_name: string;
    room_number: string;
    room_is_deleted: boolean;
    room_description?: string;
    docType?: string;
}
export declare class Login {
    login_id: string;
    login_created_at: string;
    login_user_id: string;
    docType?: string;
}
export declare class History {
    history_id: string;
    history_patient_id: string;
    anamnesis: string;
    medical_history: string;
    docType?: string;
}
export declare class Department {
    department_id: string;
    department_name: string;
    department_is_deleted: boolean;
    department_description?: string;
    docType?: string;
}
export declare class Subclinical {
    subclinical_id: string;
    subclinical_name: string;
    subclinical_description?: string;
    subclinical_is_deleted: boolean;
    docType?: string;
}
export declare class Drug {
    drug_id: string;
    drug_name: string;
    drug_instruction: string;
    drug_unit: string;
    drug_dosage_form: string;
    drug_route: string;
    drug_is_deleted: boolean;
    docType?: string;
}
export declare class SubclinicalSheet {
    subclinical_sheet_id: string;
    subclinical_sheet_medical_bill_id: string;
    subclinical_name: string;
    subclinical_sheet_created_by: string;
    subclinical_sheet_created_at: string;
    subclinical_sheet_results: string;
    subclinical_sheet_images: string[];
    subclinical_sheet_is_deleted: boolean;
    docType?: string;
}
export declare class MedicalBill {
    medical_bill_id: string;
    medical_bill_health_record_id: string;
    medical_bill_patient_id: string;
    medical_bill_physician_name: string;
    medical_bill_physician_id: string;
    medical_bill_department_name: string;
    medical_bill_room_name: string;
    medical_bill_created_at: string;
    medical_bill_created_by: string;
    medical_bill_modified_at?: string;
    medical_bill_modified_by?: string;
    medical_bill_previous_result?: string;
    medical_bill_place_of_introduction?: string;
    medical_bill_reason_for_examination?: string;
    medical_bill_medical_history?: string;
    medical_bill_anamnesis?: string;
    medical_bill_diagnose?: string;
    medical_bill_appointment?: string;
    medical_bill_treatment?: string;
    medical_bill_paid?: boolean;
    medical_bill_status: boolean;
    medical_bill_is_deleted: boolean;
    medical_bill_health_insurance?: string;
    medical_bill_ordinal_number?: string;
    medical_bill_is_completed?: boolean;
    vital_signs_temperature?: string;
    vital_signs_blood_pressure?: string;
    vital_signs_breathing?: string;
    vital_signs_pluse?: string;
    medical_bill_update_by?: string;
    docType?: string;
}
export declare class HealthRecord {
    health_record_id: string;
    health_record_patient_id: string;
    health_record_patient_name: string;
    health_record_created_by: string;
    health_record_created_at: string;
    health_record_modified_by?: string;
    health_record_modified_at?: string;
    health_record_health_insurance?: string;
    health_record_verified: boolean;
    docType?: string;
}
export declare class Prescription {
    prescription_id: string;
    prescription_medical_bill_id: string;
    prescription_drug_name: string;
    prescription_created_by: string;
    prescription_created_at: string;
    prescription_modified_by?: string;
    prescription_modified_at?: string;
    prescription_drug_instruction?: string;
    prescription_drug_unit?: string;
    prescription_drug_dosage_form?: string;
    prescription_drug_route?: string;
    prescription_doctor_instruction?: string;
    drug_numbers?: string;
    prescription_is_deleted: boolean;
    docType?: string;
}
export declare class User {
    user_id: string;
    user_fullname: string;
    user_role_id: string;
    user_email: string;
    user_phone: string;
    user_password: string;
    user_address: string;
    user_verified_email?: boolean;
    user_verified_phone?: boolean;
    user_date_of_birth: string;
    user_created_at?: string;
    user_created_by?: string;
    user_modified_at?: string;
    user_modified_by?: string;
    user_family_name?: string;
    user_family_phone?: string;
    user_identity_card: string;
    user_health_insurance?: string;
    user_job: string;
    user_workplace: string;
    user_gender: string;
    user_is_actived: boolean;
    user_is_deleted: boolean;
    docType?: string;
}
