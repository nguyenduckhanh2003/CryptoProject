import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Row, Col } from 'antd';

const { Option } = Select;

const EditProfile = () => {
    const [form] = Form.useForm();
    const [data,setData] = useState([]);

    const onFinish = (values) => {
        console.log('Form data submitted: ', values);
    };
    useEffect(() => {
        
    }, []);

    return (
        <Row
            justify="center"
            align="middle"
            style={{ height: '100vh', backgroundColor: '#f0f0f0' }}
        >
            <Col xs={24} sm={24} md={10} lg={8} xl={6} style={{ textAlign: 'center' }}>
                <div style={{display: 'flex', flexDirection: 'column',marginRight: '100px'}}>
                    <img
                        src="https://via.placeholder.com/150"
                        alt="Profile"
                        style={{ borderRadius: '50%', marginBottom: '20px' }}
                    />
                    <h2>User Information</h2>
                    <p>Additional details about the user can go here.</p>
                </div>
            </Col>
            <Col xs={24} sm={24} md={14} lg={10} xl={8}>
                <Form
                    form={form}
                    name="editForm"
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        displayName: '',
                        email: '',
                        gender: '',
                        password: '',
                    }}
                    style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
                >
                    <Form.Item
                        name="displayName"
                        label="Display Name"
                        rules={[{ required: true, message: 'Please input your display name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="gender"
                        label="Gender"
                        rules={[{ required: true, message: 'Please select your gender!' }]}
                    >
                        <Select placeholder="Select your gender">
                            <Option value="male">Male</Option>
                            <Option value="female">Female</Option>
                            <Option value="other">Other</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    );
};

export default EditProfile;
