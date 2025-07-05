import '../App.css';

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, Card, Tabs, Space } from "antd";
import { UserOutlined, ShopOutlined } from "@ant-design/icons";

const { Title, Paragraph, Link } = Typography;
const { TabPane } = Tabs;

// Function to render a login page with separate user and brand login
const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [activeTab, setActiveTab] = useState("user");
  const navigate = useNavigate();

  // TO DO: WORK ON LOGIN LATER ONCE BACKEND IS SET UP
  // Function to handle form submission

  const handleLogin = (values) => {
    const { username, password } = values;
    // For demo purposes - accept any non-empty username/password
    if (username && password) {
      if (onLogin) {
        onLogin({
          username,
          name: username,
          accountType: activeTab
        }); // Pass user data to parent with account type
      }

      // Navigate based on account type
      if (activeTab === "brand") {
        navigate('/brand-account');
      } else {
        navigate('/account');
      }
    } else {
      console.log('Please enter both username and password');
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

        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter your username!" }]}
          >
            <Input
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder={activeTab === "brand" ? "Brand username" : "Username"}
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
            <Button type="primary" htmlType="submit" block>
              {activeTab === "brand" ? "Log In as Brand" : "Log In as User"}
            </Button>
          </Form.Item>
        </Form>

        <Paragraph style={{ textAlign: "center", marginTop: 16 }}>
          <Link href="#">Forgot your password?</Link>
          <br />
          <Link href="#">
            Don't have an account? Sign up as a {activeTab === "brand" ? "brand" : "user"}.
          </Link>
          <br />
          <Link href="/">Continue as a guest.</Link>
        </Paragraph>
      </Card>
    </div>
  );
};

export default LoginPage;
