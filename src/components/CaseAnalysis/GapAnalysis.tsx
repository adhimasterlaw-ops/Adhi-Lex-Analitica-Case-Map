import React, { useMemo } from 'react';
import { CaseFullPackage } from '../../types/case';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  HelpCircle,
  FileQuestion,
  Users,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface Props {
  casePackage: CaseFullPackage;
  onNavigateToTab?: (tab: string) => void;
}

interface DataGapItem {
  id: string;
  category: 'Unsur Delik' | 'Alat Bukti' | 'Identifikasi Pihak' | 'Kronologi Waktu' | 'Fakta & Sumber';
  severity: 'Tinggi (Krusial)' | 'Sedang' | 'Rendah';
  title: string;
  description: string;
  recommendation: string;
}

export const GapAnalysis: React.FC<Props> = ({ casePackage }) => {
  const { matter, parties, facts, events, evidences, charges, elements, procedureChecks } =
    casePackage;

  // Calculate completeness score
  const completeness = useMemo(() => {
    let score = 0;
    const maxScore = 100;

    // 1. Data dasar (15 pts)
    if (matter.title && matter.refNumber && matter.locusDelicti && matter.incidentDate) score += 15;
    else if (matter.title) score += 5;

    // 2. Pihak (15 pts)
    const hasTersangka = parties.some((p) => p.role.includes('Tersangka') || p.role.includes('Terlapor'));
    const hasKorbanOrPelapor = parties.some((p) => p.role.includes('Korban') || p.role.includes('Pelapor'));
    if (hasTersangka && hasKorbanOrPelapor) score += 15;
    else if (parties.length > 0) score += 8;

    // 3. Fakta & Sumber (20 pts)
    const verifiedFacts = facts.filter((f) => f.type === 'Fakta Terverifikasi');
    if (verifiedFacts.length >= 2) score += 20;
    else if (facts.length > 0) score += 10;

    // 4. Alat Bukti (20 pts) - Minimal 2 alat bukti sah sesuai KUHAP 184
    if (evidences.length >= 2) score += 20;
    else if (evidences.length === 1) score += 10;

    // 5. Unsur Delik terhubung bukti (20 pts)
    const elementsWithEvidence = elements.filter((e) => e.linkedEvidenceIds.length > 0);
    if (elements.length > 0 && elementsWithEvidence.length === elements.length) score += 20;
    else if (elementsWithEvidence.length > 0) score += 10;

    // 6. Review Manusia (10 pts)
    if (matter.reviewedByHuman) score += 10;

    return Math.min(maxScore, score);
  }, [matter, parties, facts, evidences, elements]);

  // Compute gaps list
  const gaps = useMemo(() => {
    const list: DataGapItem[] = [];

    // Gaps in legal elements
    elements.forEach((elem) => {
      if (elem.linkedEvidenceIds.length === 0) {
        list.push({
          id: `gap-elem-${elem.id}`,
          category: 'Unsur Delik',
          severity: 'Tinggi (Krusial)',
          title: `Unsur Belum Memiliki Alat Bukti: ${elem.elementCode} (${elem.title})`,
          description: `Rumusan delik belum ditautkan dengan surat, saksi, atau bukti digital sah. Tanpa bukti penguat, unsur ini berisiko gugur saat pra-peradilan atau eksepsi.`,
          recommendation: `Cari dan tautkan minimal 1 alat bukti sah yang bersesuaian.`
        });
      }

      if (elem.status === 'Perlu Bukti Tambahan') {
        list.push({
          id: `gap-elem-status-${elem.id}`,
          category: 'Unsur Delik',
          severity: 'Sedang',
          title: `Pembuktian Belum Lengkap: ${elem.elementCode}`,
          description: elem.reviewNotes || `Unsur ditandai memerlukan alat bukti komplementer.`,
          recommendation: `Lakukan pemeriksaan tambahan pada saksi ahli atau uji laboratoris.`
        });
      }
    });

    // Gaps in parties identification
    parties.forEach((p) => {
      if (!p.idSource || p.idSource.trim() === '') {
        list.push({
          id: `gap-party-${p.id}`,
          category: 'Identifikasi Pihak',
          severity: 'Sedang',
          title: `Pihak Belum Memiliki Sumber Identifikasi Sah: ${p.name}`,
          description: `Identitas resmi (KTP / Paspor / Akta Notaris) belum diverifikasi ke Disdukcapil atau database resmi.`,
          recommendation: `Mintakan lampiran salinan identitas resmi terlegalisir.`
        });
      }
    });

    // Gaps in chronology (disputed events)
    events.forEach((evt) => {
      if (evt.timeCertainty === 'Diperselisihkan') {
        list.push({
          id: `gap-event-${evt.id}`,
          category: 'Kronologi Waktu',
          severity: 'Tinggi (Krusial)',
          title: `Alibi / Tempus Diperselisihkan: ${evt.title}`,
          description: `Peristiwa ini memiliki pertentangan waktu atau tempat antara keterangan pelapor dan terlapor (${evt.startTime}).`,
          recommendation: `Lakukan gelar perkara konfrontasi dan periksa bukti pendukung independen (CCTV / Log Provider).`
        });
      }
    });

    // Facts without source or pending review
    facts.forEach((f) => {
      if (f.reviewStatus === 'Belum Ditinjau') {
        list.push({
          id: `gap-fact-${f.id}`,
          category: 'Fakta & Sumber',
          severity: 'Rendah',
          title: `Klaim Belum Ditelaah Manusia: ${f.subject}`,
          description: `Klaim "${f.rawClaimText.substring(0, 50)}..." masih berstatus draf mentah.`,
          recommendation: `Buka tab Fakta/Klaim dan ubah status verifikasi setelah mencocokkan dokumen BAP.`
        });
      }
    });

    // Minimum 2 tools of evidence check
    if (evidences.length < 2) {
      list.push({
        id: 'gap-ev-count',
        category: 'Alat Bukti',
        severity: 'Tinggi (Krusial)',
        title: 'Kecukupan Minimal Dua Alat Bukti Sah (Pasal 183 & 184 KUHAP)',
        description: `Saat ini perkara baru memiliki ${evidences.length} alat bukti terdaftar. KUHAP mensyaratkan sekurang-kurangnya dua alat bukti sah yang saling bersesuaian.`,
        recommendation: `Daftarkan saksi tambahan, dokumen surat, atau keterangan ahli.`
      });
    }

    // Procedural checks marked as 'tidak didukung' or mandatory 'belum dinilai'
    (procedureChecks || []).forEach((pc) => {
      if (pc.isMandatory && pc.status === 'tidak didukung') {
        list.push({
          id: `gap-proc-${pc.id}`,
          category: 'Unsur Delik',
          severity: 'Tinggi (Krusial)',
          title: `Kepatuhan Prosedur Tidak Didukung Dokumen: ${pc.label}`,
          description: `Instrumen ${pc.code} ditandai tidak didukung dokumen sah. Alasan: ${pc.alasan}`,
          recommendation: `Lengkapi dokumen berita acara atau izin pengadilan terkait.`
        });
      } else if (pc.isMandatory && pc.status === 'diperselisihkan') {
        list.push({
          id: `gap-proc-dispute-${pc.id}`,
          category: 'Kronologi Waktu',
          severity: 'Sedang',
          title: `Kepatuhan Prosedur Diperselisihkan: ${pc.label}`,
          description: `Terdapat perselisihan formal: ${pc.alasan}`,
          recommendation: `Lakukan gelar perkara khusus atau uji materiil dokumen.`
        });
      }
    });

    return list;
  }, [elements, parties, events, facts, evidences, procedureChecks]);

  return (
    <div className="space-y-6">
      {/* Completeness Score Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Tingkat Kelengkapan Berkas (Completeness Index)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Estimasi objektivitas kelengkapan berkas perkara berdasarkan pemenuhan komponen esensial.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`text-2xl font-bold font-mono ${
                completeness >= 80
                  ? 'text-emerald-700'
                  : completeness >= 50
                  ? 'text-amber-700'
                  : 'text-rose-700'
              }`}
            >
              {completeness}%
            </span>
            <span className="text-xs text-slate-400">/ 100% Target Berkas</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2.5 my-4 overflow-hidden">
          <div
            className={`h-2.5 rounded-full transition-all duration-500 ${
              completeness >= 80
                ? 'bg-emerald-600'
                : completeness >= 50
                ? 'bg-amber-600'
                : 'bg-rose-600'
            }`}
            style={{ width: `${completeness}%` }}
          />
        </div>

        {/* Checklist Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            {evidences.length >= 2 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <Clock className="w-4 h-4 text-amber-500 shrink-0" />
            )}
            <span>Min. 2 Alat Bukti ({evidences.length}/2)</span>
          </div>

          <div className="flex items-center gap-2 text-slate-700">
            {parties.some((p) => p.role.includes('Tersangka') || p.role.includes('Terlapor')) ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
            )}
            <span>Subjek Terlapor Terdata</span>
          </div>

          <div className="flex items-center gap-2 text-slate-700">
            {elements.length > 0 && elements.every((e) => e.linkedEvidenceIds.length > 0) ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <Clock className="w-4 h-4 text-amber-500 shrink-0" />
            )}
            <span>Bukti Tertaut Tiap Unsur</span>
          </div>

          <div className="flex items-center gap-2 text-slate-700">
            {matter.reviewedByHuman ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <Clock className="w-4 h-4 text-amber-500 shrink-0" />
            )}
            <span>Ditinjau oleh Manusia</span>
          </div>
        </div>
      </div>

      {/* Actionable Gaps List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileQuestion className="w-4 h-4 text-rose-600" />
            <span>Daftar Celah Data & Titik Lemah Pembuktian ({gaps.length})</span>
          </h3>
          <span className="text-xs text-slate-500">
            Diurutkan berdasarkan tingkat urgensi yuridis
          </span>
        </div>

        {gaps.length === 0 ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center text-emerald-900">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <h4 className="text-sm font-bold">Tidak Ditemukan Celah Data Kritis</h4>
            <p className="text-xs text-emerald-700 mt-1 max-w-md mx-auto">
              Seluruh unsur delik telah ditautkan alat bukti, identitas terverifikasi, dan kronologi waktu terkonfirmasi.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {gaps.map((gap) => (
              <div
                key={gap.id}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-slate-300 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                        gap.severity.includes('Tinggi')
                          ? 'bg-rose-100 text-rose-800'
                          : gap.severity.includes('Sedang')
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {gap.severity}
                    </span>
                    <span className="font-semibold text-slate-600">[{gap.category}]</span>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-slate-900 mb-1">{gap.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">{gap.description}</p>

                <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 text-xs text-slate-700 flex items-start gap-2">
                  <span className="font-bold text-amber-800 shrink-0">Rekomendasi Penyidik:</span>
                  <span>{gap.recommendation}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
