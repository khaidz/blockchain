//1 Phòng
export class Room {
    public room_id: string;
    public room_name: string;
    public room_department_name: string;
    public room_number: string;
    public room_is_deleted: boolean;
    public room_description?: string;
    public docType?: string; 
}

export class Login {
    public login_id: string;
    public login_created_at: string;
    public login_user_id: string;
    public docType?: string;
}

export class History {
    public history_id: string;
    public history_patient_id: string;
    public anamnesis: string;
    public medical_history: string;
    public docType?: string;
}

//2 Khoa
export class Department {
    public department_id: string;
    public department_name: string;
    public department_is_deleted: boolean;
    public department_description?: string;
    public docType?: string; 
}

//5 Cận lâm sàng
export class Subclinical {
    public subclinical_id: string;
    public subclinical_name: string;
    public subclinical_description?: string;
    public subclinical_is_deleted: boolean;
    public docType?: string; 
}
//6 Thuốc
export class Drug {
    public drug_id: string;
    public drug_name: string;
    public drug_instruction: string;
    public drug_unit: string;
    public drug_dosage_form: string;
    public drug_route: string;
    public drug_is_deleted: boolean;
    public docType?: string; 
}


//14 Thông tin phiếu cận lâm sàng

export class SubclinicalSheet {
    public subclinical_sheet_id: string;
    public subclinical_sheet_medical_bill_id: string;
    public subclinical_name: string;
    public subclinical_sheet_created_by: string;
    public subclinical_sheet_created_at: string;
    public subclinical_sheet_results: string;
    public subclinical_sheet_images: string[];
    public subclinical_sheet_is_deleted: boolean;
    public docType?: string;
}

//14 Thông tin phiếu khám bệnh

export class MedicalBill {
    public medical_bill_id: string;
    public medical_bill_health_record_id: string;
    public medical_bill_patient_id: string;
    public medical_bill_physician_name: string;
    public medical_bill_physician_id: string;
    public medical_bill_department_name: string;
    public medical_bill_room_name: string;
    public medical_bill_created_at: string;
    public medical_bill_created_by: string;
    public medical_bill_modified_at?: string;
    public medical_bill_modified_by?: string;
    public medical_bill_previous_result?: string;
    public medical_bill_place_of_introduction?: string;
    public medical_bill_reason_for_examination?: string;
    public medical_bill_medical_history?: string;
    public medical_bill_anamnesis?: string;
    public medical_bill_diagnose?: string;
    public medical_bill_appointment?: string;
    public medical_bill_treatment?: string;
    public medical_bill_paid?: boolean;
    public medical_bill_status: boolean;
    public medical_bill_is_deleted: boolean;
    public medical_bill_health_insurance?: string;
    public medical_bill_ordinal_number?: string;
    public medical_bill_is_completed?: boolean;
    public vital_signs_temperature?: string;
    public vital_signs_blood_pressure?: string;
    public vital_signs_breathing?: string;
    public vital_signs_pluse?: string;
    public medical_bill_update_by?: string;
    public docType?: string;

}

//16 Thông tin sổ khám bệnh

export class HealthRecord {
    public health_record_id: string;
    public health_record_patient_id: string;
    public health_record_patient_name: string;
    public health_record_created_by: string;
    public health_record_created_at: string;
    public health_record_modified_by?: string;
    public health_record_modified_at?: string;
    public health_record_health_insurance?: string;
    public health_record_verified: boolean;
    public docType?: string; 
}

//17 Thông tin đơn thuốc

export class Prescription {
    public prescription_id: string;
    public prescription_medical_bill_id: string;
    public prescription_drug_name: string;
    public prescription_created_by: string;
    public prescription_created_at: string;
    public prescription_modified_by?: string;
    public prescription_modified_at?: string;
    public prescription_drug_instruction?: string;
    public prescription_drug_unit?: string;
    public prescription_drug_dosage_form?: string;
    public prescription_drug_route?: string;
    public prescription_doctor_instruction?: string;
    public drug_numbers?: string; 
    public prescription_is_deleted: boolean;
    public docType?: string;
}


//20 Thông tin người dùng

export class User {
    public user_id: string;
    public user_fullname: string;
    public user_role_id: string;
    public user_email: string;
    public user_phone: string;
    public user_password: string;
    public user_address: string;
    public user_verified_email?: boolean;
    public user_verified_phone?: boolean;
    public user_date_of_birth: string;
    public user_created_at?: string;
    public user_created_by?: string;
    public user_modified_at?: string;
    public user_modified_by?: string;
    public user_family_name?: string;
    public user_family_phone?: string;
    public user_identity_card: string;
    public user_health_insurance?: string;
    public user_job: string;
    public user_workplace: string;
    public user_gender: string;
    public user_is_actived: boolean;
    public user_is_deleted: boolean;
    public docType?: string;
}