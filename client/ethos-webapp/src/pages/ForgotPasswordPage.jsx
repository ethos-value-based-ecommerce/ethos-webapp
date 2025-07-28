import '../App.css';
import '../styling/LoginPages.css';

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, Card, message } from "antd";
import { MailOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useAuth } from "../contexts/AuthContext.jsx";

const { Title, Paragraph, Link } = Typography;

// Function to help render the forgot function page, which allows users to reset passwords.
const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  // Handle reset password
  const handleResetPassword = async (values) => {
    const { email } = values;
    setLoading(true);

    try {
      const result = await resetPassword(email);

      if (result.error) {
        message.error(`Password reset failed: ${result.error.message}`);
      } else {
        setEmailSent(true);
        message.success('Password reset email sent! Please check your inbox.');
      }
    } catch (error) {
      message.error('An error occurred while sending the reset email');
      console.error('Password reset error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  if (emailSent) {
    return (
      <div className="auth-container">
        <Card className="auth-card success-page-card">
          <div className="auth-header">
            <MailOutlined className="success-icon" />
            <Title level={3} className="auth-subtitle">Check Your Email</Title>
            <Paragraph className="auth-description">
              We've sent a password reset link to <strong>{email}</strong>
            </Paragraph>
            <Paragraph type="secondary" className="auth-description">
              Click the link in the email to reset your password. If you don't see the email,
              check your spam folder.
            </Paragraph>
          </div>

          <Button
            type="primary"
            onClick={() => navigate('/login')}
            block
            className="auth-button mb-16"
          >
            Back to Login
          </Button>

          <Button
            type="link"
            onClick={() => setEmailSent(false)}
            block
            className="auth-link"
          >
            Try a different email address
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <div className="auth-header">
          <Title level={2} className="auth-title">ETHOS</Title>
          <Title level={4} className="auth-subtitle">Reset Your Password</Title>
          <Paragraph className="auth-description">
            Enter your email address and we'll send you a link to reset your password.
          </Paragraph>
        </div>

        <Form layout="vertical" onFinish={handleResetPassword} className="auth-form">
          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: "Please enter your email address!" },
              { type: 'email', message: "Please enter a valid email address!" }
            ]}
          >
            <Input
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your email address"
              size="large"
              className="auth-input"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              className="auth-button"
            >
              Send Reset Link
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center" style={{ marginTop: 24 }}>
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/login')}
            className="auth-link"
          >
            Back to Login
          </Button>
        </div>

        <Paragraph className="auth-footer">
          Don't have an account?{" "}
          <Link onClick={() => navigate('/signup')} className="auth-link">
            Sign up here
          </Link>
        </Paragraph>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
