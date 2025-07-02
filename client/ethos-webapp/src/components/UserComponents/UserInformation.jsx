import { Form, Input, Button, Card, Row, Col, Typography } from 'antd';
import { UserOutlined, MailOutlined, SaveOutlined } from '@ant-design/icons';
import { useEffect } from 'react';

const { Title } = Typography;

// Function to handle the user information updates like name and email changes
const UserInfoForm = ({ user, onUpdate }) => {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        onUpdate(values);
    };

    return (
        <Card
            title={
                <Title level={4} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UserOutlined />
                    Account Information
                </Title>
            }
            size="small"
            style={{ maxWidth: '600px' }}
        >
            <Form
                form={form}
                initialValues={user}
                onFinish={onFinish}
                layout="vertical"
                size="middle"
            >
                <Row gutter={[16, 0]}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please enter your name' }]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="Enter your full name"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: 'Please enter your email' },
                                { type: 'email', message: 'Please enter a valid email' }
                            ]}
                        >
                            <Input
                                prefix={<MailOutlined />}
                                placeholder="Enter your email address"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item style={{ marginTop: '16px', marginBottom: 0 }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        icon={<SaveOutlined />}
                        size="middle"
                    >
                        Update Information
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default UserInfoForm;
