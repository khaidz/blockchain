import React, { useState } from 'react'; // , useEffect
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { DEFAULT_HOST } from '@/host';
import { fetchCurrentUser } from '@/helpers/Auth';

const { useForm } = Form;
// const Option = Select;, Select

export default ({ edit }) => {
    //  const [subclinicalData, setSubclinicalData] = useState([]);
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
        const url = `${DEFAULT_HOST}/admin/validate-subclinical?field=${field}&value=${value}`;
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
    // const fetchSubclinical = async () => {
    //     try {
    //         const url = `${DEFAULT_HOST}/admin/subclinical`;
    //         const result = await axios.get(url, config);
    //         return result.data;
    //     } catch (error) {
    //         // console.log(error);
    //     }
    //     return "";
    // };
    // useEffect(() => {
    //     const f = async () => {
    //         const subclinical = await fetchSubclinical();
    //         setSubclinicalData(subclinical);
    //     };
    //     f();
    // },[loading, form]);
    const formFinish = async (data) => {
        setLoading(true);
        const url = `${DEFAULT_HOST}/admin/subclinical`;
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
            name="subclinical"
            onFinish={formFinish}
            form={form}
        >
            <Form.Item
                name="name"
                label="Tên cận lâm sàng"
                hasFeedback
                rules={[
                    { required: true, message: 'Vui lòng nhập tên cận lâm sàng' },
                    {
                        validator: async (rule, value) => {
                            if (!(await validate('subclinical_name', value)))
                                throw new Error('Tên cận lâm sàng đã tồn tại');
                        },
                    },
                ]}
            >
                <Input disabled={loading} placeholder=" ..."></Input>
            </Form.Item>
            <Form.Item name="description" label="Mô tả cận lâm sàng">
                <Input disabled={loading} placeholder=" ..."></Input>
            </Form.Item>
            {edit ? (
                <Form.Item wrapperCol={{ offset: 8 }}>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Sửa cận lâm sàng
                    </Button>
                </Form.Item>
            ) : (
                <Form.Item wrapperCol={{ offset: 8 }}>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Thêm cận lâm sàng
                    </Button>
                </Form.Item>
            )}
        </Form>
    );
};
