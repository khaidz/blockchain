import express, { Router, Request, Response } from 'express';
import { Room, createRoom, updateRoom, getAllRoom, getRoomById, getAllRoomActive, activeRoom, deleteRoom, getRoomByDepartmentId, queryRoom } from '../fabric/room/Room.fabric';
import { Department, getAllDepartment, getAllDepartmentActive, getDepartmentById, createDepartment, updateDepartment, activeDepartment, deleteDepartment, queryDepartment} from '../fabric/department/Department.fabric';
import { authentication } from '../middleware/auth.middleware';
import { nanoid } from 'nanoid';
import { activeDrug, createDrug, deleteDrug, Drug, getAllDrug, getAllDrugActive, queryDrug, updateDrug } from '../fabric/drug/Drug.fabric';
import { activeSubclinical, createSubclinical, deleteSubclinical, getAllSubclinical, getAllSubclinicalActive, querySubclinical, Subclinical, updateSubclinical } from '../fabric/subclinical/Subclinical.fabric';
import { getAllLogin } from '../fabric/login/Login.fabric';
import { queryMedicalBill } from '../fabric/medicalbill/MedicalBill.fabric';
import { queryHealthRecord } from '../fabric/healthrecord/HealthRecord.fabric';
const router = express.Router();

router.get('/login', authentication, async (req, res) => {
    const result = await getAllLogin();
    const logins = await Promise.all(result.result.login.map((logins: { Record: any; }) => logins.Record))
    return res.status(201).send(logins);
});
router.get('/search-medical-bill', async (req: Request, res: Response) => {
    console.log("mb");
    const queryString: any = {};
    queryString.selector = {
        docType: 'MedicalBill',
    }
    try{
        const result = await queryMedicalBill('admin', JSON.stringify(queryString));
        if (result.length === 0) { console.log(false); return res.status(200).send({success: false});}
        const hr = await Promise.all(result.map((hr: { Record: any; }) => hr.Record));
        return res.status(200).send({success: true, data: hr});
    } catch(error) {
        return res.status(200).send({success: false});
    }
});
router.get('/search-health-record', async (req: Request, res: Response) => {
    console.log("hr");
    const queryString: any = {};
    queryString.selector = {
        docType: 'HealthRecord',
    }
    try{
        const result = await queryHealthRecord('admin', JSON.stringify(queryString));
        if (result.length === 0) { console.log(false); return res.status(200).send({success: false});}
        const hr = await Promise.all(result.map((hr: { Record: any; }) => hr.Record));
        return res.status(200).send({success: true, data: hr});
    } catch(error) {
        return res.status(200).send({success: false});
    }
});
// Room ===========================================================================================
router.get('/room', authentication, async (req, res) => {
    const result = await getAllRoom();
    const rooms = await Promise.all(result.result.rooms.map((room: { Record: any; }) => room.Record))
    return res.status(201).send(rooms);
});

router.get('/validate-room/', async (req: Request, res: Response) => {
    const {field, value} = req.query;
    if (typeof field === 'undefined' && typeof value === 'undefined') return res.send({valid: false});
    const queryString: any = {};
    queryString.selector = {
        docType: 'Room',
    }
    queryString.selector[field?field.toString():''] = value;
    try{
        const result = await queryRoom('admin', JSON.stringify(queryString));
        if (result.length === 0) return res.send({valid: true});
        return res.send({valid: false});
    } catch(error) {
        return res.send({valid: false});
    }
});
router.get('/room-active', authentication, async (req, res) => {
    const rooms = await getAllRoomActive();
    return res.status(201).send(rooms);
});

router.post('/room', authentication, async(req, res) =>{
    try {
        const room : Room = {
            room_id: 'R' + nanoid().toUpperCase(),
            room_name: req.body.name,
            room_department_name: req.body.department_name,
            room_number: req.body.number,
            room_description: req.body.description,
            room_is_deleted: false,
        }
        await createRoom(room);
        return res.status(201).json({
            success: false,
            message: `Dang ky thanh cong phong ${room.room_name}` 
        })
    }
    catch (error) {
        console.log(error);
        return res.status(400).send("error while register user");
    }
});

