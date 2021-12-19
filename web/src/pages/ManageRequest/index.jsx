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
    Tag
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import axios from 'axios';
import moment from 'moment';
import { PlusOutlined } from '@ant-design/icons';
import {fetchCurrentUser} from '@/helpers/Auth'
import { DEFAULT_HOST } from '@/host';
import EditDrugForm from './Components/EditDrugForm';
import DrugForm from './Components/DrugForm';

moment.locale('en');

// const { Search } = Input;
// const { Option } = Select;


export default () => {
    const [formVisible, setFormVisible] = useState(false);
    const [editRow, setEditRow] = useState({});
    const [requestData, setRequestData] = useState([]);
    const [editRequest, setEditRequest] = useState(false);
    const [tloading, setTloading] = useState(true);
    const user = fetchCurrentUser();
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
    };
    let role;
    if (user.user_role_name === 'Bác sĩ') {role = 'physician';} 
    else {role = 'receptionist';}
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchRequest = async () => {
            try {
                setTloading(true);
                const url = `${DEFAULT_HOST}/${role}/search-request?field=request_sender&value=${user.user_id}`;
                const result = await axios.get(url, config);
                return result.data.data;
            } catch (error) {
                // console.log(error);
            }
            return "";
    };
    useEffect(() => {
        const f = async () => {
            const rq = await fetchRequest();
            setRequestData(rq);
            setTloading(false);
            return "";
        };
        f();
    }, [editRequest, formVisible]);

    const handleEditClick = (record) => {
        setEditRow(record);
        setEditRequest(true);
    }
    const columns = [
        {
            title: 'ID',
            key: 'request_id',
            dataIndex: 'request_id',
        },
        {
            title: 'ID ngưởi gửi',
            key: 'request_sender',
            dataIndex: 'request_sender',
        },
        {
            title: 'ID người nhận',
            key: 'request_receiver',
            dataIndex: 'request_receiver',
        },
        {
            title: 'ID xử lý',
            key: 'request_id_process',
            dataIndex: 'request_id_process',
        },
        {
            title: 'Nội dung',
            key: 'request_content',
            dataIndex: 'request_content',
        },
        {
            title: "Trạng thái",
            render: (text, record) => {
                  if (!record.is_deleted)
                    return <Tag color='success'>Tồn tại</Tag>
                    return <Tag color='warning'>Đã khóa</Tag>
                    
                      
            }  
        },
        {
            title: "Trạng thái đợi",
            render: (text, record) => {
                  if (!record.request_wait)
                    return <Tag color='success'>Đã xử lý</Tag>
                    return <Tag color='warning'>Đang đợi</Tag>
                      
            }  
        },
        {
            title: "Kết quả",
            render: (text, record) => {
                  if (!record.request_result)
                      return <Tag color='warning'>Thất bại/Chưa xử lý xong</Tag>
                      return <Tag color='success'>Thành công</Tag>
            }  
        },
        {
            title: 'Chỉnh sửa',
            render: (text, record) => {
                return <Button type="link" onClick={() => handleEditClick(record)}>Hủy</Button>;
            },
        },
    ];

    return (
        <PageContainer>
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
                                Thêm thuốc
                            </Button>
                        </Space>
                    </Col>
                </Row>
                <Divider></Divider>
                <Table loading={tloading} dataSource={requestData} columns={columns} pagination={{pageSize:6}}></Table>
            </Card>
            <Modal
                centered
                title="Thêm thuốc"
                visible={formVisible}
                footer={null}
                onCancel={() => setFormVisible(false)}
                destroyOnClose
            >
                <DrugForm onCancel={() => setFormVisible(false)} />
            </Modal>
            <Modal
                centered
                title="Chỉnh sửa thuốc"
                footer={null}
                visible={editRequest}
                onCancel={() =>  setEditRequest(false)}
                destroyOnClose
            >
                <EditDrugForm onCancel={() => setEditRequest(false)} defaultValue={editRow} />
            </Modal>
        </PageContainer>
    );
};