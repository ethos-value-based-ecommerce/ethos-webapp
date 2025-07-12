import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spin, Typography } from 'antd';
import { useAuth } from '../contexts/AuthContext.jsx';


const { Title } = Typography;


const AuthCallback = () => {
 const navigate = useNavigate();
 const { user, accountType, loading } = useAuth();


 useEffect(() => {
   const handleAuthCallback = async () => {
     // Wait for auth state to be determined
     if (!loading) {
       if (user) {
         // Get the stored account type
         const storedAccountType = localStorage.getItem('accountType') || accountType || 'user';

         // Navigate based on account type
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
   };


   // Small delay to ensure auth state is properly set
   const timer = setTimeout(handleAuthCallback, 1000);

   return () => clearTimeout(timer);
 }, [user, accountType, loading, navigate]);


 return (
   <div
     style={{
       position: "fixed",
       top: 0,
       left: 0,
       width: "100vw",
       height: "100vh",
       display: "flex",
       flexDirection: "column",
       justifyContent: "center",
       alignItems: "center",
       background: "#f0f2f5",
     }}
   >
     <Spin size="large" />
     <Title level={4} style={{ marginTop: 16, color: '#666' }}>
       Completing authentication...
     </Title>
   </div>
 );
};


export default AuthCallback;
