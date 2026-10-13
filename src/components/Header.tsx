import React from 'react';
import { ArrowLeft, BookOpen, Layers, ShieldCheck, Scale, FileText } from 'lucide-react';

interface HeaderProps {
  activeView: 'landing' | 'dashboard' | 'editor' | 'analysis';
  onSetView: (view: 'landing' | 'dashboard' | 'editor' | 'analysis') => void;
  cases: any[];
  activeCase: any;
  onSelectCase: (id: string) => void;
  onNewCaseModalOpen: () => void;
  onExportModalOpen: () => void;
  onOpenSecurityModal: () => void;
  isMaskingActive: boolean;
  onToggleMasking: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onSetView,
  activeCase,
  onNewCaseModalOpen,
  onExportModalOpen
}) => {
  return (
    <header className="bg-[#1A3B32] text-white border-b border-amber-600/30 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between w-full">
        
        {/* KIRI: Logo & Judul Dua Baris (Wajib Tanpa Flex-Wrap & Whitespace-Nowrap) */}
        <div className="flex items-center gap-3">
          {/* Logo Icon */}
          <div 
            onClick={() => onSetView('landing')}
            className="w-11 h-11 rounded-xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center cursor-pointer hover:bg-amber-600/30 transition flex-shrink-0 shadow-inner"
            title="Kembali ke Beranda"
          >
            <Scale className="w-6 h-6 text-amber-400" />
          </div>

          {/* Wadah Teks Judul */}
          <div className="flex flex-col">
            <h1 className="text-sm sm:text-base font-serif font-bold text-amber-100 whitespace-nowrap tracking-wide">
              ADHI - Lex Analitica Case Map
            </h1>
            <p className="text-xs text-amber-300/80 whitespace-nowrap font-sans">
              Sistem Telaah Berkas & Pemetaan Pembuktian Terstruktur
            </p>
          </div>
        </div>

        {/* KANAN: Navigasi Aksi (Wajib flex-shrink-0 agar tidak menekan teks kiri) */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => onSetView('dashboard')}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-2 ${
              activeView === 'dashboard'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-[#142f27] text-amber-100 hover:bg-[#204a3f] border border-amber-600/30'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>

          <button
            onClick={() => onSetView('analysis')}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-2 ${
              activeView === 'analysis'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-[#142f27] text-amber-100 hover:bg-[#204a3f] border border-amber-600/30'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">Analisis</span>
          </button>

          <button
            onClick={() => onSetView('editor')}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-2 ${
              activeView === 'editor'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-[#142f27] text-amber-100 hover:bg-[#204a3f] border border-amber-600/30'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span className="hidden lg:inline">Editor Berkas</span>
          </button>

          {/* Tombol Kembali ke Beranda */}
          <button
            onClick={() => onSetView('landing')}
            className="px-4 py-2 rounded-lg text-xs sm:text-sm font-medium bg-amber-600 hover:bg-amber-500 text-white transition flex items-center gap-1.5 shadow-md border border-amber-500"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </button>
        </div>

      </div>
    </header>
  );
};
