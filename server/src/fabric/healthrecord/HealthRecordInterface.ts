// Thông tin sổ khám bệnh
export interface HealthRecord {
    health_record_id?: string;
    health_record_patient_id: string;
    health_record_patient_name?: string;
    health_record_created_by?: string;
    health_record_created_at?: string;
    health_record_modified_by?: string;
    health_record_modified_at?: string;
    health_record_verified?: boolean;
    health_record_health_insurance?: boolean;
    docType?: string; 
}
