import express, { Router, Request, Response } from 'express';
import { User, queryUser, modifyUser, changePassword, getUserById, queryUserSearch, queryUserValid, getUserChangePassword, updateIsDeleted, updateIsActived } from '../fabric/user/User.fabric';
import { authentication } from '../middleware/auth.middleware';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import QRCode from 'qrcode';
import cors from 'cors';
var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }
const router = express.Router();
router.use(cors(corsOptions));

const jwt_secret = process.env.JWT_SECRET || "blockchain";
const uidLen = 8;
router.get('/me', authentication, async (req: Request, res: Response) => {
    res.send(req.user);
});
router.post('/me/changePassword', authentication, async (req: Request, res: Response) => {
    try {
        const pass = req.body.user_password;
        const oldPass = req.body.oldPass;
        const user = await getUserChangePassword(req.user.user_id);
        if(user === "undefined") return res.status(200).send({success: false, message: "Mật khẩu cũ không đúng"});
        const check = await bcrypt.compare(oldPass, user.user_password);
        if(check){
            const result = await changePassword(req.user.user_id, bcrypt.hashSync(pass, 5));
            if(result.success){ 
                return res.status(200).send({success: true});
            }
            return res.status(200).send({success: false, message: "Thất bại"});
        }
        else {
            return res.status(200).send({success: false, message: "Mật khẩu cũ không đúng"});
        }
    } catch (error) {
        console.log(error);
        return res.status(200).send({success: false})
    }
});
router.get('/validate/', async (req: Request, res: Response) => {
    const {field, value} = req.query;
    if (typeof field === 'undefined' && typeof value === 'undefined') return res.send({valid: false});
    const queryString: any = {};
    queryString.selector = {
        docType: 'User',
    }
    queryString.selector[field?field.toString():''] = value;
    try{
        const result = await queryUserValid('admin', JSON.stringify(queryString));
        if (result.length === 0)  {return res.send({valid: true});}
        else {return res.send({valid: false});}
    } catch(error) {
        return res.send({valid: false});
    }
});
router.get('/search', async (req: Request, res: Response) => {
    const {field, value} = req.query;
    if (typeof field === 'undefined' && typeof value === 'undefined') return res.status(200).send({success: false});
    const queryString: any = {};
    queryString.selector = {
        docType: 'User',
    }
    queryString.selector[field?field.toString():''] = value;
    try{
        const result = await queryUserSearch('admin', JSON.stringify(queryString));
        if (result.length === 0) return res.status(200).send({success: false});
        const users = await Promise.all(result.map((users: { Record: any; }) => users.Record));
        return res.status(200).send({success: true, data: users});
    } catch(error) {
        return res.status(200).send({success: false});
    }
});
router.get('/search-staff', async (req: Request, res: Response) => {
    const {field, value} = req.query;
    if (typeof field === 'undefined' && typeof value === 'undefined') return res.status(200).send({success: false});
    const queryString: any = {};
    queryString.selector = {
        docType: 'User',
        $or: [
            {user_role_name: 'Bác sĩ'},
            {user_role_name: 'Lễ tân'},
            {user_role_name: 'Quản trị viên'}
        ]
    }
    queryString.selector[field?field.toString():''] = value;
    try{
        const result = await queryUserSearch('admin', JSON.stringify(queryString));
        if (result.length === 0) return res.status(200).send({success: false});
        const users = await Promise.all(result.map((users: { Record: any; }) => users.Record));
        return res.status(200).send({success: true, data: users});
    } catch(error) {
        return res.status(200).send({success: false});
    }
});

router.get('/search/staff', async (req: Request, res: Response) => {
    const queryString: any = {};
    queryString.selector = {
        docType: 'User',
        $or: [
            {user_role_name: 'Bác sĩ'},
            {user_role_name: 'Lễ tân'},
            {user_role_name: 'Quản trị viên'}
        ]
    }
    try{
        const result = await queryUserSearch('admin', JSON.stringify(queryString));
        if (result==="undefined") return res.status(200).send({success: false});
        const users = await Promise.all(result.map((users: { Record: any; }) => users.Record));
        return res.status(200).send({success: true, data: users});
    } catch(error) {
        return res.status(200).send({success: false});
    }
});

router.get('/search/physician', async (req: Request, res: Response) => {
    const queryString: any = {};
    queryString.selector = {
        docType: 'User',
        user_role_name: 'Bác sĩ'
    }
    try{
        const result = await queryUserSearch('admin', JSON.stringify(queryString));
        if (result.length === 0) return res.status(200).send({success: false});
        const users = await Promise.all(result.map((users: { Record: any; }) => users.Record));
        return res.status(200).send({success: true, data: users});
    } catch(error) {
        return res.status(200).send({success: false});
    }
});
router.get('/search/patient', async (req: Request, res: Response) => {
    const queryString: any = {};
    queryString.selector = {
        docType: 'User',
        user_role_name: 'Bệnh nhân'
    }
    try{
        const result = await queryUserSearch('admin', JSON.stringify(queryString));
        if (result.length === 0) return res.status(200).send({success: false});
        const users = await Promise.all(result.map((users: { Record: any; }) => users.Record));
        return res.status(200).send({success: true, data: users});
    } catch(error) {
        return res.status(200).send({success: false});
    }
});
router.get('/search-patient/', async (req: Request, res: Response) => {
    const {field, value} = req.query;
    if (typeof field === 'undefined' && typeof value === 'undefined') return res.status(200).send({success: false});
    const queryString: any = {};
    queryString.selector = {
        docType: 'User',
        user_role_name: 'Bệnh nhân'
    }
    queryString.selector[field?field.toString():''] = value;
    try{
        const result = await queryUserSearch('admin', JSON.stringify(queryString));
        if (result.length === 0) return res.status(200).send({success: false});
        const users = await Promise.all(result.map((users: { Record: any; }) => users.Record));
        return res.status(200).send({success: true, data: users});
    } catch(error) {
        return res.status(200).send({success: false});
    }
});
router.get('/profile', authentication, async (req: Request, res: Response) => {
    const queryResult: any = {}
    queryResult.selector = {
        docType: 'User',
        user_id: req.user.user_id
    }
    const result = await queryUser(req.user.user_id, JSON.stringify(queryResult));
    delete result.Record.user_password;
        const token = jwt.sign(result.Record, 'blockchain');
        const dataURL = result.Record.user_id;
        const qr= await QRCode.toDataURL(dataURL);
        const img = qr;
        const rs = {
            success: true,
            data: {
                user: result.Record,
                token: token,
                qr: img
            }
        }
    res.status(200).json(rs);
});

router.post('/:id', authentication, async (req: Request, res: Response) => {
    const user = req.body;
    const result = await modifyUser(req.user.user_id, user);
    if(result.success){ 
        console.log("Cập nhật người dùng "+user.user_id +":"+result.success)
        return res.status(200).send({success: true});
    }
    return res.status(200).send({success: false});
});
router.post('/is_deleted/:id', authentication, async (req: Request, res: Response) => {
    const userId = req.params.id;
    const result = await updateIsDeleted(req.user.user_id, userId);
    if(result.success){ 
        return res.status(200).send({success: true});
    }
    return res.status(200).send({success: false});
});
router.post('/is_actived/:id', authentication, async (req: Request, res: Response) => {
    const userId = req.params.id;
    const result = await updateIsActived(req.user.user_id, userId);
    if(result.success){ 
        return res.status(200).send({success: true});
    }
    return res.status(200).send({success: false});
})

export default router; 