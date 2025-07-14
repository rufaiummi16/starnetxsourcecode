import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { Copy, Users, DollarSign } from 'lucide-react';

export const ReferralPage: React.FC = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const referralUrl = `https://starnetx.com/signup?ref=${user?.referralCode}`;

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
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="text-gray-400" size={32} />
          </div>
          <p className="text-gray-600 mb-2">No referral data available yet</p>
          <p className="text-sm text-gray-500">Start sharing your referral code to see your earnings here!</p>
        </div>
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