import React from 'react';
import { FaWallet } from 'react-icons/fa'; 
import { useAuth } from '../../../context/AuthContext';
const WalletCard = ({ wallet }) => (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-1000"></div>
      <div className="relative w-96 h-56 bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 shadow-2xl transform transition duration-500 hover:scale-105">
        <div className="absolute inset-0 rounded-xl overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute w-32 h-32 border border-white/20 rounded-full"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
        </div>
  
        <div className="relative h-full flex flex-col justify-between z-10">
          <div className="flex justify-between items-start">
            <div>
              <FaWallet className="text-white text-3xl mb-2" />
              <h3 className="text-white text-xl font-bold tracking-wider">SkyWallet</h3>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-yellow-400"></div>
              <div className="w-8 h-8 rounded-full bg-yellow-500 -ml-4"></div>
            </div>
          </div>
  
          <div className="space-y-4">
            <div>
              <p className="text-gray-400 text-sm">Balance</p>
              <p className="text-white text-2xl font-bold tracking-wider">
                {wallet.balance} MZN
              </p>
            </div>
            
            <div className="flex justify-between items-end">
              <div>
                <p className="text-gray-400 text-sm">Account ID</p>
                <p className="text-white font-mono tracking-wider">{wallet.accountId}</p>
              </div>
              <div className="text-white/90 font-mono tracking-wider">
                {wallet.expiryDate}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  export default WalletCard