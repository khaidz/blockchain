import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Select, Upload } from 'antd';
import axios from 'axios';
import { DEFAULT_HOST } from '@/host';
import { fetchCurrentUser } from '@/helpers/Auth';
import { UploadOutlined } from '@ant-design/icons';

const { useForm } = Form;
const Option = Select;

export default ({ mbId }) => {
    const [sData, setSData] = useState([]);
    const [loading, setLoading] = useState(false);
    const user = fetchCurrentUser();
    const [fileList, setFileList] = useState([]);
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
    };
    const [form] = useForm();
    const fetchS = async () => {
        try {
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
            const sub = await fetchS();
            setSData(sub);
            return '';
        };
        f();
    }, []);
    const onChange = ({ fileList: newFileList }) => {
        const imageList = newFileList;
        delete imageList.percent;
        delete imageList.thumbUrl;
        delete imageList.url;
        delete imageList.status;
        setFileList(imageList);
    };

    const formFinish = async (data) => {
        setLoading(true);
        const url = `${DEFAULT_HOST}/physician/subclinical-sheet/medical-bill/${mbId}`;
        let mess;
        const dataUp = data;
        if (fileList !== undefined) {
            dataUp.images = fileList;
        }
        try {
            const result = await axios.post(url, dataUp, config);
            if (result.status) {
                mess = `Đăng ký thành công ${dataUp.name}`;
                setLoading(false);
                message.success(mess);
            } else {
                mess = 'Thất bại';
                setLoading(false);
                message.error(mess);
            }
        } catch (error) {
            mess = 'Thất bại';
            setLoading(false);
            message.error(mess);
        }
        return '';
    };

    return (
        <Form
            labelCol={{ span: 8 }}
            labelAlign="left"
            onFinish={formFinish}
            form={form}
            enctype="multipart/form-data"
            method="POST"
        >
            <Form.Item
                name="name"
                label="Tên cận lâm sàng"
                hasFeedback
                rules={[{ required: true, message: 'Vui lòng chọn dịch vụ cận lâm sàng' }]}
            >
                <Select disabled={loading}>
                    {sData.map((element) => {
                        return (
                            <Option key={element.subclinical_id} value={element.subclinical_name}>
                                {element.subclinical_name}
                            </Option>
                        );
                    })}
                </Select>
            </Form.Item>
            <Form.Item name="results" label="Kết quả cận lâm sàng">
                <Input disabled={loading}></Input>
            </Form.Item>
            <Form.Item
                // name="images"
                label="Hình ảnh kết quả cận lâm sàng"
            >
                <>
                    <Upload
                        action={`${DEFAULT_HOST}/upload`}
                        listType="picture"
                        accept="image/*"
                        fileList={fileList}
                        onChange={onChange}
                    >
                        <Button icon={<UploadOutlined />}>Tải lên</Button>
                    </Upload>
                </>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8 }}>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Thêm cận lâm sàng
                </Button>
            </Form.Item>
        </Form>
    );
};
