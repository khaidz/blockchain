"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthRecordContract = void 0;
const fabric_contract_api_1 = require("fabric-contract-api");
class HealthRecordContract extends fabric_contract_api_1.Contract {
    constructor() {
        super('HealthRecord');
    }
    // Sổ khám bệnh ===========================================================================================================================
    // Lễ tân tạo mới sổ khám bệnh
    async createHealthRecord(ctx, hrAsString) {
        try {
            const hr = JSON.parse(hrAsString);
            hr.health_record_created_at = new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh', hour12: false }),
                hr.health_record_verified = false,
                hr.health_record_created_by = this.getUserId(ctx),
                hr.docType = 'HealthRecord',
                await ctx.stub.putState(hr.health_record_id, Buffer.from(JSON.stringify(hr)));
            return { success: true };
        }
        catch (error) {
            console.log(error);
            return { success: false };
        }
    }
    // Lễ tân, người dùng cập nhật sổ khám
    async updateHealthRecord(ctx, hrId, payload) {
        try {
            const hrAsBytes = await ctx.stub.getState(hrId);
            const newInfo = JSON.parse(payload);
            const healthrecord = JSON.parse(hrAsBytes.toString());
            const updateHealthRecord = Object.assign(Object.assign({}, healthrecord), newInfo);
            updateHealthRecord.health_record_modified_at = new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh', hour12: false });
            updateHealthRecord.health_record_modified_by = this.getUserId(ctx);
            await ctx.stub.putState(updateHealthRecord.health_record_id, Buffer.from(JSON.stringify(updateHealthRecord)));
            return { success: true };
        }
        catch (error) {
            return { success: false };
        }
    }
    // Truy vấn tất cả sổ khám 
    async queryAllHealthRecords(ctx) {
        const queryString = {};
        queryString.selector = {
            docType: 'HealthRecord',
        };
        const queryResult = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        return JSON.parse(queryResult);
    }
    async acceptVerifyHealthRecord(ctx, hrId) {
        try {
            const rsAsBytes = await ctx.stub.getState(hrId);
            const hr = JSON.parse(rsAsBytes.toString());
            hr.health_record_verified = true;
            await ctx.stub.putState(hr.health_record_id, Buffer.from(JSON.stringify(hr)));
            console.log(`Da xac thuc HR ${hr.health_record_id}.`);
            return { success: true };
        }
        catch (error) {
            return {
                success: false,
                error: error
            };
        }
    }
    // Hỗ  trợ truy vấn
    async getQueryResultForQueryString(ctx, queryString) {
        let resultsIterator = await ctx.stub.getQueryResult(queryString);
        let results = await this.getAllResults(resultsIterator, false);
        return JSON.stringify(results);
    }
    async queryResult(ctx, queryString) {
        let resultsIterator = await ctx.stub.getQueryResult(queryString);
        let results = await this.getAllResults(resultsIterator, false);
        return results;
    }
    async getAllResults(iterator, isHistory) {
        let allResults = [];
        let res = await iterator.next();
        while (!res.done) {
            if (res.value && res.value.value.toString()) {
                let jsonRes = {};
                if (isHistory && isHistory === true) {
                    jsonRes.TxId = res.value.tx_id;
                    jsonRes.Timestamp = res.value.timestamp;
                    try {
                        jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
                    }
                    catch (err) {
                        console.log(err);
                        jsonRes.Value = res.value.value.toString('utf8');
                    }
                }
                else {
                    jsonRes.Key = res.value.key;
                    try {
                        jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                    }
                    catch (err) {
                        console.log(err);
                        jsonRes.Record = res.value.value.toString('utf8');
                    }
                }
                allResults.push(jsonRes);
            }
            res = await iterator.next();
        }
        iterator.close();
        return allResults;
    }
    getUserId(ctx) {
        const rs = ctx.clientIdentity.getID();
        const find = rs.match(/[A-Za-z0-9_-]{22}/);
        if (find === null)
            return 'admin';
        return find[0];
    }
    // Phiếu khám bệnh ========================================================================================================================
    // Lễ tân tạo phiếu khám mới
    async createMedicalBill(ctx, mbAsString) {
        try {
            const medical_bill = JSON.parse(mbAsString);
            medical_bill.medical_bill_created_at = new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh', hour12: false }),
                medical_bill.medical_bill_created_by = this.getUserId(ctx),
                medical_bill.medical_bill_status = false,
                medical_bill.medical_bill_is_deleted = false,
                medical_bill.medical_bill_is_completed = false,
                medical_bill.docType = 'MedicalBill',
                await ctx.stub.putState(medical_bill.medical_bill_id, Buffer.from(JSON.stringify(medical_bill)));
            return JSON.stringify({
                TxID: ctx.stub.getTxID(),
                regId: medical_bill.medical_bill_id,
            });
        }
        catch (error) {
            console.log(error);
            return "";
        }
    }
    // Lễ tân, bác sĩ, điều dưỡng, kết toán, nhân viên cls, dược sĩ cập nhật phiếu khám
    async updateMedicalBill(ctx, mbId, payload) {
        try {
            const mbAsBytes = await ctx.stub.getState(mbId);
            const newInfo = JSON.parse(payload);
            const medical_bill = JSON.parse(mbAsBytes.toString());
            const updateMedicalBill = Object.assign(Object.assign({}, medical_bill), newInfo);
            updateMedicalBill.medical_bill_modified_at = new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh', hour12: false }),
                updateMedicalBill.medical_bill_modified_by = this.getUserId(ctx);
            await ctx.stub.putState(updateMedicalBill.medical_bill_id, Buffer.from(JSON.stringify(updateMedicalBill)));
            return { error: null };
        }
        catch (error) {
            return { error: error };
        }
    }
    // Truy vấn tất cả phiếu khám 
    async queryAllMedicalBills(ctx) {
        const queryString = {};
        queryString.selector = {
            docType: 'MedicalBill',
        };
        const queryResult = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        return JSON.parse(queryResult);
    }
    async deleteMedicalBill(ctx, Id) {
        await ctx.stub.deleteState(Id);
    }
    async queryMedicalBill(ctx, Id) {
        const queryString = {};
        queryString.selector = {
            docType: 'MedicalBill',
            medical_bill_health_record_id: Id
        };
        const queryResult = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        return JSON.parse(queryResult);
    }
    // Người dùng =============================================================================================================================
    async createUser(ctx, userAsString) {
        console.log('START========CREATE-USER===========');
        const user = JSON.parse(userAsString);
        user.user_created_at = new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh', hour12: false });
        user.user_created_by = this.getUserId(ctx);
        user.user_modified_at = null;
        user.user_modified_by = null;
        user.user_is_deleted = false;
        await ctx.stub.putState(user.user_id, Buffer.from(JSON.stringify(user)));
        console.log("END========CREATE-USER===========");
    }
    async changePassword(ctx, userId, newPassword) {
        const userAsBytes = await ctx.stub.getState(userId);
        const user = JSON.parse(userAsBytes.toString());
        user.user_password = newPassword;
        await ctx.stub.putState(user.user_id, Buffer.from(JSON.stringify(user)));
        return ctx.stub.getTxID();
    }
    async updateVerifiedEmail(ctx, userId) {
        const userAsBytes = await ctx.stub.getState(userId);
        const user = JSON.parse(userAsBytes.toString());
        user.user_verified_email = true;
        await ctx.stub.putState(user.user_id, Buffer.from(JSON.stringify(user)));
        return ctx.stub.getTxID();
    }
    async updateIsDeleted(ctx, userId) {
        const userAsBytes = await ctx.stub.getState(userId);
        const user = JSON.parse(userAsBytes.toString());
        user.user_is_deleted = true;
        await ctx.stub.putState(user.user_id, Buffer.from(JSON.stringify(user)));
        return ctx.stub.getTxID();
    }
    async updateIsActived(ctx, userId) {
        const userAsBytes = await ctx.stub.getState(userId);
        const user = JSON.parse(userAsBytes.toString());
        user.user_is_deleted = false;
        await ctx.stub.putState(user.user_id, Buffer.from(JSON.stringify(user)));
        return ctx.stub.getTxID();
    }
    async updateUser(ctx, userId, payload) {
        try {
            const userAsBytes = await ctx.stub.getState(userId);
            const newInfo = JSON.parse(payload);
            const user = JSON.parse(userAsBytes.toString());
            const updateUser = Object.assign(Object.assign({}, user), newInfo);
            updateUser.user_modified_at = new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh', hour12: false }),
                updateUser.user_modified_by = this.getUserId(ctx);
            await ctx.stub.putState(updateUser.user_id, Buffer.from(JSON.stringify(updateUser)));
            return { error: null };
        }
        catch (error) {
            return { error: error };
        }
    }
    async readUserByUID(ctx, key) {
        const userAsBytes = await ctx.stub.getState(key);
        if (!userAsBytes || userAsBytes.length === 0) {
            throw new Error(`Cannot find any User has ${key} key`);
        }
        return userAsBytes.toString();
    }
    async queryUserByPhone(ctx, phone) {
        const queryString = {};
        queryString.selector = {
            docType: 'User',
            user_phone: phone,
        };
        const queryResult = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        return JSON.parse(queryResult);
    }
    async queryUserByEmail(ctx, email) {
        const queryString = {};
        queryString.selector = {
            docType: 'User',
            user_email: email,
        };
        const queryResult = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        return JSON.parse(queryResult);
    }
    async updateVerifiedPhone(ctx, userId) {
        const userAsBytes = await ctx.stub.getState(userId);
        let user;
        try {
            user = JSON.parse(userAsBytes.toString());
        }
        catch (error) {
            return "";
        }
        user.user_verified_phone = true,
            await ctx.stub.putState(userId, Buffer.from(JSON.stringify(user)));
        return ctx.stub.getTxID();
    }
    // Khoa ===================================================================================================================================
    async addDepartment(ctx, payload) {
        try {
            const department = JSON.parse(payload);
            department.docType = 'Department';
            await ctx.stub.putState(department.department_id, Buffer.from(JSON.stringify(department)));
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    async updateDepartment(ctx, Id, payload) {
        try {
            const rsAsBytes = await ctx.stub.getState(Id);
            const newInfo = JSON.parse(payload);
            const rs = JSON.parse(rsAsBytes.toString());
            const update = Object.assign(Object.assign({}, rs), newInfo);
            await ctx.stub.putState(update.department_id, Buffer.from(JSON.stringify(update)));
            return { success: true };
        }
        catch (error) {
            return { success: false, error: error };
        }
    }
    // Truy vấn tất cả khoa
    async queryAllDepartment(ctx) {
        const queryString = {};
        queryString.selector = {
            docType: 'Department',
        };
        const queryResult = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        return JSON.parse(queryResult);
    }
    async deleteDepartment(ctx, dpmId) {
        try {
            const dpmAsBytes = await ctx.stub.getState(dpmId);
            const dpm = JSON.parse(dpmAsBytes.toString());
            dpm.department_is_deleted = true;
            await ctx.stub.putState(dpm.department_id, Buffer.from(JSON.stringify(dpm)));
            console.log(`Da xoa khoa ${dpm.department_name}.`);
            return { success: true };
        }
        catch (error) {
            return { success: false, error: error };
        }
    }
    async activeDepartment(ctx, dpmId) {
        try {
            const dpmAsBytes = await ctx.stub.getState(dpmId);
            const dpm = JSON.parse(dpmAsBytes.toString());
            dpm.department_is_deleted = false;
            await ctx.stub.putState(dpm.department_id, Buffer.from(JSON.stringify(dpm)));
            console.log(`Da khoi phuc ${dpm.department_name}.`);
            return { success: true };
        }
        catch (error) {
            return { success: false, error: error };
        }
    }
    async queryAllDepartment_Active(ctx) {
        const queryString = {};
        queryString.selector = {
            docType: 'Department',
            department_is_deleted: false
        };
        const queryResult = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        return JSON.parse(queryResult);
    }
    // Phòng ===================================================================================================================================
    async addRoom(ctx, payload) {
        try {
            const room = JSON.parse(payload);
            room.docType = 'Room';
            await ctx.stub.putState(room.room_id, Buffer.from(JSON.stringify(room)));
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    async updateRoom(ctx, roomId, payload) {
        try {
            const rsAsBytes = await ctx.stub.getState(roomId);
            const newInfo = JSON.parse(payload);
            const rs = JSON.parse(rsAsBytes.toString());
            const update = Object.assign(Object.assign({}, rs), newInfo);
            await ctx.stub.putState(update.room_id, Buffer.from(JSON.stringify(update)));
            return { success: true };
        }
        catch (error) {
            return { success: false, error: error };
        }
    }
    // Truy vấn tất cả phòng
    async queryAllRoom(ctx) {
        const queryString = {};
        queryString.selector = {
            docType: 'Room',
        };
        const queryResult = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        return JSON.parse(queryResult);
    }
    async queryAllRoom_Active(ctx) {
        const queryString = {};
        queryString.selector = {
            docType: 'Room',
            room_is_deleted: false
        };
        const queryResult = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        return JSON.parse(queryResult);
    }
    async readRoomById(ctx, key) {
        const roomAsBytes = await ctx.stub.getState(key);
        if (!roomAsBytes || roomAsBytes.length === 0) {
            throw new Error(`Cannot find any Room has ${key} key`);
        }
        return roomAsBytes.toString();
    }
    async deleteRoom(ctx, roomId) {
        try {
            const roomAsBytes = await ctx.stub.getState(roomId);
            const room = JSON.parse(roomAsBytes.toString());
            room.room_is_deleted = true;
            await ctx.stub.putState(room.room_id, Buffer.from(JSON.stringify(room)));
            console.log(`Da xoa ${room.room_name}.`);
            return { success: true };
        }
        catch (error) {
            return {
                success: false,
                error: error
            };
        }
    }
    async activeRoom(ctx, roomId) {
        try {
            const roomAsBytes = await ctx.stub.getState(roomId);
            const room = JSON.parse(roomAsBytes.toString());
            room.room_is_deleted = false;
            await ctx.stub.putState(room.room_id, Buffer.from(JSON.stringify(room)));
            console.log(`Da khoi phuc ${room.room_name}.`);
            return { success: true };
        }
        catch (error) {
            return {
                success: false,
                error: error
            };
        }
    }
    // Lich su benh =================
    async addHistory(ctx, payload) {
        try {
            const history = JSON.parse(payload);
            history.docType = 'History';
            await ctx.stub.putState(history.history_id, Buffer.from(JSON.stringify(history)));
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    async updateHistory(ctx, hId, payload) {
        try {
            const rsAsBytes = await ctx.stub.getState(hId);
            const newInfo = JSON.parse(payload);
            const rs = JSON.parse(rsAsBytes.toString());
            const update = Object.assign(Object.assign({}, rs), newInfo);
            await ctx.stub.putState(update.history_id, Buffer.from(JSON.stringify(update)));
            return { success: true };
        }
        catch (error) {
            return { success: false, error: error };
        }
    }
    // Thuốc ==================================================================================================================================
    async addDrug(ctx, payload) {
        try {
            const drug = JSON.parse(payload);
            drug.docType = 'Drug';
            await ctx.stub.putState(drug.drug_id, Buffer.from(JSON.stringify(drug)));
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    async updateDrug(ctx, Id, payload) {
        try {
            const rsAsBytes = await ctx.stub.getState(Id);
            const newInfo = JSON.parse(payload);
            const rs = JSON.parse(rsAsBytes.toString());
            const update = Object.assign(Object.assign({}, rs), newInfo);
            await ctx.stub.putState(update.drug_id, Buffer.from(JSON.stringify(update)));
            return { success: true };
        }
        catch (error) {
            return { success: false, error: error };
        }
    }
    // Truy vấn tất cả thuốc
    async queryAllDrug(ctx) {
        const queryString = {};
        queryString.selector = {
            docType: 'Drug',
        };
        const queryResult = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        return JSON.parse(queryResult);
    }
    async queryDrug_Active(ctx) {
        const queryString = {};
        queryString.selector = {
            docType: 'Drug',
            drug_is_deleted: false
        };
        const queryResult = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        return JSON.parse(queryResult);
    }
    async deleteDrug(ctx, drugId) {
        try {
            const rsAsBytes = await ctx.stub.getState(drugId);
            const drug = JSON.parse(rsAsBytes.toString());
            drug.drug_is_deleted = true;
            await ctx.stub.putState(drug.drug_id, Buffer.from(JSON.stringify(drug)));
            console.log(`Da xoa thuoc ${drug.drug_name}.`);
            return { success: true };
        }
        catch (error) {
            return { success: false, error: error };
        }
    }
    async activeDrug(ctx, drugId) {
        try {
            const rsAsBytes = await ctx.stub.getState(drugId);
            const drug = JSON.parse(rsAsBytes.toString());
            drug.drug_is_deleted = false;
            await ctx.stub.putState(drug.drug_id, Buffer.from(JSON.stringify(drug)));
            console.log(`Da xoa thuoc ${drug.drug_name}.`);
            return { success: true };
        }
        catch (error) {
            return { success: false, error: error };
        }
    }
    // Cận lâm sàng Subclinical ===============================================================================================================
    async addSubclinical(ctx, payload) {
        try {
            const subclinical = JSON.parse(payload);
            subclinical.docType = 'Subclinical';
            await ctx.stub.putState(subclinical.subclinical_id, Buffer.from(JSON.stringify(subclinical)));
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    async updateSubclinical(ctx, Id, payload) {
        try {
            const rsAsBytes = await ctx.stub.getState(Id);
            const newInfo = JSON.parse(payload);
            const rs = JSON.parse(rsAsBytes.toString());
            const update = Object.assign(Object.assign({}, rs), newInfo);
            await ctx.stub.putState(update.subclinical_id, Buffer.from(JSON.stringify(update)));
            return { success: true };
        }
        catch (error) {
            return { success: false, error: error };
        }
    }
    // Truy vấn tất cả cận lâm sàng
    async queryAllSubclinical(ctx) {
        const queryString = {};
        queryString.selector = {
            docType: 'Subclinical',
        };
        const queryResult = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        return JSON.parse(queryResult);
    }
    async querySubclinical_Active(ctx) {
        const queryString = {};
        queryString.selector = {
            docType: 'Subclinical',
            subclinical_is_deleted: false
        };
        const queryResult = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        return JSON.parse(queryResult);
    }
    async deleteSubclinical(ctx, Id) {
        try {
            const rsAsBytes = await ctx.stub.getState(Id);
            const rs = JSON.parse(rsAsBytes.toString());
            rs.subclinical_is_deleted = true;
            await ctx.stub.putState(rs.subclinical_id, Buffer.from(JSON.stringify(rs)));
            console.log(`Da xoa ${rs.subclinical_name}.`);
            return { success: true };
        }
        catch (error) {
            return { success: false, error: error };
        }
    }
    async activeSubclinical(ctx, Id) {
        try {
            const rsAsBytes = await ctx.stub.getState(Id);
            const rs = JSON.parse(rsAsBytes.toString());
            rs.subclinical_is_deleted = false;
            await ctx.stub.putState(rs.subclinical_id, Buffer.from(JSON.stringify(rs)));
            console.log(`Da xoa ${rs.subclinical_name}.`);
            return { success: true };
        }
        catch (error) {
            return { success: false, error: error };
        }
    }
    // Đơn thuốc ==============================================================================================================================
    async createPrescription(ctx, pAsString) {
        try {
            const prescription = JSON.parse(pAsString);
            prescription.prescription_created_at = new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh', hour12: false }),
                prescription.prescription_created_by = this.getUserId(ctx),
                prescription.prescription_is_deleted = false,
                prescription.docType = 'Prescription',
                await ctx.stub.putState(prescription.prescription_id, Buffer.from(JSON.stringify(prescription)));
            return JSON.stringify({
                TxID: ctx.stub.getTxID(),
                regId: prescription.prescription_id,
            });
        }
        catch (error) {
            console.log(error);
            return "";
        }
    }
    async updatePrescription(ctx, pId, payload) {
        try {
            const pAsBytes = await ctx.stub.getState(pId);
            const newInfo = JSON.parse(payload);
            const prescription = JSON.parse(pAsBytes.toString());
            const updatePrescription = Object.assign(Object.assign({}, prescription), newInfo);
            updatePrescription.prescription_modified_at = new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh', hour12: false });
            updatePrescription.prescription_modified_by = this.getUserId(ctx);
            await ctx.stub.putState(updatePrescription.prescription_id, Buffer.from(JSON.stringify(updatePrescription)));
            return { error: null };
        }
        catch (error) {
            return { error: error };
        }
    }
    // Truy vấn tất cả sổ khám 
    async queryAllPrescription(ctx) {
        const queryString = {};
        queryString.selector = {
            docType: 'Prescription',
        };
        const queryResult = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        return JSON.parse(queryResult);
    }
    async deletePrescription(ctx, Id) {
        try {
            const rsAsBytes = await ctx.stub.getState(Id);
            const p = JSON.parse(rsAsBytes.toString());
            p.prescription_is_deleted = true;
            await ctx.stub.putState(p.prescription_id, Buffer.from(JSON.stringify(p)));
            console.log(`Da xoa don thuoc ${p.prescription_drug_name}.`);
            return { success: true };
        }
        catch (error) {
            return { success: false, error: error };
        }
    }
    // Đăng nhập =========================================
    async createLogin(ctx, iAsString) {
        try {
            const login = JSON.parse(iAsString);
            login.docType = 'Login',
                login.login_created_at = new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh', hour12: false }),
                await ctx.stub.putState(login.login_id, Buffer.from(JSON.stringify(login)));
            return JSON.stringify({
                TxID: ctx.stub.getTxID(),
                regId: login.login_id,
            });
        }
        catch (error) {
            console.log(error);
            return "";
        }
    }
    async queryAllLogin(ctx) {
        const queryString = {};
        queryString.selector = {
            docType: 'Login',
        };
        const queryResult = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        return JSON.parse(queryResult);
    }
    // Phiếu cận lâm sàng =====================================================================================================================
    async createSubclinicalSheet(ctx, ssAsString) {
        try {
            const subclinical_sheet = JSON.parse(ssAsString);
            subclinical_sheet.subclinical_sheet_created_at = new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh', hour12: false }),
                subclinical_sheet.subclinical_sheet_created_by = this.getUserId(ctx),
                subclinical_sheet.subclinical_sheet_is_deleted = false,
                subclinical_sheet.docType = 'SubclinicalSheet',
                await ctx.stub.putState(subclinical_sheet.subclinical_sheet_id, Buffer.from(JSON.stringify(subclinical_sheet)));
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    async updateSubclinicalSheet(ctx, ssId, payload) {
        try {
            const ssAsBytes = await ctx.stub.getState(ssId);
            const newInfo = JSON.parse(payload);
            const subclinical_sheet = JSON.parse(ssAsBytes.toString());
            const updateSubclinicalSheet = Object.assign(Object.assign({}, subclinical_sheet), newInfo);
            await ctx.stub.putState(updateSubclinicalSheet.subclinical_sheet_id, Buffer.from(JSON.stringify(updateSubclinicalSheet)));
            return { success: true, error: null };
        }
        catch (error) {
            return { success: false, error: error };
        }
    }
    // Truy vấn tất cả phiếu cận lâm sàng 
    async queryAllSubclinicalSheet(ctx) {
        const queryString = {};
        queryString.selector = {
            docType: 'SubclinicalSheet',
        };
        const queryResult = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        return JSON.parse(queryResult);
    }
    // Truy vấn sổ khám bằng ID
    async readSubclinicalSheetById(ctx, key) {
        const ssAsBytes = await ctx.stub.getState(key);
        if (!ssAsBytes || ssAsBytes.length === 0) {
            throw new Error(`Cannot find any Health Record has ${key} key`);
        }
        return ssAsBytes.toString();
    }
    async deleteSubclinicalSheet(ctx, Id) {
        try {
            const rsAsBytes = await ctx.stub.getState(Id);
            const ss = JSON.parse(rsAsBytes.toString());
            ss.subclinical_sheet_is_deleted = true;
            await ctx.stub.putState(ss.subclinical_sheet_id, Buffer.from(JSON.stringify(ss)));
            console.log(`Đã xóa phiếu cận lâm sàng ${ss.subclinical_name}.`);
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    // Thêm vào sổ cái ========================================================================================================================
    async initLedger(ctx) {
        const department1 = {
            department_id: 'department_01',
            department_is_deleted: false,
            department_name: 'Khoa Nhi',
            department_description: 'Khoa khám bệnh Nhi',
            docType: 'Department',
        };
        const department2 = {
            department_id: 'department_02',
            department_is_deleted: false,
            department_name: 'Khoa Ung Bướu',
            department_description: 'Khoa khám bệnh Ung Bướu',
            docType: 'Department',
        };
        const department3 = {
            department_id: 'department_03',
            department_is_deleted: false,
            department_name: 'Khoa Da Liễu',
            department_description: 'Khoa khám bệnh Da Liễu',
            docType: 'Department',
        };
        const department4 = {
            department_id: 'department_04',
            department_is_deleted: false,
            department_name: 'Khoa Chấn Thương Chỉnh Hình',
            department_description: 'Khoa khám bệnh Chấn Thương Chỉnh Hình',
            docType: 'Department',
        };
        const department5 = {
            department_id: 'department_05',
            department_is_deleted: false,
            department_name: 'Khoa Y Học Cổ Truyền',
            department_description: 'Khoa khám bệnh Y Học Cổ Truyền',
            docType: 'Department',
        };
        const room1 = {
            room_id: 'room_01',
            room_is_deleted: false,
            room_name: 'Phòng khám Nhi 01',
            room_department_name: 'Khoa Nhi',
            room_number: '1',
            room_description: 'Phòng khám bệnh Nhi 01',
            docType: 'Room',
        };
        const room2 = {
            room_id: 'room_02',
            room_is_deleted: false,
            room_name: 'Phòng khám Nhi 02',
            room_department_name: 'Khoa Nhi',
            room_number: '2',
            room_description: 'Phòng khám bệnh Nhi 02',
            docType: 'Room',
        };
        const room3 = {
            room_id: 'room_03',
            room_is_deleted: false,
            room_name: 'Phòng khám Ung Bướu 01',
            room_department_name: 'Khoa Ung Bướu',
            room_number: '1',
            room_description: 'Phòng khám bệnh Ung Bướu 01',
            docType: 'Room',
        };
        const room5 = {
            room_id: 'room_05',
            room_is_deleted: false,
            room_name: 'Phòng khám Da Liễu 01',
            room_department_name: 'Khoa Da Liễu',
            room_number: '1',
            room_description: 'Phòng khám bệnh Da Liễu 01',
            docType: 'Room',
        };
        const room7 = {
            room_id: 'room_07',
            room_is_deleted: false,
            room_name: 'Phòng khám Chấn Thương Chỉnh Hình 01',
            room_department_name: 'Khoa Chấn Thương Chỉnh Hình',
            room_number: '1',
            room_description: 'Phòng khám bệnh Chấn Thương Chỉnh Hình 01',
            docType: 'Room',
        };
        const room9 = {
            room_id: 'room_09',
            room_is_deleted: false,
            room_name: 'Phòng khám Y Học Cổ Truyền 01',
            room_department_name: 'Khoa Y Học Cổ Truyền',
            room_number: '1',
            room_description: 'Phòng khám bệnh Y Học Cổ Truyền 01',
            docType: 'Room',
        };
        const subclinical1 = {
            subclinical_id: 'subclinical_01',
            subclinical_is_deleted: false,
            docType: 'Subclinical',
            subclinical_name: 'Siêu âm Doppler màu tim/mạch máu',
            subclinical_description: 'Siêu âm Doppler màu tim/mạch máu',
        };
        const subclinical2 = {
            subclinical_id: 'subclinical_02',
            subclinical_is_deleted: false,
            docType: 'Subclinical',
            subclinical_name: 'Chụp Xquang phim  ≤ 24x30 cm (1 tư thế)',
            subclinical_description: 'Chụp Xquang phim  ≤ 24x30 cm (1 tư thế)',
        };
        const subclinical3 = {
            subclinical_id: 'subclinical_03',
            subclinical_is_deleted: false,
            docType: 'Subclinical',
            subclinical_name: 'Chụp Xquang phổi',
            subclinical_description: 'Chụp Xquang phổi',
        };
        const subclinical6 = {
            subclinical_id: 'subclinical_06',
            subclinical_is_deleted: false,
            docType: 'Subclinical',
            subclinical_name: 'Chụp X-quang số hóa 1 phim',
            subclinical_description: 'Chụp X-quang số hóa 1 phim',
        };
        const subclinical9 = {
            subclinical_id: 'subclinical_09',
            subclinical_is_deleted: false,
            docType: 'Subclinical',
            subclinical_name: 'Cắt chỉ',
            subclinical_description: 'Cắt chỉ',
        };
        const subclinical10 = {
            subclinical_id: 'subclinical_10',
            subclinical_is_deleted: false,
            docType: 'Subclinical',
            subclinical_name: 'Tháo bột khác',
            subclinical_description: 'Tháo bột khác',
        };
        const subclinical12 = {
            subclinical_id: 'subclinical_12',
            subclinical_is_deleted: false,
            docType: 'Subclinical',
            subclinical_name: 'Châm (các phương pháp châm)',
            subclinical_description: 'Châm (các phương pháp châm)',
        };
        const subclinical13 = {
            subclinical_id: 'subclinical_13',
            subclinical_is_deleted: false,
            docType: 'Subclinical',
            subclinical_name: 'Chụp và phân tích da bằng máy',
            subclinical_description: 'Chụp và phân tích da bằng máy',
        };
        const drug1 = {
            docType: 'Drug',
            drug_instruction: 'Uống theo chỉ định của bác sĩ',
            drug_dosage_form: 'Hộp 4 vỉ xé x 4 viên',
            drug_id: 'drug_01',
            drug_is_deleted: false,
            drug_name: 'Paracetamol 500',
            drug_route: 'Uống',
            drug_unit: 'viên',
        };
        const drug2 = {
            docType: 'Drug',
            drug_instruction: 'Tiêm theo chỉ định của bác sĩ',
            drug_dosage_form: 'Hộp 5 ống 1,5ml',
            drug_id: 'drug_02',
            drug_is_deleted: false,
            drug_name: 'Mobic (Tiêm)',
            drug_route: 'Tiêm',
            drug_unit: 'ống',
        };
        const drug3 = {
            docType: 'Drug',
            drug_instruction: 'Uống theo chỉ định của bác sĩ',
            drug_dosage_form: 'Hộp 2 vỉ 10 viên',
            drug_id: 'drug_03',
            drug_is_deleted: false,
            drug_name: 'Mobic (Uống)',
            drug_route: 'Uống',
            drug_unit: 'viên',
        };
        const drug4 = {
            docType: 'Drug',
            drug_instruction: 'Uống theo chỉ định của bác sĩ',
            drug_dosage_form: 'Hộp 3 vỉ 10 viên',
            drug_id: 'drug_04',
            drug_is_deleted: false,
            drug_name: 'Cardilopin',
            drug_route: 'Uống',
            drug_unit: 'viên',
        };
        const drug5 = {
            docType: 'Drug',
            drug_instruction: 'Uống theo chỉ định của bác sĩ',
            drug_dosage_form: 'Test',
            drug_id: 'drug_05',
            drug_is_deleted: false,
            drug_name: 'Augmentin',
            drug_route: 'Uống',
            drug_unit: 'viên',
        };
        const drug6 = {
            docType: 'Drug',
            drug_instruction: 'Uống theo chỉ định của bác sĩ',
            drug_dosage_form: 'Test',
            drug_id: 'drug_06',
            drug_is_deleted: false,
            drug_name: 'Bromhexin',
            drug_route: 'Uống',
            drug_unit: 'viên',
        };
        await ctx.stub.putState(department1.department_id, Buffer.from(JSON.stringify(department1)));
        await ctx.stub.putState(department2.department_id, Buffer.from(JSON.stringify(department2)));
        await ctx.stub.putState(department3.department_id, Buffer.from(JSON.stringify(department3)));
        await ctx.stub.putState(department4.department_id, Buffer.from(JSON.stringify(department4)));
        await ctx.stub.putState(department5.department_id, Buffer.from(JSON.stringify(department5)));
        await ctx.stub.putState(drug1.drug_id, Buffer.from(JSON.stringify(drug1)));
        await ctx.stub.putState(drug2.drug_id, Buffer.from(JSON.stringify(drug2)));
        await ctx.stub.putState(drug3.drug_id, Buffer.from(JSON.stringify(drug3)));
        await ctx.stub.putState(drug4.drug_id, Buffer.from(JSON.stringify(drug4)));
        await ctx.stub.putState(drug5.drug_id, Buffer.from(JSON.stringify(drug5)));
        await ctx.stub.putState(drug6.drug_id, Buffer.from(JSON.stringify(drug6)));
        await ctx.stub.putState(room1.room_id, Buffer.from(JSON.stringify(room1)));
        await ctx.stub.putState(room2.room_id, Buffer.from(JSON.stringify(room2)));
        await ctx.stub.putState(room3.room_id, Buffer.from(JSON.stringify(room3)));
        await ctx.stub.putState(room5.room_id, Buffer.from(JSON.stringify(room5)));
        await ctx.stub.putState(room7.room_id, Buffer.from(JSON.stringify(room7)));
        await ctx.stub.putState(room9.room_id, Buffer.from(JSON.stringify(room9)));
        await ctx.stub.putState(subclinical1.subclinical_id, Buffer.from(JSON.stringify(subclinical1)));
        await ctx.stub.putState(subclinical2.subclinical_id, Buffer.from(JSON.stringify(subclinical2)));
        await ctx.stub.putState(subclinical3.subclinical_id, Buffer.from(JSON.stringify(subclinical3)));
        await ctx.stub.putState(subclinical6.subclinical_id, Buffer.from(JSON.stringify(subclinical6)));
        await ctx.stub.putState(subclinical9.subclinical_id, Buffer.from(JSON.stringify(subclinical9)));
        await ctx.stub.putState(subclinical10.subclinical_id, Buffer.from(JSON.stringify(subclinical10)));
        await ctx.stub.putState(subclinical12.subclinical_id, Buffer.from(JSON.stringify(subclinical12)));
        await ctx.stub.putState(subclinical13.subclinical_id, Buffer.from(JSON.stringify(subclinical13)));
    }
}
exports.HealthRecordContract = HealthRecordContract;
//# sourceMappingURL=healthrecordContract.js.map