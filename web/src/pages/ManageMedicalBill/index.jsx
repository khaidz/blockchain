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
    // Input,
    // Select,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import axios from 'axios';
import moment from 'moment';
import { PlusOutlined } from '@ant-design/icons';
import {fetchCurrentUser} from '@/helpers/Auth'
import { DEFAULT_HOST } from '@/host';
import EditRoomForm from '../ManageRoom/Components/EditRoomForm';
import RoomForm from '../ManageRoom/Components/RoomForm';

moment.locale('en');

// const { Search } = Input;
// const { Option } = Select;


export default () => {
    const [formVisible, setFormVisible] = useState(false);
    const [editRow, setEditRow] = useState({});
    const [roomData, setRoomData] = useState([]);
    const [editRoom, setEditRoom] = useState(false);
    const [tloading, setTloading] = useState(true);
    const user = fetchCurrentUser();
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchRoom = async () => {
            try {
                setTloading(true);
                const url = `${DEFAULT_HOST}/physician/search-medical-bill?field=medical_bill_physician_id&value=${user.user_id}`;
                const result = await axios.get(url, config);
                return result.data.data;
            } catch (error) {
                // console.log(error);
            }
            return "";
    };
    useEffect(() => {
        const f = async () => {
            const room = await fetchRoom();
            setRoomData(room);
            setTloading(false);
            return "";
        };
        f();
    }, [editRoom, formVisible]);

    const handleEditClick = (record) => {
        setEditRow(record);
        setEditRoom(true);
    }

    

    const columns = [
        {
            title: 'Số thứ tự khám',
            key: 'medical_bill_ordinal_number',
            dataIndex: 'medical_bill_ordinal_number',
        },
        
        {
            title: 'Chỉnh sửa',
            render: (text, record) => {
                    return <Button type="link" onClick={() => handleEditClick(record)}>Chỉnh sửa</Button>;
                   
            },
        },
    ];

    return (
        <PageContainer>
            <Card>
                <Row gutter={1}>
                    <Col span={3}>
                        {/* <Select
                            defaultValue="number"
                            placeholder="Tìm kiếm bằng"
                            style={{ width: '100%' }}
                        >
                             <Option value="number">Tên phòng</Option> 
                            <Option value="name">Tên khoa</Option>
                        </Select> */}
                    </Col>
                    <Col span={8}>
                        {/* <Search
                            placeholder="Nội dung tìm kiếm"
                            allowClear
                            enterButton="Tìm kiếm"
                            size="middle"
                        /> */}
                    </Col>
                    <Col offset={5} span={8}>
                        <Space style={{ float: 'right' }}>
                            <Button
                                type="primary"
                                style={{ float: 'right' }}
                                onClick={() => setFormVisible(true)}
                            >
                                <PlusOutlined />
                                Thêm phòng
                            </Button>
                        </Space>
                    </Col>
                </Row>
                <Divider></Divider>
                <Table loading={tloading} dataSource={roomData} columns={columns} pagination={{pageSize:6}}></Table>
            </Card>
            <Modal
                centered
                title="Thêm phòng"
                visible={formVisible}
                footer={null}
                onCancel={() => setFormVisible(false)}
                destroyOnClose
            >
                <RoomForm onCancel={() => setFormVisible(false)} />
            </Modal>
            <Modal
                centered
                title="Chỉnh sửa phòng"
                footer={null}
                visible={editRoom}
                onCancel={() =>  setEditRoom(false)}
                destroyOnClose
            >
                <EditRoomForm onCancel={() => setEditRoom(false)} defaultValue={editRow} />
            </Modal>
        </PageContainer>
    );
};