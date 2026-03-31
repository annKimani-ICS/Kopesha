/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight, 
  Zap, 
  MessageSquare,
  RefreshCw,
  CreditCard,
  History
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { SIMULATED_TRANSACTIONS, INCOME_SOURCES } from './constants';
import { Transaction, CreditProfile } from './types';
import { analyzeCreditworthiness } from './services/geminiService';
import ReactMarkdown from 'react-markdown';

export default function App() {
  const [transactions] = useState<Transaction[]>(SIMULATED_TRANSACTIONS);
  const [creditProfile, setCreditProfile] = useState<CreditProfile | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'ai'>('dashboard');

  const fetchAnalysis = async () => {
    setIsAnalyzing(true);
    const profile = await analyzeCreditworthiness(transactions);
    setCreditProfile(profile);
    setIsAnalyzing(false);
  };

  useEffect(() => {
    fetchAnalysis();
  }, [transactions]);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const chartData = transactions
    .slice()
    .reverse()
    .map(t => ({
      date: t.date,
      amount: t.amount,
      type: t.type
    }));

  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = () => {
    setIsConnected(true);
    fetchAnalysis();
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-3xl shadow-xl border border-gray-100 max-w-md w-full text-center space-y-8"
        >
          <div className="bg-green-100 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto">
            <ShieldCheck className="w-10 h-10 text-green-600" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Kopesha AI</h1>
            <p className="text-gray-500">Securely analyze your M-Pesa and SMS records to unlock your credit potential.</p>
          </div>
          <button 
            onClick={handleConnect}
            className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-green-700 transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-3"
          >
            <Zap className="w-5 h-5" />
            Connect M-Pesa & SMS
          </button>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
            End-to-End Encrypted • Kenyan Built
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A] font-sans">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-green-600 p-2 rounded-lg">
                <ShieldCheck className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight">Kopesha AI</span>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  activeTab === 'dashboard' ? "bg-green-50 text-green-700" : "text-gray-500 hover:text-gray-700"
                )}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setActiveTab('transactions')}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  activeTab === 'transactions' ? "bg-green-50 text-green-700" : "text-gray-500 hover:text-gray-700"
                )}
              >
                Transactions
              </button>
              <button 
                onClick={() => setActiveTab('ai')}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  activeTab === 'ai' ? "bg-green-50 text-green-700" : "text-gray-500 hover:text-gray-700"
                )}
              >
                AI Insights
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Top Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500 font-medium uppercase tracking-wider">Credit Score</span>
                    <CreditCard className="text-green-600 w-5 h-5" />
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-5xl font-light">{creditProfile?.score || '---'}</span>
                    <span className={cn(
                      "text-lg font-semibold mb-1",
                      creditProfile?.grade === 'A' ? "text-green-600" : "text-orange-600"
                    )}>
                      Grade {creditProfile?.grade || '-'}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-gray-400">Powered by AI analysis of M-Pesa & SMS</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500 font-medium uppercase tracking-wider">Total Income</span>
                    <TrendingUp className="text-blue-600 w-5 h-5" />
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-light">KES {totalIncome.toLocaleString()}</span>
                  </div>
                  <div className="mt-2 flex items-center text-green-600 text-sm">
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                    <span>12% from last month</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500 font-medium uppercase tracking-wider">Chama Savings</span>
                    <Users className="text-purple-600 w-5 h-5" />
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-light">KES 5,000</span>
                  </div>
                  <p className="mt-2 text-xs text-gray-400">Consistent monthly contribution</p>
                </div>
              </div>

              {/* Charts & Income Sources */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Cash Flow History</h3>
                    <div className="flex gap-2">
                      <span className="flex items-center text-xs text-gray-500">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-1" /> Income
                      </span>
                      <span className="flex items-center text-xs text-gray-500">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-1" /> Expense
                      </span>
                    </div>
                  </div>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="date" hide />
                        <YAxis hide />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="amount" 
                          stroke="#22c55e" 
                          fillOpacity={1} 
                          fill="url(#colorIncome)" 
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold mb-6">Income Sources</h3>
                  <div className="space-y-6">
                    {INCOME_SOURCES.map((source) => (
                      <div key={source.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{source.name}</span>
                          <span className="text-xs text-gray-500">KES {source.monthlyAverage.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${source.consistency * 100}%` }}
                            className={cn(
                              "h-full rounded-full",
                              source.type === 'side-hustle' ? "bg-blue-500" : 
                              source.type === 'chama' ? "bg-purple-500" : "bg-green-500"
                            )}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-400 uppercase tracking-tighter">
                          <span>Consistency</span>
                          <span>{(source.consistency * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'transactions' && (
            <motion.div 
              key="transactions"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <History className="w-5 h-5 text-gray-400" />
                  Transaction History
                </h3>
                <div className="text-xs text-gray-500 italic">Simulated M-Pesa & SMS Records</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500">
                      <th className="px-6 py-4 font-semibold">Date</th>
                      <th className="px-6 py-4 font-semibold">Description</th>
                      <th className="px-6 py-4 font-semibold">Category</th>
                      <th className="px-6 py-4 font-semibold">Source</th>
                      <th className="px-6 py-4 font-semibold text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {transactions.map((t) => (
                      <tr key={t.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-4 text-sm text-gray-500">{t.date}</td>
                        <td className="px-6 py-4 text-sm font-medium">{t.description}</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "text-[10px] px-2 py-1 rounded-full font-bold uppercase",
                            t.category === 'side-hustle' ? "bg-blue-100 text-blue-700" :
                            t.category === 'chama' ? "bg-purple-100 text-purple-700" :
                            t.category === 'utility' ? "bg-orange-100 text-orange-700" :
                            "bg-gray-100 text-gray-700"
                          )}>
                            {t.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            {t.source === 'mpesa' ? <Zap className="w-3 h-3" /> : <MessageSquare className="w-3 h-3" />}
                            {t.source}
                          </div>
                        </td>
                        <td className={cn(
                          "px-6 py-4 text-sm font-bold text-right",
                          t.type === 'income' ? "text-green-600" : "text-red-600"
                        )}>
                          {t.type === 'income' ? '+' : '-'} {t.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'ai' && (
            <motion.div 
              key="ai"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="space-y-8"
            >
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <RefreshCw className={cn("w-32 h-32", isAnalyzing && "animate-spin")} />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-3xl font-bold tracking-tight">AI Financial Health Check</h2>
                      <p className="text-gray-500 mt-1">Deep analysis of your income patterns and creditworthiness.</p>
                    </div>
                    <button 
                      onClick={fetchAnalysis}
                      disabled={isAnalyzing}
                      className="bg-black text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 hover:bg-gray-800 transition-all disabled:opacity-50"
                    >
                      {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                      Refresh Analysis
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Key Insights</h3>
                      <div className="space-y-4">
                        {creditProfile?.insights.map((insight, idx) => (
                          <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={idx} 
                            className="flex gap-4 items-start p-4 bg-gray-50 rounded-2xl"
                          >
                            <div className="bg-white p-2 rounded-lg shadow-sm">
                              <Zap className="w-4 h-4 text-orange-500" />
                            </div>
                            <p className="text-sm leading-relaxed">{insight}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Recommendations</h3>
                      <div className="space-y-4">
                        {creditProfile?.recommendations.map((rec, idx) => (
                          <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={idx} 
                            className="flex gap-4 items-start p-4 border border-gray-100 rounded-2xl"
                          >
                            <div className="bg-green-100 p-2 rounded-lg">
                              <ArrowUpRight className="w-4 h-4 text-green-600" />
                            </div>
                            <p className="text-sm leading-relaxed">{rec}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-black text-white p-8 rounded-3xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-white/10 p-3 rounded-2xl">
                    <ShieldCheck className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold">Security & Privacy</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
                  Kopesha AI uses end-to-end encryption for all transaction data. Your M-Pesa patterns and SMS records are processed locally and only anonymized metadata is used for AI credit scoring. We never share your personal identity with lenders without your explicit consent.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
