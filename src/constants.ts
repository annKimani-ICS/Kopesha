import { Transaction, IncomeSource } from './types';

export const SIMULATED_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    date: '2024-03-25',
    amount: 15000,
    type: 'income',
    category: 'side-hustle',
    description: 'Payment for 50 trays of eggs',
    source: 'mpesa',
  },
  {
    id: '2',
    date: '2024-03-24',
    amount: 2500,
    type: 'expense',
    category: 'utility',
    description: 'KPLC Token - Prepaid',
    source: 'mpesa',
  },
  {
    id: '3',
    date: '2024-03-22',
    amount: 5000,
    type: 'expense',
    category: 'chama',
    description: 'Unity Chama Monthly Contribution',
    source: 'mpesa',
  },
  {
    id: '4',
    date: '2024-03-20',
    amount: 12000,
    type: 'income',
    category: 'side-hustle',
    description: 'Boda Boda daily collection (Week 3)',
    source: 'sms',
  },
  {
    id: '5',
    date: '2024-03-15',
    amount: 45000,
    type: 'income',
    category: 'salary',
    description: 'Monthly Salary - Net',
    source: 'mpesa',
  },
  {
    id: '6',
    date: '2024-03-10',
    amount: 3000,
    type: 'expense',
    category: 'personal',
    description: 'Zuku Internet Payment',
    source: 'mpesa',
  }
];

export const INCOME_SOURCES: IncomeSource[] = [
  { id: 's1', name: 'Poultry Farm', type: 'side-hustle', monthlyAverage: 45000, consistency: 0.85 },
  { id: 's2', name: 'Unity Chama', type: 'chama', monthlyAverage: 5000, consistency: 1.0 },
  { id: 's3', name: 'Primary Job', type: 'salary', monthlyAverage: 45000, consistency: 0.95 },
];
