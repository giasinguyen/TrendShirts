import React from 'react';

export const BrandStory = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04"
              alt="Brand Story"
              className="rounded-lg shadow-lg w-full h-[600px] object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Founded in 2020, TrendShirts began with a simple mission: to create timeless, 
              high-quality clothing that makes everyone feel confident and comfortable. Our 
              journey started in a small studio in Paris, where our passion for fashion and 
              sustainability merged to create something truly special.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Today, we're proud to offer a curated collection of contemporary clothing that 
              combines classic elegance with modern trends. Every piece is thoughtfully designed 
              and crafted with attention to detail, using sustainable materials and ethical 
              production practices.
            </p>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">50+</h3>
                <p className="text-gray-600">Collections</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">100k+</h3>
                <p className="text-gray-600">Happy Customers</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">20+</h3>
                <p className="text-gray-600">Countries</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};