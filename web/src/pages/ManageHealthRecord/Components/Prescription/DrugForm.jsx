import React, { useState, useEffect} from 'react';
import { Form, Input, Button, message, Select, Checkbox} from 'antd';
import axios from 'axios';
import { DEFAULT_HOST } from '@/host';
import {fetchCurrentUser} from '@/helpers/Auth'

const {useForm} = Form;
const Option = Select;
const options = [
    { label: 'Sáng', value: 'Sáng' },
    { label: 'Trưa', value: 'Trưa' },
    { label: 'Chiều', value: 'Chiều' },
    { label: 'Tối', value: 'Tối' },
  ];
                    
export default ({mbId}) => {
    const [drugData, setDrugData] = useState([]);
    const [search, setSearch] = useState([]);
    const [check, setCheck] = useState([]);
    const [setsearch, setSetSearch] = useState(false);
    const [loading, setLoading] = useState(false);
    const user = fetchCurrentUser();
    const rs= [];
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`,
        }
    }
    const [form] = useForm();
    const validate = async (value) => {
        const url = `${DEFAULT_HOST}/physician/search-drug?field=drug_id&value=${value}`;
        try {
            const result = await axios.get(url);
            if (result.data.success){
                form.setFieldsValue(result.data.data[0]);
                return "";
            }
            
                form.setFieldsValue([]);
                return "";
        } catch (error1) {
                form.setFieldsValue([]);
                return "";
        }
    }; 
    
    const fetchDrug = async () => {
        try {
            const url = `${DEFAULT_HOST}/admin/drug`;
            const result = await axios.get(url, config);
            return result.data;
        } catch (error) {
            // console.log(error);
        }
        return "";
    };
    useEffect(() => {
        const f = async () => {
            const drug = await fetchDrug();
            setDrugData(drug);
            setSearch(drug);
            return "";
        };
        f();
    },[setsearch]);
    const handleSearch = async (value) => { 
                // setSetSearch(true); 
                drugData.map((e) => {
                    if (e.drug_name.search(value) !== (-1)) {
                        rs.push(e);
                    };
                    return '';
                });
                if (rs !== []){
                    setSearch(rs);
                }
                else {
                   setSetSearch(true); 
                }
        }
    function onChange(checkedValues) {
            setCheck(checkedValues);
        }
    const formFinish = async (value) => {
        setLoading(true);
        const url = `${DEFAULT_HOST}/physician/prescription/medical-bill/${mbId}`;
        let mess;
        const data = value;
        data.doctor_instruction = `Ngày uống ${form.getFieldValue("drug_time1")} lần. Mỗi lần uống ${form.getFieldValue("drug_time2")} viên. Uống vào các buổi ${check} - ${form.getFieldValue("drug_time4")}` 
        try {
            const result =  await axios.post(url,data, config);
            if (result.status){
                mess = `Đăng ký thành công ${data.prescription_drug_name}`;
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
        return "";
    }

    return (
        <Form
            labelCol={{ span: 8 }}
            labelAlign="left"
            onFinish={formFinish}
            form={form}
        >
            <Form.Item
                name="search"
                label="Tìm kiếm thuốc"
            >
                <Input disabled={loading} onChange={() => {handleSearch(form.getFieldValue("search"))}}></Input>
            </Form.Item>
            <Form.Item
            name="prescription_drug_name"
            label="Tên thuốc"
            hasFeedback
            rules={[
                { required: true, message: 'Vui lòng chọn thuốc' }
                
            ]}>
                <Select disabled={loading}>
                    { search.map((element) => {
                       return (
                                <Option key={element.drug_id} 
                                value={element.drug_name}
                                >
                                <Button  onClick={()=> {validate(element.drug_id);}}>{element.drug_name}</Button>
                                
                                </Option>
                        )
                    })
                    }
                </Select>
                
            </Form.Item> 
            <Form.Item
                    name="drug_dosage_form"
                    label="Dạng thuốc"
                >
                    <Input disabled={loading}></Input>
                </Form.Item>
                <Form.Item
                    name="drug_unit"
                    label="Đơn vị"
                >
                    <Input disabled={loading}></Input>
                </Form.Item>
                <Form.Item
                    name="drug_route"
                    label="Đường dùng"
                >
                    <Input disabled={loading} ></Input>
                </Form.Item>
                <Form.Item
                    name="drug_instruction"
                    label="Cách dùng"
                >
                    <Input disabled={loading}></Input>
                </Form.Item>
                <Form.Item
                    name="drug_numbers"
                    label="Số viên"
                >
                    <Input disabled={loading}></Input>
                </Form.Item>
                <Form.Item
                    name="drug_time1"
                    label="Lần uống mỗi ngày"
                >
                    <Select disabled={loading} >
                        <Option value={1}>1 lần</Option>
                        <Option value={2}>2 lần</Option>
                        <Option value={3}>3 lần</Option>
                        <Option value={4}>4 lần</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="drug_time2"
                    label="Mỗi lần uống (viên)"
                >
                    <Input  disabled={loading}></Input>
                </Form.Item>
                <Form.Item
                    name="drug_time3"
                    label="Uống vào buổi"
                >
                    <Checkbox.Group options={options} onChange={onChange} ></Checkbox.Group>
                </Form.Item>
                <Form.Item
                    name="drug_time4"
                    label="Uống trước/sau khi ăn"
                >
                     <Select disabled={loading}>
                        <Option value="Trước khi ăn 15 phút">Trước khi ăn 15 phút</Option>
                        <Option value="Trước khi ăn 30 phút">Trước khi ăn 30 phút</Option>
                        <Option value="Trước khi ăn 1 giờ">Trước khi ăn 1 giờ</Option>
                        <Option value="Sau khi ăn 15 phút">Sau khi ăn 15 phút</Option>
                        <Option value="Sau khi ăn 30 phút">Sau khi ăn 30 phút</Option>
                        <Option value="Sau khi ăn 1 giờ">Sau khi ăn 1 giờ</Option>
                    </Select>
                </Form.Item>
            <Form.Item wrapperCol={{ offset: 8 }}>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Thêm thuốc
                </Button>
            </Form.Item>
        </Form>
    );
};
