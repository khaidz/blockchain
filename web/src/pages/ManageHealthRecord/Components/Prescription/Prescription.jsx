import React, { useState, useEffect } from 'react';
import {
    Card,
    Table,
    Row,
    Col,
    Divider,
    Button,
    Space,
    Modal,
    message,
    // Tag
} from 'antd';
// import { PageContainer } from '@ant-design/pro-layout';
import axios from 'axios';
import moment from 'moment';
import { PlusOutlined } from '@ant-design/icons';
import { fetchCurrentUser } from '@/helpers/Auth';
import { DEFAULT_HOST } from '@/host';
// import EditDrugForm from './EditDrugForm';
import DrugForm from './DrugForm';

moment.locale('en');

// const { Search } = Input;
// const { Option } = Select;

export default ({ mbId }) => {
    const [formVisible, setFormVisible] = useState(false);
    // const [editRow, setEditRow] = useState({});
    const [drugData, setDrugData] = useState([]);
    // const [editDrug, setEditDrug] = useState(false);
    const [tloading, setTloading] = useState(true);
    const user = fetchCurrentUser();
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
    };

    const fetchDrug = async () => {
        try {
            setTloading(true);
            const url = `${DEFAULT_HOST}/physician/search-prescription?field=prescription_medical_bill_id&value=${mbId}`; // prescription`
            const result = await axios.get(url, config);
            return result.data.data;
        } catch (error) {
            // console.log(error);
        }
        return '';
    };
    useEffect(() => {
        const f = async () => {
            const drug = await fetchDrug();
            setDrugData(drug);
            setTloading(false);
            return '';
        };
        f();
    }, [formVisible]);

    const handleDeleteClick = async (record) => {
        try {
            setTloading(true);
            const pId = record.prescription_id;
            const url = `${DEFAULT_HOST}/physician/delete/${pId}`;
            const result = await axios.get(url, config);
            if (result.data.success) {
                message.success('Đã xóa thành công');
                setTloading(false);
                const f = async () => {
                    const drug = await fetchDrug();
                    setDrugData(drug);
                    setTloading(false);
                    return '';
                };
                f();
                return '';
            }
            message.error('Xóa không thành công');
            setTloading(false);
            return '';
        } catch (error) {
            message.error('Xóa không thành công');
            setTloading(false);
            return '';
        }
    };
    const columns = [
        {
            title: 'Tên thuốc',
            key: 'prescription_drug_name',
            dataIndex: 'prescription_drug_name',
        },
        {
            title: 'Dạng thuốc',
            key: 'prescription_drug_dosage_form',
            dataIndex: 'prescription_drug_dosage_form',
        },
        {
            title: 'Đơn vị thuốc',
            key: 'prescription_drug_unit',
            dataIndex: 'prescription_drug_unit',
        },
        {
            title: 'Đường dùng',
            key: 'prescription_drug_route',
            dataIndex: 'prescription_drug_route',
        },
        {
            title: 'Cách dùng thuốc',
            key: 'prescription_drug_instruction',
            dataIndex: 'prescription_drug_instruction',
        },
        {
            title: 'Số lượng thuốc',
            key: 'drug_numbers',
            dataIndex: 'drug_numbers',
        },
        {
            title: 'Chỉ định của bác sĩ',
            key: 'prescription_doctor_instruction',
            dataIndex: 'prescription_doctor_instruction',
        },
        {
            title: 'Chỉnh sửa',
            render: (text, record) => {
                return (
                    <Button type="link" onClick={() => handleDeleteClick(record)}>
                        Xóa
                    </Button>
                );
            },
        },
    ];

    return (
        <>
            <Card>
                <Row gutter={1}>
                    <Col span={3}></Col>
                    <Col span={8}></Col>
                    <Col offset={5} span={8}>
                        <Space style={{ float: 'right' }}>
                            <Button
                                type="primary"
                                style={{ float: 'right' }}
                                onClick={() => setFormVisible(true)}
                            >
                                <PlusOutlined />
                                Thêm thuốc
                            </Button>
                        </Space>
                    </Col>
                </Row>
                <Divider></Divider>
                <Table
                    loading={tloading}
                    dataSource={drugData}
                    columns={columns}
                    pagination={{ pageSize: 6 }}
                ></Table>
            </Card>
            <Modal
                centered
                title="Thêm thuốc"
                visible={formVisible}
                footer={null}
                onCancel={() => setFormVisible(false)}
                destroyOnClose
            >
                <DrugForm onCancel={() => setFormVisible(false)} mbId={mbId} />
            </Modal>
            {/* <Modal
                centered
                title="Chỉnh sửa thuốc"
                footer={null}
                visible={editDrug}
                onCancel={() =>  setEditDrug(false)}
                destroyOnClose
            >
                <EditDrugForm onCancel={() => setEditDrug(false)} defaultValue={editRow} />
            </Modal> */}
        </>
    );
};
