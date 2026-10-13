import {
  CaseFullPackage,
  Matter,
  LocalAuditLog,
  ProcedureCheck,
  ProcedureCategory,
  ProcedureStatus,
  CaseSnapshot,
  CaseExportEnvelope,
  CaseExportPackageHeader
} from '../types/case';
import { MOCK_CASES, INITIAL_PROCEDURE_CHECKS } from '../data/mockData';
import { createMaskedCasePackage } from './masking';

const LEGACY_STORAGE_KEY = 'telaah_perkara_preview_cases_v2';
const STORAGE_KEY = 'telaah_perkara_preview_cases_v2';
const ACTIVE_CASE_KEY = 'telaah_perkara_active_case_id_v2';
const SNAPSHOTS_KEY_PREFIX = 'telaah_perkara_snapshots_v1_';

export function getStoredCases(): CaseFullPackage[] {
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Migrasi data pengguna lama jika ada tanpa menghapus data
      const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacyRaw) {
        raw = legacyRaw;
        try {
          localStorage.setItem(STORAGE_KEY, legacyRaw);
        } catch {
          // Abaikan kesalahan kuota
        }
      }
    }
    if (!raw) {
      saveStoredCases(MOCK_CASES);
      return MOCK_CASES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].matter?.id) {
      // Ensure backwards-compatible fields
      return parsed.map(c => sanitizeLoadedPackage(c));
    }
    saveStoredCases(MOCK_CASES);
    return MOCK_CASES;
  } catch (err) {
    console.error('Gagal membaca data dari localStorage, menggunakan fallback data pratinjau:', err);
    return MOCK_CASES;
  }
}

function sanitizeLoadedPackage(pkg: any): CaseFullPackage {
  const rawTitle = String(pkg.matter?.title || '');
  const cleanTitle = rawTitle.replace(/\s*\(Demo\)/gi, ' (Pratinjau)');
  const rawLead = String(pkg.matter?.leadInvestigator || '');
  const cleanLead = rawLead
    .replace(/\(Fiktif Demo\)/gi, '(Fiktif Pratinjau)')
    .replace(/Analis Perkara \(Demo\)/gi, 'Analis Perkara (Pratinjau)');

  return {
    ...pkg,
    matter: {
      ...pkg.matter,
      title: cleanTitle || pkg.matter?.title,
      leadInvestigator: cleanLead || pkg.matter?.leadInvestigator,
      jurisdiction: pkg.matter?.jurisdiction || 'Pengadilan Negeri Setempat',
      caseType: pkg.matter?.caseType || 'Tindak Pidana Umum',
      legalSnapshotDate: pkg.matter?.legalSnapshotDate || (pkg.matter?.registerDate || new Date().toISOString().split('T')[0]),
    },
    parties: Array.isArray(pkg.parties)
      ? pkg.parties.map((p: any) => ({
          ...p,
          idSource: String(p.idSource || '').replace(/\(Fiktif Demo\)/gi, '(Fiktif Pratinjau)'),
          notes: String(p.notes || '').replace(/\(Fiktif Demo\)/gi, '(Fiktif Pratinjau)')
        }))
      : [],
    legalBases: Array.isArray(pkg.legalBases) ? pkg.legalBases : [],
    procedureChecks: Array.isArray(pkg.procedureChecks) && pkg.procedureChecks.length > 0
      ? pkg.procedureChecks.map(sanitizeProcedureCheck)
      : INITIAL_PROCEDURE_CHECKS.map(p => ({ ...p, matterId: pkg.matter.id }))
  };
}

const ALLOWED_PROCEDURE_STATUSES: ProcedureStatus[] = [
  'belum dinilai',
  'didukung dokumen',
  'tidak didukung',
  'diperselisihkan',
  'tidak relevan',
  'perlu klarifikasi'
];

function sanitizeProcedureCheck(p: any): ProcedureCheck {
  let status: ProcedureStatus = 'belum dinilai';
  if (ALLOWED_PROCEDURE_STATUSES.includes(p.status)) {
    status = p.status;
  } else if (p.status === 'terpenuhi') {
    status = 'didukung dokumen';
  } else if (p.status === 'belum_terpenuhi') {
    status = 'tidak didukung';
  }

  return {
    id: p.id || 'proc-' + Math.random().toString(36).substring(2, 7),
    matterId: p.matterId || '',
    category: p.category || 'hak_pihak',
    code: p.code || 'KUHAP',
    label: p.label || 'Kepatuhan Acara Pidana',
    isMandatory: Boolean(p.isMandatory),
    status,
    sumber: String(p.sumber || p.documentRef || 'Belum dicatat'),
    kutipan: String(p.kutipan || '-'),
    alasan: String(p.alasan || p.notes || '-'),
    reviewer: String(p.reviewer || 'Analis Perkara (Pratinjau)'),
    updatedAt: p.updatedAt || new Date().toISOString()
  };
}

