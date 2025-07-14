import '../App.css';

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Form, Input, Button, Typography, Card, message } from "antd";
import { LockOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useAuth } from "../contexts/AuthContext.jsx";

const { Title, Paragraph } = Typography;

// Function to render the reset password page.
const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { updatePassword } = useAuth();

  useEffect(() => {
    // Check if we have the required tokens from the URL
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');

    if (!accessToken || !refreshToken) {
      message.error('Invalid or expired reset link');
      navigate('/forgot-password');
    }
  }, [searchParams, navigate]);

  // Handle Reset passwords
  const handleResetPassword = async (values) => {
    const { newPassword, confirmPassword } = values;

    if (newPassword !== confirmPassword) {
      message.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const result = await updatePassword(newPassword);

      if (result.error) {
        message.error(`Password reset failed: ${result.error.message}`);
      } else {
        setPasswordReset(true);
        message.success('Password updated successfully!');
      }
    } catch (error) {
      message.error('An error occurred while updating your password');
      console.error('Password update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'newPassword') {
      setNewPassword(value);
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
    }
  };

  if (passwordReset) {
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
            <CheckCircleOutlined style={{ fontSize: 48, color: "#52c41a", marginBottom: 16 }} />
            <Title level={3}>Password Reset Successful</Title>
            <Paragraph>
              Your password has been successfully updated. You can now log in with your new password.
            </Paragraph>
          </div>

          <Button
            type="primary"
            onClick={() => navigate('/login')}
            block
            size="large"
          >
            Go to Login
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
          <LockOutlined style={{ fontSize: 48, color: "#1890ff", marginBottom: 16 }} />
          <Title level={2}>ETHOS</Title>
          <Title level={4}>Set New Password</Title>
          <Paragraph>
            Enter your new password below.
          </Paragraph>
        </div>

        <Form layout="vertical" onFinish={handleResetPassword}>
          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              { required: true, message: "Please enter your new password!" },
              { min: 6, message: "Password must be at least 6 characters!" }
            ]}
          >
            <Input.Password
              name="newPassword"
              value={newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Confirm New Password"
            name="confirmPassword"
            rules={[
              { required: true, message: "Please confirm your new password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
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
              Update Password
            </Button>
          </Form.Item>
        </Form>

        <Paragraph style={{ textAlign: "center", marginTop: 16 }}>
          Remember your password?{" "}
          <Button type="link" onClick={() => navigate('/login')} style={{ padding: 0 }}>
            Back to Login
          </Button>
        </Paragraph>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
