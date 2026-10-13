import React, { useState } from 'react';
import { Statement, Party, ReviewStatus } from '../../types/case';
import { Plus, Trash2, Edit2, MessageSquare, Quote, X, Save, Calendar } from 'lucide-react';

interface Props {
  statements: Statement[];
  parties: Party[];
  matterId: string;
  onChange: (statements: Statement[]) => void;
}

export const TabStatements: React.FC<Props> = ({ statements, parties, matterId, onChange }) => {
  const [editingStatement, setEditingStatement] = useState<Statement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const reviewStatuses: ReviewStatus[] = ['Belum Ditinjau', 'Ditinjau', 'Perlu Klarifikasi', 'Diperselisihkan'];

  const handleOpenNew = () => {
    const defaultParty = parties[0];
    setEditingStatement({
      id: 'stmt-' + Math.random().toString(36).substring(2, 8),
      matterId,
      partyId: defaultParty ? defaultParty.id : '',
      partyName: defaultParty ? defaultParty.name : 'Saksi / Terperiksa',
      statementDate: new Date().toISOString().split('T')[0],
      quote: '',
      context: 'Pemeriksaan saksi dalam Berita Acara Pemeriksaan (BAP)',
      documentSource: '',
      pageNo: '',
      reviewStatus: 'Belum Ditinjau',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!editingStatement || !editingStatement.quote.trim() || !editingStatement.documentSource.trim()) {
      alert('Kutipan pernyataan dan Sumber Dokumen BAP wajib diisi!');
      return;
    }

    const party = parties.find((p) => p.id === editingStatement.partyId);
    const enriched = {
      ...editingStatement,
      partyName: party ? `${party.name} (${party.role})` : editingStatement.partyName,
      updatedAt: new Date().toISOString()
    };

    const exists = statements.some((s) => s.id === enriched.id);
    let updated: Statement[];
    if (exists) {
      updated = statements.map((s) => (s.id === enriched.id ? enriched : s));
    } else {
      updated = [...statements, enriched];
    }
    onChange(updated);
    setIsModalOpen(false);
    setEditingStatement(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Hapus butir keterangan ini?')) {
      onChange(statements.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Keterangan Para Pihak (BAP & Risalah Wawancara)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Dokumentasikan kutipan verbatim saksi, korban, terlapor, dan saksi ahli dengan konteks pemeriksaan.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold text-xs rounded-lg transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Tambah Keterangan</span>
        </button>
      </div>

      {statements.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-8 text-center text-slate-500">
          <MessageSquare className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">Belum ada kutipan keterangan</p>
          <p className="text-xs mt-1">Tambahkan transkrip atau butir jawaban BAP untuk membandingkan konsistensi keterangan.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {statements.map((stmt) => (
            <div
              key={stmt.id}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-slate-300 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs mb-1">
                    <span className="font-bold text-slate-900">{stmt.partyName}</span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-slate-500">Tanggal: {stmt.statementDate}</span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span
                      className={`font-semibold ${
                        stmt.reviewStatus === 'Ditinjau'
                          ? 'text-emerald-700'
                          : stmt.reviewStatus === 'Diperselisihkan'
                          ? 'text-rose-700'
                          : 'text-amber-700'
                      }`}
                    >
                      {stmt.reviewStatus}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 italic">{stmt.context}</div>
                </div>

                <div className="flex items-center gap-1 text-slate-400 self-end sm:self-auto">
                  <button
                    onClick={() => {
                      setEditingStatement(stmt);
                      setIsModalOpen(true);
                    }}
                    className="p-1 hover:text-amber-600 rounded transition cursor-pointer"
                    title="Edit Keterangan"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(stmt.id)}
                    className="p-1 hover:text-rose-600 rounded transition cursor-pointer"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <blockquote className="text-xs text-slate-800 bg-slate-50 border-l-2 border-amber-500 pl-3.5 py-2 my-2 rounded-r leading-relaxed">
                &ldquo;{stmt.quote}&rdquo;
              </blockquote>

              <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-600">Dokumen BAP:</span>
                  <span className="font-mono text-slate-800">{stmt.documentSource}</span>
                  {stmt.pageNo && <span>({stmt.pageNo})</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add / Edit Statement */}
      {isModalOpen && editingStatement && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">
                {statements.some((s) => s.id === editingStatement.id) ? 'Edit Keterangan' : 'Tambah Keterangan Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pemberi Keterangan *</label>
                  <select
                    value={editingStatement.partyId}
                    onChange={(e) => {
                      const p = parties.find((party) => party.id === e.target.value);
                      setEditingStatement({
                        ...editingStatement,
                        partyId: e.target.value,
                        partyName: p ? `${p.name} (${p.role})` : 'Pihak Terpilih'
                      });
                    }}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg text-slate-900 cursor-pointer"
                  >
                    {parties.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Keterangan *</label>
                  <input
                    type="date"
                    value={editingStatement.statementDate}
                    onChange={(e) => setEditingStatement({ ...editingStatement, statementDate: e.target.value })}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kutipan Verbatim Pernyataan *</label>
                <textarea
                  rows={4}
                  value={editingStatement.quote}
                  onChange={(e) => setEditingStatement({ ...editingStatement, quote: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900"
                  placeholder="Kutipan jawaban BAP kata demi kata..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Konteks / Keadaan Pemeriksaan</label>
                <input
                  type="text"
                  value={editingStatement.context}
                  onChange={(e) => setEditingStatement({ ...editingStatement, context: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg text-slate-900"
                  placeholder="Misal: Pemeriksaan BAP lanjutan didampingi advokat di ruang riksa..."
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor Register BAP *</label>
                  <input
                    type="text"
                    value={editingStatement.documentSource}
                    onChange={(e) => setEditingStatement({ ...editingStatement, documentSource: e.target.value })}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg text-slate-900 font-mono"
                    placeholder="BAP/11/IV/2026/Ditreskrimum"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Halaman / No. Jawaban</label>
                  <input
                    type="text"
                    value={editingStatement.pageNo || ''}
                    onChange={(e) => setEditingStatement({ ...editingStatement, pageNo: e.target.value })}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg text-slate-900"
                    placeholder="Hal 4 Jawaban 14"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status Verifikasi</label>
                <select
                  value={editingStatement.reviewStatus}
                  onChange={(e) =>
                    setEditingStatement({ ...editingStatement, reviewStatus: e.target.value as ReviewStatus })
                  }
                  className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg text-slate-900 cursor-pointer"
                >
                  {reviewStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
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
                disabled={!editingStatement.quote.trim() || !editingStatement.documentSource.trim()}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-slate-950 font-semibold text-xs rounded-lg transition cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Keterangan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
