import React from 'react';
import { Layout, Row, Col, Typography, Space, Divider } from 'antd';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, TwitterOutlined, FacebookOutlined, LinkedinOutlined } from '@ant-design/icons';

const { Footer: AntFooter } = Layout;
const { Title, Text, Link } = Typography;

// Function to render the footer
const Footer = () => {
     const footerStyle = {
                backgroundColor: '#FFFFFF',
                color: '#000000',
                padding: '40px 50px 20px',
                borderTop: '1px solid #d9d9d9'
            };

            const linkStyle = {
                color: '#000000',
                textDecoration: 'none'
            };

            const sectionTitleStyle = {
                color: '#000000',
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '16px'
            };

    return(
        <AntFooter style={footerStyle}>
            <Row gutter={[32, 32]}>
                {/* Company Info */}
                <Col xs={24} sm={12} md={6}>
                    <Title level={4} style={sectionTitleStyle}>ETHOS</Title>
                    <Text style={{ color: '#000000', fontSize: '14px' }}>
                        Discover ethical brands shaping a better future.
                        We are committed to transparency, conscious choices, and uplifting businesses that put people and the planet first.
                    </Text>
                </Col>

                {/* Quick Links */}
                <Col xs={24} sm={12} md={6}>
                    <Title level={5} style={sectionTitleStyle}>Quick Links</Title>
                    <Space direction="vertical" size="small">
                        <Link href="/" style={linkStyle}>Home</Link>
                        <Link href="/search-brands" style={linkStyle}>Browse Brands</Link>
                        <Link href="/search-products" style={linkStyle}>Browse Products</Link>
                        <Link href="/categories" style={linkStyle}>Categories</Link>
                        <Link href="/account" style={linkStyle}>My Account</Link>
                    </Space>
                </Col>

                {/* Legal */}
                <Col xs={24} sm={12} md={6}>
                    <Title level={5} style={sectionTitleStyle}>Legal</Title>
                    <Space direction="vertical" size="small">
                        <Link href="/privacy" style={linkStyle}>Privacy Policy</Link>
                        <Link href="/terms" style={linkStyle}>Terms of Service</Link>
                        <Link href="/cookies" style={linkStyle}>Cookie Policy</Link>
                    </Space>
                </Col>

                {/* Contact Info */}
                <Col xs={24} sm={12} md={6}>
                    <Title level={5} style={sectionTitleStyle}>Contact</Title>
                    <Space direction="vertical" size="small">
                        <Text style={{ color: '#000000', fontSize: '14px' }}>
                            <MailOutlined style={{ marginRight: '8px' }} />
                            hello@ethos.com
                        </Text>
                        <Text style={{ color: '#000000', fontSize: '14px' }}>
                            <PhoneOutlined style={{ marginRight: '8px' }} />
                            (555) 123-4567
                        </Text>
                        <Text style={{ color: '#000000', fontSize: '14px' }}>
                            <EnvironmentOutlined style={{ marginRight: '8px' }} />
                            San Francisco, CA
                        </Text>
                    </Space>
                </Col>
            </Row>

            <Divider style={{ borderColor: '#d9d9d9', margin: '32px 0 16px' }} />

            {/* Bottom Section */}
            <Row justify="space-between" align="middle">
                <Col>
                    <Text style={{ color: '#000000', fontSize: '14px' }}>
                        © 2025 ETHOS. All rights reserved.
                    </Text>
                </Col>
                <Col>
                    <Space size="large">
                        <Link href="#" style={{ color: '#000000', fontSize: '18px' }}>
                            <TwitterOutlined />
                        </Link>
                        <Link href="#" style={{ color: '#000000', fontSize: '18px' }}>
                            <FacebookOutlined />
                        </Link>
                        <Link href="#" style={{ color: '#000000', fontSize: '18px' }}>
                            <LinkedinOutlined />
                        </Link>
                    </Space>
                </Col>
            </Row>
        </AntFooter>
    )
}

export default Footer;
