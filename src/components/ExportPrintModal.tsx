import React, { useState } from 'react';
import { CaseFullPackage, CaseExportEnvelope } from '../types/case';
import {
  validateCasePackageJson,
  generateExportEnvelope
} from '../lib/storage';
import { createMaskedCasePackage } from '../lib/masking';
import {
  X,
  Download,
  Upload,
  Printer,
  AlertTriangle,
  CheckCircle2,
  FileJson,
  ShieldCheck,
  ShieldAlert,
  FileText,
  EyeOff,
  Eye,
  Lock,
  Layers,
  Info
} from 'lucide-react';

interface Props {
  casePackage: CaseFullPackage;
  allCases: CaseFullPackage[];
  isOpen: boolean;
  onClose: () => void;
  onImportCase: (imported: CaseFullPackage) => void;
  onGoToReviewTab?: () => void;
}

export const ExportPrintModal: React.FC<Props> = ({
  casePackage,
  allCases,
  isOpen,
  onClose,
  onImportCase,
  onGoToReviewTab
}) => {
  const [activeTab, setActiveTab] = useState<'print' | 'exportJson' | 'importJson'>('print');
  const [isMaskingEnabled, setIsMaskingEnabled] = useState(false);
  const [unreviewedAcknowledged, setUnreviewedAcknowledged] = useState(false);
  const [importStatus, setImportStatus] = useState<{
    success?: boolean;
    message?: string;
    envelopeInfo?: string;
  } | null>(null);

  if (!isOpen) return null;

  const isReviewed = Boolean(casePackage.matter.reviewedByHuman);
  const canProceedWithExport = isReviewed || unreviewedAcknowledged;

  // Generate real envelope for display & download
  const currentEnvelope: CaseExportEnvelope = generateExportEnvelope(
    casePackage,
    isMaskingEnabled
  );

  // JSON Export Handlers
  const handleDownloadStandardEnvelopeJson = () => {
    if (!canProceedWithExport) {
      alert('Mohon konfirmasi persetujuan ekspor draf belum diverifikasi manusia terlebih dahulu.');
      return;
    }

    const envelope = generateExportEnvelope(casePackage, isMaskingEnabled);
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(envelope, null, 2));
    const downloadAnchor = document.createElement('a');
    const safeRef = casePackage.matter.refNumber.replace(/[^a-zA-Z0-9_-]/g, '_');
    const maskSuffix = isMaskingEnabled ? '_TERDISAMARKAN' : '';
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `TELAAH-PERKARA_${safeRef}_v${casePackage.matter.versionNumber}${maskSuffix}_ENVELOPE.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDownloadAllCasesJson = () => {
    if (!canProceedWithExport) {
      alert('Mohon konfirmasi persetujuan ekspor draf terlebih dahulu.');
      return;
    }

    const exportedPackages = isMaskingEnabled
      ? allCases.map(c => createMaskedCasePackage(c))
      : allCases;

    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(exportedPackages, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `SEMUA_BERKAS_TELAAH_PIDANA_${new Date().toISOString().split('T')[0]}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // JSON Import Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = validateCasePackageJson(content);
      if (res.isValid && res.data) {
        onImportCase(res.data);
        const envelopeNote = res.envelopeHeader
          ? ` (Skema: ${res.envelopeHeader.schemaVersion}, Snapshot: ${res.envelopeHeader.snapshotId})`
          : '';
        setImportStatus({
          success: true,
          message: `Berhasil mengimpor berkas "${res.data.matter.title}" (${res.data.matter.refNumber}).`,
          envelopeInfo: envelopeNote
        });
      } else {
        setImportStatus({
          success: false,
          message: res.message
        });
      }
    };
    reader.readAsText(file);
  };

  // Trigger browser print
  const handleTriggerPrint = () => {
    if (!canProceedWithExport) {
      alert('Mohon tandai persetujuan pencetakan draf belum diverifikasi manusia terlebih dahulu.');
      return;
    }
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 no-print animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                Ekspor Standar, Validasi Telaah & Cetak Lembar Perkara
              </h3>
              <p className="text-[11px] text-slate-400">
                Penyempurnaan Keamanan Data, Watermark Ganda & Header Validasi Berkas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-slate-100/70 p-1.5 gap-1.5 shrink-0">
          <button
            onClick={() => setActiveTab('print')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'print'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Printer className="w-3.5 h-3.5 text-amber-600" />
            <span>Cetak Lembar / Simpan PDF</span>
          </button>

          <button
            onClick={() => setActiveTab('exportJson')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'exportJson'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-sky-600" />
            <span>Ekspor JSON (Envelope Standar)</span>
          </button>

          <button
            onClick={() => setActiveTab('importJson')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'importJson'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-emerald-600" />
            <span>Impor JSON</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* VALIDATION ROADBLOCK: HUMAN REVIEW CHECK */}
          {!isReviewed ? (
            <div className="bg-amber-50 border-2 border-amber-300/80 rounded-xl p-4 text-xs text-amber-950 space-y-3">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-900 text-sm">
                    Validasi Pra-Ekspor: Berkas Belum Ditinjau oleh Manusia!
                  </h4>
                  <p className="mt-1 text-amber-800 leading-relaxed">
                    Sistem mendeteksi bahwa berkas <strong>{casePackage.matter.refNumber}</strong> belum ditandai &quot;Ditinjau oleh Manusia&quot;. Prinsip akuntabilitas mensyaratkan setiap ekspor resmi ditelaah terlebih dahulu oleh penyidik/analis untuk memverifikasi asas praduga tak bersalah.
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-amber-200">
                {onGoToReviewTab && (
                  <button
                    onClick={() => {
                      onClose();
                      onGoToReviewTab();
                    }}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-lg transition cursor-pointer shadow-xs"
                  >
                    Buka Tab Review & Kunci Telaah Sekarang →
                  </button>
                )}

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-amber-950">
                  <input
                    type="checkbox"
                    checked={unreviewedAcknowledged}
                    onChange={(e) => setUnreviewedAcknowledged(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 border-amber-400 focus:ring-amber-500 cursor-pointer"
                  />
                  <span>
                    Saya memahami berkas ini berstatus DRAF MENTAH dan akan diekspor dengan tanda watermark DRAF.
                  </span>
                </label>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-950 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-emerald-900">
                  Verifikasi Manusia Lengkap ({casePackage.review.reviewerName || 'Analis Perkara'})
                </span>
                <p className="mt-0.5 text-emerald-800">
                  Berkas telah memenuhi syarat penelaahan formil. Ekspor akan memuat header status telaah terverifikasi.
                </p>
              </div>
            </div>
          )}

          {/* SENSITIVE DATA MASKING TOGGLE */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                {isMaskingEnabled ? (
                  <EyeOff className="w-4 h-4 text-amber-600" />
                ) : (
                  <Eye className="w-4 h-4 text-slate-500" />
                )}
                <span>Mode Penyamaran Data Sensitif (UU PDP)</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isMaskingEnabled}
                  onChange={(e) => setIsMaskingEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Jika diaktifkan, nama pihak disamarkan (misal: <em>TERLAPOR-1</em>, <em>KORBAN-1</em>), NIK dan nomor rekening disensor sebagian, dan alamat disamarkan secara lokal sebelum diekspor atau dicetak.
            </p>
          </div>

          {/* TAB 1: CETAK PDF */}
          {activeTab === 'print' && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-700 space-y-2.5">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Kepatuhan Watermark Ganda Pada Lembar Cetak:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2 bg-white rounded border border-slate-200 text-rose-800 font-bold">
                    Watermark 1: DRAF — PERLU VERIFIKASI MANUSIA
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200 text-amber-800 font-bold">
                    Watermark 2: PRATINJAU — BUKAN PERKARA NYATA
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Lembar cetak browser akan secara otomatis diformat ke standar A4/Folio portrait dengan penafian hukum KUHAP lengkap dan daftar alat bukti sah.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={onClose}
                  className="px-3 py-2 text-xs text-slate-600 hover:text-slate-800 font-medium rounded-lg"
                >
                  Tutup
                </button>
                <button
                  onClick={handleTriggerPrint}
                  disabled={!canProceedWithExport}
                  className={`px-4 py-2 font-bold text-xs rounded-lg transition flex items-center gap-2 shadow-xs ${
                    canProceedWithExport
                      ? 'bg-slate-900 hover:bg-slate-800 text-amber-300 cursor-pointer'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Printer className="w-4 h-4" />
                  <span>Buka Dialog Cetak / Simpan PDF</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: EKSPOR JSON (ENVELOPE STANDAR) */}
          {activeTab === 'exportJson' && (
            <div className="space-y-4">
              {/* Header preview card */}
              <div className="bg-slate-900 text-slate-100 rounded-xl p-4 text-xs space-y-2 font-mono">
                <div className="text-[11px] text-amber-400 font-bold flex items-center justify-between">
                  <span>METADATA HEADER ENVELOPE (Skema v{currentEnvelope.header.schemaVersion})</span>
                  <span>ID: {currentEnvelope.header.snapshotId}</span>
                </div>
                <div className="text-[11px] text-slate-300 space-y-1">
                  <div>Perkara: <strong>{currentEnvelope.header.caseContext.refNumber}</strong> ({currentEnvelope.header.caseContext.stage})</div>
                  <div>Waktu Ekspor: {currentEnvelope.header.exportedAtFormatted}</div>
                  <div>Penelaah: {currentEnvelope.header.reviewStatus.reviewerName} ({currentEnvelope.header.reviewStatus.reviewedByHuman ? 'VERIFIED' : 'UNREVIEWED DRAFT'})</div>
                  <div>Keterbatasan: Non-Konklusif, Local Storage, Prompt Isolated</div>
                  <div>Item Belum Lengkap Terdata: {currentEnvelope.header.unresolvedOrMissingData.length} catatan</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  onClick={handleDownloadStandardEnvelopeJson}
                  disabled={!canProceedWithExport}
                  className={`p-4 rounded-xl border text-left transition group ${
                    canProceedWithExport
                      ? 'border-slate-200 hover:border-amber-500 bg-slate-50 hover:bg-amber-50/40 cursor-pointer'
                      : 'border-slate-200 bg-slate-100 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <FileJson className="w-6 h-6 text-amber-600 mb-2 group-hover:scale-110 transition" />
                  <div className="text-xs font-bold text-slate-900">
                    Unduh Paket Standar (Envelope)
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Memuat header skema, konteks hukum, dan data lengkap berkas
                  </div>
                </button>

                <button
                  onClick={handleDownloadAllCasesJson}
                  disabled={!canProceedWithExport}
                  className={`p-4 rounded-xl border text-left transition group ${
                    canProceedWithExport
                      ? 'border-slate-200 hover:border-amber-500 bg-slate-50 hover:bg-amber-50/40 cursor-pointer'
                      : 'border-slate-200 bg-slate-100 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <Download className="w-6 h-6 text-slate-700 mb-2 group-hover:scale-110 transition" />
                  <div className="text-xs font-bold text-slate-900">
                    Ekspor Seluruh Perkara ({allCases.length})
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Seluruh basis data perkara tersimpan di browser
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: IMPOR JSON */}
          {activeTab === 'importJson' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Unggah file JSON cadangan berkas perkara sebelumnya. Sistem mendukung file paket standar (CaseExportEnvelope) maupun paket perkara langsung.
              </p>

              <label className="border-2 border-dashed border-slate-300 hover:border-amber-500 bg-slate-50 hover:bg-amber-50/30 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition">
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-xs font-bold text-slate-800">
                  Pilih File JSON Berkas Perkara
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5">
                  Format .json valid (Skema v2.2.0 atau sebelumnya)
                </span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {importStatus && (
                <div
                  className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
                    importStatus.success
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border border-rose-200 text-rose-900'
                  }`}
                >
                  {importStatus.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-semibold">{importStatus.message}</div>
                    {importStatus.envelopeInfo && (
                      <div className="text-[11px] text-emerald-700 mt-0.5 font-mono">
                        {importStatus.envelopeInfo}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
