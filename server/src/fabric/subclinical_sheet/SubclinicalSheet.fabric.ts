import { getHealthRecordContract } from "../room/CommonFuntion";
import { SubclinicalSheet } from "./SubclinicalSheetInterface";
export { SubclinicalSheet} from './SubclinicalSheetInterface';


export async function createSubclinicalSheet(payload:SubclinicalSheet, userId: string) {
    try {
        const contract = await getHealthRecordContract(userId);
        const result = await contract.submitTransaction('createSubclinicalSheet', JSON.stringify(payload));
        console.log(`${payload.subclinical_name} has been registed`);
        if (result){
            return { success: true};
        }
        else {
            return { success: false };
        }
    } catch (error) {
        return { success: false };
    }
}

export async function updateSubclinicalSheet(userId: string, ssId: string, payload: any) {
    try {
        const contract = await getHealthRecordContract(userId);
        const result = await contract.submitTransaction('updateSubclinicalSheet', ssId, JSON.stringify(payload));
        return JSON.parse(result.toString());
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function deleteSubclinicalSheet(userId: string, pId: string) {
    try {
        const contract = await getHealthRecordContract(userId);
        const result = await contract.submitTransaction('deleteSubclinicalSheet', pId);
        if(result){
            return true;
        }
        else return false;
    } catch (error) {
        return false;
    }
}

export async function querySubclinicalSheet(userId: string, queryString: string): Promise<any> {
    try {
        const contract = await getHealthRecordContract(userId);
        const queryResult = await contract.evaluateTransaction('getQueryResultForQueryString', queryString);
        return JSON.parse(queryResult.toString());
    } catch (err) {
        throw err
    }
}