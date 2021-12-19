import React, {useState, useEffect} from 'react';
import {Form, Input, Button, Result, Space, message, Card, Tag, Divider, DatePicker} from 'antd';
import {RetweetOutlined} from '@ant-design/icons'
import 'moment/locale/en-au';
import moment from 'moment';
import axios from 'axios';
import { DEFAULT_HOST } from '@/host';
import Modal from 'antd/lib/modal/Modal';
import {fetchCurrentUser} from '@/helpers/Auth';
import Prescription from './Prescription/Prescription';
import SubclinicalSheet from './Subclinical/SubclinicalSheet';

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

export default ({mbValue}) => {
    const [success, setSuccess] = useState(false);
    const [anamnesis, setAnamnesis] = useState('');
    const [histotyId, setId] = useState('');
    const [medicalHistory, setHistory] = useState('');
    const [posting, setPosting] = useState(false);
    const [form] = Form.useForm();
    const [comp, setComp] = useState(mbValue.medical_bill_is_completed);
    const config = {};
            const user = fetchCurrentUser();
            config.headers = {
                    Authorization: `Bearer ${user.token}`
                };
    useEffect(()=>{
        const f = async () => {
            const url = `${DEFAULT_HOST}/physician/search-history?field=history_patient_id&value=${mbValue.medical_bill_patient_id}`;
            try {
                const result = await axios.get(url, config);
                if (result.data.success) { 
                    setAnamnesis(result.data.data[0].anamnesis);
                    setHistory(result.data.data[0].medical_history);
                    setId(result.data.data[0].history_id);

                };
            } catch (error) {
                setAnamnesis('');
                setHistory('');
                setId('');
            }
            const mb = mbValue;
            mb.medical_bill_anamnesis = anamnesis;
            mb.medical_bill_medical_history = medicalHistory;
            if(mb.medical_bill_appointment === undefined) {
                form.setFieldsValue(mb);
            }
            else {
                mb.medical_bill_appointment = moment(mb.medical_bill_appointment, 'DD-MM-YYYY');
                form.setFieldsValue(mb);
            }
            
            return "";
        }
        f();
    },[form, posting, anamnesis, histotyId, medicalHistory]);
    
    const handleFormFinish = async (value) => {
        setPosting(true);
        const va = value;
        va.medical_bill_is_completed = comp;
        va.medical_bill_id = mbValue.medical_bill_id;
        // va.medical_bill_anamnesis = anamnesis;
        // va.medical_bill_medical_history = medicalHistory;
        va.medical_bill_appointment =  va.medical_bill_appointment.format('DD-MM-YYYY');
        const url = `${DEFAULT_HOST}/physician/medical-bill/${va.medical_bill_id}/${histotyId}`;
        try {
            const result = await axios.post(url, va, config);
            if (result.data.success) { setPosting(false); setSuccess(true); message.success("Thành công"); return};
            setPosting(false); 
            setSuccess(false); 
            message.error('Thất bại!');
            return;
        } catch (error) {
            setPosting(false);
            setSuccess(false); 
            message.error('Thất bại!');
        }
    };;

    return (
        <Card>
        <Form
            autoComplete="off"
            labelAlign="left"
            {...layout}
            onFinish={handleFormFinish}
            form={form}
            style={{margin:20}}
        >
            <Card>
                <Tag color='cyan'>Thông tin hành chính</Tag>
                <Divider></Divider>
                
                <Form.Item
                    hasFeedback
                    name="medical_bill_patient_id"
                    label="ID bệnh nhân"
                    rules={[
                        {required: true},
                    ]}
                >
                    <Input readOnly disabled={posting}></Input>
                </Form.Item>
                <Form.Item
                    hasFeedback
                    name="medical_bill_patient_name"
                    label="Họ tên bệnh nhân"
                    rules={[
                        {required: true},
                    ]}
                >
                    <Input readOnly disabled={posting}></Input>
                </Form.Item>
                <Form.Item
                    hasFeedback
                    label="ID sổ khám bệnh"
                    name="medical_bill_health_record_id"
                    rules={[
                        {required: true},
                    ]}
                    
                >
                    <Input readOnly disabled={posting}></Input>
                </Form.Item>
                <Form.Item
                    hasFeedback
                    label="Số BHYT"
                    name="medical_bill_health_insurance"
                    rules={[
                        {required: true},
                    ]}
                    
                >
                    <Input readOnly disabled={posting}></Input>
                </Form.Item>
                <Form.Item
                    hasFeedback
                    label="Số thứ tự khám"
                    name="medical_bill_ordinal_number"
                    rules={[
                        {required: true},
                    ]}
                    
                >
                    <Input readOnly disabled={posting}></Input>
                </Form.Item>
                <Form.Item
                    hasFeedback
                    label="Khoa"
                    name="medical_bill_department_name"
                    rules={[{ required: true }]}
                >
                    <Input readOnly disabled={posting}></Input>
                </Form.Item>
                <Form.Item
                    hasFeedback
                    label="Phòng"
                    name="medical_bill_room_name"
                    rules={[{ required: true}]}
                >
                    <Input readOnly disabled={posting}></Input>
                </Form.Item>
                <Form.Item
                    label="Bác sĩ"
                    hasFeedback
                    name="medical_bill_physician_name"
                    rules={[{ required: true}]}
                >
                    <Input readOnly disabled={posting}></Input>
                </Form.Item>
            </Card>
            <Card>
                <Tag color='cyan'>Dấu hiệu sinh tồn</Tag>
                <Divider></Divider>
                <Form.Item
                    label="Nhiệt độ (Đơn vị: độ C )"
                    hasFeedback
                    name="vital_signs_temperature"
                    rules={[{ required: true}]}
                >
                    <Input disabled={posting}></Input>
                </Form.Item>
                <Form.Item
                    label="Huyết áp (Đơn vị: mmHg )"
                    hasFeedback
                    name="vital_signs_blood_pressure"
                    rules={[{ required: true}]}
                >
                    <Input disabled={posting}></Input>
                </Form.Item>
                <Form.Item
                    label="Nhịp thở (Đơn vị: nhịp/phút )"
                    hasFeedback
                    name="vital_signs_breathing"
                    rules={[{ required: true}]}
                >
                    <Input disabled={posting}></Input>
                </Form.Item>
                <Form.Item
                    label="Nhịp tim (Đơn vị: nhịp/phút )"
                    hasFeedback
                    name="vital_signs_pluse"
                    rules={[{ required: true}]}
                >
                    <Input disabled={posting}></Input>
                </Form.Item>
            </Card>
            <Card>
                <Tag color='cyan'>Thông tin thăm khám bệnh</Tag>
                <Divider></Divider>
                <Form.Item
                    label="Lý do khám bệnh"
                    hasFeedback
                    name="medical_bill_reason_for_examination"
                    rules={[{ required: true}]}
                >
                    <Input disabled={posting}></Input>
                </Form.Item>
                <Form.Item
                    label="Tiền sử bệnh"
                    hasFeedback
                    name="medical_bill_anamnesis"
                    rules={[{ required: true}]}
                >
                    <Input disabled={posting}></Input>
                </Form.Item>
                <Form.Item
                    label="Lịch sử bệnh"
                    hasFeedback
                    name="medical_bill_medical_history"
                    rules={[{ required: true}]}
                >
                    <Input disabled={posting}></Input>
                </Form.Item>
                {/* <Form.Item
                    label="Kết quả trước đây"
                    hasFeedback
                    name="medical_bill_previous_result"
                    rules={[{ required: true}]}
                >
                    <Input disabled={posting}></Input>
                </Form.Item> */}
                <Form.Item
                    label="Chẩn đoán bệnh"
                    hasFeedback
                    name="medical_bill_diagnose"
                    rules={[{ required: true}]}
                >
                    <Input disabled={posting}></Input>
                </Form.Item>
                
                {/* <Form.Item
                    label="Phương pháp điều trị"
                    hasFeedback
                    name="medical_bill_treatment"
                    rules={[{ required: true}]}
                >
                    <Input disabled={posting}></Input>
                </Form.Item>
                
                <Form.Item
                    label="Nơi giới thiệu"
                    hasFeedback
                    name="medical_bill_place_of_introduction"
                    rules={[{ required: true}]}
                >
                    <Input disabled={posting}></Input>
                </Form.Item> */}
                <Form.Item
                    label="Hẹn tái khám"
                    hasFeedback
                    name="medical_bill_appointment"
                    rules={[{ required: true}]}
                >
                    <DatePicker disabled={posting}></DatePicker>
                </Form.Item>
                </Card>
                <Card>
                    <Tag color='cyan'>Kết quả cận lâm sàng</Tag> 
                    <Divider></Divider>
                    <SubclinicalSheet mbId={mbValue.medical_bill_id}></SubclinicalSheet>
                </Card>
                <Card>
                    <Tag color='cyan'>Đơn thuốc</Tag> 
                    <Divider></Divider>
                    <Prescription mbId={mbValue.medical_bill_id} ></Prescription>   
                </Card>
                <Divider></Divider>
                <Form.Item name="medical_bill_is_completed" label="Trạng thái:">
                    {comp ? 
                    <Button disabled={posting} onClick={() => {setComp(false)}}>Đã hoàn thành</Button>:
                    <Button disabled={posting} onClick={() => {setComp(true)}}>Chưa hoàn thành</Button>}
                </Form.Item>
                <Form.Item {...buttonCol}>
                    <Space>
                        <Button type="primary" htmlType="submit" loading={posting}>
                            Xác nhận
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

