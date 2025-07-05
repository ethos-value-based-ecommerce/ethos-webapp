import { Form, Input, Button, Select } from 'antd';

import Footer from '../components/Footer.jsx';
import NavBar from '../components/NavBar.jsx';

const { TextArea } = Input;
const { Option } = Select;

// Function to render the BrandUploadPage with image, descriptions, and categories.
const BrandUploadPage = () => {

    // TODO: Work on Submit Functionality

    return (
        <main>
            <header>
                <h1>ETHOS</h1>
            </header>

            <NavBar />

            <section className='brand-upload-section'>
                <h2>Submit Your Brand</h2>

                <Form
                    form={form}
                    layout='vertical'
                    className='brand-upload'
                >
                    <Form.Item
                        label="Brand Name"
                        name="brandName"
                        rules={[{ required: true, message: 'Please enter the brand name'}]}
                    >
                        <Input placeholder="Enter a brand name: "/>
                    </Form.Item>

                    <Form.Item
                        label="Brand Website"
                        name="website"
                        rules={[
                                { required: true, message: 'Please enter the website URL'},
                                { type: 'url', message: 'Please enter a valid URL'}
                        ]}
                    >
                        <Input placeholder="https://example.com"/>
                    </Form.Item>

                    <Form.Item
                        label="Brand Description"
                        name="description"
                        rules={[{ required: true, message: 'Please enter a brand description:'}]}
                    >
                        <TextArea
                        rows={4}
                         placeholder="Enter the brand's description:"/>
                    </Form.Item>

                    <Form.Item
                        label="Brand Mission"
                        name="mission"
                        rules={[{ required: true, message: 'Please enter a brand mission:'}]}
                    >
                        <TextArea
                        rows={4}
                         placeholder="Enter the brand's mission:"/>
                    </Form.Item>

                    <Form.Item
                        label="Brand Category"
                        name="category"
                        rules={[{ required: true, message: 'Select a few categories to describe this brand:'}]}
                    >
                        <Select placeholder="Select categories that describe this brand:">
                            {categories.map(category => (
                            <Option key={category} value={category}>
                                 {category}
                            </Option>
                                 ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Logo / Image Upload"
                        name="imgURL"
                        rules={[
                        { required: true, message: 'Please enter the image URL' },
                        { type: 'url', message: 'Please enter a valid URL' }
                        ]}
                        >
                        <Input placeholder="https://example.com" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" size="large">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </section>

            <Footer />
        </main>
    );

};

export default BrandUploadPage;
