import { getHealthRecordContract } from '../room/CommonFuntion';
import { History } from './HistoryInterface';
export { History } from './HistoryInterface';

export async function createHistory(history: History) {
    try {
        const contract = await getHealthRecordContract('admin');
        const result = await contract.submitTransaction('addHistory', JSON.stringify(history));
        console.log(`Lich su ${history.history_id} has been registed`);
        return { success: true, result: JSON.parse(result.toString()) };
    } catch (error) {
        return { success: false, result: { error: error } };
    }
}


export async function updateHistory(historyId: string, payload: any) {
    try {
        const contract = await getHealthRecordContract('admin');
        const result = await contract.submitTransaction('updateHistory', historyId, JSON.stringify(payload));
        return JSON.parse(result.toString());
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function queryHistory(userId: string, queryString: string): Promise<any> {
    try {
        const contract = await getHealthRecordContract(userId);
        const queryResult = await contract.evaluateTransaction('getQueryResultForQueryString', queryString);
        return JSON.parse(queryResult.toString());
    } catch (err) {
        throw err
    }
}