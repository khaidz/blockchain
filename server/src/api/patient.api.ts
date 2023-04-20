import express, { Router, Request, Response, request } from 'express';
import { acceptVerifyHealthRecord } from '../fabric/healthrecord/HealthRecord.fabric';
import { queryMedicalBill } from '../fabric/medicalbill/MedicalBill.fabric';
import { queryPrescription } from '../fabric/prescription/Prescription.fabric';
import { querySubclinicalSheet } from '../fabric/subclinical_sheet/SubclinicalSheet.fabric';
import cors from 'cors';

const router = express.Router();


router.get('/verify/:hrId/:id', async (req, res) => {
    const id = req.params.id;
    const hrId = req.params.hrId;
    const result = await acceptVerifyHealthRecord(id, hrId);
    if(result.success) return res.send("<html><script>alert('Xác thực thành công!');</script></html");
    return res.send("<html><script>alert('Xác thực thất bại!');</script></html");
});

router.get('/search-medical-bill/', cors(), async (req: Request, res: Response) => {
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
        if (result.length === 0) { console.log(false); return res.status(200).send({success: false});}
        const ss= await Promise.all(result.map((ss: { Record: any; }) => ss.Record));
        return res.status(200).send({success: true, data: ss});
    } catch(error) {
        return res.status(200).send({success: false});
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

export default router;