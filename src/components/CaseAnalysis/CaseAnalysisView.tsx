import React, { useState } from 'react';
import { CaseFullPackage } from '../../types/case';
import { GapAnalysis } from './GapAnalysis';
import { InteractiveTimeline } from './InteractiveTimeline';
import { ExplicitGraph } from './ExplicitGraph';
import { ProofMatrix } from './ProofMatrix';
import { ContradictionDetectorView } from './ContradictionDetectorView';
import { ProcedureAndMeetingNotes } from './ProcedureAndMeetingNotes';
import { VersionDiffViewer } from './VersionDiffViewer';
import { ExplainabilityPanel } from './ExplainabilityPanel';
import {
  FileQuestion,
  Clock,
  GitBranch,
  Table,
  AlertTriangle,
  CheckSquare,
  FileSpreadsheet,
  ArrowLeft,
  GitCompare,
  HelpCircle
} from 'lucide-react';

interface Props {
  casePackage: CaseFullPackage;
  onUpdatePackage: (updated: CaseFullPackage, actionDesc?: string) => void;
  onBackToEditor: () => void;
}

export type AnalysisTabId =
  | 'gaps'
  | 'timeline'
  | 'graph'
  | 'matrix'
  | 'contradictions'
  | 'procedure'
  | 'snapshots'
  | 'explainability';

export const CaseAnalysisView: React.FC<Props> = ({
  casePackage,
  onUpdatePackage,
  onBackToEditor
}) => {
  const [activeTab, setActiveTab] = useState<AnalysisTabId>('gaps');

  const tabs: { id: AnalysisTabId; label: string; icon: React.ReactNode }[] = [
    {
      id: 'gaps',
      label: 'Ringkasan & Celah Data',
      icon: <FileQuestion className="w-3.5 h-3.5" />
    },
    {
      id: 'timeline',
      label: 'Kronologi & Gap Waktu',
      icon: <Clock className="w-3.5 h-3.5 text-amber-600" />
    },
    {
      id: 'graph',
      label: 'Graph Relasi Eksplisit',
      icon: <GitBranch className="w-3.5 h-3.5" />
    },
    {
      id: 'matrix',
      label: 'Matriks Pembuktian',
      icon: <Table className="w-3.5 h-3.5" />
    },
    {
      id: 'contradictions',
      label: 'Kandidat Kontradiksi',
      icon: <AlertTriangle className="w-3.5 h-3.5" />
    },
    {
      id: 'procedure',
      label: 'Mindik & Catatan Gelar',
      icon: <CheckSquare className="w-3.5 h-3.5" />
    },
    {
      id: 'snapshots',
      label: 'Snapshot & Diff Versi',
      icon: <GitCompare className="w-3.5 h-3.5 text-amber-600" />
    },
    {
      id: 'explainability',
      label: 'Mengapa Hasil Ini Muncul?',
      icon: <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="font-mono font-bold text-slate-800">{casePackage.matter.refNumber}</span>
            <span aria-hidden="true">·</span>
            <span>Tahap: {casePackage.matter.stage}</span>
            <span aria-hidden="true">·</span>
            <span>Versi {casePackage.matter.versionNumber}.0</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Hasil Analisis & Rekonstruksi Pembuktian
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {casePackage.matter.title}
          </p>
        </div>

        <button
          onClick={onBackToEditor}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition cursor-pointer self-start md:self-auto shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Editor Data</span>
        </button>
      </div>

      {/* Analysis Nav Tabs */}
      <div className="border-b border-slate-200 mb-6 overflow-x-auto scrollbar-none">
        <nav className="flex space-x-1 min-w-max pb-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold rounded-t-lg transition border-b-2 cursor-pointer ${
                  isActive
                    ? 'border-amber-600 text-amber-700 bg-amber-50/50'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span className={isActive ? 'text-amber-700' : 'text-slate-400'}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Panels */}
      <div>
        {activeTab === 'gaps' && <GapAnalysis casePackage={casePackage} />}

        {activeTab === 'timeline' && (
          <InteractiveTimeline
            casePackage={casePackage}
            onUpdateEvent={(updatedEvent, actionDesc) => {
              const updatedEvents = casePackage.events.map((e) =>
                e.id === updatedEvent.id ? updatedEvent : e
              );
              onUpdatePackage(
                { ...casePackage, events: updatedEvents },
                actionDesc || `Pembaruan Tempus Peristiwa: ${updatedEvent.title}`
              );
            }}
            onAddEvent={(newEvent) => {
              const updatedEvents = [...casePackage.events, newEvent];
              onUpdatePackage(
                { ...casePackage, events: updatedEvents },
                `Penambahan Peristiwa di Celah Tempus: ${newEvent.title}`
              );
            }}
          />
        )}

        {activeTab === 'graph' && (
          <ExplicitGraph
            links={casePackage.links}
            parties={casePackage.parties}
            facts={casePackage.facts}
            events={casePackage.events}
            evidences={casePackage.evidences}
            elements={casePackage.elements}
          />
        )}

        {activeTab === 'matrix' && (
          <ProofMatrix
            charges={casePackage.charges}
            elements={casePackage.elements}
            parties={casePackage.parties}
            facts={casePackage.facts}
            evidences={casePackage.evidences}
            casePackage={casePackage}
            onUpdateElement={(updatedElem) => {
              const updatedElements = casePackage.elements.map((e) =>
                e.id === updatedElem.id ? updatedElem : e
              );
              onUpdatePackage(
                { ...casePackage, elements: updatedElements },
                `Pembaruan Matriks Relevansi/Catatan: ${updatedElem.elementCode}`
              );
            }}
          />
        )}

        {activeTab === 'contradictions' && (
          <ContradictionDetectorView casePackage={casePackage} />
        )}

        {activeTab === 'procedure' && (
          <ProcedureAndMeetingNotes
            procedureChecks={casePackage.procedureChecks}
            meetingNotes={casePackage.meetingNotes}
            matterId={casePackage.matter.id}
            onUpdateProcedures={(updatedChecks) =>
              onUpdatePackage(
                { ...casePackage, procedureChecks: updatedChecks },
                'Pembaruan Checklist Prosedur Mindik'
              )
            }
            onUpdateNotes={(updatedNotes) =>
              onUpdatePackage(
                { ...casePackage, meetingNotes: updatedNotes },
                'Pembaruan Catatan Peserta Gelar Perkara'
              )
            }
          />
        )}

        {activeTab === 'snapshots' && (
          <VersionDiffViewer
            casePackage={casePackage}
            onRestoreSnapshot={(restoredPkg) =>
              onUpdatePackage(restoredPkg, 'Pemulihan Snapshot Versi Perkara')
            }
          />
        )}

        {activeTab === 'explainability' && <ExplainabilityPanel />}
      </div>
    </div>
  );
};
