import React, { useState } from 'react';
import { X, Plus, AlertCircle, Landmark, Scale } from 'lucide-react';
import { createNewCase } from '../lib/storage';
import { CaseFullPackage } from '../types/case';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCaseCreated: (newCase: CaseFullPackage) => void;
}

export const NewCaseModal: React.FC<Props> = ({ isOpen, onClose, onCaseCreated }) => {
  const [title, setTitle] = useState('');
  const [refNumber, setRefNumber] = useState('');
  const [category, setCategory] = useState('Kejahatan Terhadap Harta Benda (Penipuan & Penggelapan)');
  const [jurisdiction, setJurisdiction] = useState('Pengadilan Negeri Jakarta Selatan / Wilayah Hukum Polda Metro Jaya');
  const [caseType, setCaseType] = useState('Tindak Pidana Umum (Kejahatan Harta Benda)');

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !refNumber.trim()) {
      alert('Nama Perkara dan Nomor Referensi wajib diisi!');
      return;
    }

    const newPkg = createNewCase(title, refNumber, category, jurisdiction, caseType);
    onCaseCreated(newPkg);
    onClose();
    setTitle('');
    setRefNumber('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-case-title"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 no-print animate-in fade-in duration-150"
    >
      <div className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-amber-600 stroke-[2.5]" aria-hidden="true" />
            <h3 id="new-case-title" className="text-sm font-bold text-slate-900">Pendaftaran Berkas Perkara Baru</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup form perkara baru (Tekan Escape)"
            className="text-slate-400 hover:text-slate-600 p-1 rounded transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="bg-amber-50/60 border border-amber-200/60 rounded-lg p-3 text-xs text-amber-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Perkara baru akan didaftarkan pada tahap &quot;Penyelidikan&quot;, tersimpan di penyimpanan lokal peramban, membawa checklist prosedural 11 ranah berstatus awal belum dinilai, dan belum ditinjau manusia.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama / Judul Dugaan Perkara *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Dugaan Penipuan Pengadaan Komoditas Fiktif..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nomor Referensi / LP / Register *
            </label>
            <input
              type="text"
              required
              value={refNumber}
              onChange={(e) => setRefNumber(e.target.value)}
              placeholder="Contoh: LP/B/188/V/2026/SPKT"
              className="w-full px-3 py-1.5 text-sm font-mono border border-slate-300 rounded-lg text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Scale className="w-3 h-3 text-slate-500" />
                <span>Jenis Perkara *</span>
              </label>
              <input
                type="text"
                required
                value={caseType}
                onChange={(e) => setCaseType(e.target.value)}
                placeholder="Tindak Pidana Umum"
                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Landmark className="w-3 h-3 text-slate-500" />
                <span>Yurisdiksi Hukum *</span>
              </label>
              <input
                type="text"
                required
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                placeholder="PN Jakarta Selatan"
                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Klasifikasi / Kategori Tambahan
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Kejahatan Terhadap Harta Benda"
              className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg text-slate-900"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs text-slate-600 hover:text-slate-800 font-medium rounded-lg transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold text-xs rounded-lg transition cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Daftarkan Perkara</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
