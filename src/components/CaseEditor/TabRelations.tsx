import React, { useState } from 'react';
import {
  ExplicitLink,
  EntityType,
  RelationType,
  Party,
  FactClaim,
  CaseEvent,
  EvidenceItem,
  LegalElement
} from '../../types/case';
import { Plus, Trash2, Link2, ArrowRight, ShieldCheck, X, Save, AlertCircle } from 'lucide-react';

interface Props {
  links: ExplicitLink[];
  parties: Party[];
  facts: FactClaim[];
  events: CaseEvent[];
  evidences: EvidenceItem[];
  elements: LegalElement[];
  matterId: string;
  onChange: (links: ExplicitLink[]) => void;
}

export const TabRelations: React.FC<Props> = ({
  links,
  parties,
  facts,
  events,
  evidences,
  elements,
  matterId,
  onChange
}) => {
  const [editingLink, setEditingLink] = useState<ExplicitLink | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const relationTypes: { value: RelationType; label: string; color: string }[] = [
    { value: 'mendukung', label: 'Mendukung (Konfirmatif)', color: 'text-emerald-700' },
    { value: 'membantah', label: 'Membantah (Kontradiktif/Sanggahan)', color: 'text-rose-700' },
    { value: 'perlu_klarifikasi', label: 'Perlu Klarifikasi / Gelar', color: 'text-amber-700' },
    { value: 'belum_tersedia', label: 'Belum Tersedia / Nihil', color: 'text-slate-600' }
  ];

  const getEntityLabel = (type: EntityType, id: string): string => {
    switch (type) {
      case 'party': {
        const p = parties.find((item) => item.id === id);
        return p ? `[Pihak] ${p.name} (${p.role})` : `Pihak (${id})`;
      }
      case 'fact': {
        const f = facts.find((item) => item.id === id);
        return f ? `[Fakta] ${f.subject}: ${f.action}` : `Fakta (${id})`;
      }
      case 'event': {
        const ev = events.find((item) => item.id === id);
        return ev ? `[Kronologi] ${ev.title}` : `Event (${id})`;
      }
      case 'evidence': {
        const e = evidences.find((item) => item.id === id);
        return e ? `[Bukti] ${e.label}` : `Bukti (${id})`;
      }
      case 'element': {
        const el = elements.find((item) => item.id === id);
        return el ? `[Unsur] ${el.elementCode}: ${el.title}` : `Unsur (${id})`;
      }
      default:
        return id;
    }
  };

  const getOptionsForType = (type: EntityType) => {
    switch (type) {
      case 'party':
        return parties.map((p) => ({ id: p.id, label: `${p.name} (${p.role})` }));
      case 'fact':
        return facts.map((f) => ({ id: f.id, label: `${f.subject}: ${f.action}` }));
      case 'event':
        return events.map((ev) => ({ id: ev.id, label: `${ev.title} (${ev.startTime})` }));
      case 'evidence':
        return evidences.map((e) => ({ id: e.id, label: `[${e.type}] ${e.label}` }));
      case 'element':
        return elements.map((el) => ({ id: el.id, label: `${el.elementCode}: ${el.title}` }));
      default:
        return [];
    }
  };

  const handleOpenNew = () => {
    setEditingLink({
      id: 'link-' + Math.random().toString(36).substring(2, 8),
      matterId,
      sourceId: facts[0]?.id || parties[0]?.id || '',
      sourceType: facts[0] ? 'fact' : 'party',
      targetId: elements[0]?.id || events[0]?.id || '',
      targetType: elements[0] ? 'element' : 'event',
      relationType: 'mendukung',
      explanation: '',
      sourceRef: '',
      createdAt: new Date().toISOString()
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!editingLink || !editingLink.sourceId || !editingLink.targetId) {
      alert('Entitas Sumber dan Sasaran wajib dipilih!');
      return;
    }

    const exists = links.some((l) => l.id === editingLink.id);
    let updated: ExplicitLink[];
    if (exists) {
      updated = links.map((l) => (l.id === editingLink.id ? editingLink : l));
    } else {
      updated = [...links, editingLink];
    }
    onChange(updated);
    setIsModalOpen(false);
    setEditingLink(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Hapus relasi eksplisit ini?')) {
      onChange(links.filter((l) => l.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-100 border border-slate-200 rounded-lg p-3 text-xs text-slate-700 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-900 mr-1.5">Aturan Relasi Eksplisit:</span>
          Sistem ini <strong>hanya</strong> memvisualisasikan relasi yang benar-benar Anda buat secara sadar di bawah ini. Tidak ada relasi implisit atau inferensi spekulatif otomatis dari sistem.
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Pemetaan Relasi Eksplisit Antara Entitas</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Hubungkan fakta ke unsur, bukti ke kronologi, atau sanggahan pihak secara transparan.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold text-xs rounded-lg transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Tambah Relasi Eksplisit</span>
        </button>
      </div>

      {links.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-8 text-center text-slate-500">
          <Link2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">Belum ada relasi eksplisit terhubung</p>
          <p className="text-xs mt-1">Buat relasi untuk menghubungkan bukti dengan peristiwa, fakta dengan unsur pasal, dll.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {links.map((lnk) => (
            <div
              key={lnk.id}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-slate-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-semibold text-slate-800 bg-slate-100 px-2.5 py-1 rounded">
                    {getEntityLabel(lnk.sourceType, lnk.sourceId)}
                  </span>

                  <div className="flex items-center gap-1">
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                        lnk.relationType === 'mendukung'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : lnk.relationType === 'membantah'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : lnk.relationType === 'perlu_klarifikasi'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {lnk.relationType.toUpperCase().replace('_', ' ')}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>

                  <span className="font-semibold text-slate-800 bg-slate-100 px-2.5 py-1 rounded">
                    {getEntityLabel(lnk.targetType, lnk.targetId)}
                  </span>
                </div>

                {lnk.explanation && (
                  <p className="text-xs text-slate-600 bg-slate-50/70 p-2 rounded border border-slate-100">
                    {lnk.explanation}
                  </p>
                )}

                {lnk.sourceRef && (
                  <div className="text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-500">Rujukan Bukti:</span> {lnk.sourceRef}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1 text-slate-400 self-end md:self-center">
                <button
                  onClick={() => handleDelete(lnk.id)}
                  className="p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
                  title="Hapus Relasi"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add Link */}
      {isModalOpen && editingLink && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">Tambah Hubungan Relasi Eksplisit</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Source Entity */}
              <div className="space-y-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-xs font-bold text-slate-800 block">1. Entitas Sumber</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Tipe Sumber</label>
                    <select
                      value={editingLink.sourceType}
                      onChange={(e) => {
                        const newType = e.target.value as EntityType;
                        const opts = getOptionsForType(newType);
                        setEditingLink({
                          ...editingLink,
                          sourceType: newType,
                          sourceId: opts[0]?.id || ''
                        });
                      }}
                      className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded"
                    >
                      <option value="party">Pihak</option>
                      <option value="fact">Fakta/Klaim</option>
                      <option value="event">Peristiwa Kronologi</option>
                      <option value="evidence">Alat Bukti</option>
                      <option value="element">Unsur Pasal</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Pilih Item Sumber</label>
                    <select
                      value={editingLink.sourceId}
                      onChange={(e) => setEditingLink({ ...editingLink, sourceId: e.target.value })}
                      className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded truncate"
                    >
                      {getOptionsForType(editingLink.sourceType).map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Relation Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  2. Sifat Hubungan Relasi *
                </label>
                <select
                  value={editingLink.relationType}
                  onChange={(e) =>
                    setEditingLink({ ...editingLink, relationType: e.target.value as RelationType })
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg text-slate-900 cursor-pointer font-medium"
                >
                  {relationTypes.map((rt) => (
                    <option key={rt.value} value={rt.value}>
                      {rt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Entity */}
              <div className="space-y-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-xs font-bold text-slate-800 block">3. Entitas Sasaran (Target)</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Tipe Sasaran</label>
                    <select
                      value={editingLink.targetType}
                      onChange={(e) => {
                        const newType = e.target.value as EntityType;
                        const opts = getOptionsForType(newType);
                        setEditingLink({
                          ...editingLink,
                          targetType: newType,
                          targetId: opts[0]?.id || ''
                        });
                      }}
                      className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded"
                    >
                      <option value="element">Unsur Pasal</option>
                      <option value="event">Peristiwa Kronologi</option>
                      <option value="party">Pihak</option>
                      <option value="evidence">Alat Bukti</option>
                      <option value="fact">Fakta/Klaim</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Pilih Item Sasaran</label>
                    <select
                      value={editingLink.targetId}
                      onChange={(e) => setEditingLink({ ...editingLink, targetId: e.target.value })}
                      className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded truncate"
                    >
                      {getOptionsForType(editingLink.targetType).map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Penjelasan Alasan Keterkaitan</label>
                <textarea
                  rows={2}
                  value={editingLink.explanation}
                  onChange={(e) => setEditingLink({ ...editingLink, explanation: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg text-slate-900"
                  placeholder="Mengapa entitas ini saling mendukung atau membantah..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Dasar Bukti / Rujukan</label>
                <input
                  type="text"
                  value={editingLink.sourceRef}
                  onChange={(e) => setEditingLink({ ...editingLink, sourceRef: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg text-slate-900 font-mono"
                  placeholder="Misal: BAP Konfrontasi Lembar 3 / Rekaman CCTV"
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
                disabled={!editingLink.sourceId || !editingLink.targetId}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-slate-950 font-semibold text-xs rounded-lg transition cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Relasi</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
