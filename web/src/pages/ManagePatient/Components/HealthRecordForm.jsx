import React, {useState, useEffect} from 'react';
import {Form, Input, Button, Result, Space, message, Card} from 'antd';
import {RetweetOutlined} from '@ant-design/icons'
import 'moment/locale/en-au';

import axios from 'axios';
import { DEFAULT_HOST } from '@/host';
import Modal from 'antd/lib/modal/Modal';
import {fetchCurrentUser} from '@/helpers/Auth';

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

export default ({id}) => {
    const [success, setSuccess] = useState(false);
    const [posting, setPosting] = useState(false);
    const [userValue, setUser] = useState([]);
    const [form] = Form.useForm();
    
    const config = {};
            const user = fetchCurrentUser();
            config.headers = {
                    Authorization: `Bearer ${user.token}`
                };
    const urlS = `${DEFAULT_HOST}/users/search-patient?field=user_id&value=${id}`;
    useEffect(()=>{
        const f = async () => {
            const rs = await axios.get(urlS, config);
            if (rs.data.data[0]){
            setUser(rs.data.data[0]);
            form.setFieldsValue(rs.data.data[0]);
            return ""
            }
            return ""
        }
        f();
    },[form, posting]);
    
    const handleFormFinish = async (value) => {
        setPosting(true);
        const va = value;
        const url = `${DEFAULT_HOST}/receptionist/create-health-record`;
        try {
            const result = await axios.post(url, va, config);
            if (result.data.success) { setPosting(false); setSuccess(true); message.success(result.data.message); setUser([]); return};
            setPosting(false); 
            setSuccess(false); 
            message.error("Thất bại"); 
            return;
        } catch (error) {
            setPosting(false);
        }
    };;

    const validate = async (field, value) => {
        const url = `${DEFAULT_HOST}/receptionist/search-healthrecord?field=${field}&value=${value}`;
        try {
            const result = await axios.get(url);
            return result.data.valid;
        } catch (error1) {
            return false;
        }
    }; 

    return (
        <Card>
        <Form
            autoComplete="off"
            labelAlign="left"
            {...layout}
            onFinish={handleFormFinish}
            form={form}
            style={{margin:20}}
            title="Đăng ký sổ khám bệnh"
        >
            <Form.Item
                hasFeedback
                name="user_id"
                label="ID"
                rules={[
                    {
                        validator: async (rule, value) => {
                            if ((await validate('health_record_patient_id', value))) throw  new Error('Sổ khám đã tồn tại');
                        },
                    },
                ]}
            >
                <Input readOnly disabled={true}></Input>
            </Form.Item>
            <Form.Item
                hasFeedback
                label="Họ và tên"
                name="user_fullname"
            >
                <Input readOnly disabled={true}></Input>
            </Form.Item>
            <Form.Item
                hasFeedback
                label="Số điện thoại"
            >
                <Input readOnly disabled={true} value={userValue.user_phone}></Input>
            </Form.Item>
            <Form.Item
                hasFeedback
                label="Email"
            >
                <Input readOnly disabled={true} value={userValue.user_email}></Input>
            </Form.Item>
            <Form.Item label="Giới tính:">
                    <Input readOnly disabled={true} value={userValue.user_gender}></Input>
            </Form.Item>
            <Form.Item
                label="Số CMND/CCCD"
                hasFeedback
            >
                <Input disabled={true} value={userValue.user_identity_card}></Input>
            </Form.Item>
            <Form.Item
                label="Địa chỉ"
                hasFeedback
            >
                <Input readOnly disabled={true} value={userValue.user_address}></Input>
            </Form.Item>
            <Form.Item
                label="Số BHYT"
                name="user_health_insurance"
                hasFeedback
                rules={[
                     {required: true, message: 'Vui lòng nhập số BHYT'},
                     {
                        validator: async (rule, value) => {
                            if ((await validate('health_record_health_insurance', value))) throw  new Error('Sổ khám đã tồn tại');
                        },
                    },
                ]}
            >
                <Input disabled={posting}></Input>
            </Form.Item>
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
        </Card>
    );
}

