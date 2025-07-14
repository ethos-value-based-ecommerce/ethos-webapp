import '../App.css';

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, Card, Tabs, Space, Divider, message } from "antd";
import { UserOutlined, ShopOutlined, GoogleOutlined, GithubOutlined } from "@ant-design/icons";
import { useAuth } from "../contexts/AuthContext.jsx";

const { Title, Paragraph, Link } = Typography;
const { TabPane } = Tabs;

// Function to render the sign-up page, including o-auth from Google and Github.
const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    brandName: "",
    firstName: "",
    lastName: ""
  });
  const [activeTab, setActiveTab] = useState("user");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signInWithGoogle, signInWithGitHub, signUpWithEmail } = useAuth();

  // Handle OAuth signup
  const handleOAuthSignUp = async (provider) => {
    setLoading(true);
    try {
      let result;
      if (provider === 'google') {
        result = await signInWithGoogle(activeTab);
      } else if (provider === 'github') {
        result = await signInWithGitHub(activeTab);
      }

      if (result.error) {
        message.error(`Failed to sign up with ${provider}: ${result.error.message}`);
      }
      // OAuth will redirect automatically, so no need to navigate here
    } catch (error) {
      message.error(`An error occurred during ${provider} sign up`);
      console.error(`${provider} sign up error:`, error);
    } finally {
      setLoading(false);
    }
  };

  // Handle email/password signup
  const handleEmailSignUp = async (values) => {
    const { email, password, confirmPassword, brandName, firstName, lastName } = values;

    if (password !== confirmPassword) {
      message.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const additionalData = {};

      if (activeTab === 'brand') {
        additionalData.brand_name = brandName;
      } else {
        additionalData.first_name = firstName;
        additionalData.last_name = lastName;
      }

      const result = await signUpWithEmail(email, password, activeTab, additionalData);

      if (result.error) {
        message.error(`Sign up failed: ${result.error.message}`);
      } else {
        message.success('Account created successfully! Please check your email to verify your account.');
        // Navigate to login page after successful signup
        navigate('/login');
      }
    } catch (error) {
      message.error('An error occurred during sign up');
      console.error('Sign up error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
          <Title level={4}>Create Your Account</Title>
          <Paragraph>Choose your account type and sign up:</Paragraph>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          centered
          style={{ marginBottom: 24 }}
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
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <Paragraph type="secondary">
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
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <Paragraph type="secondary">
                Create a brand account to showcase your products and connect with customers
              </Paragraph>
            </div>
          </TabPane>
        </Tabs>

        {/* OAuth Buttons */}
        <Space direction="vertical" style={{ width: '100%', marginBottom: 24 }}>
          <Button
            icon={<GoogleOutlined />}
            onClick={() => handleOAuthSignUp('google')}
            loading={loading}
            block
            size="large"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '48px'
            }}
          >
            Continue with Google
          </Button>

          <Button
            icon={<GithubOutlined />}
            onClick={() => handleOAuthSignUp('github')}
            loading={loading}
            block
            size="large"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '48px',
              backgroundColor: '#24292e',
              borderColor: '#24292e',
              color: 'white'
            }}
          >
            Continue with GitHub
          </Button>
        </Space>

        <Divider>Or sign up with email</Divider>

        <Form layout="vertical" onFinish={handleEmailSignUp}>
          {activeTab === 'brand' ? (
            <Form.Item
              label="Brand Name"
              name="brandName"
              rules={[{ required: true, message: "Please enter your brand name!" }]}
            >
              <Input
                name="brandName"
                value={formData.brandName}
                onChange={handleChange}
                placeholder="Your brand name"
              />
            </Form.Item>
          ) : (
            <>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[{ required: true, message: "Please enter your first name!" }]}
              >
                <Input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                />
              </Form.Item>
              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[{ required: true, message: "Please enter your last name!" }]}
              >
                <Input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                />
              </Form.Item>
            </>
          )}

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: 'email', message: "Please enter a valid email!" }
            ]}
          >
            <Input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={activeTab === "brand" ? "Brand email" : "Email"}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please enter your password!" },
              { min: 6, message: "Password must be at least 6 characters!" }
            ]}
          >
            <Input.Password
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
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
            <Input.Password
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
            >
              {activeTab === "brand" ? "Create Brand Account" : "Create User Account"}
            </Button>
          </Form.Item>
        </Form>

        <Paragraph style={{ textAlign: "center", marginTop: 16 }}>
          Already have an account?{" "}
          <Link onClick={() => navigate('/login')}>
            Sign in here
          </Link>
          <br />
          <Link onClick={() => navigate('/')}>
            Continue as a guest
          </Link>
        </Paragraph>
      </Card>
    </div>
  );
};

export default SignUpPage;
