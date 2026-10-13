import React, { useState, useEffect } from 'react';
import {
  CaseFullPackage,
  CaseSnapshot,
  Party,
  FactClaim,
  EvidenceItem,
  LegalElement
} from '../../types/case';
import {
  getCaseSnapshots,
  saveCaseSnapshot,
  deleteCaseSnapshot
} from '../../lib/storage';
import {
  History,
  GitCompare,
  Plus,
  Trash2,
  Clock,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  FileText,
  User,
  ShieldAlert,
  Save,
  Layers,
  ChevronRight
} from 'lucide-react';

interface Props {
  casePackage: CaseFullPackage;
  onRestoreSnapshot?: (pkg: CaseFullPackage) => void;
}

export const VersionDiffViewer: React.FC<Props> = ({ casePackage, onRestoreSnapshot }) => {
  const [snapshots, setSnapshots] = useState<CaseSnapshot[]>(() =>
    getCaseSnapshots(casePackage.matter.id)
  );

  // New snapshot creation form state
  const [isCreatingSnapshot, setIsCreatingSnapshot] = useState(false);
  const [newSnapshotLabel, setNewSnapshotLabel] = useState('');
  const [newSnapshotNotes, setNewSnapshotNotes] = useState('');
  const [newSnapshotCreator, setNewSnapshotCreator] = useState(
    casePackage.review.reviewerName || 'Analis Perkara'
  );

  // Comparison selection
  // Option 'current' represents current live working data
  const [selectedSnapshotAId, setSelectedSnapshotAId] = useState<string>('current');
  const [selectedSnapshotBId, setSelectedSnapshotBId] = useState<string>(() =>
    snapshots.length > 0 ? snapshots[0].id : 'current'
  );

  // Refresh snapshots on matter change
  useEffect(() => {
    const list = getCaseSnapshots(casePackage.matter.id);
    setSnapshots(list);
    if (list.length > 0 && selectedSnapshotBId === 'current') {
      setSelectedSnapshotBId(list[0].id);
    }
  }, [casePackage.matter.id]);

  const handleCreateSnapshot = () => {
    if (!newSnapshotLabel.trim()) {
      alert('Mohon isi label/nama snapshot versi.');
      return;
    }

    const created = saveCaseSnapshot(
      casePackage.matter.id,
      newSnapshotLabel.trim(),
      newSnapshotNotes.trim(),
      newSnapshotCreator.trim(),
      casePackage
    );

    const updated = getCaseSnapshots(casePackage.matter.id);
    setSnapshots(updated);
    setSelectedSnapshotBId(created.id);
    setIsCreatingSnapshot(false);
    setNewSnapshotLabel('');
    setNewSnapshotNotes('');
  };

  const handleDeleteSnapshot = (id: string) => {
    if (confirm('Hapus snapshot riwayat versi ini?')) {
      const remaining = deleteCaseSnapshot(casePackage.matter.id, id);
      setSnapshots(remaining);
      if (selectedSnapshotAId === id) setSelectedSnapshotAId('current');
      if (selectedSnapshotBId === id) setSelectedSnapshotBId(remaining[0]?.id || 'current');
    }
  };

  // Helper to resolve snapshot object from ID
  const resolvePackage = (id: string): CaseFullPackage => {
    if (id === 'current') return casePackage;
    const snap = snapshots.find((s) => s.id === id);
    return snap ? snap.data : casePackage;
  };

  const pkgA = resolvePackage(selectedSnapshotAId);
  const pkgB = resolvePackage(selectedSnapshotBId);

  // Compute diff metrics between A and B
  const diffGeneral = {
    stageChanged: pkgA.matter.stage !== pkgB.matter.stage,
    statusChanged: pkgA.matter.status !== pkgB.matter.status,
    titleChanged: pkgA.matter.title !== pkgB.matter.title,
    leadInvestigatorChanged: pkgA.matter.leadInvestigator !== pkgB.matter.leadInvestigator,
    jurisdictionChanged: pkgA.matter.jurisdiction !== pkgB.matter.jurisdiction,
    reviewedChanged: pkgA.matter.reviewedByHuman !== pkgB.matter.reviewedByHuman
  };

  const partiesDiff = {
    countA: pkgA.parties.length,
    countB: pkgB.parties.length,
    onlyInA: pkgA.parties.filter((p) => !pkgB.parties.some((x) => x.name === p.name)),
    onlyInB: pkgB.parties.filter((p) => !pkgA.parties.some((x) => x.name === p.name))
  };

  const factsDiff = {
    countA: pkgA.facts.length,
    countB: pkgB.facts.length,
    disputedInA: pkgA.facts.filter((f) => f.reviewStatus === 'Diperselisihkan').length,
    disputedInB: pkgB.facts.filter((f) => f.reviewStatus === 'Diperselisihkan').length
  };

  const evidenceDiff = {
    countA: pkgA.evidences.length,
    countB: pkgB.evidences.length,
    onlyInA: pkgA.evidences.filter((e) => !pkgB.evidences.some((x) => x.label === e.label)),
    onlyInB: pkgB.evidences.filter((e) => !pkgA.evidences.some((x) => x.label === e.label))
  };

  const procedureDiff = {
    supportedInA: pkgA.procedureChecks.filter((p) => p.status === 'didukung dokumen').length,
    supportedInB: pkgB.procedureChecks.filter((p) => p.status === 'didukung dokumen').length,
    disputedInA: pkgA.procedureChecks.filter((p) => p.status === 'diperselisihkan').length,
    disputedInB: pkgB.procedureChecks.filter((p) => p.status === 'diperselisihkan').length,
    unassessedInA: pkgA.procedureChecks.filter((p) => p.status === 'belum dinilai').length,
    unassessedInB: pkgB.procedureChecks.filter((p) => p.status === 'belum dinilai').length
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <GitCompare className="w-5 h-5 text-amber-600" />
            <span>Snapshot Riwayat & Komparasi Antar Versi (Diff)</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Simpan titik waktu berkas (snapshot lokal) dan bandingkan evolusi bukti, pihak, atau kepatuhan prosedur secara berdampingan.
          </p>
        </div>

        <button
          onClick={() => setIsCreatingSnapshot(!isCreatingSnapshot)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold text-xs rounded-lg transition cursor-pointer self-start md:self-auto shrink-0 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>{isCreatingSnapshot ? 'Batal Buat Snapshot' : 'Buat Snapshot Baru'}</span>
        </button>
      </div>

      {/* Form Pembuatan Snapshot Baru */}
      {isCreatingSnapshot && (
        <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-5 shadow-xs space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <Save className="w-4 h-4 text-amber-700" />
            <span>Kunci Titik Waktu Berkas sebagai Snapshot Lokal</span>
          </div>
          <p className="text-xs text-amber-800">
            Snapshot akan menyimpan seluruh kondisi data berkas saat ini ke dalam Web Storage lokal untuk perbandingan di masa mendatang.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Label Snapshot Versi <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={newSnapshotLabel}
                onChange={(e) => setNewSnapshotLabel(e.target.value)}
                placeholder="Contoh: Versi 1.1 - Pra-Gelar Perkara Khusus"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pembuat Snapshot
              </label>
              <input
                type="text"
                value={newSnapshotCreator}
                onChange={(e) => setNewSnapshotCreator(e.target.value)}
                placeholder="Nama Analis / Penyidik"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Catatan Alasan Snapshot
              </label>
              <input
                type="text"
                value={newSnapshotNotes}
                onChange={(e) => setNewSnapshotNotes(e.target.value)}
                placeholder="Misal: Penambahan alat bukti CCTV dan BAP Ahli"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsCreatingSnapshot(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 font-medium"
            >
              Batal
            </button>
            <button
              onClick={handleCreateSnapshot}
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold rounded-lg cursor-pointer"
            >
              Simpan Snapshot Ini
            </button>
          </div>
        </div>
      )}

      {/* Snapshot Selector Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
          Pilih 2 Versi untuk Dibandingkan:
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sisi Kiri (Versi A) */}
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">Basis Acuan (Sisi A):</span>
              <span className="text-[11px] text-slate-500 font-mono">
                {selectedSnapshotAId === 'current' ? 'Data Langsung Aktif' : 'Snapshot Tersimpan'}
              </span>
            </div>
            <select
              aria-label="Pilih Versi Basis Acuan (Sisi A)"
              value={selectedSnapshotAId}
              onChange={(e) => setSelectedSnapshotAId(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white font-medium"
            >
              <option value="current">
                [DATA AKTIF SAAT INI] (Versi {casePackage.matter.versionNumber}.0 - Live Workspace)
              </option>
              {snapshots.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.snapshotLabel} ({new Date(s.createdAt).toLocaleDateString('id-ID')} oleh{' '}
                  {s.creatorName})
                </option>
              ))}
            </select>
          </div>

          {/* Sisi Kanan (Versi B) */}
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">Pembanding (Sisi B):</span>
              <span className="text-[11px] text-slate-500 font-mono">
                {selectedSnapshotBId === 'current' ? 'Data Langsung Aktif' : 'Snapshot Tersimpan'}
              </span>
            </div>
            <select
              aria-label="Pilih Versi Pembanding (Sisi B)"
              value={selectedSnapshotBId}
              onChange={(e) => setSelectedSnapshotBId(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white font-medium"
            >
              <option value="current">
                [DATA AKTIF SAAT INI] (Versi {casePackage.matter.versionNumber}.0 - Live Workspace)
              </option>
              {snapshots.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.snapshotLabel} ({new Date(s.createdAt).toLocaleDateString('id-ID')} oleh{' '}
                  {s.creatorName})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Komparasi Berdampingan (Side-by-side Diff Table) */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <GitCompare className="w-4 h-4 text-amber-400" />
            <span>Tabel Matriks Perbedaan (Diff Summary)</span>
          </div>
          <div className="text-[11px] text-slate-300">
            Perbandingan Antara: <strong>{selectedSnapshotAId === 'current' ? 'Data Aktif' : 'Versi A'}</strong> vs{' '}
            <strong>{selectedSnapshotBId === 'current' ? 'Data Aktif' : 'Versi B'}</strong>
          </div>
        </div>

        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <th className="p-3 w-1/4">Parameter / Modul</th>
              <th className="p-3 w-3/8 border-l border-slate-200">
                Sisi A: {selectedSnapshotAId === 'current' ? 'Data Aktif' : 'Snapshot A'}
              </th>
              <th className="p-3 w-3/8 border-l border-slate-200">
                Sisi B: {selectedSnapshotBId === 'current' ? 'Data Aktif' : 'Snapshot B'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* 1. Tahap & Status Perkara */}
            <tr className={diffGeneral.stageChanged || diffGeneral.statusChanged ? 'bg-amber-50/40' : ''}>
              <td className="p-3 font-semibold text-slate-800">
                Tahap & Status Penanganan
                {(diffGeneral.stageChanged || diffGeneral.statusChanged) && (
                  <span className="block text-[10px] text-amber-700 font-bold uppercase mt-0.5">
                    * Berubah
                  </span>
                )}
              </td>
              <td className="p-3 border-l border-slate-200">
                <span className="font-bold text-slate-900">{pkgA.matter.stage}</span> ({pkgA.matter.status})
              </td>
              <td className="p-3 border-l border-slate-200">
                <span className="font-bold text-slate-900">{pkgB.matter.stage}</span> ({pkgB.matter.status})
              </td>
            </tr>

            {/* 2. Status Review Manusia */}
            <tr className={diffGeneral.reviewedChanged ? 'bg-amber-50/40' : ''}>
              <td className="p-3 font-semibold text-slate-800">
                Verifikasi Ditinjau Manusia
                {diffGeneral.reviewedChanged && (
                  <span className="block text-[10px] text-amber-700 font-bold uppercase mt-0.5">
                    * Berubah
                  </span>
                )}
              </td>
              <td className="p-3 border-l border-slate-200">
                {pkgA.matter.reviewedByHuman ? (
                  <span className="text-emerald-700 font-bold">✓ Telah Ditinjau</span>
                ) : (
                  <span className="text-amber-700 font-bold">✗ Belum Ditinjau</span>
                )}
              </td>
              <td className="p-3 border-l border-slate-200">
                {pkgB.matter.reviewedByHuman ? (
                  <span className="text-emerald-700 font-bold">✓ Telah Ditinjau</span>
                ) : (
                  <span className="text-amber-700 font-bold">✗ Belum Ditinjau</span>
                )}
              </td>
            </tr>

            {/* 3. Subjek Hukum / Pihak */}
            <tr className={partiesDiff.countA !== partiesDiff.countB ? 'bg-amber-50/40' : ''}>
              <td className="p-3 font-semibold text-slate-800">
                Subjek Hukum / Pihak
                {partiesDiff.countA !== partiesDiff.countB && (
                  <span className="block text-[10px] text-amber-700 font-bold uppercase mt-0.5">
                    * Selisih {Math.abs(partiesDiff.countA - partiesDiff.countB)} Pihak
                  </span>
                )}
              </td>
              <td className="p-3 border-l border-slate-200">
                <div className="font-bold text-slate-900">{partiesDiff.countA} Pihak terdaftar</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {pkgA.parties.map((p) => p.name).join(', ')}
                </div>
              </td>
              <td className="p-3 border-l border-slate-200">
                <div className="font-bold text-slate-900">{partiesDiff.countB} Pihak terdaftar</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {pkgB.parties.map((p) => p.name).join(', ')}
                </div>
              </td>
            </tr>

            {/* 4. Fakta & Klaim */}
            <tr className={factsDiff.countA !== factsDiff.countB ? 'bg-amber-50/40' : ''}>
              <td className="p-3 font-semibold text-slate-800">
                Fakta & Klaim Terstruktur
              </td>
              <td className="p-3 border-l border-slate-200">
                <div>Total: <strong>{factsDiff.countA}</strong> fakta/klaim</div>
                <div className="text-[11px] text-amber-700">
                  Diperselisihkan: {factsDiff.disputedInA} item
                </div>
              </td>
              <td className="p-3 border-l border-slate-200">
                <div>Total: <strong>{factsDiff.countB}</strong> fakta/klaim</div>
                <div className="text-[11px] text-amber-700">
                  Diperselisihkan: {factsDiff.disputedInB} item
                </div>
              </td>
            </tr>

            {/* 5. Alat Bukti Fisik & Digital */}
            <tr className={evidenceDiff.countA !== evidenceDiff.countB ? 'bg-amber-50/40' : ''}>
              <td className="p-3 font-semibold text-slate-800">
                Katalog Alat Bukti Sah
                {evidenceDiff.countA !== evidenceDiff.countB && (
                  <span className="block text-[10px] text-amber-700 font-bold uppercase mt-0.5">
                    * Selisih {Math.abs(evidenceDiff.countA - evidenceDiff.countB)} Bukti
                  </span>
                )}
              </td>
              <td className="p-3 border-l border-slate-200">
                <div className="font-bold">{evidenceDiff.countA} Barang Bukti</div>
                {evidenceDiff.onlyInA.length > 0 && (
                  <div className="text-[10px] text-slate-500 mt-1">
                    Hanya ada di A: {evidenceDiff.onlyInA.map((e) => e.label).join(', ')}
                  </div>
                )}
              </td>
              <td className="p-3 border-l border-slate-200">
                <div className="font-bold">{evidenceDiff.countB} Barang Bukti</div>
                {evidenceDiff.onlyInB.length > 0 && (
                  <div className="text-[10px] text-slate-500 mt-1">
                    Hanya ada di B: {evidenceDiff.onlyInB.map((e) => e.label).join(', ')}
                  </div>
                )}
              </td>
            </tr>

            {/* 6. Kepatuhan Mindik (KUHAP) */}
            <tr>
              <td className="p-3 font-semibold text-slate-800">
                Kepatuhan Prosedur Mindik
              </td>
              <td className="p-3 border-l border-slate-200">
                <div className="space-y-0.5 text-[11px]">
                  <div>Didukung Dokumen: <strong className="text-emerald-700">{procedureDiff.supportedInA}</strong></div>
                  <div>Diperselisihkan: <strong className="text-amber-700">{procedureDiff.disputedInA}</strong></div>
                  <div>Belum Dinilai: <strong className="text-slate-600">{procedureDiff.unassessedInA}</strong></div>
                </div>
              </td>
              <td className="p-3 border-l border-slate-200">
                <div className="space-y-0.5 text-[11px]">
                  <div>Didukung Dokumen: <strong className="text-emerald-700">{procedureDiff.supportedInB}</strong></div>
                  <div>Diperselisihkan: <strong className="text-amber-700">{procedureDiff.disputedInB}</strong></div>
                  <div>Belum Dinilai: <strong className="text-slate-600">{procedureDiff.unassessedInB}</strong></div>
                </div>
              </td>
            </tr>

            {/* 7. Catatan Pendapat Penelaah */}
            <tr>
              <td className="p-3 font-semibold text-slate-800 align-top">
                Catatan Pendapat Telaah
              </td>
              <td className="p-3 border-l border-slate-200 align-top text-[11px] text-slate-600 italic">
                {pkgA.review.summaryOpinion || '(Belum ada catatan telaah)'}
              </td>
              <td className="p-3 border-l border-slate-200 align-top text-[11px] text-slate-600 italic">
                {pkgB.review.summaryOpinion || '(Belum ada catatan telaah)'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Snapshot List & Restore Action */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-600" />
            <span>Daftar Snapshot Tersimpan Pada Perkara Ini ({snapshots.length})</span>
          </div>
        </h3>

        {snapshots.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-3 text-center">
            Belum ada snapshot yang dikunci untuk perkara ini. Klik &quot;Buat Snapshot Baru&quot; di atas untuk menyimpan titik riwayat.
          </p>
        ) : (
          <div className="space-y-2">
            {snapshots.map((snap) => (
              <div
                key={snap.id}
                className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{snap.snapshotLabel}</span>
                    <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-700 font-mono">
                      v{snap.versionNumber}.0
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
                    <span>Oleh: <strong>{snap.creatorName}</strong></span>
                    <span aria-hidden="true">·</span>
                    <span>Waktu: {new Date(snap.createdAt).toLocaleString('id-ID')}</span>
                    {snap.snapshotNotes && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="italic">&ldquo;{snap.snapshotNotes}&rdquo;</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {onRestoreSnapshot && (
                    <button
                      onClick={() => {
                        if (confirm(`Pulihkan data aktif perkara saat ini ke isi "${snap.snapshotLabel}"?`)) {
                          onRestoreSnapshot(snap.data);
                        }
                      }}
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700 font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                      title="Pulihkan data aktif ke snapshot ini"
                    >
                      <RotateCcw className="w-3 h-3 text-amber-600" />
                      <span>Muat Versi Ini</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteSnapshot(snap.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition cursor-pointer"
                    title="Hapus snapshot riwayat ini"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
