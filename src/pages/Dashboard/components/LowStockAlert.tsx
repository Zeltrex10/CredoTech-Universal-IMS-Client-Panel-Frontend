import React from 'react';
import { AlertTriangle } from 'lucide-react';
import type { Product } from '../../../types';

interface LowStockAlertProps {
  products: Product[];
}

export const LowStockAlert: React.FC<LowStockAlertProps> = ({ products }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Low Stock Alerts</h2>
          <span className="px-2.5 py-0.5 rounded-full text-sm font-medium bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200">
            {products.length} items
          </span>
        </div>
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-amber-50 dark:bg-amber-900/50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">SKU: {product.sku}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{product.quantity} units</p>
                <p className="text-sm text-red-600 dark:text-red-400">
                  Below {product.lowStockThreshold}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};