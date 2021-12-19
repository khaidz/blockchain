import React, {useState} from 'react';
import {Form, Input, DatePicker, Select, Button, Result, Space} from 'antd';
import {RetweetOutlined} from '@ant-design/icons'
import 'moment/locale/en-au';
import locale from 'antd/es/date-picker/locale/vi_VN';
import axios from 'axios';
import { DEFAULT_HOST } from '@/host';
import Modal from 'antd/lib/modal/Modal';

import {fetchCurrentUser} from '@/helpers/Auth';

const { Option } = Select;
const layout = {
    wrapperCol: {
        span: 16
    },
    labelCol: {
        span: 8
    }
}

const buttonCol = {
    wrapperCol: {
        span: 16,
        offset: 8
    }
}

export default ({admin}) => {
    // const [password, setPassword] = useState('');
    const [success, setSuccess] = useState(false);
    const [posting, setPosting] = useState(false);
    const [form] = Form.useForm();
    const [regrole, setRegrole] = useState('');

    const validate = async (field, value) => {
        const url = `${DEFAULT_HOST}/users/validate?field=${field}&value=${value}`;
        try {
            const result = await axios.get(url);
            return result.data.valid;
        } catch (error) {
            return false;
        }
    }; 
    const handleFormFinish = async (value) => {
        setPosting(true);
        let suffix;
        const config = {};
        const va = value;
        va.role_name = regrole;
        if ((va.role_name === 'Quản trị viên') || (typeof va.role_name === 'undefined')) suffix = 'admin';
        else {
            suffix = 'staff';
            const user = fetchCurrentUser();
            config.headers = {
                    Authorization: `Bearer ${user.token}`
                };
        }
        // console.log(config);
        const url = `${DEFAULT_HOST}/auth/registry/${suffix}`;
        va.dateOfBirth = va.dateOfBirth.format('DD-MM-YYYY');
        try {
            const result = await axios.post(url, va, config);
            if (result.data.success) { setPosting(false); setSuccess(true)};
        } catch (error) {
            setPosting(false);
            // console.log(error);
        }
    };;

    return (
        <Form
            autoComplete="off"
            labelAlign="left"
            {...layout}
            onFinish={handleFormFinish}
            form={form}
        >
            {admin ? (
                <Form.Item name="role_name" label="Tài khản dành cho:">
                    <Select placeholder="Lựa chọn" value='undefined' onSelect={(value) => setRegrole(value)}>
                        <Option value="Quản trị viên" onSelect={(value) => setRegrole(value)}>Quản trị viên</Option>
                        <Option value="Bác sĩ" onSelect={(value) => setRegrole(value)}>Bác sĩ</Option>
                        <Option value="Lễ tân" onSelect={(value) => setRegrole(value)}>Lễ tân</Option>
                        {/* <Option value="Điều dưỡng" onSelect={(value) => setRegrole(value)}>Điều dưỡng</Option>
                        <Option value="Kế toán cận lâm sàng" onSelect={(value) => setRegrole(value)}>Kế toán cận lâm sàng</Option>
                        <Option value="Nhân viên cận lâm sàng" onSelect={(value) => setRegrole(value)}>Nhân viên cận lâm sàng</Option>
                        <Option value="Dược sĩ" onSelect={(value) => setRegrole(value)}>Dược sĩ</Option> */}
                    </Select>
                </Form.Item>
            ) : null}
            <Form.Item
                hasFeedback
                name="fullName"
                label="Họ và tên"
                rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
            >
                <Input placeholder="Nguyễn Văn A ..." disabled={posting}></Input>
            </Form.Item>
            <Form.Item
                hasFeedback
                name="phoneNumber"
                label="Số điện thoại"
                rules={[
                    { required: true, message: 'Vui lòng nhập địa số điện thoại' },
                    {
                        validator: async (rule, value) => {
                            if (!(await validate('user_phone', value)))
                                throw new Error('Số điện thoại đã được đăng ký');
                        },
                    },
                    {
                        pattern: /(03|07|08|09|01[2|6|8|9])+([0-9]{8})\b/,
                        message: 'SĐT không đúng định dạng',
                    },
                ]}
            >
                <Input placeholder="0942...." disabled={posting}></Input>
            </Form.Item>
            <Form.Item
                name="email"
                label="Email"
                hasFeedback
                rules={[
                    { type: 'email', message: 'Địa chỉ email không hợp lệ' },
                    { required: true, message: 'Vui lòng nhập địa chỉ email' },
                    {
                        validator: async (rule, value) => {
                            if (!(await validate('user_email', value))) throw  new Error('Email đã được đăng ký');
                        },
                    },
                ]}
            >
                <Input placeholder="abcxyz@gmail.com......" disabled={posting}></Input>
            </Form.Item>
            <Form.Item 
                name="gender" 
                label="Giới tính:"
                rules={[
                    { required: true, message: 'Vui lòng chọn giới tính' },
                    
                ]}>
                <Select placeholder="Nam" >
                    <Option value="Nam">Nam</Option>
                    <Option value="Nữ">Nữ</Option>
                </Select>
            </Form.Item>
            <Form.Item
                name="dateOfBirth"
                label="Ngày sinh"
                hasFeedback
                rules={[{ required: true, message: 'Vui lòng nhập ngày' }]}
            >
                <DatePicker disabled={posting} locale={locale}></DatePicker>
            </Form.Item>
            <Form.Item
                name="identityCardNumber"
                label="Số CMND"
                hasFeedback
                rules={[
                    { pattern: /\d{9}\b/, message: 'Số cmnd không đúng' },
                    { required: true, message: 'Vui lòng nhập số cmnd' },
                    {
                        validator: async (rule, value) => {
                            if (!(await validate('user_identity_card', value)))
                                throw new Error('Số cmnd này đã được đăng ký');
                        },
                    },
                ]}
            >
                <Input placeholder="123456789" disabled={posting}></Input>
            </Form.Item>
            <Form.Item
                name="address"
                label="Địa chỉ"
                hasFeedback
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
            >
                <Input placeholder="Quận/Huyện, Tỉnh/Thành Phố" disabled={posting}></Input>
            </Form.Item>
            <Form.Item
                name="job"
                label="Nghề nghiệp"
                hasFeedback
                rules={[{ required: true, message: 'Vui lòng nhập nghề nghiệp' }]}
            >
                <Input placeholder="Sinh viên" disabled={posting}></Input>
            </Form.Item>
            <Form.Item
                name="workPlace"
                label="Nơi làm việc"
                hasFeedback
                rules={[{ required: true, message: 'Vui lòng nhập nơi làm việc' }]}
            >
                <Input placeholder="Quận/Huyện, Tỉnh/Thành Phố" disabled={posting}></Input>
            </Form.Item>
            {/* <Form.Item
                name="password"
                label="Mật khẩu"
                hasFeedback
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
            >
                <Input.Password
                    disabled={posting}
                    onChange={(e) => setPassword(e.target.value)}
                ></Input.Password>
            </Form.Item>
            <Form.Item
                label="Nhập lại mật khẩu"
                name="repassword"
                hasFeedback
                rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu' },
                    {
                        validator: async (rule, value) => {
                            if (value !== password) throw new Error('Mật khẩu không khớp');
                        },
                    },
                ]}
            >
                <Input.Password disabled={posting}></Input.Password>
            </Form.Item> */}
            <Form.Item {...buttonCol}>
                <Space>
                    <Button type="primary" htmlType="submit" loading={posting}>
                        Đăng ký
                    </Button>
                    <Button type="default" htmlType="button" disabled={posting}>
                        <RetweetOutlined />
                        Làm lại
                    </Button>
                </Space>
            </Form.Item>
            <Modal visible={success} footer={null} onCancel={() => setSuccess(false)}>
                <Result
                    status="success"
                    title={'Thêm thành công'}
                />
            </Modal>
        </Form>
    );
}

