import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Filter, 
  Grid, 
  List, 
  ChevronLeft, 
  ChevronRight,
  X,
  AlertCircle,
  ShoppingCart
} from 'lucide-react';
import { getProducts } from '../../../services/productService';
import { useCategory } from '../../../contexts/CategoryContext';

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories } = useCategory();
  
  // State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  
  // Filters and pagination
  const categoryParam = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';
  const sortBy = searchParams.get('sort') || 'newest';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '12', 10);
  
  // Available sort options
  const sortOptions = [
    { value: 'newest', label: 'Newest Arrivals' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'name_asc', label: 'Name: A to Z' },
    { value: 'name_desc', label: 'Name: Z to A' },
  ];
  
  // Fetch products when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Prepare query parameters
        const params = {
          page,
          limit,
          sort: sortBy,
          ...(categoryParam && { category: categoryParam }),
          ...(searchQuery && { search: searchQuery }),
          ...(minPrice && { minPrice }),
          ...(maxPrice && { maxPrice }),
        };
        
        const data = await getProducts(params);
        setProducts(data.products);
        setTotalItems(data.totalItems);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [categoryParam, searchQuery, sortBy, minPrice, maxPrice, page, limit]);
  
  // Update filters
  const updateFilters = (newFilters) => {
    const updatedParams = { ...Object.fromEntries(searchParams) };
    
    // Update with new filters
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        updatedParams[key] = value;
      } else {
        delete updatedParams[key];
      }
    });
    
    // Reset to page 1 when filters change
    if (!newFilters.hasOwnProperty('page')) {
      updatedParams.page = '1';
    }
    
    setSearchParams(updatedParams);
  };
  
  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      updateFilters({ page: newPage.toString() });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Handle sort change
  const handleSortChange = (e) => {
    updateFilters({ sort: e.target.value });
  };
  
  // Handle price filter
  const handlePriceFilter = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const min = formData.get('min');
    const max = formData.get('max');
    
    updateFilters({
      minPrice: min || '',
      maxPrice: max || '',
    });
  };
  
  // Handle category selection
  const handleCategoryChange = (categorySlug) => {
    updateFilters({ category: categorySlug });
  };
  
  // Clear all filters
  const clearAllFilters = () => {
    setSearchParams({});
  };
  
  // Get active filters count for mobile badge
  const getActiveFiltersCount = () => {
    let count = 0;
    if (categoryParam) count++;
    if (minPrice || maxPrice) count++;
    return count;
  };
  
  // Render product card
  const renderProductCard = (product) => {
    if (viewMode === 'grid') {
      return (
        <div key={product.id} className="group relative rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
          <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-t-lg bg-gray-200">
            <img
              src={product.images && product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover object-center transition-opacity group-hover:opacity-75"
            />
            {product.discount > 0 && (
              <div className="absolute left-0 top-2 bg-red-500 px-2 py-1 text-xs font-bold text-white">
                {product.discount}% OFF
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="mb-1 text-sm font-medium text-gray-900">
              <Link to={`/products/${product.id}`}>
                {product.name}
              </Link>
            </h3>
            <p className="text-sm text-gray-500">
              {product.category?.name}
            </p>
            <div className="mt-2 flex items-center">
              <span className="text-lg font-bold text-indigo-600">${product.price.toFixed(2)}</span>
              {product.oldPrice && (
                <span className="ml-2 text-sm text-gray-500 line-through">
                  ${product.oldPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div key={product.id} className="group flex rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
          <div className="h-40 w-40 flex-shrink-0 overflow-hidden rounded-l-lg bg-gray-200">
            <img
              src={product.images && product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover object-center transition-opacity group-hover:opacity-75"
            />
            {product.discount > 0 && (
              <div className="absolute left-0 rounded-tr bg-red-500 px-2 py-1 text-xs font-bold text-white">
                {product.discount}% OFF
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col justify-between p-4">
            <div>
              <h3 className="mb-1 text-base font-medium text-gray-900">
                <Link to={`/products/${product.id}`}>
                  {product.name}
                </Link>
              </h3>
              <p className="text-sm text-gray-500">
                {product.category?.name}
              </p>
              <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                {product.description}
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-lg font-bold text-indigo-600">${product.price.toFixed(2)}</span>
                {product.oldPrice && (
                  <span className="ml-2 text-sm text-gray-500 line-through">
                    ${product.oldPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <Link 
                to={`/products/${product.id}`}
                className="rounded-md bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-100"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      );
    }
  };
  
  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {categoryParam
              ? categories?.find(c => c.slug === categoryParam)?.name || 'Products'
              : searchQuery
                ? `Search results for "${searchQuery}"`
                : 'All Products'}
          </h1>
          
          {searchQuery && (
            <p className="mt-2 text-gray-600">
              Showing {totalItems} results for "{searchQuery}"
            </p>
          )}
        </div>
        
        {/* Mobile Filter Dialog */}
        <div className={`fixed inset-0 z-40 flex transform ${mobileFiltersOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform lg:hidden`}>
          {/* Backdrop */}
          <div 
            className={`fixed inset-0 bg-black bg-opacity-25 transition-opacity ${mobileFiltersOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={() => setMobileFiltersOpen(false)}
          ></div>
          
          {/* Filters Panel */}
          <div className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
            <div className="flex items-center justify-between px-4 pt-5">
              <h2 className="text-lg font-medium text-gray-900">Filters</h2>
              <button
                type="button"
                className="relative -mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                onClick={() => setMobileFiltersOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Filter Sections */}
            <div className="mt-4 border-t border-gray-200">
              {/* Categories */}
              <div className="px-4 py-6">
                <h3 className="mb-3 text-sm font-medium text-gray-900">Categories</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="all-categories"
                      name="category"
                      type="radio"
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      checked={!categoryParam}
                      onChange={() => handleCategoryChange('')}
                    />
                    <label htmlFor="all-categories" className="ml-3 text-sm text-gray-600">
                      All Categories
                    </label>
                  </div>
                  
                  {categories?.map((category) => (
                    <div key={category.id} className="flex items-center">
                      <input
                        id={`category-${category.slug}`}
                        name="category"
                        type="radio"
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={categoryParam === category.slug}
                        onChange={() => handleCategoryChange(category.slug)}
                      />
                      <label htmlFor={`category-${category.slug}`} className="ml-3 text-sm text-gray-600">
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Price Range */}
              <div className="border-t border-gray-200 px-4 py-6">
                <h3 className="mb-3 text-sm font-medium text-gray-900">Price Range</h3>
                <form onSubmit={handlePriceFilter}>
                  <div className="flex items-center space-x-2">
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        name="min"
                        id="min-price-mobile"
                        placeholder="Min"
                        defaultValue={minPrice}
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-3 sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <span className="text-gray-500">-</span>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        name="max"
                        id="max-price-mobile"
                        placeholder="Max"
                        defaultValue={maxPrice}
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-3 sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="mt-4 w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Apply
                  </button>
                </form>
              </div>
              
              {/* Clear Filters */}
              <div className="border-t border-gray-200 px-4 py-6">
                <button
                  onClick={clearAllFilters}
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
          {/* Desktop filters */}
          <div className="hidden lg:block">
            <h2 className="sr-only">Filters</h2>
            
            {/* Categories */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="mb-4 text-base font-medium text-gray-900">Categories</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="all-categories-desktop"
                    name="category-desktop"
                    type="radio"
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={!categoryParam}
                    onChange={() => handleCategoryChange('')}
                  />
                  <label htmlFor="all-categories-desktop" className="ml-3 text-sm text-gray-600">
                    All Categories
                  </label>
                </div>
                
                {categories?.map((category) => (
                  <div key={category.id} className="flex items-center">
                    <input
                      id={`category-desktop-${category.slug}`}
                      name="category-desktop"
                      type="radio"
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      checked={categoryParam === category.slug}
                      onChange={() => handleCategoryChange(category.slug)}
                    />
                    <label htmlFor={`category-desktop-${category.slug}`} className="ml-3 text-sm text-gray-600">
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Price Range */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="mb-4 text-base font-medium text-gray-900">Price Range</h3>
              <form onSubmit={handlePriceFilter}>
                <div className="mb-4 flex items-center space-x-2">
                  <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="min"
                      id="min-price-desktop"
                      placeholder="Min"
                      defaultValue={minPrice}
                      min="0"
                      className="block w-full rounded-md border-gray-300 pl-7 pr-3 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <span className="text-gray-500">to</span>
                  <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="max"
                      id="max-price-desktop"
                      placeholder="Max"
                      defaultValue={maxPrice}
                      min="0"
                      className="block w-full rounded-md border-gray-300 pl-7 pr-3 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Apply
                </button>
              </form>
            </div>
            
            {/* Clear Filters */}
            <button
              onClick={clearAllFilters}
              className="mb-8 w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Clear All Filters
            </button>
          </div>
          
          {/* Product Grid */}
          <div className="lg:col-span-3">
            {/* Filter & Sort Section */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
              {/* Mobile Filter Button */}
              <button
                type="button"
                className="flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <Filter className="mr-2 h-5 w-5 text-gray-400" />
                <span>Filters</span>
                {getActiveFiltersCount() > 0 && (
                  <span className="ml-1.5 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </button>
              
              {/* Sort & View Options */}
              <div className="flex flex-1 items-center justify-end gap-2">
                {/* Sort Dropdown */}
                <div className="w-full max-w-xs">
                  <label htmlFor="sort-by" className="sr-only">Sort by</label>
                  <select
                    id="sort-by"
                    name="sort-by"
                    value={sortBy}
                    onChange={handleSortChange}
                    className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* View Mode Buttons */}
                <div className="hidden gap-1 sm:flex">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`inline-flex items-center rounded-md p-2 text-sm font-medium ${
                      viewMode === 'grid'
                        ? 'bg-indigo-100 text-indigo-600'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`inline-flex items-center rounded-md p-2 text-sm font-medium ${
                      viewMode === 'list'
                        ? 'bg-indigo-100 text-indigo-600'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                    aria-label="List view"
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Loading State */}
            {loading && (
              <div className="flex justify-center py-12">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
              </div>
            )}
            
            {/* Error State */}
            {error && !loading && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}
            
            {/* Empty State */}
            {!loading && !error && products.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white py-12">
                <ShoppingCart className="h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try changing your filters or search criteria.
                </p>
                <div className="mt-6">
                  <button
                    onClick={clearAllFilters}
                    className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}
            
            {/* Products Grid/List */}
            {!loading && !error && products.length > 0 && (
              <>
                <div className={
                  viewMode === 'grid'
                    ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    : "space-y-6"
                }>
                  {products.map(product => renderProductCard(product))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                        page === 1
                          ? 'cursor-not-allowed text-gray-400'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <ChevronLeft className="mr-2 h-5 w-5" />
                      Previous
                    </button>
                    
                    <div className="hidden sm:flex">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`relative inline-flex items-center border px-4 py-2 text-sm font-medium ${
                            page === pageNum
                              ? 'z-10 border-indigo-500 bg-indigo-50 text-indigo-600'
                              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}
                    </div>
                    
                    <div className="flex items-center sm:hidden">
                      <span className="text-sm text-gray-700">
                        Page {page} of {totalPages}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                        page === totalPages
                          ? 'cursor-not-allowed text-gray-400'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Next
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </button>
                  </div>
                )}
                
                {/* Results Count */}
                <div className="mt-4 text-sm text-gray-500">
                  Showing {(page - 1) * limit + 1} to {Math.min(page * limit, totalItems)} of {totalItems} products
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;