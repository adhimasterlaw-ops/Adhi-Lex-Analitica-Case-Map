import React, { useState } from 'react';
import { ProcedureCheck, ProcedureCategory, ProcedureStatus, MeetingNote } from '../../types/case';
import {
  CheckSquare,
  MessageSquare,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  AlertTriangle,
  FileCheck,
  ShieldAlert,
  UserCheck,
  Filter,
  Info
} from 'lucide-react';

interface Props {
  procedureChecks: ProcedureCheck[];
  meetingNotes: MeetingNote[];
  matterId: string;
  onUpdateProcedures: (checks: ProcedureCheck[]) => void;
  onUpdateNotes: (notes: MeetingNote[]) => void;
}

export const ProcedureAndMeetingNotes: React.FC<Props> = ({
  procedureChecks,
  meetingNotes,
  matterId,
  onUpdateProcedures,
  onUpdateNotes
}) => {
  const [activeTab, setActiveTab] = useState<'procedure' | 'notes'>('procedure');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Edit Procedure Checklist Item Modal State
  const [editingCheck, setEditingCheck] = useState<ProcedureCheck | null>(null);
  const [isCheckModalOpen, setIsCheckModalOpen] = useState(false);

  // New Note Modal state
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [newAttendee, setNewAttendee] = useState('');
  const [newRole, setNewRole] = useState('Penyidik Pembantu');
  const [newRecommendation, setNewRecommendation] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);

  const categoryLabels: Record<ProcedureCategory, string> = {
    hak_pihak: '1. Hak Pihak (Tersangka/Korban)',
    pemeriksaan: '2. Pemeriksaan & Berita Acara',
    penasihat_hukum: '3. Penasihat Hukum',
    pemanggilan: '4. Pemanggilan Sah',
    penahanan: '5. Penahanan',
    penyitaan: '6. Penyitaan',
    penuntutan: '7. Penuntutan & Pra-Penuntutan',
    persidangan: '8. Persidangan & Dakwaan',
    pembuktian: '9. Pembuktian & Alat Bukti',
    putusan: '10. Putusan',
    upaya_hukum: '11. Upaya Hukum'
  };

  const allowedStatuses: { value: ProcedureStatus; label: string; badgeClass: string }[] = [
    { value: 'belum dinilai', label: 'Belum Dinilai', badgeClass: 'bg-slate-100 text-slate-700 border-slate-300' },
    { value: 'didukung dokumen', label: 'Didukung Dokumen', badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
    { value: 'tidak didukung', label: 'Tidak Didukung', badgeClass: 'bg-rose-50 text-rose-800 border-rose-300' },
    { value: 'diperselisihkan', label: 'Diperselisihkan', badgeClass: 'bg-amber-50 text-amber-800 border-amber-300' },
    { value: 'tidak relevan', label: 'Tidak Relevan', badgeClass: 'bg-slate-100 text-slate-500 border-slate-200' },
    { value: 'perlu klarifikasi', label: 'Perlu Klarifikasi', badgeClass: 'bg-blue-50 text-blue-800 border-blue-300' }
  ];

  const handleEditCheck = (check: ProcedureCheck) => {
    setEditingCheck({ ...check });
    setIsCheckModalOpen(true);
  };

  const handleSaveCheck = () => {
    if (!editingCheck) return;
    if (
      !editingCheck.sumber.trim() ||
      !editingCheck.kutipan.trim() ||
      !editingCheck.alasan.trim() ||
      !editingCheck.reviewer.trim()
    ) {
      alert('Sumber, Kutipan, Alasan, dan Reviewer WAJIB diisi untuk setiap status checklist!');
      return;
    }

    const updated = procedureChecks.map((item) =>
      item.id === editingCheck.id
        ? { ...editingCheck, updatedAt: new Date().toISOString() }
        : item
    );
    onUpdateProcedures(updated);
    setIsCheckModalOpen(false);
    setEditingCheck(null);
  };

  const handleAddNote = () => {
    if (!newAttendee.trim() || !newRecommendation.trim()) {
      alert('Nama peserta dan rekomendasi gelar wajib diisi!');
      return;
    }

    const noteItem: MeetingNote = {
      id: 'note-' + Math.random().toString(36).substring(2, 8),
      matterId,
      attendeeName: newAttendee,
      role: newRole,
      recommendation: newRecommendation,
      noteDate: newDate
    };

    onUpdateNotes([noteItem, ...meetingNotes]);
    setIsNoteModalOpen(false);
    setNewAttendee('');
    setNewRecommendation('');
  };

  const handleDeleteNote = (id: string) => {
    if (confirm('Hapus catatan peserta gelar ini?')) {
      onUpdateNotes(meetingNotes.filter((n) => n.id !== id));
    }
  };

  const filteredChecks = procedureChecks.filter(
    (c) => categoryFilter === 'all' || c.category === categoryFilter
  );

  return (
    <div className="space-y-6">
      {/* Principle Banner */}
      <div className="bg-amber-950/10 border border-amber-800/30 rounded-lg p-3 text-xs text-amber-950 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-900 mr-1.5 uppercase">
            Checklist Prosedural Netral (11 Ranah Hukum Acara):
          </span>
          Checklist ini menilai kepatuhan formal acara pidana secara deskriptif tanpa membuat kesimpulan bersalah, tanpa prediksi putusan, dan tanpa menyatakan unsur telah terpenuhi. <strong>Setiap perubahan status wajib menyertakan rujukan Sumber, Kutipan, Alasan yuridis, dan nama Reviewer.</strong>
        </div>
      </div>

      {/* Segmented Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('procedure')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
              activeTab === 'procedure'
                ? 'bg-slate-900 text-amber-300 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Checklist Prosedural Netral ({procedureChecks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
              activeTab === 'notes'
                ? 'bg-slate-900 text-amber-300 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Lembar Catatan Peserta Gelar Perkara ({meetingNotes.length})</span>
          </button>
        </div>

        {activeTab === 'procedure' && (
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Kategori:</span>
            <select
              aria-label="Filter Kategori Checklist"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-white border border-slate-300 rounded px-2 py-1 text-xs font-medium text-slate-700 cursor-pointer focus:outline-none"
            >
              <option value="all">Semua Kategori (11)</option>
              {Object.entries(categoryLabels).map(([catKey, label]) => (
                <option key={catKey} value={catKey}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Tab 1: Checklist Prosedural Netral */}
      {activeTab === 'procedure' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs divide-y divide-slate-200">
            {filteredChecks.map((check) => {
              const currentStatusConfig =
                allowedStatuses.find((s) => s.value === check.status) || allowedStatuses[0];

              return (
                <div key={check.id} className="p-4 space-y-3 hover:bg-slate-50/50 transition">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {check.code}
                        </span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="font-semibold text-slate-600">
                          {categoryLabels[check.category]}
                        </span>
                        {check.isMandatory && (
                          <>
                            <span aria-hidden="true" className="text-slate-300">·</span>
                            <span className="text-[10px] uppercase font-bold text-rose-700">Wajib Formal</span>
                          </>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-slate-900">{check.label}</h4>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded border capitalize ${currentStatusConfig.badgeClass}`}
                      >
                        {check.status}
                      </span>

                      <button
                        onClick={() => handleEditCheck(check)}
                        className="px-3 py-1 bg-slate-100 hover:bg-amber-100 hover:text-amber-900 border border-slate-200 text-slate-700 text-xs font-semibold rounded transition cursor-pointer flex items-center gap-1.5"
                        title="Edit Penilaian Prosedur (Wajib Sumber, Kutipan, Alasan, Reviewer)"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Nilai Status</span>
                      </button>
                    </div>
                  </div>

                  {/* Required 4 Audit Fields: Sumber, Kutipan, Alasan, Reviewer */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                    <div>
                      <span className="font-semibold text-slate-700 block text-[11px] uppercase tracking-wider">
                        Sumber Rujukan Berkas:
                      </span>
                      <p className="text-slate-800 font-mono text-[11px] mt-0.5 break-words">
                        {check.sumber || <span className="text-rose-600 italic">Belum diisi (wajib)</span>}
                      </p>
                    </div>

                    <div>
                      <span className="font-semibold text-slate-700 block text-[11px] uppercase tracking-wider">
                        Reviewer Penilai:
                      </span>
                      <p className="text-slate-800 font-medium text-xs mt-0.5">
                        {check.reviewer || <span className="text-rose-600 italic">Belum diisi (wajib)</span>}
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <span className="font-semibold text-slate-700 block text-[11px] uppercase tracking-wider">
                        Kutipan Verbatim Pembuktian:
                      </span>
                      <p className="text-slate-700 italic text-[11px] mt-0.5 bg-white p-2 rounded border border-slate-200">
                        {check.kutipan || <span className="text-rose-600">Belum diisi (wajib)</span>}
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <span className="font-semibold text-slate-700 block text-[11px] uppercase tracking-wider">
                        Alasan / Pertimbangan Yuridis:
                      </span>
                      <p className="text-slate-700 text-xs mt-0.5 leading-relaxed">
                        {check.alasan || <span className="text-rose-600 italic">Belum diisi (wajib)</span>}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Catatan Peserta Gelar */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              Dokumentasi risalah pendapat, rekomendasi, dan arahan peserta forum gelar perkara.
            </p>

            <button
              onClick={() => setIsNoteModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold text-xs rounded-lg transition cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Tambah Rekomendasi Gelar</span>
            </button>
          </div>

          {meetingNotes.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
              <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">Belum ada catatan gelar perkara</p>
              <p className="text-xs mt-1">
                Gunakan tombol di atas untuk mencatat masukan dari Kanit, Jaksa, atau Pengawas Penyidikan.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {meetingNotes.map((note) => (
                <div
                  key={note.id}
                  className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-bold text-slate-900">{note.attendeeName}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded text-[11px]">
                        {note.role}
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-slate-400 font-mono text-[11px]">{note.noteDate}</span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-2">
                      {note.recommendation}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 self-end sm:self-auto transition cursor-pointer"
                    title="Hapus Catatan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal Edit Procedure Checklist */}
      {isCheckModalOpen && editingCheck && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">
                  {editingCheck.code} · {categoryLabels[editingCheck.category]}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">{editingCheck.label}</h3>
              </div>
              <button
                onClick={() => setIsCheckModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Status Selector - Strictly the 6 allowed values */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Status Penilaian Prosedur *
                </label>
                <select
                  value={editingCheck.status}
                  onChange={(e) =>
                    setEditingCheck({ ...editingCheck, status: e.target.value as ProcedureStatus })
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg text-slate-900 cursor-pointer font-bold"
                >
                  {allowedStatuses.map((st) => (
                    <option key={st.value} value={st.value}>
                      {st.label}
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Pilihan status terbatas secara baku: belum dinilai, didukung dokumen, tidak didukung, diperselisihkan, tidak relevan, atau perlu klarifikasi.
                </span>
              </div>

              {/* Reviewer Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Reviewer / Penilai (Wajib) *
                </label>
                <input
                  type="text"
                  required
                  value={editingCheck.reviewer}
                  onChange={(e) => setEditingCheck({ ...editingCheck, reviewer: e.target.value })}
                  placeholder="Contoh: AKP Surya Pratama, S.H. / Kompol Hendra W., S.H."
                  className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg text-slate-900 font-medium"
                />
              </div>

              {/* Sumber */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Rujukan Dokumen / Sumber (Wajib) *
                </label>
                <input
                  type="text"
                  required
                  value={editingCheck.sumber}
                  onChange={(e) => setEditingCheck({ ...editingCheck, sumber: e.target.value })}
                  placeholder="Contoh: BAP Terlapor No. Pol: BAP/11/IV/2026 / Penetapan PN No. 412"
                  className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg text-slate-900 font-mono"
                />
              </div>

              {/* Kutipan */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kutipan Verbatim Dokumen Pendukung (Wajib) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingCheck.kutipan}
                  onChange={(e) => setEditingCheck({ ...editingCheck, kutipan: e.target.value })}
                  placeholder="Kutipan langsung dari lembar penetapan, surat panggilan, atau berita acara..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              {/* Alasan */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alasan & Pertimbangan Yuridis (Wajib) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingCheck.alasan}
                  onChange={(e) => setEditingCheck({ ...editingCheck, alasan: e.target.value })}
                  placeholder="Uraikan mengapa status tersebut dipilih dan implikasi proseduralnya..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-200 bg-slate-50">
              <button
                onClick={() => setIsCheckModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 font-medium rounded-lg transition cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSaveCheck}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold text-xs rounded-lg transition cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Penilaian Prosedur</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Meeting Note */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">Catatan Rekomendasi Peserta Gelar</h3>
              <button
                onClick={() => setIsNoteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Peserta Gelar *
                  </label>
                  <input
                    type="text"
                    value={newAttendee}
                    onChange={(e) => setNewAttendee(e.target.value)}
                    placeholder="Kompol Hendra W., S.H."
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jabatan / Peran</label>
                  <input
                    type="text"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="Pimpinan Gelar / Wasidik"
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Gelar</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Arahan / Rekomendasi Yuridis *
                </label>
                <textarea
                  rows={4}
                  value={newRecommendation}
                  onChange={(e) => setNewRecommendation(e.target.value)}
                  placeholder="Uraikan tindak lanjut penyidikan..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-200 bg-slate-50">
              <button
                onClick={() => setIsNoteModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 font-medium rounded-lg transition cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleAddNote}
                disabled={!newAttendee.trim() || !newRecommendation.trim()}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-slate-950 font-semibold text-xs rounded-lg transition cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Catatan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
