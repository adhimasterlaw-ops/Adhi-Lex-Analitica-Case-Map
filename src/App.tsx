import React, { useState, useEffect } from 'react';
import {
  CaseFullPackage,
  Matter
} from './types/case';
import {
  getStoredCases,
  saveStoredCases,
  getActiveCaseId,
  setActiveCaseId,
  resetToPreviewData,
  updateCasePackage,
  deleteCaseById
} from './lib/storage';
import { createMaskedCasePackage } from './lib/masking';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { CaseEditorView } from './components/CaseEditor/CaseEditorView';
import { CaseAnalysisView } from './components/CaseAnalysis/CaseAnalysisView';
import { ExportPrintModal } from './components/ExportPrintModal';
import { NewCaseModal } from './components/NewCaseModal';
import { PrintView } from './components/PrintView';
import { StorageSecurityNoticeModal } from './components/StorageSecurityNoticeModal';
import { LandingPage } from './components/LandingPage/LandingPage';

export default function App() {
  const [cases, setCases] = useState<CaseFullPackage[]>(() => getStoredCases());
  const [activeCaseIdState, setActiveCaseIdState] = useState<string>(() => getActiveCaseId());
  const [activeView, setActiveView] = useState<'landing' | 'editor' | 'analysis' | 'dashboard'>('landing');
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isGlobalMaskingEnabled, setIsGlobalMaskingEnabled] = useState(false);

  // Active case object
  const rawActiveCase =
    cases.find((c) => c.matter.id === activeCaseIdState) || cases[0] || null;

  const activeCase =
    rawActiveCase && isGlobalMaskingEnabled
      ? createMaskedCasePackage(rawActiveCase)
      : rawActiveCase;

  // Sync active case ID if needed
  const handleSelectCase = (id: string) => {
    setActiveCaseIdState(id);
    setActiveCaseId(id);
  };

  const handleUpdatePackage = (updatedPkg: CaseFullPackage, actionDesc?: string) => {
    const updatedCases = updateCasePackage(updatedPkg, actionDesc);
    setCases(updatedCases);
  };

  const handleDeleteCase = (id: string) => {
    const remaining = deleteCaseById(id);
    setCases(remaining);
    setActiveCaseIdState(getActiveCaseId());
  };

  const handleResetPreview = () => {
    if (confirm('Kembalikan semua berkas ke data pratinjau awal? Perubahan lokal Anda akan digantikan.')) {
      const previewCases = resetToPreviewData();
      setCases(previewCases);
      setActiveCaseIdState(previewCases[0].matter.id);
    }
  };

  const handleCaseCreated = (newCase: CaseFullPackage) => {
    setCases(getStoredCases());
    setActiveCaseIdState(newCase.matter.id);
    setActiveView('editor');
  };

  const handleImportCase = (imported: CaseFullPackage) => {
    const current = getStoredCases();
    const existingIndex = current.findIndex((c) => c.matter.id === imported.matter.id);
    let updated: CaseFullPackage[];
    if (existingIndex >= 0) {
      updated = current.map((c) => (c.matter.id === imported.matter.id ? imported : c));
    } else {
      updated = [imported, ...current];
    }
    saveStoredCases(updated);
    setCases(updated);
    setActiveCaseIdState(imported.matter.id);
  };

  if (!activeCase) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-100 text-slate-800">
        <div className="text-center">
          <p className="text-sm">Tidak ada berkas perkara ditemukan.</p>
          <button
            onClick={handleResetPreview}
            className="mt-3 px-4 py-2 bg-amber-600 text-white rounded text-xs font-semibold"
          >
            Pulihkan Data Pratinjau
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* 0. Dedicated Landing Page View */}
      {activeView === 'landing' ? (
        <LandingPage
          activeCase={activeCase}
          onOpenDashboard={() => setActiveView('dashboard')}
          onOpenActiveCase={(target) => setActiveView(target)}
          onOpenSecurityNotice={() => setIsSecurityModalOpen(true)}
          onOpenNewCase={() => setIsNewCaseModalOpen(true)}
        />
      ) : (
        <>
          {/* 1. Global Non-conclusive Preview Banner (hidden on dashboard view) */}
          {activeView !== 'dashboard' && (
            <DisclaimerBanner
              onResetPreview={handleResetPreview}
              onOpenSecurityModal={() => setIsSecurityModalOpen(true)}
            />
          )}

          {/* 2. Top Navigation Bar */}
          <Header
            cases={cases}
            activeCase={activeCase}
            activeView={activeView}
            onSelectCase={handleSelectCase}
            onSetView={setActiveView}
            onNewCaseModalOpen={() => setIsNewCaseModalOpen(true)}
            onExportModalOpen={() => setIsExportModalOpen(true)}
            onOpenSecurityModal={() => setIsSecurityModalOpen(true)}
            isMaskingActive={isGlobalMaskingEnabled}
            onToggleMasking={() => setIsGlobalMaskingEnabled(!isGlobalMaskingEnabled)}
          />

          {/* 3. Main Workspace Views */}
          <main className="flex-1 pb-16 no-print">
            {activeView === 'dashboard' && (
              <DashboardView
                cases={cases}
                activeCaseId={activeCase.matter.id}
                onSelectCase={(id) => {
                  handleSelectCase(id);
                  setActiveView('editor');
                }}
                onOpenEditor={(id) => {
                  handleSelectCase(id);
                  setActiveView('editor');
                }}
                onOpenAnalysis={(id) => {
                  handleSelectCase(id);
                  setActiveView('analysis');
                }}
                onDeleteCase={handleDeleteCase}
                onNewCaseClick={() => setIsNewCaseModalOpen(true)}
                onResetPreview={handleResetPreview}
              />
            )}

            {activeView === 'editor' && (
              <CaseEditorView
                casePackage={activeCase}
                onUpdatePackage={handleUpdatePackage}
                onGoToAnalysis={() => setActiveView('analysis')}
              />
            )}

            {activeView === 'analysis' && (
              <CaseAnalysisView
                casePackage={activeCase}
                onUpdatePackage={handleUpdatePackage}
                onBackToEditor={() => setActiveView('editor')}
              />
            )}
          </main>

          {/* 4. Footer info bar */}
          <footer className="border-t border-slate-200 bg-white py-4 px-6 text-xs text-slate-500 no-print">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
              <div>
                <span className="font-semibold text-slate-700">LexAnalytica Pidana (Pratinjau Frontend)</span> · Hak Cipta Fiktif.
              </div>
              <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                <button
                  onClick={() => setActiveView('landing')}
                  className="hover:text-slate-700 underline cursor-pointer"
                >
                  Kembali ke Halaman Muka
                </button>
                <span aria-hidden="true">·</span>
                <span>Penyimpanan: Web LocalStorage</span>
                <span aria-hidden="true">·</span>
                <span>Non-Konklusif / Asas Praduga Tak Bersalah</span>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* 5. Printable Version (rendered only on print media) */}
      <PrintView casePackage={activeCase} />

      {/* 6. Modals */}
      <NewCaseModal
        isOpen={isNewCaseModalOpen}
        onClose={() => setIsNewCaseModalOpen(false)}
        onCaseCreated={handleCaseCreated}
      />

      <ExportPrintModal
        isOpen={isExportModalOpen}
        casePackage={activeCase}
        allCases={cases}
        onClose={() => setIsExportModalOpen(false)}
        onImportCase={handleImportCase}
        onGoToReviewTab={() => setActiveView('editor')}
      />

      <StorageSecurityNoticeModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
      />
    </div>
  );
}
