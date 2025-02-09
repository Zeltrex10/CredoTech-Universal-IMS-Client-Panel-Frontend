import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { categoriesApi, productsApi } from "../../services";
import { toast } from "react-toastify";
import { storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: {
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
    imageUrl?: string;
    price: number;
  };
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  product,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    sku: product?.sku || "",
    categoryId: product?.category.id || "",
    quantity: product?.quantity || 0,
    lowStockThreshold: product?.lowStockThreshold || 0,
    imageUrl: product?.imageUrl || "",
    price: product?.price || 0,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(product?.imageUrl || null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesApi.getAll();
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        sku: product.sku,
        categoryId: product.category.id,
        quantity: product.quantity,
        lowStockThreshold: product.lowStockThreshold,
        imageUrl: product.imageUrl || "",
        price: product.price,
      });
      setImagePreview(product.imageUrl || null);
    } else {
      setFormData({
        name: "",
        description: "",
        sku: "",
        categoryId: "",
        quantity: 0,
        lowStockThreshold: 0,
        imageUrl: "",
        price: 0,
      });
      setImagePreview(null);
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const selectedCategory = categories.find(
        (category) => category.id === formData.categoryId
      ) as { id: string; name: string } | undefined;

      if (!selectedCategory) {
        toast.error("Invalid category selected");
        setIsLoading(false);
        return;
      }

      let imageUrl = formData.imageUrl;

      if (imageFile) {
        const storageRef = ref(storage, `products/${imageFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            null,
            (error) => {
              console.error("Error uploading image:", error);
              toast.error("Failed to upload image");
              reject(error);
            },
            async () => {
              imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      }

      const productData = {
        ...formData,
        category: {
          id: selectedCategory.id,
          name: selectedCategory.name,
        },
        imageUrl,
      };

      if (product) {
        await productsApi.update(product.id, productData);
        toast.success("Product updated successfully");
      } else {
        await productsApi.create(productData);
        toast.success("Product created successfully");
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(
        product ? "Failed to update product" : "Failed to create product"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" || name === "lowStockThreshold" || name === "price" ? Number(value) : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product ? "Edit Product" : "New Product"}>
      <form onSubmit={handleSubmit} className="space-y-6 text-center">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-center text-neutral-900 dark:text-neutral-100 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-center text-neutral-900 dark:text-neutral-100 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label htmlFor="sku" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            SKU
          </label>
          <input
            type="text"
            id="sku"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-center text-neutral-900 dark:text-neutral-100 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Category
          </label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-center text-neutral-900 dark:text-neutral-100 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-center text-neutral-900 dark:text-neutral-100 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label htmlFor="lowStockThreshold" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Low Stock Threshold
          </label>
          <input
            type="number"
            id="lowStockThreshold"
            name="lowStockThreshold"
            value={formData.lowStockThreshold}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-center text-neutral-900 dark:text-neutral-100 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

      

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Image
          </label>
          <input
            type="file"
            id="imageUrl"
            name="imageUrl"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-center text-neutral-900 dark:text-neutral-100 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
          {imagePreview && (
            <div className="mt-2">
              <img src={imagePreview} alt="Product Preview" className="max-h-40 rounded-md mx-auto" />
            </div>
          )}
        </div>

        <div className="flex justify-center space-x-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : product ? "Update" : "Create"}
          </Button> 
        </div>
      </form>
    </Modal>
  );
};
