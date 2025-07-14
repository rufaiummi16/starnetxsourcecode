import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { User, Wifi, CreditCard, LogOut, Clock } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { getUserPurchases } = useData();

  const userPurchases = getUserPurchases(user?.id || '');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 text-xl font-bold">
              {user?.email?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{user?.email}</h2>
            {user?.phone && (
              <p className="text-gray-600">{user.phone}</p>
            )}
            <p className="text-gray-600">Member since {new Date(user?.createdAt || '').toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Wallet Balance</p>
            <p className="text-lg font-bold text-gray-900">₦{user?.walletBalance?.toFixed(2)}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Referral Code</p>
            <p className="text-lg font-bold text-blue-600">{user?.referralCode}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Purchase History</h2>
        {userPurchases.length === 0 ? (
          <p className="text-gray-600 text-center py-4">No purchases yet</p>
        ) : (
          <div className="space-y-3">
            {userPurchases.slice(0, 5).map((purchase) => (
              <div key={purchase.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Wifi className="text-blue-600" size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Plan Purchase</p>
                    <p className="text-sm text-gray-600">
                      {new Date(purchase.purchaseDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₦{purchase.amount.toFixed(2)}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    purchase.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : purchase.status === 'expired'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {purchase.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="space-y-3">
        <Card className="p-4">
          <button className="w-full flex items-center gap-3 text-left">
            <User className="text-gray-600" size={20} />
            <span className="text-gray-900">Account Information</span>
          </button>
        </Card>

        <Card className="p-4">
          <button className="w-full flex items-center gap-3 text-left">
            <CreditCard className="text-gray-600" size={20} />
            <span className="text-gray-900">Payment Methods</span>
          </button>
        </Card>

        <Card className="p-4">
          <button className="w-full flex items-center gap-3 text-left">
            <Clock className="text-gray-600" size={20} />
            <span className="text-gray-900">Usage History</span>
          </button>
        </Card>
      </div>

      <Button
        variant="danger"
        onClick={logout}
        className="w-full flex items-center justify-center gap-2"
      >
        <LogOut size={20} />
        Sign Out
      </Button>
    </div>
  );
};