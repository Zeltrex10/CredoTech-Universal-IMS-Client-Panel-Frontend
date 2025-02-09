import React, { useState, useEffect } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Tags,
  AlertTriangle,
} from "lucide-react";
import { productsApi, categoriesApi } from "../../services";
import { statsApi } from "../../services/api";
import { toast } from "react-toastify";

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalStock: number;
  lowStockProducts: number;
  productChange: string;
  categoryChange: string;
  stockChange: string;
  lowStockChange: string;
}

const getInitialStats = async (): Promise<DashboardStats> => {
  try {
    const response = await statsApi.getInitialStats();
    return response.data;
  } catch (error) {
    console.error("Failed to fetch initial stats", error);
    return {
      totalProducts: 0,
      totalCategories: 0,
      totalStock: 0,
      lowStockProducts: 0,
      productChange: "+0%",
      categoryChange: "+0%",
      stockChange: "+0%",
      lowStockChange: "+0%",
    };
  }
};

const storeInitialStats = async (stats: DashboardStats) => {
  try {
    await statsApi.storeInitialStats(stats);
  } catch (error) {
    console.error("Failed to store initial stats", error);
  }
};

const isNewDay = async (): Promise<boolean> => {
  try {
    const response = await statsApi.getLastResetDate();
    const lastResetDate = response.data.lastResetDate;
    const today = new Date().toISOString().split("T")[0];
    return lastResetDate !== today;
  } catch (error) {
    console.error("Failed to fetch last reset date", error);
    return true;
  }
};

const resetDailyStats = async () => {
  try {
    await statsApi.resetDailyStats();
  } catch (error) {
    console.error("Failed to reset daily stats", error);
  }
};

export const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCategories: 0,
    totalStock: 0,
    lowStockProducts: 0,
    productChange: "+0%",
    categoryChange: "+0%",
    stockChange: "+0%",
    lowStockChange: "+0%",
  });
  const [, setInitialStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (await isNewDay()) {
          await resetDailyStats();
        }

        const [productsRes, categoriesRes, initialStatsRes] = await Promise.all([
          productsApi.getAll(),
          categoriesApi.getAll(),
          getInitialStats(),
        ]);

        const products = productsRes.data || [];
        const categories = categoriesRes.data || [];
        const initialStats = initialStatsRes;

        const lowStockCount = products.filter(
          (product: any) => Number(product.quantity) <= Number(product.lowStockThreshold)
        ).length;

        const totalStock = products.reduce(
          (sum: number, product: any) => sum + Number(product.quantity),
          0
        );

        if (!initialStats.totalProducts && !initialStats.totalCategories && !initialStats.totalStock && !initialStats.lowStockProducts) {
          const newInitialStats = {
            totalProducts: products.length,
            totalCategories: categories.length,
            totalStock,
            lowStockProducts: lowStockCount,
            productChange: "+0%",
            categoryChange: "+0%",
            stockChange: "+0%",
            lowStockChange: "+0%",
          };
          setInitialStats(newInitialStats);
          await storeInitialStats(newInitialStats);
        } else {
          setInitialStats(initialStats);
        }

        const productChange = calculatePercentageChange(
          initialStats.totalProducts,
          products.length
        );
        const categoryChange = calculatePercentageChange(
          initialStats.totalCategories,
          categories.length
        );
        const stockChange = calculatePercentageChange(
          initialStats.totalStock,
          totalStock
        );
        const lowStockChange = calculatePercentageChange(
          initialStats.lowStockProducts,
          lowStockCount
        );

        setStats({
          totalProducts: products.length,
          totalCategories: categories.length,
          totalStock,
          lowStockProducts: lowStockCount,
          productChange,
          categoryChange,
          stockChange,
          lowStockChange,
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
        setIsLoading(false);
      }
    };

    fetchDashboardData();

    const intervalId = setInterval(fetchDashboardData, 1000);

    const ws = new WebSocket("ws://localhost:8000");

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "PRODUCTS_UPDATED" || message.type === "CATEGORIES_UPDATED") {
        fetchDashboardData();
      }
    };

    return () => {
      clearInterval(intervalId);
      ws.close();
    };
  }, []);

  const calculatePercentageChange = (
    previousValue: number,
    currentValue: number
  ): string => {
    if (previousValue === 0) {
      return currentValue === 0 ? "+0%" : "+100%";
    }
    const change = ((currentValue - previousValue) / previousValue) * 100;
    return `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;
  };

  const stats_items = [
    {
      name: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      change: stats.productChange,
      changeType: stats.productChange.startsWith("+") ? "positive" : "negative",
    },
    {
      name: "Total Categories",
      value: stats.totalCategories,
      icon: Tags,
      change: stats.categoryChange,
      changeType: stats.categoryChange.startsWith("+") ? "positive" : "negative",
    },
    {
      name: "Total Stock",
      value: stats.totalStock,
      icon: Package,
      change: stats.stockChange,
      changeType: stats.stockChange.startsWith("+") ? "positive" : "negative",
    },
    {
      name: "Low Stock Products",
      value: stats.lowStockProducts,
      icon: AlertTriangle,
      change: stats.lowStockChange,
      changeType: stats.lowStockChange.startsWith("+") ? "positive" : "negative",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
          Welcome to Credo Tech ISMS Client Panel
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Statistics of the Inventory System
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats_items.map((item) => (
          <div
            key={item.name}
            className="bg-white dark:bg-neutral-800 shadow-sm rounded-lg p-6 border border-neutral-200 dark:border-neutral-700"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-primary-50 dark:bg-primary-900/50 rounded-lg">
                  <item.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
              </div>
              <div
                className={`flex items-center text-sm font-medium ${
                  item.changeType === "positive"
                    ? "text-success-600 dark:text-success-400"
                    : "text-error-600 dark:text-error-400"
                }`}
              >
                {item.change}
                {item.changeType === "positive" ? (
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 ml-1" />
                )}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                {item.name}
              </h3>
              <p className="mt-2 text-3xl font-semibold text-neutral-900 dark:text-neutral-50">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
