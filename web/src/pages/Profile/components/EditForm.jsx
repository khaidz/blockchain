import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Button, Result, Space } from 'antd';
import { RetweetOutlined, EditOutlined } from '@ant-design/icons';
import 'moment/locale/en-au';
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/vi_VN';
import axios from 'axios';
import { DEFAULT_HOST } from '@/host';
import Modal from 'antd/lib/modal/Modal';
import { fetchCurrentUser, login } from '@/helpers/Auth';

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
        span: 24,
    },
};

const isModified = (currentValue, newValue) => {
    let isModify = false;

    Object.keys(newValue).forEach((attr) => {
        if (['user_date_of_birth'].includes(attr)) {
            if (moment(currentValue[attr]).format('DD-MM-YYYY') !== newValue[attr]) {
                isModify = true;
            }
        }
        if (['user_is_deleted'].includes(attr)) {
            if (currentValue[attr] !== newValue[attr]) {
                isModify = true;
            }
        }
        if (currentValue[attr] !== newValue[attr]) {
            isModify = true;
        }
    });
    return isModify;
};

export default () => {
    const [current, setCurrent] = useState([]);
    const [edit, setEdit] = useState({
        value: {},
        isEditing: false,
    });
    const [success, setSuccess] = useState(false);
    const [posting, setPosting] = useState(false);
    const [form] = Form.useForm();

    // const [deleted, setDeleted] = useState(defaultValue.user_is_deleted);
    const config = {
        headers: {
            Authorization: `Bearer ${fetchCurrentUser().token}`,
        },
    };
    useEffect(() => {
        const f = async () => {
            const urlU = `${DEFAULT_HOST}/users/profile`;
            const resultU = await axios.get(urlU, config);
            const defaultValue = resultU.data.data.user;
            setCurrent({
                ...defaultValue,
                user_date_of_birth: moment(defaultValue.user_date_of_birth, 'DD-MM-YYYY'),
                isConverted: true,
            });
        };
        f();
    }, [posting]);

    useEffect(() => {
        if (current.isConverted) form.setFieldsValue(current);
    }, [current, form]);

    const handleFormFinish = async (value) => {
        setPosting(true);
        const va = value;
        const url = `${DEFAULT_HOST}/users/${current.user_id}`;
        const urlU = `${DEFAULT_HOST}/users/profile`;

        va.user_date_of_birth = value.user_date_of_birth.format('DD-MM-YYYY');
        if (!isModified(current, va)) return setTimeout(() => setSuccess(true), 1500);
        try {
            const result = await axios.post(url, va, config);
            if (result.data.success) {
                const resultU = await axios.get(urlU, config);
                login(resultU.data.data.token, resultU.data.data.user);
                setCurrent(fetchCurrentUser());
                setPosting(false);
                setSuccess(true);
                setEdit({ ...edit, isEditing: false });
                return '';
            }

            setPosting(false);
            setSuccess(false);
            setEdit({ ...edit, isEditing: false });
            return '';
        } catch (error) {
            setPosting(false);
            setEdit({ ...edit, isEditing: false });
            return '';
        }
    };

    // const verifyUser = async (userId) => {
    //     const url = DEFAULT_HOST + '/users/' + userId+ '/verify';
    //     try {
    //         const result = await axios.put(url, {}, config);
    //         if (result.data.success) return true;
    //         return false
    //     } catch (error) {
    //        return false;
    //     }
    // }

    return (
        <Form
            autoComplete="off"
            labelAlign="left"
            {...layout}
            onFinish={handleFormFinish}
            form={form}
        >
            <Form.Item name="user_id" label="ID">
                <Input readOnly></Input>
            </Form.Item>
            <Form.Item name="user_role_name" label="Vai trò">
                <Input readOnly></Input>
            </Form.Item>
            <Form.Item
                name="user_fullname"
                label="Họ và tên"
                rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
            >
                <Input placeholder="Nguyễn Văn A ..." disabled={posting || !edit.isEditing}></Input>
            </Form.Item>
            <Form.Item
                name="user_phone"
                label="Số điện thoại"
                rules={[
                    { required: true, message: 'Vui lòng nhập địa số điện thoại' },
                    // {
                    //     validator: async (rule, value) => {
                    //         if (value === current.phoneNumber) return;
                    //         if (!(await validate('phoneNumber', value)))
                    //             throw 'Số điện thoại đã được đăng ký';
                    //     },
                    // },
                    {
                        pattern: /(03|07|08|09|01[2|6|8|9])+([0-9]{8})\b/,
                        message: 'SĐT không đúng định dạng',
                    },
                ]}
            >
                <Input placeholder="0942...." disabled={posting || !edit.isEditing}></Input>
            </Form.Item>
            <Form.Item
                name="user_email"
                label="Email"
                rules={[
                    { type: 'email', message: 'Địa chỉ email không hợp lệ' },
                    { required: true, message: 'Vui lòng nhập địa chỉ email' },
                    // {
                    //     validator: async (rule, value) => {
                    //         if (value === current.email) return;
                    //         if (!(await validate('email', value))) throw 'Email đã được đăng ký';
                    //     },
                    // },
                ]}
            >
                <Input
                    placeholder="abcxyz@gmail.com......"
                    disabled={posting || !edit.isEditing}
                ></Input>
            </Form.Item>
            <Form.Item
                name="user_date_of_birth"
                label="Ngày sinh"
                rules={[{ required: true, message: 'Vui lòng nhập ngày' }]}
            >
                <DatePicker disabled={posting || !edit.isEditing} locale={locale}></DatePicker>
            </Form.Item>
            <Form.Item
                name="user_identity_card"
                label="Số CMND"
                rules={[
                    { pattern: /\d{9}\b/, message: 'Số cmnd không đúng' },
                    { required: true, message: 'Vui lòng nhập số cmnd' },
                    // {
                    //     validator: async (rule, value) => {
                    //         if (value === current.identityCardNumber) return;
                    //         if (!(await validate('identityCardNumber', value)))
                    //             throw 'Số cmnd này đã được đăng ký';
                    //     },
                    // },
                ]}
            >
                <Input placeholder="123456789" disabled={posting || !edit.isEditing}></Input>
            </Form.Item>
            <Form.Item
                name="user_job"
                label="Nghề nghiệp"
                rules={[{ required: true, message: 'Vui lòng nhập nghề nghiệp' }]}
            >
                <Input placeholder="Bác sĩ" disabled={posting || !edit.isEditing}></Input>
            </Form.Item>
            <Form.Item
                name="user_workplace"
                label="Nơi làm việc"
                rules={[{ required: true, message: 'Vui lòng nhập nơi làm việc' }]}
            >
                <Input disabled={posting || !edit.isEditing}></Input>
            </Form.Item>
            <Form.Item
                name="user_address"
                label="Địa chỉ"
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
            >
                <Input
                    placeholder="Ninh Kiều, Cần Thơ"
                    disabled={posting || !edit.isEditing}
                ></Input>
            </Form.Item>
            {/* <Form.Item name="user_is_deleted" label="Trạng thái tài khoản:" readOnly>
                {deleted ? 
                <Button disabled={posting || !edit.isEditing} onClick={() => setDeleted(false)} readOnly>Đang khóa</Button>:
                <Button disabled={posting || !edit.isEditing} onClick={() => setDeleted(true)} readOnly>Đã kích hoạt</Button>}
            </Form.Item> */}
            <Form.Item {...buttonCol}>
                <Button
                    style={{ float: 'left' }}
                    type="default"
                    htmlType="button"
                    disabled={!edit.isEditing || posting}
                    onClick={() => form.setFieldsValue(current)}
                >
                    <RetweetOutlined />
                    Khôi phục
                </Button>
                <Space style={{ float: 'right' }}>
                    <Button
                        style={{ float: 'right' }}
                        type="default"
                        htmlType="button"
                        disabled={edit.isEditing}
                        onClick={() => setEdit({ ...edit, isEditing: true })}
                    >
                        <EditOutlined />
                        Chỉnh sửa
                    </Button>
                    <Button
                        style={{ float: 'right' }}
                        type="primary"
                        htmlType="submit"
                        loading={posting}
                        disabled={!edit.isEditing}
                    >
                        Xác nhận
                    </Button>
                </Space>
            </Form.Item>
            <Modal
                visible={success}
                footer={null}
                onCancel={() => {
                    setSuccess(false);
                    // setEdit({ ...edit, isEditing: false })
                }}
            >
                <Result status="success" title="Chỉnh sửa thông tin thành công" />
            </Modal>
        </Form>
    );
};
