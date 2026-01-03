import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    description: '',
    image: '',
    brand: '',
    category: '',
    countInStock: 0,
  });

  const [loading, setLoading] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const fetchProduct = async () => {
        try {
          const response = await fetch(`/api/admin/products/${id}`);
          if (response.ok) {
            const product = await response.json();
            setFormData({
              name: product.name,
              price: product.price,
              description: product.description,
              image: product.image,
              brand: product.brand,
              category: product.category,
              countInStock: product.countInStock,
            });
          }
        } catch (error) {
          console.error('Error fetching product:', error);
        }
      };

      fetchProduct();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'countInStock' ? Number(value) : value,
    }));
  };

  const generateAiDescription = async () => {
    if (!formData.name || !formData.brand || !formData.category) {
      alert('Please fill in product name, brand, and category first');
      return;
    }

    setIsGeneratingDescription(true);

    try {
      const specs = `
        Category: ${formData.category}
        Brand: ${formData.brand}
        Price: $${formData.price}
      `;

      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          specs,
          tone: 'Professional',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Strip HTML tags for the textarea
        const plainText = data.description.replace(/<[^>]*>/g, '');
        setFormData((prev) => ({
          ...prev,
          description: plainText,
        }));
      }
    } catch (error) {
      console.error('Error generating AI description:', error);
      alert('Failed to generate AI description');
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEdit ? `/api/admin/products/${id}` : '/api/admin/products';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate('/admin/products');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Link
        to="/admin/products"
        className="inline-flex items-center text-gray-400 hover:text-primary mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Products
      </Link>

      <h1 className="text-3xl font-bold text-white mb-8">
        {isEdit ? 'Edit Product' : 'Add Product'}
      </h1>

      <div className="bg-surface rounded-lg border border-gray-800 p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-400 mb-2">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-dark border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Price ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full bg-dark border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full bg-dark border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-dark border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Image URL</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full bg-dark border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Count In Stock</label>
              <input
                type="number"
                name="countInStock"
                value={formData.countInStock}
                onChange={handleChange}
                min="0"
                className="w-full bg-dark border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-primary"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-gray-400">Description</label>
              <button
                type="button"
                onClick={generateAiDescription}
                disabled={isGeneratingDescription}
                className="flex items-center text-sm text-primary hover:text-cyan-400 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 mr-1" />
                {isGeneratingDescription ? 'Generating...' : 'Generate with AI'}
              </button>
            </div>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="6"
              className="w-full bg-dark border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-primary"
              required
            />
            {isGeneratingDescription && (
              <div className="mt-2 text-gray-400 text-sm">
                Generating AI description...
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-black font-bold py-2 px-6 rounded hover:bg-cyan-400 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEdit;