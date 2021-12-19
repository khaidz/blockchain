import express, { Application, Request, Response, NextFunction } from "express";
import * as bodyParser from "body-parser";
import userRouter from './api/user.api';
import authRouter from './api/auth.api';
import adminRouter from './api/admin.api';
import patientRouter from './api/patient.api';
import receptionistRouter from './api/receptionist.api';
import physicianRouter from './api/physician.api';
import * as dotenv from 'dotenv';
import cors from 'cors';
// import {authentication} from './middleware/auth.middleware';
import multer from "multer";
import path from "path";
// Khởi tạo biến cấu hình cho việc lưu trữ file upload

let diskStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    // Định nghĩa nơi file upload sẽ được lưu lại
    callback(null, "uploads");
  },
  filename: (req, file, callback) => {
    // ở đây các bạn có thể làm bất kỳ điều gì với cái file nhé.
    // Mình ví dụ chỉ cho phép tải lên các loại ảnh png & jpg
    let math = ["image/png", "image/jpeg"];
    if (math.indexOf(file.mimetype) === -1) {
      const errorMess = `The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpeg or png.`;
      return callback(null, errorMess);
    }
    // Tên của file thì mình nối thêm một cái nhãn thời gian để đảm bảo không bị trùng.
    let filename = `${file.originalname}`;
    callback(null, filename);
  }
});
// Khởi tạo middleware uploadFile với cấu hình như ở trên,
// Bên trong hàm .single() truyền vào name của thẻ input, ở đây là "file"
let uploadFile = multer({storage: diskStorage}).single("file");

declare global {
    namespace Express {
      interface Request {
        user?: any
      }
    }
}


const app: Application = express();

dotenv.config();
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
// app.use(express.json());
// app.use(express.urlencoded({extended: true}));
app.use(cors());



app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/patient', patientRouter);
app.use('/receptionist', receptionistRouter);
app.use('/physician', physicianRouter);
// app.use(authentication);
app.get("/test", (req: Request, res: Response) => {
    res.status(200).send("Hello World!");
});

app.post("/upload", (req, res) => {
  // Thực hiện upload file, truyền vào 2 biến req và res
  uploadFile(req, res, (error) => {
    // Nếu có lỗi thì trả về lỗi cho client.
    // Ví dụ như upload một file không phải file ảnh theo như cấu hình của mình bên trên
    if (error) {
      return res.send(`Error when trying to upload: ${error}`);
    }
    // Không có lỗi thì lại render cái file ảnh về cho client.
    // Đồng thời file đã được lưu vào thư mục uploads
    res.sendFile(path.join(`${__dirname}/../uploads/${req.file?.filename}`));
    // res.status(200).send(`${req.file?.filename}`);
    // console.log(path.join(`${__dirname}/../uploads/${req.file?.filename}`));
  });
});

app.get("/upload/:name", (req, res) => {
    // res.sendFile(path.join(`${__dirname}/../uploads/${req.file?.filename}`));
    const fileName = req.params.name;
    res.sendFile(path.join(`${__dirname}/../uploads/${fileName}`));
  
});

app.listen(3000, () =>{
    console.log("Started Health Record server")
});