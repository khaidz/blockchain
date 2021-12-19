import React, { useState } from 'react';
import { Form, Input, Button, message} from 'antd';
import axios from 'axios';
import { DEFAULT_HOST } from '@/host';
import {fetchCurrentUser} from '@/helpers/Auth'

const {useForm} = Form;
// disable
export default ({edit, }) => {

    const [loading, setLoading] = useState(false);
    const user = fetchCurrentUser();
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`,
        }
    }
    const [form] = useForm();
    const validate = async (field, value) => {
        const url = `${DEFAULT_HOST}/admin/validate-department?field=${field}&value=${value}`;
        try {
            const result = await axios.get(url);
            return result.data.valid;
        } catch (error1) {
            return false;
        }
    }; 
    
    const formFinish = async (value) => {
        setLoading(true);
        const url = `${DEFAULT_HOST}/admin/department`;
        let mess;
        try {
            const result =  await axios.post(url,value, config);
            if (result.status){
                mess = `Đăng ký thành công ${value.name}`;
                setLoading(false);
                message.success(mess);
            }
            else { 
                mess = "Thất bại";
                setLoading(false);
                message.error(mess);
            }  
        } catch (error2) {
            mess = "Thất bại";
            setLoading(false);
            message.error(mess);
        }
        // disable();
        return "";
    }


    return (
        <Form
            labelCol={{ span: 8 }}
            labelAlign="left"
            name="department"
            onFinish={formFinish}
            form={form}
        >
            <Form.Item 
                name="name"
                label="Tên khoa"
                hasFeedback
                rules={[
                    { required: true, message: 'Vui lòng nhập tên khoa' },
                    {
                        validator: async (rule, value) => {
                            if (!(await validate('department_name', value))) throw  new Error('Tên khoa đã tồn tại');
                        },
                    },
                ]}>
                <Input disabled={loading} placeholder="Khoa Nhi"></Input>
            </Form.Item>
            <Form.Item
                name="description"
                label="Mô tả khoa"
            >
                <Input disabled={loading} placeholder="Khoa Nhi - Khoa khám chữa bệnh cho trẻ em"></Input>
            </Form.Item>
            {edit ? (
                <Form.Item wrapperCol={{ offset: 8 }}>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Sửa khoa
                    </Button>
                </Form.Item>
            ) : (
                <Form.Item wrapperCol={{ offset: 8 }}>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Thêm khoa
                    </Button>
                </Form.Item>
            )}
        </Form>
    );
};
