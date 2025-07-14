import React from 'react';
import { Card } from '../ui/Card';
import { Purchase, Plan } from '../../types';
import { useData } from '../../contexts/DataContext';
import { Wifi } from 'lucide-react';

interface UsageCardProps {
  purchase: Purchase;
}

export const UsageCard: React.FC<UsageCardProps> = ({ purchase }) => {
  const { plans, locations } = useData();
  
  const plan = plans.find(p => p.id === purchase.planId);
  const location = locations.find(l => l.id === purchase.locationId);
  
  if (!plan || !location) return null;

  const expiryDate = new Date(purchase.expiryDate);
  const isExpired = expiryDate < new Date();
  
  // Calculate remaining time
  const now = new Date();
  const timeLeft = expiryDate.getTime() - now.getTime();
  const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.ceil(timeLeft / (1000 * 60 * 60));
  
  let timeDisplay = '';
  if (timeLeft <= 0) {
    timeDisplay = 'Expired';
  } else if (daysLeft > 1) {
    timeDisplay = `${daysLeft} days left`;
  } else {
    timeDisplay = `${hoursLeft} hours left`;
  }

  // Mock usage data - in real app, this would come from MikroTik API
  const usedData = parseFloat(plan.dataAmount) * 0.3; // 30% used
  const totalData = parseFloat(plan.dataAmount);
  const usagePercentage = (usedData / totalData) * 100;

  return (
    <Card className="p-6 mb-6">
      <div className="flex gap-2 mb-4">
        <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
          In Use
        </span>
        <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">
          Internet
        </span>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <Wifi className="text-green-600" size={20} />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-lg">Unlimited</p>
            <p className="text-sm text-gray-500">Weekly Plan</p>
          </div>
        </div>
        
        <div className="relative">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#60a5fa"
                strokeWidth="3"
                strokeDasharray={`${usagePercentage}, 100`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">{usedData.toFixed(1)}</span>
              <span className="text-sm text-gray-600 font-medium">GB</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center mt-1">/ {plan.dataAmount} GB</p>
        </div>
      </div>
      
      <div className="mt-6">
        <p className="text-sm text-gray-600 mb-1">Active Until</p>
        <p className="text-lg font-semibold text-gray-900">
          {expiryDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </p>
      </div>
    </Card>
  );
};