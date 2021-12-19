import  { registerUser } from './RegisterUser';
import { User } from './UserInterface'

const client: User = {
    user_id: 'client',
    user_fullname: 'client',
    user_role_name: 'Client',
    user_email: 'client',
    user_phone: 'client',
    user_password: 'client',
    user_address: 'Cà Mau',
    user_verified_email: true,
    user_verified_phone: true,
    user_date_of_birth: new Date('09/11/1999').toString(),
    user_created_at:new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh', hour12:false }),
    user_created_by: 'admin',
    user_identity_card: '381943168',
    user_job: 'client',
    user_workplace: 'client',
    user_gender: 'nam',
    user_is_actived: true,
    user_is_deleted: false,
    docType: 'User',
} 

try {
    registerUser(client);
} catch (error) {
    
}