import { Tabs, Layout, Typography, Card, Row, Col, Avatar, Divider, Space, Button, message } from 'antd';
import { UserOutlined, HeartOutlined, EditOutlined, DashboardOutlined, ArrowLeftOutlined, HomeOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import UserProfile from '../components/UserComponents/UserProfile';
import FavoritesSection from '../components/UserComponents/FavoritesSection';
import UserInformation from '../components/UserComponents/UserInformation';
import { useAuth } from '../contexts/AuthContext.jsx';

const { Content, Header } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// Function to create account page with different tabs, like dashboard, favorite products + brands, and to update information.
const AccountPage = ({ user }) => {
    const [currentUser, setCurrentUser] = useState(user || {});
    const navigate = useNavigate();
    const { signOut } = useAuth();

    // Handle Updates
    const handleUpdate = (updateInfo) => {
        console.log('Updated user info', updateInfo);
        setCurrentUser(prevUser => ({
            ...prevUser,
            ...updateInfo
        }));
        message.success('User information updated successfully!');
    };

    // Handle logout
    const handleLogout = async () => {
        try {
            const result = await signOut();
            if (result.error) {
                message.error(`Logout failed: ${result.error.message}`);
            } else {
                message.success('Successfully logged out!');
                navigate('/');
            }
        } catch (error) {
            message.error('An error occurred during logout');
            console.error('Logout error:', error);
        }
    };

    return (
        <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
            {/* Navigation Header */}
            <Header
                style={{
                    background: '#fff',
                    padding: '0 24px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    borderBottom: '1px solid #f0f0f0'
                }}
            >
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: '100%'
                }}>
                    {/* Logo Section */}
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <Space align="center">
                            <Title
                                level={3}
                                style={{
                                    margin: 0,
                                    color: 'black',
                                    background: 'transparent'
                                }}
                            >
                                ETHOS
                            </Title>
                        </Space>
                    </Link>

                    {/* Navigation Buttons */}
                    <Space>
                        <Link to="/">
                            <Button type="default" icon={<HomeOutlined />}>
                                Home
                            </Button>
                        </Link>
                        <Link to="/categories">
                            <Button type="default" icon={<ArrowLeftOutlined />}>
                                Back to Browse
                            </Button>
                        </Link>
                        <Button
                            type="default"
                            icon={<LogoutOutlined />}
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    </Space>
                </div>
            </Header>

            <Content style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header Section */}
                <Card
                    style={{
                        marginBottom: '24px',
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                >
                    <Row align="middle" gutter={[24, 24]}>
                        <Col>
                            <Avatar
                                size={80}
                                icon={<UserOutlined />}
                                style={{
                                    backgroundColor: '#1890ff',
                                    fontSize: '32px'
                                }}
                            />
                        </Col>
                        <Col flex="auto">
                            <Title level={2} style={{ margin: 0, color: '#262626' }}>
                                Welcome back, {currentUser?.name || 'User'}!
                            </Title>
                            <Paragraph style={{ margin: '8px 0 0 0', fontSize: '16px', color: '#8c8c8c' }}>
                                Manage your account, view your favorites, and update your information
                            </Paragraph>
                        </Col>
                    </Row>
                </Card>

                {/* User Profile Section */}
                <Card
                    style={{
                        marginBottom: '24px',
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                >
                    <UserProfile user={currentUser} />
                </Card>

                {/* Main Content Tabs */}
                <Card
                    style={{
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                >
                    <Tabs
                        defaultActiveKey="1"
                        type="card"
                        size="large"
                        style={{ margin: '-24px -24px 0 -24px' }}
                        tabBarStyle={{
                            background: '#fafafa',
                            margin: 0,
                            paddingLeft: '24px',
                            paddingRight: '24px'
                        }}
                    >
                        <TabPane
                            tab={
                                <Space>
                                    <DashboardOutlined />
                                    Dashboard
                                </Space>
                            }
                            key="1"
                        >
                            <div style={{ padding: '24px' }}>
                                <Row gutter={[24, 24]}>
                                    <Col span={24}>
                                        <Card
                                            style={{
                                                background: 'blue',
                                                border: 'none',
                                                color: 'white'
                                            }}
                                        >
                                            <Title level={3} style={{ color: 'white', margin: 0 }}>
                                                Account Overview
                                            </Title>
                                            <Paragraph style={{ color: 'rgba(255,255,255,0.8)', margin: '8px 0 0 0' }}>
                                                Welcome to your personal dashboard! Here you can manage all aspects of your ETHOS account.
                                            </Paragraph>
                                        </Card>
                                    </Col>
                                </Row>

                                <Divider />

                                <Row gutter={[16, 16]}>
                                    <Col xs={24} sm={12} md={8}>
                                        <Card size="small" style={{ textAlign: 'center' }}>
                                            <HeartOutlined style={{ fontSize: '24px', color: '#ff4d4f' }} />
                                            <Title level={4} style={{ margin: '8px 0 4px 0' }}>Favorites</Title>
                                            <Text type="secondary">Your saved items</Text>
                                        </Card>
                                    </Col>
                                    <Col xs={24} sm={12} md={8}>
                                        <Card size="small" style={{ textAlign: 'center' }}>
                                            <EditOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
                                            <Title level={4} style={{ margin: '8px 0 4px 0' }}>Profile</Title>
                                            <Text type="secondary">Update your info</Text>
                                        </Card>
                                    </Col>
                                    <Col xs={24} sm={12} md={8}>
                                        <Card size="small" style={{ textAlign: 'center' }}>
                                            <UserOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                                            <Title level={4} style={{ margin: '8px 0 4px 0' }}>Account</Title>
                                            <Text type="secondary">Manage settings</Text>
                                        </Card>
                                    </Col>
                                </Row>
                            </div>
                        </TabPane>

                        <TabPane
                            tab={
                                <Space>
                                    <HeartOutlined />
                                    Favorites
                                </Space>
                            }
                            key="2"
                        >
                            <div style={{ padding: '24px' }}>
                                <FavoritesSection />
                            </div>
                        </TabPane>

                        <TabPane
                            tab={
                                <Space>
                                    <EditOutlined />
                                    Edit Information
                                </Space>
                            }
                            key="3"
                        >
                            <div style={{ padding: '24px' }}>
                                <UserInformation user={currentUser} onUpdate={handleUpdate} />
                            </div>
                        </TabPane>
                    </Tabs>
                </Card>
            </Content>
        </Layout>
    );
};

export default AccountPage;
