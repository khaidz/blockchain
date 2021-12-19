import express, { Router, Request, Response } from 'express';
import { authentication } from '../middleware/auth.middleware';
import { nanoid } from 'nanoid';
import { updateMedicalBill, MedicalBill, queryMedicalBill } from '../fabric/medicalbill/MedicalBill.fabric';
import { createPrescription, deletePrescription, getAllPrescription, Prescription, queryPrescription, updatePrescription } from '../fabric/prescription/Prescription.fabric';
import { queryHealthRecord } from '../fabric/healthrecord/HealthRecord.fabric';
import { queryDrug } from '../fabric/drug/Drug.fabric';
import { querySubclinical } from '../fabric/subclinical/Subclinical.fabric';
import { createSubclinicalSheet, deleteSubclinicalSheet, querySubclinicalSheet, SubclinicalSheet } from '../fabric/subclinical_sheet/SubclinicalSheet.fabric';
import multer from "multer";
// import path from "path";
import * as fs from 'fs';
import { History, queryHistory, updateHistory } from '../fabric/history/History.fabric';

const router = express.Router();

router.post('/medical-bill/:idMB/:idH', authentication, async(req, res) => {
    const userId = req.user.user_id;
    const mbId = req.params.idMB;
    const idH = req.params.idH;
    const update : MedicalBill = {
        medical_bill_anamnesis : req.body.medical_bill_anamnesis,  // tien su benh
        medical_bill_appointment: req.body.medical_bill_appointment,
        medical_bill_diagnose: req.body.medical_bill_diagnose,
        medical_bill_medical_history: req.body.medical_bill_medical_history, // lich su benh
        medical_bill_place_of_introduction: req.body.medical_bill_place_of_introduction,
        // medical_bill_previous_result: req.body.medical_bill_previous_result, // ket qua truoc day
        medical_bill_treatment: req.body. medical_bill_treatment,
        medical_bill_reason_for_examination: req.body.medical_bill_reason_for_examination,
        medical_bill_is_completed: req.body.medical_bill_is_completed,
        vital_signs_temperature: req.body.vital_signs_temperature,
        vital_signs_blood_pressure: req.body.vital_signs_blood_pressure,
        vital_signs_breathing: req.body.vital_signs_breathing,
        vital_signs_pluse: req.body.vital_signs_pluse
    }
    const newValue : History =  {
        anamnesis : req.body.medical_bill_anamnesis,
        medical_history: req.body.medical_bill_medical_history
    }
    const rs = await updateHistory(idH, newValue);
    const result = await updateMedicalBill(userId, mbId, update);
    if (result.success){
        return res.status(200).json({success: true});
    }
    else {
        return res.status(200).json({success: false});
    }
    
});

router.get('/search-health-record/', async (req: Request, res: Response) => {
    const {field, value} = req.query;
    if (typeof field === 'undefined' && typeof value === 'undefined') return res.status(200).send({success: false});
    const queryString: any = {};
    queryString.selector = {
        docType: 'HealthRecord',
        health_record_verified: true
    }
    queryString.selector[field?field.toString():''] = value;
    try{
        const result = await queryHealthRecord('admin', JSON.stringify(queryString));
        if (result.length === 0) { console.log(false); return res.status(200).send({success: false});}
        const hr = await Promise.all(result.map((hr: { Record: any; }) => hr.Record));
        return res.status(200).send({success: true, data: hr});
    } catch(error) {
        return res.status(200).send({success: false});
    }
});

router.get('/search-medical-bill/', async (req: Request, res: Response) => {
    const {field, value} = req.query;
    if (typeof field === 'undefined' && typeof value === 'undefined') return res.status(200).send({success: false});
    const queryString: any = {};
    queryString.selector = {
        docType: 'MedicalBill',
    }
    queryString.selector[field?field.toString():''] = value;
    try{
        const result = await queryMedicalBill('admin', JSON.stringify(queryString));
        if (result.length === 0) { console.log(false); return res.status(200).send({success: false});}
        const hr = await Promise.all(result.map((hr: { Record: any; }) => hr.Record));
        return res.status(200).send({success: true, data: hr});
    } catch(error) {
        return res.status(200).send({success: false});
    }
});

router.post('/prescription/medical-bill/:id', authentication, async(req, res) => {
    const userId = req.user.user_id;
    const mbId = req.params.id;
    const prescription : Prescription = {
        prescription_id: "P" + nanoid().toUpperCase(),
        prescription_medical_bill_id: mbId,
        prescription_drug_name: req.body.prescription_drug_name,
        prescription_drug_instruction: req.body.drug_instruction,
        prescription_drug_unit: req.body.drug_unit,
        prescription_drug_dosage_form: req.body.drug_dosage_form,
        prescription_drug_route: req.body.drug_route,
        prescription_doctor_instruction: req.body.doctor_instruction,
        drug_numbers: req.body.drug_numbers,
    }
    const rs = await createPrescription(prescription, userId); 
    if (rs.success) {
        return res.status(200).send({success: true});
    }
    else {
        return res.status(200).send({success: false});
    }
})

