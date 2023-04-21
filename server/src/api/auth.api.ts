import express, { Router, Request, Response } from "express";
import {
    User,
    registerUser,
    getId,
    getAllUser,
    getAllRole,
    updateVerifiedEmail,
    getUserById,
    getStaffByEmail,
    getAdminByEmail,
    getPatientByPhone,
    updateVerifiedPhone,
    getUserByEmail,
    getPatientByEmail,
} from "../fabric/user/User.fabric";
import * as bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import * as jwt from "jsonwebtoken";
import { FABRIC_ERROR_CODE } from "../constant";
import { authentication } from "../middleware/auth.middleware";
import { sendMail } from "../mailer";
import QRCode from "qrcode";
import randomstring from "randomstring";
import { createLogin, Login } from "../fabric/login/Login.fabric";
import { DEFAULT_HOST } from "../constant";
const router = express.Router();

const jwt_secret = process.env.JWT_SECRET || "blockchain";

router.get("/", async (req, res) => {
    const result = await getAllUser();
    const users = await Promise.all(
        result.map((users: { Record: any }) => users.Record)
    );
    return res.status(201).send(users);
});

router.get("/verifyEmail/:user_id", async (req, res) => {
    const user = req.body;
    user.user_id = req.params.user_id;
    const id = user.user_id;
    const result = await updateVerifiedEmail(id);
    if (result.success)
        return res.send(
            "<html><script>alert('Xác thực thành công');</script></html"
        );
    return res.send("<html><script>alert('Xác thực thất bại');</script></html");
});

router.get("/verifyPhone/:user_id", async (req, res) => {
    const user = req.body;
    user.user_id = req.params.user_id;
    const id = user.user_id;
    const result = await updateVerifiedPhone(id);
    if (result.success)
        return res.send({ success: true, result: result, id: id });
    return res.send({ success: false });
});

router.post("/registry/patient", async (req: Request, res: Response) => {
    const pass = randomstring.generate(8);
    try {
        const patient: User = {
            user_id: "U" + nanoid().toUpperCase(),
            user_fullname: req.body.fullName,
            user_phone: req.body.phoneNumber,
            user_date_of_birth: req.body.dateOfBirth,
            user_password: bcrypt.hashSync(pass, 5),
            user_identity_card: req.body.identityCard,
            user_role_name: "Bệnh nhân",
            user_address: req.body.address,
            user_gender: req.body.gender,
            user_job: req.body.job,
            user_email: req.body.email,
            user_workplace: req.body.workPlace,
            user_family_name: req.body.familyName,
            user_family_phone: req.body.familyPhone,
            user_health_insurance: req.body.bhyt,
            user_is_actived: true,
            user_is_deleted: false,
            user_verified_email: false,
            user_verified_phone: false,
            docType: "User",
        };
        await registerUser(patient);
        const subject = "Health Record xác thực email";
        const htmlContent =
            "<p>Xin chào " +
            req.body.fullName +
            "</p>" +
            "<p>Địa chỉ email này đã được dùng để xác thực tài khoản Health Record của bạn.</p>" +
            "<p>Mật khẩu của bạn là: <b>" +
            pass +
            "</b></p>" +
            " <p>Vui lòng nhấp vào link sau để xác thực: <a href='" +
            DEFAULT_HOST +
            "/auth/verifyEmail/" +
            patient.user_id +
            "'>" +
            DEFAULT_HOST +
            "/auth/verifyEmail/" +
            patient.user_id +
            "</a></p>" +
            "<p>Lưu ý: </p>" +
            "<p> - Sau khi xác thực thành công, hãy thay đổi mật khẩu để đảm bảo bảo mật tài khoản. </p>" +
            "<p> - Liên hệ quầy lễ tân khi cần cập nhật thông tin cá nhân nếu bạn là bệnh nhân. </p>" +
            "<p> - Đây là email tự động của hệ thống Health Record. Vui lòng không trả lời email này.</p>" +
            "<p>Xin cảm ơn quý khách đã tin dùng hệ thống Health Record! </p>";

        await sendMail(patient.user_email, subject, htmlContent);
        console.log({
            success: true,
            message: `Dang ky thanh cong ${req.body.fullName} . Da gui email xac thuc`,
        });
        return res.status(201).send({
            success: true,
            message: `Dang ky thanh cong ${req.body.fullName} . Da gui email xac thuc`,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message: error,
        });
    }
});

