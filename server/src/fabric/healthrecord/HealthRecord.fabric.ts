import { getHealthRecordContract } from './CommonFuntion';
import { HealthRecord } from './HealthRecordInterface';
export { HealthRecord } from './HealthRecordInterface'


export async function createHealthRecord(hr: HealthRecord, userId: string) {
    try {
        const contract = await getHealthRecordContract(userId);
        const result = await contract.submitTransaction('createHealthRecord', JSON.stringify(hr));
        console.log(`Health Record ${hr.health_record_patient_id} has been registed`);
        return { success: true, result: JSON.parse(result.toString()) };
    } catch (error) {
        return { success: false, result: { error: error } };
    }
}


export async function updateHealthRecord(userId: string, hrId: string, payload: any) {
    try {
        const contract = await getHealthRecordContract(userId);
        const result = await contract.submitTransaction('updateHealthRecord', hrId, JSON.stringify(payload));
        return { success: true};
    } catch (error) {
        return { success: false};
    }
}

export async function queryHealthRecord(userId: string, queryString: string): Promise<any> {
    try {
        const contract = await getHealthRecordContract(userId);
        const queryResult = await contract.evaluateTransaction('getQueryResultForQueryString', queryString);
        return JSON.parse(queryResult.toString());
    } catch (err) {
        throw err
    }
}

export async function acceptVerifyHealthRecord(userId: string, hrId:string){
    try {
        const contract = await getHealthRecordContract(userId);
        const result = await contract.submitTransaction('acceptVerifyHealthRecord', hrId);
        if (result){
        return {success: true}
        }
        else {
            return {success: false}
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}