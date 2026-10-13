import React, { useState } from 'react';
import { FactClaim, FactType, ReviewStatus } from '../../types/case';
import { Plus, Trash2, Edit2, AlertCircle, Quote, X, Save, CheckCircle2, HelpCircle } from 'lucide-react';

interface Props {
  facts: FactClaim[];
  matterId: string;
  onChange: (facts: FactClaim[]) => void;
}

export const TabFactsClaims: React.FC<Props> = ({ facts, matterId, onChange }) => {
  const [editingFact, setEditingFact] = useState<FactClaim | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  const factTypes: FactType[] = [
    'Fakta Terverifikasi',
    'Klaim Saksi/Pihak',
    'Inferensi Awal',
    'Opini/Argumen'
  ];

  const reviewStatuses: ReviewStatus[] = ['Belum Ditinjau', 'Ditinjau', 'Perlu Klarifikasi', 'Diperselisihkan'];

  const handleOpenNew = () => {
    setEditingFact({
      id: 'fact-' + Math.random().toString(36).substring(2, 8),
      matterId,
      type: 'Klaim Saksi/Pihak',
      subject: '',
      action: '',
      timeText: '',
      placeText: '',
      objectText: '',
      rawClaimText: '',
      sourceRef: '',
      documentPage: '',
      reviewStatus: 'Belum Ditinjau',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!editingFact || !editingFact.subject.trim() || !editingFact.sourceRef.trim()) {
      alert('Subjek dan Sumber Dokumen wajib diisi!');
      return;
    }

    const exists = facts.some((f) => f.id === editingFact.id);
    let updated: FactClaim[];
    if (exists) {
      updated = facts.map((f) =>
        f.id === editingFact.id ? { ...editingFact, updatedAt: new Date().toISOString() } : f
      );
    } else {
      updated = [...facts, { ...editingFact, updatedAt: new Date().toISOString() }];
    }
    onChange(updated);
    setIsModalOpen(false);
    setEditingFact(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Hapus butir fakta/klaim ini?')) {
      onChange(facts.filter((f) => f.id !== id));
    }
  };

  const filtered = facts.filter((f) => filterType === 'all' || f.type === filterType);

  return (
    <div className="space-y-6">
      {/* Principle Banner */}
      <div className="bg-slate-100 border border-slate-200 rounded-lg p-3 text-xs text-slate-700 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-900 mr-1.5">Standar Pemisahan Bukti:</span>
          Jangan mencampuradukkan <strong className="text-emerald-800">Fakta Terverifikasi</strong> (didukung dokumen/rekaman objektif), <strong className="text-blue-800">Klaim</strong> (ucapan sepihak saksi), <strong className="text-amber-800">Inferensi</strong> (deduksi awal penyidik), dan <strong className="text-slate-700">Opini</strong>. Setiap butir wajib memiliki rujukan sumber yang dapat diaudit.
        </div>
      </div>

      {/* Top action & filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Filter Tipe:</span>
          <select
            aria-label="Filter Tipe Fakta/Klaim"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs bg-white border border-slate-300 rounded-md px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="all">Semua Tipe ({facts.length})</option>
            {factTypes.map((t) => (
              <option key={t} value={t}>
                {t} ({facts.filter((f) => f.type === t).length})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleOpenNew}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold text-xs rounded-lg transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Tambah Fakta / Klaim</span>
        </button>
      </div>

      {/* Facts cards */}
      {filtered.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-8 text-center text-slate-500">
          <Quote className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">Belum ada butir fakta atau klaim terdata</p>
          <p className="text-xs mt-1">Gunakan tombol di atas untuk mencatat keterangan terstruktur dari BAP atau dokumen sitaan.</p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filtered.map((f) => (
            <div
              key={f.id}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-slate-300 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span
                    className={`font-semibold ${
                      f.type === 'Fakta Terverifikasi'
                        ? 'text-emerald-700'
                        : f.type === 'Klaim Saksi/Pihak'
                        ? 'text-blue-700'
                        : f.type === 'Inferensi Awal'
                        ? 'text-amber-700'
                        : 'text-slate-600'
                    }`}
                  >
                    [{f.type}]
                  </span>
                  <span aria-hidden="true" className="text-slate-400">·</span>
                  <span className="font-bold text-slate-900">{f.subject}</span>
                  <span aria-hidden="true" className="text-slate-400">·</span>
                  <span className="text-slate-700 italic">{f.action}</span>
                  <span aria-hidden="true" className="text-slate-400">·</span>
                  <span
                    className={`text-[11px] ${
                      f.reviewStatus === 'Ditinjau'
                        ? 'text-emerald-600 font-medium'
                        : f.reviewStatus === 'Diperselisihkan'
                        ? 'text-rose-600 font-semibold'
                        : 'text-amber-600'
                    }`}
                  >
                    Status: {f.reviewStatus}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-slate-400 self-end sm:self-auto">
                  <button
                    onClick={() => {
                      setEditingFact(f);
                      setIsModalOpen(true);
                    }}
                    className="p-1 hover:text-amber-600 rounded transition cursor-pointer"
                    title="Edit Data"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(f.id)}
                    className="p-1 hover:text-rose-600 rounded transition cursor-pointer"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Kutipan Klaim */}
              <blockquote className="text-xs text-slate-800 bg-slate-50 border-l-2 border-slate-300 pl-3 py-2 my-2.5 rounded-r">
                &ldquo;{f.rawClaimText}&rdquo;
              </blockquote>

              {/* Context grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-600 mt-2 bg-slate-50/60 p-2 rounded">
                <div>
                  <span className="font-semibold text-slate-500">Waktu:</span> {f.timeText || 'Belum tersedia'}
                </div>
                <div>
                  <span className="font-semibold text-slate-500">Tempat:</span> {f.placeText || 'Belum tersedia'}
                </div>
                <div>
                  <span className="font-semibold text-slate-500">Objek:</span> {f.objectText || 'Belum tersedia'}
                </div>
              </div>

              {/* Source attribution mandatory */}
              <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-700">Rujukan Sumber:</span>
                  <span className="text-slate-800 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                    {f.sourceRef}
                  </span>
                  {f.documentPage && (
                    <span className="text-slate-500">({f.documentPage})</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add / Edit FactClaim */}
      {isModalOpen && editingFact && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">
                {facts.some((f) => f.id === editingFact.id) ? 'Edit Fakta / Klaim' : 'Tambah Fakta / Klaim Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Klasifikasi Pernyataan *</label>
                  <select
                    value={editingFact.type}
                    onChange={(e) => setEditingFact({ ...editingFact, type: e.target.value as FactType })}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 cursor-pointer font-medium"
                  >
                    {factTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status Verifikasi *</label>
                  <select
                    value={editingFact.reviewStatus}
                    onChange={(e) => setEditingFact({ ...editingFact, reviewStatus: e.target.value as ReviewStatus })}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 cursor-pointer"
                  >
                    {reviewStatuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subjek Hukum *</label>
                  <input
                    type="text"
                    value={editingFact.subject}
                    onChange={(e) => setEditingFact({ ...editingFact, subject: e.target.value })}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 font-medium"
                    placeholder="Contoh: Hj. Ratna Dewi"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tindakan / Perbuatan *</label>
                  <input
                    type="text"
                    value={editingFact.action}
                    onChange={(e) => setEditingFact({ ...editingFact, action: e.target.value })}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900"
                    placeholder="Contoh: Mentransfer modal kerja"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kutipan / Bunyi Klaim Verbatim *
                </label>
                <textarea
                  rows={3}
                  value={editingFact.rawClaimText}
                  onChange={(e) => setEditingFact({ ...editingFact, rawClaimText: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900"
                  placeholder="Kutipan langsung dari dokumen atau pengakuan saksi dalam pemeriksaan..."
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Waktu</label>
                  <input
                    type="text"
                    value={editingFact.timeText}
                    onChange={(e) => setEditingFact({ ...editingFact, timeText: e.target.value })}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg text-slate-900"
                    placeholder="15 Maret 2026 14:12 WIB"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tempat</label>
                  <input
                    type="text"
                    value={editingFact.placeText}
                    onChange={(e) => setEditingFact({ ...editingFact, placeText: e.target.value })}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg text-slate-900"
                    placeholder="Bank Mandiri Jakarta"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Objek</label>
                  <input
                    type="text"
                    value={editingFact.objectText}
                    onChange={(e) => setEditingFact({ ...editingFact, objectText: e.target.value })}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg text-slate-900"
                    placeholder="Uang Rp1.250.000.000,-"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sumber Rujukan Berkas (Wajib) *
                  </label>
                  <input
                    type="text"
                    value={editingFact.sourceRef}
                    onChange={(e) => setEditingFact({ ...editingFact, sourceRef: e.target.value })}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg text-slate-900 font-mono"
                    placeholder="Contoh: Rekening Koran Mandiri / BAP Saksi A"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Halaman / Lembar</label>
                  <input
                    type="text"
                    value={editingFact.documentPage || ''}
                    onChange={(e) => setEditingFact({ ...editingFact, documentPage: e.target.value })}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg text-slate-900"
                    placeholder="Hal. 4 Jawaban 10"
                  />
                </div>
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
                disabled={!editingFact.subject.trim() || !editingFact.sourceRef.trim()}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-slate-950 font-semibold text-xs rounded-lg transition cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Fakta</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
