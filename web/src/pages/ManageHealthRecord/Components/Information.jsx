import React, {useState, useEffect} from 'react';
import {Form, Input, Button, Card, Tag, Divider, DatePicker} from 'antd';
import {fetchCurrentUser} from '@/helpers/Auth';
import 'moment/locale/en-au';
import moment from 'moment';
import ResultForm from './Prescription/ResultForm';
import Result from './Subclinical/Result';

const layout = {
    wrapperCol: {
        span: 16
    },
    labelCol: {
        span: 8
    }
}

export default ({mbValue}) => {
    // const [success, setSuccess] = useState(false);
    // const [posting, setPosting] = useState(false);
    const [form] = Form.useForm();
    const [comp] = useState(mbValue.medical_bill_is_completed);
    const config = {};
            const user = fetchCurrentUser();
            config.headers = {
                    Authorization: `Bearer ${user.token}`
                };
    useEffect(()=>{
        const f = async () => {
            const mb = mbValue
            mb.medical_bill_appointment = moment(mb.medical_bill_appointment, 'DD-MM-YYYY');
            form.setFieldsValue(mb);
            return "";
        }
        f();
    },[form,comp]);
    
    // const handleFormFinish = async (value) => {
    //     setPosting(true);
    //     const va = value;
    //     va.medical_bill_is_completed = comp;
    //     va.medical_bill_id = mbValue.medical_bill_id;
    //     alert(`Thông tin:  Trạng thái: ${va.medical_bill_is_completed} - ID phiếu khám: ${va.medical_bill_id} - Huyết áp: ${va.vital_signs_blood_pressure}`)
    //     const url = `${DEFAULT_HOST}/physician/medical-bill/${va.medical_bill_id}`;
    //     try {
    //         const result = await axios.post(url, va, config);
    //         if (result.data.success) { setPosting(false); setSuccess(true); message.success("Thành công"); return};
    //         setPosting(false); 
    //         setSuccess(false); 
    //         message.error('Thất bại!');
    //         return;
    //     } catch (error) {
    //         setPosting(false);
    //         setSuccess(false); 
    //         message.error('Thất bại!');
    //     }
    // };;

    return (
        <Card>
        <Form
            autoComplete="off"
            labelAlign="left"
            {...layout}
            // onFinish={handleFormFinish}
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
                    
                >
                    <Input readOnly></Input>
                </Form.Item>
                <Form.Item
                    hasFeedback
                    name="medical_bill_patient_name"
                    label="Họ tên bệnh nhân"
                    
                >
                    <Input readOnly ></Input>
                </Form.Item>
                <Form.Item
                    hasFeedback
                    label="ID sổ khám bệnh"
                    name="medical_bill_health_record_id"
                    
                    
                >
                    <Input readOnly ></Input>
                </Form.Item>
                <Form.Item
                    hasFeedback
                    label="Khoa"
                    name="medical_bill_department_name"
                >
                    <Input readOnly ></Input>
                </Form.Item>
                <Form.Item
                    hasFeedback
                    label="Phòng"
                    name="medical_bill_room_name"
                >
                    <Input readOnly ></Input>
                </Form.Item>
                <Form.Item
                    label="Bác sĩ"
                    hasFeedback
                    name="medical_bill_physician_name"
                >
                    <Input readOnly ></Input>
                </Form.Item>
            </Card>
            <Card>
                <Tag color='cyan'>Dấu hiệu sinh tồn</Tag>
                <Divider></Divider>
                <Form.Item
                    label="Nhiệt độ"
                    hasFeedback
                    name="vital_signs_temperature"
                >
                    <Input readOnly></Input>
                </Form.Item>
                <Form.Item
                    label="Huyết áp"
                    hasFeedback
                    name="vital_signs_blood_pressure"
                >
                    <Input readOnly></Input>
                </Form.Item>
                <Form.Item
                    label="Nhịp thở"
                    hasFeedback
                    name="vital_signs_breathing"
                >
                    <Input readOnly></Input>
                </Form.Item>
                <Form.Item
                    label="Nhịp tim"
                    hasFeedback
                    name="vital_signs_pluse"
                >
                    <Input readOnly></Input>
                </Form.Item>
            </Card>
            <Card>
                <Tag color='cyan'>Thông tin thăm khám bệnh</Tag>
                <Divider></Divider>
                <Form.Item
                    label="Lý do khám bệnh"
                    hasFeedback
                    name="medical_bill_reason_for_examination"
                >
                    <Input readOnly></Input>
                </Form.Item>
                <Form.Item
                    label="Tiền sử bệnh"
                    hasFeedback
                    name="medical_bill_anamnesis"
                >
                    <Input readOnly></Input>
                </Form.Item>
                <Form.Item
                    label="Lịch sử bệnh"
                    hasFeedback
                    name="medical_bill_medical_history"
                >
                    <Input readOnly></Input>
                </Form.Item>
                {/* <Form.Item
                    label="Kết quả trước đây"
                    hasFeedback
                    name="medical_bill_previous_result"
                >
                    <Input readOnly></Input>
                </Form.Item> */}
                <Form.Item
                    label="Chẩn đoán bệnh"
                    hasFeedback
                    name="medical_bill_diagnose"
                >
                    <Input readOnly></Input>
                </Form.Item>
                
                {/* <Form.Item
                    label="Phương pháp điều trị"
                    hasFeedback
                    name="medical_bill_treatment"
                >
                    <Input readOnly></Input>
                </Form.Item>
                
                <Form.Item
                    label="Nơi giới thiệu"
                    hasFeedback
                    name="medical_bill_place_of_introduction"
                >
                    <Input readOnly></Input>
                </Form.Item> */}
                <Form.Item
                    label="Hẹn tái khám"
                    hasFeedback
                    name="medical_bill_appointment"
                >
                    <DatePicker readOnly disabled={true}></DatePicker>
                </Form.Item>
                </Card>
                <Card>
                    <Tag color='cyan'>Kết quả cận lâm sàng</Tag> 
                    <Divider></Divider>
                    <Result mbId={mbValue.medical_bill_id}></Result>
                </Card>
                <Card>
                    <Tag color='cyan'>Đơn thuốc</Tag> 
                    <Divider></Divider>
                    <ResultForm mbId={mbValue.medical_bill_id}></ResultForm>
                </Card>
                <Divider></Divider>
                <Form.Item name="medical_bill_is_completed" label="Trạng thái:">
                    {comp ? 
                    <Button>Đã hoàn thành</Button>:
                    <Button>Chưa hoàn thành</Button>}
                </Form.Item>
            </Form>
        </Card>
    );
}

