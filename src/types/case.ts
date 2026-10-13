export type CaseStage =
  | 'Penyelidikan'
  | 'Penyidikan'
  | 'Pra-Penuntutan'
  | 'Penuntutan'
  | 'Persidangan';

export type CaseStatus =
  | 'Aktif'
  | 'Ditolak/SP3'
  | 'Diversi'
  | 'P-21 (Lengkap)'
  | 'Tahap II'
  | 'Selesai';

export type TimeZoneType = 'WIB' | 'WITA' | 'WIT';

export type ReviewStatus = 'Belum Ditinjau' | 'Ditinjau' | 'Perlu Klarifikasi' | 'Diperselisihkan';

export type PartyType = 'Individu' | 'Korporasi' | 'Instansi';

export type PartyRole =
  | 'Terlapor / Tersangka'
  | 'Terdakwa'
  | 'Korban'
  | 'Pelapor'
  | 'Saksi Mahkota'
  | 'Saksi Fakta'
  | 'Saksi Ahli'
  | 'Penasihat Hukum'
  | 'Pihak Terkait';

export interface Party {
  id: string;
  matterId: string;
  name: string;
  alias?: string;
  type: PartyType;
  role: PartyRole;
  notes: string;
  idSource: string; // misal KTP, Paspor, Berita Acara
  reviewStatus: ReviewStatus;
  createdAt: string;
  updatedAt: string;
}

export type FactType =
  | 'Fakta Terverifikasi'
  | 'Klaim Saksi/Pihak'
  | 'Inferensi Awal'
  | 'Opini/Argumen';

export interface FactClaim {
  id: string;
  matterId: string;
  type: FactType;
  subject: string;
  action: string;
  timeText: string;
  placeText: string;
  objectText: string;
  rawClaimText: string;
  sourceRef: string; // misal BAP Saksi A hal 3
  documentPage?: string;
  reviewStatus: ReviewStatus;
  createdAt: string;
  updatedAt: string;
}

export type TimeCertainty = 'Pasti' | 'Perkiraan / Sekitar' | 'Diperselisihkan';

export interface CaseEvent {
  id: string;
  matterId: string;
  title: string;
  startTime: string; // YYYY-MM-DD atau jam
  endTime?: string;
  timeCertainty: TimeCertainty;
  place: string;
  description: string;
  relatedPartyIds: string[];
  supportingEvidenceIds: string[];
  opposingEvidenceIds: string[];
  sourceRef: string;
  reviewStatus: ReviewStatus;
  createdAt: string;
  updatedAt: string;
}

export type EvidenceType =
  | 'Surat / Dokumen'
  | 'Bukti Elektronik'
  | 'Barang Bukti Fisik'
  | 'Keterangan Saksi'
  | 'Keterangan Ahli'
  | 'Petunjuk';

