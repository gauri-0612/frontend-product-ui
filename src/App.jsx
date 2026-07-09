import { useState, useEffect } from 'react';
import { productService } from './services/productService';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';

function App() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (productData) => {
    try {
      const newProduct = await productService.create(productData);
      setProducts([...products, newProduct]);
      setError(null);
    } catch (err) {
      setError('Failed to create product');
      console.error(err);
    }
  };

  const handleUpdate = async (productData) => {
    try {
      const updatedProduct = await productService.update(editingProduct.id, productData);
      setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      setEditingProduct(null);
      setError(null);
    } catch (err) {
      setError('Failed to update product');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await productService.delete(id);
      setProducts(products.filter(p => p.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete product');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Product Management
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <ProductForm
              onSubmit={editingProduct ? handleUpdate : handleCreate}
              initialData={editingProduct || {}}
              isEditing={!!editingProduct}
            />
            {editingProduct && (
              <button
                onClick={() => setEditingProduct(null)}
                className="mt-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel Editing
              </button>
            )}
          </div>

          <div>
            {loading ? (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-center text-gray-500">Loading products...</p>
              </div>
            ) : (
              <ProductList
                products={products}
                onEdit={setEditingProduct}
                onDelete={handleDelete}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;