export function saveStoredCases(cases: CaseFullPackage[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
  } catch (err) {
    console.error('Gagal menyimpan ke localStorage:', err);
  }
}

export function getActiveCaseId(): string {
  try {
    const active = localStorage.getItem(ACTIVE_CASE_KEY);
    if (active) return active;
  } catch {
    // fallback
  }
  return MOCK_CASES[0].matter.id;
}

export function setActiveCaseId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_CASE_KEY, id);
  } catch (err) {
    console.error('Gagal menyimpan ID perkara aktif:', err);
  }
}

export function resetToPreviewData(): CaseFullPackage[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_CASES));
    localStorage.setItem(ACTIVE_CASE_KEY, MOCK_CASES[0].matter.id);
  } catch (err) {
    console.error('Gagal reset data pratinjau:', err);
  }
  return MOCK_CASES;
}

// Alias untuk kompatibilitas fungsi internal
export const resetToDemoData = resetToPreviewData;

export function appendAuditLog(casePkg: CaseFullPackage, action: string, details: string): CaseFullPackage {
  const newLog: LocalAuditLog = {
    id: 'log-' + Math.random().toString(36).substring(2, 9),
    matterId: casePkg.matter.id,
    timestamp: new Date().toLocaleString('id-ID'),
    action,
    details
  };
  return {
    ...casePkg,
    auditLogs: [newLog, ...(casePkg.auditLogs || [])]
  };
}

export function updateCasePackage(updatedPkg: CaseFullPackage, actionDesc?: string): CaseFullPackage[] {
  const cases = getStoredCases();
  const pkgWithAudit = actionDesc
    ? appendAuditLog(updatedPkg, 'Pembaruan Data', actionDesc)
    : updatedPkg;

  const updatedCases = cases.map(c => (c.matter.id === pkgWithAudit.matter.id ? pkgWithAudit : c));
  saveStoredCases(updatedCases);
  return updatedCases;
}

export function createNewCase(
  title: string,
  refNumber: string,
  category: string,
  jurisdiction = 'Pengadilan Negeri Jakarta Selatan',
  caseType = 'Tindak Pidana Umum'
): CaseFullPackage {
  const id = 'case-' + Math.random().toString(36).substring(2, 8);
  const now = new Date().toISOString();
  const todayDate = now.split('T')[0];

  const newMatter: Matter = {
    id,
    title,
    refNumber,
    category,
    stage: 'Penyelidikan',
    status: 'Aktif',
    jurisdiction,
    caseType,
    legalSnapshotDate: todayDate,
    incidentDate: todayDate,
    registerDate: todayDate,
    timeZone: 'WIB',
    locusDelicti: 'Belum ditentukan',
    initialSummary: 'Perkara baru didaftarkan secara manual pada penyimpanan lokal.',
    leadInvestigator: 'Analis Perkara (Pratinjau)',
    versionNumber: 1,
    reviewedByHuman: false,
    reviewNotes: '',
    createdAt: now,
    updatedAt: now
  };

  const defaultProcedureChecks: ProcedureCheck[] = INITIAL_PROCEDURE_CHECKS.map((p, idx) => ({
    ...p,
    id: `proc-new-${idx + 1}`,
    matterId: id,
    status: 'belum dinilai',
    sumber: 'Belum ada dokumen',
    kutipan: '-',
    alasan: 'Pemeriksaan kepatuhan prosedur belum dilakukan.',
    reviewer: 'Analis Perkara (Pratinjau)'
  }));

  const newPackage: CaseFullPackage = {
    matter: newMatter,
    parties: [],
    facts: [],
    events: [],
    evidences: [],
    charges: [],
    elements: [],
    statements: [],
    links: [],
    review: {
      id: 'rev-' + Math.random().toString(36).substring(2, 8),
      matterId: id,
      reviewedByHuman: false,
      reviewerName: '',
      reviewerRole: '',
      reviewDate: '',
      summaryOpinion: '',
      isSnapshotLocked: false,
      createdAt: now
    },
    meetingNotes: [],
    legalBases: [],
    procedureChecks: defaultProcedureChecks,
    auditLogs: [
      {
        id: 'log-init-' + Math.random().toString(36).substring(2, 8),
        matterId: id,
        timestamp: new Date().toLocaleString('id-ID'),
        action: 'Inisialisasi Perkara Baru',
        details: `Perkara dibuat: ${title} (${refNumber}) - Yurisdiksi: ${jurisdiction}`
      }
    ]
  };

  const currentCases = getStoredCases();
  const updatedCases = [newPackage, ...currentCases];
  saveStoredCases(updatedCases);
  setActiveCaseId(id);
  return newPackage;
}

