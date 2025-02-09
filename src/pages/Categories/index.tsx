import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash, Search } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { categoriesApi, productsApi } from "../../services";
import { toast } from "react-toastify";
import { format, parseISO, isValid } from "date-fns";
import { CategoryModal } from "./CategoryModal";

interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

interface Product {
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
}

interface CategoryDetailsProps {
  category: Category;
  onClose: () => void;
}

const formatDate = (dateString: string): string => {
  try {
    if (!dateString) {
      console.warn("Empty date string received:", dateString);
      return "N/A";
    }

    const date = parseISO(dateString);
    if (!isValid(date)) {
      const mongoDate = new Date(dateString);
      if (!isValid(mongoDate)) {
        console.warn("Invalid date:", dateString);
        return "N/A";
      }
      return format(mongoDate, "MMM d, yyyy");
    }

    return format(date, "MMM d, yyyy");
  } catch (error) {
    console.error("Error formatting date:", error, "Date string:", dateString);
    return "N/A";
  }
};

const CategoryDetails: React.FC<CategoryDetailsProps> = ({
  category,
  onClose,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await productsApi.getAll();
        const categoryProducts = data.filter(
          (product: Product) => product.category.id === category.id
        );
        setProducts(categoryProducts);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [category.id]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400">
            Name
          </label>
          <p className="mt-1 text-sm text-neutral-900 dark:text-neutral-50">
            {category.name}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400">
            Product Count
          </label>
          <p className="mt-1 text-sm text-neutral-900 dark:text-neutral-50">
            {category.productCount} products
          </p>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400">
            Description
          </label>
          <p className="mt-1 text-sm text-neutral-900 dark:text-neutral-50">
            {category.description}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-50 mb-3">
          Products in this category
        </h4>
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <ul className="divide-y divide-neutral-200 dark:divide-neutral-700">
            {products.map((product) => (
              <li
                key={product.id}
                className="py-3 cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <span className="text-sm text-neutral-900 dark:text-neutral-50">
                  {product.name}
                </span>
              </li>
            ))}
            {products.length === 0 && (
              <li className="py-3 text-sm text-neutral-500 dark:text-neutral-400">
                No products in this category
              </li>
            )}
          </ul>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>

      <Modal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title="Product Details"
      >
        {selectedProduct && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Name
                </label>
                <p className="mt-1 text-sm text-neutral-900 dark:text-neutral-50">
                  {selectedProduct.name}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  SKU
                </label>
                <p className="mt-1 text-sm text-neutral-900 dark:text-neutral-50">
                  {selectedProduct.sku}
                </p>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Description
                </label>
                <p className="mt-1 text-sm text-neutral-900 dark:text-neutral-50">
                  {selectedProduct.description}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Category
                </label>
                <p className="mt-1 text-sm text-neutral-900 dark:text-neutral-50">
                  {selectedProduct.category.name}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Quantity
                </label>
                <p className="mt-1 text-sm text-neutral-900 dark:text-neutral-50">
                  {selectedProduct.quantity} units
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Low Stock Threshold
                </label>
                <p className="mt-1 text-sm text-neutral-900 dark:text-neutral-50">
                  {selectedProduct.lowStockThreshold} units
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Stock Status
                </label>
                <p className="mt-1">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      Number(selectedProduct.quantity) <=
                      Number(selectedProduct.lowStockThreshold)
                        ? "bg-error-100 text-error-800 dark:bg-error-900/50 dark:text-error-200"
                        : "bg-success-100 text-success-800 dark:bg-success-900/50 dark:text-success-200"
                    }`}
                  >
                    {Number(selectedProduct.quantity) <=
                    Number(selectedProduct.lowStockThreshold)
                      ? "Low Stock"
                      : "In Stock"}
                  </span>
                </p>
              </div>
              {selectedProduct.imageUrl && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Product Image
                  </label>
                  <img
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.name}
                    className="mt-1 w-full h-auto rounded-md"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export const Categories: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDeleteWarningModalOpen, setIsDeleteWarningModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [productsInCategory, setProductsInCategory] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage] = useState(10); // Adjust the number of categories per page
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchCategories = async () => {
    try {
      const categoriesResponse = await categoriesApi.getAll();
      const productsResponse = await productsApi.getAll();
      const categoriesData = categoriesResponse.data as Category[];
      const productsData = productsResponse.data as Product[];

      // Update productCount for each category
      const updatedCategories = categoriesData.map((category) => {
        const productCount = productsData
          .filter((product) => product.category.id === category.id)
          .reduce((total, product) => total + parseInt(product.quantity, 10), 0);
        return { ...category, productCount };
      });

      console.log("API Response:", categoriesResponse.data);
      console.log("Fetched Categories:", updatedCategories);
      setCategories(updatedCategories);
      setProducts(productsData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
  };

  const handleDelete = async (categoryId: string) => {
    try {
      await categoriesApi.delete(categoryId);
      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    const productsInCategory = products.filter((product) => product.category.id === category.id);
    setProductsInCategory(productsInCategory);
    setIsDeleteWarningModalOpen(true);
  };

  const confirmDelete = async () => {
    if (categoryToDelete) {
      await handleDelete(categoryToDelete.id);
      setIsDeleteWarningModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  // Pagination logic
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Sorting logic
  const sortedCategories = [...categories].sort((a, b) => {
    if (sortConfig !== null) {
      const { key, direction } = sortConfig;
      if ((a[key as keyof Category] ?? '') < (b[key as keyof Category] ?? '')) {
        return direction === 'ascending' ? -1 : 1;
      }
      if ((a[key as keyof Category] ?? '') > (b[key as keyof Category] ?? '')) {
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

  // Filter categories based on search term and date range
  const filteredCategories = sortedCategories.filter((category) => {
    const searchTermLower = searchTerm.toLowerCase();
    const categoryName = category.name.toLowerCase();
    const categoryDescription = category.description.toLowerCase();
    const categoryCreatedAt = formatDate(category.createdAt).toLowerCase();

    const matchesSearchTerm =
      categoryName.includes(searchTermLower) ||
      categoryDescription.includes(searchTermLower) ||
      categoryCreatedAt.includes(searchTermLower);

    const matchesDateRange =
      (!startDate || new Date(category.createdAt) >= new Date(startDate)) &&
      (!endDate || new Date(category.createdAt) <= new Date(endDate));

    return matchesSearchTerm && matchesDateRange;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
            Categories
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Manage your product categories
          </p>
        </div>
        <Button
          className="gap-2"
          onClick={() => setIsNewCategoryModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="mt-4 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
        </div>
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full md:w-1/3 pl-10 pr-3 py-2 rounded-md border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      <div className="mt-4 flex space-x-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-800 shadow-sm rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
          <div className="overflow-x-auto max-h-96">
            <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
              <thead className="bg-neutral-50 dark:bg-neutral-800">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('name')}
                  >
                    Name
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('description')}
                  >
                    Description
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('productCount')}
                  >
                    Products
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('createdAt')}
                  >
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
                {filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory).map((category) => (
                  <tr
                    key={category.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedCategory(category)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {category.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-500 dark:text-neutral-400">
                        {category.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-200">
                        {category.productCount} products
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                      {formatDate(category.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingCategory(category);
                        }}
                        aria-label="Edit Category"
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
                          handleDeleteClick(category);
                        }}
                        aria-label="Delete Category"
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
        </div>
      )}

      <div className="flex justify-center py-4">
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          {[...Array(Math.ceil(filteredCategories.length / categoriesPerPage)).keys()].map((number) => (
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

      <CategoryModal
        isOpen={isNewCategoryModalOpen}
        onClose={() => setIsNewCategoryModalOpen(false)}
        onSuccess={() => {
          fetchCategories();
          setIsNewCategoryModalOpen(false);
        }}
      />

      <CategoryModal
        isOpen={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        onSuccess={() => {
          fetchCategories();
          setEditingCategory(null);
        }}
        category={editingCategory || undefined}
      />

      <Modal
        isOpen={!!selectedCategory}
        onClose={() => setSelectedCategory(null)}
        title="Category Details"
      >
        {selectedCategory && (
          <CategoryDetails
            category={selectedCategory}
            onClose={() => setSelectedCategory(null)}
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
            Deleting this category will affect the following products:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            {productsInCategory.map((product) => (
              <li key={product.id} className="text-sm text-neutral-900 dark:text-neutral-50">
                {product.name}
              </li>
            ))}
          </ul>
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
