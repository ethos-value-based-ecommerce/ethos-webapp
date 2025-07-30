import React from 'react';
import { Modal } from 'antd';

// Function to render a product modal that provides more product information
const ProductModal = ({ isOpen, onClose, children, title }) => {
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      title={title || 'Product Details'}
      centered
      className="product-modal"
      width={800}
      styles={{
        body: { padding: 0 },
        mask: { backgroundColor: 'rgba(0, 0, 0, 0.65)' }
      }}
    >
      {children}
    </Modal>
  );
};

export default ProductModal;
