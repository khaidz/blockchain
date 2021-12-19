import React, {useState, useEffect} from 'react';
import {Form, Input, Button, Result, Space} from 'antd';
import {RetweetOutlined, EditOutlined} from '@ant-design/icons'
import 'moment/locale/en-au';
import axios from 'axios';
import { DEFAULT_HOST } from '@/host';
import Modal from 'antd/lib/modal/Modal';
import { fetchCurrentUser } from '@/helpers/Auth';

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
        span: 24,
    }
}

const isModified = (currentValue, newValue) => {
    let isModify = false;
    
    Object.keys(newValue).forEach(attr => {
        if(['drug_name'].includes(attr)){
            if(currentValue[attr] !== newValue[attr])
                isModify = true;
            
        }
        if(['drug_is_deleted'].includes(attr)){
            if(currentValue[attr] !== newValue[attr])
                isModify = true;
            
        }
        if(currentValue[attr] !== newValue[attr]) 
        {
            isModify = true;
        }
    })
    return isModify;
}

export default ({ defaultValue, onCancel}) => {
    const [current, setCurrent] = useState(defaultValue);
    const [edit, setEdit] = useState({
        value: {},
        isEditing: false,
    });
    const [success, setSuccess] = useState(false);
    const [posting, setPosting] = useState(false);
    const [form] = Form.useForm();
    const user = fetchCurrentUser();
    const [deleted, setDeleted] = useState(defaultValue.drug_is_deleted);
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    }
    // const validate1 = async (field, value) => {
    //     const url = `${DEFAULT_HOST}/admin/validate-drug?field=${field}&value=${value}`;
    //     try {
    //         const result = await axios.get(url);
    //         return result.data.valid;
    //     } catch (error1) {
    //         return false;
    //     }
    // }; 
    useEffect(() => {
        setCurrent({
            ...defaultValue,
            isConverted: true,
        });
    }, [defaultValue]);

    useEffect(() => {
        if (current.isConverted) form.setFieldsValue(current);
    }, [current, form]);

    const handleFormFinish = async (value) => {
        setPosting(true);
        const url = `${DEFAULT_HOST}/admin/drug/${current.drug_id}`;
        const va = value
        va.drug_is_deleted = deleted;
        if (!isModified(current, va)) return setTimeout(() => setSuccess(true), 1500);
        try {
            const result = await axios.post(url, va, config);
            if (result.data.success) {setPosting(false); setSuccess(true)};
        } catch (error) {
            setPosting(false);
        }
        return "";
    };

    return (
        <Form
            autoComplete="off"
            labelAlign="left"
            {...layout}
            onFinish={handleFormFinish}
            form={form}
        >
            <Form.Item name='drug_id' label='ID'>
                <Input readOnly></Input>
            </Form.Item>
            <Form.Item
                name="drug_name"
                label="Tên thuốc"
                rules={[{ required: true, message: 'Vui lòng nhập tên thuốc' }]}
            >
                <Input placeholder="..." disabled={posting || !edit.isEditing}></Input>
            </Form.Item>
            <Form.Item 
                name="drug_dosage_form"
                label="Dạng thuốc"
                hasFeedback
                rules={[
                    { required: true, message: 'Vui lòng nhập dạng thuốc' },
                    
                ]}>
                <Input disabled={posting || !edit.isEditing} placeholder="..."></Input>
            </Form.Item>
            <Form.Item
            name="drug_unit"
            label="Đơn vị thuốc"
            hasFeedback
            rules={[
                { required: true, message: 'Vui nhập đơn vị thuốc' },
                
            ]}>
                <Input disabled={posting || !edit.isEditing} placeholder="..."></Input>
            </Form.Item>
            <Form.Item
                name="drug_route"
                label="Đường dùng"
                hasFeedback
                rules={[
                    { required: true, message: 'Vui nhập đường dùng thuốc' },
                    
                ]}
            >
                <Input disabled={posting || !edit.isEditing} placeholder="..."></Input>
            </Form.Item>
            <Form.Item
                name="drug_instruction"
                label="Cách dùng thuốc"
                hasFeedback
                rules={[
                    { required: true, message: 'Vui nhập cách dùng thuốc' },
                    
                ]}
            >
                <Input disabled={posting || !edit.isEditing} placeholder="..."></Input>
            </Form.Item>
            <Form.Item name="drug_is_deleted" label="Trạng thái:">
                {deleted ? 
                <Button disabled={posting || !edit.isEditing} onClick={() => setDeleted(false)}>Đang khóa</Button>:
                <Button disabled={posting || !edit.isEditing} onClick={() => setDeleted(true)}>Đã kích hoạt</Button>}
            </Form.Item>
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
                    onCancel();
                }}
            >
                <Result status="success" title="Chỉnh sửa thông tin thành công"/>
            </Modal>
        </Form>
    );
};