import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { PurchaseModal } from './PurchaseModal';
import { Plan } from '../../types';
import { ChevronRight, Wifi } from 'lucide-react';

interface PlansListProps {
  showAll?: boolean;
}

export const PlansList: React.FC<PlansListProps> = ({ showAll = false }) => {
  const { plans, getCredentialsByLocation } = useData();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  
  const displayPlans = showAll ? plans : plans.slice(0, 2);

  const getAvailableSlots = (planType: string) => {
    // Count available credentials across all locations for this plan type
    return plans.reduce((total, plan) => {
      if (plan.type === planType) {
        // This is a simplified count - in a real app you'd want to show per location
        return total + 1; // Placeholder - you could enhance this to show actual counts
      }
      return total;
    }, 0);
  };

  const getPlanIcon = (type: string) => {
    switch (type) {
      case '3-hour': return '⚡';
      case 'daily': return '📱';
      case 'weekly': return '📶';
      case 'monthly': return '🚀';
      default: return '📶';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {showAll ? 'Popular Plans' : 'Popular Plan'}
        </h2>
        {!showAll && (
          <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
            See All
          </button>
        )}
      </div>

      <div className={showAll ? 'space-y-4' : 'grid grid-cols-2 gap-4'}>
        {displayPlans.map((plan) => (
          <Card
            key={plan.id}
            className={`p-4 cursor-pointer hover:shadow-lg transition-all duration-200 ${
              plan.popular ? 'ring-1 ring-blue-200' : ''
            }`}
            onClick={() => setSelectedPlan(plan)}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Wifi className="text-green-600" size={20} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-base">Unlimited</p>
                <p className="text-sm text-gray-500">
                  {plan.type === 'weekly' ? 'Weekly Plan' : 
                   plan.type === 'monthly' ? 'Monthly Plan' : 
                   plan.name}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                Available at all active StarNetX locations
              </div>
              <div className="text-sm text-gray-600">
                Price: ₦{plan.price.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">
                {plan.type === 'weekly' ? '1 week' : 
                 plan.type === 'monthly' ? '1 Month' : 
                 plan.duration}
              </div>
              
              <div className="flex justify-end items-center pt-2">
                <ChevronRight className="text-gray-400" size={20} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedPlan && (
        <PurchaseModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
        />
      )}
    </div>
  );
};