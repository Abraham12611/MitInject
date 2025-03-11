import React, { useState, useEffect } from 'react';
import { THEMES } from '@/config/themes';
import { QRCodeSVG } from 'qrcode.react';
import { X, QrCode, LogOut, AlertTriangle } from 'lucide-react';
import { getStoredWallet } from '@/utils/wallet';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const SettingsPopup = ({ isOpen, onClose, theme, currentTheme, setCurrentTheme }) => {
  const [activeAction, setActiveAction] = useState(null);
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('INJ');
  const [personalizedName, setPersonalizedName] = useState('Default');
  const [aiTradeEnabled, setAiTradeEnabled] = useState(true);
  const [showQRModal, setShowQRModal] = useState(false);
  const [address, setAddress] = useState('');
  const { user, setUser } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    if (!isOpen) return;

    // Check auth context for address
    if (user?.address) {
      console.log('Using address from auth context:', user.address);
      setAddress(user.address);
      return;
    }

    // Check wallet address
    const wallet = getStoredWallet();
    if (wallet?.address) {
      console.log('Using stored wallet address:', wallet.address);
      setAddress(wallet.address);
      return;
    }

    setAddress('Not connected');
  }, [isOpen, user?.address]);
  
  const currencies = ['INJ', 'USDT'];
  
  if (!isOpen) return null;

  const handleThemeChange = () => {
    const themes = Object.keys(THEMES);
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setCurrentTheme(themes[nextIndex]);
  };
  
  const handleConfirmWithdraw = () => {
    console.log('Withdrawing to:', withdrawAddress);
    setActiveAction(null);
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    // Clear wallet state
    localStorage.removeItem('wallet');
    
    // Clear auth context
    setUser(null);
    
    // Reset local state
    setAddress('Not connected');

    // Close all modals
    setShowLogoutConfirm(false);
    onClose();

    // Navigate to loading page
    router.push('/');
  };

  const QRModal = () => {
    if (!showQRModal) return null;
    
    return (
      <>
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[300]"
          onClick={() => setShowQRModal(false)}
        />
        <div
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-xl z-[301]"
          style={{ 
            background: theme.colors.background,
            border: `1px solid ${theme.colors.border}`,
            boxShadow: theme.colors.effects?.glow
          }}
        >
          <div className="flex justify-end">
            <button 
              onClick={() => setShowQRModal(false)}
              className="p-2 hover:bg-white/10 rounded-tr-lg transition-colors"
            >
              <X className="w-4 h-4" style={{ color: theme.colors?.text?.secondary || theme.colors.text }} />
            </button>
          </div>
          <div className="p-8 pt-0">
            <QRCodeSVG 
              value={address}
              size={200}
              level="H"
              includeMargin={true}
              style={{
                padding: '1rem',
                backgroundColor: 'white',
                borderRadius: '0.5rem'
              }}
            />
          </div>
        </div>
      </>
    );
  };

  const LogoutConfirmModal = () => {
    if (!showLogoutConfirm) return null;

    return (
      <>
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[400]"
          onClick={() => setShowLogoutConfirm(false)}
        />
        <div
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 rounded-lg shadow-xl z-[401] max-w-md w-full"
          style={{ 
            background: theme.colors.background,
            border: `1px solid ${theme.colors.border}`,
            boxShadow: theme.colors.effects?.glow
          }}
        >
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-yellow-500 shrink-0 mt-1" />
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Logout from Wallet?</h3>
                <p className="text-sm opacity-80">
                  Make sure you have saved your seed phrase. You will need it to recover your wallet.
                </p>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 rounded-lg text-sm"
                  style={{ 
                    border: `1px solid ${theme.colors.border}`,
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmLogout}
                  className="px-4 py-2 rounded-lg text-sm bg-red-500 hover:bg-red-600 text-white"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]"
        onClick={onClose}
      />
      <div
        className="fixed bottom-16 right-4 w-[400px] rounded-lg shadow-xl z-[201] overflow-hidden"
        style={{ 
          background: theme.colors.background,
          border: `1px solid ${theme.colors.border}`,
          color: theme.colors?.text?.primary || theme.colors.text,
          boxShadow: theme.colors.effects?.glow
        }}
      >
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: theme.colors.border }}>
          <h3 className="font-medium">Settings</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" style={{ color: theme.colors?.text?.secondary || theme.colors.text }} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Address with Logout */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Injective Address:</div>
            <div className="flex items-center gap-2">
              <div 
                className="w-[320px] p-2 rounded text-sm font-mono break-all"
                style={{ 
                  backgroundColor: theme.colors.secondary,
                  border: `1px solid ${theme.colors.border}`
                }}
                title={address}
              >
                {address}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowQRModal(true)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  style={{ 
                    border: `1px solid ${theme.colors.border}`,
                  }}
                  title="Show QR Code"
                >
                  <QrCode className="w-4 h-4" style={{ color: theme.colors?.text?.secondary || theme.colors.text }} />
                </button>
                {(address !== 'Not connected') && (
                  <button
                    onClick={handleLogoutClick}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    style={{ 
                      border: `1px solid ${theme.colors.border}`,
                    }}
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" style={{ color: theme.colors?.text?.secondary || theme.colors.text }} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Theme Toggle */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Theme:</div>
            <button
              onClick={handleThemeChange}
              className="w-full p-2 rounded text-sm text-left"
              style={{ 
                backgroundColor: theme.colors.secondary,
                border: `1px solid ${theme.colors.border}`
              }}
            >
              {currentTheme}
            </button>
          </div>

          {/* AI Trade Toggle */}
          <div className="space-y-2">
            <div className="text-sm font-medium">AI Trade:</div>
            <button
              onClick={() => setAiTradeEnabled(!aiTradeEnabled)}
              className="w-full p-2 rounded text-sm text-left"
              style={{ 
                backgroundColor: theme.colors.secondary,
                border: `1px solid ${theme.colors.border}`
              }}
            >
              {aiTradeEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>
      </div>

      <QRModal />
      <LogoutConfirmModal />
    </>
  );
};

export default SettingsPopup;
