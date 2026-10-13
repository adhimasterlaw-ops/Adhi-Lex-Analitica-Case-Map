import React from 'react';
import { CaseFullPackage } from '../types/case';
import { Scale, BookOpen, CheckSquare } from 'lucide-react';

interface Props {
  casePackage: CaseFullPackage;
}

export const PrintView: React.FC<Props> = ({ casePackage }) => {
  const {
    matter,
    parties,
    events,
    evidences,
    charges,
    elements,
    legalBases,
    procedureChecks,
    review
  } = casePackage;

  const printDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="print-only p-8 text-slate-900 bg-white font-sans text-xs leading-normal">
      {/* Print Watermark */}
      <div className="print-watermark" aria-hidden="true">
        DRAF — PERLU VERIFIKASI MANUSIA<br />
        PRATINJAU — BUKAN PERKARA NYATA
      </div>

      {/* Official Header */}
      <div className="border-b-2 border-slate-900 pb-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Scale className="w-8 h-8 text-slate-800" />
            <div>
              <h1 className="font-serif-heading text-lg font-bold uppercase tracking-wider text-slate-950">
                LEMBAR TELAAH BERKAS PERKARA PIDANA
              </h1>
              <p className="text-[11px] font-semibold text-slate-600">
                Sistem Analisis Objektivitas & Rekonstruksi Pembuktian (Pratinjau Terbatas)
              </p>
            </div>
          </div>

          <div className="text-right font-mono text-[11px] text-slate-600">
            <div>Nomor: <strong>{matter.refNumber}</strong></div>
            <div>Tanggal Cetak: {printDate}</div>
            <div>Skema Header: <strong>v2.2.0-pidana-security</strong></div>
            <div>Snapshot: Versi {matter.versionNumber}.0 ({matter.legalSnapshotDate || '-'})</div>
          </div>
        </div>

        {/* Human Review Status Banner */}
        <div className="mt-3 p-2 bg-slate-100 border border-slate-300 rounded text-[11px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold">STATUS REVIEW MANUSIA:</span>
            {matter.reviewedByHuman ? (
              <span className="text-emerald-800 font-bold uppercase">
                [TELAH DITINJAU OLEH MANUSIA — TERVERIFIKASI]
              </span>
            ) : (
              <span className="text-rose-800 font-bold uppercase">
                [DRAF MENTAH — BELUM DITINJAU MANUSIA — PERLU VERIFIKASI]
              </span>
            )}
          </div>
          {matter.reviewedByHuman && review.reviewerName && (
            <div className="text-slate-700">
              Penelaah: <strong>{review.reviewerName}</strong> ({review.reviewerRole})
            </div>
          )}
        </div>

        {/* Legal Disclaimer Box */}
        <div className="mt-2 p-2 bg-amber-50 border border-amber-300 rounded text-[10px] text-amber-950 space-y-1">
          <div>
            <strong>PENAFIAN HUKUM (DISCLAIMER):</strong> Dokumen ini merupakan hasil simulasi telaah data terstruktur untuk tujuan simulasi analitik (PRATINJAU — BUKAN PERKARA NYATA). Berkas ini bersifat netral dan non-konklusif; tidak menyatakan seseorang bersalah, tidak memprediksi vonis, dan tidak menggantikan Berkas Perkara resmi kepolisian/kejaksaan atau Putusan Pengadilan Republik Indonesia.
          </div>
          <div className="text-[9px] text-amber-900 font-mono">
            <strong>BATASAN KEAMANAN:</strong> Berkas bersumber dari browser Web Storage lokal; bukan repositori resmi negara, bukan audit log server append-only, dan bukan jaminan legal rantai bukti (chain of custody). Seluruh kutipan dokumen adalah DATA PASIF murni.
          </div>
        </div>
      </div>

      {/* BAB I: DATA UMUM & KONTEKS HUKUM */}
      <section className="mb-6 page-break-inside-avoid">
        <h2 className="font-bold text-xs uppercase bg-slate-200 p-1.5 px-2 mb-2 text-slate-900 border-l-4 border-slate-900">
          I. DATA UMUM & KONTEKS PERKARA
        </h2>
        <table className="w-full text-left border-collapse border border-slate-300">
          <tbody>
            <tr className="border-b border-slate-200">
              <td className="p-1.5 font-semibold bg-slate-50 w-1/4 border-r border-slate-200">Judul Perkara</td>
              <td className="p-1.5 font-bold" colSpan={3}>{matter.title}</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="p-1.5 font-semibold bg-slate-50 border-r border-slate-200">Nomor Registrasi</td>
              <td className="p-1.5 font-mono">{matter.refNumber}</td>
              <td className="p-1.5 font-semibold bg-slate-50 border-r border-slate-200">Jenis Perkara</td>
              <td className="p-1.5 font-semibold">{matter.caseType || 'Tindak Pidana Umum'}</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="p-1.5 font-semibold bg-slate-50 border-r border-slate-200">Konteks Yurisdiksi</td>
              <td className="p-1.5">{matter.jurisdiction || 'Pengadilan Negeri Setempat'}</td>
              <td className="p-1.5 font-semibold bg-slate-50 border-r border-slate-200">Tanggal Snapshot Hukum</td>
              <td className="p-1.5 font-mono">{matter.legalSnapshotDate || '-'}</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="p-1.5 font-semibold bg-slate-50 border-r border-slate-200">Tahap Penanganan</td>
              <td className="p-1.5 font-bold">{matter.stage} ({matter.status})</td>
              <td className="p-1.5 font-semibold bg-slate-50 border-r border-slate-200">Penyidik / Analis Utama</td>
              <td className="p-1.5">{matter.leadInvestigator}</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="p-1.5 font-semibold bg-slate-50 border-r border-slate-200">Tempus & Locus Delicti</td>
              <td className="p-1.5">{matter.incidentDate || '-'} ({matter.timeZone})</td>
              <td className="p-1.5 font-semibold bg-slate-50 border-r border-slate-200">Tempat Kejadian</td>
              <td className="p-1.5">{matter.locusDelicti}</td>
            </tr>
            <tr>
              <td className="p-1.5 font-semibold bg-slate-50 border-r border-slate-200 align-top">Posita Awal Perkara</td>
              <td className="p-1.5 text-slate-700" colSpan={3}>{matter.initialSummary}</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* BAB II: MODUL DASAR HUKUM & SUMBER REGULASI */}
      <section className="mb-6 page-break-inside-avoid">
        <h2 className="font-bold text-xs uppercase bg-slate-200 p-1.5 px-2 mb-2 text-slate-900 border-l-4 border-slate-900 flex items-center justify-between">
          <span>II. DASAR HUKUM & SUMBER PERATURAN RESMI ({(legalBases || []).length})</span>
        </h2>
        {(legalBases || []).length === 0 ? (
          <p className="text-slate-500 italic p-2 border border-slate-200">Belum ada dasar hukum terdaftar.</p>
        ) : (
          <table className="w-full text-left border-collapse border border-slate-300">
            <thead className="bg-slate-100 font-semibold border-b border-slate-300">
              <tr>
                <th className="p-1.5 border-r border-slate-300 w-1/4">Peraturan & Pasal</th>
                <th className="p-1.5 border-r border-slate-300 w-1/2">Kutipan Teks Resmi</th>
                <th className="p-1.5">Sumber & Tanggal Akses</th>
              </tr>
            </thead>
            <tbody>
              {legalBases.map((lb) => (
                <tr key={lb.id} className="border-b border-slate-200">
                  <td className="p-1.5 border-r border-slate-200 align-top">
                    <div className="font-bold text-amber-900">{lb.articleClause}</div>
                    <div className="font-semibold text-slate-800">{lb.title}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{lb.numberYear}</div>
                  </td>
                  <td className="p-1.5 border-r border-slate-200 align-top italic text-slate-700">
                    &ldquo;{lb.quote}&rdquo;
                  </td>
                  <td className="p-1.5 align-top text-[10px]">
                    <div className="font-mono break-all text-slate-600">{lb.officialUrl || '-'}</div>
                    <div className="text-slate-500 mt-1">Akses: {lb.accessDate}</div>
                    <div className="font-bold text-emerald-800 mt-0.5">[{lb.verificationStatus}]</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* BAB III: SUBJEK HUKUM & PIHAK-PIHAK */}
      <section className="mb-6 page-break-inside-avoid">
        <h2 className="font-bold text-xs uppercase bg-slate-200 p-1.5 px-2 mb-2 text-slate-900 border-l-4 border-slate-900">
          III. DAFTAR SUBJEK HUKUM & PIHAK TERKAIT ({parties.length})
        </h2>
        <table className="w-full text-left border-collapse border border-slate-300">
          <thead className="bg-slate-100 font-semibold border-b border-slate-300">
            <tr>
              <th className="p-1.5 border-r border-slate-300 w-1/4">Nama & Alias</th>
              <th className="p-1.5 border-r border-slate-300 w-1/5">Peran Acara Pidana</th>
              <th className="p-1.5 border-r border-slate-300 w-1/4">Sumber Identitas Resmi</th>
              <th className="p-1.5">Posisi / Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {parties.map((p) => (
              <tr key={p.id} className="border-b border-slate-200">
                <td className="p-1.5 border-r border-slate-200 font-bold">
                  {p.name} {p.alias && p.alias !== '-' && <span className="font-normal text-slate-500">({p.alias})</span>}
                </td>
                <td className="p-1.5 border-r border-slate-200">{p.role}</td>
                <td className="p-1.5 border-r border-slate-200 font-mono text-[10px]">{p.idSource || 'Belum terdata'}</td>
                <td className="p-1.5 text-slate-600">{p.notes || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* BAB IV: REKONSTRUKSI KRONOLOGI */}
      <section className="mb-6 page-break-inside-avoid">
        <h2 className="font-bold text-xs uppercase bg-slate-200 p-1.5 px-2 mb-2 text-slate-900 border-l-4 border-slate-900">
          IV. REKONSTRUKSI KRONOLOGI PERISTIWA ({events.length})
        </h2>
        <table className="w-full text-left border-collapse border border-slate-300">
          <thead className="bg-slate-100 font-semibold border-b border-slate-300">
            <tr>
              <th className="p-1.5 border-r border-slate-300 w-1/5">Waktu & Kepastian</th>
              <th className="p-1.5 border-r border-slate-300 w-1/4">Peristiwa & Tempat</th>
              <th className="p-1.5 border-r border-slate-300 w-1/3">Deskripsi Kejadian</th>
              <th className="p-1.5">Rujukan Bukti</th>
            </tr>
          </thead>
          <tbody>
            {events.map((evt) => (
              <tr key={evt.id} className="border-b border-slate-200">
                <td className="p-1.5 border-r border-slate-200 align-top">
                  <div className="font-bold font-mono">{evt.startTime}</div>
                  <div className="text-[10px] text-slate-600 font-semibold uppercase">
                    [{evt.timeCertainty}]
                  </div>
                </td>
                <td className="p-1.5 border-r border-slate-200 align-top">
                  <div className="font-bold">{evt.title}</div>
                  <div className="text-slate-500 text-[10px]">{evt.place}</div>
                </td>
                <td className="p-1.5 border-r border-slate-200 align-top text-slate-700">
                  {evt.description}
                </td>
                <td className="p-1.5 align-top font-mono text-[10px] text-slate-600">
                  {evt.sourceRef || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* BAB V: ALAT BUKTI SAH */}
      <section className="mb-6 page-break-inside-avoid">
        <h2 className="font-bold text-xs uppercase bg-slate-200 p-1.5 px-2 mb-2 text-slate-900 border-l-4 border-slate-900">
          V. KATALOG ALAT BUKTI SAH (PASAL 184 KUHAP) ({evidences.length})
        </h2>
        <table className="w-full text-left border-collapse border border-slate-300">
          <thead className="bg-slate-100 font-semibold border-b border-slate-300">
            <tr>
              <th className="p-1.5 border-r border-slate-300 w-1/4">Nama & Jenis Bukti</th>
              <th className="p-1.5 border-r border-slate-300 w-1/3">Deskripsi Materiil</th>
              <th className="p-1.5 border-r border-slate-300 w-1/5">Asal & Tanggal Sita</th>
              <th className="p-1.5">Rantai Pengawasan / Hash</th>
            </tr>
          </thead>
          <tbody>
            {evidences.map((e) => (
              <tr key={e.id} className="border-b border-slate-200">
                <td className="p-1.5 border-r border-slate-200 align-top">
                  <div className="font-bold">{e.label}</div>
                  <div className="text-[10px] text-slate-500 uppercase">{e.type}</div>
                </td>
                <td className="p-1.5 border-r border-slate-200 align-top text-slate-700">
                  {e.description}
                </td>
                <td className="p-1.5 border-r border-slate-200 align-top text-[10px]">
                  <div>Asal: {e.origin}</div>
                  <div>Tgl: {e.acquisitionDate}</div>
                </td>
                <td className="p-1.5 align-top text-[10px] font-mono text-slate-600">
                  <div>Simpan: {e.storageLocation || '-'}</div>
                  {e.manualHash && <div className="break-all">{e.manualHash}</div>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* BAB VI: MATRIKS PEMBUKTIAN 7 DIMENSI (NON-KONKLUSIF) */}
      <section className="mb-6 page-break-inside-avoid">
        <h2 className="font-bold text-xs uppercase bg-slate-200 p-1.5 px-2 mb-2 text-slate-900 border-l-4 border-slate-900">
          VI. MATRIKS PEMBUKTIAN 7 DIMENSI (UNSUR × FAKTA × BUKTI × SUMBER × BANTAHAN × RELEVANSI × STATUS)
        </h2>
        <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
          <thead className="bg-slate-100 font-semibold border-b border-slate-300">
            <tr>
              <th className="p-1 border-r border-slate-300 w-1/6">Unsur & Delik</th>
              <th className="p-1 border-r border-slate-300 w-1/6">Fakta Materiil</th>
              <th className="p-1 border-r border-slate-300 w-1/6">Alat Bukti Sah</th>
              <th className="p-1 border-r border-slate-300 w-1/6">Sumber & Hal</th>
              <th className="p-1 border-r border-slate-300 w-1/6">Bantahan / Sanggahan</th>
              <th className="p-1 border-r border-slate-300 w-1/12">Relevansi</th>
              <th className="p-1 w-1/12">Status Pembuktian</th>
            </tr>
          </thead>
          <tbody>
            {elements.map((elem) => {
              const parent = charges.find((c) => c.id === elem.chargeId);
              const linkedFacts = casePackage.facts.filter((f) => elem.linkedFactIds.includes(f.id));
              const linkedEvidences = casePackage.evidences.filter((e) =>
                elem.linkedEvidenceIds.includes(e.id)
              );
              return (
                <tr key={elem.id} className="border-b border-slate-200">
                  <td className="p-1 border-r border-slate-200 align-top">
                    <div className="font-bold text-amber-900">
                      {parent?.articleName} · {elem.elementCode}
                    </div>
                    <div className="font-semibold text-slate-800">{elem.title}</div>
                    <div className="text-[9px] text-slate-500">{elem.isObjective ? 'Objektif' : 'Subjektif (Mens Rea)'}</div>
                  </td>
                  <td className="p-1 border-r border-slate-200 align-top">
                    {linkedFacts.length === 0 ? (
                      <span className="text-slate-400 italic">Belum ditautkan</span>
                    ) : (
                      linkedFacts.map((f) => (
                        <div key={f.id} className="mb-1">
                          <strong>{f.subject}:</strong> {f.action}
                        </div>
                      ))
                    )}
                  </td>
                  <td className="p-1 border-r border-slate-200 align-top">
                    {linkedEvidences.length === 0 ? (
                      <span className="text-slate-400 italic">Belum ditautkan</span>
                    ) : (
                      linkedEvidences.map((e) => (
                        <div key={e.id} className="mb-1">
                          [{e.type}] <strong>{e.label}</strong>
                        </div>
                      ))
                    )}
                  </td>
                  <td className="p-1 border-r border-slate-200 align-top font-mono text-[9px]">
                    {linkedFacts.map((f) => f.sourceRef).filter(Boolean).join('; ') || '-'}
                  </td>
                  <td className="p-1 border-r border-slate-200 align-top text-rose-800">
                    {elem.status === 'Diperselisihkan / Ada Sanggahan'
                      ? 'Tercatat bantahan alibi/kualifikasi dari pihak terlapor.'
                      : 'Nihil / Tidak ada sanggahan formal.'}
                  </td>
                  <td className="p-1 border-r border-slate-200 align-top font-medium">
                    {elem.relevance || 'Belum Ditentukan'}
                  </td>
                  <td className="p-1 align-top font-bold">
                    {elem.status}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* BAB VII: CHECKLIST PROSEDURAL NETRAL */}
      <section className="mb-6 page-break-inside-avoid">
        <h2 className="font-bold text-xs uppercase bg-slate-200 p-1.5 px-2 mb-2 text-slate-900 border-l-4 border-slate-900">
          VII. CHECKLIST PROSEDURAL NETRAL (HAK, PEMERIKSAAN, PENAHANAN, PEMBUKTIAN)
        </h2>
        <table className="w-full text-left border-collapse border border-slate-300">
          <thead className="bg-slate-100 font-semibold border-b border-slate-300 text-[10px]">
            <tr>
              <th className="p-1 border-r border-slate-300 w-1/4">Tahapan & Dasar</th>
              <th className="p-1 border-r border-slate-300 w-1/6">Status Prosedur</th>
              <th className="p-1 border-r border-slate-300 w-1/4">Sumber & Kutipan Dokumen</th>
              <th className="p-1 border-r border-slate-300 w-1/4">Alasan & Pertimbangan</th>
              <th className="p-1 w-1/12">Reviewer</th>
            </tr>
          </thead>
          <tbody>
            {(procedureChecks || []).map((pc) => (
              <tr key={pc.id} className="border-b border-slate-200 text-[10px]">
                <td className="p-1 border-r border-slate-200 align-top">
                  <div className="font-bold">{pc.label}</div>
                  <div className="text-slate-500 font-mono">[{pc.code} · {pc.category}]</div>
                </td>
                <td className="p-1 border-r border-slate-200 align-top font-bold uppercase">
                  {pc.status}
                </td>
                <td className="p-1 border-r border-slate-200 align-top">
                  <div className="font-semibold text-slate-800">{pc.sumber}</div>
                  <div className="italic text-slate-600">&ldquo;{pc.kutipan}&rdquo;</div>
                </td>
                <td className="p-1 border-r border-slate-200 align-top text-slate-700">
                  {pc.alasan}
                </td>
                <td className="p-1 align-top font-medium text-slate-800">
                  {pc.reviewer}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* BAB VIII: KESIMPULAN TELAAH */}
      <section className="mt-8 page-break-inside-avoid border-t-2 border-slate-300 pt-4">
        <h2 className="font-bold text-xs uppercase mb-2 text-slate-900">
          VIII. KESIMPULAN TELAAH ADMINISTRATIF & CATATAN PENELAAH
        </h2>

        <p className="text-xs text-slate-800 leading-relaxed bg-slate-50 p-3 rounded border border-slate-200 mb-4">
          {review.summaryOpinion ||
            matter.reviewNotes ||
            'Berkas perkara ini telah diteliti secara administratif dan materiil. Rekomendasi gelar perkara adalah melengkapi kekurangan alat bukti atau melakukan pemeriksaan saksi tambahan sebelum pelimpahan berkas.'}
        </p>
      </section>

      {/* BAB IX: DAFTAR KELENGKAPAN & DATA BELUM TERSEDIA */}
      <section className="mb-6 page-break-inside-avoid">
        <h2 className="font-bold text-xs uppercase bg-slate-200 p-1.5 px-2 mb-2 text-slate-900 border-l-4 border-slate-900">
          IX. KETERBATASAN SISTEM & DAFTAR ITEM BELUM TERSEDIA
        </h2>
        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-[10px] space-y-1.5 text-slate-700">
          <div>
            <strong>1. Status Celah Bukti / Unsur:</strong>{' '}
            {elements.filter(e => e.status === 'Belum Tersedia' || e.status === 'Perlu Bukti Tambahan').length > 0 ? (
              <span>
                Terdapat {elements.filter(e => e.status === 'Belum Tersedia' || e.status === 'Perlu Bukti Tambahan').length} unsur delik yang masih berstatus &quot;Belum Tersedia&quot; atau &quot;Perlu Bukti Tambahan&quot;.
              </span>
            ) : (
              <span>Seluruh unsur delik telah dipetakan terhadap alat bukti permulaan.</span>
            )}
          </div>
          <div>
            <strong>2. Status Prosedur Administrasi Mindik:</strong>{' '}
            {procedureChecks.filter(p => p.status === 'belum dinilai' || p.status === 'perlu klarifikasi').length > 0 ? (
              <span>
                Terdapat {procedureChecks.filter(p => p.status === 'belum dinilai' || p.status === 'perlu klarifikasi').length} poin prosedur KUHAP yang masih &quot;belum dinilai&quot; atau &quot;perlu klarifikasi&quot;.
              </span>
            ) : (
              <span>Seluruh 11 instrumen prosedur telah diperiksa.</span>
            )}
          </div>
          <div className="text-slate-500 italic pt-1 border-t border-slate-200">
            * Seluruh dokumen ini adalah simulasi analitik lokal (Pratinjau). Berkas ini tidak menggantikan Berkas Perkara resmi (BAP) yang diajukan ke Pengadilan.
          </div>
        </div>
      </section>

      {/* BAB X: TANDA TANGAN PENELAAH */}
      <section className="page-break-inside-avoid border-t-2 border-slate-300 pt-4">
        <div className="flex justify-between items-end">
          <div className="text-[10px] text-slate-500">
            <div>Dokumen Resmi Sistem Analisis Perkara (Pratinjau Lokal)</div>
            <div>Dihasilkan dari peramban pada: {new Date().toLocaleString('id-ID')}</div>
          </div>

          <div className="text-center w-64">
            <div className="text-xs mb-1">Jakarta, {printDate}</div>
            <div className="text-xs font-semibold">Penelaah / Pimpinan Gelar,</div>
            <div className="h-16 flex items-center justify-center italic text-slate-400 text-[11px]">
              (Ditandatangani Secara Elektronik / Draf)
            </div>
            <div className="font-bold underline text-xs">
              {review.reviewerName || matter.leadInvestigator || 'AN. PENYIDIK KEPALA'}
            </div>
            <div className="text-[11px] text-slate-600">
              {review.reviewerRole || 'Penyidik / Analis Perkara'}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
