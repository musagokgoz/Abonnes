import React, { useState } from 'react';
import { X, Download, Upload, Database, Check, AlertCircle } from 'lucide-react';
import { cloudStorageService } from '../services/cloudStorageService';

export default function SettingsModal({ isOpen, onClose, onDataChanged, subscriptions, userId }) {
  const [importStatus, setImportStatus] = useState(null);

  const handleExport = () => {
    const exportObj = {
      app: 'Abonnes',
      version: '2.0',
      exportDate: new Date().toISOString(),
      subscriptions,
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObj, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = dataStr;
    downloadAnchor.download = `abonnes_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result);
        const list = Array.isArray(parsed) ? parsed : parsed.subscriptions;
        if (!Array.isArray(list) || list.some((item) => !item.custom_name || Number(item.price) < 0)) {
          throw new Error('Geçersiz abonelik verisi.');
        }
        await cloudStorageService.importSubscriptions(list, userId);
        setImportStatus({ type: 'success', message: `${list.length} adet abonelik buluta aktarıldı!` });
        if (onDataChanged) await onDataChanged();
      } catch (error) {
        setImportStatus({ type: 'error', message: `İçe aktarma hatası: ${error.message}` });
      }
    };
    reader.readAsText(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Başlık */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-800 text-slate-300 rounded-xl">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Yedekleme & Entegrasyon</h2>
              <p className="text-xs text-slate-400">Verilerinizi JSON olarak yedekleyin veya geri yükleyin</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {importStatus && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                importStatus.type === 'success'
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
              }`}
            >
              {importStatus.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{importStatus.message}</span>
            </div>
          )}

          <div className="space-y-4">
              {/* Dışa Aktar */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Yedeği İndir (Export)</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Tüm aboneliklerinizi JSON dosyası olarak kaydedin.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleExport}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl text-white bg-slate-800 hover:bg-slate-700 transition-all border border-slate-700"
                >
                  <Download className="w-4 h-4" />
                  <span>Dışa Aktar</span>
                </button>
              </div>

              {/* İçe Aktar */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Yedekten Yükle (Import)</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Daha önce aldığınız JSON yedeğini geri yükleyin.
                  </p>
                </div>
                <label className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl text-white bg-slate-800 hover:bg-slate-700 transition-all border border-slate-700 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span>Dosya Seç</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportFile}
                    className="hidden"
                  />
                </label>
              </div>

          </div>
        </div>
      </div>
    </div>
  );
}
