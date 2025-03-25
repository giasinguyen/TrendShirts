import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, createProduct, updateProduct } from '../../../services/productService';
import { getAllCategories } from '../../../services/categoryService';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    sku: '',
    stockQuantity: '',
    material: '',
    categoryId: '',
    featured: false,
    newArrival: false,
    colorIds: [],
    sizeIds: [],
    images: []
  });
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const categoriesData = await getAllCategories();
        setCategories(categoriesData);
        
        // Fetch colors and sizes (You need to create these services)
        // const colorsData = await getAllColors();
        // const sizesData = await getAllSizes();
        // setColors(colorsData);
        // setSizes(sizesData);
        
        // For now, use mock data
        setColors([
          { id: 1, name: 'Red', hexCode: '#FF0000' },
          { id: 2, name: 'Blue', hexCode: '#0000FF' },
          { id: 3, name: 'Black', hexCode: '#000000' },
          { id: 4, name: 'White', hexCode: '#FFFFFF' }
        ]);
        
        setSizes([
          { id: 1, name: 'S', description: 'Small' },
          { id: 2, name: 'M', description: 'Medium' },
          { id: 3, name: 'L', description: 'Large' },
          { id: 4, name: 'XL', description: 'Extra Large' }
        ]);
        
        // If in edit mode, fetch product data
        if (isEditMode) {
          const productData = await getProductById(id);
          
          // Transform data as needed
          setFormData({
            name: productData.name || '',
            description: productData.description || '',
            price: productData.price || '',
            sku: productData.sku || '',
            stockQuantity: productData.stockQuantity || '',
            material: productData.material || '',
            categoryId: productData.categoryId || '',
            featured: productData.featured || false,
            newArrival: productData.newArrival || false,
            colorIds: productData.colorIds || [],
            sizeIds: productData.sizeIds || [],
            images: productData.images || []
          });
        }
      } catch (err) {
        setError('Failed to load form data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, isEditMode]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prevData => ({
        ...prevData,
        [name]: checked
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };
  
  const handleMultiSelect = (e, fieldName) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => Number(option.value));
    
    setFormData(prevData => ({
      ...prevData,
      [fieldName]: selectedOptions
    }));
  };
  
  const handleImageChange = (e, index) => {
    const { name, value } = e.target;
    
    setFormData(prevData => {
      const updatedImages = [...prevData.images];
      updatedImages[index] = {
        ...updatedImages[index],
        [name]: value
      };
      
      return {
        ...prevData,
        images: updatedImages
      };
    });
  };
  
  const addImage = () => {
    setFormData(prevData => ({
      ...prevData,
      images: [...prevData.images, { url: '', primary: false }]
    }));
  };
  
  const removeImage = (index) => {
    setFormData(prevData => {
      const updatedImages = [...prevData.images];
      updatedImages.splice(index, 1);
      
      return {
        ...prevData,
        images: updatedImages
      };
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Prepare data
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
        categoryId: parseInt(formData.categoryId)
      };
      
      if (isEditMode) {
        await updateProduct(id, productData);
      } else {
        await createProduct(productData);
      }
      
      // Redirect after success
      navigate('/admin/products');
    } catch (err) {
      setError('Failed to save product');
      console.error(err);
    }
  };
  
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </h1>
        <button
          onClick={() => navigate('/admin/products')}
          className="rounded-md bg-gray-100 px-4 py-2 text-sm text-gray-600 hover:bg-gray-200"
        >
          Cancel
        </button>
      </div>
      
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-red-800">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="col-span-1 md:col-span-1">
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          
          <div className="col-span-1 md:col-span-1">
            <label htmlFor="sku" className="mb-1 block text-sm font-medium text-gray-700">
              SKU
            </label>
            <input
              type="text"
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              required
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          ></textarea>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <label htmlFor="price" className="mb-1 block text-sm font-medium text-gray-700">
              Price
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                step="0.01"
                min="0"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full rounded-md border-gray-300 pl-7 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="stockQuantity" className="mb-1 block text-sm font-medium text-gray-700">
              Stock Quantity
            </label>
            <input
              type="number"
              min="0"
              id="stockQuantity"
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={handleChange}
              required
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label htmlFor="categoryId" className="mb-1 block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div>
          <label htmlFor="material" className="mb-1 block text-sm font-medium text-gray-700">
            Material
          </label>
          <input
            type="text"
            id="material"
            name="material"
            value={formData.material}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="colorIds" className="mb-1 block text-sm font-medium text-gray-700">
              Available Colors
            </label>
            <select
              multiple
              id="colorIds"
              name="colorIds"
              value={formData.colorIds}
              onChange={(e) => handleMultiSelect(e, 'colorIds')}
              className="h-32 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {colors.map(color => (
                <option key={color.id} value={color.id}>
                  {color.name} ({color.hexCode})
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">Hold Ctrl or Cmd to select multiple</p>
          </div>
          
          <div>
            <label htmlFor="sizeIds" className="mb-1 block text-sm font-medium text-gray-700">
              Available Sizes
            </label>
            <select
              multiple
              id="sizeIds"
              name="sizeIds"
              value={formData.sizeIds}
              onChange={(e) => handleMultiSelect(e, 'sizeIds')}
              className="h-32 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {sizes.map(size => (
                <option key={size.id} value={size.id}>
                  {size.name} - {size.description}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">Hold Ctrl or Cmd to select multiple</p>
          </div>
        </div>
        
        <div className="flex space-x-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
              Featured Product
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="newArrival"
              name="newArrival"
              checked={formData.newArrival}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="newArrival" className="ml-2 block text-sm text-gray-700">
              New Arrival
            </label>
          </div>
        </div>
        
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <h2 className="text-lg font-medium">Product Images</h2>
            <button
              type="button"
              onClick={addImage}
              className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Add Image
            </button>
          </div>
          <div className="p-4">
            {formData.images.length === 0 && (
              <div className="py-6 text-center text-gray-500">
                No images added yet. Click "Add Image" to add a product image.
              </div>
            )}
            
            {formData.images.map((image, index) => (
              <div key={index} className="mb-4 rounded border border-gray-200 p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="md:col-span-2">
                    <label htmlFor={`image-url-${index}`} className="mb-1 block text-sm font-medium text-gray-700">
                      Image URL
                    </label>
                    <input
                      type="text"
                      id={`image-url-${index}`}
                      name="url"
                      value={image.url}
                      onChange={(e) => handleImageChange(e, index)}
                      required
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`image-primary-${index}`}
                        name="primary"
                        checked={image.primary}
                        onChange={(e) => handleImageChange(e, index)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor={`image-primary-${index}`} className="ml-2 block text-sm text-gray-700">
                        Primary
                      </label>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="rounded-md bg-red-100 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-200"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                
                {image.url && (
                  <div className="mt-4">
                    <img
                      src={image.url}
                      alt="Preview"
                      className="h-24 rounded-md object-contain"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            {isEditMode ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;