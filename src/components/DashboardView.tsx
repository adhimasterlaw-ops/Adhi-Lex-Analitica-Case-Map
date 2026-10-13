import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  FileText,
  Calendar,
  User,
  MapPin,
  CheckCircle2,
  Clock,
  Trash2,
  ExternalLink,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { CaseFullPackage, CaseStage } from '../types/case';

interface Props {
  cases: CaseFullPackage[];
  activeCaseId: string;
  onSelectCase: (id: string) => void;
  onOpenEditor: (id: string) => void;
  onOpenAnalysis: (id: string) => void;
  onDeleteCase: (id: string) => void;
  onNewCaseClick: () => void;
  onResetPreview?: () => void;
}

export const DashboardView: React.FC<Props> = ({
  cases,
  activeCaseId,
  onSelectCase,
  onOpenEditor,
  onOpenAnalysis,
  onDeleteCase,
  onNewCaseClick,
  onResetPreview
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [reviewFilter, setReviewFilter] = useState<string>('all');

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const matchSearch =
        c.matter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.matter.refNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.matter.leadInvestigator.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.matter.locusDelicti.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStage = stageFilter === 'all' || c.matter.stage === stageFilter;
      const matchReview =
        reviewFilter === 'all' ||
        (reviewFilter === 'reviewed' && c.matter.reviewedByHuman) ||
        (reviewFilter === 'unreviewed' && !c.matter.reviewedByHuman);

      return matchSearch && matchStage && matchReview;
    });
  }, [cases, searchTerm, stageFilter, reviewFilter]);

  const stages: CaseStage[] = [
    'Penyelidikan',
    'Penyidikan',
    'Pra-Penuntutan',
    'Penuntutan',
    'Persidangan'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Welcome & KPI Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Buku Register & Analisis Perkara</span>
              <span className="text-xs font-normal text-slate-500 font-mono border border-slate-200 px-2 py-0.5 rounded">
                Penyimpanan Lokal Peramban
              </span>
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Alat bantu telaah objektivitas penanganan perkara pidana. Beroperasi dalam mode pratinjau tanpa sambungan server eksternal untuk menjaga kerahasiaan simulasi.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNewCaseClick}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold text-sm rounded-lg shadow-sm transition cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Daftarkan Perkara Baru</span>
            </button>
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Perkara Terdata</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{cases.length}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Tersimpan di localStorage</div>
          </div>

          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tahap Penyidikan</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {cases.filter((c) => c.matter.stage === 'Penyidikan').length}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Sedang pemeriksaan BAP</div>
          </div>

          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Telah Ditinjau Manusia</div>
            <div className="text-2xl font-bold text-emerald-700 mt-1">
              {cases.filter((c) => c.matter.reviewedByHuman).length}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Terverifikasi analis/penyidik</div>
          </div>

          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Menunggu Telaah</div>
            <div className="text-2xl font-bold text-amber-700 mt-1">
              {cases.filter((c) => !c.matter.reviewedByHuman).length}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Perlu konfirmasi manusia</div>
          </div>
        </div>
      </div>

      {/* Search & Filters Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nomor LP/SPDP, judul perkara, penyidik, atau locus delicti..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Stage Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Tahap:</span>
            <select
              aria-label="Filter Berdasarkan Tahap"
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">Semua Tahap</option>
              {stages.map((stg) => (
                <option key={stg} value={stg}>
                  {stg}
                </option>
              ))}
            </select>
          </div>

          {/* Review Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
            <span className="text-slate-400">Review:</span>
            <select
              aria-label="Filter Berdasarkan Status Review"
              value={reviewFilter}
              onChange={(e) => setReviewFilter(e.target.value)}
              className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">Semua Status</option>
              <option value="reviewed">Sudah Ditinjau</option>
              <option value="unreviewed">Belum Ditinjau</option>
            </select>
          </div>
        </div>
      </div>

      {/* Case Cards List */}
      {filteredCases.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">Tidak ada perkara yang sesuai filter</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Coba ubah kata kunci pencarian atau reset filter untuk menampilkan kembali daftar berkas perkara.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setStageFilter('all');
              setReviewFilter('all');
            }}
            className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCases.map((c) => {
            const isSelected = c.matter.id === activeCaseId;
            return (
              <div
                key={c.matter.id}
                className={`bg-white border rounded-xl p-5 transition-all shadow-xs ${
                  isSelected
                    ? 'border-amber-500 ring-1 ring-amber-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Left Column: Metadata & Title */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1.5">
                      <span className="font-mono font-medium text-slate-700">{c.matter.refNumber}</span>
                      <span aria-hidden="true">·</span>
                      <span>Tahap: {c.matter.stage}</span>
                      <span aria-hidden="true">·</span>
                      <span>Status: {c.matter.status}</span>
                      <span aria-hidden="true">·</span>
                      <span>Versi {c.matter.versionNumber}.0</span>
                      {c.matter.reviewedByHuman ? (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-emerald-700 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
                            Ditinjau Manusia
                          </span>
                        </>
                      ) : (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-amber-700 font-medium flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-amber-600 inline" />
                            Belum Ditinjau
                          </span>
                        </>
                      )}
                    </div>

                    <h2 className="text-lg font-bold text-slate-900 hover:text-amber-700 transition cursor-pointer"
                        onClick={() => onSelectCase(c.matter.id)}>
                      {c.matter.title}
                    </h2>

                    <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                      {c.matter.initialSummary || 'Belum ada ringkasan awal perkara.'}
                    </p>

                    {/* Compact Details Strip */}
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{c.matter.jurisdiction || c.matter.locusDelicti || 'Wilayah Hukum belum ditentukan'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Penyidik: {c.matter.leadInvestigator}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Snapshot Hukum: {c.matter.legalSnapshotDate || c.matter.incidentDate || '-'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400 font-mono">Jenis:</span>
                        <span className="font-medium text-slate-700">{c.matter.caseType || 'Pidana Umum'}</span>
                      </div>
                    </div>

                    {/* Quantitative Breakdown Bar */}
                    <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                      <span>Pihak: <strong className="text-slate-800">{c.parties.length}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span>Fakta & Klaim: <strong className="text-slate-800">{c.facts.length}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span>Kronologi: <strong className="text-slate-800">{c.events.length}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span>Alat Bukti: <strong className="text-slate-800">{c.evidences.length}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span>Pasal/Unsur: <strong className="text-slate-800">{c.elements.length}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span>Relasi Eksplisit: <strong className="text-slate-800">{c.links.length}</strong></span>
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex lg:flex-col items-center lg:items-end justify-between gap-2 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenEditor(c.matter.id)}
                        className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold shadow-xs transition cursor-pointer flex items-center gap-1.5"
                      >
                        <span>Buka Editor</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onOpenAnalysis(c.matter.id)}
                        className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-md text-xs font-medium transition cursor-pointer flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-amber-700" />
                        <span>Analisis & Gelar</span>
                      </button>

                      {cases.length > 1 && (
                        <button
                          onClick={() => {
                            if (confirm(`Yakin ingin menghapus berkas perkara "${c.matter.title}" dari penyimpanan lokal?`)) {
                              onDeleteCase(c.matter.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
                          title="Hapus perkara dari penyimpanan lokal"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
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