router.post('/prescription/:id', authentication, async(req, res) => {
    const userId = req.user.user_id;
    const pId = req.params.id;
    const update : Prescription = {
        prescription_drug_name: req.body.drug_name,
        prescription_drug_dosage_form: req.body.drug_dosage_form,
        prescription_drug_route: req.body.drug_route,
        prescription_drug_unit: req.body.drug_unit,
        prescription_drug_instruction: req.body.drug_instruction,
        prescription_doctor_instruction: req.body.doctor_instruction,
        drug_numbers: req.body.drug_numbers
    }
    const result = await updatePrescription(userId, pId, update);
    if (result.success){
        return res.status(200).json({success: true});
    }
    else {
        return res.status(200).json({success: false});
    }
    
});

router.get('/search-prescription/', async (req: Request, res: Response) => {
    const {field, value} = req.query;
    if (typeof field === 'undefined' && typeof value === 'undefined') return res.status(200).send({success: false});
    const queryString: any = {};
    queryString.selector = {
        docType: 'Prescription',
        prescription_is_deleted: false
    }
    queryString.selector[field?field.toString():''] = value;
    try{
        const result = await queryPrescription('admin', JSON.stringify(queryString));
        if (result.length === 0) { console.log(false); return res.status(200).send({success: false});}
        const p = await Promise.all(result.map((prescription: { Record: any; }) => prescription.Record));
        return res.status(200).send({success: true, data: p});
    } catch(error) {
        return res.status(200).send({success: false});
    }
});

router.get('/delete/:id', authentication, async (req, res) => {
    const uId = req.user.user_id;
    const pId = req.params.id;
    const result = await deletePrescription(uId, pId);
    if(result){
        return res.status(201).send({success: true});
    }
    else return res.status(201).send({success: false});
});

router.get('/search-drug/', async (req: Request, res: Response) => {
    const {field, value} = req.query;
    if (typeof field === 'undefined' && typeof value === 'undefined') return res.status(200).send({success: false});
    const queryString: any = {};
    queryString.selector = {
        docType: 'Drug',
    }
    queryString.selector[field?field.toString():''] = value;
    try{
        const result = await queryDrug('admin', JSON.stringify(queryString));
        if (result.length === 0) { console.log(false); return res.status(200).send({success: false});}
        const drug = await Promise.all(result.map((drug: { Record: any; }) => drug.Record));
        return res.status(200).send({success: true, data: drug});
    } catch(error) {
        return res.status(200).send({success: false});
    }
});

router.get('/search-subclinical/', async (req: Request, res: Response) => {
    const {field, value} = req.query;
    if (typeof field === 'undefined' && typeof value === 'undefined') return res.status(200).send({success: false});
    const queryString: any = {};
    queryString.selector = {
        docType: 'Subclinical',
    }
    queryString.selector[field?field.toString():''] = value;
    try{
        const result = await querySubclinical('admin', JSON.stringify(queryString));
        if (result.length === 0) { console.log(false); return res.status(200).send({success: false});}
        const s = await Promise.all(result.map((s: { Record: any; }) => s.Record));
        return res.status(200).send({success: true, data: s});
    } catch(error) {
        return res.status(200).send({success: false});
    }
});
router.get('/search-subclinical-sheet/', async (req: Request, res: Response) => {
    const {field, value} = req.query;
    if (typeof field === 'undefined' && typeof value === 'undefined') return res.status(200).send({success: false});
    const queryString: any = {};
    queryString.selector = {
        docType: 'SubclinicalSheet',
        subclinical_sheet_is_deleted: false
    }
    queryString.selector[field?field.toString():''] = value;
    try{
        const result = await querySubclinicalSheet('admin', JSON.stringify(queryString));
        if (result.length === 0) { return res.status(200).send({success: false});}
        const ss= await Promise.all(result.map((ss: { Record: any; }) => ss.Record));
        return res.status(200).send({success: true, data: ss});
    } catch(error) {
        return res.status(200).send({success: false});
    }
});

router.post('/subclinical-sheet/medical-bill/:id', authentication, async(req, res) => {
    const userId = req.user.user_id;
    const mbId = req.params.id;
    const ss : SubclinicalSheet = {
        subclinical_sheet_id: "S" + nanoid().toUpperCase(),
        subclinical_sheet_medical_bill_id : mbId,
        subclinical_sheet_results: req.body.results,
        subclinical_sheet_images: req.body.images,
        subclinical_name: req.body.name,
    }
    const rs = await createSubclinicalSheet(ss, userId); 
    if (rs.success) {
        return res.status(200).send({success: true});
    }
    else {
        return res.status(200).send({success: false});
    }
})

router.get('/delete-subclinical/:id', authentication, async (req, res) => {
    const uId = req.user.user_id;
    const pId = req.params.id;
    const result = await deleteSubclinicalSheet(uId, pId);
    if(result){
        return res.status(201).send({success: true});
    }
    else return res.status(201).send({success: false});
});

router.get('/search-history/', async (req: Request, res: Response) => {
    const {field, value} = req.query;
    const id = req.params.id;
    if (typeof field === 'undefined' && typeof value === 'undefined') return res.status(200).send({success: false});
    const queryString: any = {};
    queryString.selector = {
        docType: 'History',
    }
    queryString.selector[field?field.toString():''] = value;
    try{
        const result = await queryHistory('admin', JSON.stringify(queryString));
        if (result.length === 0) { return res.status(200).send({success: false});}
        const history = await Promise.all(result.map((history: { Record: any; }) => history.Record));
        return res.status(200).send({success: true, data: history});
    } catch(error) {
        return res.status(200).send({success: false});
    }
});

export default router;