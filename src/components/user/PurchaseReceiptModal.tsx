import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Purchase } from '../../types';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { X, Download, Wifi, Calendar, MapPin, User, CreditCard } from 'lucide-react';
import html2pdf from 'html2pdf.js';

interface PurchaseReceiptModalProps {
  purchase: Purchase;
  onClose: () => void;
}

export const PurchaseReceiptModal: React.FC<PurchaseReceiptModalProps> = ({ purchase, onClose }) => {
  const { plans, locations } = useData();
  const { user } = useAuth();
  
  const plan = plans.find(p => p.id === purchase.planId);
  const location = locations.find(l => l.id === purchase.locationId);

  const handleDownloadPDF = () => {
    const element = document.getElementById('receipt-content');
    const opt = {
      margin: 1,
      filename: `StarNetX-Receipt-${purchase.id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Purchase Receipt</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div id="receipt-content" className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-blue-600 mb-2">StarNetX</h1>
            <p className="text-gray-600">Internet Service Receipt</p>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mt-4 mb-2">
              <span className="text-green-600 text-2xl">✓</span>
            </div>
            <p className="text-green-600 font-semibold">Payment Successful</p>
          </div>

          {/* Receipt Details */}
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Wifi size={16} />
                Plan Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan:</span>
                  <span className="font-medium">{plan?.name || 'Unknown Plan'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Data:</span>
                  <span className="font-medium">{plan?.dataAmount || 'N/A'} GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{plan?.duration || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium capitalize">{plan?.type || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-blue-900">
                <MapPin size={16} />
                Location & Access
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Location:</span>
                  <span className="font-medium text-blue-900">{location?.name || 'Unknown Location'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">WiFi Network:</span>
                  <span className="font-medium text-blue-900">{location?.wifiName || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Username:</span>
                  <span className="font-mono bg-white px-2 py-1 rounded text-blue-900">
                    {purchase.mikrotikCredentials.username}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Password:</span>
                  <span className="font-mono bg-white px-2 py-1 rounded text-blue-900">
                    {purchase.mikrotikCredentials.password}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Calendar size={16} />
                Transaction Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Receipt ID:</span>
                  <span className="font-mono">{purchase.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Purchase Date:</span>
                  <span className="font-medium">
                    {new Date(purchase.purchaseDate).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Expiry Date:</span>
                  <span className="font-medium">
                    {new Date(purchase.expiryDate).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    purchase.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : purchase.status === 'expired'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-green-900">
                <CreditCard size={16} />
                Payment Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-700">Customer:</span>
                  <span className="font-medium text-green-900">{user?.email}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-green-700 font-semibold">Total Amount:</span>
                  <span className="font-bold text-lg text-green-900">₦{purchase.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> Make sure you're connected to the WiFi network "{location?.wifiName}" 
                before using your credentials. Keep this receipt for your records.
              </p>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white p-4 border-t flex gap-3">
          <Button
            onClick={handleDownloadPDF}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <Download size={16} />
            Download PDF
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1">
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
};