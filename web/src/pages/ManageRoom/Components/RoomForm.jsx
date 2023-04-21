import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Select } from 'antd';
import axios from 'axios';
import { DEFAULT_HOST } from '@/host';
import { fetchCurrentUser } from '@/helpers/Auth';

const { useForm } = Form;
const Option = Select;

export default ({ edit }) => {
    const [departmentData, setDepartmentData] = useState([]);
    // const [formValue, setValue] = useState([]);
    // const [rowValue, setRow] = useState('');disable
    const [loading, setLoading] = useState(false);
    const user = fetchCurrentUser();
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
    };
    const [form] = useForm();
    const validate = async (field, value) => {
        const url = `${DEFAULT_HOST}/admin/validate-room?field=${field}&value=${value}`;
        try {
            const result = await axios.get(url);
            return result.data.valid;
        } catch (error1) {
            return false;
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchDepartment = async () => {
        try {
            const url = `${DEFAULT_HOST}/admin/department`;
            const result = await axios.get(url, config);
            return result.data;
        } catch (error) {
            // console.log(error);
        }
        return '';
    };
    useEffect(() => {
        const f = async () => {
            const department = await fetchDepartment();
            setDepartmentData(department);
        };
        f();
    }, [loading, form]);
    const formFinish = async (data) => {
        setLoading(true);
        const url = `${DEFAULT_HOST}/admin/room`;
        let mess;
        try {
            const result = await axios.post(url, data, config);
            if (result.status) {
                mess = `Đăng ký thành công ${data.name}`;
                setLoading(false);
                message.success(mess);
            } else {
                mess = 'Thất bại';
                setLoading(false);
                message.error(mess);
            }
        } catch (error2) {
            mess = 'Thất bại';
            setLoading(false);
            message.error(mess);
        }
        // disable();
        return '';
    };
    return (
        <Form
            labelCol={{ span: 8 }}
            labelAlign="left"
            name="room"
            onFinish={formFinish}
            form={form}
        >
            <Form.Item
                name="name"
                label="Tên phòng"
                hasFeedback
                rules={[
                    { required: true, message: 'Vui lòng nhập tên phòng' },
                    {
                        validator: async (rule, value) => {
                            if (!(await validate('room_name', value)))
                                throw new Error('Tên phòng đã tồn tại');
                        },
                    },
                ]}
            >
                <Input disabled={loading} placeholder="Phòng ..."></Input>
            </Form.Item>
            <Form.Item
                name="number"
                label="Số phòng"
                hasFeedback
                rules={[
                    { pattern: /([1-9])\b/, message: 'Vui lòng nhập số' },
                    { required: true, message: 'Vui lòng nhập số phòng' },
                ]}
            >
                <Input disabled={loading} placeholder="1"></Input>
            </Form.Item>
            <Form.Item
                name="department_name"
                label="Khoa"
                hasFeedback
                rules={[{ required: true, message: 'Vui lòng chọn khoa' }]}
            >
                <Select disabled={loading}>
                    {departmentData.map((element) => {
                        return (
                            <Option key={element.department_id} value={element.department_name}>
                                {element.department_name}
                            </Option>
                        );
                    })}
                </Select>
            </Form.Item>
            <Form.Item name="description" label="Mô tả phòng">
                <Input disabled={loading} placeholder="Phòng ..."></Input>
            </Form.Item>
            {edit ? (
                <Form.Item wrapperCol={{ offset: 8 }}>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Sửa phòng
                    </Button>
                </Form.Item>
            ) : (
                <Form.Item wrapperCol={{ offset: 8 }}>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Thêm phòng
                    </Button>
                </Form.Item>
            )}
        </Form>
    );
};
