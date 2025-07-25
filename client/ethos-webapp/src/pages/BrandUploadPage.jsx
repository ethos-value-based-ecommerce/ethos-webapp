import React, {useState} from 'react';
import { Form, Input, Button, Select, Layout, Typography, Row, Col, Card } from 'antd';
import { UploadOutlined, SendOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import Footer from '../components/Footer.jsx';
import NavBar from '../components/NavBar.jsx';
import '../App.css';

const { TextArea } = Input;
const { Option } = Select;
const { Title, Paragraph } = Typography;
const { Header, Content, Footer: AntFooter } = Layout;

// Function to render the BrandUploadPage with image, descriptions, and categories.
const BrandUploadPage = ({ categories }) => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1); // Go back to previous page
    };

    const handleSubmit = async (values) => {
        // TO DO: Add code to submit brand data to backend
        try {
            console.log('Brand submission data:', values);
            // Reset the form after successful submission
            form.resetFields();

        } catch (error) {
            console.error('Error submitting brand:', error);

        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ background: '#fff', padding: '0 2rem' }}>
                <Row justify="space-between" align="middle">
                    <Col>
                        <Title level={3} style={{ margin: 0, color: '#000' }}>ETHOS</Title>
                    </Col>
                    <Col>
                        <NavBar />
                    </Col>
                </Row>
            </Header>

            <Content style={{ padding: '2rem', background: '#f5f5f5' }}>
                <Row justify="center">
                    <Col xs={24} sm={20} md={16} lg={12} xl={10}>
                        <Card
                            style={{
                                borderRadius: '12px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                border: 'none'
                            }}
                        >
                            <div style={{ marginBottom: '1rem' }}>
                                <Button
                                    type="text"
                                    icon={<ArrowLeftOutlined />}
                                    onClick={handleBack}
                                    style={{
                                        padding: '4px 8px',
                                        fontSize: '14px',
                                        color: '#666'
                                    }}
                                >
                                    Back
                                </Button>
                            </div>

                            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                <Title level={2} style={{ color: '#1890ff', marginBottom: '0.5rem' }}>
                                    <UploadOutlined style={{ marginRight: '0.5rem' }} />
                                    Submit Your Brand
                                </Title>
                                <Paragraph style={{ color: '#666', fontSize: '16px' }}>
                                    Share your ethical brand with our community and help others discover sustainable choices.
                                </Paragraph>
                            </div>

                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={handleSubmit}
                                size="large"
                                style={{ marginTop: '1rem' }}
                            >
                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Form.Item
                                            label={<span style={{ fontWeight: '600' }}>Brand Name</span>}
                                            name="brandName"
                                            rules={[{ required: true, message: 'Please enter the brand name' }]}
                                        >
                                            <Input
                                                placeholder="Enter your brand name"
                                                style={{ borderRadius: '8px' }}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Form.Item
                                            label={<span style={{ fontWeight: '600' }}>Brand Website</span>}
                                            name="website"
                                            rules={[
                                                { required: true, message: 'Please enter the website URL' },
                                                { type: 'url', message: 'Please enter a valid URL' }
                                            ]}
                                        >
                                            <Input
                                                placeholder="https://yourbrand.com"
                                                style={{ borderRadius: '8px' }}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Form.Item
                                            label={<span style={{ fontWeight: '600' }}>Brand Description</span>}
                                            name="description"
                                            rules={[{ required: true, message: 'Please enter a brand description' }]}
                                        >
                                            <TextArea
                                                rows={4}
                                                placeholder="Tell us about your brand, what makes it special, and what products or services you offer..."
                                                style={{ borderRadius: '8px' }}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Form.Item
                                            label={<span style={{ fontWeight: '600' }}>Brand Mission</span>}
                                            name="mission"
                                            rules={[{ required: true, message: 'Please enter your brand mission' }]}
                                        >
                                            <TextArea
                                                rows={4}
                                                placeholder="What is your brand's mission? How do you contribute to sustainability and ethical practices?"
                                                style={{ borderRadius: '8px' }}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Form.Item
                                            label={<span style={{ fontWeight: '600' }}>Categories</span>}
                                            name="category"
                                            rules={[{ required: true, message: 'Please select at least one category' }]}
                                        >
                                            <Select
                                                mode="multiple"
                                                placeholder="Select categories that best describe your brand"
                                                style={{ borderRadius: '8px' }}
                                                maxTagCount="responsive"
                                            >
                                                {categories && categories.map(category => (
                                                    <Option key={category} value={category}>
                                                        {category}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Form.Item
                                            label={<span style={{ fontWeight: '600' }}>Logo / Brand Image</span>}
                                            name="imgURL"
                                            rules={[
                                                { required: true, message: 'Please enter the image URL' },
                                                { type: 'url', message: 'Please enter a valid URL' }
                                            ]}
                                        >
                                            <Input
                                                placeholder="https://example.com/your-logo.jpg"
                                                style={{ borderRadius: '8px' }}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item style={{ textAlign: 'center', marginTop: '2rem' }}>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        size="large"
                                        icon={<SendOutlined />}
                                        style={{
                                            borderRadius: '8px',
                                            height: '48px',
                                            minWidth: '200px',
                                            fontSize: '16px',
                                            fontWeight: '600'
                                        }}
                                    >
                                        Submit Brand
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Content>

            <AntFooter style={{ padding: 0 }}>
                <Footer />
            </AntFooter>
        </Layout>
    );
};

export default BrandUploadPage;
