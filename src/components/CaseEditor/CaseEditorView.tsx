import React, { useState } from 'react';
import { CaseFullPackage } from '../../types/case';
import { TabBasicData } from './TabBasicData';
import { TabParties } from './TabParties';
import { TabFactsClaims } from './TabFactsClaims';
import { TabChronology } from './TabChronology';
import { TabEvidence } from './TabEvidence';
import { TabChargesElements } from './TabChargesElements';
import { TabLegalBases } from './TabLegalBases';
import { TabStatements } from './TabStatements';
import { TabReview } from './TabReview';
import { TabRelations } from './TabRelations';
import {
  FileText,
  Users,
  Quote,
  Calendar,
  PackageCheck,
  Scale,
  BookOpen,
  MessageSquare,
  ShieldCheck,
  GitBranch,
  ArrowRight,
  Eye,
  Landmark
} from 'lucide-react';

interface Props {
  casePackage: CaseFullPackage;
  onUpdatePackage: (updated: CaseFullPackage, actionDesc?: string) => void;
  onGoToAnalysis: () => void;
}

export type EditorTabId =
  | 'basic'
  | 'parties'
  | 'facts'
  | 'chronology'
  | 'evidence'
  | 'charges'
  | 'legalBases'
  | 'statements'
  | 'relations'
  | 'review';

