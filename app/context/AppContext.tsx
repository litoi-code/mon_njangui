'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';

type AccountType = 'savings' | 'checking' | 'investment';

interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
}

interface Transfer {
  id: string;
  date: string;
  sourceAccountId: string;
  recipients: { accountId: string; amount: number }[];
}

interface AppContextType {
  accounts: Account[];
  transfers: Transfer[];
  addAccount: (name: string, type: AccountType) => void;
  updateAccount: (id: string, name: string, type: AccountType) => void;
  deleteAccount: (id: string) => void;
  addTransfer: (transfer: Omit<Transfer, 'id'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);

  useEffect(() => {
    const storedAccounts = localStorage.getItem('accounts');
    const storedTransfers = localStorage.getItem('transfers');
    if (storedAccounts) setAccounts(JSON.parse(storedAccounts));
    if (storedTransfers) setTransfers(JSON.parse(storedTransfers));
  }, []);

  useEffect(() => {
    localStorage.setItem('accounts', JSON.stringify(accounts));
    localStorage.setItem('transfers', JSON.stringify(transfers));
  }, [accounts, transfers]);

  const addAccount = (name: string, type: AccountType) => {
    setAccounts([...accounts, { id: Date.now().toString(), name, type, balance: 0 }]);
  };

  const updateAccount = (id: string, name: string, type: AccountType) => {
    setAccounts(accounts.map(account => 
      account.id === id ? { ...account, name, type } : account
    ));
  };

  const deleteAccount = (id: string) => {
    setAccounts(accounts.filter(account => account.id !== id));
  };

  const addTransfer = (transfer: Omit<Transfer, 'id'>) => {
    const newTransfer = { ...transfer, id: Date.now().toString() };
    setTransfers([...transfers, newTransfer]);

    // Update account balances
    setAccounts(accounts.map(account => {
      if (account.id === transfer.sourceAccountId) {
        const totalAmount = transfer.recipients.reduce((sum, recipient) => sum + recipient.amount, 0);
        return { ...account, balance: account.balance - totalAmount };
      }
      const recipientTransfer = transfer.recipients.find(recipient => recipient.accountId === account.id);
      if (recipientTransfer) {
        return { ...account, balance: account.balance + recipientTransfer.amount };
      }
      return account;
    }));
  };

  return (
    <AppContext.Provider value={{ accounts, transfers, addAccount, updateAccount, deleteAccount, addTransfer }}>
      {children}
    </AppContext.Provider>
  );
};

