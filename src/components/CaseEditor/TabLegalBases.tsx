import React, { useState } from 'react';
import { LegalBasisSource, LegalBasisVerificationStatus } from '../../types/case';
import {
  Plus,
  Trash2,
  Edit2,
  BookOpen,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
  Save,
  Globe,
  Calendar
} from 'lucide-react';

interface Props {
  legalBases: LegalBasisSource[];
  matterId: string;
  onChange: (items: LegalBasisSource[]) => void;
}

export const TabLegalBases: React.FC<Props> = ({ legalBases, matterId, onChange }) => {
  const [editingItem, setEditingItem] = useState<LegalBasisSource | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const verificationStatuses: LegalBasisVerificationStatus[] = [
    'Terverifikasi Resmi',
    'Belum Diverifikasi',
    'Perlu Pembaruan'
  ];

  const handleOpenNew = () => {
    setEditingItem({
      id: 'lb-' + Math.random().toString(36).substring(2, 8),
      matterId,
      title: '',
      numberYear: '',
      articleClause: '',
      officialUrl: '',
      accessDate: new Date().toISOString().split('T')[0],
      verificationStatus: 'Belum Diverifikasi',
      quote: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!editingItem || !editingItem.title.trim() || !editingItem.articleClause.trim()) {
      alert('Judul Peraturan dan Pasal/Ayat wajib diisi!');
      return;
    }

    const exists = legalBases.some((item) => item.id === editingItem.id);
    let updated: LegalBasisSource[];
    if (exists) {
      updated = legalBases.map((item) =>
        item.id === editingItem.id ? { ...editingItem, updatedAt: new Date().toISOString() } : item
      );
    } else {
      updated = [...legalBases, { ...editingItem, updatedAt: new Date().toISOString() }];
    }
    onChange(updated);
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Hapus rujukan dasar hukum ini?')) {
      onChange(legalBases.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Principle Banner */}
      <div className="bg-slate-100 border border-slate-200 rounded-lg p-3 text-xs text-slate-700 flex items-start gap-2.5">
        <BookOpen className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-900 mr-1.5">
            Modul Dasar Hukum & Sumber Resmi:
          </span>
          Setiap delik atau acuan prosedural harus berlabuh pada instrumen hukum yang sah. Cantumkan rujukan undang-undang, nomor/tahun, pasal/ayat, tautan portal peraturan resmi negara (misal JDIH / peraturan.go.id), tanggal akses telaah, serta kutipan verbatim teks pasal.
        </div>
      </div>

      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Daftar Dasar Hukum & Sumber Peraturan ({legalBases.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Inventarisasi regulasi materiil dan formil yang mendasari analisis perkara.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold text-xs rounded-lg transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Tambah Dasar Hukum</span>
        </button>
      </div>

      {/* Legal Bases Cards */}
      {legalBases.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-8 text-center text-slate-500">
          <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">Belum ada dasar hukum yang dicatat</p>
          <p className="text-xs mt-1">
            Klik tombol &quot;Tambah Dasar Hukum&quot; untuk memasukkan KUHP, KUHAP, atau undang-undang pidana khusus terkait.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {legalBases.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-slate-300 transition space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs mb-1">
                    <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-mono">
                      {item.articleClause}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="font-semibold text-slate-800">{item.numberYear}</span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span
                      className={`text-[11px] font-semibold ${
                        item.verificationStatus === 'Terverifikasi Resmi'
                          ? 'text-emerald-700'
                          : item.verificationStatus === 'Perlu Pembaruan'
                          ? 'text-rose-700'
                          : 'text-amber-700'
                      }`}
                    >
                      {item.verificationStatus}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                </div>

                <div className="flex items-center gap-1 text-slate-400 self-end sm:self-auto">
                  <button
                    onClick={() => {
                      setEditingItem(item);
                      setIsModalOpen(true);
                    }}
                    className="p-1 hover:text-amber-600 rounded transition cursor-pointer"
                    title="Edit Dasar Hukum"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1 hover:text-rose-600 rounded transition cursor-pointer"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Kutipan Resmi */}
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Kutipan Resmi Ketentuan:
                </span>
                <blockquote className="text-xs text-slate-800 bg-slate-50 border-l-2 border-slate-400 pl-3.5 py-2 rounded-r leading-relaxed">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
              </div>

              {/* Source verification footer */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                <div className="flex items-center gap-3">
                  {item.officialUrl ? (
                    <a
                      href={item.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-700 hover:text-amber-800 hover:underline flex items-center gap-1 font-medium"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span className="max-w-[260px] truncate">{item.officialUrl}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  ) : (
                    <span className="text-slate-400 italic">URL resmi belum ditambahkan</span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Tanggal Akses: <strong>{item.accessDate || '-'}</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add / Edit Legal Basis */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">
                {legalBases.some((item) => item.id === editingItem.id)
                  ? 'Edit Dasar Hukum & Sumber'
                  : 'Tambah Dasar Hukum & Sumber Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Judul Peraturan Perundang-undangan *
                </label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="Contoh: Kitab Undang-Undang Hukum Pidana (KUHP)"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor / Tahun Regulasi *
                  </label>
                  <input
                    type="text"
                    value={editingItem.numberYear}
                    onChange={(e) => setEditingItem({ ...editingItem, numberYear: e.target.value })}
                    placeholder="Contoh: UU No. 1 Tahun 1946"
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pasal / Ayat Rujukan *
                  </label>
                  <input
                    type="text"
                    value={editingItem.articleClause}
                    onChange={(e) => setEditingItem({ ...editingItem, articleClause: e.target.value })}
                    placeholder="Contoh: Pasal 378 KUHP"
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status Verifikasi Dokumen
                  </label>
                  <select
                    value={editingItem.verificationStatus}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        verificationStatus: e.target.value as LegalBasisVerificationStatus
                      })
                    }
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg text-slate-900 cursor-pointer font-medium"
                  >
                    {verificationStatuses.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Akses / Pengujian *
                  </label>
                  <input
                    type="date"
                    value={editingItem.accessDate}
                    onChange={(e) => setEditingItem({ ...editingItem, accessDate: e.target.value })}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  URL Resmi Sumber Regulasi (JDIH / Portal Negara)
                </label>
                <input
                  type="url"
                  value={editingItem.officialUrl}
                  onChange={(e) => setEditingItem({ ...editingItem, officialUrl: e.target.value })}
                  placeholder="https://peraturan.go.id/id/..."
                  className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kutipan Teks Resmi Ketentuan *
                </label>
                <textarea
                  rows={4}
                  value={editingItem.quote}
                  onChange={(e) => setEditingItem({ ...editingItem, quote: e.target.value })}
                  placeholder="Salin teks resmi pasal atau ayat persis sesuai lembaran negara..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 leading-relaxed"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-200 bg-slate-50">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 font-medium rounded-lg transition cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={!editingItem.title.trim() || !editingItem.articleClause.trim()}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-slate-950 font-semibold text-xs rounded-lg transition cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Dasar Hukum</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
