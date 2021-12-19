export interface Room {
    room_id: string;
    room_name: string;
    room_department_name: string;
    room_number: number;
    room_is_deleted: boolean;
    room_description?: string;
    docType?: string; 
}