router.post('/room/:id', authentication, async (req: Request, res: Response) => {
    const room = req.body;
    room.room_id = req.params.id;
    const result = await updateRoom(room.room_id ,room);
    if(result) return res.send({success: true});
    return res.send({success: false});
});
router.post('/room-active/:id', authentication, async(req, res)=>{
    const room = req.body;
    room.room_id = req.params.id;
    const result = await activeRoom(room.room_id);
    if(result) return res.send({success: true});
    else return res.send({success: false});
});
router.post('/room-delete/:id', authentication, async(req, res)=>{
    const room = req.body;
    room.room_id = req.params.id;
    const result = await deleteRoom(room.room_id);
    if(result) return res.send({success: true});
    else return res.send({success: false});
});

// Department =====================================================================================

router.get('/department', authentication, async (req, res) => {
    const result = await getAllDepartment();
    const department = await Promise.all(result.result.departments.map((department: { Record: any; }) => department.Record));
    // console.log(department);
    return res.status(201).send(department);
});
router.get('/validate-department/', async (req: Request, res: Response) => {
    const {field, value} = req.query;
    if (typeof field === 'undefined' && typeof value === 'undefined') return res.send({valid: false});
    const queryString: any = {};
    queryString.selector = {
        docType: 'Department',
    }
    queryString.selector[field?field.toString():''] = value;
    try{
        const result = await queryDepartment('admin', JSON.stringify(queryString));
        if (result.length === 0) return res.send({valid: true});
        return res.send({valid: false});
    } catch(error) {
        return res.send({valid: false});
    }
});
router.get('/department-active', authentication, async (req, res) => {
    const departments = await getAllDepartmentActive();
    return res.status(201).send(departments);
});

router.get('/department/:id/room', authentication, async (req, res) => {
    const dId = req.params.id;
    const departments = await getRoomByDepartmentId(dId);
    return res.status(201).send(departments);
});

router.post('/department', authentication, async(req, res) =>{
    try {
        const department : Department = {
            department_id: 'D' + nanoid().toUpperCase(),
            department_name: req.body.name,
            department_description: req.body.description,
            department_is_deleted: false,
        }
        await createDepartment(department);
        return res.status(200).json({
            success: true,
            message: `Đăng ký thành công ${department.department_name}` 
        })
    }
    catch (error) {
        console.log(error);
        return res.status(400).send("error while register user");
    }
});

router.post('/department/:id', authentication, async (req: Request, res: Response) => {
    const department = req.body;
    department.department_id = req.params.id;
    // console.log(department);
    const result = await updateDepartment(department.department_id, department);
    if(result.success) return res.send({success: true});
    return res.send({success: false, error: result});
});
router.post('/department-active/:id', authentication, async(req, res)=>{
    const department = req.body;
    department.department_id = req.params.id;
    const result = await activeDepartment(department.department_id);
    if(result) return res.send({success: true});
    return res.send({success: false});
});
router.post('/department-delete/:id', authentication, async(req, res)=>{
    const department = req.body;
    department.department_id = req.params.id;
    const result = await deleteDepartment(department.department_id);
    if(result) return res.send({success: true});
    return res.send({success: false});
});

// Drug ===========================================================================================

router.get('/drug', authentication, async (req, res) => {
    const result = await getAllDrug();
    const drugs = await Promise.all(result.result.drugs.map((drugs: { Record: any; }) => drugs.Record));
    return res.status(201).send(drugs);
});

