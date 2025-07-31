import React from 'react';
import { Form, Input, Button, Layout, Typography, Row, Col, Card, message, Modal, Image } from 'antd';
import { UploadOutlined, SendOutlined, ArrowLeftOutlined, CheckCircleOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import Footer from '../components/Footer.jsx';
import NavBar from '../components/NavBar.jsx';
import { brandUploadApi } from '../services/api.jsx';
import '../App.css';
import '../styling/colors.css';
import '../styling/BrandUploadPage.css';
import '../styling/CongratsModal.css';

const { Title, Paragraph } = Typography;
const { Header, Content, Footer: AntFooter } = Layout;

// Function to render the BrandUploadPage with brand name, website, and logo.
const BrandUploadPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const [congratsVisible, setCongratsVisible] = React.useState(false);
    const [submittedBrand, setSubmittedBrand] = React.useState(null);

    const handleBack = () => {
        navigate(-1); // Go back to previous page
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            // Prepare data for API call
            const brandData = {
                brand: values.brandName,
                website: values.website,
                logo: values.imgURL
            };

            // Call the API to upload brand data
            const response = await brandUploadApi.upload(brandData);

            console.log('Brand submission successful:', response);

            // Store the submitted brand data for the congrats modal
            setSubmittedBrand({
                name: values.brandName,
                website: values.website,
                logo_url: values.imgURL
            });

            // Show the congratulatory modal
            setCongratsVisible(true);

            // Reset the form after successful submission
            form.resetFields();
        } catch (error) {
            console.error('Error submitting brand:', error);
            message.error('Failed to submit brand. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleContinue = () => {
        setCongratsVisible(false);
        // Navigate to the brand account page to see the submitted brand
        navigate('/brand-account');
    };

    // Confetti component for the congratulatory modal
    const Confetti = () => (
        <div className="confetti-container">
            <div className="confetti"></div>
            <div className="confetti"></div>
            <div className="confetti"></div>
            <div className="confetti"></div>
            <div className="confetti"></div>
            <div className="confetti"></div>
            <div className="confetti"></div>
            <div className="confetti"></div>
            <div className="confetti"></div>
        </div>
    );

    return (
        <Layout className="brand-upload-layout">
            <Header className="brand-upload-header">
                <Row justify="space-between" align="middle">
                    <Col>
                        <Title level={3} style={{ margin: 0, color: 'var(--heading-text)' }}>ETHOS</Title>
                    </Col>
                    <Col>
                        <NavBar />
                    </Col>
                </Row>
            </Header>

            <Content className="brand-upload-content">
                <Row justify="center">
                    <Col xs={24} sm={20} md={16} lg={12} xl={10}>
                        <Card className="brand-upload-card">
                            <div>
                                <Button
                                    type="text"
                                    icon={<ArrowLeftOutlined />}
                                    onClick={handleBack}
                                    className="back-button"
                                >
                                    Back
                                </Button>
                            </div>

                            <div className="page-header">
                                <Title level={2} className="page-title">
                                    <UploadOutlined className="submit-button-icon" />
                                    Submit Your Brand
                                </Title>
                                <Paragraph className="page-description">
                                    Share your ethical brand with our community and help others discover sustainable choices.
                                </Paragraph>
                            </div>

                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={handleSubmit}
                                size="large"
                                className="brand-upload-form"
                            >
                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Form.Item
                                            label={<span className="form-label">Brand Name</span>}
                                            name="brandName"
                                            rules={[{ required: true, message: 'Please enter the brand name' }]}
                                        >
                                            <Input
                                                placeholder="Enter your brand name"
                                                className="form-input"
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Form.Item
                                            label={<span className="form-label">Brand Website</span>}
                                            name="website"
                                            rules={[
                                                { required: true, message: 'Please enter the website URL' },
                                                { type: 'url', message: 'Please enter a valid URL' }
                                            ]}
                                        >
                                            <Input
                                                placeholder="https://yourbrand.com"
                                                className="form-input"
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>


                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Form.Item
                                            label={<span className="form-label">Logo / Brand Image</span>}
                                            name="imgURL"
                                            rules={[
                                                { required: true, message: 'Please enter the image URL' },
                                                { type: 'url', message: 'Please enter a valid URL' }
                                            ]}
                                        >
                                            <Input
                                                placeholder="https://example.com/your-logo.jpg"
                                                className="form-input"
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item className="submit-button-container">
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        size="large"
                                        icon={<SendOutlined />}
                                        loading={loading}
                                        className="submit-button"
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

            {/* Congratulatory Modal */}
            <Modal
                open={congratsVisible}
                footer={null}
                closable={false}
                width={500}
                className="congrats-modal"
                maskClosable={false}
            >
                <Confetti />
                <CheckCircleOutlined className="success-icon" />
                <Title level={2} className="congrats-title">
                    Brand Submitted Successfully!
                </Title>
                <Paragraph className="congrats-message">
                    Thank you for submitting your brand to ETHOS. Our system is now scraping additional information from your website.
                </Paragraph>

                {submittedBrand && (
                    <div className="brand-preview">
                        <Image
                            src={submittedBrand.logo_url}
                            alt={submittedBrand.name}
                            className="brand-logo-preview"
                            fallback="https://blocks.astratic.com/img/general-img-square.png"
                        />
                        <div className="brand-name-preview">{submittedBrand.name}</div>
                        <div className="brand-website-preview">{submittedBrand.website}</div>
                    </div>
                )}

                <Button
                    type="primary"
                    onClick={handleContinue}
                    className="continue-button"
                    icon={<RightOutlined />}
                >
                    Continue to Dashboard
                </Button>
            </Modal>
        </Layout>
    );
};

export default BrandUploadPage;
