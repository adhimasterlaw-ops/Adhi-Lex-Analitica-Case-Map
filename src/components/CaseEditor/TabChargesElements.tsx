import React, { useState } from 'react';
import { Charge, LegalElement, LegalElementStatus, FactClaim, EvidenceItem } from '../../types/case';
import { Plus, Trash2, Edit2, Scale, AlertOctagon, Link2, X, Save, CheckCircle, AlertCircle, FileText } from 'lucide-react';

interface Props {
  charges: Charge[];
  elements: LegalElement[];
  facts: FactClaim[];
  evidences: EvidenceItem[];
  matterId: string;
  onUpdateCharges: (charges: Charge[]) => void;
  onUpdateElements: (elements: LegalElement[]) => void;
}

export const TabChargesElements: React.FC<Props> = ({
  charges,
  elements,
  facts,
  evidences,
  matterId,
  onUpdateCharges,
  onUpdateElements
}) => {
  const [editingCharge, setEditingCharge] = useState<Charge | null>(null);
  const [isChargeModalOpen, setIsChargeModalOpen] = useState(false);

  const [editingElement, setEditingElement] = useState<LegalElement | null>(null);
  const [isElementModalOpen, setIsElementModalOpen] = useState(false);

  const elementStatuses: LegalElementStatus[] = [
    'Belum Tersedia',
    'Perlu Bukti Tambahan',
    'Ada Bukti Pendukung',
    'Diperselisihkan / Ada Sanggahan'
  ];

  const handleOpenNewCharge = () => {
    setEditingCharge({
      id: 'charge-' + Math.random().toString(36).substring(2, 8),
      matterId,
      articleName: '',
      lawName: 'Kitab Undang-Undang Hukum Pidana (KUHP)',
      description: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    setIsChargeModalOpen(true);
  };

  const handleSaveCharge = () => {
    if (!editingCharge || !editingCharge.articleName.trim()) return;

    const exists = charges.some((c) => c.id === editingCharge.id);
    let updated: Charge[];
    if (exists) {
      updated = charges.map((c) =>
        c.id === editingCharge.id ? { ...editingCharge, updatedAt: new Date().toISOString() } : c
      );
    } else {
      updated = [...charges, { ...editingCharge, updatedAt: new Date().toISOString() }];
    }
    onUpdateCharges(updated);
    setIsChargeModalOpen(false);
    setEditingCharge(null);
  };

  const handleDeleteCharge = (chargeId: string) => {
    if (confirm('Hapus pasal ini beserta seluruh unsur di dalamnya?')) {
      onUpdateCharges(charges.filter((c) => c.id !== chargeId));
      onUpdateElements(elements.filter((e) => e.chargeId !== chargeId));
    }
  };

  const handleOpenNewElement = (chargeId: string) => {
    const existingCount = elements.filter((e) => e.chargeId === chargeId).length;
    setEditingElement({
      id: 'elem-' + Math.random().toString(36).substring(2, 8),
      chargeId,
      matterId,
      elementCode: `Unsur ${existingCount + 1}`,
      title: '',
      description: '',
      isObjective: true,
      status: 'Belum Tersedia',
      linkedFactIds: [],
      linkedEvidenceIds: [],
      reviewNotes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    setIsElementModalOpen(true);
  };

  const handleSaveElement = () => {
    if (!editingElement || !editingElement.title.trim()) return;

    const exists = elements.some((e) => e.id === editingElement.id);
    let updated: LegalElement[];
    if (exists) {
      updated = elements.map((e) =>
        e.id === editingElement.id ? { ...editingElement, updatedAt: new Date().toISOString() } : e
      );
    } else {
      updated = [...elements, { ...editingElement, updatedAt: new Date().toISOString() }];
    }
    onUpdateElements(updated);
    setIsElementModalOpen(false);
    setEditingElement(null);
  };

  const handleDeleteElement = (id: string) => {
    if (confirm('Hapus butir unsur ini?')) {
      onUpdateElements(elements.filter((e) => e.id !== id));
    }
  };

  const toggleArrayItem = (list: string[], item: string) => {
    return list.includes(item) ? list.filter((i) => i !== item) : [...list, item];
  };

  return (
    <div className="space-y-6">
      {/* Strict Neutrality & Non-conclusive Rule Banner */}
      <div className="bg-amber-950/10 border border-amber-800/30 rounded-lg p-3.5 text-xs text-amber-950 flex items-start gap-2.5">
        <AlertOctagon className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold tracking-wide mr-1.5 uppercase text-amber-900">
            Prinsip Mutlak: Unsur Tidak Boleh Ditandai Terpenuhi Otomatis
          </span>
          <p className="mt-0.5 text-amber-900/90 leading-relaxed">
            Sistem telaah perkara pidana ini berpegang pada asas praduga tak bersalah (presumption of innocence). Pemenuhan unsur pidana adalah kewenangan mutlak Majelis Hakim di persidangan. Status unsur pada sistem ini hanya mencatat <strong>ketersediaan alat bukti pendukung</strong> dan catatan telaah analisis.
          </p>
        </div>
      </div>

      {/* Top action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Konstruksi Pasal & Pemetaan Unsur Delik</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftarkan pasal yang disangkakan/didakwakan dan uraikan unsur-unsur objektif maupun subjektif.
          </p>
        </div>

        <button
          onClick={handleOpenNewCharge}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold text-xs rounded-lg transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Tambah Pasal Sangkaan</span>
        </button>
      </div>

      {/* Charges & Elements List */}
      {charges.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-8 text-center text-slate-500">
          <Scale className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">Belum ada pasal sangkaan terdaftar</p>
          <p className="text-xs mt-1">Tambahkan pasal KUHP atau UU Pidana Khusus (misal: Pasal 378 KUHP atau UU ITE).</p>
        </div>
      ) : (
        <div className="space-y-6">
          {charges.map((chg) => {
            const chargeElements = elements.filter((e) => e.chargeId === chg.id);

            return (
              <div
                key={chg.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs"
              >
                {/* Charge Header */}
                <div className="bg-slate-900 text-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif-heading font-bold text-base text-amber-300">
                        {chg.articleName}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">({chg.lawName})</span>
                    </div>
                    {chg.description && (
                      <p className="text-xs text-slate-300 mt-1 line-clamp-2 max-w-3xl leading-relaxed">
                        {chg.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleOpenNewElement(chg.id)}
                      className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold text-xs rounded transition cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Unsur</span>
                    </button>
                    <button
                      onClick={() => {
                        setEditingCharge(chg);
                        setIsChargeModalOpen(true);
                      }}
                      className="p-1 text-slate-400 hover:text-amber-300 transition cursor-pointer"
                      title="Edit Pasal"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCharge(chg.id)}
                      className="p-1 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                      title="Hapus Pasal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Elements Body */}
                <div className="p-4 bg-slate-50/50 space-y-3">
                  {chargeElements.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-500 italic">
                      Belum ada unsur pasal yang diurai. Klik &quot;Tambah Unsur&quot; untuk memecah klausul delik.
                    </div>
                  ) : (
                    chargeElements.map((elem) => {
                      const linkedFactsList = facts.filter((f) => elem.linkedFactIds.includes(f.id));
                      const linkedEvidencesList = evidences.filter((e) =>
                        elem.linkedEvidenceIds.includes(e.id)
                      );

                      return (
                        <div
                          key={elem.id}
                          className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs hover:border-slate-300 transition"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                            <div>
                              <div className="flex items-center gap-2 text-xs mb-1">
                                <span className="font-mono font-bold text-slate-700">
                                  {elem.elementCode}
                                </span>
                                <span aria-hidden="true" className="text-slate-300">·</span>
                                <span className="text-slate-500 font-medium">
                                  {elem.isObjective ? 'Unsur Objektif' : 'Unsur Subjektif (Mens Rea)'}
                                </span>
                                <span aria-hidden="true" className="text-slate-300">·</span>
                                <span
                                  className={`font-semibold ${
                                    elem.status === 'Ada Bukti Pendukung'
                                      ? 'text-emerald-700'
                                      : elem.status === 'Diperselisihkan / Ada Sanggahan'
                                      ? 'text-rose-700'
                                      : elem.status === 'Perlu Bukti Tambahan'
                                      ? 'text-amber-700'
                                      : 'text-slate-600'
                                  }`}
                                >
                                  Status: {elem.status}
                                </span>
                              </div>

                              <h4 className="text-sm font-bold text-slate-900">{elem.title}</h4>
                            </div>

                            <div className="flex items-center gap-1 text-slate-400 self-end sm:self-auto">
                              <button
                                onClick={() => {
                                  setEditingElement(elem);
                                  setIsElementModalOpen(true);
                                }}
                                className="p-1 hover:text-amber-600 rounded transition cursor-pointer"
                                title="Edit Unsur"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteElement(elem.id)}
                                className="p-1 hover:text-rose-600 rounded transition cursor-pointer"
                                title="Hapus Unsur"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <p className="text-xs text-slate-600 mb-2.5 leading-relaxed">
                            {elem.description}
                          </p>

                          {/* Linked facts & evidence */}
                          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                            {linkedFactsList.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1.5 text-slate-600">
                                <span className="font-semibold text-slate-500 text-[11px]">
                                  Fakta Terkait:
                                </span>
                                {linkedFactsList.map((f) => (
                                  <span
                                    key={f.id}
                                    className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px]"
                                  >
                                    {f.subject}: {f.action}
                                  </span>
                                ))}
                              </div>
                            )}

                            {linkedEvidencesList.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1.5 text-slate-600">
                                <span className="font-semibold text-emerald-700 text-[11px]">
                                  Alat Bukti Tertaut:
                                </span>
                                {linkedEvidencesList.map((e) => (
                                  <span
                                    key={e.id}
                                    className="bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-0.5 rounded text-[11px]"
                                  >
                                    {e.label}
                                  </span>
                                ))}
                              </div>
                            )}

                            {elem.reviewNotes && (
                              <div className="text-[11px] text-slate-700 bg-amber-50/50 border border-amber-200/50 p-2 rounded mt-2">
                                <span className="font-semibold text-amber-900">Catatan Telaah Unsur:</span>{' '}
                                {elem.reviewNotes}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Add / Edit Charge */}
      {isChargeModalOpen && editingCharge && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">
                {charges.some((c) => c.id === editingCharge.id) ? 'Edit Pasal Sangkaan' : 'Tambah Pasal Sangkaan'}
              </h3>
              <button
                onClick={() => setIsChargeModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama / Nomor Pasal *</label>
                <input
                  type="text"
                  value={editingCharge.articleName}
                  onChange={(e) => setEditingCharge({ ...editingCharge, articleName: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 font-bold"
                  placeholder="Contoh: Pasal 378 KUHP atau Pasal 372 KUHP"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Peraturan Perundang-undangan *</label>
                <input
                  type="text"
                  value={editingCharge.lawName}
                  onChange={(e) => setEditingCharge({ ...editingCharge, lawName: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg text-slate-900"
                  placeholder="Kitab Undang-Undang Hukum Pidana (KUHP)"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bunyi Lengkap Pasal</label>
                <textarea
                  rows={4}
                  value={editingCharge.description}
                  onChange={(e) => setEditingCharge({ ...editingCharge, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg text-slate-900"
                  placeholder="Kutipan bunyi teks pasal peraturan yang disangkakan..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-200 bg-slate-50">
              <button
                onClick={() => setIsChargeModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 font-medium rounded-lg transition cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSaveCharge}
                disabled={!editingCharge.articleName.trim()}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-slate-950 font-semibold text-xs rounded-lg transition cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Pasal</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add / Edit Element */}
      {isElementModalOpen && editingElement && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">
                {elements.some((e) => e.id === editingElement.id) ? 'Edit Unsur Pasal' : 'Tambah Unsur Baru'}
              </h3>
              <button
                onClick={() => setIsElementModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kode Unsur *</label>
                  <input
                    type="text"
                    value={editingElement.elementCode}
                    onChange={(e) => setEditingElement({ ...editingElement, elementCode: e.target.value })}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg text-slate-900 font-mono"
                    placeholder="Unsur 1"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Sifat Unsur</label>
                  <select
                    value={editingElement.isObjective ? 'obj' : 'subj'}
                    onChange={(e) =>
                      setEditingElement({ ...editingElement, isObjective: e.target.value === 'obj' })
                    }
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg text-slate-900 cursor-pointer"
                  >
                    <option value="obj">Objektif (Perbuatan/Keadaan/Objek)</option>
                    <option value="subj">Subjektif (Niat / Kesengajaan / Mens Rea)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Judul / Bunyi Unsur *</label>
                <input
                  type="text"
                  value={editingElement.title}
                  onChange={(e) => setEditingElement({ ...editingElement, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 font-medium"
                  placeholder="Contoh: Menguntungkan diri sendiri atau orang lain secara melawan hukum"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi & Standar Pembuktian</label>
                <textarea
                  rows={2}
                  value={editingElement.description}
                  onChange={(e) => setEditingElement({ ...editingElement, description: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg text-slate-900"
                  placeholder="Uraikan indikator materiil yang harus diuji untuk membuktikan unsur ini..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Status Ketersediaan Pembuktian (Non-Konklusif) *
                </label>
                <select
                  value={editingElement.status}
                  onChange={(e) =>
                    setEditingElement({ ...editingElement, status: e.target.value as LegalElementStatus })
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 cursor-pointer font-medium"
                >
                  {elementStatuses.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  * Catatan: Unsur tidak pernah berstatus &quot;Terpenuhi Final&quot; di luar vonis persidangan.
                </span>
              </div>

              {/* Tautkan Fakta */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tautkan Butir Fakta Pendukung</label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 border border-slate-200 rounded-lg bg-slate-50">
                  {facts.map((f) => {
                    const isSelected = editingElement.linkedFactIds.includes(f.id);
                    return (
                      <button
                        type="button"
                        key={f.id}
                        onClick={() =>
                          setEditingElement({
                            ...editingElement,
                            linkedFactIds: toggleArrayItem(editingElement.linkedFactIds, f.id)
                          })
                        }
                        className={`text-xs px-2.5 py-1 rounded transition cursor-pointer ${
                          isSelected
                            ? 'bg-slate-900 text-white font-medium'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {f.subject} - {f.action}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tautkan Bukti */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tautkan Alat Bukti</label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 border border-slate-200 rounded-lg bg-slate-50">
                  {evidences.map((e) => {
                    const isSelected = editingElement.linkedEvidenceIds.includes(e.id);
                    return (
                      <button
                        type="button"
                        key={e.id}
                        onClick={() =>
                          setEditingElement({
                            ...editingElement,
                            linkedEvidenceIds: toggleArrayItem(editingElement.linkedEvidenceIds, e.id)
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

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan Telaah Unsur</label>
                <textarea
                  rows={2}
                  value={editingElement.reviewNotes}
                  onChange={(e) => setEditingElement({ ...editingElement, reviewNotes: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg text-slate-900"
                  placeholder="Analisis mengenai titik temu bukti terhadap rumusan delik..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-200 bg-slate-50">
              <button
                onClick={() => setIsElementModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 font-medium rounded-lg transition cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSaveElement}
                disabled={!editingElement.title.trim()}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-slate-950 font-semibold text-xs rounded-lg transition cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Unsur</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
