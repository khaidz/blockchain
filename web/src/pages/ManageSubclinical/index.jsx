import React, { useState, useEffect } from 'react';
import { Card, Table, Row, Col, Divider, Button, Space, Modal, Tag, message } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import axios from 'axios';
import moment from 'moment';
import { PlusOutlined } from '@ant-design/icons';
import { fetchCurrentUser } from '@/helpers/Auth';
import { DEFAULT_HOST } from '@/host';
import EditSubclinicalForm from './Components/EditSubclinicalForm';
import SubclinicalForm from './Components/SubclinicalForm';

moment.locale('en');

// const { Search } = Input;
// const { Option } = Select;

export default () => {
    const [up, setUp] = useState(false);
    const [formVisible, setFormVisible] = useState(false);
    const [editRow, setEditRow] = useState({});
    const [subclinicalData, setSubclinicalData] = useState([]);
    const [editSubclinical, setEditSubclinical] = useState(false);
    const [tloading, setTloading] = useState(true);
    const user = fetchCurrentUser();
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
    };
    const fetchSubclinical = async () => {
        try {
            setTloading(true);
            const url = `${DEFAULT_HOST}/admin/subclinical`;
            const result = await axios.get(url, config);
            return result.data;
        } catch (error) {
            // console.log(error);
        }
        return '';
    };
    useEffect(() => {
        const f = async () => {
            const subclinical = await fetchSubclinical();
            setSubclinicalData(subclinical);
            setTloading(false);
            return '';
        };
        f();
    }, [editSubclinical, formVisible, up]);

    const handleEditClick = (record) => {
        setEditRow(record);
        setEditSubclinical(true);
    };
    const handleEditIsDeleted = async (Id) => {
        setUp(true);
        const url = `${DEFAULT_HOST}/admin/subclinical-delete/${Id}`;
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
        const url = `${DEFAULT_HOST}/admin/subclinical-active/${Id}`;
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
            title: 'Tên cận lâm sàng',
            key: 'subclinical_name',
            dataIndex: 'subclinical_name',
        },
        {
            title: 'Mô tả',
            key: 'subclinical_description',
            dataIndex: 'subclinical_description',
        },
        {
            title: 'Trạng thái',
            render: (text, record) => {
                if (!record.subclinical_is_deleted) return <Tag color="success">Hoạt động</Tag>;
                return <Tag color="warning">Đã khóa</Tag>;
            },
        },
        {
            title: 'Chỉnh sửa',
            render: (text, record) => {
                if (!record.subclinical_is_deleted)
                    return (
                        <>
                            <Button type="link" onClick={() => handleEditClick(record)}>
                                Xem chi tiết
                            </Button>{' '}
                            <Button
                                type="link"
                                onClick={() => handleEditIsDeleted(record.subclinical_id)}
                            >
                                Khóa
                            </Button>{' '}
                        </>
                    );
                return (
                    <>
                        <Button
                            type="link"
                            onClick={() => handleEditIsActived(record.subclinical_id)}
                        >
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
                             <Option value="number">Mã số tỉnh thành</Option> 
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
                                Thêm cận lâm sàng
                            </Button>
                        </Space>
                    </Col>
                </Row>
                <Divider></Divider>
                <Table
                    loading={tloading}
                    dataSource={subclinicalData}
                    columns={columns}
                    pagination={{ pageSize: 6 }}
                ></Table>
            </Card>
            <Modal
                centered
                title="Thêm cận lâm sàng"
                visible={formVisible}
                footer={null}
                onCancel={() => setFormVisible(false)}
                destroyOnClose
            >
                <SubclinicalForm onCancel={() => setFormVisible(false)} />
            </Modal>
            <Modal
                centered
                title="Chỉnh sửa cận lâm sàng"
                footer={null}
                visible={editSubclinical}
                onCancel={() => setEditSubclinical(false)}
                destroyOnClose
            >
                <EditSubclinicalForm
                    onCancel={() => setEditSubclinical(false)}
                    defaultValue={editRow}
                />
            </Modal>
        </PageContainer>
    );
};
