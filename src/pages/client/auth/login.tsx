import { App, AutoComplete, Button, Divider, Form, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import './login.scss';
import React, { useState } from 'react';
import type { FormProps } from 'antd';
import { loginAPI } from '@/services/api';
import { useCurrentApp } from '@/components/context/app.context';
import { AutoCompleteProps } from 'antd/lib';

type FieldType = {
    username: string;
    password: string;
};

const LoginPage = () => {

    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);
    const { message, notification } = App.useApp();
    const { setUser, setIsAuthenticated } = useCurrentApp()
    const [options, setOptions] = React.useState<AutoCompleteProps['options']>([]);
    const handleSearch = (value: string) => {
        setOptions(() => {
            if (!value || value.includes('@')) {
                return [];
            }
            return ['gmail.com', 'hdu.edu.vn', 'email.com'].map((domain) => ({
                label: `${value}@${domain}`,
                value: `${value}@${domain}`,
            }));
        });
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { username, password } = values;
        setIsSubmit(true);
        const res = await loginAPI(username, password);
        setIsSubmit(false);
        if (res?.data) {
            setIsAuthenticated(true);
            setUser(res.data.user);
            localStorage.setItem('access_token', res.data.access_token);
            message.success('Đăng nhập tài khoản thành công!');
            navigate('/')
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            })
        }
    };
    return (
        <div className="login-page">
            <main className="main">
                <div className="container">
                    <section className="wrapper">
                        <div className="heading">
                            <h2 className="text text-large">Đăng Nhập</h2>
                            <Divider />
                        </div>
                        <Form
                            name="login-form"
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }} //whole column
                                label="Email"
                                name="username"
                                rules={[
                                    { required: true, message: 'Email không được để trống!' },
                                    { type: "email", message: "Email không đúng định dạng!" }
                                ]}
                            >
                                <AutoComplete
                                    onSearch={handleSearch}
                                    placeholder="Nhập email"
                                    options={options}
                                />
                            </Form.Item>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }} //whole column
                                label="Mật khẩu"
                                name="password"
                                rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                            >
                                <Input.Password

                                    placeholder='Nhập mật khẩu' />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={isSubmit}>
                                    Đăng nhập
                                </Button>
                            </Form.Item>
                            <Divider>Or</Divider>
                            <p className="text text-normal" style={{ textAlign: "center" }}>
                                Chưa có tài khoản ?
                                <span>
                                    <Link to='/register' > Đăng Ký </Link>
                                </span>
                            </p>
                            <br />
                        </Form>
                    </section>
                </div>
            </main>
        </div>
    )
}
export default LoginPage