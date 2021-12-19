import React, {useState} from 'react';
import axios from 'axios';
import { Button, Form, message, Card} from 'antd';
import {Input} from 'antd';
import { DEFAULT_HOST } from '@/host';
import { fetchCurrentUser } from '@/helpers/Auth';


export default () => {
    const user = fetchCurrentUser();
    const [password, setPassword] = useState();
    const [form] = Form.useForm();
    const [posting, setPosting] = useState(false);
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`,

        }
    }
    const handleFormFinish = async (value) => {
        setPosting(true);
        const url = `${DEFAULT_HOST}/users/me/changePassword`;
        try {
            const result = await axios.post(url, value, config);
            if (result.data.success) { setPosting(false); message.success("Thành công!")}
            else {
                setPosting(false); message.error(result.data.message)
            }
        } catch (error) {
            setPosting(false);
            message.error("Thất bại!")
        }
        return "";
    };
    return (
        <Card>
        <Form labelCol={{ span: 8 }} wrapperCol={{ span: 8 }} onFinish={handleFormFinish}
        form={form}>
            <Form.Item label="Mật khẩu cũ" name="oldPass"
                rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu cũ' },
                ]}
            > 
                <Input type="password" disable={posting}></Input>
            </Form.Item>
            <Form.Item label="Mật khẩu mới" name='user_password' 
            rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu mới' },
            ]}>
                <Input type="password" onChange={(e) => setPassword(e.target.value)} disable={posting}></Input>
            </Form.Item>
            <Form.Item
                name='repassword'
                hasFeedback
                label="Nhập lại mật khẩu mới"
                rules={[
                    {
                        validator: async (rule, value) => {
                            if (value !== password) throw Error ('Mật khẩu không khớp');
                        },
                    },
                    { required: true, message: 'Vui lòng xác nhận lại mật khẩu' },
                ]}
            >
                <Input type="password" disable={posting}></Input>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8 }}>
                <Button htmlType="submit" type="primary" disable={posting}>
                    Đổi mật khẩu
                </Button>
            </Form.Item>
        </Form>
        </Card>
    );
}