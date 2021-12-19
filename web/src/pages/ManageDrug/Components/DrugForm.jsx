import React, { useState} from 'react';
import { Form, Input, Button, message} from 'antd';
import axios from 'axios';
import { DEFAULT_HOST } from '@/host';
import {fetchCurrentUser} from '@/helpers/Auth'

const {useForm} = Form;
// const Option = Select;, Select, useEffect
                    
export default ({edit }) => {
    // const [drugData, setDrugData] = useState([]);
    // const [formValue, setValue] = useState([]);
    // const [rowValue, setRow] = useState('');disable
    const [loading, setLoading] = useState(false);
    const user = fetchCurrentUser();
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`,
        }
    }
    const [form] = useForm();
    const validate = async (field, value) => {
        const url = `${DEFAULT_HOST}/admin/validate-drug?field=${field}&value=${value}`;
        try {
            const result = await axios.get(url);
            return result.data.valid;
        } catch (error1) {
            return false;
        }
    }; 
    // const validate1 = async (field, value) => {
    //     const url = `${DEFAULT_HOST}/admin/validate-department?field=${field}&value=${value}`;
    //     try {
    //         const result = await axios.get(url);
    //         return result.data.valid;
    //     } catch (error1) {
    //         return false;
    //     }
    // }; 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // const fetchDepartment = async () => {
    //     try {
    //         const url = `${DEFAULT_HOST}/admin/department`;
    //         const result = await axios.get(url, config);
    //         return result.data;
    //     } catch (error) {
    //         // console.log(error);
    //     }
    //     return "";
    // };
    // useEffect(() => {
    //     const f = async () => {
    //         const department = await fetchDepartment();
    //         setDepartmentData(department);
    //     };
    //     f();
    // },[departmentData, fetchDepartment]);
    const formFinish = async (data) => {
        setLoading(true);
        const url = `${DEFAULT_HOST}/admin/drug`;
        let mess;
        try {
            const result =  await axios.post(url,data, config);
            if (result.status){
                mess = `Đăng ký thành công ${data.name}`;
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
            name="drug"
            onFinish={formFinish}
            form={form}
        >
            <Form.Item 
                name="name"
                label="Tên thuốc"
                hasFeedback
                rules={[
                    { required: true, message: 'Vui lòng nhập tên thuốc' },
                    {
                        validator: async (rule, value) => {
                            if (!(await validate('drug_name', value))) throw  new Error('Tên thuốc đã tồn tại');
                        },
                    },
                ]}>
                <Input disabled={loading} placeholder="..."></Input>
            </Form.Item>
            <Form.Item 
                name="dosageForm"
                label="Dạng thuốc"
                hasFeedback
                rules={[
                    { required: true, message: 'Vui lòng nhập dạng thuốc' },
                    
                ]}>
                <Input disabled={loading} placeholder="..."></Input>
            </Form.Item>
            <Form.Item
            name="unit"
            label="Đơn vị thuốc"
            hasFeedback
            rules={[
                { required: true, message: 'Vui nhập đơn vị thuốc' },
                
            ]}>
                <Input disabled={loading} placeholder="..."></Input>
            </Form.Item>
            <Form.Item
                name="route"
                label="Đường dùng"
                hasFeedback
                rules={[
                    { required: true, message: 'Vui nhập đường dùng thuốc' },
                    
                ]}
            >
                <Input disabled={loading} placeholder="..."></Input>
            </Form.Item>
            <Form.Item
                name="instruction"
                label="Cách dùng thuốc"
                hasFeedback
                rules={[
                    { required: true, message: 'Vui nhập cách dùng thuốc' },
                    
                ]}
            >
                <Input disabled={loading} placeholder="..."></Input>
            </Form.Item>
            {edit ? (
            <Form.Item wrapperCol={{ offset: 8 }}>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Sửa thuốc
                </Button>
            </Form.Item>
            ) : (
            <Form.Item wrapperCol={{ offset: 8 }}>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Thêm thuốc
                </Button>
            </Form.Item>
            )}
        </Form>
    
    );
};
