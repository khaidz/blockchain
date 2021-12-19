export interface User {
     user_id: string;
     user_fullname: string;
     user_role_name: string;
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
     user_health_insurance?: string; 
     user_identity_card: string;
     user_job: string;
     user_workplace: string;
     user_gender: string;
     user_is_actived: boolean;
     user_is_deleted: boolean;
     docType?: string;
}