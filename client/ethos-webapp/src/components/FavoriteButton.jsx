import { useState } from 'react';
import { Button, message, Tooltip } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { useFavorites } from '../contexts/FavoritesContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

const FavoriteButton = ({
  item,
  type,
  size = 'default',
  style = {},
  showTooltip = true
}) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const {
    isBrandFavorited,
    isProductFavorited,
    toggleBrandFavorite,
    toggleProductFavorite
  } = useFavorites();

  // Only show favorites button for authenticated users
  if (!user || !item) return null;

  const isFavorited = type === 'brand'
    ? isBrandFavorited(item.id)
    : isProductFavorited(item.id);

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();

    if (!user) {
      message.warning('Please log in to add favorites');
      return;
    }

    setLoading(true);
    try {
      const result = type === 'brand'
        ? await toggleBrandFavorite(item)
        : await toggleProductFavorite(item);

      if (result.success) {
        const action = isFavorited ? 'removed from' : 'added to';
        message.success(`${item.name} ${action} favorites!`);
      } else {
        message.error(result.error || 'Failed to update favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      message.error('Failed to update favorites');
    } finally {
      setLoading(false);
    }
  };

  const buttonStyle = {
    border: 'none',
    background: 'rgba(255, 255, 255, 0.9)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...style
  };

  const iconStyle = {
    fontSize: size === 'small' ? '16px' : size === 'large' ? '24px' : '20px',
    color: isFavorited ? '#ff4d4f' : '#8c8c8c'
  };

  const button = (
    <Button
      type="text"
      size={size}
      loading={loading}
      onClick={handleToggleFavorite}
      style={buttonStyle}
      icon={
        isFavorited ? (
          <HeartFilled style={iconStyle} />
        ) : (
          <HeartOutlined style={iconStyle} />
        )
      }
    />
  );

  if (!showTooltip) {
    return button;
  }

  return (
    <Tooltip
      title={
        !user
          ? 'Log in to add favorites'
          : isFavorited
            ? `Remove ${item.name} from favorites`
            : `Add ${item.name} to favorites`
      }
    >
      {button}
    </Tooltip>
  );
};

export default FavoriteButton;
