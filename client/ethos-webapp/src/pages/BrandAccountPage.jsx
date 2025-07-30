import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Typography, Card, Row, Col, Space, Button, Tabs, Table, Tag, message, Spin, Modal, Descriptions, Image } from 'antd';
import '../styling/colors.css';
import '../styling/AccountPages.css';
import { HomeOutlined, LogoutOutlined, PlusOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { brandUploadApi } from '../services/api.jsx';

const { Content, Header } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// Function to render the brand account page with brand sumbissions and brand upload page.
const BrandAccountPage = ({ user }) => {
    const navigate = useNavigate();
    const { signOut } = useAuth();
    const [submittedBrands, setSubmittedBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [currentBrand, setCurrentBrand] = useState(null);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Fetch scraped brands when component mounts
    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const brands = await brandUploadApi.getAll();
                // Transform the data to match the table structure
                const formattedBrands = brands.map(brand => ({
                    id: brand.id,
                    name: brand.name,
                    status: 'pending', // Default status for newly submitted brands
                    categories: brand.categories || [],
                    submittedDate: new Date(brand.created_at).toLocaleDateString(),
                    website: brand.website,
                    logo_url: brand.logo_url,
                    description: brand.description,
                    mission: brand.mission
                }));
                setSubmittedBrands(formattedBrands);
            } catch (error) {
                console.error('Error fetching brands:', error);
                message.error('Failed to load submitted brands');
            } finally {
                setLoading(false);
            }
        };

        fetchBrands();
    }, []);

    const handleLogout = async () => {
        try {
            const result = await signOut();
            if (result.error) {
                message.error(`Logout failed: ${result.error.message}`);
                return;
            }
            message.success('Logged out successfully!');
            navigate('/login');
        } catch (error) {
            message.error('An error occurred during logout');
            console.error('Logout error:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'var(--dusty-rose)';
            case 'pending': return 'var(--lavender-gray)';
            case 'rejected': return 'var(--error-color)';
            default: return 'default';
        }
    };

    const columns = [
        {
            title: 'Brand Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <Text strong>{text}</Text>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={getStatusColor(status)}>
                    {status.toUpperCase()}
                </Tag>
            )
        },
        {
            title: 'Categories',
            dataIndex: 'categories',
            key: 'categories',
            render: (categories) => (
                <>
                    {categories.map(category => (
                        <Tag
                            key={category}
                            style={{
                                backgroundColor: 'var(--light-taupe)',
                                color: 'var(--body-text)',
                                border: '1px solid var(--border-color)'
                            }}
                        >
                            {category}
                        </Tag>
                    ))}
                </>
            )
        },
        {
            title: 'Submitted Date',
            dataIndex: 'submittedDate',
            key: 'submittedDate'
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewBrand(record)}
                    >
                        View
                    </Button>
                    <Button
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteConfirm(record)}
                    >
                        Delete
                    </Button>
                </Space>
            )
        }
    ];

    return (
        <Layout className="account-layout">
            {/* Navigation Header */}
            <Header className="account-header">
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
                                    color: 'var(--dusty-rose)',
                                    background: 'transparent',
                                    fontWeight: 800,
                                    letterSpacing: '1.5px'
                                }}
                            >
                                ETHOS
                            </Title>
                            <Text style={{ color: 'var(--body-text)' }}>Brand Portal</Text>
                        </Space>
                    </Link>

                    {/* Navigation Buttons */}
                    <Space>
                        <Link to="/">
                            <Button
                                type="default"
                                icon={<HomeOutlined />}
                                className="account-button-default"
                            >
                                Home
                            </Button>
                        </Link>
                        <Button
                            type="default"
                            icon={<LogoutOutlined />}
                            onClick={handleLogout}
                            className="account-button-default"
                        >
                            Logout
                        </Button>
                    </Space>
                </div>
            </Header>

            <Content className="account-content">
                {/* Welcome Header */}
                <Card
                    className="account-card brand-welcome-card scale-in"
                >
                    <Row align="middle" justify="space-between">
                        <Col>
                            <Title level={2} style={{ margin: 0, color: 'white' }}>
                                Welcome, {user?.name || 'Brand Partner'}!
                            </Title>
                            <Paragraph style={{ margin: '8px 0 0 0', color: 'rgba(255,255,255,0.9)' }}>
                                Manage your brand submissions and track their approval status
                            </Paragraph>
                        </Col>
                        <Col>
                            <Link to="/upload-brand">
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<PlusOutlined />}
                                    className="pulse"
                                    style={{
                                        background: 'white',
                                        borderColor: 'var(--dusty-rose)',
                                        color: 'var(--dusty-rose)'
                                    }}
                                >
                                    Submit New Brand
                                </Button>
                            </Link>
                        </Col>
                    </Row>
                </Card>

                {/* Stats Cards */}
                <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                    <Col xs={24} sm={8}>
                        <Card className="account-card dashboard-card fade-in delay-100">
                            <Title level={2} style={{ color: 'var(--dusty-rose)', margin: '0 0 8px 0' }}>
                                {submittedBrands.filter(b => b.status === 'approved').length}
                            </Title>
                            <Text style={{ color: 'var(--body-text)' }}>Approved Brands</Text>
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card className="account-card dashboard-card fade-in delay-200">
                            <Title level={2} style={{ color: 'var(--lavender-gray)', margin: '0 0 8px 0' }}>
                                {submittedBrands.filter(b => b.status === 'pending').length}
                            </Title>
                            <Text style={{ color: 'var(--body-text)' }}>Pending Review</Text>
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card className="account-card dashboard-card fade-in delay-300">
                            <Title level={2} style={{ color: 'var(--deep-taupe)', margin: '0 0 8px 0' }}>
                                {submittedBrands.length}
                            </Title>
                            <Text style={{ color: 'var(--body-text)' }}>Total Submissions</Text>
                        </Card>
                    </Col>
                </Row>

                {/* Main Content */}
                <Card className="account-card fade-in delay-400">
                    <Tabs defaultActiveKey="1" size="large">
                        <TabPane tab="My Brand Submissions" key="1">
                            <div style={{ marginBottom: '16px' }}>
                                <Row justify="space-between" align="middle">
                                    <Col>
                                        <Title level={4} style={{ margin: 0 }}>
                                            Brand Submissions
                                      </Title>
                                        <Text type="secondary">
                                            Track the status of your submitted brands
                                        </Text>
                                    </Col>
                                    <Col>
                                        <Link to="/upload-brand">
                                            <Button
                                                type="primary"
                                                icon={<PlusOutlined />}
                                                className="slide-in-right delay-200"
                                                style={{
                                                    backgroundColor: 'white',
                                                    borderColor: 'var(--dusty-rose)',
                                                    color: 'var(--dusty-rose)'
                                                }}
                                            >
                                                Submit New Brand
                                            </Button>
                                        </Link>
                                    </Col>
                                </Row>
                            </div>

                            {loading ? (
                                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                    <Spin size="large" />
                                    <p style={{ marginTop: '16px' }}>Loading your submitted brands...</p>
                                </div>
                            ) : (
                                <Table
                                    columns={columns}
                                    dataSource={submittedBrands}
                                    rowKey="id"
                                    pagination={{ pageSize: 10 }}
                                    style={{ marginTop: '16px' }}
                                    locale={{ emptyText: 'No brands submitted yet. Click "Submit New Brand" to get started!' }}
                                />
                            )}

                            {/* View Brand Modal */}
                            <Modal
                                title={currentBrand?.name ? `${currentBrand.name} Details` : "Brand Details"}
                                open={viewModalVisible}
                                onCancel={() => setViewModalVisible(false)}
                                footer={[
                                    <Button key="close" onClick={() => setViewModalVisible(false)}>
                                        Close
                                    </Button>
                                ]}
                                width={700}
                            >
                                {currentBrand && (
                                    <div>
                                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                            <Image
                                                src={currentBrand.logo_url}
                                                alt={currentBrand.name}
                                                style={{ maxHeight: '150px', objectFit: 'contain' }}
                                                fallback="https://blocks.astratic.com/img/general-img-square.png"
                                            />
                                        </div>

                                        <Descriptions bordered column={1}>
                                            <Descriptions.Item label="Brand Name">{currentBrand.name}</Descriptions.Item>
                                            <Descriptions.Item label="Website">
                                                <a href={currentBrand.website} target="_blank" rel="noopener noreferrer">
                                                    {currentBrand.website}
                                                </a>
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Status">
                                                <Tag
                                                    color={getStatusColor(currentBrand.status)}
                                                    style={{ color: currentBrand.status === 'pending' ? 'var(--body-text)' : 'white' }}
                                                >
                                                    {currentBrand.status.toUpperCase()}
                                                </Tag>
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Submitted Date">
                                                {currentBrand.submittedDate}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Categories">
                                                {currentBrand.categories.map(category => (
                                                    <Tag
                                                        key={category}
                                                        style={{
                                                            backgroundColor: 'var(--light-taupe)',
                                                            color: 'var(--body-text)',
                                                            border: '1px solid var(--border-color)'
                                                        }}
                                                    >
                                                        {category}
                                                    </Tag>
                                                ))}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Mission">
                                                {currentBrand.mission || "No mission statement available"}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Description">
                                                {currentBrand.description || "No description available"}
                                            </Descriptions.Item>
                                        </Descriptions>
                                    </div>
                                )}
                            </Modal>

                            {/* Delete Confirmation Modal */}
                            <Modal
                                title="Delete Brand"
                                open={deleteModalVisible}
                                onCancel={() => setDeleteModalVisible(false)}
                                footer={[
                                    <Button
                                        key="cancel"
                                        onClick={() => setDeleteModalVisible(false)}
                                        className="account-button-default"
                                    >
                                        Cancel
                                    </Button>,
                                    <Button
                                        key="delete"
                                        type="primary"
                                        danger
                                        loading={deleteLoading}
                                        onClick={handleDeleteBrand}
                                    >
                                        Delete
                                    </Button>
                                ]}
                            >
                                <p>Are you sure you want to delete the brand "{currentBrand?.name}"? This action cannot be undone.</p>
                            </Modal>
                        </TabPane>

                        <TabPane tab="Guidelines" key="2">
                            <div style={{ padding: '24px 0' }}>
                                <Title level={4}>Brand Submission Guidelines</Title>

                                <Card className="staggered-card" style={{ marginBottom: '16px' }}>
                                    <Title level={5}>✅ What We Look For</Title>
                                    <ul>
                                        <li>Clear commitment to ethical and sustainable practices</li>
                                        <li>Transparent business operations and supply chain</li>
                                        <li>Positive social or environmental impact</li>
                                        <li>Quality products or services</li>
                                        <li>Authentic brand mission and values</li>
                                    </ul>
                                </Card>

                                <Card className="staggered-card" style={{ marginBottom: '16px' }}>
                                    <Title level={5}>📋 Submission Requirements</Title>
                                    <ul>
                                        <li>Complete brand information including name, website, and description</li>
                                        <li>Clear brand mission statement</li>
                                        <li>Appropriate category selection</li>
                                        <li>High-quality brand logo or image</li>
                                        <li>Valid website URL</li>
                                    </ul>

                                    <Title level={5} style={{ marginTop: '16px' }}>Popular Categories</Title>
                                    <div className="categories-container">
                                        <div className="categories-scroll">
                                            {['Beauty', 'Fashion', 'Home Goods', 'Accessories', 'Skincare', 'Wellness', 'Food & Beverage', 'Apparel', 'Footwear', 'Jewelry', 'Sustainable', 'Eco-Friendly', 'Vegan', 'Cruelty-Free', 'Organic', 'Fair Trade', 'Handmade', 'Recycled'].map((category) => (
                                                <div key={category} className="category-item">
                                                    <Tag className="category-tag" style={{ margin: '4px' }}>
                                                        {category}
                                                    </Tag>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="categories-scroll" style={{ marginLeft: '20px' }}>
                                            {['Beauty', 'Fashion', 'Home Goods', 'Accessories', 'Skincare', 'Wellness', 'Food & Beverage', 'Apparel', 'Footwear', 'Jewelry', 'Sustainable', 'Eco-Friendly', 'Vegan', 'Cruelty-Free', 'Organic', 'Fair Trade', 'Handmade', 'Recycled'].map((category) => (
                                                <div key={category} className="category-item">
                                                    <Tag className="category-tag" style={{ margin: '4px' }}>
                                                        {category}
                                                    </Tag>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </Card>

                                <Card className="staggered-card">
                                    <Title level={5}>⏱️ Review Process</Title>
                                    <ul>
                                        <li>Initial review within 3-5 business days</li>
                                        <li>Brands may be contacted for additional information</li>
                                        <li>Approved brands will be featured on the platform</li>
                                        <li>Rejected submissions will receive feedback for improvement</li>
                                    </ul>
                                </Card>
                            </div>
                        </TabPane>
                    </Tabs>
                </Card>
            </Content>
        </Layout>
    );

    // Function to handle viewing a brand's details
    function handleViewBrand(brand) {
        setCurrentBrand(brand);
        setViewModalVisible(true);
    }

    // Function to show delete confirmation modal
    function handleDeleteConfirm(brand) {
        setCurrentBrand(brand);
        setDeleteModalVisible(true);
    }

    // Function to delete a brand
    async function handleDeleteBrand() {
        if (!currentBrand?.id) return;

        setDeleteLoading(true);
        try {
            await brandUploadApi.delete(currentBrand.id);
            message.success(`Brand "${currentBrand.name}" has been deleted successfully`);

            // Remove the deleted brand from the state
            setSubmittedBrands(prevBrands =>
                prevBrands.filter(brand => brand.id !== currentBrand.id)
            );

            setDeleteModalVisible(false);
        } catch (error) {
            console.error('Error deleting brand:', error);
            message.error('Failed to delete brand. Please try again.');
        } finally {
            setDeleteLoading(false);
        }
    }
};

export default BrandAccountPage;
