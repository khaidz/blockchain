import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Result, Space, message, Card, Tag, Select } from 'antd';
import { RetweetOutlined } from '@ant-design/icons';
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
        span: 16,
        offset: 8,
    },
};
const Option = Select;

export default ({ userValue }) => {
    const [success, setSuccess] = useState(false);
    const [posting, setPosting] = useState(false);
    const [room, setRoom] = useState([]);
    // const [pId, setPID] = useState('');
    const [department, setDepartment] = useState([]);
    const [physician, setPhysician] = useState([]);
    const [patientName, setPatient] = useState('');
    const [form] = Form.useForm();

    const config = {};
    const user = fetchCurrentUser();
    config.headers = {
        Authorization: `Bearer ${user.token}`,
    };
    const urlS = `${DEFAULT_HOST}/receptionist/search-health-record?field=health_record_patient_id&value=${userValue.user_id}`;
    const urlS1 = `${DEFAULT_HOST}/admin/department`;
    const urlS2 = `${DEFAULT_HOST}/admin/room`;
    const urlS3 = `${DEFAULT_HOST}/users/search/physician`;
    const urlS4 = `${DEFAULT_HOST}/users/search?field=user_id&value=${userValue.user_id}`;
    useEffect(() => {
        const f = async () => {
            const rs = await axios.get(urlS, config);
            if (rs.data.data === undefined) {
                form.setFieldsValue([]);
            } else {
                form.setFieldsValue(rs.data.data[0]);
                const rs1 = await axios.get(urlS1, config);
                const rs2 = await axios.get(urlS2, config);
                const rs3 = await axios.get(urlS3, config);
                const rs4 = await axios.get(urlS4, config);
                setDepartment(rs1.data);
                setRoom(rs2.data);
                setPhysician(rs3.data.data);
                setPatient(rs4.data.data[0].user_fullname);
            }
            return '';
        };
        f();
    }, [form, posting]);

    const handleFormFinish = async (value) => {
        setPosting(true);
        const va = value;
        va.health_record_patient_name = patientName;
        // va.pId = pId;
        const url = `${DEFAULT_HOST}/receptionist/create-medical-bill`;
        try {
            const result = await axios.post(url, va, config);
            if (result.data.success) {
                setPosting(false);
                setSuccess(true);
                message.success(result.data.message);
                return;
            }
            setPosting(false);
            setSuccess(false);
            message.error('Thất bại!');
            return;
        } catch (error) {
            setPosting(false);
            setSuccess(false);
            message.error('Thất bại!');
        }
    };

    //  const validate = async (value) => {
    //     // const url = `${DEFAULT_HOST}/users/search/physician?field=user_id&value=${value}`;
    //     // try {
    //     //     const result = await axios.get(url);
    //     //     setPID(result.data.data[0].user_id);
    //     //     return "";
    //     // } catch (error1) {
    //     //     setPID('==');
    //     //         return "";
    //     // }
    //     setPID(value);
    // };
    return (
        <Card>
            <Form
                autoComplete="off"
                labelAlign="left"
                {...layout}
                onFinish={handleFormFinish}
                form={form}
                style={{ margin: 20 }}
                title="Đăng ký phiếu khám"
                label="Đăng ký phiếu khám"
            >
                <Tag color="cyan">Đăng ký phiếu khám</Tag>
                <Form.Item hasFeedback label="Họ tên bệnh nhân" rules={[{ required: true }]}>
                    <Input readOnly disabled={true} value={patientName}></Input>
                </Form.Item>
                <Form.Item
                    hasFeedback
                    name="health_record_patient_id"
                    label="ID bệnh nhân"
                    rules={[{ required: true }]}
                >
                    <Input readOnly disabled={true}></Input>
                </Form.Item>
                <Form.Item
                    hasFeedback
                    label="ID sổ khám bệnh"
                    name="health_record_id"
                    rules={[{ required: true }]}
                >
                    <Input readOnly disabled={true}></Input>
                </Form.Item>
                <Form.Item
                    hasFeedback
                    label="Thẻ BHYT"
                    name="health_record_health_insurance"
                    rules={[{ required: true }]}
                >
                    <Input readOnly disabled={true}></Input>
                </Form.Item>
                <Form.Item
                    hasFeedback
                    label="Số thứ tự khám"
                    name="ordinal_number"
                    rules={[{ required: true }]}
                >
                    <Input disabled={posting}></Input>
                </Form.Item>
                <Form.Item
                    hasFeedback
                    label="Khoa"
                    name="department"
                    rules={[{ required: true, message: 'Vui lòng chọn khoa' }]}
                >
                    <Select disabled={posting}>
                        {department.map((element) => {
                            return (
                                <Option key={element.department_id} value={element.department_name}>
                                    {element.department_name}
                                </Option>
                            );
                        })}
                    </Select>
                </Form.Item>
                <Form.Item
                    hasFeedback
                    label="Phòng"
                    name="room"
                    rules={[{ required: true, message: 'Vui lòng chọn phòng' }]}
                >
                    <Select disabled={posting}>
                        {room.map((element) => {
                            return (
                                <Option key={element.room_id} value={element.room_name}>
                                    {element.room_name}
                                </Option>
                            );
                        })}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Bác sĩ"
                    hasFeedback
                    name="physician"
                    rules={[{ required: true, message: 'Vui lòng chọn bác sĩ' }]}
                >
                    <Select disabled={posting}>
                        {physician.map((element) => {
                            return (
                                <Option key={element.user_id} value={element.user_fullname}>
                                    {element.user_fullname}
                                    {/* <Button  onClick={()=> {validate(element.user_id);}}>{element.user_id}</Button> */}
                                </Option>
                            );
                        })}
                    </Select>
                </Form.Item>
                {/* <Form.Item
                label="ID bác sĩ"
                hasFeedback
                // rules={[{ required: true, message: 'Vui lòng chọn bác sĩ' }]}
            >
                <Input value={pId} readOnly disabled={true}></Input>
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
                    <Result status="success" title={'Thêm thành công'} />
                </Modal>
            </Form>
        </Card>
    );
};
