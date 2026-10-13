import React from 'react';
import {
  X,
  ShieldAlert,
  HardDrive,
  Database,
  Lock,
  FileCheck,
  AlertTriangle,
  FileText,
  Key
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const StorageSecurityNoticeModal: React.FC<Props> = ({ isOpen, onClose }) => {
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="security-modal-title"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 no-print animate-in fade-in duration-150"
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ShieldAlert className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 id="security-modal-title" className="text-base font-bold tracking-tight">
                Keamanan Data, Batasan Storage & Kebijakan Analitik
              </h3>
              <p className="text-xs text-slate-400">
                Pemberitahuan Kepatuhan Hukum & Arsitektur Penyimpanan Klien (Pratinjau)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup modal peringatan keamanan dan batasan storage (Tekan Escape)"
            className="text-slate-400 hover:text-white p-1 rounded-lg transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 leading-relaxed">
          {/* Section 1: Bukan Repositori Resmi */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 flex items-start gap-3.5">
            <HardDrive className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">
                1. LocalStorage Bukan Repositori Resmi Negara
              </h4>
              <p className="mt-1 text-slate-700">
                Aplikasi ini beroperasi <strong>100% di sisi klien (Client-Side Storage)</strong> melalui teknologi HTML5 Web Storage peramban Anda. Aplikasi ini <strong>BUKAN</strong> bagian dari SPPT-TI (Sistem Peradilan Pidana Terpadu berbasis Teknologi Informasi), bukan pangkalan data resmi Kepolisian Negara RI, Kejaksaan Agung RI, atau Mahkamah Agung RI. Jika Anda membersihkan cache atau riwayat peramban, data lokal akan terhapus.
              </p>
            </div>
          </div>

          {/* Section 2: Bukan Audit Log Server */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3.5">
            <Database className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">
                2. Bukan Audit Log Server Append-Only
              </h4>
              <p className="mt-1 text-slate-700">
                Riwayat log aktivitas yang tercatat adalah log lokal peramban. Aplikasi ini sengaja tidak memelihara server database append-only eksternal. Log ini berfungsi semata-mata sebagai bantuan penelaah untuk melacak urutan pengeditan pada sesi kerja lokal, bukan bukti forensik digital server anti-tamper.
              </p>
            </div>
          </div>

          {/* Section 3: Bukan Jaminan Chain of Custody Sah */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3.5">
            <FileCheck className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">
                3. Bukan Jaminan Sah Rantai Bukti (Chain of Custody)
              </h4>
              <p className="mt-1 text-slate-700">
                Pencatatan hash manual (SHA-256) dan nomor register sita di tab Barang Bukti merupakan simulasi tata kelola administratif perkara. Ini <strong>bukan tanda tangan digital tersertifikasi (PSrE/BSrE/BSSN)</strong> dan tidak memiliki kekuatan pembuktian rantai simpan formil tanpa Berita Acara Penyitaan dan Penyegelan fisik yang sah sesuai KUHAP.
              </p>
            </div>
          </div>

          {/* Section 4: Prompt Injection Protection */}
          <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-4 flex items-start gap-3.5">
            <Lock className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">
                4. Proteksi Prompt Injection: Semua Berkas Adalah DATA Pasif
              </h4>
              <p className="mt-1 text-slate-700">
                Setiap dokumen, kutipan BAP, dan catatan barang bukti diperlakukan oleh mesin dan model AI secara ketat sebagai <strong>DATA PASIF MURNI</strong> dalam wadah isolasi <code>[DATA_PASIF_MULAI] ... [DATA_PASIF_SELESAI]</code>. Upaya manipulasi instruksi (prompt injection/jailbreak) yang disisipkan di dalam teks kutipan berkas tidak akan dieksekusi sebagai perintah sistem.
              </p>
            </div>
          </div>

          {/* Section 5: Peringatan Data Sensitif (UU PDP) */}
          <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4 flex items-start gap-3.5">
            <AlertTriangle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-rose-950 text-sm">
                5. Peringatan Data Sensitif & Penyamaran (UU PDP)
              </h4>
              <p className="mt-1 text-rose-900">
                Dilarang mengunggah Nomor Induk Kependudukan (NIK) asli, nomor rekening bank nyata, data medis, atau identitas korban tindak pidana asusila / anak di bawah umur. Gunakan fitur <strong>&quot;Mode Penyamaran Data&quot;</strong> yang tersedia di bilah atas untuk menyamarkan data sensitif secara lokal sebelum mengekspor atau mempresentasikan lembar telaah.
              </p>
            </div>
          </div>

          {/* Section 6: Non-Konklusif */}
          <div className="p-3 bg-slate-100 rounded-lg text-slate-600 text-[11px] font-medium border border-slate-200">
            <strong>Asas Praduga Tak Bersalah:</strong> Seluruh output perbandingan, matriks pembuktian, dan kandidat kontradiksi bersikap deskriptif non-konklusif. Tidak menyatakan seseorang bersalah dan tidak menggantikan kemandirian majelis hakim dalam memutus perkara pidana.
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 font-semibold text-xs rounded-lg transition cursor-pointer"
          >
            Saya Memahami Batasan Ini
          </button>
        </div>
      </div>
    </div>
  );
};
