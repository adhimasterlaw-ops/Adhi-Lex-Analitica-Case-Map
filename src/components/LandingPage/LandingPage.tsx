import React, { useState, useEffect } from 'react';
import { CaseFullPackage } from '../../types/case';
import justitiaLogo from '../../assets/images/justitia-logo.png';
import {
  Scale,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Table,
  Clock,
  AlertTriangle,
  CheckSquare,
  GitBranch,
  EyeOff,
  ArrowRight,
  ChevronRight,
  Lock,
  Layers,
  FileText,
  HardDrive,
  UserCheck,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  Info,
  History,
  FileCheck,
  FolderOpen,
  Plus,
  Menu,
  X,
  Loader2,
  Check
} from 'lucide-react';

interface Props {
  activeCase: CaseFullPackage;
  onOpenDashboard: () => void;
  onOpenActiveCase: (targetView: 'editor' | 'analysis') => void;
  onOpenSecurityNotice: () => void;
  onOpenNewCase: () => void;
}

export const LandingPage: React.FC<Props> = ({
  activeCase,
  onOpenDashboard,
  onOpenActiveCase,
  onOpenSecurityNotice,
  onOpenNewCase
}) => {
  // Mobile drawer state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Preview widget active tab
  const [previewTab, setPreviewTab] = useState<'timeline' | 'matrix' | 'procedure'>('timeline');

  // Interactive Button Feedback States
  const [dashboardBtnState, setDashboardBtnState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newCaseBtnState, setNewCaseBtnState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Escape key handler for keyboard navigation & modal/menu dismissal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  const handleLaunchDashboard = () => {
    try {
      setDashboardBtnState('loading');
      setTimeout(() => {
        setDashboardBtnState('success');
        setTimeout(() => {
          onOpenDashboard();
          setDashboardBtnState('idle');
          setIsMobileMenuOpen(false);
        }, 150);
      }, 180);
    } catch {
      setDashboardBtnState('error');
    }
  };

  const handleLaunchNewCase = () => {
    try {
      setNewCaseBtnState('loading');
      setTimeout(() => {
        setNewCaseBtnState('success');
        setTimeout(() => {
          onOpenNewCase();
          setNewCaseBtnState('idle');
          setIsMobileMenuOpen(false);
        }, 150);
      }, 180);
    } catch {
      setNewCaseBtnState('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#1A3B32] font-sans selection:bg-amber-200 selection:text-[#1A3B32] flex flex-col">
      {/* 1. TOP DISCLAIMER TICKER */}
      <div className="bg-[#1A3B32] text-amber-100/90 border-b border-amber-500/30 px-4 py-2.5 text-xs flex flex-wrap items-center justify-between gap-3">
        <div className="max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="font-bold tracking-wider text-amber-300 font-serif-heading text-[11px]">
              PLATFORM LEGAL-TECH INDONESIA
            </span>
            <span className="text-amber-300/40 hidden sm:inline">|</span>
            <span className="text-amber-100/80 text-[11px] hidden sm:inline">
              Simulasi Analitik Objektif Berbasis Hukum Acara Pidana (KUHAP)
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-rose-200 font-bold bg-rose-950/80 border border-rose-800 px-2 py-0.5 rounded shadow-2xs">
              PRATINJAU — BUKAN PERKARA NYATA
            </span>
            <span className="text-amber-300 font-bold bg-amber-950/80 border border-amber-800 px-2 py-0.5 rounded shadow-2xs">
              DRAF — PERLU VERIFIKASI MANUSIA
            </span>
          </div>
        </div>
      </div>

      {/* 2. INSTITUTIONAL NAVBAR (LIGHT MODE) */}
      <header className="bg-[#F9F6F0]/95 border-b border-[#1A3B32]/10 text-[#1A3B32] sticky top-0 z-40 backdrop-blur-md shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo & Title */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500/20 to-[#1A3B32]/20 border border-amber-600/40 flex items-center justify-center text-[#1A3B32] shadow-inner">
                <Scale className="w-6 h-6 text-amber-700" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif-heading text-base sm:text-lg font-bold tracking-wider text-[#1A3B32]">
                    ADHI - Lex Analitica Case Map
                  </span>
                </div>
                <p className="text-[11px] text-[#1A3B32]/70 font-medium">
                  Sistem Telaah Berkas & Pemetaan Pembuktian Terstruktur
                </p>
              </div>
            </div>

            {/* Navigation Anchor Links (Centered) */}
            <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-[#1A3B32]/80">
              <a href="#fitur" className="hover:text-amber-700 transition">
                Fitur Utama
              </a>
              <a href="#alur" className="hover:text-amber-700 transition">
                Alur & Langkah
              </a>
              <a href="#preview" className="hover:text-amber-700 transition">
                Preview Sistem
              </a>
              <a href="#prinsip" className="hover:text-amber-700 transition">
                Empat Prinsip
              </a>
              <a href="#batasan-pratinjau" className="hover:text-amber-700 transition">
                Batasan Pratinjau
              </a>
            </nav>

            {/* Quick Actions & Dashboard Launch Buttons (Desktop Right) */}
            <div className="hidden sm:flex items-center gap-2.5">
              <button
                onClick={handleLaunchNewCase}
                disabled={newCaseBtnState === 'loading'}
                aria-label="Buka formulir pendaftaran perkara pidana baru"
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-white hover:bg-amber-50 text-[#1A3B32] border border-[#1A3B32]/20 hover:border-amber-600/50 transition duration-200 cursor-pointer shadow-2xs active:scale-95"
              >
                {newCaseBtnState === 'loading' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-700" aria-hidden="true" />
                ) : newCaseBtnState === 'success' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                ) : (
                  <Plus className="w-3.5 h-3.5 text-amber-700" aria-hidden="true" />
                )}
                <span>Buat Perkara Baru</span>
              </button>

              <button
                onClick={handleLaunchDashboard}
                disabled={dashboardBtnState === 'loading'}
                aria-label="Buka dashboard workspace telaah perkara pratinjau"
                className="flex items-center gap-2 px-4 py-2 bg-[#1A3B32] hover:bg-[#122A23] text-amber-200 font-bold text-xs rounded-lg shadow-md hover:shadow-lg transition duration-200 cursor-pointer group active:scale-95"
              >
                {dashboardBtnState === 'loading' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-300" aria-hidden="true" />
                ) : dashboardBtnState === 'success' ? (
                  <Check className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
                ) : (
                  <FolderOpen className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
                )}
                <span>Buka Dashboard</span>
                <ChevronRight className="w-3.5 h-3.5 text-amber-300 group-hover:translate-x-0.5 transition duration-200 hidden md:inline" aria-hidden="true" />
              </button>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
                aria-expanded={isMobileMenuOpen}
                className="p-2.5 rounded-lg bg-white text-[#1A3B32] hover:bg-amber-50 border border-[#1A3B32]/20 transition duration-200 cursor-pointer"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-amber-700" aria-hidden="true" />
                ) : (
                  <Menu className="w-5 h-5 text-[#1A3B32]" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer / Dropdown */}
        {isMobileMenuOpen && (
          <div
            id="mobile-nav-drawer"
            role="region"
            aria-label="Menu navigasi mobile"
            className="lg:hidden bg-white border-b border-[#1A3B32]/10 px-4 py-4 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-200"
          >
            <nav className="flex flex-col space-y-2 text-xs font-semibold text-[#1A3B32]">
              <a
                href="#fitur"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-amber-50 hover:text-amber-700 transition duration-200"
              >
                Fitur Utama
              </a>
              <a
                href="#alur"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-amber-50 hover:text-amber-700 transition duration-200"
              >
                Alur & Langkah
              </a>
              <a
                href="#preview"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-amber-50 hover:text-amber-700 transition duration-200"
              >
                Preview Sistem
              </a>
              <a
                href="#prinsip"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-amber-50 hover:text-amber-700 transition duration-200"
              >
                Empat Prinsip Integritas
              </a>
              <a
                href="#batasan-pratinjau"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-amber-50 hover:text-amber-700 transition duration-200"
              >
                Batasan Pratinjau
              </a>
            </nav>

            <div className="pt-3 border-t border-[#1A3B32]/10 flex flex-col gap-2.5">
              <button
                onClick={handleLaunchDashboard}
                disabled={dashboardBtnState === 'loading'}
                className="w-full py-2.5 px-4 bg-[#1A3B32] text-amber-200 font-bold text-xs rounded-lg shadow transition duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <FolderOpen className="w-4 h-4 text-amber-300" aria-hidden="true" />
                <span>Buka Dashboard</span>
              </button>

              <button
                onClick={handleLaunchNewCase}
                disabled={newCaseBtnState === 'loading'}
                className="w-full py-2.5 px-4 bg-white hover:bg-amber-50 text-[#1A3B32] font-semibold text-xs rounded-lg border border-[#1A3B32]/20 flex items-center justify-center gap-2 transition duration-200 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-amber-700" aria-hidden="true" />
                <span>Buat Perkara Baru</span>
              </button>

              <button
                onClick={() => {
                  onOpenSecurityNotice();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2 px-4 bg-amber-50 text-[#1A3B32] hover:text-amber-900 text-xs rounded-lg border border-amber-200 flex items-center justify-center gap-1.5 transition duration-200 cursor-pointer font-medium"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-700" aria-hidden="true" />
                <span>Batasan Storage & Rantai Bukti</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 3. HERO SECTION (SPLIT LAYOUT - ADHI LEGALMASTER PRO STYLE LIGHT MODE) */}
      <section className="relative bg-[#F9F6F0] text-[#1A3B32] overflow-hidden pt-12 pb-20 border-b border-[#1A3B32]/10">
        {/* Subtle Ornamental Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#1A3B32_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* KOLOM KIRI: Teks & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Top Institutional Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-50 border border-amber-600/40 text-amber-900 text-xs font-bold shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span className="tracking-wider uppercase">
                  FLATFORM PETA PERKARA - HUKUM INDONESIA
                </span>
              </div>

              {/* Majestic Serif Headline */}
              <h1 className="font-serif-elegant text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1A3B32] leading-[1.18]">
                Menata Fakta, Bukti, dan Prosedur Secara Lebih Terstruktur
              </h1>

              {/* Subtitle */}
              <p className="text-[#1A3B32]/80 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
                Asisten telaah berbasis data untuk membantu memetakan pihak, fakta, kronologi, bukti, unsur, dan isu prosedural dengan tetap menjaga verifikasi manusia.
              </p>

              {/* Mandatory Disclaimer Mini Card */}
              <div className="max-w-xl bg-white/90 border border-amber-600/30 rounded-xl p-3.5 text-xs text-[#1A3B32] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2.5 text-left">
                  <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
                  <div>
                    <div className="font-bold text-amber-900 uppercase tracking-wide text-[11px]">
                      PRATINJAU — BUKAN PERKARA NYATA · DRAF — PERLU VERIFIKASI MANUSIA
                    </div>
                    <div className="text-[11px] text-[#1A3B32]/70 mt-0.5">
                      Seluruh identitas para pihak, locus, dan tempus adalah simulasi analitik fiktif. Tidak menggantikan wewenang peradilan.
                    </div>
                  </div>
                </div>
                <button
                  onClick={onOpenSecurityNotice}
                  className="text-[11px] text-amber-800 hover:text-amber-950 font-semibold underline underline-offset-2 shrink-0 cursor-pointer"
                >
                  Batasan
                </button>
              </div>

              {/* Hero Primary CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {/* Button 1: Buka Dashboard (Solid Dark Green) */}
                <button
                  onClick={handleLaunchDashboard}
                  disabled={dashboardBtnState === 'loading'}
                  aria-label="Buka dashboard workspace telaah perkara pratinjau"
                  className="px-6 py-3.5 bg-[#1A3B32] hover:bg-[#122A23] text-amber-200 font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition duration-200 cursor-pointer flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 active:scale-95"
                >
                  {dashboardBtnState === 'loading' ? (
                    <Loader2 className="w-4 h-4 animate-spin text-amber-200" aria-hidden="true" />
                  ) : dashboardBtnState === 'success' ? (
                    <Check className="w-4 h-4 text-amber-200" aria-hidden="true" />
                  ) : (
                    <FolderOpen className="w-4 h-4 text-amber-200" aria-hidden="true" />
                  )}
                  <span>Buka Dashboard</span>
                  <ChevronRight className="w-4 h-4 text-amber-200 group-hover:translate-x-1 transition duration-200" aria-hidden="true" />
                </button>

                {/* Button 2: Pelajari Fitur / Buat Perkara Baru */}
                <button
                  onClick={handleLaunchNewCase}
                  disabled={newCaseBtnState === 'loading'}
                  aria-label="Buka modal formulir pendaftaran perkara baru"
                  className="px-6 py-3.5 bg-white hover:bg-amber-50 text-[#1A3B32] font-bold text-sm rounded-xl border border-[#1A3B32]/20 hover:border-amber-600/50 transition duration-200 cursor-pointer flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 active:scale-95"
                >
                  {newCaseBtnState === 'loading' ? (
                    <Loader2 className="w-4 h-4 animate-spin text-amber-700" aria-hidden="true" />
                  ) : newCaseBtnState === 'success' ? (
                    <Check className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                  ) : (
                    <Plus className="w-4 h-4 text-amber-700" aria-hidden="true" />
                  )}
                  <span>Buat Perkara Baru</span>
                </button>

                {/* Button 3: Buka Kasus Pratinjau */}
                <button
                  onClick={() => onOpenActiveCase('analysis')}
                  aria-label={`Buka telaah kasus pratinjau aktif nomor ${activeCase.matter.refNumber}`}
                  className="px-5 py-3.5 bg-white/70 hover:bg-white text-[#1A3B32] font-medium text-sm rounded-xl border border-[#1A3B32]/15 hover:border-[#1A3B32]/30 transition duration-200 cursor-pointer flex items-center gap-2"
                >
                  <Clock className="w-4 h-4 text-amber-700" aria-hidden="true" />
                  <span>Kasus Pratinjau ({activeCase.matter.refNumber})</span>
                </button>
              </div>

              {/* Teks kecil di bawah tombol */}
              <p className="text-xs text-[#1A3B32]/60 font-medium pt-1">
                Data tersimpan secara lokal dan dirancang untuk kebutuhan praktik hukum Indonesia.
              </p>
            </div>

            {/* KOLOM KANAN: Justitia Logo dalam Lingkaran Utuh Tanpa Kotak / Kartu */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
              <div className="relative group flex items-center justify-center">
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden flex items-center justify-center transition-transform duration-500 hover:scale-105">
                  <img
                    src={justitiaLogo}
                    alt="Logo Justitia"
                    className="w-full h-full object-cover rounded-full overflow-hidden"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-12 mt-12 border-t border-[#1A3B32]/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-left max-w-5xl mx-auto">
            <div className="p-4 bg-white rounded-xl border border-[#1A3B32]/15 shadow-2xs">
              <div className="text-2xl font-bold text-amber-800 font-serif-heading">100%</div>
              <div className="text-xs text-[#1A3B32] font-semibold mt-0.5">Penyimpanan Klien Lokal</div>
              <div className="text-[10px] text-[#1A3B32]/60">Tanpa transmisi database server</div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#1A3B32]/15 shadow-2xs">
              <div className="text-2xl font-bold text-amber-800 font-serif-heading">7 Dimensi</div>
              <div className="text-xs text-[#1A3B32] font-semibold mt-0.5">Matriks Pembuktian</div>
              <div className="text-[10px] text-[#1A3B32]/60">Korelasi alat bukti & bantahan</div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#1A3B32]/15 shadow-2xs">
              <div className="text-2xl font-bold text-amber-800 font-serif-heading">11 Kategori</div>
              <div className="text-xs text-[#1A3B32] font-semibold mt-0.5">Uji Prosedur Mindik</div>
              <div className="text-[10px] text-[#1A3B32]/60">Kepatuhan hukum acara KUHAP</div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#1A3B32]/15 shadow-2xs">
              <div className="text-2xl font-bold text-emerald-700 font-serif-heading">0% Vonis</div>
              <div className="text-xs text-[#1A3B32] font-semibold mt-0.5">Asas Praduga Tak Bersalah</div>
              <div className="text-[10px] text-[#1A3B32]/60">Bebas otomatisasi kesimpulan</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TRUST STRIP: 5 PILAR KEPATUHAN YURIDIS */}
      <section className="bg-[#1A3B32] border-b border-amber-500/20 py-6 text-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
            <div className="flex items-start gap-2.5 p-2">
              <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Asas Praduga Tak Bersalah</strong>
                <span className="text-amber-200/80 text-[11px]">Tidak menyatakan seseorang bersalah atau memprediksi vonis.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2">
              <Layers className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Taksonomi 4 Tingkat</strong>
                <span className="text-amber-200/80 text-[11px]">Memisahkan fakta terverifikasi, klaim pihak, inferensi, dan opini.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2">
              <UserCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Human-in-the-Loop Mutlak</strong>
                <span className="text-amber-200/80 text-[11px]">Wajib verifikasi telaah analis manusia sebelum finalisasi ekspor draf berkas.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2">
              <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Proteksi Data Pasif</strong>
                <span className="text-amber-200/80 text-[11px]">Semua isi dokumen diisolasi sebagai data murni, bukan instruksi.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2">
              <BookOpen className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Kepatuhan Hukum Acara</strong>
                <span className="text-amber-200/80 text-[11px]">Berdasarkan instrumen KUHAP dan regulasi perundang-undangan RI.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FITUR UTAMA SISTEM */}
      <section id="fitur" className="py-20 bg-white border-b border-[#1A3B32]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-amber-800 font-bold text-xs uppercase tracking-wider font-mono">
              [Modul Analisis Komprehensif]
            </span>
            <h2 className="font-serif-elegant text-2xl sm:text-4xl font-bold text-[#1A3B32] tracking-tight">
              Enam Instrumen Kunci Telaah Berkas Perkara
            </h2>
            <p className="text-xs sm:text-sm text-[#1A3B32]/75 leading-relaxed">
              Setiap modul dirancang secara deterministik untuk mendukung akuntabilitas, objektivitas rekonstruksi materiil, dan transparansi gelar perkara.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1: Matriks Pembuktian 7 Dimensi */}
            <div className="p-6 rounded-2xl border border-[#1A3B32]/15 bg-[#F9F6F0] hover:border-amber-600 hover:shadow-md transition space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-amber-600/10 text-amber-800 flex items-center justify-center group-hover:scale-105 transition">
                <Table className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1A3B32] font-serif-heading">
                1. Matriks Pembuktian 7 Dimensi
              </h3>
              <p className="text-xs text-[#1A3B32]/80 leading-relaxed">
                Pemetaan <em>Unsur Delik × Fakta × Bukti × Sumber × Bantahan × Relevansi Yuridis × Status Review</em>. Menegaskan ada atau tidaknya bukti tanpa rekayasa skor peluang.
              </p>
              <div className="text-[11px] text-amber-900 font-semibold pt-1">
                Pasal 183 & 184 KUHAP
              </div>
            </div>

            {/* Feature 2: Timeline & Gap Highlighter */}
            <div className="p-6 rounded-2xl border border-[#1A3B32]/15 bg-[#F9F6F0] hover:border-amber-600 hover:shadow-md transition space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-sky-600/10 text-sky-800 flex items-center justify-center group-hover:scale-105 transition">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1A3B32] font-serif-heading">
                2. Kronologi & Detektor Celah Waktu
              </h3>
              <p className="text-xs text-[#1A3B32]/80 leading-relaxed">
                Visualisasi urutan tempus interaktif dengan tombol pergeseran jam/hari. Mendeteksi secara matematis celah waktu kritis (&gt;48 jam) tanpa catatan alibi.
              </p>
              <div className="text-[11px] text-sky-900 font-semibold pt-1">
                Deteksi Jeda & Rekonstruksi Tempus
              </div>
            </div>

            {/* Feature 3: Detektor Kontradiksi Terstruktur */}
            <div className="p-6 rounded-2xl border border-[#1A3B32]/15 bg-[#F9F6F0] hover:border-amber-600 hover:shadow-md transition space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-rose-600/10 text-rose-800 flex items-center justify-center group-hover:scale-105 transition">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1A3B32] font-serif-heading">
                3. Detektor Kontradiksi Terstruktur
              </h3>
              <p className="text-xs text-[#1A3B32]/80 leading-relaxed">
                Membandingkan konflik pada 7 parameter baku: subjek, tindakan, waktu, tempat, objek, identitas sumber, dan urutan peristiwa secara berdampingan.
              </p>
              <div className="text-[11px] text-rose-900 font-semibold pt-1">
                7 Parameter Baku Non-Asumtif
              </div>
            </div>

            {/* Feature 4: Mindik 11 Kategori KUHAP */}
            <div className="p-6 rounded-2xl border border-[#1A3B32]/15 bg-[#F9F6F0] hover:border-amber-600 hover:shadow-md transition space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition">
                <CheckSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1A3B32] font-serif-heading">
                4. Checklist Prosedural Mindik
              </h3>
              <p className="text-xs text-[#1A3B32]/80 leading-relaxed">
                Uji formil kepatuhan administrasi penyidikan mencakup hak pihak, penasihat hukum, pemanggilan, penahanan, dan penyitaan sesuai KUHAP.
              </p>
              <div className="text-[11px] text-emerald-900 font-semibold pt-1">
                Kepatuhan Administrasi Penyidikan
              </div>
            </div>

            {/* Feature 5: Graph Relasi Eksplisit */}
            <div className="p-6 rounded-2xl border border-[#1A3B32]/15 bg-[#F9F6F0] hover:border-amber-600 hover:shadow-md transition space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-purple-600/10 text-purple-800 flex items-center justify-center group-hover:scale-105 transition">
                <GitBranch className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1A3B32] font-serif-heading">
                5. Visualisasi Graph Eksplisit
              </h3>
              <p className="text-xs text-[#1A3B32]/80 leading-relaxed">
                Kanvas topologi SVG yang hanya menggambar tautan relasi yang secara sadar dibuat oleh pengguna. Mencegah halusinasi relasi otomatis oleh AI.
              </p>
              <div className="text-[11px] text-purple-900 font-semibold pt-1">
                Zero Auto-Hallucination
              </div>
            </div>

            {/* Feature 6: Penyamaran Data Sensitif (UU PDP) */}
            <div className="p-6 rounded-2xl border border-[#1A3B32]/15 bg-[#F9F6F0] hover:border-amber-600 hover:shadow-md transition space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#1A3B32] text-amber-300 flex items-center justify-center group-hover:scale-105 transition">
                <EyeOff className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1A3B32] font-serif-heading">
                6. Penyamaran Data Sensitif (UU PDP)
              </h3>
              <p className="text-xs text-[#1A3B32]/80 leading-relaxed">
                Modul redaksi lokal untuk menyamarkan nama subjek hukum, NIK, nomor rekening bank, dan nomor telepon secara instan sebelum ekspor dokumen.
              </p>
              <div className="text-[11px] text-amber-900 font-semibold pt-1">
                Kepatuhan Privasi Data Pribadi
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. ALUR KERJA LIMA LANGKAH */}
      <section id="alur" className="py-20 bg-[#F9F6F0] border-b border-[#1A3B32]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-amber-800 font-bold text-xs uppercase tracking-wider font-mono">
              [Metodologi Terstruktur]
            </span>
            <h2 className="font-serif-elegant text-2xl sm:text-4xl font-bold text-[#1A3B32] tracking-tight">
              Alur Kerja Lima Tahap Penelaahan Perkara
            </h2>
            <p className="text-xs sm:text-sm text-[#1A3B32]/75 leading-relaxed">
              Panduan sistematis dari registrasi awal berkas hingga penerbitan lembar telaah terverifikasi manusia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {/* Step 1 */}
            <div className="bg-white p-5 rounded-xl border border-[#1A3B32]/15 shadow-2xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-[#1A3B32] text-amber-300 font-mono font-bold text-xs flex items-center justify-center mb-3">
                  01
                </div>
                <h4 className="font-bold text-[#1A3B32] text-xs uppercase tracking-wide">
                  Registrasi & Subjek Hukum
                </h4>
                <p className="text-[11px] text-[#1A3B32]/75 mt-1 leading-relaxed">
                  Pencatatan nomor LP/SPDP, tahap perkara, locus, tempus, dan pendataan pihak (pelapor, terlapor, saksi, ahli) beserta sumber identitas sah.
                </p>
              </div>
              <div className="text-[10px] text-[#1A3B32]/60 font-mono">Tahap Input Awal</div>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-5 rounded-xl border border-[#1A3B32]/15 shadow-2xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-[#1A3B32] text-amber-300 font-mono font-bold text-xs flex items-center justify-center mb-3">
                  02
                </div>
                <h4 className="font-bold text-[#1A3B32] text-xs uppercase tracking-wide">
                  Strukturisasi Fakta & Bukti
                </h4>
                <p className="text-[11px] text-[#1A3B32]/75 mt-1 leading-relaxed">
                  Pemisahan klaim BAP terhadap fakta terverifikasi dan inventarisasi alat bukti sah (surat, elektronik, fisik, keterangan) dengan hash manual.
                </p>
              </div>
              <div className="text-[10px] text-[#1A3B32]/60 font-mono">Inventarisasi KUHAP</div>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-5 rounded-xl border border-[#1A3B32]/15 shadow-2xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-[#1A3B32] text-amber-300 font-mono font-bold text-xs flex items-center justify-center mb-3">
                  03
                </div>
                <h4 className="font-bold text-[#1A3B32] text-xs uppercase tracking-wide">
                  Rekonstruksi & Celah Waktu
                </h4>
                <p className="text-[11px] text-[#1A3B32]/75 mt-1 leading-relaxed">
                  Penyusunan garis waktu kronologis, pengujian alibi melalui pergeseran tempus, dan deteksi celah waktu tanpa aktivitas untuk penelusuran saksi.
                </p>
              </div>
              <div className="text-[10px] text-[#1A3B32]/60 font-mono">Analisis Tempus</div>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-5 rounded-xl border border-[#1A3B32]/15 shadow-2xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-[#1A3B32] text-amber-300 font-mono font-bold text-xs flex items-center justify-center mb-3">
                  04
                </div>
                <h4 className="font-bold text-[#1A3B32] text-xs uppercase tracking-wide">
                  Pemetaan Unsur & Kontradiksi
                </h4>
                <p className="text-[11px] text-[#1A3B32]/75 mt-1 leading-relaxed">
                  Menautkan fakta dan bukti ke unsur pasal pidana yang disangkakan serta menguji kontradiksi keterangan secara berdampingan.
                </p>
              </div>
              <div className="text-[10px] text-[#1A3B32]/60 font-mono">Matriks Materiil</div>
            </div>

            {/* Step 5 */}
            <div className="bg-white p-5 rounded-xl border border-[#1A3B32]/15 shadow-2xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-amber-700 text-white font-mono font-bold text-xs flex items-center justify-center mb-3">
                  05
                </div>
                <h4 className="font-bold text-[#1A3B32] text-xs uppercase tracking-wide">
                  Verifikasi Manusia & Ekspor
                </h4>
                <p className="text-[11px] text-[#1A3B32]/75 mt-1 leading-relaxed">
                  Tinjauan substantif oleh penelaah resmi, penandatanganan draf, penguncian snapshot riwayat, dan ekspor lembar berkas dengan watermark KUHAP.
                </p>
              </div>
              <div className="text-[10px] text-amber-900 font-mono font-bold">Verifikasi & Cetak</div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PREVIEW DASHBOARD (LIVE SHOWCASE COMPONENT) */}
      <section id="preview" className="py-20 bg-white border-b border-[#1A3B32]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-amber-800 font-bold text-xs uppercase tracking-wider font-mono">
                [Simulasi Sistem Langsung]
              </span>
              <h2 className="font-serif-elegant text-2xl sm:text-4xl font-bold text-[#1A3B32] tracking-tight mt-1">
                Pratinjau Lembar Telaah Perkara Fiktif
              </h2>
              <p className="text-xs sm:text-sm text-[#1A3B32]/75 mt-2 max-w-2xl">
                Contoh kasus simulasi: <em>{activeCase.matter.title}</em> ({activeCase.matter.refNumber}). Klik tab di bawah untuk melihat cuplikan instrumen analitik.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenActiveCase('analysis')}
                className="px-4 py-2.5 bg-[#1A3B32] hover:bg-[#122A23] text-amber-200 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-2 shadow-2xs"
              >
                <span>Buka Perkara Ini di Workspace Lengkap</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Preview Container */}
          <div className="bg-[#F9F6F0] border border-[#1A3B32]/20 rounded-2xl overflow-hidden shadow-sm">
            {/* Window header */}
            <div className="bg-[#1A3B32] text-amber-100 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-[#1A3B32]/30">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                </div>
                <span className="text-xs font-mono text-amber-200 border-l border-[#1A3B32]/50 pl-3">
                  Berkas Perkara: <strong>{activeCase.matter.refNumber}</strong> · Tahap: {activeCase.matter.stage}
                </span>
              </div>

              {/* Sub-tab switcher */}
              <div className="flex items-center bg-[#122A23] p-1 rounded-lg border border-[#1A3B32] text-xs">
                <button
                  onClick={() => setPreviewTab('timeline')}
                  className={`px-3 py-1 rounded font-medium transition cursor-pointer ${
                    previewTab === 'timeline'
                      ? 'bg-[#1A3B32] text-amber-300 font-bold'
                      : 'text-amber-200/70 hover:text-white'
                  }`}
                >
                  Kronologi & Celah Waktu
                </button>
                <button
                  onClick={() => setPreviewTab('matrix')}
                  className={`px-3 py-1 rounded font-medium transition cursor-pointer ${
                    previewTab === 'matrix'
                      ? 'bg-[#1A3B32] text-amber-300 font-bold'
                      : 'text-amber-200/70 hover:text-white'
                  }`}
                >
                  Matriks Pembuktian
                </button>
                <button
                  onClick={() => setPreviewTab('procedure')}
                  className={`px-3 py-1 rounded font-medium transition cursor-pointer ${
                    previewTab === 'procedure'
                      ? 'bg-[#1A3B32] text-amber-300 font-bold'
                      : 'text-amber-200/70 hover:text-white'
                  }`}
                >
                  Uji Prosedur Mindik
                </button>
              </div>
            </div>

            {/* Preview Body */}
            <div className="p-6">
              {/* Tab A: Timeline Preview */}
              {previewTab === 'timeline' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-[#1A3B32] bg-white p-3 rounded-lg border border-[#1A3B32]/15">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-700" />
                      <span className="font-semibold text-[#1A3B32]">
                        Alur Rekonstruksi Tempus & Indikator Celah ({activeCase.events.length} Peristiwa Terdaftar)
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 font-bold">
                      Deteksi Gap Kritis: 4 Hari 1 Jam
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {activeCase.events.slice(0, 2).map((e) => (
                      <div key={e.id} className="bg-white p-4 rounded-xl border border-[#1A3B32]/15 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[11px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            {e.startTime}
                          </span>
                          <span className="text-[10px] text-[#1A3B32]/60 font-semibold uppercase">
                            Tempus: {e.timeCertainty}
                          </span>
                        </div>
                        <h4 className="font-bold text-[#1A3B32]">{e.title}</h4>
                        <p className="text-[#1A3B32]/75 text-[11px] line-clamp-2">{e.description}</p>
                        <div className="pt-2 border-t border-[#1A3B32]/10 flex items-center justify-between text-[11px] text-[#1A3B32]/60">
                          <span>Lokasi: {e.place}</span>
                          <span className="text-emerald-700 font-bold">
                            {e.supportingEvidenceIds.length} Bukti Terhubung
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Sample gap indicator callout */}
                  <div className="p-3 bg-amber-50 border-2 border-dashed border-amber-300 rounded-xl text-xs text-amber-950 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                      <div>
                        <strong>Celah Waktu Terdeteksi: 4 Hari 1 Jam Tanpa Catatan Alibi</strong>
                        <div className="text-[11px] text-amber-900">
                          Jeda kritis antara pertemuan penawaran (10 Maret) ke penandatanganan akad (14 Maret).
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-white text-amber-900 px-2.5 py-1 rounded border border-amber-300 shrink-0">
                      Perlu Saksi Alibi
                    </span>
                  </div>
                </div>
              )}

              {/* Tab B: Matrix Preview */}
              {previewTab === 'matrix' && (
                <div className="space-y-4">
                  <div className="bg-white p-3 rounded-lg border border-[#1A3B32]/15 text-xs flex items-center justify-between">
                    <span className="font-semibold text-[#1A3B32]">
                      Matriks Unsur Delik ({activeCase.charges[0]?.articleName || 'Pasal 378 KUHP'})
                    </span>
                    <span className="text-[11px] text-amber-800 font-bold uppercase">
                      Status Non-Konklusif (Zero Auto-Guilt)
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left bg-white border border-[#1A3B32]/15 rounded-lg overflow-hidden">
                      <thead className="bg-[#1A3B32]/5 font-bold text-[#1A3B32] border-b border-[#1A3B32]/15">
                        <tr>
                          <th className="p-2.5">Unsur Pasal</th>
                          <th className="p-2.5 border-l border-[#1A3B32]/15">Alat Bukti Pendukung</th>
                          <th className="p-2.5 border-l border-[#1A3B32]/15">Bantahan / Sanggahan</th>
                          <th className="p-2.5 border-l border-[#1A3B32]/15">Status Pembuktian</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1A3B32]/10">
                        {activeCase.elements.slice(0, 2).map((elem) => (
                          <tr key={elem.id}>
                            <td className="p-2.5 align-top">
                              <span className="font-bold text-amber-900 block">{elem.elementCode}</span>
                              <span className="text-[#1A3B32]">{elem.title}</span>
                            </td>
                            <td className="p-2.5 border-l border-[#1A3B32]/15 align-top text-[#1A3B32]/80">
                              {elem.linkedEvidenceIds.length > 0 ? (
                                <span className="text-emerald-700 font-semibold">
                                  ✓ {elem.linkedEvidenceIds.length} Alat Bukti Tertaut (Pasal 184)
                                </span>
                              ) : (
                                <span className="text-gray-400 italic">Belum ada bukti</span>
                              )}
                            </td>
                            <td className="p-2.5 border-l border-[#1A3B32]/15 align-top text-[#1A3B32]/80">
                              <span className="text-rose-800 font-semibold">
                                Disangkal pihak terlapor dalam BAP
                              </span>
                            </td>
                            <td className="p-2.5 border-l border-[#1A3B32]/15 align-top">
                              <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[10px] font-bold">
                                {elem.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab C: Procedure Mindik Preview */}
              {previewTab === 'procedure' && (
                <div className="space-y-4">
                  <div className="bg-white p-3 rounded-lg border border-[#1A3B32]/15 text-xs flex items-center justify-between">
                    <span className="font-semibold text-[#1A3B32]">
                      Checklist Kepatuhan Acara Pidana ({activeCase.procedureChecks.length} Instrumen)
                    </span>
                    <span className="text-[11px] text-[#1A3B32]/60 font-mono">
                      Wajib Mencantumkan Sumber Dokumen & Reviewer
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {activeCase.procedureChecks.slice(0, 2).map((pc) => (
                      <div key={pc.id} className="bg-white p-3 rounded-lg border border-[#1A3B32]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] bg-amber-50 px-1.5 py-0.5 rounded text-amber-900 font-bold border border-amber-200">
                              {pc.code}
                            </span>
                            <span className="font-semibold text-[#1A3B32]">{pc.label}</span>
                          </div>
                          <div className="text-[11px] text-[#1A3B32]/60 mt-0.5">
                            Sumber: {pc.sumber} · Reviewer: {pc.reviewer}
                          </div>
                        </div>

                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                          pc.status === 'didukung dokumen'
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-amber-100 text-amber-900'
                        }`}>
                          {pc.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Window Footer Action */}
            <div className="bg-[#1A3B32]/5 px-5 py-3 border-t border-[#1A3B32]/15 flex items-center justify-between text-xs text-[#1A3B32]/80">
              <span>Sistem siap digunakan untuk telaah perkara baru atau impor data JSON</span>
              <button
                onClick={handleLaunchDashboard}
                aria-label="Buka dashboard workspace telaah perkara pratinjau"
                className="font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-600 rounded px-2 py-1 transition duration-200"
              >
                <span>Buka Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. EMPAT PRINSIP UTAMA SISTEM */}
      <section id="prinsip" className="py-20 bg-[#F9F6F0] border-b border-[#1A3B32]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-14 space-y-3">
            <span className="text-amber-800 font-bold text-xs uppercase tracking-wider font-mono">
              [Integritas Komputasi Hukum]
            </span>
            <h2 className="font-serif-elegant text-2xl sm:text-4xl font-bold text-[#1A3B32] tracking-tight">
              Empat Prinsip Integritas Yuridis
            </h2>
            <p className="text-xs sm:text-sm text-[#1A3B32]/75 leading-relaxed">
              Sistem ini dibangun dengan disiplin etika dan batasan komputasi hukum yang tegas:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Prinsip 1 */}
            <div className="p-6 bg-white rounded-2xl border border-[#1A3B32]/15 shadow-2xs space-y-3 hover:border-amber-600 transition">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-800 flex items-center justify-center font-bold font-serif-heading text-lg">
                1
              </div>
              <h3 className="font-bold text-[#1A3B32] text-sm flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Tidak menyatakan seseorang bersalah.</span>
              </h3>
              <p className="text-xs text-[#1A3B32]/80 leading-relaxed">
                Sistem menolak merumuskan penetapan status bersalah secara otomatis. Penentuan kesalahan terdakwa mutlak merupakan wewenang majelis hakim di persidangan berdasarkan keyakinan hakim dan sekurang-kurangnya dua alat bukti yang sah (Pasal 183 KUHAP).
              </p>
            </div>

            {/* Prinsip 2 */}
            <div className="p-6 bg-white rounded-2xl border border-[#1A3B32]/15 shadow-2xs space-y-3 hover:border-amber-600 transition">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-800 flex items-center justify-center font-bold font-serif-heading text-lg">
                2
              </div>
              <h3 className="font-bold text-[#1A3B32] text-sm flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Tidak memprediksi putusan.</span>
              </h3>
              <p className="text-xs text-[#1A3B32]/80 leading-relaxed">
                Sistem tidak menghasilkan skor peluang, persentase menang/kalah, atau ramalan amar putusan. Seluruh instrumen dirancang secara objektif untuk membantu penelaah memetakan fakta materiil.
              </p>
            </div>

            {/* Prinsip 3 */}
            <div className="p-6 bg-white rounded-2xl border border-[#1A3B32]/15 shadow-2xs space-y-3 hover:border-amber-600 transition">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-800 flex items-center justify-center font-bold font-serif-heading text-lg">
                3
              </div>
              <h3 className="font-bold text-[#1A3B32] text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Tidak mengarang sumber hukum.</span>
              </h3>
              <p className="text-xs text-[#1A3B32]/80 leading-relaxed">
                Sistem menolak fabrikasi atau penciptaan pasal fiktif. Seluruh rujukan yuridis wajib bersumber dari regulasi perundang-undangan autentik (KUHAP, KUHP, UU ITE, dll.) lengkap dengan nomor/tahun, pasal/ayat, dan status verifikasi.
              </p>
            </div>

            {/* Prinsip 4 */}
            <div className="p-6 bg-white rounded-2xl border border-[#1A3B32]/15 shadow-2xs space-y-3 hover:border-amber-600 transition">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-800 flex items-center justify-center font-bold font-serif-heading text-lg">
                4
              </div>
              <h3 className="font-bold text-[#1A3B32] text-sm flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Tidak mengklaim keamanan produksi yang belum dikonfigurasi.</span>
              </h3>
              <p className="text-xs text-[#1A3B32]/80 leading-relaxed">
                Sistem sepenuhnya jujur dan transparan mengenai arsitekturnya. Aplikasi tidak membuat klaim enkripsi enterprise; data disimpan pada peramban lokal pengguna dalam mode simulasi tanpa server backend terkonfigurasi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. BAGIAN KETAHUI BATASAN PRATINJAU INI */}
      <section id="batasan-pratinjau" className="py-20 bg-[#1A3B32] text-amber-100 border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-14 space-y-3">
            <span className="text-amber-300 font-bold text-xs uppercase tracking-wider font-mono">
              [Transparansi Batasan Sistem]
            </span>
            <h2 className="font-serif-elegant text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Ketahui Batasan Pratinjau Ini
            </h2>
            <p className="text-xs sm:text-sm text-amber-100/85 leading-relaxed">
              Pengguna wajib memahami karakteristik teknis dan batasan hukum operasional dari prototipe simulasi ini:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto text-xs">
            {/* Batasan 1 */}
            <div className="p-5 rounded-xl bg-[#122A23] border border-amber-500/30 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm mb-2">
                  <HardDrive className="w-4 h-4 shrink-0" />
                  <span>Data Disimpan Lokal pada Browser</span>
                </div>
                <p className="text-amber-100/90 leading-relaxed">
                  Semua berkas perkara, entitas pihak, kronologi tempus, bukti fisik, dan catatan telaah disimpan murni pada HTML5 LocalStorage peramban Anda tanpa sinkronisasi internet. Menghapus cache atau riwayat browser akan menghapus data kerja lokal.
                </p>
              </div>
              <div className="text-[10px] text-amber-300 font-mono bg-[#0F221D] p-2 rounded border border-amber-500/20">
                Penyimpanan: Client-side Browser Storage
              </div>
            </div>

            {/* Batasan 2 */}
            <div className="p-5 rounded-xl bg-[#122A23] border border-amber-500/30 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm mb-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>Bukan Repositori Perkara Resmi</span>
                </div>
                <p className="text-amber-100/90 leading-relaxed">
                  Aplikasi ini bukan sistem registrasi perkara (SIPP/CMS) milik Kepolisian, Kejaksaan, atau Pengadilan. Sistem ini tidak memiliki keterkaitan kelembagaan dengan instansi penegak hukum mana pun dan tidak dapat dijadikan arsip perkara negara.
                </p>
              </div>
              <div className="text-[10px] text-amber-300 font-mono bg-[#0F221D] p-2 rounded border border-amber-500/20">
                Status: Prototipe Analitik Mandiri
              </div>
            </div>

            {/* Batasan 3 */}
            <div className="p-5 rounded-xl bg-[#122A23] border border-amber-500/30 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm mb-2">
                  <History className="w-4 h-4 shrink-0" />
                  <span>Bukan Audit Log Server</span>
                </div>
                <p className="text-amber-100/90 leading-relaxed">
                  Panel audit trail yang tersedia merupakan catatan sesi kerja lokal di peramban pengguna untuk keperluan perbandingan draf. Ini bukan log server *append-only* anti-manipulasi yang terpusat.
                </p>
              </div>
              <div className="text-[10px] text-amber-300 font-mono bg-[#0F221D] p-2 rounded border border-amber-500/20">
                Audit: Local Activity Tracking Only
              </div>
            </div>

            {/* Batasan 4 */}
            <div className="p-5 rounded-xl bg-[#122A23] border border-amber-500/30 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm mb-2">
                  <FileCheck className="w-4 h-4 shrink-0" />
                  <span>Bukan Jaminan Chain of Custody</span>
                </div>
                <p className="text-amber-100/90 leading-relaxed">
                  Pencatatan nomor register sita, lokasi simpan, dan nilai hash SHA-256 merupakan simulasi penataan administratif berkas, bukan pengganti rantai simpan bukti fisik (*chain of custody*) resmi menurut KUHAP.
                </p>
              </div>
              <div className="text-[10px] text-amber-300 font-mono bg-[#0F221D] p-2 rounded border border-amber-500/20">
                Keabsahan: Wajib Dokumen Fisik Otentik
              </div>
            </div>
          </div>

          <div className="mt-10 max-w-2xl mx-auto text-center">
            <button
              onClick={onOpenSecurityNotice}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#122A23] hover:bg-[#1A3B32] border border-amber-500/40 rounded-lg text-xs font-semibold text-amber-200 transition cursor-pointer shadow-sm"
            >
              <Info className="w-3.5 h-3.5" />
              <span>Buka Modal Penjelasan Keamanan & Batasan Storage Lengkap</span>
            </button>
          </div>
        </div>
      </section>

      {/* 10. CALL TO ACTION (CTA SECTION) */}
      <section className="py-20 bg-gradient-to-b from-[#1A3B32] to-[#122A23] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.08] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center mx-auto">
            <Scale className="w-6 h-6" />
          </div>

          <h2 className="font-serif-elegant text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Mulai Telaah Perkara Secara Sistematis & Objektif
          </h2>

          <p className="text-amber-100/90 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Eksplorasi dataset perkara investasi fiktif yang telah disiapkan, lakukan simulasi pergeseran kronologi, petakan matriks pembuktian, atau masukkan perkara baru secara lokal.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            {/* Button 1: Buka Dashboard */}
            <button
              onClick={handleLaunchDashboard}
              disabled={dashboardBtnState === 'loading'}
              aria-label="Buka dashboard workspace telaah perkara pratinjau"
              className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow-xl hover:shadow-2xl transition duration-200 cursor-pointer flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-amber-300 active:scale-95"
            >
              {dashboardBtnState === 'loading' ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" aria-hidden="true" />
              ) : dashboardBtnState === 'success' ? (
                <Check className="w-4 h-4 text-slate-950" aria-hidden="true" />
              ) : (
                <FolderOpen className="w-4 h-4 text-slate-950" aria-hidden="true" />
              )}
              <span>Buka Dashboard</span>
              <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition duration-200" aria-hidden="true" />
            </button>

            {/* Button 2: Buat Perkara Baru */}
            <button
              onClick={handleLaunchNewCase}
              disabled={newCaseBtnState === 'loading'}
              aria-label="Daftarkan berkas perkara pidana baru"
              className="px-6 py-4 bg-[#122A23] hover:bg-[#0F221D] border border-amber-500/40 text-amber-200 font-bold text-sm rounded-xl transition duration-200 cursor-pointer flex items-center gap-2 active:scale-95"
            >
              {newCaseBtnState === 'loading' ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-300" aria-hidden="true" />
              ) : newCaseBtnState === 'success' ? (
                <Check className="w-4 h-4 text-emerald-400" aria-hidden="true" />
              ) : (
                <Plus className="w-4 h-4 text-amber-300" aria-hidden="true" />
              )}
              <span>Buat Perkara Baru</span>
            </button>

            {/* Button 3: Buka Kasus Pratinjau */}
            <button
              onClick={() => onOpenActiveCase('editor')}
              aria-label={`Buka editor berkas tahap per tahap untuk perkara ${activeCase.matter.refNumber}`}
              className="px-6 py-4 bg-[#1A3B32] hover:bg-[#153129] border border-amber-500/30 text-amber-100 font-medium text-sm rounded-xl transition duration-200 cursor-pointer"
            >
              Buka Editor Berkas ({activeCase.matter.refNumber})
            </button>
          </div>

          <p className="text-[11px] text-amber-200/80 font-mono pt-2">
            * 100% Berjalan di Browser Anda · Tanpa Perlu Akun & Tanpa Backend Server
          </p>
        </div>
      </section>

      {/* 11. FOOTER */}
      <footer className="bg-[#122A23] border-t border-amber-500/20 py-12 text-amber-100/70 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-amber-500/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <span className="font-serif-heading font-bold text-sm text-white tracking-wider">
                  LEX<span className="text-amber-300">ANALYTICA</span> PIDANA
                </span>
                <span className="text-[10px] text-amber-200/60 block">
                  Prototipe Analisis Rekonstruksi Pembuktian Pidana (Pratinjau Frontend)
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-[11px] text-amber-200/80">
              <button
                onClick={onOpenDashboard}
                className="hover:text-amber-300 transition cursor-pointer"
              >
                Dashboard Perkara
              </button>
              <button
                onClick={() => onOpenActiveCase('analysis')}
                className="hover:text-amber-300 transition cursor-pointer"
              >
                Hasil Analisis & Gelar
              </button>
              <button
                onClick={onOpenSecurityNotice}
                className="hover:text-amber-300 transition cursor-pointer"
              >
                Kebijakan Keamanan & Storage
              </button>
              <a href="#top" className="hover:text-amber-300 transition">
                Kembali ke Atas ↑
              </a>
            </div>
          </div>

          {/* Legal Disclaimer Box in Footer */}
          <div className="p-4 rounded-xl bg-[#0F221D] border border-amber-500/30 text-[11px] text-amber-100/85 leading-relaxed space-y-2">
            <div className="font-bold text-amber-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>PENAFIAN HUKUM & BATASAN PENGGUNAAN (LEGAL DISCLAIMER):</span>
            </div>
            <p>
              Aplikasi ini adalah media simulasi dan tata kelola analitik perkara pidana (PRATINJAU — BUKAN PERKARA NYATA). Seluruh data, peristiwa, nomor registrasi laporan, nama subjek hukum, dan dokumen pembuktian adalah FIKTIF semata untuk kepentingan percontohan analitis. Aplikasi ini bukan produk resmi instansi penegak hukum mana pun.
            </p>
            <p className="text-amber-200/70">
              Sistem ini tidak memberikan nasihat hukum yang mengikat dan tidak menggantikan kemandirian serta pertimbangan majelis hakim di persidangan. Asas praduga tak bersalah dijunjung tinggi dalam setiap modul sistem.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-amber-200/70 pt-2">
            <div>
              © 2026 LexAnalytica Pidana (Pratinjau Frontend). Beroperasi pada Skema Ekspor Standar v2.2.0.
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-amber-300">
              <span>WATERMARK: DRAF — PERLU VERIFIKASI MANUSIA</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
