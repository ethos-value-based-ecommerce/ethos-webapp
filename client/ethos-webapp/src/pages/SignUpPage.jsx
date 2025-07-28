import '../App.css';
import '../styling/LoginPages.css';

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, Card, Tabs, Space, Divider, message } from "antd";
import { UserOutlined, ShopOutlined } from "@ant-design/icons";
import { useAuth } from "../contexts/AuthContext.jsx";

const { Title, Paragraph, Link } = Typography;
const { TabPane } = Tabs;

// Function to render the sign-up page, including o-auth from Google and Github.
const SignUpPage = () => {
  const [activeTab, setActiveTab] = useState("user");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signUpWithEmail } = useAuth();

  const handleEmailSignUp = async (values) => {
    const { email, password, confirmPassword, brandName, firstName, lastName } = values;

    if (password !== confirmPassword) {
      message.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const additionalData = activeTab === "brand"
        ? { brand_name: brandName }
        : { first_name: firstName, last_name: lastName };

      const result = await signUpWithEmail(email, password, activeTab, additionalData);

      if (result.error) {
        message.error(`Sign up failed: ${result.error.message}`);
        return;
      }

      message.success("Account created successfully! Please check your email to verify your account.");
      navigate("/login");
    } catch (err) {
      console.error("Sign up error:", err);
      message.error("An error occurred during sign up.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <div className="auth-header">
          <Title level={2} className="auth-title">ETHOS</Title>
          <Title level={4} className="auth-subtitle">Create Your Account</Title>
          <Paragraph className="auth-description">Choose your account type and sign up:</Paragraph>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          centered
          className="auth-tabs"
        >
          <TabPane
            tab={
              <Space>
                <UserOutlined />
                User Sign Up
              </Space>
            }
            key="user"
          >
            <div className="text-center mb-16">
              <Paragraph type="secondary" className="auth-description">
                Create an account to browse brands, save favorites, and manage your profile
              </Paragraph>
            </div>
          </TabPane>

          <TabPane
            tab={
              <Space>
                <ShopOutlined />
                Brand Sign Up
              </Space>
            }
            key="brand"
          >
            <div className="text-center mb-16">
              <Paragraph type="secondary" className="auth-description">
                Create a brand account to showcase your products and connect with customers
              </Paragraph>
            </div>
          </TabPane>
        </Tabs>

        <Divider className="auth-divider">Sign up with email</Divider>

        <Form layout="vertical" onFinish={handleEmailSignUp} className="auth-form">
          {activeTab === 'user' ? (
            <>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[{ required: true, message: "Please enter your first name!" }]}
              >
                <Input placeholder="First name" className="auth-input" />
              </Form.Item>
              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[{ required: true, message: "Please enter your last name!" }]}
              >
                <Input placeholder="Last name" className="auth-input" />
              </Form.Item>
            </>
          ) : (
            <Form.Item
              label="Brand Name"
              name="brandName"
              rules={[{ required: true, message: "Please enter your brand name!" }]}
            >
              <Input placeholder="Your brand name" className="auth-input" />
            </Form.Item>
          )}

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input placeholder={activeTab === "brand" ? "Brand email" : "Email"} className="auth-input" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please enter your password!" },
              { min: 6, message: "Password must be at least 6 characters!" },
            ]}
          >
            <Input.Password placeholder="Password" className="auth-input" />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm password" className="auth-input" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="auth-button"
              >
              {activeTab === "brand" ? "Create Brand Account" : "Create User Account"}
            </Button>
          </Form.Item>
        </Form>

        <Paragraph className="auth-footer">
          Already have an account?{" "}
          <Link onClick={() => navigate('/login')} className="auth-link">
            Sign in here
          </Link>
          <br />
          <Link onClick={() => navigate('/')} className="auth-link">
           Continue as a guest
          </Link>
        </Paragraph>
      </Card>
    </div>
  );
};

export default SignUpPage;
