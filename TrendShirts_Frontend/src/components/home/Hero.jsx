import React from 'react';
import { Link } from 'react-router-dom';

export const Hero = () => {
  return (
    <div className="relative h-[600px] bg-gray-900">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8"
          alt="Hero"
          className="w-full h-full object-cover opacity-50"
        />
      </div>
      
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-xl">
          <h1 className="text-5xl font-bold text-white mb-6">
            New Summer Collection 2024
          </h1>
          <p className="text-xl text-gray-200 mb-8">
            Discover the latest trends in fashion and express your unique style with our new collection.
          </p>
          <Link
            to="/new"
            className="inline-block bg-white text-gray-900 px-8 py-4 rounded-md font-semibold hover:bg-gray-100 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
};