import { getHealthRecordContract } from '../room/CommonFuntion';
import { Department } from './DepartmentInterface';
export { Department } from './DepartmentInterface';

export async function createDepartment(department: Department) {
    try {
        const contract = await getHealthRecordContract('admin');
        const result = await contract.submitTransaction('addDepartment', JSON.stringify(department));
        console.log(`Department ${department.department_name} has been registed`);
        return { success: true, result: JSON.parse(result.toString()) };
    } catch (error) {
        return { success: false, result: { error: error } };
    }
}


export async function updateDepartment(departmentId: string, payload: any) {
    try {
        const contract = await getHealthRecordContract('admin');
        const result = await contract.submitTransaction('updateDepartment', departmentId, JSON.stringify(payload));
        return JSON.parse(result.toString());
    } catch (error) {
        console.log(error);
        throw error;
    }
}


export async function getAllDepartment() {
    try {
        const contract = await getHealthRecordContract('admin');
        const departmentsAsBuffer = await contract.evaluateTransaction('queryAllDepartment');
        const departments = JSON.parse(departmentsAsBuffer.toString());
        return { success: true, result: { departments } };
    } catch (error) {
        return { success: false, result: { error: error } }
    }
}

export async function getAllDepartmentActive() {
    try {
        const contract = await getHealthRecordContract('admin');
        const departmentsAsBuffer = await contract.evaluateTransaction('queryAllDepartment_Active');
        const departments = JSON.parse(departmentsAsBuffer.toString());
        return { success: true, result: { departments } };
    } catch (error) {
        return { success: false, result: { error: error } }
    }
}


export async function getDepartmentById(departmentId: string) {
    try {
        const contract = await getHealthRecordContract('admin');
        const departmentAsBuffer = await contract.evaluateTransaction('queryDepartmentById', departmentId);
        const department = JSON.parse(departmentAsBuffer.toString());
        return department;
    } catch (error) {
        console.log(error);
        return null
    }
}

export async function deleteDepartment(departmentId: string) {
    try {
        const contract = await getHealthRecordContract('admin');
        const result = await contract.submitTransaction('deleteDepartment', departmentId);
        return JSON.parse(result.toString());
    } catch (error) {
        console.log(error);
        throw error;
    }
}
export async function queryDepartment(userId: string, queryString: string): Promise<any> {
    try {
        const contract = await getHealthRecordContract(userId);
        const queryResult = await contract.evaluateTransaction('getQueryResultForQueryString', queryString);
        return JSON.parse(queryResult.toString());
    } catch (err) {
        throw err
    }
}
export async function activeDepartment(departmentId: string) {
    try {
        const contract = await getHealthRecordContract('admin');
        const result = await contract.submitTransaction('activeDepartment', departmentId);
        return JSON.parse(result.toString());
    } catch (error) {
        console.log(error);
        throw error;
    }
}