export interface EvidenceItem {
  id: string;
  matterId: string;
  type: EvidenceType;
  label: string;
  description: string;
  origin: string; // Disita dari siapa / ditemukan di mana
  acquisitionDate: string;
  manualHash: string; // misal SHA256 manual / Nomor Register Sita
  mockFileRef?: string;
  chainOfCustodyNotes: string;
  storageLocation: string;
  reviewStatus: ReviewStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Charge {
  id: string;
  matterId: string;
  articleName: string; // misal Pasal 378 KUHP
  lawName: string; // Kitab Undang-Undang Hukum Pidana
  description: string;
  createdAt: string;
  updatedAt: string;
}

export type LegalElementStatus =
  | 'Belum Tersedia'
  | 'Perlu Bukti Tambahan'
  | 'Ada Bukti Pendukung'
  | 'Diperselisihkan / Ada Sanggahan';

export type LegalRelevance =
  | 'Langsung (Direct Evidence)'
  | 'Tidak Langsung / Sirkumstansial'
  | 'Petunjuk (Indicia)'
  | 'Belum Ditentukan';

export interface LegalElement {
  id: string;
  chargeId: string;
  matterId: string;
  elementCode: string; // misal "Unsur 1", "Unsur 2"
  title: string;
  description: string;
  isObjective: boolean; // objektif vs subjektif
  status: LegalElementStatus;
  relevance?: LegalRelevance; // Relevansi yuridis
  linkedFactIds: string[];
  linkedEvidenceIds: string[];
  reviewNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Statement {
  id: string;
  matterId: string;
  partyId: string;
  partyName: string;
  statementDate: string;
  quote: string;
  context: string;
  documentSource: string;
  pageNo?: string;
  reviewStatus: ReviewStatus;
  createdAt: string;
  updatedAt: string;
}

export type RelationType =
  | 'mendukung'
  | 'membantah'
  | 'belum_tersedia'
  | 'perlu_klarifikasi';

export type EntityType = 'party' | 'fact' | 'event' | 'evidence' | 'element';

export interface ExplicitLink {
  id: string;
  matterId: string;
  sourceId: string;
  sourceType: EntityType;
  targetId: string;
  targetType: EntityType;
  relationType: RelationType;
  explanation: string;
  sourceRef: string;
  createdAt: string;
}

export interface CaseReview {
  id: string;
  matterId: string;
  reviewedByHuman: boolean;
  reviewerName: string;
  reviewerRole: string;
  reviewDate: string;
  summaryOpinion: string;
  isSnapshotLocked: boolean;
  snapshotLabel?: string;
  createdAt: string;
}

export interface MeetingNote {
  id: string;
  matterId: string;
  attendeeName: string;
  role: string;
  recommendation: string;
  noteDate: string;
}

// Modul Dasar Hukum & Sumber
export type LegalBasisVerificationStatus =
  | 'Terverifikasi Resmi'
  | 'Belum Diverifikasi'
  | 'Perlu Pembaruan';

export interface LegalBasisSource {
  id: string;
  matterId: string;
  title: string; // Judul
  numberYear: string; // Nomor / Tahun
  articleClause: string; // Pasal / Ayat
  officialUrl: string; // URL resmi
  accessDate: string; // Tanggal akses
  verificationStatus: LegalBasisVerificationStatus; // Status verifikasi
  quote: string; // Kutipan teks resmi
  createdAt: string;
  updatedAt: string;
}

// 11 Kategori Checklist Prosedural Netral
export type ProcedureCategory =
  | 'hak_pihak'
  | 'pemeriksaan'
  | 'penasihat_hukum'
  | 'pemanggilan'
  | 'penahanan'
  | 'penyitaan'
  | 'penuntutan'
  | 'persidangan'
  | 'pembuktian'
  | 'putusan'
  | 'upaya_hukum';

// Status checklist HANYA 6 opsi berikut
export type ProcedureStatus =
  | 'belum dinilai'
  | 'didukung dokumen'
  | 'tidak didukung'
  | 'diperselisihkan'
  | 'tidak relevan'
  | 'perlu klarifikasi';

export interface ProcedureCheck {
  id: string;
  matterId?: string;
  category: ProcedureCategory;
  code: string;
  label: string;
  isMandatory: boolean;
  status: ProcedureStatus;
  sumber: string; // Wajib
  kutipan: string; // Wajib
  alasan: string; // Wajib
  reviewer: string; // Wajib
  updatedAt?: string;
}

export interface LocalAuditLog {
  id: string;
  matterId: string;
  timestamp: string;
  action: string;
  details: string;
}

export interface Matter {
  id: string;
  title: string;
  refNumber: string; // LP / SPDP / Register
  category: string; // Klasifikasi kejahatan
  stage: CaseStage; // Konteks tahap perkara
  status: CaseStatus;
  jurisdiction: string; // Konteks Yurisdiksi
  caseType: string; // Konteks Jenis Perkara
  legalSnapshotDate: string; // Tanggal snapshot hukum
  incidentDate: string;
  registerDate: string;
  timeZone: TimeZoneType;
  locusDelicti: string;
  initialSummary: string;
  leadInvestigator: string;
  versionNumber: number;
  reviewedByHuman: boolean;
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CaseFullPackage {
  matter: Matter;
  parties: Party[];
  facts: FactClaim[];
  events: CaseEvent[];
  evidences: EvidenceItem[];
  charges: Charge[];
  elements: LegalElement[];
  statements: Statement[];
  links: ExplicitLink[];
  review: CaseReview;
  meetingNotes: MeetingNote[];
  legalBases: LegalBasisSource[]; // Modul Dasar Hukum & Sumber
  procedureChecks: ProcedureCheck[]; // Checklist Prosedural Netral
  auditLogs: LocalAuditLog[];
}

export interface CaseSnapshot {
  id: string;
  matterId: string;
  versionNumber: number;
  snapshotLabel: string;
  snapshotNotes?: string;
  createdAt: string;
  creatorName: string;
  data: CaseFullPackage;
}

export interface CaseExportPackageHeader {
  schemaVersion: string; // misal "2.2.0-pidana-security"
  snapshotId: string;
  exportedAt: string;
  exportedAtFormatted: string;
  caseContext: {
    refNumber: string;
    title: string;
    stage: CaseStage;
    caseType: string;
    jurisdiction: string;
    legalSnapshotDate: string;
  };
  legalSourcesSummary: string[];
  reviewStatus: {
    reviewedByHuman: boolean;
    reviewerName: string;
    reviewerRole: string;
    reviewDate: string;
    summaryOpinion: string;
  };
  limitationsAndDisclaimers: {
    isPreview?: boolean;
    isDemo?: boolean; // Kompatibilitas arsip lama
    storageNotice: string;
    promptProtectionNotice: string;
    nonConclusiveNotice: string;
  };
  unresolvedOrMissingData: string[];
}

export interface CaseExportEnvelope {
  header: CaseExportPackageHeader;
  payload: CaseFullPackage;
}

