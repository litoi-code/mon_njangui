'use client'

import { useAppContext } from './context/AppContext';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import Link from 'next/link';
import { useState } from 'react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function Dashboard() {
  const { accounts, transfers } = useAppContext();
  const [filter, setFilter] = useState<'all' | 'savings' | 'checking' | 'investment'>('all');

  const filteredAccounts = accounts.filter(account => 
    filter === 'all' ? true : account.type === filter
  );

  // Calculate monthly volumes for each recipient account
  const monthlyVolumes = transfers.reduce((acc, transfer) => {
    const month = new Date(transfer.date).toLocaleString('default', { month: 'long' });
    transfer.recipients.forEach(recipient => {
      if (!acc[recipient.accountId]) {
        acc[recipient.accountId] = {};
      }
      acc[recipient.accountId][month] = (acc[recipient.accountId][month] || 0) + recipient.amount;
    });
    return acc;
  }, {} as Record<string, Record<string, number>>);

  // Prepare data for the chart
  const months = Array.from(new Set(transfers.map(t => new Date(t.date).toLocaleString('default', { month: 'long' }))));
  const chartSeries = Object.entries(monthlyVolumes).map(([accountId, volumes]) => ({
    name: accounts.find(a => a.id === accountId)?.name || 'Unknown Account',
    data: months.map(month => volumes[month] || 0)
  }));

  const chartOptions: ApexOptions = {
    chart: {
      type: 'line',
      height: 350,
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    xaxis: {
      categories: months,
    },
    yaxis: {
      title: {
        text: 'Amount'
      }
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "$ " + val.toFixed(2)
        }
      }
    },
    legend: {
      position: 'top'
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Link href="/transfer" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
          New Transfer
        </Link>
      </div>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Volume by Recipient Account</h2>
          <Chart options={chartOptions} series={chartSeries} type="line" height={350} />
        </div>
      </div>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Account Balances ({filteredAccounts.length})</h2>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'savings' | 'checking' | 'investment')}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="all">All Accounts</option>
              <option value="savings">Savings</option>
              <option value="checking">Checking</option>
              <option value="investment">Investment</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAccounts.map(account => (
              <div key={account.id} className={`p-4 rounded-lg ${account.balance < 0 ? 'bg-red-100' : 'bg-green-100'}`}>
                <h3 className="font-semibold text-gray-900">{account.name}</h3>
                <p className="text-sm text-gray-600">Type: {account.type}</p>
                <p className={`font-bold text-lg ${account.balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  ${account.balance.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
}

