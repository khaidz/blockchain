import express, { Router, Request, Response, request } from "express";
import { authentication } from "../middleware/auth.middleware";
import {
    MedicalBill,
    createMedicalBill,
} from "../fabric/medicalbill/MedicalBill.fabric";
import {
    HealthRecord,
    createHealthRecord,
    queryHealthRecord,
    updateHealthRecord,
} from "../fabric/healthrecord/HealthRecord.fabric";
import { getUserById } from "../fabric/user/User.fabric";
import { nanoid } from "nanoid";
import { sendMail } from "../mailer";
import { History, createHistory } from "../fabric/history/History.fabric";
import { DEFAULT_HOST } from "../constant";
const router = express.Router();

router.post(
    "/create-health-record",
    authentication,
    async (req: Request, res: Response) => {
        try {
            const email = req.user.user_id;
            const hr: HealthRecord = {
                health_record_id: "H" + nanoid().toUpperCase(),
                health_record_patient_id: req.body.user_id,
                health_record_health_insurance: req.body.user_health_insurance,
                health_record_patient_name: req.body.user_fullname,
            };
            const patient = await getUserById(hr.health_record_patient_id);
            const userEmail = patient.user_email;
            await createHealthRecord(hr, email);
            const hs: History = {
                history_id: "H" + nanoid().toUpperCase(),
                history_patient_id: req.body.user_id,
                anamnesis: "Không có",
                medical_history: "Không có",
            };
            const rs2 = await createHistory(hs);
            const subject = "Health Record xác thực email";
            const body =
                "<p>Kính chào quý bệnh nhân!</p>" +
                "<p>Email này đã được dùng để xác thực tạo sổ khám bệnh của bạn trên hệ thống Health Record.</p>" +
                "<p>Vui lòng nhấp vào link sau để xác thực tạo sổ khám bệnh: <a href='" +
                DEFAULT_HOST +
                "/patient/verify/" +
                hr.health_record_id +
                "/" +
                hr.health_record_patient_id +
                "'>" +
                DEFAULT_HOST +
                "/patient/verify/" +
                hr.health_record_id +
                "/" +
                hr.health_record_patient_id +
                "</a></p>" +
                "<p>Lưu ý: </p>" +
                "<p> - Đây là email tự động của hệ thống Health Record. Vui lòng không trả lời email này.</p>" +
                "<p> Xin cảm ơn quý khách đã tin dùng hệ thống Health Record!</p>";
            await sendMail(userEmail, subject, body);
            return res.status(201).json({
                success: true,
                message: `Đăng ký sổ khám ${hr.health_record_id} ${hr.health_record_patient_id} thành công. Chờ bệnh nhân xác thực!`,
            });
        } catch (error) {
            console.log(error);
            return res.status(400).send("error while register health record");
        }
    }
);

router.post("/health-record/:id", authentication, async (req, res) => {
    const userId = req.user.user_id;
    const hrId = req.params.id;
    const update: HealthRecord = {
        health_record_patient_id: req.body.health_record_patient_id,
        health_record_health_insurance: req.body.health_record_health_insurance,
        health_record_patient_name: req.body.health_record_patient_name,
    };
    const result = await updateHealthRecord(userId, hrId, update);
    if (result.success) {
        return res.status(200).json({ success: true });
    } else {
        return res.status(200).json({ success: false });
    }
});

router.get("/search-healthrecord/", async (req: Request, res: Response) => {
    const { field, value } = req.query;
    if (typeof field === "undefined" && typeof value === "undefined")
        return res.send({ valid: false });
    const queryString: any = {};
    queryString.selector = {
        docType: "HealthRecord",
    };
    queryString.selector[field ? field.toString() : ""] = value;
    try {
        const result = await queryHealthRecord(
            "admin",
            JSON.stringify(queryString)
        );
        if (result.length === 0) {
            return res.send({ valid: false });
        } else {
            return res.send({ valid: true });
        }
    } catch (error) {
        return res.send({ valid: error });
    }
});
router.post("/create-medical-bill", authentication, async (req, res) => {
    try {
        const userId = req.user.user_id;
        const mb: MedicalBill = {
            medical_bill_id: "M" + nanoid().toUpperCase(),
            medical_bill_health_insurance:
                req.body.health_record_health_insurance,
            medical_bill_ordinal_number: req.body.ordinal_number,
            medical_bill_department_name: req.body.department,
            medical_bill_health_record_id: req.body.health_record_id,
            medical_bill_patient_name: req.body.health_record_patient_name,
            medical_bill_patient_id: req.body.health_record_patient_id,
            medical_bill_physician_name: req.body.physician,
            medical_bill_physician_id: req.body.pId,
            medical_bill_room_name: req.body.room,
        };
        const rs1 = await createMedicalBill(mb, userId);
        if (rs1) {
            return res.status(201).json({
                success: true,
                message: "Đã tạo phiếu khám thành công!",
            });
        } else {
            return res.status(201).json({
                success: false,
                message: "Lỗi tạo phiếu khám!",
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).send({ success: false, error: error });
    }
});

router.get("/search-health-record/", async (req: Request, res: Response) => {
    const { field, value } = req.query;
    if (typeof field === "undefined" && typeof value === "undefined")
        return res.status(200).send({ success: false });
    const queryString: any = {};
    queryString.selector = {
        docType: "HealthRecord",
        health_record_verified: true,
    };
    queryString.selector[field ? field.toString() : ""] = value;
    try {
        const result = await queryHealthRecord(
            "admin",
            JSON.stringify(queryString)
        );
        if (result.length === 0) {
            return res.status(200).send({ success: false });
        }
        const hr = await Promise.all(
            result.map((hr: { Record: any }) => hr.Record)
        );
        {
            return res.status(200).send({ success: true, data: hr });
        }
    } catch (error) {
        return res.status(200).send({ success: false });
    }
});

router.get("/search-health-record/all", async (req: Request, res: Response) => {
    const queryString: any = {};
    queryString.selector = {
        docType: "HealthRecord",
        health_record_verified: true,
    };
    try {
        const result = await queryHealthRecord(
            "admin",
            JSON.stringify(queryString)
        );
        if (result.length === 0) {
            return res.status(200).send({ success: false });
        }
        const hr = await Promise.all(
            result.map((hr: { Record: any }) => hr.Record)
        );
        {
            return res.status(200).send({ success: true, data: hr });
        }
    } catch (error) {
        return res.status(200).send({ success: false });
    }
});

export default router;
