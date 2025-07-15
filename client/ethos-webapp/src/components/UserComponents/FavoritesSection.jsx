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
                            <Col key={brand.id} xs={12} sm={8} md={6} lg={4}>
                                <Card
                                    hoverable
                                    size="small"
                                    cover={
                                        <div style={{ height: '120px', overflow: 'hidden', position: 'relative' }}>
                                            <img
                                                alt={brand.name}
                                                src={brand.image}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                            <Button
                                                type="text"
                                                icon={<DeleteOutlined />}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveBrand(brand.id);
                                                }}
                                                style={{
                                                    position: 'absolute',
                                                    top: '4px',
                                                    right: '4px',
                                                    color: '#ff4d4f',
                                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                    border: 'none',
                                                    borderRadius: '50%',
                                                    width: '24px',
                                                    height: '24px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '12px',
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

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <Spin size="large" />
                    </div>
                ) : favoriteProducts && favoriteProducts.length > 0 ? (
                    <Row gutter={[12, 12]}>
                        {favoriteProducts.slice(0, 8).map((product) => (
                            <Col key={product.id || product.title} xs={12} sm={8} md={6} lg={4}>
                                <Card
                                    hoverable
                                    size="small"
                                    cover={
                                        <div style={{ height: '120px', overflow: 'hidden', position: 'relative' }}>
                                            <img
                                                alt={product.name || product.title}
                                                src={product.image}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                            <Button
                                                type="text"
                                                icon={<DeleteOutlined />}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveProduct(product);
                                                }}
                                                style={{
                                                    position: 'absolute',
                                                    top: '4px',
                                                    right: '4px',
                                                    color: '#ff4d4f',
                                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                    border: 'none',
                                                    borderRadius: '50%',
                                                    width: '24px',
                                                    height: '24px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '12px',
                                                }}
                                            />
                                        </div>
                                    }
                                    styles={{ body: { padding: '8px 12px' } }}
                                >
                                    <Card.Meta
                                        title={
                                            <Text strong style={{ fontSize: '12px' }}>
                                                {product.name || product.title}
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
