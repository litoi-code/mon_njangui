'use client'

import { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export default function Accounts() {
  const { accounts, addAccount, updateAccount, deleteAccount } = useAppContext();
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountType, setNewAccountType] = useState<'savings' | 'checking' | 'investment'>('savings');
  const [editingAccount, setEditingAccount] = useState<string | null>(null);

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    addAccount(newAccountName, newAccountType);
    setNewAccountName('');
    setNewAccountType('savings');
  };

  const handleUpdateAccount = (id: string, name: string, type: 'savings' | 'checking' | 'investment') => {
    updateAccount(id, name, type);
    setEditingAccount(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Manage Accounts</h1>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Account</h2>
          <form onSubmit={handleAddAccount} className="flex flex-col md:flex-row items-end space-y-4 md:space-y-0 md:space-x-4">
            <div className="w-full md:w-1/3">
              <label htmlFor="newAccountName" className="block text-sm font-medium text-gray-700">Account Name</label>
              <input
                type="text"
                id="newAccountName"
                value={newAccountName}
                onChange={(e) => setNewAccountName(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div className="w-full md:w-1/3">
              <label htmlFor="newAccountType" className="block text-sm font-medium text-gray-700">Account Type</label>
              <select
                id="newAccountType"
                value={newAccountType}
                onChange={(e) => setNewAccountType(e.target.value as 'savings' | 'checking' | 'investment')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="savings">Savings</option>
                <option value="checking">Checking</option>
                <option value="investment">Investment</option>
              </select>
            </div>
            <button type="submit" className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
              Add Account
            </button>
          </form>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Existing Accounts</h2>
          <div className="space-y-4">
            {accounts.map(account => (
              <div key={account.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-lg">
                {editingAccount === account.id ? (
                  <>
                    <input
                      type="text"
                      value={account.name}
                      onChange={(e) => updateAccount(account.id, e.target.value, account.type)}
                      className="mb-2 md:mb-0 md:mr-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <select
                      value={account.type}
                      onChange={(e) => updateAccount(account.id, account.name, e.target.value as 'savings' | 'checking' | 'investment')}
                      className="mb-2 md:mb-0 md:mr-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                      <option value="savings">Savings</option>
                      <option value="checking">Checking</option>
                      <option value="investment">Investment</option>
                    </select>
                    <button onClick={() => setEditingAccount(null)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <div>
                      <h3 className="font-semibold text-gray-900">{account.name}</h3>
                      <p className="text-sm text-gray-600">{account.type}</p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <button onClick={() => setEditingAccount(account.id)} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2">
                        Edit
                      </button>
                      <button onClick={() => deleteAccount(account.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

