import React, { useState, useEffect } from 'react';
import QrReader from 'react-qr-scanner';
import axios from 'axios';
import { Card, Table, Button, Modal } from 'antd';
import { Alert, Tag } from 'antd';
import { DEFAULT_HOST } from '@/host';
import { fetchCurrentUser } from '@/helpers/Auth';
import MedicalBillForm from './MedicalBillForm';
import Information from './Information';
import moment from 'moment';

// const { TabPane } = Tabs;, Tabs
export default () => {
    const [result, setResult] = useState([]);
    const [check, setCheck] = useState(false);
    const [posting, setPosting] = useState(false);
    const [qr, setQR] = useState(true);
    const [checkQR, setCheckQR] = useState(false);
    const [a, setA] = useState(false);
    const [search, setSearch] = useState(false);
    const [contentVisible, setContentVisible] = useState(false);
    const [users, setUsers] = useState([]);
    const [editModal, setEditModal] = useState(false);
    const [editRow, setEditRow] = useState({});
    const [viewModal, setViewModal] = useState(false);
    const [viewRow, setViewRow] = useState({});
    const user = fetchCurrentUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
    };

    const handleScan = (data) => {
        if (data !== null) {
            handleSearch(data.text)
            setQR(false);
            setPosting(true);
        }
        return '';
    };

    const handleScanUser = (data) => {
        if (data === null) {
            setCheckQR(false);
        } else if (data.text === editRow.medical_bill_patient_id) {
            setCheckQR(true);
        } else {
            setCheckQR(false);
        }
        return '';
    };

    const handleError = (err) => {
        console.log(err)
    }

    const previewStyle = {
        height: 240,
        width: 320,
    };
    const handleSetQR = async () => {
        setQR(true);
        setResult([]);
        setPosting(false);
        return '';
    };

    const handleSearch = async (value) => {
        const url = `${DEFAULT_HOST}/users/search-patient?field=user_id&value=${value}`;
        try {
            const res = await axios.get(url, config);
            if (res.data.success) {
                setUsers(res.data.data);
                const urlS = `${DEFAULT_HOST}/physician/search-health-record?field=health_record_patient_id&value=${res.data.data[0].user_id}`;
                const result2 = await axios.get(urlS, config);
                if (result2.data.success) {
                    const urlM = `${DEFAULT_HOST}/physician/search-medical-bill?field=medical_bill_health_record_id&value=${result2.data.data[0].health_record_id}`;
                    const result3 = await axios.get(urlM, config);
                    const print = result3.data.data.sort((e, f) => {
                        return (
                            moment(f.medical_bill_created_at) -
                            moment(e.medical_bill_created_at)
                        );
                    });
                    setSearch(print);
                    setA(false);
                    setContentVisible(true);
                    setPosting(false);
                    return '';
                }
            }
            setA(true);
            setContentVisible(true);
            setPosting(false);
            return '';
        } catch (error) {
            setA(true);
            setContentVisible(true);
            setPosting(false);
            return '';
        }
    };
    
    const handleEditClick = (record) => {
        setEditRow(record);
        setEditModal(true);
        setCheck(true);
        return '';
    };
    const handleViewClick = (record) => {
        setViewRow(record);
        setViewModal(true);
        setCheck(true);
        return '';
    };
    const columns = [
        {
            title: 'ID phiếu khám',
            dataIndex: 'medical_bill_id',
            key: 'medical_bill_id',
            ellipsis: true,
        },
        {
            title: 'Tên bệnh nhân',
            dataIndex: 'medical_bill_patient_name',
            key: 'medical_bill_patient_name',
            ellipsis: true,
        },
        {
            title: 'Ngày khám',
            dataIndex: 'medical_bill_created_at',
            key: 'medical_bill_created_at',
            ellipsis: true,
        },
        {
            title: 'Bác sĩ khám',
            dataIndex: 'medical_bill_physician_name',
            key: 'medical_bill_physician_name',
            ellipsis: true,
        },
        {
            title: 'Trạng thái',
            render: (text, record) => {
                if (record.medical_bill_is_completed) return <Tag color="cyan">Đã hoàn thành</Tag>;
                return <Tag color="cyan">Chưa hoàn thành</Tag>;
            },
        },
        {
            title: 'Thao tác',
            render: (text, record) => {
                if (!record.medical_bill_is_completed)
                    return (
                        <Button type="link" onClick={() => handleEditClick(record)}>
                            Xem chi tiết
                        </Button>
                    );
                return (
                    <Button type="link" onClick={() => handleViewClick(record)}>
                        Xem phiếu khám
                    </Button>
                );
            },
        },
    ];
    return (
        <>
            <Card>
                {!qr ? (
                    <Button onClick={handleSetQR}>Quét lại</Button>
                ) : (
                    <QrReader
                        delay={10}
                        style={previewStyle}
                        onScan={handleScan}
                        onError={handleError}
                        disabled={posting}
                    />
                )}
            </Card>
            {contentVisible ? (
                <>
                    {a ? (
                        <Card>
                            <Alert showIcon message="Không tìm thấy!"></Alert>
                        </Card>
                    ) : (
                        <>
                            <Card>
                                <Table columns={columns} dataSource={search}></Table>
                            </Card>

                            {checkQR ? (
                                <Modal
                                    visible={editModal}
                                    footer={null}
                                    onCancel={() => {
                                        setEditModal(false);
                                        setCheckQR(false);
                                        setCheck(true);
                                    }}
                                    // handleSearch(result.text)
                                    title="Cập nhật phiếu khám"
                                    destroyOnClose
                                    centered
                                    width={1500}
                                >
                                    <MedicalBillForm mbValue={editRow} />
                                </Modal>
                            ) : (
                                <Modal
                                    visible={editModal}
                                    footer={null}
                                    title="Cập nhật phiếu khám"
                                    onCancel={() => {
                                        setEditModal(false);
                                        setCheckQR(false);
                                        setCheck(true);
                                    }}
                                    destroyOnClose
                                    centered
                                >
                                    <QrReader
                                        delay={10}
                                        style={previewStyle}
                                        onScan={handleScanUser}
                                        onError={handleError}
                                    />
                                    <Alert
                                        showIcon
                                        message="Vui lòng cung cấp mã QR của bệnh nhân!"
                                    ></Alert>
                                </Modal>
                            )}

                            <Modal
                                visible={viewModal}
                                footer={null}
                                onCancel={() => {
                                    setViewModal(false);
                                    setCheck(true);
                                }}
                                title="Xem phiếu khám"
                                destroyOnClose
                                centered
                                width={1000}
                            >
                                <Information mbValue={viewRow} />
                            </Modal>
                        </>
                    )}
                </>
            ) : null}
        </>
    );
};
