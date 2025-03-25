import React, { useState } from 'react';
import { Filter } from 'lucide-react';

const products = [
  {
    id: 1,
    name: 'Floral Summer Dress',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446',
    category: 'Dresses',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Pink', 'Blue'],
    material: 'Viscose'
  },
  // Add more products...
];

const categories = ['All', 'Dresses', 'Tops', 'Pants', 'Skirts', 'Accessories'];
const sizes = ['XS', 'S', 'M', 'L', 'XL'];
const colors = ['Black', 'White', 'Pink', 'Blue', 'Red', 'Green'];
const priceRanges = ['Under $50', '$50-$100', '$100-$200', 'Over $200'];

export const Women = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Trends */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-6">Women's Collection</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative h-48 rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1485968579580-b6d095142e6e"
              alt="Summer Trends"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <h3 className="text-white text-2xl font-bold">Summer Trends</h3>
            </div>
          </div>
          <div className="relative h-48 rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1496747611176-843222e1e57c"
              alt="New Arrivals"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <h3 className="text-white text-2xl font-bold">New Arrivals</h3>
            </div>
          </div>
          <div className="relative h-48 rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f"
              alt="Accessories"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <h3 className="text-white text-2xl font-bold">Accessories</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Size Guide */}
      <div className="mb-12 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Size Guide</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2">Size</th>
                <th className="px-4 py-2">Bust (cm)</th>
                <th className="px-4 py-2">Waist (cm)</th>
                <th className="px-4 py-2">Hips (cm)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 text-center">XS</td>
                <td className="px-4 py-2 text-center">82-85</td>
                <td className="px-4 py-2 text-center">63-66</td>
                <td className="px-4 py-2 text-center">89-92</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-2 text-center">S</td>
                <td className="px-4 py-2 text-center">86-89</td>
                <td className="px-4 py-2 text-center">67-70</td>
                <td className="px-4 py-2 text-center">93-96</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-center">M</td>
                <td className="px-4 py-2 text-center">90-93</td>
                <td className="px-4 py-2 text-center">71-74</td>
                <td className="px-4 py-2 text-center">97-100</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-2 text-center">L</td>
                <td className="px-4 py-2 text-center">94-97</td>
                <td className="px-4 py-2 text-center">75-78</td>
                <td className="px-4 py-2 text-center">101-104</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-center">XL</td>
                <td className="px-4 py-2 text-center">98-101</td>
                <td className="px-4 py-2 text-center">79-82</td>
                <td className="px-4 py-2 text-center">105-108</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex items-center gap-2 px-4 py-2 border rounded-lg"
        >
          <Filter size={20} />
          Filters
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters - Desktop */}
        <div className={`md:w-64 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category} className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === category}
                      onChange={() => setSelectedCategory(category)}
                      className="mr-2"
                    />
                    {category}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Sizes</h3>
              <div className="grid grid-cols-3 gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      if (selectedSizes.includes(size)) {
                        setSelectedSizes(selectedSizes.filter((s) => s !== size));
                      } else {
                        setSelectedSizes([...selectedSizes, size]);
                      }
                    }}
                    className={`px-3 py-2 border rounded-md text-sm ${
                      selectedSizes.includes(size)
                        ? 'bg-gray-900 text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Colors</h3>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      if (selectedColors.includes(color)) {
                        setSelectedColors(selectedColors.filter((c) => c !== color));
                      } else {
                        setSelectedColors([...selectedColors, color]);
                      }
                    }}
                    className={`px-3 py-1 border rounded-full text-sm ${
                      selectedColors.includes(color)
                        ? 'bg-gray-900 text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Price Range</h3>
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <label key={range} className="flex items-center">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={selectedPriceRange === range}
                      onChange={() => setSelectedPriceRange(range)}
                      className="mr-2"
                    />
                    {range}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="group">
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full aspect-[3/4] object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-white">
                      <p className="font-medium">Available Sizes: {product.sizes.join(', ')}</p>
                      <p>Material: {product.material}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">{product.category}</p>
                  <h3 className="text-lg font-medium">{product.name}</h3>
                  <p className="text-gray-900">${product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};