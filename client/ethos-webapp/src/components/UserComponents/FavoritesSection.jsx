import { Card, Typography, Row, Col, Empty, Spin, Button } from 'antd';
import { HeartOutlined, ShoppingOutlined, DeleteOutlined } from '@ant-design/icons';
import { useFavorites } from '../../contexts/FavoritesContext.jsx';

const { Title, Text } = Typography;

// Function to render the favorite brands and products in the account page
const FavoritesSection = () => {
    const {
        getFavoriteBrandsWithData,
        favoriteProducts,
        loading,
        toggleBrandFavorite,
        toggleProductFavorite
    } = useFavorites();

    const favoriteBrands = getFavoriteBrandsWithData();

    const handleRemoveBrand = async (brandId) => {
        await toggleBrandFavorite(brandId);
    };

    const handleRemoveProduct = async (productData) => {
        await toggleProductFavorite(productData);
    };
    return (
        <div>
            {/* Favorite Brands Section */}
            <div style={{ marginBottom: '32px' }}>
                <Title level={4} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <HeartOutlined style={{ color: '#ff4d4f' }} />
                    Favorite Brands
                </Title>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <Spin size="large" />
                    </div>
                ) : favoriteBrands && favoriteBrands.length > 0 ? (
                    <Row gutter={[12, 12]}>
                        {favoriteBrands.slice(0, 6).map((brand) => (
                            <Col key={brand.id} xs={24} sm={12} md={8} lg={6}>
                                <Card
                                    hoverable
                                    size="small"
                                    className="favorite-brand-card"
                                    cover={
                                        <div className="favorite-brand-image-container">
                                            <img
                                                alt={brand.name}
                                                src={brand.image}
                                                className="favorite-brand-image"
                                            />
                                            <div className="favorite-brand-overlay">
                                                <Button
                                                    type="text"
                                                    icon={<DeleteOutlined />}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveBrand(brand.id);
                                                    }}
                                                    className="favorite-remove-button"
                                                />
                                            </div>
                                        </div>
                                    }
                                    styles={{
                                        body: {
                                            padding: '12px',
                                            backgroundColor: 'var(--background-secondary)'
                                        }
                                    }}
                                >
                                    <Card.Meta
                                        title={
                                            <Text strong className="favorite-brand-name">
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

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <Spin size="large" />
                    </div>
                ) : favoriteProducts && favoriteProducts.length > 0 ? (
                    <Row gutter={[12, 12]}>
                        {favoriteProducts.slice(0, 8).map((product) => (
                            <Col key={product.id || product.title} xs={24} sm={12} md={8} lg={6}>
                                <Card
                                    hoverable
                                    size="small"
                                    className="favorite-brand-card"
                                    cover={
                                        <div className="favorite-brand-image-container">
                                            <img
                                                alt={product.name || product.title}
                                                src={product.image}
                                                className="favorite-brand-image"
                                            />
                                            <div className="favorite-brand-overlay">
                                                <Button
                                                    type="text"
                                                    icon={<DeleteOutlined />}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveProduct(product);
                                                    }}
                                                    className="favorite-remove-button"
                                                />
                                            </div>
                                        </div>
                                    }
                                    styles={{
                                        body: {
                                            padding: '12px',
                                            backgroundColor: 'var(--background-secondary)'
                                        }
                                    }}
                                >
                                    <Card.Meta
                                        title={
                                            <Text strong className="favorite-brand-name">
                                                {product.name || product.title}
                                            </Text>
                                        }
                                        description={
                                            <Text type="secondary" style={{ fontSize: '12px' }}>
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
