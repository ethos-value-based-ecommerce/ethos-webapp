import { Card, Typography, Row, Col, Empty } from 'antd';
import { HeartOutlined, ShoppingOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

// Function to render the favorite brands and products in the account page
// TO DO: Make Favorite Functionality only available to users with accounts, and like button.
const FavoritesSection = ({ brands, products }) => {
    return (
        <div>
            {/* Favorite Brands Section */}
            <div style={{ marginBottom: '32px' }}>
                <Title level={4} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <HeartOutlined style={{ color: '#ff4d4f' }} />
                    Favorite Brands
                </Title>

                {brands && brands.length > 0 ? (
                    <Row gutter={[12, 12]}>
                        {brands.slice(0, 6).map((brand) => (
                            <Col key={brand.id} xs={12} sm={8} md={6} lg={4}>
                                <Card
                                    hoverable
                                    size="small"
                                    cover={
                                        <div style={{ height: '120px', overflow: 'hidden' }}>
                                            <img
                                                alt={brand.name}
                                                src={brand.image}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        </div>
                                    }
                                    styles={{ body: { padding: '8px 12px' } }}
                                >
                                    <Card.Meta
                                        title={
                                            <Text strong style={{ fontSize: '12px' }}>
                                                {brand.name}
                                            </Text>
                                        }
                                    />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No favorite brands yet"
                        style={{ margin: '20px 0' }}
                    />
                )}
            </div>

            {/* Favorite Products Section */}
            <div>
                <Title level={4} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <ShoppingOutlined style={{ color: '#52c41a' }} />
                    Favorite Products
                </Title>

                {products && products.length > 0 ? (
                    <Row gutter={[12, 12]}>
                        {products.slice(0, 8).map((product) => (
                            <Col key={product.id} xs={12} sm={8} md={6} lg={4}>
                                <Card
                                    hoverable
                                    size="small"
                                    cover={
                                        <div style={{ height: '120px', overflow: 'hidden' }}>
                                            <img
                                                alt={product.name}
                                                src={product.image}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        </div>
                                    }
                                    styles={{ body: { padding: '8px 12px' } }}
                                >
                                    <Card.Meta
                                        title={
                                            <Text strong style={{ fontSize: '12px' }}>
                                                {product.name}
                                            </Text>
                                        }
                                        description={
                                            <Text type="secondary" style={{ fontSize: '11px' }}>
                                                {product.price}
                                            </Text>
                                        }
                                    />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No favorite products yet"
                        style={{ margin: '20px 0' }}
                    />
                )}
            </div>
        </div>
    );
};

export default FavoritesSection;
