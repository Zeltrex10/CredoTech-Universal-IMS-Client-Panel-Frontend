import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ProductTable } from './components/ProductTable';
import { ProductForm } from './components/ProductForm';
import { useInventory } from './hooks/useInventory';
import type { Product } from '../../types';

export const Inventory: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const { products, isLoading, error, fetchProducts, addProduct, updateProduct, deleteProduct } = useInventory();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSubmit = async (data: Partial<Product>) => {
    try {
      if (selectedProduct) {
        await updateProduct(selectedProduct.id, data);
      } else {
        await addProduct(data);
      }
      setIsFormOpen(false);
      setSelectedProduct(undefined);
    } catch (err) {
      // Error handling is done in the hook
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
      } catch (err) {
        // Error handling is done in the hook
      }
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 dark:text-red-400">
        Error loading inventory data
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Inventory</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {isFormOpen ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <ProductForm
            product={selectedProduct}
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedProduct(undefined);
            }}
          />
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <ProductTable
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      )}
    </div>
  );
};