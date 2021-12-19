import { getUserContract } from './CommonFuntion';

export { registerUser } from './RegisterUser';
export { User } from './UserInterface';

export async function getStaffByEmail(email: any): Promise<any> {
    try {
        const contract = await getUserContract('admin');
        const queryString: any = {};
        queryString.selector = {
            user_email: email,
            docType: 'User',
            $or: [
                {user_role_name: 'Bác sĩ'},
                {user_role_name: 'Lễ tân'},
            ]
        }
        const rs = await contract.evaluateTransaction('getQueryResultForQueryString', JSON.stringify(queryString));
        const users = JSON.parse(rs.toString());
        console.log(users);
        if(users.length === 0) return "undefined";
        return users[0];
    } catch (error) {
        throw error;
    }
}

// export async function updateVerifyEmail(userId:string): Promise<any> {
//     try {
//         const contract = await getUserContract('admin');
//         const rs = await contract.evaluateTransaction('updateVerifiedEmail', userId); 
//         return {TxID: rs.toString()}
//     } catch (error) {
//         throw error;
//     }
// }

export async function getPatientByPhone(phone: any): Promise<any> {
    try {
        const contract = await getUserContract('admin');
        const queryString: any = {};
        queryString.selector = {
            user_phone: phone,
            docType: 'User',
            user_role_name: 'Bệnh nhân'
        }
        const rs = await contract.evaluateTransaction('getQueryResultForQueryString', JSON.stringify(queryString));
        const users = JSON.parse(rs.toString());
        if(users.length === 0) return undefined;
        return users[0];
    } catch (error) {
        throw error;
    }
}
export async function updateVerifiedPhone(userId:string): Promise<any> {
    try {
        const contract = await getUserContract('admin');
        const rs = await contract.evaluateTransaction('updateVerifiedPhone', userId); 
        return  {success: true, result: rs }
    } catch (error) {
        return {success: false, error: error }
    }
}

export async function getAdminByEmail(email: any): Promise<any> {
    try {
        const contract = await getUserContract('admin');
        const queryString: any = {};
        queryString.selector = {
            user_email: email,
            docType: 'User',
            user_role_name: 'Quản trị viên'
        }
        const rs = await contract.evaluateTransaction('getQueryResultForQueryString', JSON.stringify(queryString));
        const users = JSON.parse(rs.toString());
        if(users.length === 0) {
            return 'undefined';
        }
        else return users[0];
    } catch (error) {
        throw error;
    }
}

export async function getPatientByEmail(email: any): Promise<any> {
    try {
        const contract = await getUserContract('admin');
        const queryString: any = {};
        queryString.selector = {
            user_email: email,
            docType: 'User',
            user_role_name: 'Bệnh nhân'
        }
        const rs = await contract.evaluateTransaction('getQueryResultForQueryString', JSON.stringify(queryString));
        const users = JSON.parse(rs.toString());
        if(users.length === 0) {
            return 'undefined';
        }
        else return users[0];
    } catch (error) {
        throw error;
    }
}

export async function getId(userId: any): Promise<any> {
    try {
        const contract = await getUserContract(userId);
        const rs = await contract.evaluateTransaction('getUserId');
        return rs.toString();
    } catch (error) {
        throw error;
    }
}

export async function getUserById(userId: string): Promise<any> {
    try {
        const contract = await getUserContract('admin');
        const queryString: any = {}
        queryString.selector = {
            docType: 'User',
            user_id: userId,
        }
        const queryResultBuffer = await contract.evaluateTransaction('getQueryResultForQueryString', JSON.stringify(queryString));
        const queryResult = JSON.parse(queryResultBuffer.toString());
        if(queryResult.length > 0) {
            return queryResult[0].Record;
        }
    } catch (error) {
        return null
    }
}


export async function getUserChangePassword(id: string): Promise<any> {
    try {
        const contract = await getUserContract('admin');
        const queryString: any = {}
        queryString.selector = {
            docType: 'User',
            user_id: id,
        }
        const queryResultBuffer = await contract.evaluateTransaction('getQueryResultForQueryString', JSON.stringify(queryString));
        const queryResult = JSON.parse(queryResultBuffer.toString());
        if(queryResult.length > 0) {
            return queryResult[0].Record;
        }
        else return "undefined"
    } catch (error) {
        return "undefined"
    }
}

export async function getUserByPhone(phone: string): Promise<any> {
    try {
        const contract = await getUserContract('admin');
        const queryString: any = {}
        queryString.selector = {
            docType: 'User',
            user_phone: phone,
        }
        const queryResultBuffer = await contract.evaluateTransaction('getQueryResultForQueryString', JSON.stringify(queryString));
        const queryResult = JSON.parse(queryResultBuffer.toString());
        if(queryResult.length > 0) {
            return queryResult[0].Record;
        }
    } catch (error) {
        return null
    }
}

export async function getUserByEmail(email: string): Promise<any> {
    try {
        const contract = await getUserContract('admin');
        const queryString: any = {}
        queryString.selector = {
            docType: 'User',
            user_email: email,
        }
        const queryResultBuffer = await contract.evaluateTransaction('getQueryResultForQueryString', JSON.stringify(queryString));
        const queryResult = JSON.parse(queryResultBuffer.toString());
        if(queryResult.length > 0) {
            return queryResult[0].Record;
        }
    } catch (error) {
        return null
    }
}



export async function queryUser(userId: string, queryString: string): Promise<any> {
    try {
        const contract = await getUserContract(userId);
        const queryResult = await contract.evaluateTransaction('getQueryResultForQueryString', queryString);
        const users = JSON.parse(queryResult.toString());
        if(users.length === 0) return "undefined";
        return users[0];
    } catch (err) {
        throw err
    }
}

