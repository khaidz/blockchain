import { getHealthRecordContract } from '../room/CommonFuntion';
import { Login } from './LoginInterface';
export { Login } from './LoginInterface';


export async function createLogin(login: Login) {
    try {
        const contract = await getHealthRecordContract('admin');
        const result = await contract.submitTransaction('createLogin', JSON.stringify(login));
        return { success: true, result: JSON.parse(result.toString()) };
    } catch (error) {
        return { success: false, result: { error: error } };
    }
}

export async function getAllLogin() {
    try {
        const contract = await getHealthRecordContract('admin');
        const loginAsBuffer = await contract.evaluateTransaction('queryAllLogin');
        const login = JSON.parse(loginAsBuffer.toString());
        return { success: true, result: { login } };
    } catch (error) {
        return { success: false, result: { error: error } }
    }
}

export async function queryLogin(userId: string, queryString: string): Promise<any> {
    try {
        const contract = await getHealthRecordContract(userId);
        const queryResult = await contract.evaluateTransaction('getQueryResultForQueryString', queryString);
        return JSON.parse(queryResult.toString());
    } catch (err) {
        throw err
    }
}
