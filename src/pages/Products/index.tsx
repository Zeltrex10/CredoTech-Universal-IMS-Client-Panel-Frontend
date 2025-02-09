import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash, Search } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { productsApi, categoriesApi } from "../../services";
import { toast } from "react-toastify";
import { ProductModal } from "./ProductModal";
import "./Products.css"; // Import the CSS file

interface Product {
  _id?: string;
  id: string;
  name: string;
  description: string;
  sku: string;
  category: {
    id: string;
    name: string;
  };
  quantity: number;
  lowStockThreshold: number;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  price: number;
}

interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

interface ProductDetailsProps {
  product: Product;
  onClose: () => void;
  setEditingProduct: (product: Product | null) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  onClose,
  setEditingProduct,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400">
            Name
          </label>
          <p className="mt-1 text-sm text-neutral-900 dark:text-neutral-50">
            {product.name}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400">
            SKU
          </label>
          <p className="mt-1 text-sm text-neutral-900 dark:text-neutral-50">
            {product.sku}
          </p>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400">
            Description
          </label>
          <p className="mt-1 text-sm text-neutral-900 dark:text-neutral-50">
            {product.description}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400">
            Category
          </label>
          <p className="mt-1 text-sm text-neutral-900 dark:text-neutral-50">
            {product.category.name}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400">
            Quantity
          </label>
          <p className="mt-1 text-sm text-neutral-900 dark:text-neutral-50">
            {product.quantity} units
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400">
            Low Stock Threshold
          </label>
          <p className="mt-1 text-sm text-neutral-900 dark:text-neutral-50">
            {product.lowStockThreshold} units
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400">
            Stock Status
          </label>
          <p className="mt-1">
            <span
              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                Number(product.quantity) <= Number(product.lowStockThreshold)
                  ? "bg-error-100 text-error-800 dark:bg-error-900/50 dark:text-error-200"
                  : "bg-success-100 text-success-800 dark:bg-success-900/50 dark:text-success-200"
              }`}
            >
              {Number(product.quantity) <= Number(product.lowStockThreshold)
                ? "Low Stock"
                : "In Stock"}
            </span>
          </p>
        </div>
        {product.imageUrl && (
          <div className="col-span-2">
            <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Product Image
            </label>
            <img
              src={product.imageUrl}
              alt={product.name}
              className="mt-1 w-full h-auto rounded-md"
            />
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button
          className="gap-2"
          onClick={() => {
            onClose();
            setEditingProduct(product);
          }}
        >
          <Edit className="h-4 w-4" />
          Edit Product
        </Button>
      </div>
    </div>
  );
};

// interface ApiResponse<T> {
//   products: T[];
//   pagination: {
//     page: number;
//     limit: number;
//     total: number;
//     pages: number;
//   };
// }

export const Products: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDeleteWarningModalOpen, setIsDeleteWarningModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10); // Adjust the number of products per page
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCategories = async () => {
    try {
      const response = await categoriesApi.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productsApi.getAll();
      const fetchedProducts = response.data;
      setProducts(fetchedProducts || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
      setIsLoading(false);
    }
  };

  const updateProductCategories = () => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        const category = categories.find(
          (category) => category.id === product.category.id
        );
        if (category) {
          return {
            ...product,
            category: {
              id: category.id,
              name: category.name,
            },
          };
        }
        return product;
      })
    );
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    updateProductCategories();
  }, [categories]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'CATEGORY_UPDATED') {
        setCategories(data.categories);
      } else if (data.type === 'PRODUCT_UPDATED') {
        fetchProducts();
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteWarningModalOpen(true);
  };

  const handleDelete = async (productId: string) => {
    try {
      await productsApi.delete(productId);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      await handleDelete(productToDelete.id);
      setIsDeleteWarningModalOpen(false);
      setProductToDelete(null);
    }
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Sorting logic
  const sortedProducts = [...currentProducts].sort((a, b) => {
    if (sortConfig !== null) {
      const { key, direction } = sortConfig;
      if ((a[key as keyof Product] ?? '') < (b[key as keyof Product] ?? '')) {
        return direction === 'ascending' ? -1 : 1;
      }
      if ((a[key as keyof Product] ?? '') > (b[key as keyof Product] ?? '')) {
        return direction === 'ascending' ? 1 : -1;
      }
    }
    return 0;
  });

  const requestSort = (key: string) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Filter products based on search term
  const filteredProducts = sortedProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
            Products
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Manage your inventory products
          </p>
        </div>
        <Button
          className="gap-2"
          onClick={() => setIsNewProductModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="mt-4 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
        </div>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full md:w-1/3 pl-10 pr-3 py-2 rounded-md border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-800 shadow-sm rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
          <div className="table-container">
            <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
              <thead className="bg-neutral-50 dark:bg-neutral-800">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('name')}
                  >
                    Product
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('sku')}
                  >
                    SKU
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('category.name')}
                  >
                    Category
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('quantity')}
                  >
                    Quantity
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('lowStockThreshold')}
                  >
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
                {filteredProducts.map((product) => (
                  <tr
                    key={product._id || product.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {product.name}
                      </div>
                      <div className="text-sm text-neutral-500 dark:text-neutral-400">
                        {product.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                      {product.category.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                      {product.quantity} units
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          Number(product.quantity) <= Number(product.lowStockThreshold)
                            ? "bg-error-100 text-error-800 dark:bg-error-900/50 dark:text-error-200"
                            : "bg-success-100 text-success-800 dark:bg-success-900/50 dark:text-success-200"
                        }`}
                      >
                        {Number(product.quantity) <= Number(product.lowStockThreshold)
                          ? "Low Stock"
                          : "In Stock"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingProduct(product);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(product);
                        }}
                      >
                        <Trash className="h-4 w-4" />
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center py-4">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              {[...Array(Math.ceil(products.length / productsPerPage)).keys()].map((number) => (
                <button
                  key={number + 1}
                  onClick={() => paginate(number + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 ${
                    currentPage === number + 1 ? "z-10 bg-primary-50 dark:bg-primary-900 border-primary-500 text-primary-600" : ""
                  }`}
                >
                  {number + 1}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      <ProductModal
        isOpen={isNewProductModalOpen}
        onClose={() => setIsNewProductModalOpen(false)}
        onSuccess={() => {
          fetchProducts();
          setIsNewProductModalOpen(false);
        }}
      />

      <ProductModal
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        onSuccess={() => {
          fetchProducts();
          setEditingProduct(null);
        }}
        product={editingProduct || undefined}
      />

      <Modal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title="Product Details"
      >
        {selectedProduct && (
          <ProductDetails
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            setEditingProduct={setEditingProduct}
          />
        )}
      </Modal>

      <Modal
        isOpen={isDeleteWarningModalOpen}
        onClose={() => setIsDeleteWarningModalOpen(false)}
        title="Warning"
      >
        <div className="space-y-4">
          <p className="text-sm text-neutral-900 dark:text-neutral-50">
            Are you sure you want to delete the product "{productToDelete?.name}" with {productToDelete?.quantity} units in stock?
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsDeleteWarningModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