export const CaseEditorView: React.FC<Props> = ({
  casePackage,
  onUpdatePackage,
  onGoToAnalysis
}) => {
  const [activeTab, setActiveTab] = useState<EditorTabId>('basic');

  const tabs: { id: EditorTabId; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'basic', label: 'A. Data Dasar', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'parties', label: 'B. Pihak', icon: <Users className="w-3.5 h-3.5" />, count: casePackage.parties.length },
    { id: 'facts', label: 'C. Fakta/Klaim', icon: <Quote className="w-3.5 h-3.5" />, count: casePackage.facts.length },
    { id: 'chronology', label: 'D. Kronologi', icon: <Calendar className="w-3.5 h-3.5" />, count: casePackage.events.length },
    { id: 'evidence', label: 'E. Bukti & Sita', icon: <PackageCheck className="w-3.5 h-3.5" />, count: casePackage.evidences.length },
    { id: 'charges', label: 'F. Pasal & Unsur', icon: <Scale className="w-3.5 h-3.5" />, count: casePackage.elements.length },
    { id: 'legalBases', label: 'Dasar Hukum & Sumber', icon: <BookOpen className="w-3.5 h-3.5" />, count: (casePackage.legalBases || []).length },
    { id: 'statements', label: 'G. Keterangan', icon: <MessageSquare className="w-3.5 h-3.5" />, count: casePackage.statements.length },
    { id: 'relations', label: 'Relasi Eksplisit', icon: <GitBranch className="w-3.5 h-3.5" />, count: casePackage.links.length },
    { id: 'review', label: 'H. Review & Snapshot', icon: <ShieldCheck className="w-3.5 h-3.5" /> }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Case Header Strip */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="font-mono font-bold text-slate-800">{casePackage.matter.refNumber}</span>
            <span aria-hidden="true">·</span>
            <span>Tahap: <strong>{casePackage.matter.stage}</strong></span>
            <span aria-hidden="true">·</span>
            <span>Jenis: <strong>{casePackage.matter.caseType || 'Pidana Umum'}</strong></span>
            <span aria-hidden="true">·</span>
            <span>Yurisdiksi: <strong>{casePackage.matter.jurisdiction || 'PN Setempat'}</strong></span>
            <span aria-hidden="true">·</span>
            <span>Snapshot: <strong>{casePackage.matter.legalSnapshotDate || '-'}</strong></span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {casePackage.matter.title}
          </h1>
        </div>

        <button
          onClick={onGoToAnalysis}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 font-semibold text-xs rounded-lg shadow-xs transition cursor-pointer self-start md:self-auto shrink-0"
        >
          <Eye className="w-4 h-4 text-amber-400" />
          <span>Lihat Hasil Analisis & Gelar</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Editor Tabs Nav - Clean typography bar */}
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
                {typeof tab.count === 'number' && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-amber-200/80 text-amber-900' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Panels */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        {activeTab === 'basic' && (
          <TabBasicData
            matter={casePackage.matter}
            onChange={(updated) =>
              onUpdatePackage(
                { ...casePackage, matter: updated },
                `Pembaruan Data Dasar Perkara: ${updated.title}`
              )
            }
          />
        )}

        {activeTab === 'parties' && (
          <TabParties
            parties={casePackage.parties}
            matterId={casePackage.matter.id}
            onChange={(updated) =>
              onUpdatePackage(
                { ...casePackage, parties: updated },
                `Pembaruan Daftar Pihak (${updated.length} pihak)`
              )
            }
          />
        )}

        {activeTab === 'facts' && (
          <TabFactsClaims
            facts={casePackage.facts}
            matterId={casePackage.matter.id}
            onChange={(updated) =>
              onUpdatePackage(
                { ...casePackage, facts: updated },
                `Pembaruan Fakta & Klaim (${updated.length} butir)`
              )
            }
          />
        )}

        {activeTab === 'chronology' && (
          <TabChronology
            events={casePackage.events}
            parties={casePackage.parties}
            evidences={casePackage.evidences}
            matterId={casePackage.matter.id}
            onChange={(updated) =>
              onUpdatePackage(
                { ...casePackage, events: updated },
                `Pembaruan Alur Kronologi (${updated.length} peristiwa)`
              )
            }
          />
        )}

        {activeTab === 'evidence' && (
          <TabEvidence
            evidences={casePackage.evidences}
            matterId={casePackage.matter.id}
            onChange={(updated) =>
              onUpdatePackage(
                { ...casePackage, evidences: updated },
                `Pembaruan Katalog Alat Bukti (${updated.length} item)`
              )
            }
          />
        )}

        {activeTab === 'charges' && (
          <TabChargesElements
            charges={casePackage.charges}
            elements={casePackage.elements}
            facts={casePackage.facts}
            evidences={casePackage.evidences}
            matterId={casePackage.matter.id}
            onUpdateCharges={(updatedCharges) =>
              onUpdatePackage(
                { ...casePackage, charges: updatedCharges },
                `Pembaruan Pasal Sangkaan (${updatedCharges.length} pasal)`
              )
            }
            onUpdateElements={(updatedElements) =>
              onUpdatePackage(
                { ...casePackage, elements: updatedElements },
                `Pembaruan Unsur Delik (${updatedElements.length} unsur)`
              )
            }
          />
        )}

        {activeTab === 'legalBases' && (
          <TabLegalBases
            legalBases={casePackage.legalBases || []}
            matterId={casePackage.matter.id}
            onChange={(updatedBases) =>
              onUpdatePackage(
                { ...casePackage, legalBases: updatedBases },
                `Pembaruan Dasar Hukum & Sumber (${updatedBases.length} rujukan)`
              )
            }
          />
        )}

        {activeTab === 'statements' && (
          <TabStatements
            statements={casePackage.statements}
            parties={casePackage.parties}
            matterId={casePackage.matter.id}
            onChange={(updated) =>
              onUpdatePackage(
                { ...casePackage, statements: updated },
                `Pembaruan Keterangan BAP (${updated.length} transkrip)`
              )
            }
          />
        )}

        {activeTab === 'relations' && (
          <TabRelations
            links={casePackage.links}
            parties={casePackage.parties}
            facts={casePackage.facts}
            events={casePackage.events}
            evidences={casePackage.evidences}
            elements={casePackage.elements}
            matterId={casePackage.matter.id}
            onChange={(updated) =>
              onUpdatePackage(
                { ...casePackage, links: updated },
                `Pembaruan Relasi Eksplisit (${updated.length} tautan)`
              )
            }
          />
        )}

        {activeTab === 'review' && (
          <TabReview
            matter={casePackage.matter}
            review={casePackage.review}
            auditLogs={casePackage.auditLogs}
            onUpdateReview={(updatedRev) =>
              onUpdatePackage({ ...casePackage, review: updatedRev })
            }
            onUpdateMatter={(updatedMat) =>
              onUpdatePackage({ ...casePackage, matter: updatedMat })
            }
            onAddAuditLog={(action, details) => {
              const updatedPkg = {
                ...casePackage,
                auditLogs: [
                  {
                    id: 'log-' + Math.random().toString(36).substring(2, 8),
                    matterId: casePackage.matter.id,
                    timestamp: new Date().toLocaleString('id-ID'),
                    action,
                    details
                  },
                  ...casePackage.auditLogs
                ]
              };
              onUpdatePackage(updatedPkg);
            }}
          />
        )}
      </div>
    </div>
  );
};
