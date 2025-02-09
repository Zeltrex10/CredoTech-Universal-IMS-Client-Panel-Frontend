export interface User {
	id: string;
	name: string;
	email: string;
	role: "admin" | "staff";
}

export interface Category {
	id: string;
	name: string;
	description?: string;
	productCount: number;
	createdAt: string;
	updatedAt: string;
}

export interface Product {
	id: string;
	name: string;
	description?: string;
	sku: string;
	category: Category;
	price: number;
	quantity: number;
	lowStockThreshold: number;
	createdAt: string;
	updatedAt: string;
}

export interface Transaction {
  _id?: string;
  id: string;
  type: "stock-in" | "stock-out";
  productId: {
    id: string;
    name: string;
    sku: string;
  };
  quantity: number;
  date: string;
}
