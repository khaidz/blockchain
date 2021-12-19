import { getHealthRecordContract } from './CommonFuntion';
import { Prescription } from './PrescriptionInterface';
import { nanoid } from 'nanoid';
export { Prescription } from './PrescriptionInterface'


export async function createPrescription(payload: Prescription, userId: string) {
    try {
        const contract = await getHealthRecordContract(userId);
        const result = await contract.submitTransaction('createPrescription', JSON.stringify(payload));
        console.log(`Prescription ${payload.prescription_id} has been registed`);
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


export async function updatePrescription(userId: string, pId: string, payload: any) {
    try {
        const contract = await getHealthRecordContract(userId);
        const result = await contract.submitTransaction('updatePrescription', pId, JSON.stringify(payload));
        return JSON.parse(result.toString());
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function deletePrescription(userId: string, pId: string) {
    try {
        const contract = await getHealthRecordContract(userId);
        const result = await contract.submitTransaction('deletePrescription', pId);
        if(result){
            return true;
        }
        else return false;
    } catch (error) {
        return false;
    }
}

export async function queryPrescription(userId: string, queryString: string): Promise<any> {
    try {
        const contract = await getHealthRecordContract(userId);
        const queryResult = await contract.evaluateTransaction('getQueryResultForQueryString', queryString);
        return JSON.parse(queryResult.toString());
    } catch (err) {
        throw err
    }
}
export async function getAllPrescription() {
    try {
        const contract = await getHealthRecordContract('admin');
        const rsAsBuffer = await contract.evaluateTransaction('queryAllPrescription');
        const rs= JSON.parse(rsAsBuffer.toString());
        return { success: true, result: { rs } };
    } catch (error) {
        return { success: false, result: { error: error } }
    }
}
