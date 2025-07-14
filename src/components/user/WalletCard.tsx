import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { CreditCard } from 'lucide-react';

export const WalletCard: React.FC = () => {
  const { user, updateWalletBalance } = useAuth();
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');

  const handleTopUp = () => {
    const amount = parseFloat(topUpAmount);
    if (amount > 0) {
      updateWalletBalance(amount);
      setTopUpAmount('');
      setShowTopUp(false);
    }
  };

  if (showTopUp) {
    return (
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Top Up Balance</h3>
        <Input
          label="Amount (₦)"
          type="number"
          value={topUpAmount}
          onChange={setTopUpAmount}
          placeholder="Enter amount"
          prefix="₦"
          className="mb-4"
        />
        <div className="flex gap-2">
          <Button onClick={handleTopUp} className="flex-1">
            Add Funds
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowTopUp(false)}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <CreditCard className="text-blue-600" size={20} />
          </div>
          <div>
            <p className="text-gray-600 text-sm">Balance</p>
            <p className="text-lg sm:text-xl font-bold text-gray-900">
              ₦ {user?.walletBalance?.toFixed(1) || '124.5'}
            </p>
          </div>
        </div>
        <Button
          onClick={() => setShowTopUp(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium"
        >
          <span className="hidden sm:inline">+ Top Up Balance</span>
          <span className="sm:hidden">+ Top Up</span>
        </Button>
      </div>
    </div>
  );
};