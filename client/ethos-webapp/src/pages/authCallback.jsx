import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spin, Typography } from 'antd';
import { useAuth } from '../contexts/AuthContext.jsx';


const { Title } = Typography;


const AuthCallback = () => {
  const navigate = useNavigate();
  const { user, accountType, loading } = useAuth();


  useEffect(() => {
    // Navigation based on the account type
        if (!loading) {
      if (user) {
        const storedAccountType = localStorage.getItem('accountType') || accountType || 'user';

        if (storedAccountType === 'brand') {
          navigate('/brand-account');
        } else {
          navigate('/account');
        }
      } else {
        // If no user, redirect to login
        navigate('/login');
      }
    }
  }, [user, accountType, loading, navigate]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f0f2f5',
      }}
    >
      <Spin size="large" />
      <Title level={4} style={{ marginTop: 16, color: '#666' }}>
        Checking authentication...
      </Title>
    </div>
  );
};

export default AuthCallback;
