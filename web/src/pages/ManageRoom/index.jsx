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
    Tag,
    // Input,
    // Select,
    message,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import axios from 'axios';
import moment from 'moment';
import { PlusOutlined } from '@ant-design/icons';
import { fetchCurrentUser } from '@/helpers/Auth';
import { DEFAULT_HOST } from '@/host';
import EditRoomForm from './Components/EditRoomForm';
import RoomForm from './Components/RoomForm';

moment.locale('en');

// const { Search } = Input;
// const { Option } = Select;

export default () => {
    const [up, setUp] = useState(false);
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
            const url = `${DEFAULT_HOST}/admin/room`;
            const result = await axios.get(url, config);
            return result.data;
        } catch (error) {
            // console.log(error);
        }
        return '';
    };
    useEffect(() => {
        const f = async () => {
            const room = await fetchRoom();
            setRoomData(room);
            setTloading(false);
            return '';
        };
        f();
    }, [editRoom, formVisible, up]);

    const handleEditClick = (record) => {
        setEditRow(record);
        setEditRoom(true);
    };

    const handleEditIsDeleted = async (Id) => {
        setUp(true);
        const url = `${DEFAULT_HOST}/admin/room-delete/${Id}`;
        const data = {};
        try {
            const result = await axios.post(url, data, config);
            if (result.data.success) {
                message.success('Đã cập nhật');
                setUp(false);
            } else {
                message.error('Thất bại');
            }
        } catch (error) {
            message.error('Thất bại');
        }
    };

    const handleEditIsActived = async (Id) => {
        setUp(true);
        const url = `${DEFAULT_HOST}/admin/room-active/${Id}`;
        const data = {};
        try {
            const result = await axios.post(url, data, config);
            if (result.data.success) {
                message.success('Đã cập nhật');
                setUp(false);
            } else {
                message.error('Thất bại');
            }
        } catch (error) {
            message.error('Thất bại');
        }
    };

    const columns = [
        {
            title: 'Tên phòng',
            key: 'room_name',
            dataIndex: 'room_name',
        },
        {
            title: 'Số phòng',
            key: 'room_number',
            dataIndex: 'room_number',
        },
        {
            title: 'Khoa',
            key: 'room_department_name',
            dataIndex: 'room_department_name',
        },
        {
            title: 'Mô tả phòng',
            key: 'room_description',
            dataIndex: 'room_description',
        },
        {
            title: 'Trạng thái',
            render: (text, record) => {
                if (!record.room_is_deleted) return <Tag color="success">Hoạt động</Tag>;
                return <Tag color="warning">Đã khóa</Tag>;
            },
        },
        {
            title: 'Chỉnh sửa',
            render: (text, record) => {
                if (!record.room_is_deleted)
                    return (
                        <>
                            <Button type="link" onClick={() => handleEditClick(record)}>
                                Xem chi tiết
                            </Button>{' '}
                            <Button type="link" onClick={() => handleEditIsDeleted(record.room_id)}>
                                Khóa
                            </Button>{' '}
                        </>
                    );
                return (
                    <>
                        <Button type="link" onClick={() => handleEditIsActived(record.room_id)}>
                            Kích hoạt
                        </Button>
                    </>
                );
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
                <Table
                    loading={tloading}
                    dataSource={roomData}
                    columns={columns}
                    pagination={{ pageSize: 6 }}
                ></Table>
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
                onCancel={() => setEditRoom(false)}
                destroyOnClose
            >
                <EditRoomForm onCancel={() => setEditRoom(false)} defaultValue={editRow} />
            </Modal>
        </PageContainer>
    );
};
