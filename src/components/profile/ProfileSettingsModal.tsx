import React, { useState } from 'react';
import { useAuthActions } from '@convex-dev/auth/react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { useCloudSync } from '../../hooks/useCloudSync';
import { UserStats } from '../../types';
import { 
  X, 
  User, 
  Cloud, 
  CloudUpload, 
  CloudDownload, 
  Wifi, 
  WifiOff, 
  LogOut, 
  LogIn, 
  Flame, 
  Brain, 
  Trophy, 
  CheckCircle2, 
  Moon, 
  Sun, 
  Database, 
  AlertCircle,
  Loader2,
  HardDrive
} from 'lucide-react';
import { OrcaMascot } from '../../assets/mascots/OrcaMascot';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuthModal: () => void;
  onOpenBackupModal: () => void;
  stats: UserStats | null;
  cardsCount: number;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  isOpen,
  onClose,
  onOpenAuthModal,
  onOpenBackupModal,
  stats,
  cardsCount,
  isDark,
  onToggleTheme,
}) => {
  const { signOut } = useAuthActions();
  const user = useQuery(api.users.currentUser);
  const { isOnline, isCloudConnected } = useNetworkStatus();
  const { isSyncing, lastSyncTime, pushToCloud, pullFromCloud, cloudProgress } = useCloudSync();

  const [activeTab, setActiveTab] = useState<'profile' | 'sync' | 'settings'>('profile');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePush = async () => {
    const ok = await pushToCloud();
    if (ok) {
      setSuccessMessage('Đã tải tiến độ học tập lên Convex Cloud thành công!');
      setTimeout(() => setSuccessMessage(null), 3500);
    }
  };

  const handlePull = async () => {
    const ok = await pullFromCloud();
    if (ok) {
      setSuccessMessage('Đã tải và cập nhật dữ liệu từ Convex Cloud vào máy thành công!');
      setTimeout(() => setSuccessMessage(null), 3500);
    }
  };

  const formatLastSync = (timestamp: number | null) => {
    if (!timestamp) return 'Chưa có lượt đồng bộ nào';
    const date = new Date(timestamp);
    return date.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const isGuest = user === null || user === undefined;
  const displayName = user?.name || user?.email?.split('@')[0] || 'Học viên Khách';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-scale-up flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-600 p-5 sm:p-6 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            {/* Avatar */}
            {user?.image ? (
              <img 
                src={user.image} 
                alt={displayName} 
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/40 shadow-lg" 
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm ring-2 ring-white/30 text-white font-black text-2xl flex items-center justify-center shadow-lg">
                {isGuest ? <User className="w-8 h-8" /> : initial}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg sm:text-xl font-bold truncate">
                  {displayName}
                </h3>
                {isGuest ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-200 border border-amber-300/30">
                    Khách (Offline)
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400/20 text-emerald-200 border border-emerald-300/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Đã đăng nhập
                  </span>
                )}
              </div>
              <p className="text-xs text-cyan-100 truncate mt-0.5">
                {user?.email || 'Tiến độ đang lưu cục bộ trên trình duyệt (IndexedDB)'}
              </p>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex bg-black/20 p-1 rounded-2xl mt-4">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'profile'
                  ? 'bg-white text-cyan-800 shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Hồ sơ cá nhân</span>
            </button>
            <button
              onClick={() => setActiveTab('sync')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'sync'
                  ? 'bg-white text-cyan-800 shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>Đồng bộ Cloud</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'settings'
                  ? 'bg-white text-cyan-800 shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Cài đặt & Dữ liệu</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* Notification Banner */}
          {successMessage && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ================= TAB 1: HỒ SƠ ================= */}
          {activeTab === 'profile' && (
            <div className="space-y-4 animate-fade-in">
              {/* Guest Warning & Login Action Callout */}
              {isGuest && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-cyan-500" />
                      Bạn đang dùng tài khoản Khách
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Đăng nhập tài khoản hoặc Google để đồng bộ thẻ SRS và duy trì chuỗi Streak sang các thiết bị khác.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAuthModal();
                    }}
                    className="shrink-0 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Đăng nhập ngay</span>
                  </button>
                </div>
              )}

              {/* Study Progress Metrics */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Thành tích học tập hiện tại
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
                      <Flame className="w-5 h-5 fill-amber-500" />
                    </div>
                    <div>
                      <div className="text-base font-black text-slate-800 dark:text-slate-100">
                        {stats?.streak || 1} ngày
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">Chuỗi Streak</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-500">
                      <Brain className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-base font-black text-slate-800 dark:text-slate-100">
                        {cardsCount}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">Thẻ SRS trong bộ</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3 col-span-2 sm:col-span-1">
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-base font-black text-slate-800 dark:text-slate-100">
                        {stats?.totalReviewsCompleted || 0}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">Lượt ôn tập</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Offline-First Guarantee Banner */}
              <div className="p-3.5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                <HardDrive className="w-5 h-5 text-cyan-500 shrink-0" />
                <div className="text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-bold text-slate-800 dark:text-slate-100">Lưu trữ cục bộ an toàn: </span>
                  Ứng dụng hoạt động 100% không cần mạng. Toàn bộ từ vựng, kanji, ngữ pháp và lượt ôn đều được bảo vệ trong IndexedDB trên thiết bị này.
                </div>
              </div>

              {/* Sign out button (if logged in) */}
              {!isGuest && (
                <div className="pt-2">
                  <button
                    onClick={async () => {
                      onClose();
                      await signOut();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl border border-rose-300 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Đăng xuất tài khoản</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 2: ĐỒNG BỘ CLOUD ================= */}
          {activeTab === 'sync' && (
            <div className="space-y-4 animate-fade-in">
              {/* Network Status Badges */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {isOnline ? <Wifi className="w-4 h-4 text-emerald-500" /> : <WifiOff className="w-4 h-4 text-rose-500" />}
                    <span>Internet</span>
                  </div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    {isOnline ? '🟢 Đang trực tuyến (Online)' : '🔴 Mất kết nối (Offline)'}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <Cloud className="w-4 h-4 text-cyan-500" />
                    <span>Máy chủ Convex Cloud</span>
                  </div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    {isCloudConnected ? '🟢 Đã kết nối Cloud' : '🟡 Cục bộ (Local Only)'}
                  </div>
                </div>
              </div>

              {/* Sync Actions */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Lần đồng bộ gần nhất:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-200">{formatLastSync(lastSyncTime)}</span>
                </div>

                {isGuest ? (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400 space-y-2">
                    <p>Bạn cần đăng nhập tài khoản để kích hoạt tính năng đồng bộ hai chiều với Convex Cloud.</p>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenAuthModal();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 text-white font-bold hover:bg-amber-600 transition cursor-pointer text-xs"
                    >
                      Đăng nhập / Đăng ký
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={handlePush}
                      disabled={isSyncing || !isOnline}
                      className="py-2.5 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-xs"
                    >
                      {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CloudUpload className="w-4 h-4" />}
                      <span>Tải lên Cloud (Backup)</span>
                    </button>

                    <button
                      onClick={handlePull}
                      disabled={isSyncing || !isOnline || !cloudProgress}
                      className="py-2.5 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CloudDownload className="w-4 h-4" />}
                      <span>Tải về máy (Restore)</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= TAB 3: CÀI ĐẶT & DỮ LIỆU ================= */}
          {activeTab === 'settings' && (
            <div className="space-y-4 animate-fade-in">
              {/* Appearance Setting */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">Chế độ giao diện</h4>
                  <p className="text-[11px] text-slate-400">
                    {isDark ? 'Giao diện Tối (Midnight Abyss)' : 'Giao diện Sáng (Iceberg White)'}
                  </p>
                </div>
                <button
                  onClick={onToggleTheme}
                  className="p-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 cursor-pointer transition hover:scale-105"
                  title="Đổi theme"
                >
                  {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
                </button>
              </div>

              {/* JSON Backup & Restore Setting */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">Sao lưu & Khôi phục tệp JSON</h4>
                  <p className="text-[11px] text-slate-400">
                    Xuất hoặc nhập toàn bộ dữ liệu ra tệp .json offline
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenBackupModal();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer transition"
                >
                  Quản lý tệp
                </button>
              </div>

              {/* App Mascot Footer greeting */}
              <div className="p-3.5 rounded-2xl bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-900/30 flex items-center gap-3">
                <OrcaMascot mood="celebration" size={42} />
                <div className="text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-bold text-cyan-600 dark:text-cyan-400">O-Shachi: </span>
                  Học offline mượt mà, lưu trữ độc lập và bảo vệ dữ liệu tối đa cho người học tiếng Nhật!
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
