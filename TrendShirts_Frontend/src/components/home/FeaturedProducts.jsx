import React from 'react';
import { Link } from 'react-router-dom';

const products = [
  {
    id: 1,
    name: 'Classic White T-Shirt',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
    category: 'Men'
  },
  {
    id: 2,
    name: 'Summer Floral Dress',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446',
    category: 'Women'
  },
  {
    id: 3,
    name: 'Denim Jacket',
    price: 119.99,
    image: 'https://images.unsplash.com/photo-1523205771623-e0faa4d2813d',
    category: 'Men'
  },
  {
    id: 4,
    name: 'Summer Hat',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee',
    category: 'Accessories'
  }
];

export const FeaturedProducts = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`} className="group">
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">{product.category}</p>
                <h3 className="text-lg font-medium">{product.name}</h3>
                <p className="text-gray-900">${product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};