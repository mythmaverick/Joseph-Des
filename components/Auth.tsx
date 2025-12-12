import React, { useState } from 'react';
import { UserRole } from '../types';
import { CreditCard, CheckCircle, Loader2, Store, ShoppingBag } from 'lucide-react';

interface AuthProps {
  onLogin: (role: UserRole, name: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [step, setStep] = useState<'SELECT' | 'PAYMENT' | 'FORM'>('SELECT');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [name, setName] = useState('');

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === UserRole.SELLER) {
      setStep('PAYMENT');
    } else {
      setStep('FORM');
    }
  };

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment delay
    setTimeout(() => {
      setIsProcessing(false);
      setStep('FORM');
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole && name.trim()) {
      onLogin(selectedRole, name);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative overflow-hidden">
        {/* Decorative Circle */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-100 rounded-full opacity-50 blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-100 rounded-full opacity-50 blur-2xl"></div>

        <h1 className="text-3xl font-extrabold text-center mb-2 text-gray-800">
          Campus<span className="text-green-600">Markets</span>
        </h1>
        <p className="text-center text-gray-500 mb-8">Nigeria's No.1 Student Marketplace</p>

        {step === 'SELECT' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-700 text-center mb-4">Who are you?</h2>
            
            <button 
              onClick={() => handleRoleSelect(UserRole.BUYER)}
              className="w-full p-4 border-2 border-gray-100 rounded-xl hover:border-green-500 hover:bg-green-50 transition flex items-center gap-4 group"
            >
              <div className="bg-blue-100 p-3 rounded-full text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition">
                <ShoppingBag size={24} />
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-800">I'm a Buyer</p>
                <p className="text-sm text-gray-500">Looking for deals on campus.</p>
              </div>
            </button>

            <button 
              onClick={() => handleRoleSelect(UserRole.SELLER)}
              className="w-full p-4 border-2 border-gray-100 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition flex items-center gap-4 group"
            >
              <div className="bg-purple-100 p-3 rounded-full text-purple-600 group-hover:bg-purple-500 group-hover:text-white transition">
                <Store size={24} />
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-800">I'm a Seller</p>
                <p className="text-sm text-gray-500">I have goods to sell.</p>
              </div>
            </button>
          </div>
        )}

        {step === 'PAYMENT' && (
          <div className="text-center animate-in fade-in slide-in-from-right duration-300">
            <div className="mb-6 flex justify-center">
              <div className="bg-green-100 p-4 rounded-full">
                <CreditCard className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Seller Activation Fee</h2>
            <p className="text-gray-500 mb-6 text-sm">To maintain quality, sellers pay a one-time fee of <strong>$6.00 (approx ₦9,500)</strong>.</p>
            
            <button 
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition flex items-center justify-center gap-2"
            >
              {isProcessing ? <Loader2 className="animate-spin" /> : 'Pay $6.00 Securely'}
            </button>
            <button 
              onClick={() => setStep('SELECT')}
              className="mt-4 text-sm text-gray-500 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        )}

        {step === 'FORM' && (
          <form onSubmit={handleSubmit} className="animate-in fade-in slide-in-from-right duration-300">
             <div className="mb-6 flex justify-center">
              <div className="bg-gray-100 p-4 rounded-full">
                {selectedRole === UserRole.SELLER ? <Store className="w-8 h-8 text-purple-600"/> : <ShoppingBag className="w-8 h-8 text-blue-600"/>}
              </div>
            </div>
            <h2 className="text-xl font-bold text-center text-gray-800 mb-6">
              Complete Profile
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">What should we call you?</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Campus Plug"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition shadow-lg hover:shadow-xl"
            >
              Enter Market
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth;