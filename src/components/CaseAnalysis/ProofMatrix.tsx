import React, { useState } from 'react';
import {
  Charge,
  LegalElement,
  Party,
  FactClaim,
  EvidenceItem,
  CaseFullPackage,
  LegalRelevance
} from '../../types/case';
import {
  Table,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Search,
  Edit2,
  Save,
  X,
  HelpCircle,
  FileText,
  Scale
} from 'lucide-react';

interface Props {
  charges: Charge[];
  elements: LegalElement[];
  parties: Party[];
  facts: FactClaim[];
  evidences: EvidenceItem[];
  casePackage?: CaseFullPackage;
  onUpdateElement?: (updated: LegalElement) => void;
}

export const ProofMatrix: React.FC<Props> = ({
  charges,
  elements,
  parties,
  facts,
  evidences,
  casePackage,
  onUpdateElement
}) => {
  const [chargeFilter, setChargeFilter] = useState<string>('all');
  const [relevanceFilter, setRelevanceFilter] = useState<string>('all');
  const [disputeFilter, setDisputeFilter] = useState<string>('all');
  const [editingElement, setEditingElement] = useState<LegalElement | null>(null);

  const relevanceOptions: LegalRelevance[] = [
    'Langsung (Direct Evidence)',
    'Tidak Langsung / Sirkumstansial',
    'Petunjuk (Indicia)',
    'Belum Ditentukan'
  ];

  // Helper to extract opposing claims / bantahan associated with this element
  const getBantahanForElement = (elem: LegalElement) => {
    const opposingClaims: { title: string; source: string; quote: string; speaker: string }[] = [];

    // 1. Facts that have reviewStatus === 'Diperselisihkan'
    elem.linkedFactIds.forEach((fId) => {
      const f = facts.find((fact) => fact.id === fId);
      if (f && f.reviewStatus === 'Diperselisihkan') {
        opposingClaims.push({
          title: `Sanggahan Fakta: ${f.subject}`,
          source: f.sourceRef + (f.documentPage ? ` (${f.documentPage})` : ''),
          quote: f.rawClaimText,
          speaker: f.subject
        });
      }
    });

    // 2. Events that have opposing evidences or timeCertainty === 'Diperselisihkan'
    if (casePackage) {
      casePackage.events.forEach((evt) => {
        if (evt.timeCertainty === 'Diperselisihkan' || evt.opposingEvidenceIds.length > 0) {
          // If related to element facts
          const isRelated = elem.linkedFactIds.some((fId) => {
            const f = facts.find((fact) => fact.id === fId);
            return f && (evt.title.includes(f.placeText) || evt.description.includes(f.subject));
          });
          if (isRelated || elem.status === 'Diperselisihkan / Ada Sanggahan') {
            opposingClaims.push({
              title: `Bantahan Kronologi: ${evt.title}`,
              source: evt.sourceRef || 'BAP Pembelaan',
              quote: evt.description,
              speaker: 'Pihak Terlapor / Saksi'
            });
          }
        }
      });

      // 3. Explicit links with type 'membantah' targeting this element
      casePackage.links
        .filter((l) => l.targetId === elem.id && l.relationType === 'membantah')
        .forEach((l) => {
          opposingClaims.push({
            title: 'Relasi Sanggahan Eksplisit',
            source: l.sourceRef || 'Catatan Berkas',
            quote: l.explanation,
            speaker: 'Alat Bukti Lawan'
          });
        });
    }

    return opposingClaims;
  };

  const filteredElements = elements.filter((elem) => {
    const matchCharge = chargeFilter === 'all' || elem.chargeId === chargeFilter;
    const matchRelevance =
      relevanceFilter === 'all' || (elem.relevance || 'Belum Ditentukan') === relevanceFilter;

    const bantahanList = getBantahanForElement(elem);
    const hasBantahan = bantahanList.length > 0 || elem.status === 'Diperselisihkan / Ada Sanggahan';
    const matchDispute =
      disputeFilter === 'all' ||
      (disputeFilter === 'with_dispute' && hasBantahan) ||
      (disputeFilter === 'no_dispute' && !hasBantahan);

    return matchCharge && matchRelevance && matchDispute;
  });

  const handleSaveEdit = () => {
    if (editingElement && onUpdateElement) {
      onUpdateElement(editingElement);
      setEditingElement(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Principle Strict Banner */}
      <div className="bg-amber-950/10 border border-amber-800/30 rounded-lg p-3.5 text-xs text-amber-950 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-900 mr-1.5 uppercase">
            Matriks Pembuktian 7 Dimensi (Unsur × Fakta × Bukti × Sumber × Bantahan × Relevansi × Status Review):
          </span>
          Matriks ini menyajikan korelasi materiil tanpa rekayasa skor peluang, tanpa prediksi putusan, dan <strong>tanpa otomatisasi kesimpulan &quot;unsur terpenuhi&quot;</strong>. Penilaian pembuktian akhir tetap berada pada wewenang pembuktian majelis hakim di persidangan.
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Charge Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Scale className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-700">Pasal:</span>
            <select
              aria-label="Filter Berdasarkan Pasal"
              value={chargeFilter}
              onChange={(e) => setChargeFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs font-medium text-slate-800 cursor-pointer focus:outline-none"
            >
              <option value="all">Semua Pasal ({elements.length} unsur)</option>
              {charges.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.articleName}
                </option>
              ))}
            </select>
          </div>

          {/* Relevance Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-700">Relevansi:</span>
            <select
              aria-label="Filter Berdasarkan Relevansi Yuridis"
              value={relevanceFilter}
              onChange={(e) => setRelevanceFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs font-medium text-slate-800 cursor-pointer focus:outline-none"
            >
              <option value="all">Semua Relevansi</option>
              {relevanceOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Dispute Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold text-slate-700">Sanggahan:</span>
            <select
              aria-label="Filter Berdasarkan Keberadaan Bantahan"
              value={disputeFilter}
              onChange={(e) => setDisputeFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs font-medium text-slate-800 cursor-pointer focus:outline-none"
            >
              <option value="all">Semua Baris</option>
              <option value="with_dispute">Ada Bantahan / Sanggahan</option>
              <option value="no_dispute">Tanpa Sanggahan</option>
            </select>
          </div>
        </div>

        <span className="text-xs text-slate-500 font-mono">
          Menampilkan {filteredElements.length} dari {elements.length} unsur
        </span>
      </div>

      {/* Matrix Table */}
      {filteredElements.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-slate-500">
          <Table className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-800">Tidak Ada Unsur yang Sesuai Filter</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            Silakan sesuaikan filter pasal, relevansi, atau sanggahan untuk menampilkan kembali matriks pembuktian.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-800 border-collapse">
              <thead className="bg-slate-900 text-white uppercase text-[11px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-3.5 border-r border-slate-800 w-1/6">1. Unsur & Delik</th>
                  <th className="py-3 px-3.5 border-r border-slate-800 w-1/6">2. Fakta Materiil</th>
                  <th className="py-3 px-3.5 border-r border-slate-800 w-1/6">3. Alat Bukti Sah (KUHAP 184)</th>
                  <th className="py-3 px-3.5 border-r border-slate-800 w-1/6">4. Sumber & Halaman</th>
                  <th className="py-3 px-3.5 border-r border-slate-800 w-1/6">5. Bantahan / Sanggahan</th>
                  <th className="py-3 px-3.5 border-r border-slate-800 w-1/12">6. Relevansi Yuridis</th>
                  <th className="py-3 px-3.5 w-1/6">7. Status Review & Catatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredElements.map((elem, idx) => {
                  const parentCharge = charges.find((c) => c.id === elem.chargeId);
                  const linkedFacts = facts.filter((f) => elem.linkedFactIds.includes(f.id));
                  const linkedEvidences = evidences.filter((e) =>
                    elem.linkedEvidenceIds.includes(e.id)
                  );
                  const bantahanList = getBantahanForElement(elem);
                  const hasBantahan = bantahanList.length > 0 || elem.status === 'Diperselisihkan / Ada Sanggahan';

                  return (
                    <tr
                      key={elem.id}
                      className={idx % 2 === 0 ? 'bg-white hover:bg-slate-50/80 transition' : 'bg-slate-50/50 hover:bg-slate-100/70 transition'}
                    >
                      {/* 1. UNSUR & DELIK */}
                      <td className="py-3.5 px-3.5 border-r border-slate-200 align-top">
                        <div className="font-mono text-[10px] text-amber-800 font-bold uppercase mb-0.5">
                          {parentCharge?.articleName || 'Pasal'} · {elem.elementCode}
                        </div>
                        <div className="font-bold text-slate-900 text-xs mb-1">{elem.title}</div>
                        <p className="text-[11px] text-slate-600 leading-relaxed mb-2">
                          {elem.description}
                        </p>
                        <span className="text-[10px] text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded">
                          {elem.isObjective ? 'Unsur Objektif' : 'Unsur Subjektif (Mens Rea)'}
                        </span>
                      </td>

                      {/* 2. FAKTA MATERIIL */}
                      <td className="py-3.5 px-3.5 border-r border-slate-200 align-top">
                        {linkedFacts.length === 0 ? (
                          <div className="text-amber-800 italic text-[11px] bg-amber-50/60 p-2 rounded border border-amber-200/50">
                            Belum ada butir fakta terverifikasi ditautkan ke unsur ini.
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {linkedFacts.map((f) => (
                              <div key={f.id} className="bg-slate-100/80 p-2.5 rounded text-[11px]">
                                <span className="font-bold text-slate-900 block">
                                  {f.subject}: {f.action}
                                </span>
                                <p className="text-slate-700 italic mt-1 line-clamp-3">
                                  &ldquo;{f.rawClaimText}&rdquo;
                                </p>
                                <div className="text-[10px] text-slate-500 mt-1.5 flex flex-wrap gap-2">
                                  <span>Waktu: {f.timeText || '-'}</span>
                                  <span>Tempat: {f.placeText || '-'}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* 3. ALAT BUKTI SAH (PASAL 184 KUHAP) */}
                      <td className="py-3.5 px-3.5 border-r border-slate-200 align-top">
                        {linkedEvidences.length === 0 ? (
                          <div className="text-amber-800 italic text-[11px] bg-amber-50/60 p-2 rounded border border-amber-200/50">
                            Belum ada alat bukti sah ditautkan.
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {linkedEvidences.map((e) => (
                              <div
                                key={e.id}
                                className="bg-emerald-50/70 border border-emerald-200/80 p-2.5 rounded text-[11px]"
                              >
                                <div className="font-bold text-emerald-950">
                                  [{e.type}] {e.label}
                                </div>
                                <p className="text-slate-700 mt-1 line-clamp-2">
                                  {e.description}
                                </p>
                                <div className="text-[10px] text-slate-500 mt-1.5">
                                  Asal: {e.origin || '-'} · Tgl: {e.acquisitionDate}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* 4. SUMBER & HALAMAN */}
                      <td className="py-3.5 px-3.5 border-r border-slate-200 align-top text-[11px]">
                        <div className="space-y-2">
                          {linkedFacts.map((f) => (
                            <div key={`src-f-${f.id}`} className="bg-slate-50 p-2 rounded border border-slate-200">
                              <span className="font-semibold text-slate-700 block">Rujukan Fakta:</span>
                              <div className="font-mono text-[10px] text-slate-900 mt-0.5 break-words">
                                {f.sourceRef}
                              </div>
                              {f.documentPage && (
                                <div className="text-[10px] text-slate-500 mt-0.5">
                                  Halaman/Lembar: <strong>{f.documentPage}</strong>
                                </div>
                              )}
                            </div>
                          ))}

                          {linkedEvidences.map((e) => (
                            <div key={`src-e-${e.id}`} className="bg-slate-50 p-2 rounded border border-slate-200">
                              <span className="font-semibold text-slate-700 block">Rujukan Bukti:</span>
                              <div className="font-mono text-[10px] text-slate-900 mt-0.5">
                                Register: {e.manualHash ? e.manualHash.substring(0, 24) + '...' : e.label}
                              </div>
                              {e.storageLocation && (
                                <div className="text-[10px] text-slate-500 mt-0.5">
                                  Simpan: {e.storageLocation}
                                </div>
                              )}
                            </div>
                          ))}

                          {linkedFacts.length === 0 && linkedEvidences.length === 0 && (
                            <span className="text-slate-400 italic">Belum ada rujukan sumber</span>
                          )}
                        </div>
                      </td>

                      {/* 5. BANTAHAN / SANGGAHAN */}
                      <td className="py-3.5 px-3.5 border-r border-slate-200 align-top text-[11px]">
                        {!hasBantahan && bantahanList.length === 0 ? (
                          <div className="text-slate-500 italic p-2 bg-slate-50 rounded border border-slate-100">
                            Tidak tercatat sanggahan formal dari pihak lawan.
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block">
                              ⚠️ Sanggahan Tercatat:
                            </span>
                            {bantahanList.map((b, bIdx) => (
                              <div
                                key={bIdx}
                                className="bg-rose-50/80 border border-rose-200 p-2.5 rounded text-[11px] text-rose-950"
                              >
                                <div className="font-bold text-rose-900">{b.title}</div>
                                <blockquote className="italic text-rose-900/90 mt-1 line-clamp-3">
                                  &ldquo;{b.quote}&rdquo;
                                </blockquote>
                                <div className="text-[10px] text-rose-700 mt-1 font-mono">
                                  Sumber: {b.source} ({b.speaker})
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* 6. RELEVANSI YURIDIS */}
                      <td className="py-3.5 px-3.5 border-r border-slate-200 align-top">
                        <div className="space-y-2">
                          <span
                            className={`font-semibold text-xs block px-2.5 py-1 rounded text-center border ${
                              elem.relevance === 'Langsung (Direct Evidence)'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : elem.relevance === 'Tidak Langsung / Sirkumstansial'
                                ? 'bg-blue-50 text-blue-800 border-blue-300'
                                : elem.relevance === 'Petunjuk (Indicia)'
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : 'bg-slate-100 text-slate-700 border-slate-300'
                            }`}
                          >
                            {elem.relevance || 'Belum Ditentukan'}
                          </span>

                          {onUpdateElement && (
                            <button
                              onClick={() => setEditingElement(elem)}
                              className="w-full text-[10px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 py-1 rounded transition text-center cursor-pointer"
                            >
                              Ubah Relevansi
                            </button>
                          )}
                        </div>
                      </td>

                      {/* 7. STATUS REVIEW & CATATAN NON-KONKLUSIF */}
                      <td className="py-3.5 px-3.5 align-top">
                        <div className="space-y-2">
                          <div
                            className={`font-bold text-xs ${
                              elem.status === 'Ada Bukti Pendukung'
                                ? 'text-emerald-700'
                                : elem.status === 'Diperselisihkan / Ada Sanggahan'
                                ? 'text-rose-700'
                                : elem.status === 'Perlu Bukti Tambahan'
                                ? 'text-amber-700'
                                : 'text-slate-500'
                            }`}
                          >
                            {elem.status}
                          </div>

                          {elem.reviewNotes ? (
                            <div className="text-[11px] text-slate-700 bg-slate-100/90 p-2.5 rounded border border-slate-200 leading-relaxed">
                              {elem.reviewNotes}
                            </div>
                          ) : (
                            <div className="text-[10px] text-slate-400 italic">
                              Belum ada catatan telaah khusus.
                            </div>
                          )}

                          {onUpdateElement && (
                            <button
                              onClick={() => setEditingElement(elem)}
                              className="text-[10px] font-semibold text-amber-800 hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>Edit Catatan Telaah</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Quick Edit Relevance & Review Notes */}
      {editingElement && onUpdateElement && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">
                  {editingElement.elementCode}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">{editingElement.title}</h3>
              </div>
              <button
                onClick={() => setEditingElement(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tingkat Relevansi Yuridis
                </label>
                <select
                  value={editingElement.relevance || 'Belum Ditentukan'}
                  onChange={(e) =>
                    setEditingElement({
                      ...editingElement,
                      relevance: e.target.value as LegalRelevance
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg text-slate-900 font-medium cursor-pointer"
                >
                  {relevanceOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Relevansi mengelompokkan sifat bukti (langsung, sirkumstansial, petunjuk) tanpa menghitung persentase peluang vonis.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan Telaah Objektivitas (Non-Konklusif)
                </label>
                <textarea
                  rows={4}
                  value={editingElement.reviewNotes}
                  onChange={(e) =>
                    setEditingElement({
                      ...editingElement,
                      reviewNotes: e.target.value
                    })
                  }
                  placeholder="Catatan analisis mengenai kesesuaian bukti, celah yang perlu dibuktikan di persidangan..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg text-slate-900 leading-relaxed"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-200 bg-slate-50">
              <button
                onClick={() => setEditingElement(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 font-medium rounded-lg transition cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold text-xs rounded-lg transition cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Perubahan Matriks</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
