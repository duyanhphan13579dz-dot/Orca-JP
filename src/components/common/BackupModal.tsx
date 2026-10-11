import React, { useState } from 'react';
import { Download, Upload, X, CheckCircle, AlertTriangle, Database, RefreshCw } from 'lucide-react';
import { dbInstance } from '../../db/indexdb';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  onDataChanged,
}) => {
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    try {
      setIsProcessing(true);
      const blob = await dbInstance.exportFullBackupBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `orca-jp-progress-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setStatusMessage({
        type: 'success',
        text: 'Đã xuất file orca-jp-progress.json thành công!',
      });
    } catch (e) {
      setStatusMessage({
        type: 'error',
        text: 'Không thể xuất dữ liệu: ' + String(e),
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      const success = await dbInstance.importFullBackupBlob(file);
      if (success) {
        setStatusMessage({
          type: 'success',
          text: 'Khôi phục tiến trình học thành công từ file backup V2.0!',
        });
        onDataChanged();
      } else {
        setStatusMessage({
          type: 'error',
          text: 'Định dạng tệp tin không hợp lệ hoặc dữ liệu hỏng!',
        });
      }
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Lỗi trong quá trình khôi phục dữ liệu.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-500 flex items-center justify-center">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Sao lưu & Phục hồi</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Dữ liệu lưu 100% trên IndexedDB trình duyệt của bạn
            </p>
          </div>
        </div>

        {statusMessage && (
          <div
            className={`p-3 rounded-xl mb-4 text-xs flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                : 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <div className="space-y-3 mb-6">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                Xuất file tiến trình
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Lưu thẻ nhớ SRS, số ngày chuỗi và điểm số
              </div>
            </div>
            <button
              onClick={handleExport}
              disabled={isProcessing}
              className="px-3.5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Xuất JSON
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                Nhập file đã lưu
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Khôi phục từ tệp <code className="text-cyan-600 dark:text-cyan-400">.json</code>
              </div>
            </div>
            <label className="px-3.5 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer">
              <Upload className="w-4 h-4" />
              Chọn tệp
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
                disabled={isProcessing}
              />
            </label>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 dark:text-slate-500 text-center flex items-center justify-center gap-1">
          <RefreshCw className="w-3 h-3" />
          Zero-backend: Dữ liệu của bạn an toàn, không gửi lên bất kỳ máy chủ nào.
        </div>
      </div>
    </div>
  );
};
