import React, { useState } from 'react';
import { CaseReview, LocalAuditLog, Matter } from '../../types/case';
import { CheckCircle2, Lock, History, AlertTriangle, ShieldCheck, UserCheck, Save } from 'lucide-react';

interface Props {
  matter: Matter;
  review: CaseReview;
  auditLogs: LocalAuditLog[];
  onUpdateReview: (review: CaseReview) => void;
  onUpdateMatter: (matter: Matter) => void;
  onAddAuditLog: (action: string, details: string) => void;
}

export const TabReview: React.FC<Props> = ({
  matter,
  review,
  auditLogs,
  onUpdateReview,
  onUpdateMatter,
  onAddAuditLog
}) => {
  const [formData, setFormData] = useState<CaseReview>(review);
  const [isSaved, setIsSaved] = useState(false);

  const handleToggleReviewed = (checked: boolean) => {
    const updated: CaseReview = {
      ...formData,
      reviewedByHuman: checked,
      reviewDate: checked ? new Date().toISOString().split('T')[0] : ''
    };
    setFormData(updated);
  };

  const handleSaveReview = () => {
    onUpdateReview(formData);
    onUpdateMatter({
      ...matter,
      reviewedByHuman: formData.reviewedByHuman,
      reviewNotes: formData.summaryOpinion,
      versionNumber: formData.isSnapshotLocked ? matter.versionNumber + 1 : matter.versionNumber
    });

    onAddAuditLog(
      'Pembaruan Telaah Manusia',
      `Status ditinjau: ${formData.reviewedByHuman ? 'YA' : 'TIDAK'} oleh ${formData.reviewerName || 'Analis Anonim'}`
    );

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleLockSnapshot = () => {
    if (!formData.reviewedByHuman) {
      alert('Perkara harus diverifikasi "Ditinjau oleh Manusia" sebelum snapshot dapat dikunci!');
      return;
    }

    const nextVer = matter.versionNumber + 1;
    const label = `Snapshot Versi ${nextVer}.0 - ${new Date().toLocaleDateString('id-ID')}`;
    const updated: CaseReview = {
      ...formData,
      isSnapshotLocked: true,
      snapshotLabel: label
    };
    setFormData(updated);
    onUpdateReview(updated);
    onUpdateMatter({
      ...matter,
      versionNumber: nextVer
    });

    onAddAuditLog(
      'Kunci Snapshot Versi',
      `Snapshot versi ${nextVer}.0 dikunci: "${label}"`
    );

    alert(`Snapshot versi ${nextVer}.0 berhasil dikunci!`);
  };

  return (
    <div className="space-y-6">
      {/* Human-in-the-loop warning banner */}
      <div
        className={`p-4 rounded-xl border flex items-start gap-3 transition ${
          formData.reviewedByHuman
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}
      >
        {formData.reviewedByHuman ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        )}
        <div>
          <h3 className="text-sm font-bold">
            {formData.reviewedByHuman
              ? 'Berkas Telah Ditandai "Ditinjau oleh Manusia"'
              : 'Verifikasi Manusia Diperlukan'}
          </h3>
          <p className="text-xs mt-1 leading-relaxed">
            {formData.reviewedByHuman
              ? 'Berkas perkara ini telah ditelaah secara substantif oleh analis/penyidik yang berwenang. Ekspor resmi dan cetakan PDF dapat memuat cap verifikasi manusia.'
              : 'Seluruh analisis algoritma atau input administratif bersifat draf mentah. Sebelum berkas diekspor atau dipaparkan dalam gelar perkara resmi, seorang analis wajib meninjau kelengkapan dan menandai persetujuan di bawah ini.'}
          </p>
        </div>
      </div>

      {/* Review Form Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-amber-600" />
          <span>Formulir Verifikasi & Catatan Telaah Analis</span>
        </h3>

        {/* Checkbox Ditinjau Manusia */}
        <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-100/70 cursor-pointer transition">
          <input
            type="checkbox"
            checked={formData.reviewedByHuman}
            onChange={(e) => handleToggleReviewed(e.target.checked)}
            className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500 cursor-pointer"
          />
          <span className="text-sm font-semibold text-slate-900">
            Telah Ditinjau oleh Manusia (Penyidik / Peneliti / Analis Hukum)
          </span>
        </label>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Analis / Penelaah
            </label>
            <input
              type="text"
              value={formData.reviewerName}
              onChange={(e) => setFormData({ ...formData, reviewerName: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg text-slate-900 font-medium"
              placeholder="Contoh: Kompol Hendra Wicaksono, S.H."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Jabatan / Peran Penelaah
            </label>
            <input
              type="text"
              value={formData.reviewerRole}
              onChange={(e) => setFormData({ ...formData, reviewerRole: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg text-slate-900"
              placeholder="Kanit Wasidik / Jaksa Pratama"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tanggal Telaah
            </label>
            <input
              type="date"
              value={formData.reviewDate}
              onChange={(e) => setFormData({ ...formData, reviewDate: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg text-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Catatan Pendapat Telaah Sementara (Non-Konklusif)
          </label>
          <textarea
            rows={4}
            value={formData.summaryOpinion}
            onChange={(e) => setFormData({ ...formData, summaryOpinion: e.target.value })}
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 leading-relaxed"
            placeholder="Tuliskan catatan objektivitas berkas, kecukupan alat bukti permulaan, petunjuk yang perlu dikejar, atau potensi kelemahan materiil..."
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <button
            onClick={handleLockSnapshot}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition cursor-pointer"
            title="Kunci versi berkas saat ini sebagai snapshot riwayat"
          >
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>Kunci Snapshot Versi Baru</span>
          </button>

          <button
            onClick={handleSaveReview}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold text-xs rounded-lg transition cursor-pointer shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan Review</span>
          </button>
        </div>

        {isSaved && (
          <div className="text-xs text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 p-2 rounded text-center">
            Perubahan review berhasil disimpan ke penyimpanan lokal!
          </div>
        )}

        {formData.isSnapshotLocked && (
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
            <span className="font-mono text-slate-800">
              {formData.snapshotLabel || `Versi Terkunci ${matter.versionNumber}.0`}
            </span>
            <span className="text-[11px] text-slate-500">Snapshot Aktif</span>
          </div>
        )}
      </div>

      {/* Local Audit Log History */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-3 flex items-center gap-2">
          <History className="w-4 h-4 text-slate-500" />
          <span>Riwayat Log Audit Lokal (Peramban)</span>
        </h3>
        <p className="text-xs text-slate-500 mb-3">
          Catatan kronologis aktivitas perubahan data pada peramban ini. Tidak dikirimkan ke server eksternal.
        </p>

        {auditLogs.length === 0 ? (
          <p className="text-xs text-slate-400 italic">Belum ada aktivitas audit tercatat.</p>
        ) : (
          <div className="space-y-2 max-h-56 overflow-y-auto">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="text-xs p-2 rounded bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800">{log.action}:</span>
                  <span className="text-slate-600">{log.details}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 shrink-0">
                  {log.timestamp}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
