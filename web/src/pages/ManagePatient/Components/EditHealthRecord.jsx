import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Result, Space, message } from 'antd';
import { RetweetOutlined, EditOutlined } from '@ant-design/icons';
import 'moment/locale/en-au';
import axios from 'axios';
import { DEFAULT_HOST } from '@/host';
import Modal from 'antd/lib/modal/Modal';
import { fetchCurrentUser } from '@/helpers/Auth';

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
        if (currentValue[attr] !== newValue[attr]) {
            isModify = true;
        }
    });
    return isModify;
};

export default ({ pId }) => {
    const user = fetchCurrentUser();
    const [defaultValue, setDefaultValue] = useState([]);
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
    };

    useEffect(() => {
        const f = async () => {
            const url = `${DEFAULT_HOST}/receptionist/search-health-record?field=health_record_patient_id&value=${pId}`;
            try {
                const result = await axios.get(url, config);
                if (result.data.success) {
                    setDefaultValue(result.data.data[0]);
                    message.success(result.data.data[0].health_record_id);
                    return;
                }
                message.error('Không tìm tìm thấy sổ khám');
            } catch (error) {
                message.error('Không tìm tìm thấy sổ khám');
            }
        };
        f();
    }, [pId]);

    const [current, setCurrent] = useState(defaultValue);
    const [edit, setEdit] = useState({
        value: {},
        isEditing: false,
    });
    const [success, setSuccess] = useState(false);
    const [posting, setPosting] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        setCurrent({
            ...defaultValue,
            isConverted: true,
        });
    }, [defaultValue]);

    useEffect(() => {
        if (current.isConverted) form.setFieldsValue(current);
    }, [current, form, posting]);

    const handleFormFinish = async (value) => {
        setPosting(true);
        const url = `${DEFAULT_HOST}/receptionist/health-record/${current.health_record_id}`;
        const va = value;
        if (!isModified(current, va))
            return setTimeout(() => {
                setPosting(false);
                setSuccess(true);
            }, 1500);
        try {
            const result = await axios.post(url, va, config);
            if (result.data.success) {
                setPosting(false);
                setSuccess(true);
                return '';
            }
        } catch (error) {
            setPosting(false);
        }
        return '';
    };

    return (
        <Form
            autoComplete="off"
            labelAlign="left"
            {...layout}
            onFinish={handleFormFinish}
            form={form}
        >
            <Form.Item
                name="health_record_id"
                label="ID sổ khám"
                rules={[{ required: true, message: 'Vui lòng nhập ID sổ khám' }]}
            >
                <Input readOnly disabled={true}></Input>
            </Form.Item>
            <Form.Item
                name="health_record_patient_id"
                label="ID bệnh nhân"
                rules={[{ required: true, message: 'Vui lòng nhập ID bệnh nhân' }]}
            >
                <Input readOnly disabled={true}></Input>
            </Form.Item>
            <Form.Item
                name="health_record_patient_name"
                label="Họ và tên bệnh nhân"
                rules={[{ required: true, message: 'Vui lòng nhập tên bệnh nhân' }]}
            >
                <Input disabled={posting || !edit.isEditing}></Input>
            </Form.Item>
            <Form.Item
                name="health_record_health_insurance"
                label="Số thẻ BHYT"
                rules={[{ required: true, message: 'Vui lòng nhập số thẻ BHYT' }]}
            >
                <Input placeholder="..." disabled={posting || !edit.isEditing}></Input>
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
                }}
            >
                <Result status="success" title="Chỉnh sửa thông tin thành công" />
            </Modal>
        </Form>
    );
};
