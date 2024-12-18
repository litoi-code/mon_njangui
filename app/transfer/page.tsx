'use client'

import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

export default function Transfer() {
  const { accounts, addTransfer } = useAppContext();
  const [sourceAccountId, setSourceAccountId] = useState('');
  const [transferDate, setTransferDate] = useState(new Date().toISOString().split('T')[0]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [recipients, setRecipients] = useState<{ accountId: string; amount: number }[]>([]);

  useEffect(() => {
    // Initialize recipients with all savings and investment accounts
    const initialRecipients = accounts
      .filter(account => account.type === 'savings' || account.type === 'investment')
      .map(account => ({ accountId: account.id, amount: 0 }));
    setRecipients(initialRecipients);
  }, [accounts]);

  const handleAmountChange = (index: number, amount: number) => {
    const updatedRecipients = [...recipients];
    updatedRecipients[index].amount = amount;
    setRecipients(updatedRecipients);
    setTotalAmount(updatedRecipients.reduce((sum, recipient) => sum + recipient.amount, 0));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTransfer({
      date: transferDate,
      sourceAccountId,
      recipients: recipients.filter(r => r.amount > 0),
    });
    // Reset form
    setSourceAccountId('');
    setTransferDate(new Date().toISOString().split('T')[0]);
    setTotalAmount(0);
    setRecipients(recipients.map(r => ({ ...r, amount: 0 })));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Distribute Transfer</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="sourceAccount" className="block text-sm font-medium text-gray-700">Source Account</label>
              <select
                id="sourceAccount"
                value={sourceAccountId}
                onChange={(e) => setSourceAccountId(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="">Select an account</option>
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>{account.name} ({account.type})</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="transferDate" className="block text-sm font-medium text-gray-700">Transfer Date</label>
              <input
                type="date"
                id="transferDate"
                value={transferDate}
                onChange={(e) => setTransferDate(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
            <span className="text-lg font-semibold">Total Amount: ${totalAmount.toFixed(2)}</span>
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
              Submit Transfer
            </button>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Recipient Accounts</h3>
            <div className="space-y-2">
              {recipients.map((recipient, index) => {
                const account = accounts.find(a => a.id === recipient.accountId);
                return (
                  <div key={recipient.accountId} className="flex items-center space-x-4">
                    <span className="w-1/3">{account?.name} ({account?.type})</span>
                    <input
                      type="number"
                      value={recipient.amount}
                      onChange={(e) => handleAmountChange(index, parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                      className="w-1/3 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