router.post(
    "/registry/admin",
    authentication,
    async (req: Request, res: Response) => {
        const pass = randomstring.generate(8);
        try {
            const admin: User = {
                user_id: "U" + nanoid().toUpperCase(),
                user_fullname: req.body.fullName,
                user_phone: req.body.phoneNumber,
                user_date_of_birth: req.body.dateOfBirth,
                user_password: bcrypt.hashSync(pass, 5),
                user_identity_card: req.body.identityCard,
                user_role_name: "Quản trị viên",
                user_address: req.body.address,
                user_gender: req.body.gender,
                user_job: req.body.job,
                user_email: req.body.email,
                user_workplace: req.body.workPlace,
                user_is_actived: true,
                user_is_deleted: false,
                user_verified_email: false,
                user_verified_phone: false,
                docType: "User",
            };
            await registerUser(admin);
            const subject = "Health Record xác thực email";
            const htmlContent =
                "<p>Xin chào " +
                req.body.fullName +
                "</p>" +
                "<p>Địa chỉ email này đã được dùng để xác thực tài khoản Health Record của bạn.</p>" +
                "<p>Mật khẩu của bạn là: <b>" +
                pass +
                "</b></p>" +
                " <p>Vui lòng nhấp vào link sau để xác thực: <a href='" +
                DEFAULT_HOST +
                "/auth/verifyEmail/" +
                admin.user_id +
                "'>" +
                DEFAULT_HOST +
                "/auth/verifyEmail/" +
                admin.user_id +
                "</a></p>" +
                "<p>Lưu ý: </p>" +
                "<p> - Sau khi xác thực thành công, hãy thay đổi mật khẩu để đảm bảo bảo mật tài khoản. </p>" +
                "<p> - Liên hệ quầy lễ tân khi cần cập nhật thông tin cá nhân nếu bạn là bệnh nhân. </p>" +
                "<p> - Đây là email tự động của hệ thống Health Record. Vui lòng không trả lời email này.</p>" +
                "<p>Xin cảm ơn quý khách đã tin dùng hệ thống Health Record! </p>";

            await sendMail(admin.user_email, subject, htmlContent);
            return res.status(201).json({
                success: true,
                message: `Dang ky thanh cong ${req.body.fullName} . Da gui email xac thuc`,
            });
        } catch (error) {
            console.log(error);
            return res.status(400).send({
                success: false,
                message: error,
            });
        }
    }
);

router.post(
    "/registry/staff",
    authentication,
    async (req: Request, res: Response) => {
        const pass = randomstring.generate(8);
        try {
            const staff: User = {
                user_id: "U" + nanoid().toUpperCase(),
                user_fullname: req.body.fullName,
                user_phone: req.body.phoneNumber,
                user_date_of_birth: req.body.dateOfBirth,
                user_password: bcrypt.hashSync(pass, 5),
                user_identity_card: req.body.identityCard,
                user_role_name: req.body.role_name,
                user_address: req.body.address,
                user_gender: req.body.gender,
                user_job: req.body.job,
                user_email: req.body.email,
                user_workplace: req.body.workPlace,
                user_is_actived: true,
                user_is_deleted: false,
                user_verified_email: false,
                user_verified_phone: false,
                docType: "User",
            };
            await registerUser(staff);
            const subject = "Health Record xác thực email";
            const htmlContent =
                "<p>Xin chào " +
                req.body.fullName +
                "</p>" +
                "<p>Địa chỉ email này đã được dùng để xác thực tài khoản Health Record của bạn.</p>" +
                "<p>Mật khẩu của bạn là: <b>" +
                pass +
                "</b></p>" +
                " <p>Vui lòng nhấp vào link sau để xác thực: <a href='" +
                DEFAULT_HOST +
                "/auth/verifyEmail/" +
                staff.user_id +
                "'>" +
                DEFAULT_HOST +
                "/auth/verifyEmail/" +
                staff.user_id +
                "</a></p>" +
                "<p>Lưu ý: </p>" +
                "<p> - Sau khi xác thực thành công, hãy thay đổi mật khẩu để đảm bảo bảo mật tài khoản. </p>" +
                "<p> - Liên hệ quầy lễ tân khi cần cập nhật thông tin cá nhân nếu bạn là bệnh nhân. </p>" +
                "<p> - Đây là email tự động của hệ thống Health Record. Vui lòng không trả lời email này.</p>" +
                "<p>Xin cảm ơn quý khách đã tin dùng hệ thống Health Record! </p>";

            await sendMail(staff.user_email, subject, htmlContent);
            return res.status(201).json({
                success: true,
                message: `Dang ky thanh cong ${req.body.fullName} . Da gui email xac thuc`,
            });
        } catch (error) {
            console.log(error);
            return res.status(400).send({
                success: false,
                message: error,
            });
        }
    }
);