export async function queryUserSearch(userId: string, queryString: string): Promise<any> {
    try {
        const contract = await getUserContract(userId);
        const queryResult = await contract.evaluateTransaction('getQueryResultForQueryString', queryString);
        const users = JSON.parse(queryResult.toString());
        if(users.length === 0) return "undefined";
        return users;
    } catch (err) {
        throw err
    }
}
export async function queryUserValid(userId: string, queryString: string): Promise<any> {
    try {
        const contract = await getUserContract(userId);
        const queryResult = await contract.evaluateTransaction('getQueryResultForQueryString', queryString);
        return JSON.parse(queryResult.toString());
    } catch (err) {
        throw err
    }
}

export async function modifyUser(userId: string, user: any) {
    try {
        const contract = await getUserContract(userId);
        const result = await contract.submitTransaction('updateUser', userId, JSON.stringify(user));
        return  {success: true, result: result }
    } catch (error) {
        return {success: false, error: error};
    }
}

export async function changePassword(userId: string, newPassword: string) {
    try {
        const contract = await getUserContract(userId);
        const result = await contract.submitTransaction('changePassword', userId, newPassword);
        return  {success: true, result: result }
    } catch (error) {
        return {success: false, error: error};
    }
}

export async function updateVerifiedEmail(userId: string) {
    try {
        const contract = await getUserContract(userId);
        const result = await contract.submitTransaction('updateVerifiedEmail', userId);
        return {success: true, result: result }
    } catch (error) {
        return {success: false, error: error};
    }
}

export async function updateIsDeleted(modUser: string, userId: string) {
    try {
        const contract = await getUserContract(modUser);
        const result = await contract.submitTransaction('updateIsDeleted', userId);
        return {success: true, result: result }
    } catch (error) {
        return {success: false, error: error};
    }
}

export async function updateIsActived(modUser: string ,userId: string) {
    try {
        const contract = await getUserContract(modUser);
        const result = await contract.submitTransaction('updateIsActived', userId);
        return {success: true, result: result }
    } catch (error) {
        return {success: false, error: error};
    }
}

export async function getAllUser(): Promise<any> {
    try {
        const contract = await getUserContract('admin');
        const queryString: any = {}
        queryString.selector = {
            docType: 'User',
        }
        const queryResultBuffer = await contract.evaluateTransaction('getQueryResultForQueryString', JSON.stringify(queryString));
        const queryResult = JSON.parse(queryResultBuffer.toString());
        return queryResult;
    } catch (error) {
        return error;
    }
}

export async function getAllRole(): Promise<any> {
    try {
        const contract = await getUserContract('admin');
        const queryString: any = {}
        queryString.selector = {
            docType: 'Role',
        }
        const queryResultBuffer = await contract.evaluateTransaction('getQueryResultForQueryString', JSON.stringify(queryString));
        const queryResult = JSON.parse(queryResultBuffer.toString());
        return queryResult;
    } catch (error) {
        return error;
    }
}

export async function getAllPhysician(): Promise<any> {
    try {
        const contract = await getUserContract('admin');
        const queryString: any = {}
        queryString.selector = {
            docType: 'User',
            user_role_name: 'Bác sĩ'
        }
        const queryResultBuffer = await contract.evaluateTransaction('getQueryResultForQueryString', JSON.stringify(queryString));
        const queryResult = JSON.parse(queryResultBuffer.toString());
        return queryResult;
    } catch (error) {
        return error;
    }
}
export async function getAllNursingStaff(): Promise<any> {
    try {
        const contract = await getUserContract('admin');
        const queryString: any = {}
        queryString.selector = {
            docType: 'User',
            user_role_name: 'Điều dưỡng'
        }
        const queryResultBuffer = await contract.evaluateTransaction('getQueryResultForQueryString', JSON.stringify(queryString));
        const queryResult = JSON.parse(queryResultBuffer.toString());
        return queryResult;
    } catch (error) {
        return error;
    }
}

export async function getAllSubclinicalAccounting(): Promise<any> {
    try {
        const contract = await getUserContract('admin');
        const queryString: any = {}
        queryString.selector = {
            docType: 'User',
            user_role_name: 'Kế toán cận lâm sàng'
        }
        const queryResultBuffer = await contract.evaluateTransaction('getQueryResultForQueryString', JSON.stringify(queryString));
        const queryResult = JSON.parse(queryResultBuffer.toString());
        return queryResult;
    } catch (error) {
        return error;
    }
}
export async function getAllSubclinicalStaff(): Promise<any> {
    try {
        const contract = await getUserContract('admin');
        const queryString: any = {}
        queryString.selector = {
            docType: 'User',
            user_role_name: 'Nhân viên cận lâm sàng'
        }
        const queryResultBuffer = await contract.evaluateTransaction('getQueryResultForQueryString', JSON.stringify(queryString));
        const queryResult = JSON.parse(queryResultBuffer.toString());
        return queryResult;
    } catch (error) {
        return error;
    }
}

export async function getAllPharmacist(): Promise<any> {
    try {
        const contract = await getUserContract('admin');
        const queryString: any = {}
        queryString.selector = {
            docType: 'User',
            user_role_name: 'Dược sĩ'
        }
        const queryResultBuffer = await contract.evaluateTransaction('getQueryResultForQueryString', JSON.stringify(queryString));
        const queryResult = JSON.parse(queryResultBuffer.toString());
        return queryResult;
    } catch (error) {
        return error;
    }
}