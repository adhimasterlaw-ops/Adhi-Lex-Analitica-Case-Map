import React from 'react';
import { Matter, CaseStage, CaseStatus, TimeZoneType } from '../../types/case';
import { FileText, Save, Info, Scale, MapPin, Calendar, Landmark } from 'lucide-react';

interface Props {
  matter: Matter;
  onChange: (updated: Matter) => void;
}

export const TabBasicData: React.FC<Props> = ({ matter, onChange }) => {
  const updateField = <K extends keyof Matter>(key: K, value: Matter[K]) => {
    onChange({
      ...matter,
      [key]: value,
      updatedAt: new Date().toISOString()
    });
  };

  const stages: CaseStage[] = [
    'Penyelidikan',
    'Penyidikan',
    'Pra-Penuntutan',
    'Penuntutan',
    'Persidangan'
  ];

  const statuses: CaseStatus[] = [
    'Aktif',
    'Ditolak/SP3',
    'Diversi',
    'P-21 (Lengkap)',
    'Tahap II',
    'Selesai'
  ];

  const timeZones: TimeZoneType[] = ['WIB', 'WITA', 'WIT'];

  const caseTypes = [
    'Tindak Pidana Umum (Kejahatan Harta Benda)',
    'Tindak Pidana Umum (Kejahatan Terhadap Jiwa / Tubuh)',
    'Tindak Pidana Khusus (Korupsi)',
    'Tindak Pidana Khusus (Pencucian Uang / TPPU)',
    'Tindak Pidana Tertentu (Siber / ITE)',
    'Tindak Pidana Ekonomi / Pajak / Perbankan'
  ];

  return (
    <div className="space-y-6">
      <div className="bg-amber-50/50 border border-amber-200/60 rounded-lg p-3.5 flex items-start gap-3 text-xs text-amber-900">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-950">Prinsip Netralitas Form Data Dasar & Konteks Hukum</p>
          <p className="text-amber-800/90 mt-0.5">
            Judul, tahapan, dan yurisdiksi perkara dicatat secara objektif. Tanggal snapshot hukum memastikan dasar undang-undang yang diuji merujuk pada teks regulasi yang berlaku saat peristiwa delik terjadi (*lex temporis delicti*).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Judul Perkara */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Nama / Judul Perkara *
          </label>
          <input
            type="text"
            value={matter.title}
            onChange={(e) => updateField('title', e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 font-medium"
            placeholder="Contoh: Dugaan Tindak Pidana Penipuan Investasi Kopi Ekspor..."
          />
        </div>

        {/* Nomor Referensi / LP / SPDP */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Nomor Register / Laporan Polisi (LP) / SPDP *
          </label>
          <input
            type="text"
            value={matter.refNumber}
            onChange={(e) => updateField('refNumber', e.target.value)}
            className="w-full px-3.5 py-2 text-sm font-mono bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900"
            placeholder="Contoh: LP/B/142/IV/2026/SPKT/BARESKRIM"
          />
        </div>

        {/* Konteks Jenis Perkara */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-slate-500" />
            <span>Jenis Perkara (Konteks Pidana) *</span>
          </label>
          <input
            type="text"
            list="caseTypesList"
            value={matter.caseType || ''}
            onChange={(e) => updateField('caseType', e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 font-medium"
            placeholder="Pilih atau ketik jenis perkara..."
          />
          <datalist id="caseTypesList">
            {caseTypes.map((ct) => (
              <option key={ct} value={ct} />
            ))}
          </datalist>
        </div>

        {/* Konteks Yurisdiksi */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Landmark className="w-3.5 h-3.5 text-slate-500" />
            <span>Konteks Yurisdiksi / Wilayah Hukum *</span>
          </label>
          <input
            type="text"
            value={matter.jurisdiction || ''}
            onChange={(e) => updateField('jurisdiction', e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900"
            placeholder="Contoh: Pengadilan Negeri Jakarta Selatan / Polda Metro Jaya"
          />
        </div>

        {/* Tanggal Snapshot Hukum */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Tanggal Snapshot Hukum (Legal Snapshot Date) *</span>
          </label>
          <input
            type="date"
            value={matter.legalSnapshotDate || ''}
            onChange={(e) => updateField('legalSnapshotDate', e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 font-mono font-medium"
          />
          <span className="text-[11px] text-slate-500 mt-1 block">
            Rujukan tanggal keberlakuan peraturan dan instrumen pembuktian yang ditelaah.
          </span>
        </div>

        {/* Konteks Tahap Perkara */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Konteks Tahap Penanganan Perkara *
          </label>
          <select
            value={matter.stage}
            onChange={(e) => updateField('stage', e.target.value as CaseStage)}
            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 cursor-pointer font-medium"
          >
            {stages.map((stg) => (
              <option key={stg} value={stg}>
                {stg}
              </option>
            ))}
          </select>
        </div>

        {/* Status Perkara */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Status Berkas
          </label>
          <select
            value={matter.status}
            onChange={(e) => updateField('status', e.target.value as CaseStatus)}
            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 cursor-pointer font-medium"
          >
            {statuses.map((sts) => (
              <option key={sts} value={sts}>
                {sts}
              </option>
            ))}
          </select>
        </div>

        {/* Tanggal Kejadian */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Tanggal Peristiwa (Tempus Delicti)
          </label>
          <input
            type="date"
            value={matter.incidentDate}
            onChange={(e) => updateField('incidentDate', e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 font-medium"
          />
        </div>

        {/* Tanggal Laporan / Register */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Tanggal Penerimaan Laporan / Register
          </label>
          <input
            type="date"
            value={matter.registerDate}
            onChange={(e) => updateField('registerDate', e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 font-medium"
          />
        </div>

        {/* Zona Waktu */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Zona Waktu
          </label>
          <select
            value={matter.timeZone}
            onChange={(e) => updateField('timeZone', e.target.value as TimeZoneType)}
            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 cursor-pointer font-medium"
          >
            {timeZones.map((tz) => (
              <option key={tz} value={tz}>
                {tz} (Indonesia Bagian {tz === 'WIB' ? 'Barat' : tz === 'WITA' ? 'Tengah' : 'Timur'})
              </option>
            ))}
          </select>
        </div>

        {/* Locus Delicti */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Locus Delicti (Tempat Kejadian Perkara)
          </label>
          <input
            type="text"
            value={matter.locusDelicti}
            onChange={(e) => updateField('locusDelicti', e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900"
            placeholder="Contoh: Jl. Mega Kuningan Barat No. 8, Jakarta Selatan"
          />
        </div>

        {/* Kategori Klasifikasi */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Kategori Klasifikasi Tambahan
          </label>
          <input
            type="text"
            value={matter.category}
            onChange={(e) => updateField('category', e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900"
            placeholder="Contoh: Kejahatan Terhadap Harta Benda"
          />
        </div>

        {/* Penyidik / Analis Utama */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Penyidik / Analis Penanggung Jawab
          </label>
          <input
            type="text"
            value={matter.leadInvestigator}
            onChange={(e) => updateField('leadInvestigator', e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900"
            placeholder="Contoh: AKP Surya Pratama, S.H. (Fiktif Pratinjau)"
          />
        </div>

        {/* Ringkasan Awal Perkara */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Ringkasan Awal Posita Kasus / Kronologi Singkat
          </label>
          <textarea
            rows={4}
            value={matter.initialSummary}
            onChange={(e) => updateField('initialSummary', e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 leading-relaxed"
            placeholder="Tuliskan konstruksi dugaan awal tindak pidana berdasarkan laporan pengaduan..."
          />
        </div>
      </div>
    </div>
  );
};
