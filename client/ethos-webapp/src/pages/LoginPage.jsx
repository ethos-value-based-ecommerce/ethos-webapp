import '../App.css';


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, Card, Tabs, Space, Divider, message } from "antd";
import { UserOutlined, ShopOutlined } from "@ant-design/icons";
import { useAuth } from "../contexts/AuthContext.jsx";

const { Title, Paragraph, Link } = Typography;
const { TabPane } = Tabs;

// Function to render a login page with separate user and brand login
 const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [activeTab, setActiveTab] = useState("user");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signInWithEmail } = useAuth();

  // Handle email/password login
  const handleEmailLogin = async (values) => {
    const { email, password } = values;
    setLoading(true);

    try {
      const result = await signInWithEmail(email, password, activeTab);

      if (result.error) {
        message.error(`Login failed: ${result.error.message}`);
        return;
      }

      // Call parent onLogin if needed
      if (onLogin) {
        onLogin({
          email,
          name: result.data.user.email,
          accountType: activeTab,
        });
      }

      // Navigate based on account type
      if (activeTab === "brand") {
        navigate("/brand-account");
      } else {
        navigate("/account");
      }

      message.success("Successfully logged in!");
    } catch (error) {
      message.error("An error occurred during login");
      console.error("Login error:", error);
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
          <Title level={4}>Welcome Back!</Title>
          <Paragraph>Choose your account type and log in:</Paragraph>
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
                User Login
              </Space>
            }
            key="user"
          >
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <Paragraph type="secondary">
                Log in to browse brands, save favorites, and manage your profile
              </Paragraph>
            </div>
          </TabPane>

          <TabPane
            tab={
              <Space>
                <ShopOutlined />
                Brand Login
              </Space>
            }
            key="brand"
          >
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <Paragraph type="secondary">
                Log in to manage your brand profile, upload products, and view analytics
              </Paragraph>
            </div>
          </TabPane>
        </Tabs>

        <Divider>Continue with email</Divider>

        <Form layout="vertical" onFinish={handleEmailLogin}>
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
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
            >
              {activeTab === "brand" ? "Log In as Brand" : "Log In as User"}
            </Button>
          </Form.Item>
        </Form>

        <Paragraph style={{ textAlign: "center", marginTop: 16 }}>
          <Link onClick={() => navigate('/forgot-password')}>Forgot your password?</Link>
          <br />
          <Link onClick={() => navigate('/signup')}>
            Don't have an account? Sign up as a {activeTab === "brand" ? "brand" : "user"}.
          </Link>
          <br />
          <Link onClick={() => navigate('/')}>Continue as a guest.</Link>
        </Paragraph>
      </Card>
    </div>
  );
};

export default LoginPage;
