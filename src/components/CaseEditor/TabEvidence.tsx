import React, { useState } from 'react';
import { EvidenceItem, EvidenceType, ReviewStatus } from '../../types/case';
import { Plus, Trash2, Edit2, ShieldAlert, FileCheck, Hash, Archive, X, Save, AlertTriangle } from 'lucide-react';

interface Props {
  evidences: EvidenceItem[];
  matterId: string;
  onChange: (evidences: EvidenceItem[]) => void;
}

export const TabEvidence: React.FC<Props> = ({ evidences, matterId, onChange }) => {
  const [editingEvidence, setEditingEvidence] = useState<EvidenceItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  const evidenceTypes: EvidenceType[] = [
    'Surat / Dokumen',
    'Bukti Elektronik',
    'Barang Bukti Fisik',
    'Keterangan Saksi',
    'Keterangan Ahli',
    'Petunjuk'
  ];

  const reviewStatuses: ReviewStatus[] = ['Belum Ditinjau', 'Ditinjau', 'Perlu Klarifikasi'];

  const handleOpenNew = () => {
    setEditingEvidence({
      id: 'ev-' + Math.random().toString(36).substring(2, 8),
      matterId,
      type: 'Surat / Dokumen',
      label: '',
      description: '',
      origin: '',
      acquisitionDate: new Date().toISOString().split('T')[0],
      manualHash: '',
      mockFileRef: '',
      chainOfCustodyNotes: '',
      storageLocation: '',
      reviewStatus: 'Belum Ditinjau',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!editingEvidence || !editingEvidence.label.trim()) {
      alert('Nama / Label Alat Bukti wajib diisi!');
      return;
    }

    const exists = evidences.some((e) => e.id === editingEvidence.id);
    let updated: EvidenceItem[];
    if (exists) {
      updated = evidences.map((e) =>
        e.id === editingEvidence.id ? { ...editingEvidence, updatedAt: new Date().toISOString() } : e
      );
    } else {
      updated = [...evidences, { ...editingEvidence, updatedAt: new Date().toISOString() }];
    }
    onChange(updated);
    setIsModalOpen(false);
    setEditingEvidence(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Hapus alat bukti ini?')) {
      onChange(evidences.filter((e) => e.id !== id));
    }
  };

  const filtered = evidences.filter((e) => filterType === 'all' || e.type === filterType);

  return (
    <div className="space-y-6">
      {/* Compliance Notice */}
      <div className="bg-slate-100 border border-slate-200 rounded-lg p-3 text-xs text-slate-700 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-900 mr-1.5">Penafian Rantai Pengawasan (Chain of Custody):</span>
          Pencatatan status penyimpanan dan hash ringkasan di bawah ini bersifat manual untuk simulasi administratif perkara. Aplikasi peramban pratinjau ini tidak mengklaim kepatuhan forensik kriptografis otomatis atau standar ISO 27037 tanpa pengujian laboratorium forensik bersertifikat.
        </div>
      </div>

      {/* Action and Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Filter Golongan:</span>
          <select
            aria-label="Filter Golongan Alat Bukti"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs bg-white border border-slate-300 rounded-md px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="all">Semua Jenis ({evidences.length})</option>
            {evidenceTypes.map((t) => (
              <option key={t} value={t}>
                {t} ({evidences.filter((e) => e.type === t).length})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleOpenNew}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold text-xs rounded-lg transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Tambah Alat Bukti</span>
        </button>
      </div>

      {/* Evidences list */}
      {filtered.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-8 text-center text-slate-500">
          <FileCheck className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">Belum ada alat bukti terdaftar</p>
          <p className="text-xs mt-1">Daftarkan surat, barang bukti fisik, atau dokumen elektronik yang disita penyidik.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-slate-300 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      {item.type}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">{item.label}</h3>
                  </div>

                  <div className="flex items-center gap-1 text-slate-400">
                    <button
                      onClick={() => {
                        setEditingEvidence(item);
                        setIsModalOpen(true);
                      }}
                      className="p-1 hover:text-amber-600 rounded transition cursor-pointer"
                      title="Edit Alat Bukti"
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

                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2.5">
                  <span>Perolehan: {item.acquisitionDate || '-'}</span>
                  <span aria-hidden="true">·</span>
                  <span className={item.reviewStatus === 'Ditinjau' ? 'text-emerald-700 font-medium' : 'text-amber-700'}>
                    {item.reviewStatus}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed mb-3">
                  {item.description}
                </p>

                {/* Technical / Custody details */}
                <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[11px]">
                  <div>
                    <span className="font-semibold text-slate-600">Asal / Disita Dari:</span>{' '}
                    <span className="text-slate-800">{item.origin || 'Belum dicatat'}</span>
                  </div>

                  {item.storageLocation && (
                    <div>
                      <span className="font-semibold text-slate-600">Lokasi Simpan:</span>{' '}
                      <span className="text-slate-800">{item.storageLocation}</span>
                    </div>
                  )}

                  {item.chainOfCustodyNotes && (
                    <div>
                      <span className="font-semibold text-slate-600">Rantai Pengawasan:</span>{' '}
                      <span className="text-slate-700 italic">{item.chainOfCustodyNotes}</span>
                    </div>
                  )}

                  {item.manualHash ? (
                    <div className="font-mono text-[10px] text-slate-600 break-all pt-1 border-t border-slate-200">
                      <span className="font-semibold text-slate-700">Hash Manual:</span> {item.manualHash}
                    </div>
                  ) : (
                    <div className="text-[10px] text-amber-700 italic">
                      Hash manual belum diinput.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add / Edit Evidence */}
      {isModalOpen && editingEvidence && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">
                {evidences.some((e) => e.id === editingEvidence.id) ? 'Edit Alat Bukti' : 'Tambah Alat Bukti Baru'}
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama / Label Alat Bukti *</label>
                <input
                  type="text"
                  value={editingEvidence.label}
                  onChange={(e) => setEditingEvidence({ ...editingEvidence, label: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 font-medium"
                  placeholder="Contoh: Flashdisk Rekaman CCTV / Bilyet Giro Asli..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Alat Bukti (Pasal 184 KUHP)</label>
                  <select
                    value={editingEvidence.type}
                    onChange={(e) => setEditingEvidence({ ...editingEvidence, type: e.target.value as EvidenceType })}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 cursor-pointer"
                  >
                    {evidenceTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status Verifikasi</label>
                  <select
                    value={editingEvidence.reviewStatus}
                    onChange={(e) => setEditingEvidence({ ...editingEvidence, reviewStatus: e.target.value as ReviewStatus })}
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

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Fisik / Materiil Bukti *</label>
                <textarea
                  rows={3}
                  value={editingEvidence.description}
                  onChange={(e) => setEditingEvidence({ ...editingEvidence, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900"
                  placeholder="Kondisi fisik, nomor seri, jumlah lembar, isi pokok dokumen..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Asal Perolehan / Disita Dari</label>
                  <input
                    type="text"
                    value={editingEvidence.origin}
                    onChange={(e) => setEditingEvidence({ ...editingEvidence, origin: e.target.value })}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg text-slate-900"
                    placeholder="Diserahkan Pelapor / Disita dari Rumah Terlapor"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Perolehan</label>
                  <input
                    type="date"
                    value={editingEvidence.acquisitionDate}
                    onChange={(e) => setEditingEvidence({ ...editingEvidence, acquisitionDate: e.target.value })}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Lokasi Penyimpanan Barang Bukti</label>
                <input
                  type="text"
                  value={editingEvidence.storageLocation}
                  onChange={(e) => setEditingEvidence({ ...editingEvidence, storageLocation: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg text-slate-900"
                  placeholder="Contoh: Brankas Barang Bukti Satreskrim Kotak No. 12"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan Rantai Pengawasan (Chain of Custody Manual)
                </label>
                <input
                  type="text"
                  value={editingEvidence.chainOfCustodyNotes}
                  onChange={(e) => setEditingEvidence({ ...editingEvidence, chainOfCustodyNotes: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg text-slate-900"
                  placeholder="Penerima pertama, berita acara tanda terima, petugas arsip..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nilai Hash Manual / Checksum (Pratinjau)</label>
                  <input
                    type="text"
                    value={editingEvidence.manualHash}
                    onChange={(e) => setEditingEvidence({ ...editingEvidence, manualHash: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded-lg text-slate-900"
                    placeholder="SHA256: 4e7f8b..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Rujukan File / Folder Pratinjau</label>
                  <input
                    type="text"
                    value={editingEvidence.mockFileRef || ''}
                    onChange={(e) => setEditingEvidence({ ...editingEvidence, mockFileRef: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded-lg text-slate-900"
                    placeholder="BERKAS-BB-01/DOK.pdf"
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
                disabled={!editingEvidence.label.trim()}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-slate-950 font-semibold text-xs rounded-lg transition cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Alat Bukti</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
