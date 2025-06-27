import React from  'react';

// Function to render a product modal that provides more product information
const ProductModal = ({isOpen, onClose, children}) => {
    if (!isOpen) return null

    return(

        <div className='modal-overlay' onClick={onClose}>
            <div className='modal-content' onClick={(e) => e.stopPropagation}>
                <button className='modal-close' onClick={onClose}>x</button>
                {children}
            </div>
        </div>
    );
};

export default ProductModal;