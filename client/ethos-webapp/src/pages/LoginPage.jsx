import '../App.css';

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, Card } from "antd";

const { Title, Paragraph, Link } = Typography;

// Function to render a basic login page
const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  // TO DO: WORK ON LOGIN LATER ONCE BACKEND IS SET UP
   // Function to handle form submission

  const handleLogin = (values) => {
    const { username, password } = values;
    // For demo purposes - accept any non-empty username/password
    if (username && password) {
      if (onLogin) {
        onLogin({ username, name: username }); // Pass user data to parent
      }
      navigate('/account');
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
          width: 400,
          padding: 24,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={2}>ETHOS</Title>
          <Title level={4}>Welcome Back!</Title>
          <Paragraph>Please log in to continue:</Paragraph>
        </div>

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
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Log In
            </Button>
          </Form.Item>
        </Form>

        <Paragraph style={{ textAlign: "center", marginTop: 16 }}>
          <Link href="#">Forgot your password?</Link>
          <br />
          <Link href="#">Don't have an account? Sign up here.</Link>
          <br />
          <Link href="/">Continue as a guest.</Link>
        </Paragraph>
      </Card>
    </div>
  );
};

export default LoginPage;
