import React, { useState } from 'react';
import { CaseEvent, TimeCertainty, ReviewStatus, Party, EvidenceItem } from '../../types/case';
import { Plus, Trash2, Edit2, Clock, MapPin, Calendar, AlertTriangle, ShieldCheck, X, Save, Users, Layers } from 'lucide-react';

interface Props {
  events: CaseEvent[];
  parties: Party[];
  evidences: EvidenceItem[];
  matterId: string;
  onChange: (events: CaseEvent[]) => void;
}

export const TabChronology: React.FC<Props> = ({
  events,
  parties,
  evidences,
  matterId,
  onChange
}) => {
  const [editingEvent, setEditingEvent] = useState<CaseEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const certaintyOptions: TimeCertainty[] = ['Pasti', 'Perkiraan / Sekitar', 'Diperselisihkan'];
  const reviewStatuses: ReviewStatus[] = ['Belum Ditinjau', 'Ditinjau', 'Perlu Klarifikasi', 'Diperselisihkan'];

  // Sort events chronologically by startTime
  const sortedEvents = [...events].sort((a, b) => a.startTime.localeCompare(b.startTime));

  const handleOpenNew = () => {
    setEditingEvent({
      id: 'event-' + Math.random().toString(36).substring(2, 8),
      matterId,
      title: '',
      startTime: new Date().toISOString().split('T')[0] + ' 10:00',
      endTime: '',
      timeCertainty: 'Pasti',
      place: '',
      description: '',
      relatedPartyIds: [],
      supportingEvidenceIds: [],
      opposingEvidenceIds: [],
      sourceRef: '',
      reviewStatus: 'Belum Ditinjau',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!editingEvent || !editingEvent.title.trim() || !editingEvent.startTime.trim()) {
      alert('Judul dan Waktu Peristiwa wajib diisi!');
      return;
    }

    const exists = events.some((e) => e.id === editingEvent.id);
    let updated: CaseEvent[];
    if (exists) {
      updated = events.map((e) =>
        e.id === editingEvent.id ? { ...editingEvent, updatedAt: new Date().toISOString() } : e
      );
    } else {
      updated = [...events, { ...editingEvent, updatedAt: new Date().toISOString() }];
    }
    onChange(updated);
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Hapus peristiwa kronologi ini?')) {
      onChange(events.filter((e) => e.id !== id));
    }
  };

  const toggleArrayItem = (list: string[], item: string) => {
    return list.includes(item) ? list.filter((i) => i !== item) : [...list, item];
  };

  return (
    <div className="space-y-6">
      {/* Top action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Kronologi & Alur Peristiwa (Tempus & Locus)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Susun urutan waktu peristiwa secara stabil dengan penanda tingkat kepastian waktu faktual.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold text-xs rounded-lg transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Tambah Peristiwa</span>
        </button>
      </div>

      {/* Chronological Timeline Stream */}
      {sortedEvents.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-8 text-center text-slate-500">
          <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">Belum ada peristiwa kronologi</p>
          <p className="text-xs mt-1">Tambahkan tanggal dan deskripsi kejadian untuk membangun rekonstruksi waktu perkara.</p>
        </div>
      ) : (
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {sortedEvents.map((evt, idx) => {
            const relatedPartiesList = parties.filter((p) => evt.relatedPartyIds.includes(p.id));
            const suppEvidences = evidences.filter((e) => evt.supportingEvidenceIds.includes(e.id));
            const oppEvidences = evidences.filter((e) => evt.opposingEvidenceIds.includes(e.id));

            return (
              <div key={evt.id} className="relative">
                {/* Timeline node bullet */}
                <div
                  className={`absolute -left-[27px] top-3.5 w-3 h-3 rounded-full border-2 bg-white ${
                    evt.timeCertainty === 'Pasti'
                      ? 'border-emerald-600 bg-emerald-500'
                      : evt.timeCertainty === 'Diperselisihkan'
                      ? 'border-rose-600 bg-rose-500 ring-2 ring-rose-200'
                      : 'border-amber-600 bg-amber-500'
                  }`}
                />

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-slate-300 transition">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs mb-1">
                        <span className="font-mono font-bold text-slate-800">{evt.startTime}</span>
                        {evt.endTime && (
                          <span className="font-mono text-slate-500">s/d {evt.endTime}</span>
                        )}
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span
                          className={`font-semibold ${
                            evt.timeCertainty === 'Pasti'
                              ? 'text-emerald-700'
                              : evt.timeCertainty === 'Diperselisihkan'
                              ? 'text-rose-700 font-bold'
                              : 'text-amber-700'
                          }`}
                        >
                          Tingkat Kepastian: {evt.timeCertainty}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900">{evt.title}</h3>
                    </div>

                    <div className="flex items-center gap-1 text-slate-400 self-end sm:self-auto">
                      <button
                        onClick={() => {
                          setEditingEvent(evt);
                          setIsModalOpen(true);
                        }}
                        className="p-1 hover:text-amber-600 rounded transition cursor-pointer"
                        title="Edit Peristiwa"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(evt.id)}
                        className="p-1 hover:text-rose-600 rounded transition cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {evt.place && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{evt.place}</span>
                    </div>
                  )}

                  <p className="text-xs text-slate-700 leading-relaxed mb-3">
                    {evt.description}
                  </p>

                  {/* Linked Parties & Evidences */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                    {relatedPartiesList.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 text-slate-600">
                        <span className="font-semibold text-slate-500 text-[11px]">Pihak Terkait:</span>
                        {relatedPartiesList.map((p) => (
                          <span
                            key={p.id}
                            className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px]"
                          >
                            {p.name} ({p.role})
                          </span>
                        ))}
                      </div>
                    )}

                    {suppEvidences.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 text-slate-600">
                        <span className="font-semibold text-emerald-700 text-[11px]">Bukti Pendukung:</span>
                        {suppEvidences.map((e) => (
                          <span
                            key={e.id}
                            className="bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-0.5 rounded text-[11px]"
                          >
                            {e.label}
                          </span>
                        ))}
                      </div>
                    )}

                    {oppEvidences.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 text-slate-600">
                        <span className="font-semibold text-rose-700 text-[11px]">Bukti Penyangkal:</span>
                        {oppEvidences.map((e) => (
                          <span
                            key={e.id}
                            className="bg-rose-50 text-rose-800 border border-rose-100 px-2 py-0.5 rounded text-[11px]"
                          >
                            {e.label}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="text-[11px] text-slate-400 mt-1">
                      <span className="font-semibold text-slate-500">Sumber:</span> {evt.sourceRef || 'Belum dicatat'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Add / Edit Event */}
      {isModalOpen && editingEvent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">
                {events.some((e) => e.id === editingEvent.id) ? 'Edit Peristiwa Kronologi' : 'Tambah Peristiwa Baru'}
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Kejadian / Peristiwa *</label>
                <input
                  type="text"
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 font-medium"
                  placeholder="Contoh: Pertemuan Penyerahan Uang Muka di Kafe..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Waktu Mulai *</label>
                  <input
                    type="text"
                    value={editingEvent.startTime}
                    onChange={(e) => setEditingEvent({ ...editingEvent, startTime: e.target.value })}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg text-slate-900 font-mono"
                    placeholder="YYYY-MM-DD HH:mm atau Maret 2026"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Waktu Selesai (Opsional)</label>
                  <input
                    type="text"
                    value={editingEvent.endTime || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, endTime: e.target.value })}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg text-slate-900 font-mono"
                    placeholder="YYYY-MM-DD HH:mm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tingkat Kepastian Waktu *</label>
                  <select
                    value={editingEvent.timeCertainty}
                    onChange={(e) => setEditingEvent({ ...editingEvent, timeCertainty: e.target.value as TimeCertainty })}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 cursor-pointer font-medium"
                  >
                    {certaintyOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tempat / Lokasi</label>
                  <input
                    type="text"
                    value={editingEvent.place}
                    onChange={(e) => setEditingEvent({ ...editingEvent, place: e.target.value })}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg text-slate-900"
                    placeholder="Hotel Ritz Carlton Kuningan"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Rekonstruksi Peristiwa *</label>
                <textarea
                  rows={3}
                  value={editingEvent.description}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900"
                  placeholder="Uraikan detail apa yang terjadi, siapa yang berbicara, dan interaksi yang tercatat..."
                />
              </div>

              {/* Related Parties Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pihak Terkait yang Hadir</label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 border border-slate-200 rounded-lg bg-slate-50">
                  {parties.map((p) => {
                    const isSelected = editingEvent.relatedPartyIds.includes(p.id);
                    return (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() =>
                          setEditingEvent({
                            ...editingEvent,
                            relatedPartyIds: toggleArrayItem(editingEvent.relatedPartyIds, p.id)
                          })
                        }
                        className={`text-xs px-2.5 py-1 rounded transition cursor-pointer ${
                          isSelected
                            ? 'bg-slate-900 text-white font-medium'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {p.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Supporting Evidence Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bukti Pendukung Kejadian</label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 border border-slate-200 rounded-lg bg-slate-50">
                  {evidences.map((e) => {
                    const isSelected = editingEvent.supportingEvidenceIds.includes(e.id);
                    return (
                      <button
                        type="button"
                        key={e.id}
                        onClick={() =>
                          setEditingEvent({
                            ...editingEvent,
                            supportingEvidenceIds: toggleArrayItem(editingEvent.supportingEvidenceIds, e.id)
                          })
                        }
                        className={`text-xs px-2.5 py-1 rounded transition cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-700 text-white font-medium'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {e.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Opposing Evidence Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bukti Penyangkal / Kontradiksi (Jika Ada)</label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 border border-slate-200 rounded-lg bg-slate-50">
                  {evidences.map((e) => {
                    const isSelected = editingEvent.opposingEvidenceIds.includes(e.id);
                    return (
                      <button
                        type="button"
                        key={e.id}
                        onClick={() =>
                          setEditingEvent({
                            ...editingEvent,
                            opposingEvidenceIds: toggleArrayItem(editingEvent.opposingEvidenceIds, e.id)
                          })
                        }
                        className={`text-xs px-2.5 py-1 rounded transition cursor-pointer ${
                          isSelected
                            ? 'bg-rose-700 text-white font-medium'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {e.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Dasar Sumber Berkas</label>
                <input
                  type="text"
                  value={editingEvent.sourceRef}
                  onChange={(e) => setEditingEvent({ ...editingEvent, sourceRef: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg text-slate-900 font-mono"
                  placeholder="Contoh: BAP Saksi Pelapor Hal 3 & Rekaman CCTV"
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
                disabled={!editingEvent.title.trim() || !editingEvent.startTime.trim()}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-slate-950 font-semibold text-xs rounded-lg transition cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Peristiwa</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
