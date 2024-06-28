import React, { useState, useEffect } from 'react';
import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import { LockOutlined } from '@ant-design/icons';
import { Form, Input, Button, Typography } from 'antd';

const { Text } = Typography;

const ChangePassForAdevertiser = () => {
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [form] = Form.useForm();
    const { token } = useParams();

    useEffect(() => {
        if (!token) {
            setError('Token not provided');
            return;
        }

        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/v1/auth/email/${token}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }

                });

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const email = await response.text();
                console.log("Fetched email:", email);
                setEmail(email);
            } catch (error) {
                setError(error.message);
                console.error("Error fetching email data:", error);
            }
        };

        fetchData();
    }, [token]);

    const onFinish = async (values) => {
        if (values.newPassword !== values.confirmNewPassword) {
            setError('Mật khẩu mới và xác nhận mật khẩu không khớp!');
            return;
        }

        const payload = {
            oldPassword: values.oldPassword,
            newPassword: values.newPassword,
            confirmNewPassword: values.confirmNewPassword,
            email: email,
            token: token,
        };

        try {
            const response = await fetch('http://localhost:8000/api/v1/auth/change-password', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setSuccess(true);
                setError('');
                form.resetFields();
                window.location.href = '/login';
            } else {
                const data = await response.json(); 
                setError(data.message || 'Failed to change password.');
            }
        } catch (error) {
            console.error(error);
            setError('An error occurred.');
        }
    };

    const validatePassword = (_, value) => {
        if (!value) {
            return Promise.reject(new Error('Vui lòng xác nhận mật khẩu mới!'));
        } else if (value !== form.getFieldValue('newPassword')) {
            return Promise.reject(new Error('Mật khẩu mới và xác nhận mật khẩu không khớp!'));
        } else if (!validatePasswordRegex(value)) {
            return Promise.reject(new Error('Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.'));
        }
        return Promise.resolve();
    };

    const validatePasswordRegex = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    };

    return (
        <div className="container">
            <Form
                form={form}
                name="password_change"
                className="password-change-form"
                initialValues={{ remember: true }}

                onFinish={onFinish}
                style={{
                    maxWidth: '400px',
                    margin: 'auto',
                    padding: '2em',
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
                
            >
                <h2 style={{ textAlign: 'center' }}>Change Password</h2>
                <Form.Item>
                    <Text strong>Email: </Text>
                    <Text>{email}</Text>
                </Form.Item>
                <Form.Item
                    name="oldPassword"
                    rules={[{ required: true, message: 'Please input your old Password!' }]}
                >
                    <Input.Password
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        placeholder="Old Password"
                    />
                </Form.Item>
                <Form.Item
                    name="newPassword"
                    rules={[{ required: true, message: 'Please input your new Password!' }]}
                >
                    <Input.Password
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        placeholder="New Password"
                    />
                </Form.Item>
                <Form.Item
                    name="confirmNewPassword"
                    dependencies={['newPassword']}
                    rules={[
                        { required: true, message: 'Please confirm your new Password!' },
                        { validator: validatePassword }
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        placeholder="Confirm New Password"
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="password-change-form-button" style={{ width: '100%' }}>
                        Change Password
                    </Button>
                </Form.Item>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">Thay đổi mật khẩu thành công!</div>}
            </Form>
        </div>
    );
}

export default ChangePassForAdevertiser;
