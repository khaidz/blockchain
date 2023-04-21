import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Space, Card, Tag, Typography, Button, Modal } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';
import { fetchCurrentUser } from '@/helpers/Auth';
import { DEFAULT_HOST } from '@/host';
// import ImageQR from '../../ImageQR/index';
import EditForm from './EditForm';

const layout = {
    wrapperCol: {
        span: 16,
    },
    labelCol: {
        span: 8,
    },
};

const buttonCol = {
    wrapperCol: {
        span: 16,
        offset: 8,
    },
};

export default () => {
    const [edit, setEdit] = useState(false);
    const [verifyE, setE] = useState(false);
    const [verifyP, setP] = useState(false);
    // const [qr, setQR] = useState('');
    const [form] = Form.useForm();
    const config = {
        headers: {
            Authorization: `Bearer ${fetchCurrentUser().token}`,
        },
    };
    const url = `${DEFAULT_HOST}/users/profile`;
    useEffect(() => {
        const f = async () => {
            const result = await axios.get(url, config);
            result.data.data.user.user_date_of_birth = moment(
                result.data.data.user.user_date_of_birth,
                'DD-MM-YYYY',
            );
            form.setFieldsValue(result.data.data.user);
            setE(result.data.data.user.user_verified_email);
            setP(result.data.data.user.user_verified_phone);
            // setQR(result.data.data.qr);
            return '';
        };
        f();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form, edit]);

    return (
        <>
            <Card>
                <Form autoComplete="off" labelAlign="left" {...layout} form={form}>
                    <Form.Item name="user_id" label="ID">
                        <Input readOnly></Input>
                    </Form.Item>
                    <Form.Item name="user_fullname" label="Họ và tên">
                        <Input readOnly></Input>
                    </Form.Item>
                    <Form.Item name="user_role_name" label="Vai trò">
                        <Input readOnly></Input>
                    </Form.Item>
                    <Form.Item name="user_phone" label="Số điện thoại">
                        <Input readOnly></Input>
                    </Form.Item>
                    <Form.Item name="user_email" label="Email">
                        <Input readOnly></Input>
                    </Form.Item>
                    <Form.Item name="user_date_of_birth" label="Ngày sinh">
                        <DatePicker disabled={true} readOnly></DatePicker>
                    </Form.Item>
                    <Form.Item name="user_identity_card" label="Số CMND">
                        <Input readOnly></Input>
                    </Form.Item>
                    <Form.Item name="user_job" label="Nghề nghiệp">
                        <Input readOnly></Input>
                    </Form.Item>
                    <Form.Item name="user_workplace" label="Nơi làm việc">
                        <Input readOnly></Input>
                    </Form.Item>
                    <Form.Item name="user_address" label="Địa chỉ">
                        <Input readOnly></Input>
                    </Form.Item>
                    <Form.Item label="Xác thực email">
                        <Space>
                            {verifyE || verifyP ? (
                                <Tag color="success">
                                    <CheckCircleFilled /> Email đã được xác thực
                                </Tag>
                            ) : (
                                <>
                                    <Tag color="warning">Email chưa được xác thực</Tag>
                                    <Typography.Text type="secondary">
                                        * Vui lòng kiểm tra email để xác thực tài khoản
                                    </Typography.Text>
                                </>
                            )}
                        </Space>
                    </Form.Item>
                    {/* <Form.Item label="Mã QR">   
                    <ImageQR src={`${DEFAULT_HOST}/health-record/server/uploads/1638346276571-health-record-IU58PcAVCMElMMlWvTKP51Screenshot_from%202021-11-16%2020-43-40.png`}/>
                </Form.Item> */}
                    <Form.Item {...buttonCol}>
                        <Button
                            style={{ float: 'initial' }}
                            onClick={() => {
                                setEdit(true);
                            }}
                        >
                            Chỉnh sửa
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            <Modal
                centered
                title="Chỉnh sửa thông tin"
                footer={null}
                visible={edit}
                onCancel={() => setEdit(false)}
                destroyOnClose
            >
                <EditForm onCancel={() => setEdit(false)} />
            </Modal>
        </>
    );
};
