import '../App.css';
import '../styling/LoginPages.css';

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
      <div className="auth-container">
        <Card className="auth-card success-page-card">
          <div className="auth-header">
            <CheckCircleOutlined className="success-icon" />
            <Title level={3} className="auth-subtitle">Password Reset Successful</Title>
            <Paragraph>
              Your password has been successfully updated. You can now log in with your new password.
            </Paragraph>
          </div>

          <Button
            type="primary"
            onClick={() => navigate('/login')}
            block
            size="large"
            className="auth-button"
          >
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <div className="auth-header">
          <LockOutlined className="auth-logo" />
          <Title level={2} className="auth-title">ETHOS</Title>
          <Title level={4} className="auth-subtitle">Set New Password</Title>
          <Paragraph className="auth-description">
            Enter your new password below.
          </Paragraph>
        </div>

        <Form layout="vertical" onFinish={handleResetPassword} className="auth-form">
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
              className="auth-input"
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
              Update Password
            </Button>
          </Form.Item>
        </Form>

        <Paragraph className="auth-footer">
          Remember your password?{" "}
          <Button type="link" onClick={() => navigate('/login')} className="auth-link p-0">
            Back to Login
          </Button>
        </Paragraph>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
