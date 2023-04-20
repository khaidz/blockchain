import React, {useState } from 'react';
import { Alert, Form, Button, Input} from 'antd';
import axios from 'axios';
import { history } from 'umi';
import {login} from '@/helpers/Auth';
import { DEFAULT_HOST } from '@/host';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [buttonLoading, setButtonLoading] = useState(false);
    const [failed, setFailed] = useState(false);
    const [errormessage, setMessage] = useState();

    // const auth = fetchCurrentUser()

    const handleUsernameInput = (event) => {
        setUsername(event.target.value);
    }
    const handleError = (change) => {
        setMessage(change);
    }
    const handlePasswordInput = (event) => {
        setPassword(event.target.value);
    } 

    const formFinish = async (values) => {
        setButtonLoading(true);
        let result
        try {
            result = await axios({
                method: 'post',
                url: `${DEFAULT_HOST}/auth/login-admin`,
                data: values,
            });
            if (result.data.success) {
                login(result.data.data.token, result.data.data.user);
                if (result.data.data.user.user_role_name === 'Quản trị viên') history.push('/admin');
                return "";
            }
            handleError(result.data.data.message); 
            setButtonLoading(false); 
            setFailed(true);
            return "";
        } catch (error) {
            // console.log(error);
            setButtonLoading(false);
            setFailed(true);
            return "";
        }
    }
  
    return (
        <Form
            name="basic"
            initialValues={{remember: true,}}
            style={{border: true}}
            onFinish={formFinish}
            labelCol={{span: 6}}
            wrapperCol={{span: 18}}
        >
            <Form.Item
                label="Email"
                name="email"
                rules={[
                    {
                        required: true,
                        message: 'Email không được để trống',
                    },
                ]}
            >
                <Input value={username} onChange={handleUsernameInput} />
            </Form.Item>

            <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[
                    {
                        required: true,
                        message: 'Mật khẩu không được để trống',
                    },
                ]}
            >
                <Input.Password value={password} onChange={handlePasswordInput} />
            </Form.Item>

            <Form.Item wrapperCol={{offset: 6, span: 16}}>
                <Button 
                    type="primary"
                    style={{height:'35', width: '15  0px', marginRight: 0}}
                    htmlType='submit'
                    loading={buttonLoading}
                >
                    Đăng nhập
                </Button>
            </Form.Item>
            {failed ? <Alert Alert type='error' message = {errormessage}></Alert> : null}
            
        </Form>
    )
  }

  
export default LoginForm;