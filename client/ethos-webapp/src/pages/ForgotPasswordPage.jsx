import '../App.css';

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
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        <Card
          style={{
            width: 450,
            padding: 24,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
          }}
        >
          <div style={{ marginBottom: 24 }}>
            <MailOutlined style={{ fontSize: 48, color: "#1890ff", marginBottom: 16 }} />
            <Title level={3}>Check Your Email</Title>
            <Paragraph>
              We've sent a password reset link to <strong>{email}</strong>
            </Paragraph>
            <Paragraph type="secondary">
              Click the link in the email to reset your password. If you don't see the email,
              check your spam folder.
            </Paragraph>
          </div>

          <Button
            type="primary"
            onClick={() => navigate('/login')}
            block
            style={{ marginBottom: 16 }}
          >
            Back to Login
          </Button>

          <Button
            type="link"
            onClick={() => setEmailSent(false)}
            block
          >
            Try a different email address
          </Button>
        </Card>
      </div>
    );
  }

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
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <Card
        style={{
          width: 450,
          padding: 24,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={2}>ETHOS</Title>
          <Title level={4}>Reset Your Password</Title>
          <Paragraph>
            Enter your email address and we'll send you a link to reset your password.
          </Paragraph>
        </div>

        <Form layout="vertical" onFinish={handleResetPassword}>
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
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              Send Reset Link
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/login')}
          >
            Back to Login
          </Button>
        </div>

        <Paragraph style={{ textAlign: "center", marginTop: 16 }}>
          Don't have an account?{" "}
          <Link onClick={() => navigate('/signup')}>
            Sign up here
          </Link>
        </Paragraph>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
