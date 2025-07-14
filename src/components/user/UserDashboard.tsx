import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { WalletCard } from './WalletCard';
import { UsageCard } from './UsageCard';
import { PlansList } from './PlansList';
import { BottomNavigation } from './BottomNavigation';
import { ReferralPage } from './ReferralPage';
import { SettingsPage } from './SettingsPage';
import { Bell, ChevronDown } from 'lucide-react';

type ActivePage = 'home' | 'plans' | 'referrals' | 'settings';

export const UserDashboard: React.FC = () => {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const { user } = useAuth();
  const { getUserPurchases } = useData();

  const userPurchases = getUserPurchases(user?.id || '');
  const activePurchase = userPurchases.find(p => p.status === 'active');

  const renderContent = () => {
    switch (activePage) {
      case 'home':
        return (
          <div className="space-y-6">
            <WalletCard />
            {activePurchase && <UsageCard purchase={activePurchase} />}
            <PlansList onSeeAllClick={() => setActivePage('plans')} />
          </div>
        );
      case 'plans':
        return <PlansList showAll={true} />;
      case 'referrals':
        return <ReferralPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-green-400">
      <div className="max-w-md mx-auto bg-white min-h-screen relative">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-400 via-blue-500 to-green-400 px-4 pt-12 pb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center justify-between w-full">
              <h1 className="text-white text-2xl font-bold">StarNetX</h1>
              <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h1 className="text-white text-xl font-normal mb-1">
              Hi {user?.email?.split('@')[0] || 'Osewa'},
            </h1>
            <p className="text-white text-base opacity-90">
              this is your recent usage
            </p>
          </div>
        </div>
        
        <main className="pb-32">
          <div className="px-4 -mt-6 relative z-10">
            {renderContent()}
          </div>
        </main>
        <BottomNavigation activePage={activePage} onPageChange={setActivePage} />
      </div>
    </div>
  );
};