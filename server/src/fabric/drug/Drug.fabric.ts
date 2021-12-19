import { getHealthRecordContract } from '../room/CommonFuntion';
import { Drug } from './DrugInterface';
export { Drug } from './DrugInterface';

export async function createDrug(payload: Drug) {
    try {
        const contract = await getHealthRecordContract('admin');
        const result = await contract.submitTransaction('addDrug', JSON.stringify(payload));
        console.log(`Drug ${payload.drug_name} has been registed`);
        return { success: true, result: JSON.parse(result.toString()) };
    } catch (error) {
        return { success: false, result: { error: error } };
    }
}


export async function updateDrug(Id: string, payload: any) {
    try {
        const contract = await getHealthRecordContract('admin');
        const result = await contract.submitTransaction('updateDrug', Id, JSON.stringify(payload));
        return JSON.parse(result.toString());
    } catch (error) {
        console.log(error);
        throw error;
    }
}


export async function getAllDrug() {
    try {
        const contract = await getHealthRecordContract('admin');
        const rsAsBuffer = await contract.evaluateTransaction('queryAllDrug');
        const drugs = JSON.parse(rsAsBuffer.toString());
        return { success: true, result: { drugs } };
    } catch (error) {
        return { success: false, result: { error: error } }
    }
}

export async function getAllDrugActive() {
    try {
        const contract = await getHealthRecordContract('admin');
        const rsAsBuffer = await contract.evaluateTransaction('queryAllDrug_Active');
        const rs= JSON.parse(rsAsBuffer.toString());
        return { success: true, result: { rs } };
    } catch (error) {
        return { success: false, result: { error: error } }
    }
}


export async function getDrugById(Id: string) {
    try {
        const contract = await getHealthRecordContract('admin');
        const rsAsBuffer = await contract.evaluateTransaction('queryDrugById', Id);
        const rs = JSON.parse(rsAsBuffer.toString());
        return rs;
    } catch (error) {
        console.log(error);
        return null
    }
}
export async function queryDrug(userId: string, queryString: string): Promise<any> {
    try {
        const contract = await getHealthRecordContract(userId);
        const queryResult = await contract.evaluateTransaction('getQueryResultForQueryString', queryString);
        return JSON.parse(queryResult.toString());
    } catch (err) {
        throw err
    }
}
export async function deleteDrug(Id: string) {
    try {
        const contract = await getHealthRecordContract('admin');
        const result = await contract.submitTransaction('deleteDrug', Id);
        return JSON.parse(result.toString());
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function activeDrug(Id: string) {
    try {
        const contract = await getHealthRecordContract('admin');
        const result = await contract.submitTransaction('activeDrug', Id);
        return JSON.parse(result.toString());
    } catch (error) {
        console.log(error);
        throw error;
    }
}