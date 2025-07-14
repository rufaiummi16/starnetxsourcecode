import React from 'react';
import { Card } from '../ui/Card';
import { useAuth, getAllUsers } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Users, DollarSign, TrendingUp } from 'lucide-react';

export const ReferralTracking: React.FC = () => {
  const { getAllPurchases } = useData();
  const allUsers = getAllUsers();
  const allPurchases = getAllPurchases();
  
  // Calculate real referral statistics
  const referredUsers = allUsers.filter(user => user.referredBy);
  const totalReferrals = referredUsers.length;
  const activeReferrals = totalReferrals; // All referrals are considered active for now
  
  // Calculate total earnings from referrals
  let totalEarnings = 0;
  const referrerEarnings: { [key: string]: { earnings: number; referrals: number; email: string } } = {};
  
  // Initialize referrer data
  allUsers.forEach(user => {
    referrerEarnings[user.id] = {
      earnings: 0,
      referrals: 0,
      email: user.email,
    };
  });
  
  // Count referrals per user
  referredUsers.forEach(user => {
    if (user.referredBy && referrerEarnings[user.referredBy]) {
      referrerEarnings[user.referredBy].referrals++;
    }
  });
  
  // Calculate earnings from purchases
  allPurchases.forEach(purchase => {
    const purchaser = allUsers.find(u => u.id === purchase.userId);
    if (purchaser && purchaser.referredBy && referrerEarnings[purchaser.referredBy]) {
      const commission = purchase.amount * 0.1; // 10% commission
      referrerEarnings[purchaser.referredBy].earnings += commission;
      totalEarnings += commission;
    }
  });
  
  const referralStats = {
    totalReferrals,
    activeReferrals,
    totalEarnings,
  };

  // Get top referrers
  const topReferrers = Object.entries(referrerEarnings)
    .filter(([_, data]) => data.referrals > 0)
    .map(([id, data]) => ({
      id,
      email: data.email,
      referrals: data.referrals,
      earnings: data.earnings,
    }))
    .sort((a, b) => b.referrals - a.referrals)
    .slice(0, 5);

  // Get recent referrals
  const recentReferrals = referredUsers
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4)
    .map(user => {
      const referrer = allUsers.find(u => u.id === user.referredBy);
      return {
        id: user.id,
        referrer: referrer?.email || 'Unknown',
        referred: user.email,
        date: new Date(user.createdAt).toLocaleDateString(),
        status: 'completed', // All referrals are completed when user signs up
      };
    });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Referral Tracking</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Referrals</p>
              <p className="text-2xl font-bold text-gray-900">{referralStats.totalReferrals}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Referrals</p>
              <p className="text-2xl font-bold text-gray-900">{referralStats.activeReferrals}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Earnings</p>
             <p className="text-2xl font-bold text-gray-900">₦{referralStats.totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Referrers</h3>
          {topReferrers.length > 0 ? (
            <div className="space-y-3">
              {topReferrers.map((referrer, index) => (
                <div key={referrer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{referrer.email}</p>
                      <p className="text-sm text-gray-600">{referrer.referrals} referrals</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₦{referrer.earnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <p className="text-sm text-gray-600">earned</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No referrers yet</p>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Referral Activity</h3>
          {recentReferrals.length > 0 ? (
            <div className="space-y-3">
              {recentReferrals.map((referral) => (
                <div key={referral.id} className="flex items-center justify-between p-3 border-b last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900">{referral.referrer}</p>
                    <p className="text-sm text-gray-600">referred {referral.referred}</p>
                    <p className="text-xs text-gray-500">{referral.date}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    referral.status === 'completed' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {referral.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No recent referral activity</p>
            </div>
          )}
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Referral Program Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Referral Reward Amount
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">₦</span>
                <input
                  type="number"
                  defaultValue="4.00"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Purchase Required
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">₦</span>
                <input
                  type="number"
                  defaultValue="10.00"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="enableReferrals" defaultChecked />
              <label htmlFor="enableReferrals" className="text-sm text-gray-700">
                Enable referral program
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="autoReward" defaultChecked />
              <label htmlFor="autoReward" className="text-sm text-gray-700">
                Automatically reward successful referrals
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="emailNotifications" defaultChecked />
              <label htmlFor="emailNotifications" className="text-sm text-gray-700">
                Send email notifications for new referrals
              </label>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};