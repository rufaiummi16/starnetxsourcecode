import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAuth, getAllUsers } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Copy, Users, DollarSign } from 'lucide-react';

export const ReferralPage: React.FC = () => {
  const { user } = useAuth();
  const { getAllPurchases } = useData();
  const [copied, setCopied] = useState(false);
  
  const allUsers = getAllUsers();
  const allPurchases = getAllPurchases();

  const referralUrl = `https://starnetx.com/signup?ref=${user?.referralCode}`;
  
  // Calculate user's referral statistics
  const myReferrals = allUsers.filter(u => u.referredBy === user?.id);
  const myEarnings = allPurchases
    .filter(purchase => {
      const purchaser = allUsers.find(u => u.id === purchase.userId);
      return purchaser && purchaser.referredBy === user?.id;
    })
    .reduce((total, purchase) => total + (purchase.amount * 0.1), 0);

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Invite Friends</h1>
        <p className="text-gray-600">
          Earn 10% commission on every purchase your referred friends make
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Your Referral Code</h2>
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Referral Code</p>
              <p className="text-xl font-mono font-bold text-blue-600">
                {user?.referralCode}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={copyReferralCode}
              className="flex items-center gap-2"
            >
              <Copy size={16} />
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Share this link:</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={referralUrl}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={copyReferralCode}
            >
              Copy
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Referral Statistics</h2>
        {myReferrals.length > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="text-blue-600" size={24} />
                </div>
                <p className="text-2xl font-bold text-blue-900">{myReferrals.length}</p>
                <p className="text-sm text-blue-700">Total Referrals</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <DollarSign className="text-green-600" size={24} />
                </div>
                <p className="text-2xl font-bold text-green-900">₦{myEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p className="text-sm text-green-700">Total Earnings</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Your Referrals</h3>
              <div className="space-y-2">
                {myReferrals.map((referredUser) => {
                  const userPurchases = allPurchases.filter(p => p.userId === referredUser.id);
                  const userEarnings = userPurchases.reduce((total, purchase) => total + (purchase.amount * 0.1), 0);
                  
                  return (
                    <div key={referredUser.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{referredUser.email}</p>
                        <p className="text-sm text-gray-600">
                          Joined {new Date(referredUser.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">₦{userEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <p className="text-sm text-gray-600">{userPurchases.length} purchases</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-gray-400" size={32} />
            </div>
            <p className="text-gray-600 mb-2">No referral data available yet</p>
            <p className="text-sm text-gray-500">Start sharing your referral code to see your earnings here!</p>
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">How it Works</h2>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              1
            </div>
            <div>
              <p className="font-medium">Share your referral code</p>
              <p className="text-sm text-gray-600">Send your unique link to friends and family</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              2
            </div>
            <div>
              <p className="font-medium">They sign up and purchase</p>
              <p className="text-sm text-gray-600">Your friend creates an account and buys their first plan</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              3
            </div>
            <div>
              <p className="font-medium">You earn commission</p>
              <p className="text-sm text-gray-600">You earn 10% commission on every purchase they make. Minimum withdrawal is ₦500.</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};