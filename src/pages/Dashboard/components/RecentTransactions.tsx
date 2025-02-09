import React from 'react';
import { format } from 'date-fns';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { Transaction } from '../../../types';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h2>
        <div className="mt-4 space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  transaction.type === 'stock-in' 
                    ? "bg-green-50 dark:bg-green-900/50" 
                    : "bg-red-50 dark:bg-red-900/50"
                )}>
                  {transaction.type === 'stock-in' 
                    ? <ArrowUpRight className="w-5 h-5 text-green-600 dark:text-green-400" />
                    : <ArrowDownRight className="w-5 h-5 text-red-600 dark:text-red-400" />
                  }
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {transaction.type === 'stock-in' ? 'Stock In' : 'Stock Out'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {format(new Date(transaction.date), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {transaction.quantity} units
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};