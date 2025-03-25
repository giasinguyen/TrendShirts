import React from 'react';
import './Card.css'; // Assuming you have a CSS file for styling the card

const Card = ({ title, image, description, price, onAddToCart }) => {
  return (
    <div className="card">
      <img src={image} alt={title} className="card-image" />
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
        <p className="card-price">${price}</p>
        <button className="card-button" onClick={onAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Card;