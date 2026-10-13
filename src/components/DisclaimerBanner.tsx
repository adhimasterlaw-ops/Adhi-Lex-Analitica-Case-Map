import React from 'react';
import { AlertTriangle, RotateCcw, ShieldAlert } from 'lucide-react';

interface Props {
  onResetPreview?: () => void;
  onOpenSecurityModal?: () => void;
}

export const DisclaimerBanner: React.FC<Props> = ({ onResetPreview, onOpenSecurityModal }) => {
  const handleReset = onResetPreview;

  return (
    <div className="bg-amber-950/90 text-amber-100 border-b border-amber-800/80 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 no-print">
      <div className="flex items-center gap-2 max-w-4xl">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
        <div>
          <span className="text-amber-200/90 font-medium">
            PRATINJAU — Aplikasi ini bukan sistem peradilan resmi, bukan repositori perkara, bukan pengganti advokat atau pejabat berwenang, dan tidak memberikan putusan maupun nasihat hukum final.
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {onOpenSecurityModal && (
          <button
            onClick={onOpenSecurityModal}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-900/60 hover:bg-amber-800 border border-amber-700/60 text-amber-200 font-medium text-xs transition cursor-pointer"
            title="Penjelasan batasan localStorage, audit log server, dan rantai bukti"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Batasan & Keamanan Storage</span>
          </button>
        )}

        {handleReset && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-900/90 hover:bg-amber-800 border border-amber-700/80 text-amber-100 font-medium text-xs transition cursor-pointer"
            title="Kembalikan dataset pratinjau awal"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset Data Pratinjau</span>
          </button>
        )}
      </div>
    </div>
  );
};
