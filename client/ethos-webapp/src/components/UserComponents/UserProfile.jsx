import { Avatar, Card, Typography, Row, Col } from 'antd';
import { UserOutlined, MailOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

// Function to create user profile, with avatar, username, and email
const UserProfile = ({ user }) => {
    return (
        <Card
            size="small"
            style={{
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                border: 'none'
            }}
        >
            <Row align="middle" gutter={[16, 16]}>
                <Col>
                    <Avatar
                        size={64}
                        src={user?.avatarUrl}
                        icon={<UserOutlined />}
                        style={{
                            backgroundColor: '#1890ff',
                            border: '3px solid white',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                        }}
                    />
                </Col>
                <Col flex="auto">
                    <Title level={4} style={{ margin: 0, color: '#262626' }}>
                        {user?.name || 'User Name'}
                    </Title>
                    <Text
                        type="secondary"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            marginTop: '4px'
                        }}
                    >
                        <MailOutlined />
                        {user?.email || 'user@example.com'}
                    </Text>
                </Col>
            </Row>
        </Card>
    );
};

export default UserProfile;
