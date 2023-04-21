import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Select, Button, Result, Space, Card, Tag } from 'antd';
import { RetweetOutlined } from '@ant-design/icons';
import 'moment/locale/en-au';
import locale from 'antd/es/date-picker/locale/vi_VN';
import axios from 'axios';
import { DEFAULT_HOST } from '@/host';
import Modal from 'antd/lib/modal/Modal';

import { fetchCurrentUser } from '@/helpers/Auth';

const { Option } = Select;
const layout = {
    wrapperCol: {
        span: 16,
    },
    labelCol: {
        span: 8,
    },
};

const buttonCol = {
    wrapperCol: {
        span: 16,
        offset: 8,
    },
};

export default () => {
    // const [password, setPassword] = useState('');
    const [success, setSuccess] = useState(false);
    const [posting, setPosting] = useState(false);
    const [form] = Form.useForm();
    const [regrole, setRegrole] = useState('');
    // const [vali, setVali] = useState(false);

    const validate = async (field, value) => {
        const url = `${DEFAULT_HOST}/users/validate?field=${field}&value=${value}`;
        try {
            const result = await axios.get(url);
            // alert(result.data.valid);
            // setVali(result.data.valid);
            return result.data.valid;
        } catch (error) {
            return false;
        }
    };
    const handleFormFinish = async (value) => {
        setPosting(true);
        // let suffix;
        const config = {};
        const va = value;
        va.role_name = regrole;
        // if ((va.role_name === 'Quản trị viên') || (typeof va.role_name === 'undefined')) suffix = 'admin';
        // else {
        // suffix = 'staff';
        const user = fetchCurrentUser();
        config.headers = {
            Authorization: `Bearer ${user.token}`,
        };
        // }
        // console.log(config);
        const url = `${DEFAULT_HOST}/auth/registry/patient`;
        va.dateOfBirth = va.dateOfBirth.format('DD-MM-YYYY');
        try {
            const result = await axios.post(url, va, config);
            if (result.data.success) {
                setPosting(false);
                setSuccess(true);
                form.setFieldsValue([]);
            }
        } catch (error) {
            setPosting(false);
            // console.log(error);
        }
    };
    useEffect(() => {
        const f = async () => {
            form.setFieldsValue([]);
        };
        f();
    }, [posting, success]);
    return (
        <Card>
            <Tag color="processing" style={{ fontSize: 14 }}>
                Điền thông tin bên dưới để đăng ký mới
            </Tag>
            <Form
                autoComplete="off"
                labelAlign="left"
                {...layout}
                onFinish={handleFormFinish}
                form={form}
                style={{ margin: 20 }}
                title="Tạo tài khoản bệnh nhân"
            >
                <Form.Item name="role_name" label="Tài khoản dành cho:">
                    <Select
                        placeholder="Bệnh nhân"
                        value="Bệnh nhân"
                        onSelect={(value) => setRegrole(value)}
                        disabled={posting}
                    >
                        <Option
                            value="Bệnh nhân"
                            onSelect={(value) => setRegrole(value)}
                            disabled={posting}
                        >
                            Bệnh nhân
                        </Option>
                    </Select>
                </Form.Item>
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
                        { required: true, message: 'Vui lòng nhập số điện thoại' },
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
                                if (!(await validate('user_email', value)))
                                    throw new Error('Email đã được đăng ký');
                            },
                        },
                    ]}
                >
                    <Input placeholder="abcxyz@gmail.com......" disabled={posting}></Input>
                </Form.Item>
                <Form.Item
                    name="gender"
                    label="Giới tính:"
                    rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
                >
                    <Select placeholder="Nam" disabled={posting}>
                        <Option value="Nam" disabled={posting}>
                            Nam
                        </Option>
                        <Option value="Nữ" disabled={posting}>
                            Nữ
                        </Option>
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
                    name="identityCard"
                    label="Số CMND/CCCD"
                    hasFeedback
                    rules={[
                        { pattern: /\d{9}\b/, message: 'Số CMND/CCCD không đúng' },
                        { required: true, message: 'Vui lòng nhập số CMND/CCCD' },
                        {
                            validator: async (rule, value) => {
                                if (!(await validate('user_identity_card', value)))
                                    throw new Error('Số CMND/CCCD này đã được đăng ký');
                            },
                        },
                    ]}
                >
                    <Input placeholder="123456789" disabled={posting}></Input>
                </Form.Item>
                <Form.Item
                    name="bhyt"
                    label="Số BHYT"
                    hasFeedback
                    rules={[
                        { required: true, message: 'Vui lòng nhập số BHYT' },
                        {
                            validator: async (rule, value) => {
                                if (!(await validate('user_health_insurance', value)))
                                    throw new Error('Số BHYT này đã được đăng ký');
                            },
                        },
                    ]}
                >
                    <Input placeholder="SV 123456789 ...." disabled={posting}></Input>
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
                <Form.Item
                    name="familyName"
                    label="Tên người thân/giám hộ"
                    hasFeedback
                    rules={[{ required: true, message: 'Vui lòng nhập tên người thân' }]}
                >
                    <Input placeholder="..." disabled={posting}></Input>
                </Form.Item>
                <Form.Item
                    name="familyPhone"
                    label="Số điện thoại người thân/giám hộ"
                    hasFeedback
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                >
                    <Input placeholder="..." disabled={posting}></Input>
                </Form.Item>
                <Form.Item {...buttonCol}>
                    <Space>
                        <Button type="primary" htmlType="submit" loading={posting}>
                            Đăng ký
                        </Button>
                        <Button
                            type="default"
                            htmlType="button"
                            disabled={posting}
                            onClick={() => form.setFieldsValue([{}])}
                        >
                            <RetweetOutlined />
                            Làm lại
                        </Button>
                    </Space>
                </Form.Item>
                <Modal visible={success} footer={null} onCancel={() => setSuccess(false)}>
                    <Result status="success" title={'Thêm thành công'} />
                </Modal>
            </Form>
        </Card>
    );
};
