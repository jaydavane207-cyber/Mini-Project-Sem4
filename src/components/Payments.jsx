import React, { useState, useEffect, useCallback } from 'react';
import { CreditCard, DollarSign, Wallet, TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import insforge from '../lib/insforge';

export default function Payments() {
  const { user, showToast } = useAppContext();
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await insforge.database
      .from('transactions')
      .select('*')
      .eq('profile_id', user.id)
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setTransactions(data);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const balance = transactions.reduce((acc, curr) => {
    return curr.type === 'income' ? acc + parseFloat(curr.amount) : acc - parseFloat(curr.amount);
  }, 0);

  const handleTransaction = async (type, desc, amt) => {
    const numAmt = parseFloat(amt);
    if (isNaN(numAmt) || numAmt <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }

    const { error } = await insforge.database.from('transactions').insert({
      profile_id: user.id,
      amount: numAmt,
      description: desc,
      type: type
    });

    if (!error) {
      showToast(`${type === 'income' ? 'Added' : 'Sent'} $${numAmt.toFixed(2)} successfully!`, 'success');
      fetchTransactions();
      setAmount('');
    } else {
      showToast('Transaction failed', 'error');
    }
  };

  return (
    <div className="space-y-8 animate-[slideIn_0.3s_ease-out]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3"><Wallet className="text-[var(--color-gs-green)]" size={36} /> Payments & Spending</h1>
          <p className="text-[var(--color-gs-text-muted)] mt-2">Manage split payments, hackathon fees, and budgets.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           {/* Wallet Balance Card */}
           <div className="bg-gradient-to-br from-[var(--color-gs-green)] to-[var(--color-gs-cyan)] p-[1px] rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(16,185,129,0.3)]">
             <div className="bg-[var(--color-gs-card)]/90 backdrop-blur-xl p-8 rounded-[23px] h-full">
               <div className="flex justify-between items-start mb-8">
                 <div>
                   <p className="text-[var(--color-gs-text-muted)] font-medium mb-1">Total Balance</p>
                   <h2 className="text-5xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-gs-green)] to-[var(--color-gs-cyan)]">${balance.toFixed(2)}</h2>
                 </div>
                 <div className="w-12 h-12 bg-[var(--color-gs-green)]/20 rounded-xl flex items-center justify-center text-[var(--color-gs-green)]">
                   <CreditCard size={24} />
                 </div>
               </div>
               
               <div className="flex flex-col gap-4">
                 <input 
                   type="number" 
                   value={amount} 
                   onChange={(e) => setAmount(e.target.value)} 
                   placeholder="Enter Amount"
                   className="w-full bg-[var(--color-gs-bg)] border border-[var(--color-gs-border)] rounded-xl p-3 outline-none focus:border-[var(--color-gs-green)] text-[var(--color-gs-text-main)]"
                 />
                 <div className="flex gap-4">
                   <button onClick={() => handleTransaction('income', 'Funds Added', amount)} className="flex-1 py-3 bg-[var(--color-gs-green)] text-[#0f172a] font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-green-400 transition-colors">
                     <ArrowDownRight size={18} /> Add Funds
                   </button>
                   <button onClick={() => handleTransaction('expense', 'Funds Sent', amount)} className="flex-1 py-3 bg-[var(--color-gs-bg)] text-[var(--color-gs-text-main)] border border-[var(--color-gs-border)] font-bold rounded-xl flex items-center justify-center gap-2 hover:border-[var(--color-gs-green)] hover:text-[var(--color-gs-green)] transition-colors">
                     <ArrowUpRight size={18} /> Send
                   </button>
                 </div>
               </div>
             </div>
           </div>

           {/* Split Bills */}
           <div className="bg-[var(--color-gs-card)] border border-[var(--color-gs-border)] p-6 rounded-2xl">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">Pending Split Bills</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[var(--color-gs-bg)] border border-[var(--color-gs-border)] rounded-xl hover:border-orange-500/50 transition-colors">
                   <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center"><DollarSign size={20}/></div>
                     <div>
                       <h4 className="font-bold text-sm">Pizza for Game Jam</h4>
                       <p className="text-xs text-[var(--color-gs-text-muted)]">Split with Alice and Bob</p>
                     </div>
                   </div>
                   <div className="text-right">
                     <p className="font-bold text-orange-500 mb-1">Owe $12.50</p>
                     <button onClick={() => showToast('Paid $12.50 (Mock)')} className="text-xs px-3 py-1 bg-orange-500 text-white rounded-lg font-bold">Pay Now</button>
                   </div>
                </div>
              </div>
           </div>

        </div>

        <div className="space-y-6">
           <div className="bg-[var(--color-gs-card)] border border-[var(--color-gs-border)] p-6 rounded-2xl">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><TrendingUp className="text-[var(--color-gs-cyan)]" /> Spending Tracker</h3>
              
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[var(--color-gs-text-muted)]">Monthly Budget</span>
                  <span className="font-bold">$150 / $200</span>
                </div>
                <div className="w-full h-2 bg-[var(--color-gs-bg)] rounded-full overflow-hidden border border-[var(--color-gs-border)]">
                  <div className="h-full bg-[var(--color-gs-cyan)] w-[75%] shadow-[0_0_10px_currentColor]"></div>
                </div>
                <p className="text-xs text-[var(--color-gs-text-muted)] mt-2 flex items-center gap-1"><AlertTriangle size={12} className="text-yellow-500"/> Near alert threshold</p>
              </div>

              <div className="space-y-3">
                 <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-gs-text-muted)]">Recent Transactions</h4>
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-2">
                       <Loader2 className="animate-spin text-[var(--color-gs-green)]" />
                       <p className="text-xs text-[var(--color-gs-text-muted)]">Syncing ledger...</p>
                    </div>
                  ) : transactions.length === 0 ? (
                    <p className="text-sm text-[var(--color-gs-text-muted)] py-4 text-center">No transactions yet.</p>
                  ) : transactions.slice(0, 5).map(t => (
                    <div key={t.id} className="flex justify-between items-center py-2 border-b border-[var(--color-gs-border)] last:border-0">
                      <div>
                        <p className="text-sm font-bold">{t.description}</p>
                        <p className="text-xs text-[var(--color-gs-text-muted)]">
                          {new Date(t.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <span className={`text-sm font-bold ${t.type === 'income' ? 'text-[var(--color-gs-green)]' : 'text-red-400'}`}>
                        {t.type === 'income' ? '+' : '-'}${parseFloat(t.amount).toFixed(2)}
                      </span>
                    </div>
                  ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
