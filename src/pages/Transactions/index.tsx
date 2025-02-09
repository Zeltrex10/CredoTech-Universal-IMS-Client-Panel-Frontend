import React, { useState, useEffect, useRef } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { ConfirmationModal } from "../../components/ui/ConfirmationModal";
import { transactionsApi, productsApi } from "../../services";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { TransactionModal } from "./TransactionModal";
import { useForm } from "react-hook-form";
import "./Transactions.css"; // Import the CSS file
// import { Transactions } from "../Transactions"; // Remove this import

interface Transaction {
  id: string;
  productId: {
    id: string;
    name: string;
    sku: string;
  };
  type: string;
  quantity: number;
  date: string;
  addedBy: string;
}

// interface TransactionModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSuccess: (newTransaction: Transaction) => void;
//   className?: string;
// }

interface TransactionDetailsProps {
  transaction: Transaction;
  onClose: () => void;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({
  transaction,
  onClose,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400">
            Product
          </label>
          <p className="mt-1 text-sm text-neutral-900 dark:text-neutral-50">
            {transaction.productId.name}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400">
            SKU
          </label>
          <p className="mt-1 text-sm text-neutral-900 dark:text-neutral-50">
            {transaction.productId.sku}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400">
            Type
          </label>
          <p className="mt-1">
            <span
              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                transaction.type === "stock-in"
                  ? "bg-success-100 text-success-800 dark:bg-success-900/50 dark:text-success-200"
                  : "bg-error-100 text-error-800 dark:bg-error-900/50 dark:text-error-200"
              }`}
            >
              {transaction.type === "stock-in" ? "Stock In" : "Stock Out"}
            </span>
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400">
            Quantity
          </label>
          <p className="mt-1 text-sm text-neutral-900 dark:text-neutral-50">
            {transaction.quantity} units
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400">
            Date
          </label>
          <p className="mt-1 text-sm text-neutral-900 dark:text-neutral-50">
            {format(new Date(transaction.date), "EEEE, MMMM do, yyyy h:mm a")}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400">
            Added By
          </label>
          <p className="mt-1 text-sm text-neutral-900 dark:text-neutral-50">
            {transaction.addedBy}
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

interface ApiResponse<T> {
  transactions: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface ClearHistoryFormInputs {
  startDate: string;
  endDate: string;
}

export const TransactionsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] =
    useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(10); // Adjust the number of transactions per page
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<ClearHistoryFormInputs>();

  const fetchTransactions = async () => {
    try {
      const response = await transactionsApi.getAll();
      const { transactions: fetchedTransactions } =
        response.data as ApiResponse<Transaction>;
      setTransactions(fetchedTransactions || []);
      setFilteredTransactions(fetchedTransactions || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to load transactions");
      setIsLoading(false);
    }
  };

  const updateProductQuantity = async (transaction: Transaction) => {
    try {
      const productResponse = await productsApi.getById(transaction.productId.id);
      const product = productResponse.data;

      const updatedQuantity =
        transaction.type === "stock-in"
          ? product.quantity + transaction.quantity
          : product.quantity - transaction.quantity;

      await productsApi.update(transaction.productId.id, {
        ...product,
        quantity: updatedQuantity,
      });
      console.log(`Product ${product.id} quantity updated to ${updatedQuantity}`);
      toast.success(`Product ${product.id} quantity updated to ${updatedQuantity}`);
    } catch (error) {
      console.error(`Error updating product quantity for product ${transaction.productId.id}:`, error);
      //toast.error(`Failed to update product quantity for product ${transaction.productId.name}`);
      throw error; // Re-throw the error to handle it in the calling function
    }
  };

  const clearAllTransactions = async () => {
    if (transactions.length === 0) {
      toast.info("No transactions to clear.");
      return;
    }

    try {
      await transactionsApi.deleteAll();
      toast.success("All transactions cleared successfully");
      fetchTransactions(); // Refresh the transactions list
    } catch (error) {
      console.error("Error clearing all transactions:", error);
      toast.error("Failed to clear all transactions");
    }
  };

  const filterTransactionsByDateRange = (startDate: Date, endDate: Date) => {
    const filtered = transactions.filter(
      (transaction) =>
        new Date(transaction.date) >= startDate && new Date(transaction.date) <= endDate
    );
    setFilteredTransactions(filtered);
  };

  const connectWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    wsRef.current = new WebSocket('ws://localhost:8000');

    wsRef.current.onopen = () => {
      console.log('WebSocket connection established');
      if (reconnectIntervalRef.current) {
        clearInterval(reconnectIntervalRef.current);
        reconnectIntervalRef.current = null;
      }
    };

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'TRANSACTION_UPDATED') {
          setTransactions(data.transactions);
          setFilteredTransactions(data.transactions);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    wsRef.current.onclose = () => {
      console.log('WebSocket connection closed, attempting to reconnect...');
      if (!reconnectIntervalRef.current) {
        reconnectIntervalRef.current = setInterval(connectWebSocket, 1000);
      }
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      wsRef.current?.close();
    };
  };

  useEffect(() => {
    fetchTransactions();
    connectWebSocket();

    // Set the end date to the current date
    setValue("endDate", new Date().toISOString().split("T")[0]);

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectIntervalRef.current) {
        clearInterval(reconnectIntervalRef.current);
      }
    };
  }, []);

  const handleTransactionSuccess = (newTransaction: Transaction) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      newTransaction.addedBy = user.name; // Add this line
      updateProductQuantity(newTransaction).then(() => fetchTransactions());
    } catch (error) {
      console.error("Error handling transaction success:", error);
    }
  };

  const onSubmit = (data: ClearHistoryFormInputs) => {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    filterTransactionsByDateRange(startDate, endDate);
  };

  const sortTransactions = (key: string) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
      const aValue = key === 'productId.name' ? a.productId.name : a[key as keyof Transaction];
      const bValue = key === 'productId.name' ? b.productId.name : b[key as keyof Transaction];

      if (aValue < bValue) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    setFilteredTransactions(sortedTransactions);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    const filtered = transactions.filter((transaction) => {
      const productName = transaction.productId.name.toLowerCase();
      const type = transaction.type.toLowerCase();
      const quantity = transaction.quantity.toString();
      const date = format(new Date(transaction.date), "EEEE, MMMM do, yyyy h:mm a").toLowerCase();
      const searchTermLower = e.target.value.toLowerCase();

      return (
        productName.includes(searchTermLower) ||
        type.includes(searchTermLower) ||
        quantity.includes(searchTermLower) ||
        date.includes(searchTermLower)
      );
    });
    setFilteredTransactions(filtered);
  };

  // Pagination logic
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleClearAllTransactions = () => {
    if (transactions.length === 0) {
      toast.info("No transactions to clear.");
      return;
    }

    const lastDate = transactions[0]?.date ? format(new Date(transactions[0].date), "MMMM do, yyyy") : "N/A";
    const latestDate = transactions[transactions.length - 1]?.date ? format(new Date(transactions[transactions.length - 1].date), "MMMM do, yyyy") : "N/A";
    const message = `Are you sure you want to clear all the transaction history from ${lastDate} up to ${latestDate}?`;
    setIsConfirmationModalOpen(true);
  };

  const confirmClearAllTransactions = () => {
    setIsConfirmationModalOpen(false);
    clearAllTransactions();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
            Transactions
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            View and manage inventory transactions
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-2">
          <Button
            className="gap-2"
            onClick={() => setIsNewTransactionModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add Transaction
          </Button>
          <Button
            className="gap-2"
            onClick={handleClearAllTransactions}
          >
            Clear All Transactions
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              {...register("startDate", { required: true })}
              className="mt-1 block w-full md:w-auto rounded-md border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
            {errors.startDate && <span className="text-red-500 text-sm">Start date is required</span>}
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              {...register("endDate", { required: true })}
              className="mt-1 block w-full md:w-auto rounded-md border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
            {errors.endDate && <span className="text-red-500 text-sm">End date is required</span>}
          </div>
        </div>
        <Button type="submit" className="mt-4 md:mt-0">
          Filter Transactions
        </Button>
      </form>

      <div className="mt-4 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
        </div>
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="block w-full md:w-1/3 pl-10 pr-3 py-2 rounded-md border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-800 shadow-sm rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
          {currentTransactions.length === 0 ? (
            <div className="p-4 text-center text-neutral-500 dark:text-neutral-400">
              No Available Transaction History
            </div>
          ) : (
            <div className="table-container">
              <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
                <thead className="bg-neutral-50 dark:bg-neutral-800">
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => sortTransactions('productId.name')}
                    >
                      Product
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => sortTransactions('type')}
                    >
                      Type
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => sortTransactions('quantity')}
                    >
                      Quantity
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => sortTransactions('date')}
                    >
                      Date
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => sortTransactions('addedBy')}
                    >
                      Added By
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
                  {currentTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedTransaction(transaction)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          {transaction.productId.name}
                        </div>
                        <div className="text-sm text-neutral-500 dark:text-neutral-400">
                          {transaction.productId.sku}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            transaction.type === "stock-in"
                              ? "bg-success-100 text-success-800 dark:bg-success-900/50 dark:text-success-200"
                              : "bg-error-100 text-error-800 dark:bg-error-900/50 dark:text-error-200"
                          }`}
                        >
                          {transaction.type === "stock-in" ? "Stock In" : "Stock Out"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                        {transaction.quantity} units
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                        {format(new Date(transaction.date), "EEEE, MMMM do, yyyy h:mm a")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                        {transaction.addedBy}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex justify-center py-4">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              {[...Array(Math.ceil(filteredTransactions.length / transactionsPerPage)).keys()].map((number) => (
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

      <Modal
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        title="Transaction Details"
      >
        {selectedTransaction && (
          <TransactionDetails
            transaction={selectedTransaction}
            onClose={() => setSelectedTransaction(null)}
          />
        )}
      </Modal>

      <TransactionModal
        isOpen={isNewTransactionModalOpen}
        onClose={() => setIsNewTransactionModalOpen(false)}
        onSuccess={handleTransactionSuccess}
      />

      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={confirmClearAllTransactions}
        message={`Are you sure you want to clear all the transaction history from ${transactions[0]?.date ? format(new Date(transactions[0].date), "MMMM do, yyyy") : "N/A"} up to ${transactions[transactions.length - 1]?.date ? format(new Date(transactions[transactions.length - 1].date), "MMMM do, yyyy") : "N/A"}?`}
      />
    </div>
  );
};