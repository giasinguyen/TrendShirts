import React from 'react';

const ProductImageGallery = ({ images }) => {
  return (
    <div className="product-image-gallery">
      {images.map((image, index) => (
        <img key={index} src={image} alt={`Product image ${index + 1}`} />
      ))}
    </div>
  );
};

export default ProductImageGallery;