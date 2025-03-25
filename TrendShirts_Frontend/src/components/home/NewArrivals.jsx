import React from 'react';
import { Link } from 'react-router-dom';

const newArrivals = [
  {
    id: 1,
    name: 'Oversized Cotton Shirt',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c',
    category: 'Women'
  },
  {
    id: 2,
    name: 'Linen Blend Blazer',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35',
    category: 'Men'
  },
  {
    id: 3,
    name: 'Summer Maxi Dress',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8',
    category: 'Women'
  }
];

export const NewArrivals = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">New Arrivals</h2>
        <p className="text-gray-600 text-center mb-12">Discover our latest collection</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newArrivals.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`} className="group">
              <div className="relative overflow-hidden rounded-lg bg-white shadow-sm">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-96 object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white px-3 py-1 rounded-full text-sm font-medium">New</span>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">{product.category}</p>
                <h3 className="text-lg font-medium">{product.name}</h3>
                <p className="text-gray-900 font-semibold">${product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};