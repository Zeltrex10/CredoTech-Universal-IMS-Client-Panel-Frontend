import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { productsApi, Transaction, transactionsApi } from "../../services";
import { toast } from "react-toastify";
import { useAuthStore } from "../../store/authStore";
import { useForm } from "react-hook-form";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newTransaction: Transaction) => void;
  className?: string;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  className,
}) => {
  const { user } = useAuthStore();
  const { register, handleSubmit, reset, watch } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<
    Array<{
      id: string;
      name: string;
      sku: string;
      quantity: number;
    }>
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductQuantity, setSelectedProductQuantity] = useState<number | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsApi.getAll();
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
      }
    };

    fetchProducts();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);

    const quantity = parseInt(data.quantity, 10);

    if (data.type === "stock-out" && selectedProductQuantity !== null && quantity > selectedProductQuantity) {
      toast.warning(`Insufficient stocks, ${products.find(product => product.id === data.productId)?.name} quantity is currently ${selectedProductQuantity}`);
      setIsLoading(false);
      return;
    }

    try {
      const response = await transactionsApi.create({
        ...data,
        quantity,
        addedBy: user?.name, // Include the "Added By" field
      });
      onSuccess(response.data);
      toast.success("Transaction created successfully");

      // Update the product quantity locally
      const updatedProducts = products.map((product) => {
        if (product.id === data.productId) {
          return {
            ...product,
            quantity:
              data.type === "stock-in"
                ? product.quantity + quantity
                : product.quantity - quantity,
          };
        }
        return product;
      });
      setProducts(updatedProducts);

      // Update the selected product quantity
      const selectedProduct = updatedProducts.find((product) => product.id === data.productId);
      setSelectedProductQuantity(selectedProduct ? selectedProduct.quantity : null);

      reset();
      onClose();
    } catch (error) {
      console.error("Error creating transaction:", error);
      toast.error("Failed to create transaction");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Watch for changes in the selected product
  const selectedProductId = watch("productId");
  useEffect(() => {
    const selectedProduct = products.find((product) => product.id === selectedProductId);
    setSelectedProductQuantity(selectedProduct ? selectedProduct.quantity : null);
  }, [selectedProductId, products]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Transaction" className={className}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Type
          </label>
          <select
            id="type"
            {...register("type", { required: true })}
            className="mt-1 block w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-center text-neutral-900 dark:text-neutral-100 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="stock-in">Stock In</option>
            <option value="stock-out">Stock Out</option>
          </select>
        </div>
        <div>
          <label htmlFor="productId" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Product
          </label>
          <input
            type="text"
            placeholder="Search product..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="mt-1 block w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-center text-neutral-900 dark:text-neutral-100 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
          <select
            id="productId"
            {...register("productId", { required: true })}
            className="mt-1 block w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-center text-neutral-900 dark:text-neutral-100 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="">Select a product</option>
            {filteredProducts.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} ({product.sku}) - {product.quantity} units
              </option>
            ))}
          </select>
        </div>
        {selectedProductQuantity !== null && (
          <div className="text-sm text-neutral-700 dark:text-neutral-300">
            Current Quantity: {selectedProductQuantity} units
          </div>
        )}
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Quantity
          </label>
          <input
            id="quantity"
            type="number"
            {...register("quantity", { required: true })}
            className="mt-1 block w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-center text-neutral-900 dark:text-neutral-100 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            min="1"
          />
        </div>
        <Button type="submit" className="w-full" isLoading={isLoading}>
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </form>
    </Modal>
  );
};
