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
    Image
    // Tag
} from 'antd';
// import { PageContainer } from '@ant-design/pro-layout';
import axios from 'axios';
import moment from 'moment';
import { PlusOutlined } from '@ant-design/icons';
import {fetchCurrentUser} from '@/helpers/Auth'
import { DEFAULT_HOST } from '@/host';
import SubclinicalForm from './SubclinicalForm';

moment.locale('en');

// const { Search } = Input;
// const { Option } = Select;


export default ({mbId}) => {
    const [formVisible, setFormVisible] = useState(false);
    // const [editRow, setEditRow] = useState({});
    const [ssData, setSSData] = useState([]);
    // const [editDrug, setEditDrug] = useState(false);
    const [tloading, setTloading] = useState(true);
    const user = fetchCurrentUser();
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
    };

    const fetchSS = async () => {
            try {
                setTloading(true);
                const url = `${DEFAULT_HOST}/physician/search-subclinical-sheet?field=subclinical_sheet_medical_bill_id&value=${mbId}`;  // prescription`
                const result = await axios.get(url, config);
                return result.data.data;
            } catch (error) {
                
                // console.log(error);
            }
            return "";
    };
    useEffect(() => {
        const f = async () => {
            const drug = await fetchSS();
            setSSData(drug);
            setTloading(false);
            return "";
        };
        f();
    }, [formVisible]);

    const handleDeleteClick = async (record) => {
        try {
            setTloading(true);
            const sId = record.subclinical_sheet_id;
            const url = `${DEFAULT_HOST}/physician/delete-subclinical/${sId}`;  
            const result = await axios.get(url, config);
            if(result.data.success){
                message.success("Đã xóa thành công");
                setTloading(false);
                const f = async () => {
                    const drug = await fetchSS();
                    setSSData(drug);
                    setTloading(false);
                    return "";
                };
                f();
                return "";
            } 
            message.error("Xóa không thành công");
            setTloading(false);
            return "";

        } catch (error) {
            message.error("Xóa không thành công");
            setTloading(false);
            return "";
        }
    }
    const columns = [
        {
            title: 'Tên cận lâm sàng',
            key: 'subclinical_name',
            dataIndex: 'subclinical_name',
        },
        {
            title: 'Kết quả cận lâm sàng',
            key: 'subclinical_sheet_results',
            dataIndex: 'subclinical_sheet_results',
        },
        {
            title: 'Chỉnh sửa',
            render: (text, record) => {
                return <Button type="link" onClick={() => handleDeleteClick(record)}>Xóa</Button> 
               
            },
        },
        {
            title: 'Hình ảnh kết quả',
            render: (text,record) => {
                return (
                    <>{
                        record.subclinical_sheet_images !== undefined ? 
                                record.subclinical_sheet_images.map((element) =>  {
                                     return <Card key={element.uid} style={{margin: 3, float: 'left'}}><Image  src={`${DEFAULT_HOST}/upload/${element.name}`} width={150} height={100} ></Image></Card>
                                    } 
                               ) : <></>
                       
                        }
                    </>
                )
            },
        },
    ];

    return (
        <>
            <Card>
                <Row gutter={1}>
                    <Col span={3}>
                       
                    </Col>
                    <Col span={8}>
                    </Col>
                    <Col offset={5} span={8}>
                        <Space style={{ float: 'right' }}>
                            <Button
                                type="primary"
                                style={{ float: 'right' }}
                                onClick={() => setFormVisible(true)}
                            >
                                <PlusOutlined />
                                Thêm cận lâm sàng
                            </Button>
                        </Space>
                    </Col>
                </Row>
                <Divider></Divider>
                <Table loading={tloading} dataSource={ssData} columns={columns} pagination={{pageSize:6}}></Table>
            </Card>
            <Modal
                centered
                title="Thêm cận lâm sàng"
                visible={formVisible}
                footer={null}
                onCancel={() => setFormVisible(false)}
                destroyOnClose
                width={700}
                style={{width: 700}}
            >
                <SubclinicalForm onCancel={() => setFormVisible(false)} mbId={mbId}/>
            </Modal>
       </>
    );
};