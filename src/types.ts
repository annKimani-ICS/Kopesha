export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
  category: 'side-hustle' | 'chama' | 'utility' | 'personal' | 'salary';
  description: string;
  source: 'mpesa' | 'sms' | 'manual';
}

export interface IncomeSource {
  id: string;
  name: string;
  type: 'side-hustle' | 'chama' | 'salary';
  monthlyAverage: number;
  consistency: number; // 0-1
}

export interface CreditProfile {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'E';
  insights: string[];
  recommendations: string[];
}
