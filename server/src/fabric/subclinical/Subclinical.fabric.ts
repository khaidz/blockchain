import { getHealthRecordContract } from '../room/CommonFuntion';
import { Subclinical } from './SubclinicalInterface';
export { Subclinical } from './SubclinicalInterface';

export async function createSubclinical(payload: Subclinical) {
    try {
        const contract = await getHealthRecordContract('admin');
        const result = await contract.submitTransaction('addSubclinical', JSON.stringify(payload));
        console.log(`Subclinical ${payload.subclinical_name} has been registed`);
        return { success: true, result: JSON.parse(result.toString()) };
    } catch (error) {
        return { success: false, result: { error: error } };
    }
}


export async function updateSubclinical(Id: string, payload: any) {
    try {
        const contract = await getHealthRecordContract('admin');
        const result = await contract.submitTransaction('updateSubclinical', Id, JSON.stringify(payload));
        return JSON.parse(result.toString());
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function querySubclinical(userId: string, queryString: string): Promise<any> {
    try {
        const contract = await getHealthRecordContract(userId);
        const queryResult = await contract.evaluateTransaction('getQueryResultForQueryString', queryString);
        return JSON.parse(queryResult.toString());
    } catch (err) {
        throw err
    }
}
export async function getAllSubclinical() {
    try {
        const contract = await getHealthRecordContract('admin');
        const rsAsBuffer = await contract.evaluateTransaction('queryAllSubclinical');
        const subclinicals = JSON.parse(rsAsBuffer.toString());
        return { success: true, result: { subclinicals } };
    } catch (error) {
        return { success: false, result: { error: error } }
    }
}

export async function getAllSubclinicalActive() {
    try {
        const contract = await getHealthRecordContract('admin');
        const rsAsBuffer = await contract.evaluateTransaction('queryAllSubclinical_Active');
        const rs= JSON.parse(rsAsBuffer.toString());
        return { success: true, result: { rs } };
    } catch (error) {
        return { success: false, result: { error: error } }
    }
}


export async function getSubclinicalById(Id: string) {
    try {
        const contract = await getHealthRecordContract('admin');
        const rsAsBuffer = await contract.evaluateTransaction('querySubclinicalById', Id);
        const rs = JSON.parse(rsAsBuffer.toString());
        return rs;
    } catch (error) {
        console.log(error);
        return null
    }
}

export async function deleteSubclinical(Id: string) {
    try {
        const contract = await getHealthRecordContract('admin');
        const result = await contract.submitTransaction('deleteSubclinical', Id);
        return JSON.parse(result.toString());
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function activeSubclinical(Id: string) {
    try {
        const contract = await getHealthRecordContract('admin');
        const result = await contract.submitTransaction('activeSubclinical', Id);
        return JSON.parse(result.toString());
    } catch (error) {
        console.log(error);
        throw error;
    }
}