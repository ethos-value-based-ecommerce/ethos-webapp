import { Tabs, Layout, Typography, Card, Row, Col, Avatar, Divider, Space, Button, message, Modal } from 'antd';
import { UserOutlined, HeartOutlined, GiftOutlined, DashboardOutlined, ArrowLeftOutlined, HomeOutlined, LogoutOutlined, FormOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import FavoritesSection from '../components/UserComponents/FavoritesSection';
import QuizModal from '../components/QuizModal';
import { useAuth } from '../contexts/AuthContext.jsx';
import { supabase } from '../services/supabaseClients.jsx';
import '../styling/colors.css';
import '../styling/AccountPages.css';

const { Title, Text, Paragraph } = Typography;
const { Content, Header } = Layout;

// Function to create account page with different tabs, like dashboard, favorite products + brands, and to update information.
const AccountPage = () => {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    const [currentUser, setCurrentUser] = useState(user || {});

    // Update currentUser when auth user changes
    useEffect(() => {
        if (user) {
            setCurrentUser(user);

            // Fetch user data directly from Supabase
            const fetchUserData = async () => {
                try {
                    console.log('Fetching user data from Supabase...');
                    const { data, error } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', user.id)
                        .single();

                    if (error) {
                        console.error('Error fetching user data:', error);
                    } else if (data) {
                        console.log('User data from Supabase:', data);
                        // Update currentUser with the data from Supabase
                        setCurrentUser(prevUser => ({
                            ...prevUser,
                            profile: data
                        }));
                    }
                } catch (err) {
                    console.error('Error in fetchUserData:', err);
                }
            };

            fetchUserData();
        }
    }, [user]);

    // State for quiz management
    const [hasCompletedQuiz, setHasCompletedQuiz] = useState(false);
    const [showQuizModal, setShowQuizModal] = useState(false);
    const [showConfirmRetakeModal, setShowConfirmRetakeModal] = useState(false);

    // Check if user has completed quiz before (could be stored in localStorage or user profile)
    useEffect(() => {
        const quizCompleted = localStorage.getItem('quizCompleted');
        if (quizCompleted === 'true') {
            setHasCompletedQuiz(true);
        }
    }, []);

    // Handle quiz submission
    const handleQuizSubmit = (answers) => {
        // Process quiz answers (could send to backend, update user preferences, etc.)
        console.log('Quiz answers:', answers);

        // Mark quiz as completed
        setHasCompletedQuiz(true);
        localStorage.setItem('quizCompleted', 'true');

        // Show success message
        message.success('Your preferences have been saved! Viewing recommendations...');

        // Navigate to feed page with recommendations
        navigate('/feed');
    };

    // Handle quiz button click
    const handleQuizButtonClick = () => {
        if (hasCompletedQuiz) {
            // If already completed quiz, show confirmation dialog
            setShowConfirmRetakeModal(true);
        } else {
            // If first time, show quiz directly
            setShowQuizModal(true);
        }
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
        <Layout className="account-layout">
            {/* Navigation Header */}
            <Header className="account-header">
                <Row justify="space-between" align="middle">
                    <Col>
                        <Link to="/">
                            <Title level={3} className="search-page-title">ETHOS</Title>
                        </Link>
                    </Col>

                    <Col>
                        <Space>
                            <Link to="/">
                                <Button
                                    type="default"
                                    icon={<HomeOutlined />}
                                    className="nav-button"
                                >
                                    Home
                                </Button>
                            </Link>
                            <Link to="/categories">
                                <Button
                                    type="default"
                                    icon={<ArrowLeftOutlined />}
                                    className="nav-button"
                                >
                                    Back to Browse
                                </Button>
                            </Link>
                            <Button
                                type="default"
                                icon={<LogoutOutlined />}
                                onClick={handleLogout}
                                className="nav-button"
                            >
                                Logout
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Header>

            <Content className="account-content">
                {/* Header Section */}
                <Card className="account-card account-welcome-card">
                    <Row align="middle" gutter={[24, 24]}>
                        <Col>
                            <Avatar
                                size={80}
                                icon={<UserOutlined />}
                                style={{
                                    backgroundColor: 'var(--dusty-rose)',
                                    fontSize: '32px'
                                }}
                            />
                        </Col>
                        <Col flex="auto">
                            <Title level={2} style={{ margin: 0, color: 'var(--heading-text)' }}>
                                Welcome, User!
                            </Title>
                            <Text style={{ fontSize: '16px', color: 'var(--body-text)' }}>
                                {currentUser?.email}
                            </Text>
                            <Paragraph style={{ margin: '8px 0 0 0', fontSize: '16px', color: 'var(--body-text)' }}>
                                <span style={{ marginTop: '4px', display: 'block' }}>
                                    Manage your account, view your favorites, and view your personalized reccomendations.
                                </span>
                            </Paragraph>
                        </Col>
                    </Row>
                </Card>

                {/* Main Content Tabs */}
                <Card className="account-card">
                    <Tabs
                        defaultActiveKey="1"
                        type="card"
                        size="large"
                        style={{ margin: '-24px -24px 0 -24px' }}
                        tabBarStyle={{
                            background: 'var(--background-secondary)',
                            margin: 0,
                            paddingLeft: '24px',
                            paddingRight: '24px'
                        }}
                        items={[
                            {
                                key: '1',
                                label: (
                                    <Space>
                                        <DashboardOutlined />
                                        Dashboard
                                    </Space>
                                ),
                                children: (
                                    <div style={{ padding: '24px' }}>
                                        <Row gutter={[24, 24]}>
                                            <Col span={24}>
                                                <Card className="account-card-header">
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
                                                <Card size="small" className="dashboard-card" hoverable>
                                                    <HeartOutlined className="dashboard-card-icon dashboard-icon-favorites" />
                                                    <Title level={4} style={{ margin: '8px 0 4px 0' }}>Favorites</Title>
                                                    <Text type="secondary">Your saved items</Text>
                                                </Card>
                                            </Col>
                                            <Col xs={24} sm={12} md={8}>
                                                <Card size="small" className="dashboard-card" hoverable>
                                                    <GiftOutlined className="dashboard-card-icon dashboard-icon-recommendations" />
                                                    <Title level={4} style={{ margin: '8px 0 4px 0' }}>Recommendations</Title>
                                                    <Text type="secondary">View personalized picks</Text>
                                                </Card>
                                            </Col>
                                            <Col xs={24} sm={12} md={8}>
                                                <Card size="small" className="dashboard-card" hoverable>
                                                    <UserOutlined className="dashboard-card-icon dashboard-icon-account" />
                                                    <Title level={4} style={{ margin: '8px 0 4px 0' }}>Account</Title>
                                                    <Text type="secondary">Manage settings</Text>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </div>
                                )
                            },
                            {
                                key: '2',
                                label: (
                                    <Space>
                                        <HeartOutlined />
                                        Favorites
                                    </Space>
                                ),
                                children: (
                                    <div style={{ padding: '24px' }}>
                                        <FavoritesSection />
                                    </div>
                                )
                            },
                            {
                                key: '3',
                                label: (
                                    <Space>
                                        <GiftOutlined />
                                        View Recommendations
                                    </Space>
                                ),
                                children: (
                                    <div style={{ padding: '24px' }}>
                                        <Card className="recommendations-card">
                                            <Title level={3}>Your Personalized Recommendations</Title>
                                            <Paragraph>
                                                Discover brands and products tailored to your preferences and values.
                                            </Paragraph>
                                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                                <Button
                                                    type="primary"
                                                    size="large"
                                                    icon={<GiftOutlined />}
                                                    onClick={() => navigate('/feed')}
                                                    className="account-button-primary"
                                                >
                                                    Explore Recommendations
                                                </Button>

                                                <Divider />

                                                <div>
                                                    <Title level={4}>Preference Quiz</Title>
                                                    <Paragraph>
                                                        {hasCompletedQuiz
                                                            ? "You've already completed the preference quiz. Your recommendations are personalized based on your answers."
                                                            : "Take our quick quiz to help us personalize your recommendations based on your values and preferences."}
                                                    </Paragraph>
                                                    <Button
                                                        type={hasCompletedQuiz ? "default" : "primary"}
                                                        icon={<FormOutlined />}
                                                        onClick={handleQuizButtonClick}
                                                        className={hasCompletedQuiz ? "account-button-default" : "account-button-primary"}
                                                    >
                                                        {hasCompletedQuiz ? "Retake Quiz" : "Take Quiz"}
                                                    </Button>
                                                </div>
                                            </Space>
                                        </Card>
                                    </div>
                                )
                            }
                        ]}
                    />

                </Card>

                {/* Quiz Modal */}
                <QuizModal
                    isOpen={showQuizModal}
                    onClose={() => setShowQuizModal(false)}
                    onSubmit={handleQuizSubmit}
                />

                {/* Confirmation Modal for Retaking Quiz */}
                <Modal
                    title="Retake Quiz?"
                    open={showConfirmRetakeModal}
                    onCancel={() => setShowConfirmRetakeModal(false)}
                    footer={[
                        <Button
                            key="cancel"
                            onClick={() => setShowConfirmRetakeModal(false)}
                            className="account-button-default"
                        >
                            No, Keep Current Preferences
                        </Button>,
                        <Button
                            key="submit"
                            type="primary"
                            onClick={() => {
                                setShowConfirmRetakeModal(false);
                                setShowQuizModal(true);
                            }}
                            className="account-button-primary"
                        >
                            Yes, Retake Quiz
                        </Button>,
                    ]}
                >
                    <p>You've already completed the preference quiz. Retaking the quiz will update your preferences and may change your recommendations.</p>
                    <p>Would you like to continue?</p>
                </Modal>
            </Content>
        </Layout>
    );
};

export default AccountPage;