router.post("/login-patient", async (req, res) => {
    try {
        const user = await getPatientByEmail(req.body.email);
        if (user === "undefined") {
            const rs = {
                success: false,
                data: { message: "Tài khoản không tồn tại" },
            };
            res.status(200).json(rs);
            return;
        }
        const isCorrectPassword = await bcrypt.compare(
            req.body.password,
            user.Record.user_password
        );
        console.log("Password: " + isCorrectPassword);
        if (!isCorrectPassword) {
            const rs = {
                success: false,
                data: { message: "Email hoặc mật khẩu không đúng" },
            };
            res.status(200).json(rs);
            return;
        }
        const isDeleted = user.Record.user_is_deleted;
        if (isDeleted) {
            const rs = {
                success: false,
                data: { message: "Tài khoản đã bị khóa!" },
            };
            res.status(200).json(rs);
            return;
        }
        const isVerifiedEmail = user.Record.user_verified_email;
        if (!isVerifiedEmail) {
            const rs = {
                success: false,
                data: { message: "Xác thực email và thử lại" },
            };
            res.status(200).json(rs);
            return;
        }
        delete user.Record.user_password;
        const token = jwt.sign(user.Record, "blockchain");
        const rs = {
            success: true,
            data: {
                user: user.Record,
                token: token,
            },
        };
        const login: Login = {
            login_id: "L" + nanoid().toUpperCase(),
            login_user_id: user.Record.user_id,
        };
        await createLogin(login);
        res.status(200).json(rs);
    } catch (error) {
        console.log(error);
        if (error === FABRIC_ERROR_CODE.IDENTITY_NOT_FOUND_IN_WALLET)
            return res.status(403).send({
                success: false,
                message: "Incorrect identity card or password",
            });
    }
});

router.post("/login-staff", async (req, res) => {
    try {
        const user = await getStaffByEmail(req.body.email);
        if (user === "undefined") {
            const rs = {
                success: false,
                data: { message: "Tài khoản không tồn tại" },
            };
            res.status(200).json(rs);
            return;
        }
        const isCorrectPassword = await bcrypt.compare(
            req.body.password,
            user.Record.user_password
        );
        console.log("Password: " + isCorrectPassword);
        if (!isCorrectPassword) {
            const rs = {
                success: false,
                data: { message: "Email hoặc mật khẩu không đúng" },
            };
            res.status(200).json(rs);
            return;
        }
        const isDeleted = user.Record.user_is_deleted;
        if (isDeleted) {
            const rs = {
                success: false,
                data: { message: "Tài khoản đã bị khóa!" },
            };
            res.status(200).json(rs);
            return;
        }
        const isVerifiedEmail = user.Record.user_verified_email;
        if (!isVerifiedEmail) {
            const rs = {
                success: false,
                data: { message: "Xác thực email và thử lại" },
            };
            res.status(200).json(rs);
            return;
        }
        delete user.Record.user_password;
        const token = jwt.sign(user.Record, "blockchain");
        const rs = {
            success: true,
            data: {
                user: user.Record,
                token: token,
            },
        };
        const login: Login = {
            login_id: "L" + nanoid().toUpperCase(),
            login_user_id: user.Record.user_id,
        };
        await createLogin(login);
        res.status(200).json(rs);
    } catch (error) {
        console.log(error);
        if (error === FABRIC_ERROR_CODE.IDENTITY_NOT_FOUND_IN_WALLET)
            return res.status(403).send({
                success: false,
                message: "Incorrect identity card or password",
            });
    }
});

router.post("/login-admin", async (req, res) => {
    try {
        const user = await getAdminByEmail(req.body.email);
        const isCorrectPassword = await bcrypt.compare(
            req.body.password,
            user.Record.user_password
        );
        const isVerifiedEmail = user.Record.user_verified_email;
        if (user === "undefined") {
            const rs = {
                success: false,
                data: { message: "Tài khoản không tồn tại" },
            };
            res.status(200).json(rs);
            return;
        }
        if (!isCorrectPassword) {
            const rs = {
                success: false,
                data: { message: "Email hoặc mật khẩu không đúng" },
            };
            res.status(200).json(rs);
            return;
        }
        const isDeleted = user.Record.user_is_deleted;
        if (isDeleted) {
            const rs = {
                success: false,
                data: { message: "Tài khoản đã bị khóa!" },
            };
            res.status(200).json(rs);
            return;
        }
        if (!isVerifiedEmail) {
            const rs = {
                success: false,
                data: { message: "Xác thực email và thử lại" },
            };
            res.status(200).json(rs);
            return;
        }
        delete user.Record.user_password;
        const token = jwt.sign(user.Record, "blockchain");
        const rs = {
            success: true,
            data: {
                user: user.Record,
                token: token,
            },
        };
        const login: Login = {
            login_id: "L" + nanoid().toUpperCase(),
            login_user_id: user.Record.user_id,
        };
        await createLogin(login);
        res.status(200).json(rs);
    } catch (error) {
        console.log(error);
        if (error === FABRIC_ERROR_CODE.IDENTITY_NOT_FOUND_IN_WALLET)
            return res.send({
                success: false,
                message: "Incorrect identity card or password",
            });
    }
});

export default router;
