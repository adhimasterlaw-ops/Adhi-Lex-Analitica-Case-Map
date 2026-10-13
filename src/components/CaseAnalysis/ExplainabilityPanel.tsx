import React from 'react';
import {
  HelpCircle,
  Table,
  AlertTriangle,
  FileQuestion,
  GitBranch,
  CheckSquare,
  ShieldAlert,
  Scale,
  Lock,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

export const ExplainabilityPanel: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Principle Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-700 border border-amber-500/20">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-950">
              Panel Transparansi Metodologi: Mengapa Hasil Ini Muncul?
            </h2>
            <p className="text-xs text-slate-500">
              Penjelasan deterministik mengenai algoritma perbandingan, pemetaan yuridis, dan pembatasan non-konklusif sistem
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
          Sistem ini dirancang dengan prinsip <em>Explainable & Accountable Legal Informatics</em>. Tidak ada model &quot;kotak hitam&quot; (black-box), tidak ada kalkulasi persentase vonis, dan tidak ada otomatisasi yang menyatakan seseorang bersalah. Berikut adalah logika di balik setiap modul analisis:
        </p>
      </div>

      {/* Grid of 6 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Matriks Pembuktian 7 Dimensi */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3 text-slate-900 font-bold text-sm">
              <Table className="w-4 h-4 text-amber-600" />
              <span>1. Matriks Pembuktian 7 Dimensi</span>
            </div>
            <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <p>
                <strong>Dimensi:</strong> Unsur × Fakta × Bukti × Sumber × Bantahan × Relevansi Yuridis × Status Review.
              </p>
              <p>
                <strong>Mengapa unsur tidak pernah otomatis ditandai terpenuhi?</strong> Dalam hukum pidana (Pasal 183 KUHAP), keyakinan hakim dan minimum dua alat bukti sah adalah wewenang mutlak persidangan. Perangkat lunak hanya bertugas memetakan <em>ada atau belum tersedianya tautan alat bukti pendukung</em>, bukan memvonis keterpenuhan delik.
              </p>
              <p>
                <strong>Relevansi Yuridis:</strong> Dibagi menjadi Alat Bukti Langsung (Direct Evidence), Tidak Langsung (Sirkumstansial), dan Petunjuk (Indicia) sesuai yurisprudensi pembuktian pidana.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Standar: Pasal 183 & 184 KUHAP</span>
            <span className="font-semibold text-amber-700">Non-Konklusif Mutlak</span>
          </div>
        </div>

        {/* 2. Detektor Kontradiksi Terstruktur */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3 text-slate-900 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>2. Detektor Konflik Data Terstruktur</span>
            </div>
            <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <p>
                <strong>7 Parameter Baku:</strong> Subjek, Tindakan, Waktu, Tempat, Objek, Identitas Sumber, dan Urutan Peristiwa.
              </p>
              <p>
                <strong>Mengapa perbedaan teks biasa bukan kontradiksi?</strong> Perbedaan gaya bertutur atau sinonim wajar terjadi dalam BAP. Sistem membedakan secara tegas antara:
              </p>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                <li><em>Kontradiksi Substantif:</em> Alibi tempat & waktu yang saling menegasikan (misal: mengaku di luar kota vs rekaman CCTV).</li>
                <li><em>Perbedaan Kronologi:</em> Selisih jam rekonstruksi peristiwa.</li>
                <li><em>Perbedaan Redaksi:</em> Beda istilah (misal: titipan modal vs utang perdata).</li>
                <li><em>Data Hilang:</em> Izin diklaim ada namun nihil pada basis data kementerian.</li>
                <li><em>Klarifikasi:</em> Keterangan membutuhkan pemeriksaan ahli lanjutan.</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Analisis: Matriks Perbandingan Terstruktur</span>
            <span className="font-semibold text-rose-700">Wajib Review Manusia</span>
          </div>
        </div>

        {/* 3. Analisis Celah Data (Gap Analysis) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3 text-slate-900 font-bold text-sm">
              <FileQuestion className="w-4 h-4 text-sky-600" />
              <span>3. Analisis Celah Data (Data Gap Checklist)</span>
            </div>
            <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <p>
                <strong>Rumus Kelengkapan Input:</strong> Dihitung dari rasio entitas pokok yang terisi lengkap (Data Dasar, Subjek Hukum, Alat Bukti, Unsur Pasal, dan Checklist Administrasi Penyidikan).
              </p>
              <p>
                <strong>Prinsip Celah Terbuka:</strong> Data yang belum terkonfirmasi ditandai sebagai <em>&quot;Belum Tersedia&quot;</em> atau <em>&quot;Perlu Bukti Tambahan&quot;</em>, bukan diisi otomatis. Ini mencegah asumsi spekulatif yang berisiko mencederai objektivitas berkas penyidikan.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Metode: Audit Ketiadaan Entitas</span>
            <span className="font-semibold text-sky-700">Deteksi Lubang Pembuktian</span>
          </div>
        </div>

        {/* 4. Checklist Prosedural Netral (Mindik) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3 text-slate-900 font-bold text-sm">
              <CheckSquare className="w-4 h-4 text-emerald-600" />
              <span>4. Checklist Prosedural Netral (11 Tahapan KUHAP)</span>
            </div>
            <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <p>
                <strong>Mengapa status checklist non-biner?</strong> Sistem menolak status biner simplistis seperti &quot;sah/batal&quot;. Status checklist dibatasi HANYA pada 6 kualifikasi faktual:
              </p>
              <div className="grid grid-cols-2 gap-1 text-[11px] font-mono text-slate-700">
                <span>· belum dinilai</span>
                <span>· didukung dokumen</span>
                <span>· tidak didukung</span>
                <span>· diperselisihkan</span>
                <span>· tidak relevan</span>
                <span>· perlu klarifikasi</span>
              </div>
              <p className="mt-1">
                <strong>Akuntabilitas Pengisian:</strong> Setiap perubahan status wajib disertai Sumber Dokumen, Kutipan, Alasan Analitis, dan Nama Reviewer.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Standar: Perkap Manajemen Penyidikan & KUHAP</span>
            <span className="font-semibold text-emerald-700">Transparansi Mindik</span>
          </div>
        </div>

        {/* 5. Graph Relasi Eksplisit */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3 text-slate-900 font-bold text-sm">
              <GitBranch className="w-4 h-4 text-purple-600" />
              <span>5. Visualisasi Graph Relasi Eksplisit</span>
            </div>
            <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <p>
                <strong>Hanya Relasi Buatan Pengguna:</strong> Kanvas graph SVG sama sekali <em>tidak menghasilkan garis imajiner atau korelasi spekulatif otomatis</em>.
              </p>
              <p>
                Setiap garis mewakili entitas yang sengaja dihubungkan oleh pengguna pada tab Relasi Eksplisit (jenis: mendukung, membantah, belum tersedia, atau perlu klarifikasi). Hal ini menjaga integritas data dari bahaya halusinasi hubungan buatan algoritma.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Visualisasi: SVG Interaktif Deterministik</span>
            <span className="font-semibold text-purple-700">Zero-Auto Hallucination</span>
          </div>
        </div>

        {/* 6. Proteksi Prompt Injection & Batasan Storage */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3 text-slate-900 font-bold text-sm">
              <Lock className="w-4 h-4 text-indigo-600" />
              <span>6. Isolasi Data Pasif & Keterbatasan Storage</span>
            </div>
            <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <p>
                <strong>Isolasi Prompt Injection:</strong> Seluruh teks berkas perkara dibungkus dalam tag isolasi data pasif. Teks dokumen diposisikan sebagai objek pasif murni, sehingga instruksi yang diselundupkan ke dalam kutipan BAP tidak dapat mengeksekusi aksi sistem.
              </p>
              <p>
                <strong>Bukan Server Append-Only:</strong> Sistem beroperasi pada browser localStorage. Hash manual dan nomor register sita merupakan alat pencatat internal penelaah, bukan tanda tangan kriptografi bersertifikasi PSrE/BSSN.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Keamanan: Data Sanitization & Local Isolation</span>
            <span className="font-semibold text-indigo-700">Integritas Klien</span>
          </div>
        </div>
      </div>
    </div>
  );
};