router.get('/drug-active', authentication, async (req, res) => {
    const drugs = await getAllDrugActive();
    return res.status(201).send(drugs);
});
router.get('/validate-drug/', async (req: Request, res: Response) => {
    const {field, value} = req.query;
    if (typeof field === 'undefined' && typeof value === 'undefined') return res.send({valid: false});
    const queryString: any = {};
    queryString.selector = {
        docType: 'Drug',
    }
    queryString.selector[field?field.toString():''] = value;
    try{
        const result = await queryDrug('admin', JSON.stringify(queryString));
        if (result.length === 0) return res.send({valid: true});
        return res.send({valid: false});
    } catch(error) {
        return res.send({valid: false});
    }
});
router.post('/drug', authentication, async(req, res) =>{
    try {
        const drug : Drug = {
            drug_id: 'D' + nanoid().toUpperCase(),
            drug_name: req.body.name,
            drug_instruction: req.body.instruction,
            drug_unit: req.body.unit,
            drug_dosage_form: req.body.dosageForm,
            drug_route: req.body.route,
            drug_is_deleted: false,
        }
        await createDrug(drug);
        return res.status(201).json({
            success: false,
            message: `Dang ky thanh cong ${drug.drug_name}` 
        })
    }
    catch (error) {
        console.log(error);
        return res.status(400).send("error while register drug");
    }
});

router.post('/drug/:id', authentication, async (req: Request, res: Response) => {
    const drug = req.body;
    const result = await updateDrug(drug.drug_id, drug);
    if(result.success) return res.send({success: true});
    return res.send({success: false, error: result});
});
router.post('/drug-active/:id', authentication, async(req, res)=>{
    const drug = req.body;
    drug.drug_id = req.params.id;
    const result = await activeDrug(drug.drug_id);
    if(result) return res.send({success: true});
    return res.send({success: false});
});
router.post('/drug-delete/:id', authentication, async(req, res)=>{
    const drug = req.body;
    drug.drug_id = req.params.id;
    const result = await deleteDrug(drug.drug_id);
    if(result) return res.send({success: true});
    return res.send({success: false});
});

// Subclinical

router.get('/subclinical', authentication, async (req, res) => {
    const  result = await getAllSubclinical();
    const subclinicals = await Promise.all(result.result.subclinicals.map((subclinicals: { Record: any; }) => subclinicals.Record));
    return res.status(201).send(subclinicals);
});

router.get('/subclinical-active', authentication, async (req, res) => {
    const subclinicals = await getAllSubclinicalActive();
    return res.status(201).send(subclinicals);
});

router.post('/subclinical', authentication, async(req, res) =>{
    try {
        const subclinical : Subclinical = {
            subclinical_id: 'S' + nanoid().toUpperCase(),
            subclinical_name: req.body.name,
            subclinical_description: req.body.description,
            subclinical_is_deleted: false,
        }
        await createSubclinical(subclinical);
        return res.status(201).json({
            success: false,
            message: `Dang ky thanh cong ${subclinical.subclinical_name}` 
        })
    }
    catch (error) {
        console.log(error);
        return res.status(400).send("error while register subclinical");
    }
});

router.post('/subclinical/:id', authentication, async (req: Request, res: Response) => {
    const subclinical = req.body;
    // subclinical.subclinical_id = req.params.id;
    const result = await updateSubclinical(subclinical.subclinical_id, subclinical);
    if(result.success) return res.send({success: true});
    return res.send({success: false, error: result});
});
router.post('/subclinical-active/:id', authentication, async(req, res)=>{
    const subclinical = req.body;
    subclinical.subclinical_id = req.params.id;
    const result = await activeSubclinical(subclinical.subclinical_id);
    if(result) return res.send({success: true});
    return res.send({success: false});
});
router.post('/subclinical-delete/:id', authentication, async(req, res)=>{
    const subclinical = req.body;
    subclinical.subclinical_id = req.params.id;
    const result = await deleteSubclinical(subclinical.subclinical_id);
    if(result) return res.send({success: true});
    return res.send({success: false});
});
router.get('/validate-subclinical/', async (req: Request, res: Response) => {
    const {field, value} = req.query;
    if (typeof field === 'undefined' && typeof value === 'undefined') return res.send({valid: false});
    const queryString: any = {};
    queryString.selector = {
        docType: 'Subclinical',
    }
    queryString.selector[field?field.toString():''] = value;
    try{
        const result = await querySubclinical('admin', JSON.stringify(queryString));
        if (result.length === 0) return res.send({valid: true});
        return res.send({valid: false});
    } catch(error) {
        return res.send({valid: false});
    }
});

export default router;