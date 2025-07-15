import { Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuth } from '../contexts/AuthContext.jsx';


const ProtectedRoute = ({ children, requiredRole }) => {
 const { user, loading, accountType } = useAuth();


 // Show loading spinner while authentication state is being determined
 if (loading) {
   return (
     <div
       style={{
         position: "fixed",
         top: 0,
         left: 0,
         width: "100vw",
         height: "100vh",
         display: "flex",
         justifyContent: "center",
         alignItems: "center",
         background: "#f0f2f5",
       }}
     >
       <Spin size="large" />
     </div>
   );
 }


 // Redirect to login if not authenticated
 if (!user) {
   return <Navigate to="/login" replace />;
 }

 if (requiredRole && accountType !== requiredRole) {
    return <Navigate to={accountType === "brand" ? "/brand-account" : "/account"} />;
  }



 return children;
};

export default ProtectedRoute;
