import React, { useState } from 'react';
import { Modal, Button, Form, Radio, Checkbox, Typography } from 'antd';

const { Title } = Typography;

const QuizModal = ({ onQuizComplete }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  const handleFinish = (values) => {
    console.log('Quiz Answers:', values);
    onQuizComplete(values);
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Let's Do a Quiz
      </Button>

      <Modal
        title="Find Your Ethos Match"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
        bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
        >

          <Form.Item name="ownership" label="1. What kind of brand ownership do you feel most connected to?" rules={[{ required: true }]}>
            <Radio.Group>
              <Radio value="Black-Owned">Black-Owned</Radio>
              <Radio value="Indigenous-Owned">Indigenous-Owned</Radio>
              <Radio value="LGBTQ+-Owned">LGBTQ+-Owned</Radio>
              <Radio value="Asian Owned">Asian-Owned</Radio>
              <Radio value="Latinx-Owned"> Latinx-Owned</Radio>
              <Radio value="Women-Owned">Women-Owned</Radio>
              <Radio value="All">All of the above</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="categories" label="2. Which product categories do you shop most often?" rules={[{ required: true }]}>
            <Checkbox.Group
              options={['Beauty', 'Clothing', 'Personal Care', 'Footwear', 'Handbags', 'Outdoor Gear', 'Home Decor', 'Electronics']}
            />
          </Form.Item>

          <Form.Item name="ethics" label="3. What ethical values matter most to you?" rules={[{ required: true }]}>
            <Checkbox.Group
              options={['Fair-Trade', 'Eco-Conscious', 'Cruelty-Free','Sustainable', 'Vegan', 'Social Responsibility', 'Zero-Waste', 'Carbon Neutral', 'Clean Ingredients']}
            />
          </Form.Item>

          <Form.Item name="aesthetic" label="4. What type of aesthetic or vibe do you prefer?" rules={[{ required: true }]}>
            <Radio.Group>
              <Radio value="Bold and vibrant">Bold and vibrant</Radio>
              <Radio value="Natural and earthy">Natural and earthy</Radio>
              <Radio value="Minimalist and clean">Minimalist and clean</Radio>
              <Radio value="Colorful and expressive">Colorful and expressive</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="discovery" label="5. How do you usually discover new brands?" rules={[{ required: true }]}>
            <Radio.Group>
              <Radio value="Social media">Social media</Radio>
              <Radio value="Word of mouth">Word of mouth</Radio>
              <Radio value="Local markets">Local markets</Radio>
              <Radio value="Curated recommendations">Curated recommendations</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="cause" label="6. If you had $10 to support a brand’s mission, which cause would you choose?" rules={[{ required: true }]}>
            <Radio.Group>
                <Radio value="biodiversity">Conserving endangered species and biodiversity</Radio>
                <Radio value="clean-energy">Promoting clean energy and reducing pollution</Radio>
                <Radio value="fair-trade">Supporting fair trade and ethical labor practices</Radio>
                <Radio value="mental-health">Supporting mental health and well-being</Radio>
                <Radio value="youth-empowerment">Empowering youth through education and opportunity</Radio>
            </Radio.Group>
        </Form.Item>

          <Form.Item name="splurge" label="7. What’s your ideal weekend splurge?" rules={[{ required: true }]}>
            <Radio.Group>
              <Radio value="Self-care box">Self-care box with skincare goodies</Radio>
              <Radio value="Handmade jewelry">Unique handmade jewelry</Radio>
              <Radio value="Snack bundle">Eccentric home decor</Radio>
              <Radio value="Ethical fashion">Ethical fashion piece</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="storyFocus" label="8. How involved do you want to be with the brand’s story?" rules={[{ required: true }]}>
            <Radio.Group>
              <Radio value="Founder journey">I want to know the founder’s journey</Radio>
              <Radio value="Product quality">I care more about the product quality</Radio>
              <Radio value="Behind the scenes">I love behind-the-scenes content</Radio>
              <Radio value="Support causes">I support causes over stories</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item style={{ marginTop: 24 }}>
            <Button type="primary" htmlType="submit" block>
              See My Matches
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default QuizModal;
