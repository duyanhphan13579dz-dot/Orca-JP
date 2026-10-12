import React, { useState, useRef, useEffect } from 'react';
import { useAuthActions } from '@convex-dev/auth/react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { LogOut, LogIn, Cloud, CloudUpload, CheckCircle2, User as UserIcon, Loader2, Settings } from 'lucide-react';
import { OrcaIndexedDB } from '../../db/indexdb';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

interface UserMenuProps {
  onOpenAuthModal: () => void;
  onOpenProfileSettings: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ 
  onOpenAuthModal,
  onOpenProfileSettings 
}) => {
  const { signOut } = useAuthActions();
  const user = useQuery(api.users.currentUser);
  const syncProgressMutation = useMutation(api.users.syncProgress);
  const { isOnline, isCloudConnected } = useNetworkStatus();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCloudSync = async () => {
    if (!isOnline) return;
    setIsSyncing(true);
    setSyncSuccess(false);
    try {
      const db = new OrcaIndexedDB();
      const srsCards = await db.getAllCards();
      const stats = await db.getStats();
      const streaks = await db.getDailyStreaks(365);

      await syncProgressMutation({
        srsCardsJson: JSON.stringify(srsCards),
        statsJson: JSON.stringify(stats),
        streakJson: JSON.stringify(streaks),
      });

      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to sync progress to Convex Cloud:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const isGuest = !user;
  const displayName = user?.name || user?.email?.split('@')[0] || 'Khách (Offline)';
  const initial = user ? displayName.charAt(0).toUpperCase() : 'G';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition cursor-pointer text-xs"
        title={user ? (user.email || displayName) : 'Hồ sơ học viên (Khách/Offline)'}
      >
        <div className="relative">
          {user?.image ? (
            <img src={user.image} alt={displayName} className="w-6 h-6 rounded-full object-cover" />
          ) : (
            <div className={`w-6 h-6 rounded-full font-bold flex items-center justify-center text-[11px] ${
              user ? 'bg-cyan-500 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}>
              {user ? initial : <UserIcon className="w-3.5 h-3.5" />}
            </div>
          )}
          {/* Realtime Connection Status Dot */}
          <span 
            className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white dark:border-slate-900 ${
              isCloudConnected ? 'bg-emerald-500' : isOnline ? 'bg-amber-400' : 'bg-rose-500'
            }`} 
            title={isCloudConnected ? 'Đã kết nối Cloud' : isOnline ? 'Online (Cục bộ)' : 'Ngoại tuyến (Offline)'}
          />
        </div>

        <span className="font-semibold text-slate-700 dark:text-slate-200 hidden md:inline max-w-[110px] truncate">
          {displayName}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-3 space-y-2.5 animate-scale-up">
          {/* User Info Header */}
          <div className="flex items-center gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
            {user?.image ? (
              <img src={user.image} alt={displayName} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-500 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                {user ? initial : <UserIcon className="w-5 h-5" />}
              </div>
            )}
            <div className="overflow-hidden flex-1">
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate">
                {displayName}
              </h4>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                {user?.email || (isOnline ? 'Tài khoản Khách (Offline)' : 'Đang ở chế độ Offline')}
              </p>
            </div>
          </div>

          {/* Quick Action: Profile & Settings Modal */}
          <button
            onClick={() => {
              setIsOpen(false);
              onOpenProfileSettings();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition cursor-pointer"
          >
            <Settings className="w-4 h-4 text-cyan-500" />
            <span>Xem Hồ sơ & Cài đặt</span>
          </button>

          {/* Sync Button (if logged in) */}
          {!isGuest ? (
            <button
              onClick={handleCloudSync}
              disabled={isSyncing || !isOnline}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-semibold transition cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                {isSyncing ? (
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-500" />
                ) : syncSuccess ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <CloudUpload className="w-4 h-4 text-cyan-500" />
                )}
                <span>{syncSuccess ? 'Đã đồng bộ Cloud!' : isSyncing ? 'Đang tải lên...' : 'Đồng bộ tiến độ lên Cloud'}</span>
              </div>
              <Cloud className="w-3.5 h-3.5 opacity-60" />
            </button>
          ) : (
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenAuthModal();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-white text-xs font-bold transition cursor-pointer shadow-xs"
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng nhập / Đăng ký</span>
            </button>
          )}

          {/* Sign Out Button (if logged in) */}
          {!isGuest && (
            <button
              onClick={async () => {
                setIsOpen(false);
                await signOut();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-semibold transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng xuất</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
