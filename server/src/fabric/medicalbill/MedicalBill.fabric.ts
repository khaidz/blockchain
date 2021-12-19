import { getHealthRecordContract } from './CommonFuntion';
import { MedicalBill } from './MedicalBillInterface';
export { MedicalBill } from './MedicalBillInterface'


export async function createMedicalBill(payload:MedicalBill, userId: string) {
    try {
        const contract = await getHealthRecordContract(userId);
        const result = await contract.submitTransaction('createMedicalBill', JSON.stringify(payload));
        console.log(`MedicalBill ${payload.medical_bill_id} has been registed`);
        return true;
    } catch (error) {
        return false
    }
}

export async function updateMedicalBill(userId: string, mbId: string, payload: any) {
    try {
        const contract = await getHealthRecordContract(userId);
        const result = await contract.submitTransaction('updateMedicalBill', mbId, JSON.stringify(payload));
        return {success: true, result: result}
    } catch (error) {
        return {success: false}
    }
}

export async function queryMedicalBill(userId: string, queryString: string): Promise<any> {
    try {
        const contract = await getHealthRecordContract(userId);
        const queryResult = await contract.evaluateTransaction('getQueryResultForQueryString', queryString);
        return JSON.parse(queryResult.toString());
    } catch (err) {
        throw err
    }
}

