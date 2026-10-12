import React, { useState, useRef, useEffect } from 'react';
import { useAuthActions } from '@convex-dev/auth/react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { LogOut, Cloud, CloudUpload, CheckCircle2, User as UserIcon, Loader2 } from 'lucide-react';
import { OrcaIndexedDB } from '../../db/indexdb';

interface UserMenuProps {
  onOpenAuthModal: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ onOpenAuthModal }) => {
  const { signOut } = useAuthActions();
  const user = useQuery(api.users.currentUser);
  const syncProgressMutation = useMutation(api.users.syncProgress);
  
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

  // If user is not logged in (user === null)
  if (user === null) {
    return (
      <button
        onClick={onOpenAuthModal}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-white text-xs font-bold shadow-xs hover:shadow-md transition cursor-pointer"
        title="Đăng nhập hoặc đăng ký tài khoản"
      >
        <UserIcon className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Đăng nhập</span>
      </button>
    );
  }

  // If loading user data (user === undefined)
  if (user === undefined) {
    return (
      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
    );
  }

  const displayName = user.name || user.email?.split('@')[0] || 'Học viên';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition cursor-pointer text-xs"
        title={user.email || displayName}
      >
        {user.image ? (
          <img src={user.image} alt={displayName} className="w-6 h-6 rounded-full object-cover" />
        ) : (
          <div className="w-6 h-6 rounded-full bg-cyan-500 text-white font-bold flex items-center justify-center text-xs">
            {initial}
          </div>
        )}
        <span className="font-semibold text-slate-700 dark:text-slate-200 hidden md:inline max-w-[100px] truncate">
          {displayName}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-3 space-y-3 animate-scale-up">
          {/* User Info Header */}
          <div className="flex items-center gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
            {user.image ? (
              <img src={user.image} alt={displayName} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-500 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                {initial}
              </div>
            )}
            <div className="overflow-hidden">
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate">
                {displayName}
              </h4>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                {user.email || 'Tài khoản O-Shachi'}
              </p>
            </div>
          </div>

          {/* Sync Button */}
          <button
            onClick={handleCloudSync}
            disabled={isSyncing}
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

          {/* Sign Out Button */}
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
        </div>
      )}
    </div>
  );
};
