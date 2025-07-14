import React from 'react';
import { Modal, Button, Typography, Space } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const AuthPromptModal = ({ isVisible, onClose, onContinueAsGuest }) => {
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    onClose();
    navigate('/login');
  };

  const handleContinueAsGuest = () => {
    onContinueAsGuest();
    onClose();
  };

  return (
    <Modal
      title="Sign In Required"
      open={isVisible}
      onCancel={onClose}
      footer={null}
      centered
      width={400}
    >
      <div style={{ textAlign: 'center', padding: '1rem 0' }}>
        <Title level={4} style={{ marginBottom: '1rem' }}>
          Take the Quiz to Discover Your Values
        </Title>
        <Paragraph style={{ marginBottom: '2rem', color: '#666' }}>
          Sign in to save your quiz results and get personalized recommendations, or continue as a guest.
        </Paragraph>

        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Button
            type="primary"
            size="large"
            block
            onClick={handleGoToLogin}
            style={{
              height: '48px',
              fontSize: '16px'
            }}
          >
            Go to Login Page
          </Button>

          <Button
            size="large"
            block
            onClick={handleContinueAsGuest}
            style={{
              height: '48px',
              fontSize: '16px'
            }}
          >
            Continue as Guest
          </Button>
        </Space>

        <Paragraph style={{ marginTop: '1.5rem', fontSize: '12px', color: '#999' }}>
          Guest users won't have their quiz results saved
        </Paragraph>
      </div>
    </Modal>
  );
};

export default AuthPromptModal;
