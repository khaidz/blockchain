import { Contract, Context } from 'fabric-contract-api';
export declare class HealthRecordContract extends Contract {
    constructor();
    createHealthRecord(ctx: Context, hrAsString: string): Promise<{
        success: boolean;
    }>;
    updateHealthRecord(ctx: Context, hrId: string, payload: string): Promise<{
        success: boolean;
    }>;
    queryAllHealthRecords(ctx: Context): Promise<any>;
    acceptVerifyHealthRecord(ctx: Context, hrId: string): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
    }>;
    getQueryResultForQueryString(ctx: Context, queryString: string): Promise<string>;
    queryResult(ctx: Context, queryString: string): Promise<any>;
    getAllResults(iterator: any, isHistory: any): Promise<any[]>;
    private getUserId;
    createMedicalBill(ctx: Context, mbAsString: any): Promise<string>;
    updateMedicalBill(ctx: Context, mbId: string, payload: string): Promise<{
        error: any;
    }>;
    queryAllMedicalBills(ctx: Context): Promise<any>;
    deleteMedicalBill(ctx: Context, Id: string): Promise<void>;
    queryMedicalBill(ctx: Context, Id: string): Promise<any>;
    createUser(ctx: Context, userAsString: string): Promise<void>;
    changePassword(ctx: Context, userId: string, newPassword: string): Promise<string>;
    updateVerifiedEmail(ctx: Context, userId: string): Promise<string>;
    updateIsDeleted(ctx: Context, userId: string): Promise<string>;
    updateIsActived(ctx: Context, userId: string): Promise<string>;
    updateUser(ctx: Context, userId: string, payload: string): Promise<{
        error: any;
    }>;
    readUserByUID(ctx: Context, key: string): Promise<string>;
    queryUserByPhone(ctx: Context, phone: string): Promise<any>;
    queryUserByEmail(ctx: Context, email: string): Promise<any>;
    updateVerifiedPhone(ctx: Context, userId: string): Promise<string>;
    addDepartment(ctx: Context, payload: string): Promise<boolean>;
    updateDepartment(ctx: Context, Id: string, payload: string): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
    }>;
    queryAllDepartment(ctx: Context): Promise<any>;
    deleteDepartment(ctx: Context, dpmId: string): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
    }>;
    activeDepartment(ctx: Context, dpmId: string): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
    }>;
    queryAllDepartment_Active(ctx: Context): Promise<any>;
    addRoom(ctx: Context, payload: string): Promise<boolean>;
    updateRoom(ctx: Context, roomId: string, payload: string): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
    }>;
    queryAllRoom(ctx: Context): Promise<any>;
    queryAllRoom_Active(ctx: Context): Promise<any>;
    readRoomById(ctx: Context, key: string): Promise<string>;
    deleteRoom(ctx: Context, roomId: string): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
    }>;
    activeRoom(ctx: Context, roomId: string): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
    }>;
    addHistory(ctx: Context, payload: string): Promise<boolean>;
    updateHistory(ctx: Context, hId: string, payload: string): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
    }>;
    addDrug(ctx: Context, payload: string): Promise<boolean>;
    updateDrug(ctx: Context, Id: string, payload: string): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
    }>;
    queryAllDrug(ctx: Context): Promise<any>;
    queryDrug_Active(ctx: Context): Promise<any>;
    deleteDrug(ctx: Context, drugId: string): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
    }>;
    activeDrug(ctx: Context, drugId: string): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
    }>;
    addSubclinical(ctx: Context, payload: string): Promise<boolean>;
    updateSubclinical(ctx: Context, Id: string, payload: string): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
    }>;
    queryAllSubclinical(ctx: Context): Promise<any>;
    querySubclinical_Active(ctx: Context): Promise<any>;
    deleteSubclinical(ctx: Context, Id: string): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
    }>;
    activeSubclinical(ctx: Context, Id: string): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
    }>;
    createPrescription(ctx: Context, pAsString: string): Promise<string>;
    updatePrescription(ctx: Context, pId: string, payload: string): Promise<{
        error: any;
    }>;
    queryAllPrescription(ctx: Context): Promise<any>;
    deletePrescription(ctx: Context, Id: string): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
    }>;
    createLogin(ctx: Context, iAsString: string): Promise<string>;
    queryAllLogin(ctx: Context): Promise<any>;
    createSubclinicalSheet(ctx: Context, ssAsString: string): Promise<boolean>;
    updateSubclinicalSheet(ctx: Context, ssId: string, payload: string): Promise<{
        success: boolean;
        error: any;
    }>;
    queryAllSubclinicalSheet(ctx: Context): Promise<any>;
    readSubclinicalSheetById(ctx: Context, key: string): Promise<string>;
    deleteSubclinicalSheet(ctx: Context, Id: string): Promise<boolean>;
    initLedger(ctx: Context): Promise<void>;
}
