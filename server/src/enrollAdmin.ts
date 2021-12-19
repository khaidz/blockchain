import * as FabricCAServices from 'fabric-ca-client';
import { Wallets, X509Identity } from 'fabric-network';
import * as fs from 'fs';
import * as path from 'path';
import { registerUser, createUser, initLedger } from './fabric/user/RegisterUser';
import * as bcrypt from 'bcrypt';
import {nanoid} from 'nanoid';

async function main() {
    const id = "U" + nanoid();
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname,'..','..','test-network','organizations','peerOrganizations','org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new CA client for interacting with the CA.
        const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices.default(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        // console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the admin user.
        const identity = await wallet.get('admin');
        if (identity) {
            // console.log('An identity for the admin user "admin" already exists in the wallet');
            throw new Error('An identity for the admin user "admin" already exists in the wallet')
        }

        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });

        const x509Identity: X509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509'
        };

        await wallet.put('admin', x509Identity);

        console.log('Successfully enrolled admin user "admin" and imported it into the wallet');
 
        const admin = {
            user_id: 'admin',
            user_fullname: 'Root',
            user_role_name: 'Quản trị viên',
            user_email: 'admin@gmail.com',
            user_phone: '0947492415',
            user_password: bcrypt.hashSync("root", 5),
            user_address: 'Cà Mau',
            user_verified_email: true,
            user_verified_phone: true,
            user_date_of_birth: '09-11-1999',
            user_created_at:new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh', hour12:false }),
            user_created_by: 'root',
            user_identity_card: '381943168',
            user_job: 'admin',
            user_workplace: 'admin',
            user_gender: 'Nam',
            user_is_actived: true,
            user_is_deleted: false,
            docType: 'User',
        };
        const physician1 = {
            user_id: 'physician_01',
            user_fullname: 'Bác sĩ 01',
            user_role_name: 'Bác sĩ',
            user_email: 'physician01@gmail.com',
            user_phone: '0947492415',
            user_password: bcrypt.hashSync("physician", 5),
            user_address: 'Cà Mau',
            user_verified_email: true,
            user_verified_phone: true,
            user_date_of_birth: '09-11-1999',
            user_created_at:new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh', hour12:false }),
            user_created_by: 'root',
            user_identity_card: '381943168',
            user_job: 'Bác sĩ',
            user_workplace: 'Bệnh viện',
            user_gender: 'Nam',
            user_is_actived: true,
            user_is_deleted: false,
            docType: 'User',
        };
        const physician2 = {
            user_id: 'physician_02',
            user_fullname: 'Bác sĩ 02',
            user_role_name: 'Bác sĩ',
            user_email: 'physician02@gmail.com',
            user_phone: '0947492415',
            user_password: bcrypt.hashSync("physician", 5),
            user_address: 'Cà Mau',
            user_verified_email: true,
            user_verified_phone: true,
            user_date_of_birth: '09-11-1999',
            user_created_at:new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh', hour12:false }),
            user_created_by: 'root',
            user_identity_card: '381943168',
            user_job: 'Bác sĩ',
            user_workplace: 'Bệnh viện',
            user_gender: 'Nam',
            user_is_actived: true,
            user_is_deleted: false,
            docType: 'User',
        };
        const physician3 = {
            user_id: 'physician_03',
            user_fullname: 'Bác sĩ 03',
            user_role_name: 'Bác sĩ',
            user_email: 'physician03@gmail.com',
            user_phone: '0947492415',
            user_password: bcrypt.hashSync("physician", 5),
            user_address: 'Cà Mau',
            user_verified_email: true,
            user_verified_phone: true,
            user_date_of_birth: '09-11-1999',
            user_created_at:new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh', hour12:false }),
            user_created_by: 'root',
            user_identity_card: '381943168',
            user_job: 'Bác sĩ',
            user_workplace: 'Bệnh viện',
            user_gender: 'Nam',
            user_is_actived: true,
            user_is_deleted: false,
            docType: 'User',
        };
        const receptionist1 = {
            user_id: 'receptionist_01',
            user_fullname: 'Lễ tân 01',
            user_role_name: 'Lễ tân',
            user_email: 'receptionist01@gmail.com',
            user_phone: '0947492415',
            user_password: bcrypt.hashSync("receptionist", 5),
            user_address: 'Cà Mau',
            user_verified_email: true,
            user_verified_phone: true,
            user_date_of_birth: '09-11-1999',
            user_created_at:new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh', hour12:false }),
            user_created_by: 'root',
            user_identity_card: '381943168',
            user_job: 'Lễ tân',
            user_workplace: 'Bệnh viện',
            user_gender: 'Nữ',
            user_is_actived: true,
            user_is_deleted: false,
            docType: 'User',
        };
        const receptionist2 = {
            user_id: 'receptionist_02',
            user_fullname: 'Lễ tân 02',
            user_role_name: 'Lễ tân',
            user_email: 'receptionist02@gmail.com',
            user_phone: '0947492415',
            user_password: bcrypt.hashSync("receptionist", 5),
            user_address: 'Cà Mau',
            user_verified_email: true,
            user_verified_phone: true,
            user_date_of_birth: '09-11-1999',
            user_created_at:new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh', hour12:false }),
            user_created_by: 'root',
            user_identity_card: '381943168',
            user_job: 'Lễ tân',
            user_workplace: 'Bệnh viện',
            user_gender: 'Nữ',
            user_is_actived: true,
            user_is_deleted: false,
            docType: 'User',
        };
        const patient1 = {
            user_id: 'patient_01',
            user_fullname: 'Nguyễn Hoàng Duy 01',
            user_role_name: 'Bệnh nhân',
            user_email: 'patient01@gmail.com',
            user_phone: 'test',
            user_password: bcrypt.hashSync("patient", 5),
            user_address: 'Cà Mau',
            user_verified_email: true,
            user_verified_phone: true,
            user_date_of_birth: '09-11-1999',
            user_created_at:new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh', hour12:false }),
            user_created_by: '111111111',
            user_identity_card: 'test',
            user_job: 'Sinh viên',
            user_workplace: 'Đại học Cần Thơ',
            user_gender: 'Nam',
            user_health_insurance: 'SV 4 92 962 157 0499', 
            user_family_name: 'Không có',
            user_family_phone: 'Không có',
            user_is_actived: true,
            user_is_deleted: false,
            docType: 'User',
        };
        const patient2 = {
            user_id: 'patient_02',
            user_fullname: 'Nguyễn Hoàng Duy 02',
            user_role_name: 'Bệnh nhân',
            user_email: 'patient02@gmail.com',
            user_phone: 'test',
            user_password: bcrypt.hashSync("patient", 5),
            user_address: 'Cà Mau',
            user_verified_email: true,
            user_verified_phone: true,
            user_date_of_birth: '09-11-1999',
            user_created_at:new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh', hour12:false }),
            user_created_by: 'root',
            user_identity_card: '222222222',
            user_job: 'Sinh viên',
            user_workplace: 'Đại học Cần Thơ',
            user_gender: 'Nam',
            user_health_insurance: 'SV 4 92 962 157 0500', 
            user_family_name: 'Không có',
            user_family_phone: 'Không có',
            user_is_actived: true,
            user_is_deleted: false,
            docType: 'User',
        };
        const patient3 = {
            user_id: 'patient_03',
            user_fullname: 'Nguyễn Hoàng Duy 03',
            user_role_name: 'Bệnh nhân',
            user_email: 'patient03@gmail.com',
            user_phone: 'test',
            user_password: bcrypt.hashSync("patient", 5),
            user_address: 'Cà Mau',
            user_verified_email: true,
            user_verified_phone: true,
            user_date_of_birth: '09-11-1999',
            user_created_at:new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh', hour12:false }),
            user_created_by: 'root',
            user_identity_card: '333333333',
            user_job: 'Sinh viên',
            user_workplace: 'Đại học Cần Thơ',
            user_gender: 'Nam',
            user_health_insurance: 'SV 4 92 962 157 0500', 
            user_family_name: 'Không có',
            user_family_phone: 'Không có',
            user_is_actived: true,
            user_is_deleted: false,
            docType: 'User',
        };
        await createUser(admin, wallet, ccp);
        await registerUser(physician1);
        await registerUser(physician2);
        await registerUser(physician3);
        await registerUser(receptionist1);
        await registerUser(receptionist2);
        await registerUser(patient1);
        await registerUser(patient2);
        await registerUser(patient3);
        await initLedger(admin,wallet, ccp);
    } catch (error) {
        // console.error(`Failed to enroll admin user "admin": ${error}`);
        process.exit(1);
    }
}

main();
