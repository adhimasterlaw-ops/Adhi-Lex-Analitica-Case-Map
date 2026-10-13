import React, { useState } from 'react';
import { Party, PartyType, PartyRole, ReviewStatus } from '../../types/case';
import { Plus, Trash2, Edit2, CheckCircle2, AlertCircle, Users, HelpCircle, X, Save } from 'lucide-react';

interface Props {
  parties: Party[];
  matterId: string;
  onChange: (parties: Party[]) => void;
}

export const TabParties: React.FC<Props> = ({ parties, matterId, onChange }) => {
  const [editingParty, setEditingParty] = useState<Party | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const partyTypes: PartyType[] = ['Individu', 'Korporasi', 'Instansi'];
  const partyRoles: PartyRole[] = [
    'Terlapor / Tersangka',
    'Terdakwa',
    'Korban',
    'Pelapor',
    'Saksi Mahkota',
    'Saksi Fakta',
    'Saksi Ahli',
    'Penasihat Hukum',
    'Pihak Terkait'
  ];
  const reviewStatuses: ReviewStatus[] = ['Belum Ditinjau', 'Ditinjau', 'Perlu Klarifikasi'];

  const handleOpenNew = () => {
    setEditingParty({
      id: 'party-' + Math.random().toString(36).substring(2, 8),
      matterId,
      name: '',
      alias: '',
      type: 'Individu',
      role: 'Saksi Fakta',
      notes: '',
      idSource: '',
      reviewStatus: 'Belum Ditinjau',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!editingParty || !editingParty.name.trim()) return;

    const exists = parties.some((p) => p.id === editingParty.id);
    let updated: Party[];
    if (exists) {
      updated = parties.map((p) =>
        p.id === editingParty.id ? { ...editingParty, updatedAt: new Date().toISOString() } : p
      );
    } else {
      updated = [...parties, { ...editingParty, updatedAt: new Date().toISOString() }];
    }
    onChange(updated);
    setIsModalOpen(false);
    setEditingParty(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Hapus pihak ini dari perkara?')) {
      onChange(parties.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Daftar Pihak Terkait Perkara</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Petakan subjek hukum, peran formal dalam acara pidana, dan sumber identitas resmi.
          </p>
        </div>
        <button
          onClick={handleOpenNew}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold text-xs rounded-lg transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Tambah Pihak</span>
        </button>
      </div>

      {/* Parties List Cards */}
      {parties.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-8 text-center text-slate-500">
          <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">Belum ada pihak yang didaftarkan</p>
          <p className="text-xs mt-1">Klik tombol &quot;Tambah Pihak&quot; untuk memasukkan pelapor, terlapor, korban, atau saksi.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {parties.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-slate-300 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{p.name}</h3>
                    {p.alias && p.alias !== '-' && (
                      <p className="text-xs text-slate-500 italic">Alias: {p.alias}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <button
                      onClick={() => {
                        setEditingParty(p);
                        setIsModalOpen(true);
                      }}
                      className="p-1 hover:text-amber-600 rounded transition cursor-pointer"
                      title="Edit Pihak"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-1 hover:text-rose-600 rounded transition cursor-pointer"
                      title="Hapus Pihak"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Typography metadata */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mb-3">
                  <span className="font-medium text-slate-800">{p.role}</span>
                  <span aria-hidden="true">·</span>
                  <span>{p.type}</span>
                  <span aria-hidden="true">·</span>
                  <span className={p.reviewStatus === 'Ditinjau' ? 'text-emerald-700 font-medium' : 'text-amber-700'}>
                    {p.reviewStatus}
                  </span>
                </div>

                <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-2 leading-relaxed">
                  {p.notes || <span className="text-slate-400 italic">Tidak ada catatan peran.</span>}
                </div>

                <div className="text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-600">Sumber ID:</span> {p.idSource || <span className="text-amber-600 italic">Belum tersedia (perlu dilengkapi)</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add / Edit Party */}
      {isModalOpen && editingParty && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">
                {parties.some((p) => p.id === editingParty.id) ? 'Edit Data Pihak' : 'Tambah Pihak Baru'}
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap / Korporasi *</label>
                <input
                  type="text"
                  value={editingParty.name}
                  onChange={(e) => setEditingParty({ ...editingParty, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 font-medium"
                  placeholder="Contoh: Bambang Soedirgo"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Panggilan / Alias</label>
                  <input
                    type="text"
                    value={editingParty.alias || ''}
                    onChange={(e) => setEditingParty({ ...editingParty, alias: e.target.value })}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900"
                    placeholder="Contoh: Benny"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tipe Entitas</label>
                  <select
                    value={editingParty.type}
                    onChange={(e) => setEditingParty({ ...editingParty, type: e.target.value as PartyType })}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 cursor-pointer"
                  >
                    {partyTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Peran Formal *</label>
                  <select
                    value={editingParty.role}
                    onChange={(e) => setEditingParty({ ...editingParty, role: e.target.value as PartyRole })}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 cursor-pointer"
                  >
                    {partyRoles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status Verifikasi</label>
                  <select
                    value={editingParty.reviewStatus}
                    onChange={(e) => setEditingParty({ ...editingParty, reviewStatus: e.target.value as ReviewStatus })}
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sumber Identifikasi Resmi *
                </label>
                <input
                  type="text"
                  value={editingParty.idSource}
                  onChange={(e) => setEditingParty({ ...editingParty, idSource: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900"
                  placeholder="Contoh: KTP No. 3174... / Paspor / Akta Notaris No. 12"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">Wajib mencantumkan dasar verifikasi identitas fisik.</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan / Posisi dalam Kasus</label>
                <textarea
                  rows={3}
                  value={editingParty.notes}
                  onChange={(e) => setEditingParty({ ...editingParty, notes: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900"
                  placeholder="Catatan peran fungsional atau relasi dengan perkara..."
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
                disabled={!editingParty.name.trim()}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-slate-950 font-semibold text-xs rounded-lg transition cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Pihak</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
