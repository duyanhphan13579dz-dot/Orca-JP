import React, { useState } from 'react';
import { useAuthActions } from '@convex-dev/auth/react';
import { X, Mail, Lock, User, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { OrcaMascot } from '../../assets/mascots/OrcaMascot';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { signIn } = useAuthActions();
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'signUp' && password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại!');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu cần tối thiểu 6 ký tự.');
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'signIn') {
        await signIn('password', {
          email: email.trim().toLowerCase(),
          password,
          flow: 'signIn',
        });
      } else {
        const signUpParams: Record<string, string> = {
          email: email.trim().toLowerCase(),
          password,
          flow: 'signUp',
        };
        if (name.trim()) {
          signUpParams.name = name.trim();
        }
        await signIn('password', signUpParams);
      }
      setIsLoading(false);
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      setIsLoading(false);
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('Invalid credentials') || msg.includes('not found') || msg.includes('password')) {
        setError('Email hoặc mật khẩu không chính xác.');
      } else if (msg.includes('already exists') || msg.includes('UniqueConstraint')) {
        setError('Tài khoản email này đã được đăng ký. Vui lòng chuyển sang Đăng nhập.');
      } else {
        setError(`Đã có lỗi xảy ra: ${msg}`);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await signIn('google', {
        redirectTo: window.location.origin,
      });
    } catch (err: unknown) {
      setIsLoading(false);
      const msg = err instanceof Error ? err.message : String(err);
      setError(`Không thể kết nối với Google: ${msg}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header / Decoration Banner */}
        <div className="bg-gradient-to-br from-cyan-500 via-sky-600 to-indigo-600 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            title="Đóng modal"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex justify-center mb-2">
            <OrcaMascot mood={mode === 'signUp' ? 'celebration' : 'studying'} size={56} />
          </div>
          
          <h2 className="text-xl font-bold tracking-tight">
            {mode === 'signIn' ? 'Chào mừng bạn trở lại!' : 'Tạo tài khoản O-Shachi'}
          </h2>
          <p className="text-xs text-cyan-100 mt-1">
            {mode === 'signIn' 
              ? 'Đăng nhập để đồng bộ tiến độ học và giữ vững chuỗi streak.' 
              : 'Bảo lưu tiến độ N5-N3 trên mọi thiết bị hoàn toàn miễn phí.'}
          </p>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-black/20 p-1 rounded-2xl mt-4 max-w-xs mx-auto">
            <button
              type="button"
              onClick={() => { setMode('signIn'); setError(null); }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                mode === 'signIn' 
                  ? 'bg-white text-cyan-700 shadow-sm' 
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => { setMode('signUp'); setError(null); }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                mode === 'signUp' 
                  ? 'bg-white text-cyan-700 shadow-sm' 
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Đăng ký mới
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {/* Error Banner */}
          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-rose-500/10 dark:bg-rose-500/20 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-sm font-semibold transition shadow-xs hover:shadow-md cursor-pointer disabled:opacity-50"
          >
            {/* Google Logo SVG */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Đăng nhập nhanh với Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Hoặc với email</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signUp' && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Tên hiển thị / Biệt danh
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ví dụ: Takahashi"
                    className="w-full pl-10 pr-4 py-2 text-sm rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Địa chỉ Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full pl-10 pr-10 py-2 text-sm rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'signUp' && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Xác nhận lại mật khẩu
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu trên"
                    className="w-full pl-10 pr-4 py-2 text-sm rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-white text-sm font-bold shadow-md shadow-cyan-500/25 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{mode === 'signIn' ? 'Đăng nhập vào O-Shachi' : 'Hoàn tất đăng ký'}</span>
            </button>
          </form>

          {/* Privacy Note */}
          <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 pt-1">
            Ứng dụng tôn trọng quyền riêng tư. Dữ liệu học offline của bạn luôn an toàn trên trình duyệt.
          </p>
        </div>
      </div>
    </div>
  );
};