export function deleteCaseById(id: string): CaseFullPackage[] {
  const currentCases = getStoredCases();
  const filtered = currentCases.filter(c => c.matter.id !== id);
  if (filtered.length === 0) {
    return resetToPreviewData();
  }
  saveStoredCases(filtered);
  const activeId = getActiveCaseId();
  if (activeId === id) {
    setActiveCaseId(filtered[0].matter.id);
  }
  return filtered;
}

// -------------------------------------------------------------
// SNAPSHOT LOKAL & RIWAYAT VERSI
// -------------------------------------------------------------

export function getCaseSnapshots(matterId: string): CaseSnapshot[] {
  try {
    const raw = localStorage.getItem(`${SNAPSHOTS_KEY_PREFIX}${matterId}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Gagal mengambil daftar snapshot perkara:', err);
    return [];
  }
}

export function saveCaseSnapshot(
  matterId: string,
  snapshotLabel: string,
  snapshotNotes: string,
  creatorName: string,
  currentPackage: CaseFullPackage
): CaseSnapshot {
  const currentSnapshots = getCaseSnapshots(matterId);
  const newSnapshot: CaseSnapshot = {
    id: 'snap-' + Math.random().toString(36).substring(2, 9),
    matterId,
    versionNumber: currentPackage.matter.versionNumber,
    snapshotLabel: snapshotLabel || `Snapshot Versi ${currentPackage.matter.versionNumber}.0`,
    snapshotNotes,
    createdAt: new Date().toISOString(),
    creatorName: creatorName || 'Analis Perkara',
    data: JSON.parse(JSON.stringify(currentPackage)) // deep copy
  };

  const updated = [newSnapshot, ...currentSnapshots];
  try {
    localStorage.setItem(`${SNAPSHOTS_KEY_PREFIX}${matterId}`, JSON.stringify(updated));
  } catch (err) {
    console.error('Gagal menyimpan snapshot ke localStorage:', err);
  }
  return newSnapshot;
}

export function deleteCaseSnapshot(matterId: string, snapshotId: string): CaseSnapshot[] {
  const currentSnapshots = getCaseSnapshots(matterId);
  const filtered = currentSnapshots.filter((s) => s.id !== snapshotId);
  try {
    localStorage.setItem(`${SNAPSHOTS_KEY_PREFIX}${matterId}`, JSON.stringify(filtered));
  } catch (err) {
    console.error('Gagal menghapus snapshot:', err);
  }
  return filtered;
}

// -------------------------------------------------------------
// GENERATOR ENVELOPE EKSPOR BERKAS
// Header Ekspor: versi skema, snapshot ID, waktu ekspor, konteks, sumber hukum,
// status review, keterbatasan, dan data yang belum tersedia.
// -------------------------------------------------------------

export function generateExportEnvelope(
  pkg: CaseFullPackage,
  isMasked = false
): CaseExportEnvelope {
  const now = new Date();
  const unresolved: string[] = [];

  // Check unresolved elements
  pkg.elements.forEach((elem) => {
    if (elem.status === 'Belum Tersedia' || elem.status === 'Perlu Bukti Tambahan') {
      unresolved.push(`Unsur [${elem.elementCode}] ${elem.title}: Status masih "${elem.status}"`);
    } else if (elem.status === 'Diperselisihkan / Ada Sanggahan') {
      unresolved.push(`Unsur [${elem.elementCode}] ${elem.title}: Terdapat bantahan/sanggahan materiil`);
    }
  });

  // Check procedure checks
  pkg.procedureChecks.forEach((p) => {
    if (p.status === 'belum dinilai' || p.status === 'perlu klarifikasi' || p.status === 'tidak didukung') {
      unresolved.push(`Prosedur Mindik [${p.code}] ${p.label}: Status "${p.status}"`);
    }
  });

  // Check disputed facts
  pkg.facts.forEach((f) => {
    if (f.reviewStatus === 'Diperselisihkan' || f.reviewStatus === 'Perlu Klarifikasi') {
      unresolved.push(`Fakta/Klaim "${f.subject} - ${f.action}": Review "${f.reviewStatus}"`);
    }
  });

  // Check disputed events
  pkg.events.forEach((e) => {
    if (e.timeCertainty === 'Diperselisihkan') {
      unresolved.push(`Kronologi "${e.title}": Waktu diperselisihkan (${e.startTime})`);
    }
  });

  if (unresolved.length === 0) {
    unresolved.push('Seluruh item pokok telah memiliki status verifikasi terdata.');
  }

  const legalSourcesSummary = (pkg.legalBases || []).map(
    (b) => `${b.articleClause} ${b.title} (${b.numberYear}) - [Status: ${b.verificationStatus}]`
  );

  const header: CaseExportPackageHeader = {
    schemaVersion: '2.2.0-pidana-security',
    snapshotId: 'snap-exp-' + Math.random().toString(36).substring(2, 9),
    exportedAt: now.toISOString(),
    exportedAtFormatted: now.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    }),
    caseContext: {
      refNumber: pkg.matter.refNumber,
      title: pkg.matter.title,
      stage: pkg.matter.stage,
      caseType: pkg.matter.caseType || 'Tindak Pidana Umum',
      jurisdiction: pkg.matter.jurisdiction || 'Pengadilan Negeri Setempat',
      legalSnapshotDate: pkg.matter.legalSnapshotDate || now.toISOString().split('T')[0]
    },
    legalSourcesSummary:
      legalSourcesSummary.length > 0 ? legalSourcesSummary : ['Belum ada dasar hukum terverifikasi'],
    reviewStatus: {
      reviewedByHuman: pkg.matter.reviewedByHuman,
      reviewerName: pkg.review.reviewerName || 'Belum diisi',
      reviewerRole: pkg.review.reviewerRole || 'Belum diisi',
      reviewDate: pkg.review.reviewDate || '-',
      summaryOpinion: pkg.review.summaryOpinion || 'Belum ada catatan telaah manusia'
    },
    limitationsAndDisclaimers: {
      isPreview: true,
      storageNotice:
        'Penyimpanan Lokal: Berkas bersumber dari browser Web Storage, bukan repositori resmi kepolisian/kejaksaan, bukan audit log server append-only, dan bukan jaminan legal rantai bukti (chain of custody).',
      promptProtectionNotice:
        'Proteksi Injeksi: Seluruh dokumen dan kutipan BAP adalah DATA PASIF murni, bukan instruksi perintah sistem.',
      nonConclusiveNotice:
        'Non-Konklusif: Sistem bersifat deskriptif tanpa vonis, tidak menyatakan tersangka bersalah, dan menjunjung tinggi asas praduga tak bersalah.'
    },
    unresolvedOrMissingData: unresolved
  };

  const payload = isMasked ? createMaskedCasePackage(pkg) : pkg;

  return {
    header,
    payload
  };
}

// -------------------------------------------------------------
// VALIDASI SKEMA IMPOR JSON
// Mendukung format CaseExportEnvelope maupun CaseFullPackage langsung
// -------------------------------------------------------------

export interface ValidationResult {
  isValid: boolean;
  message: string;
  data?: CaseFullPackage;
  envelopeHeader?: CaseExportPackageHeader;
}

export function validateCasePackageJson(jsonString: string): ValidationResult {
  try {
    const rawObj = JSON.parse(jsonString);
    if (!rawObj || typeof rawObj !== 'object') {
      return { isValid: false, message: 'Format JSON tidak valid atau bukan objek.' };
    }

    // Support both wrapped envelope and plain case package
    let targetObj: any = rawObj;
    let envelopeHeader: CaseExportPackageHeader | undefined;

    if (rawObj.header && rawObj.payload && typeof rawObj.payload === 'object') {
      targetObj = rawObj.payload;
      envelopeHeader = rawObj.header;
    }

    if (!targetObj.matter || typeof targetObj.matter !== 'object') {
      return {
        isValid: false,
        message: 'Objek berkas tidak memiliki atribut data dasar perkara (matter).'
      };
    }

    if (!targetObj.matter.title || !targetObj.matter.id) {
      return {
        isValid: false,
        message: 'Properti matter.id atau matter.title wajib ada dalam berkas.'
      };
    }

    // Sanitize package
    const sanitized: CaseFullPackage = sanitizeLoadedPackage({
      ...targetObj,
      matter: {
        ...targetObj.matter,
        id: targetObj.matter.id || 'case-' + Math.random().toString(36).substring(2, 8),
        title: String(targetObj.matter.title),
        refNumber: String(targetObj.matter.refNumber || 'BELUM-TERDAFTAR'),
        category: String(targetObj.matter.category || 'Umum'),
        stage: targetObj.matter.stage || 'Penyelidikan',
        status: targetObj.matter.status || 'Aktif',
        jurisdiction: String(targetObj.matter.jurisdiction || 'Pengadilan Negeri Setempat'),
        caseType: String(targetObj.matter.caseType || 'Tindak Pidana Umum'),
        legalSnapshotDate: String(
          targetObj.matter.legalSnapshotDate || new Date().toISOString().split('T')[0]
        ),
        incidentDate: String(targetObj.matter.incidentDate || ''),
        registerDate: String(targetObj.matter.registerDate || ''),
        timeZone: targetObj.matter.timeZone || 'WIB',
        locusDelicti: String(targetObj.matter.locusDelicti || 'Belum tersedia'),
        initialSummary: String(targetObj.matter.initialSummary || ''),
        leadInvestigator: String(targetObj.matter.leadInvestigator || 'Analis'),
        versionNumber: Number(targetObj.matter.versionNumber || 1),
        reviewedByHuman: Boolean(targetObj.matter.reviewedByHuman),
        reviewNotes: String(targetObj.matter.reviewNotes || ''),
        createdAt: String(targetObj.matter.createdAt || new Date().toISOString()),
        updatedAt: new Date().toISOString()
      },
      parties: Array.isArray(targetObj.parties) ? targetObj.parties : [],
      facts: Array.isArray(targetObj.facts) ? targetObj.facts : [],
      events: Array.isArray(targetObj.events) ? targetObj.events : [],
      evidences: Array.isArray(targetObj.evidences) ? targetObj.evidences : [],
      charges: Array.isArray(targetObj.charges) ? targetObj.charges : [],
      elements: Array.isArray(targetObj.elements) ? targetObj.elements : [],
      statements: Array.isArray(targetObj.statements) ? targetObj.statements : [],
      links: Array.isArray(targetObj.links) ? targetObj.links : [],
      legalBases: Array.isArray(targetObj.legalBases) ? targetObj.legalBases : [],
      review:
        targetObj.review && typeof targetObj.review === 'object'
          ? targetObj.review
          : {
              id: 'rev-imported',
              matterId: targetObj.matter.id,
              reviewedByHuman: Boolean(targetObj.matter.reviewedByHuman),
              reviewerName: '',
              reviewerRole: '',
              reviewDate: '',
              summaryOpinion: '',
              isSnapshotLocked: false,
              createdAt: new Date().toISOString()
            },
      meetingNotes: Array.isArray(targetObj.meetingNotes) ? targetObj.meetingNotes : [],
      procedureChecks:
        Array.isArray(targetObj.procedureChecks) && targetObj.procedureChecks.length > 0
          ? targetObj.procedureChecks.map(sanitizeProcedureCheck)
          : INITIAL_PROCEDURE_CHECKS.map((p) => ({ ...p, matterId: targetObj.matter.id })),
      auditLogs: [
        {
          id: 'log-import-' + Math.random().toString(36).substring(2, 8),
          matterId: targetObj.matter.id,
          timestamp: new Date().toLocaleString('id-ID'),
          action: 'Impor Berkas JSON',
          details: envelopeHeader
            ? `Berkas diimpor dari Envelope Skema ${envelopeHeader.schemaVersion} (Snapshot: ${envelopeHeader.snapshotId}).`
            : 'Berkas berhasil diimpor dan disanitasi skema dengan sukses.'
        },
        ...(Array.isArray(targetObj.auditLogs) ? targetObj.auditLogs : [])
      ]
    });

    const successMessage = envelopeHeader
      ? `Validasi berhasil! Paket ekspor standar (Skema ${envelopeHeader.schemaVersion}) telah diverifikasi.`
      : 'Validasi berkas perkara JSON berhasil!';

    return {
      isValid: true,
      message: successMessage,
      data: sanitized,
      envelopeHeader
    };
  } catch (err: any) {
    return {
      isValid: false,
      message: `Kesalahan parsing JSON: ${err?.message || 'Sintaks tidak valid'}`
    };
  }
}

