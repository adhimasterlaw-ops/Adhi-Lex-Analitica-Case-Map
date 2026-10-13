import React, { useState } from 'react';
import { CaseFullPackage } from '../../types/case';
import {
  ContradictionCandidate,
  ConflictCategory,
  ConflictField,
  ConflictResolutionStatus,
  detectLocalContradictions,
  suggestContradictionsWithGemini
} from '../../lib/contradictionAnalyzer';
import {
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  RefreshCw,
  Quote,
  Filter,
  Check,
  X,
  MessageSquare,
  Info,
  Clock,
  FileQuestion,
  Layers,
  Save
} from 'lucide-react';

interface Props {
  casePackage: CaseFullPackage;
}

export const ContradictionDetectorView: React.FC<Props> = ({ casePackage }) => {
  const [candidates, setCandidates] = useState<ContradictionCandidate[]>(() =>
    detectLocalContradictions(casePackage)
  );
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [fieldFilter, setFieldFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loadingAi, setLoadingAi] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  // Active note editor state: candidateId -> draft note
  const [activeNoteEditorId, setActiveNoteEditorId] = useState<string | null>(null);
  const [draftReviewerNote, setDraftReviewerNote] = useState<string>('');

  const categoryLabels: Record<ConflictCategory, { label: string; badgeClass: string; desc: string }> = {
    'kontradiksi substantif': {
      label: 'Kontradiksi Substantif',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
      desc: 'Pertentangan fakta fisik/keberadaan/keabsahan yang saling menegasikan secara langsung.'
    },
    'perbedaan kronologi': {
      label: 'Perbedaan Kronologi',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
      desc: 'Selisih jam, tanggal, atau urutan tahapan rekonstruksi peristiwa.'
    },
    'perbedaan redaksi': {
      label: 'Perbedaan Redaksi',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
      desc: 'Variasi terminologi atau bahasa pihak tanpa pertentangan materiil pokok.'
    },
    'data hilang': {
      label: 'Data Hilang',
      badgeClass: 'bg-purple-100 text-purple-800 border-purple-300',
      desc: 'Ketiadaan catatan rujukan atau dokumen pembuktian pada basis data berwenang.'
    },
    'klarifikasi': {
      label: 'Klarifikasi',
      badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
      desc: 'Pernyataan yang memerlukan verifikasi saksi ahli atau pemeriksaan lanjutan.'
    }
  };

  const allConflictFields: ConflictField[] = [
    'subjek',
    'tindakan',
    'waktu',
    'tempat',
    'objek',
    'identitas sumber',
    'urutan peristiwa'
  ];

  const handleRunAiAnalysis = async () => {
    setLoadingAi(true);
    setNoticeMessage(null);
    try {
      const res = await suggestContradictionsWithGemini(casePackage);
      setCandidates(res.candidates);
      setNoticeMessage(res.notice);
    } catch (err: any) {
      setNoticeMessage(`Terjadi kesalahan: ${err?.message || 'Gagal memproses'}`);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleUpdateStatus = (
    id: string,
    newStatus: ConflictResolutionStatus,
    autoNote?: string
  ) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const now = new Date().toLocaleString('id-ID');
        return {
          ...c,
          humanResolutionStatus: newStatus,
          reviewedAt: now,
          reviewerNotes: autoNote !== undefined ? autoNote : c.reviewerNotes
        };
      })
    );
  };

  const handleOpenNoteEditor = (candidate: ContradictionCandidate) => {
    setActiveNoteEditorId(candidate.id);
    setDraftReviewerNote(candidate.reviewerNotes || '');
  };

  const handleSaveNote = (candidateId: string) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === candidateId
          ? {
              ...c,
              reviewerNotes: draftReviewerNote,
              reviewedAt: new Date().toLocaleString('id-ID')
            }
          : c
      )
    );
    setActiveNoteEditorId(null);
  };

  const filteredCandidates = candidates.filter((c) => {
    const matchCategory = categoryFilter === 'all' || c.category === categoryFilter;
    const matchField = fieldFilter === 'all' || c.conflictFields.includes(fieldFilter as ConflictField);
    const matchStatus = statusFilter === 'all' || c.humanResolutionStatus === statusFilter;
    return matchCategory && matchField && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Principle Banner */}
      <div className="bg-amber-950/10 border border-amber-800/30 rounded-lg p-3.5 text-xs text-amber-950 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-900 mr-1.5 uppercase">
            Detektor Konflik Data Terstruktur (7 Parameter Baku):
          </span>
          Sistem hanya membandingkan konflik pada <strong>subjek, tindakan, waktu, tempat, objek, identitas sumber, dan urutan peristiwa</strong>. Sistem membedakan secara tegas antara <em>kontradiksi substantif</em>, <em>perbedaan kronologi</em>, <em>perbedaan redaksi</em>, <em>data hilang</em>, dan <em>klarifikasi</em>. Tidak menyatakan kesimpulan bersalah atau vonis.
        </div>
      </div>

      {/* Control & Filter Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Temuan Kontradiksi & Sanggahan Terstruktur</span>
              <span className="text-xs font-mono font-normal text-slate-500">
                ({filteredCandidates.length} dari {candidates.length} temuan)
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Analisis perbandingan kutipan dokumen berpasangan (Sisi A vs Sisi B).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCandidates(detectLocalContradictions(casePackage))}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1.5"
              title="Muat ulang pemindaian terstruktur lokal"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Pindai Ulang Lokal</span>
            </button>

            <button
              onClick={handleRunAiAnalysis}
              disabled={loadingAi}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1.5 shadow-xs disabled:opacity-50"
              title="Gunakan bantuan Gemini AI untuk membandingkan kutipan berkas secara netral"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{loadingAi ? 'Menganalisis Teks...' : 'Saran Kandidat (Gemini AI)'}</span>
            </button>
          </div>
        </div>

        {/* Filters Strip */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-700">Kategori Konflik:</span>
            <select
              aria-label="Filter Berdasarkan Kategori Konflik"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs font-medium text-slate-800 cursor-pointer focus:outline-none"
            >
              <option value="all">Semua Kategori (5)</option>
              <option value="kontradiksi substantif">Kontradiksi Substantif</option>
              <option value="perbedaan kronologi">Perbedaan Kronologi</option>
              <option value="perbedaan redaksi">Perbedaan Redaksi</option>
              <option value="data hilang">Data Hilang</option>
              <option value="klarifikasi">Klarifikasi</option>
            </select>
          </div>

          {/* Field Filter */}
          <div className="flex items-center gap-1.5 text-slate-600">
            <span className="font-semibold text-slate-700">Field Terbentur:</span>
            <select
              aria-label="Filter Berdasarkan Field Konflik"
              value={fieldFilter}
              onChange={(e) => setFieldFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs font-medium text-slate-800 cursor-pointer focus:outline-none"
            >
              <option value="all">Semua Parameter Field</option>
              {allConflictFields.map((fld) => (
                <option key={fld} value={fld}>
                  Field: {fld}
                </option>
              ))}
            </select>
          </div>

          {/* Status Review Filter */}
          <div className="flex items-center gap-1.5 text-slate-600">
            <span className="font-semibold text-slate-700">Status Review Manusia:</span>
            <select
              aria-label="Filter Berdasarkan Status Review Manusia"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs font-medium text-slate-800 cursor-pointer focus:outline-none"
            >
              <option value="all">Semua Status Review</option>
              <option value="Menunggu Review">Menunggu Review</option>
              <option value="Dikonfirmasi Kontradiksi">Dikonfirmasi Kontradiksi</option>
              <option value="Bukan Kontradiksi">Bukan Kontradiksi</option>
              <option value="Perlu Klarifikasi">Perlu Klarifikasi</option>
            </select>
          </div>
        </div>
      </div>

      {noticeMessage && (
        <div className="p-3 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-700 flex items-start gap-2">
          <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <span>{noticeMessage}</span>
        </div>
      )}

      {/* Cards List */}
      {filteredCandidates.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-slate-500">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-800">Tidak Ditemukan Temuan yang Sesuai</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            Silakan reset filter kategori, field, atau status review untuk menampilkan seluruh temuan.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCandidates.map((cand) => {
            const catConfig = categoryLabels[cand.category] || categoryLabels['kontradiksi substantif'];
            const isNoteEditorOpen = activeNoteEditorId === cand.id;

            return (
              <div
                key={cand.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition space-y-4"
              >
                {/* Header: Title, Category Badge, Conflict Fields, Confidence Level */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {/* Category Badge */}
                      <span
                        className={`font-bold px-2 py-0.5 rounded border text-[11px] ${catConfig.badgeClass}`}
                        title={catConfig.desc}
                      >
                        {catConfig.label}
                      </span>

                      <span aria-hidden="true" className="text-slate-300">·</span>

                      {/* Conflict Fields Tags */}
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="text-[11px] text-slate-500 font-medium">Field Benturan:</span>
                        {cand.conflictFields.map((fld) => (
                          <span
                            key={fld}
                            className="bg-slate-100 text-slate-800 font-mono text-[10px] px-1.5 py-0.2 rounded border border-slate-200"
                          >
                            #{fld}
                          </span>
                        ))}
                      </div>

                      <span aria-hidden="true" className="text-slate-300">·</span>

                      {/* Confidence Level */}
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          cand.confidenceLevel === 'Tinggi'
                            ? 'bg-rose-50 text-rose-800 border border-rose-200'
                            : cand.confidenceLevel === 'Sedang'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        Tingkat Keyakinan Dokumen: {cand.confidenceLevel}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 mt-1">{cand.title}</h4>
                  </div>

                  {/* Human Review Status Badge */}
                  <div className="shrink-0 self-start sm:self-auto">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                        cand.humanResolutionStatus === 'Dikonfirmasi Kontradiksi'
                          ? 'bg-rose-100 text-rose-900 border-rose-300'
                          : cand.humanResolutionStatus === 'Bukan Kontradiksi'
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : cand.humanResolutionStatus === 'Perlu Klarifikasi'
                          ? 'bg-blue-100 text-blue-900 border-blue-300'
                          : 'bg-amber-50 text-amber-900 border-amber-200'
                      }`}
                    >
                      <Clock className="w-3 h-3 shrink-0" />
                      <span>{cand.humanResolutionStatus}</span>
                    </span>
                  </div>
                </div>

                {/* Structured Data Comparison (Side-by-Side: Sisi A vs Sisi B) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Sisi A */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-xs border-b border-slate-200 pb-1.5">
                      <span className="font-bold text-slate-900">{cand.itemA.label}</span>
                      <span className="text-[11px] text-slate-600 font-medium">({cand.itemA.speaker})</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                        Nilai Field Terstruktur:
                      </span>
                      <div className="text-xs font-mono font-semibold text-slate-900 bg-white p-1.5 rounded border border-slate-200 mt-0.5">
                        {cand.itemA.fieldValue}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                        Kutipan Verbatim:
                      </span>
                      <blockquote className="text-xs text-slate-800 italic bg-white border-l-2 border-slate-400 pl-2.5 py-1.5 rounded-r mt-0.5">
                        &ldquo;{cand.itemA.quote}&rdquo;
                      </blockquote>
                    </div>

                    <div className="text-[10px] text-slate-500 font-mono pt-1">
                      Sumber: <strong className="text-slate-700">{cand.itemA.source}</strong>
                    </div>
                  </div>

                  {/* Sisi B */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-xs border-b border-slate-200 pb-1.5">
                      <span className="font-bold text-slate-900">{cand.itemB.label}</span>
                      <span className="text-[11px] text-slate-600 font-medium">({cand.itemB.speaker})</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                        Nilai Field Pembanding:
                      </span>
                      <div className="text-xs font-mono font-semibold text-slate-900 bg-white p-1.5 rounded border border-slate-200 mt-0.5">
                        {cand.itemB.fieldValue}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                        Kutipan Verbatim:
                      </span>
                      <blockquote className="text-xs text-slate-800 italic bg-white border-l-2 border-amber-500 pl-2.5 py-1.5 rounded-r mt-0.5">
                        &ldquo;{cand.itemB.quote}&rdquo;
                      </blockquote>
                    </div>

                    <div className="text-[10px] text-slate-500 font-mono pt-1">
                      Sumber: <strong className="text-slate-700">{cand.itemB.source}</strong>
                    </div>
                  </div>
                </div>

                {/* Alternative Explanation */}
                <div className="bg-blue-50/70 border border-blue-200/80 rounded-lg p-3 text-xs text-blue-950 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-blue-900 mr-1.5 uppercase">
                      Penjelasan Alternatif Faktual (Non-Konklusif):
                    </span>
                    <p className="mt-0.5 leading-relaxed">{cand.alternativeExplanation}</p>
                  </div>
                </div>

                {/* Reviewer Notes Section */}
                <div className="space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                      <span>Catatan Reviewer / Penelaah Manusia:</span>
                    </span>
                    {cand.reviewedAt && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        Ditinjau: {cand.reviewedAt}
                      </span>
                    )}
                  </div>

                  {isNoteEditorOpen ? (
                    <div className="space-y-2 pt-1">
                      <textarea
                        rows={3}
                        value={draftReviewerNote}
                        onChange={(e) => setDraftReviewerNote(e.target.value)}
                        placeholder="Tuliskan catatan tindak lanjut konfrontasi, petunjuk uji laboratoris, atau dasar pengabaian kontradiksi..."
                        className="w-full p-2 text-xs border border-slate-300 rounded bg-white text-slate-900 leading-relaxed focus:ring-1 focus:ring-amber-500"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setActiveNoteEditorId(null)}
                          className="px-2.5 py-1 text-slate-600 hover:text-slate-800 text-xs rounded transition"
                        >
                          Batal
                        </button>
                        <button
                          onClick={() => handleSaveNote(cand.id)}
                          className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold text-xs rounded transition flex items-center gap-1"
                        >
                          <Save className="w-3 h-3" />
                          <span>Simpan Catatan</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-2 pt-0.5">
                      <p className="text-slate-700 italic">
                        {cand.reviewerNotes || <span className="text-slate-400">Belum ada catatan telaah khusus.</span>}
                      </p>
                      <button
                        onClick={() => handleOpenNoteEditor(cand)}
                        className="text-[11px] text-amber-800 font-semibold hover:underline shrink-0 cursor-pointer"
                      >
                        {cand.reviewerNotes ? 'Edit Catatan' : '+ Tambah Catatan'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Human Action Buttons Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <span className="text-[11px] text-slate-500 font-medium">
                    Tindakan Reviewer:
                  </span>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* 1. Konfirmasi Kontradiksi */}
                    <button
                      onClick={() =>
                        handleUpdateStatus(
                          cand.id,
                          'Dikonfirmasi Kontradiksi',
                          cand.reviewerNotes || 'Dikonfirmasi sebagai kontradiksi materiil yang wajib dikonfrontir.'
                        )
                      }
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition cursor-pointer flex items-center gap-1.5 ${
                        cand.humanResolutionStatus === 'Dikonfirmasi Kontradiksi'
                          ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                          : 'bg-white text-rose-700 border-rose-300 hover:bg-rose-50'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Konfirmasi Kontradiksi</span>
                    </button>

                    {/* 2. Tandai Bukan Kontradiksi */}
                    <button
                      onClick={() =>
                        handleUpdateStatus(
                          cand.id,
                          'Bukan Kontradiksi',
                          cand.reviewerNotes || 'Ditandai bukan kontradiksi setelah pencocokan dokumen.'
                        )
                      }
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition cursor-pointer flex items-center gap-1.5 ${
                        cand.humanResolutionStatus === 'Bukan Kontradiksi'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50'
                      }`}
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Tandai Bukan Kontradiksi</span>
                    </button>

                    {/* 3. Minta Klarifikasi */}
                    <button
                      onClick={() =>
                        handleUpdateStatus(
                          cand.id,
                          'Perlu Klarifikasi',
                          cand.reviewerNotes || 'Perlu klarifikasi tambahan pada pemeriksaan BAP lanjutan.'
                        )
                      }
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition cursor-pointer flex items-center gap-1.5 ${
                        cand.humanResolutionStatus === 'Perlu Klarifikasi'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Minta Klarifikasi</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
