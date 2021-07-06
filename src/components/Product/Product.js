import React from 'react';
import "./Product.css";


function Product({ id, title, price, image, rating }) {
  return (
    <div className="product">
      <div className="product__info">
        <p>{title}</p>

        <p className="product__price">
          <small>$</small>
          <strong>{price}</strong>
        </p>

        <div className="product__ratings">
          {Array(rating).fill().map((_, i) => (
          <p>⭐</p>
          ))}
        </div>
      </div>

      <img 
        alt="product image"
        className="product__image" 
        src={image} 
      />

      <button className="btn">Add to Basket</button>
    </div>
  )
}

export default Product
