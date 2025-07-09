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
      destroyOnHidden
    >
      {children}
    </Modal>
  );
};

export default ProductModal;
