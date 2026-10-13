/**
 * Modul Penyamaran Data Sensitif & Redaksi Perlindungan Data Pribadi (UU PDP)
 * Berjalan 100% lokal di sisi peramban tanpa koneksi jaringan eksternal.
 */

import { CaseFullPackage } from '../types/case';

/**
 * Masking helper untuk menyamarkan nama orang (misal: "Bambang Widjaja" -> "B****** W******")
 */
export function maskPersonName(name: string): string {
  if (!name || name.trim() === '') return name;
  const parts = name.trim().split(/\s+/);
  return parts
    .map((p) => {
      if (p.length <= 2) return p[0] + '*';
      return p[0] + '*'.repeat(Math.max(p.length - 2, 3)) + p[p.length - 1];
    })
    .join(' ');
}

/**
 * Masking helper untuk NIK / Paspor / Angka sensitif
 */
export function maskSensitiveNumbers(text: string): string {
  if (!text) return text;
  // Mask 16-digit NIK
  let masked = text.replace(/\b\d{4}(\d{8})\d{4}\b/g, (match, middle) => {
    return match.substring(0, 4) + '********' + match.substring(12);
  });
  // Mask nomor rekening / HP
  masked = masked.replace(/\b(\+?62|08)\d{7,11}\b/g, (match) => {
    return match.substring(0, 4) + '****' + match.substring(match.length - 2);
  });
  return masked;
}

/**
 * Masking teks umum yang mengandung nama atau angka sensitif
 */
export function maskGenericText(text: string): string {
  if (!text) return text;
  return maskSensitiveNumbers(text);
}

/**
 * Membuat paket perkara salinan tersamar (Redacted/Masked Case Package)
 * untuk ekspor aman atau tinjauan tanpa mengekspos PII
 */
export function createMaskedCasePackage(pkg: CaseFullPackage): CaseFullPackage {
  const partyNameMap = new Map<string, string>();
  pkg.parties.forEach((p, idx) => {
    const masked = `${p.role.split('/')[0].trim().toUpperCase()}-${idx + 1} (${p.name[0]}***)`;
    partyNameMap.set(p.name, masked);
  });

  const replaceNamesInText = (str: string): string => {
    if (!str) return str;
    let res = maskSensitiveNumbers(str);
    partyNameMap.forEach((masked, original) => {
      res = res.replaceAll(original, masked);
    });
    return res;
  };

  return {
    ...pkg,
    matter: {
      ...pkg.matter,
      title: replaceNamesInText(pkg.matter.title),
      initialSummary: replaceNamesInText(pkg.matter.initialSummary),
      leadInvestigator: maskPersonName(pkg.matter.leadInvestigator),
      locusDelicti: maskSensitiveNumbers(pkg.matter.locusDelicti)
    },
    parties: pkg.parties.map((p, idx) => ({
      ...p,
      name: `${p.role.split('/')[0].trim().toUpperCase()}-${idx + 1}`,
      alias: p.alias ? maskPersonName(p.alias) : undefined,
      notes: replaceNamesInText(p.notes),
      idSource: maskSensitiveNumbers(p.idSource)
    })),
    facts: pkg.facts.map((f) => ({
      ...f,
      subject: partyNameMap.get(f.subject) || maskPersonName(f.subject),
      action: replaceNamesInText(f.action),
      placeText: maskSensitiveNumbers(f.placeText),
      rawClaimText: replaceNamesInText(f.rawClaimText)
    })),
    events: pkg.events.map((e) => ({
      ...e,
      title: replaceNamesInText(e.title),
      description: replaceNamesInText(e.description),
      place: maskSensitiveNumbers(e.place)
    })),
    evidences: pkg.evidences.map((ev) => ({
      ...ev,
      label: replaceNamesInText(ev.label),
      description: replaceNamesInText(ev.description),
      origin: replaceNamesInText(ev.origin),
      chainOfCustodyNotes: replaceNamesInText(ev.chainOfCustodyNotes)
    })),
    statements: pkg.statements.map((s) => ({
      ...s,
      partyName: partyNameMap.get(s.partyName) || maskPersonName(s.partyName),
      quote: replaceNamesInText(s.quote),
      context: replaceNamesInText(s.context)
    })),
    review: {
      ...pkg.review,
      reviewerName: maskPersonName(pkg.review.reviewerName),
      summaryOpinion: replaceNamesInText(pkg.review.summaryOpinion)
    },
    meetingNotes: pkg.meetingNotes.map((m) => ({
      ...m,
      attendeeName: maskPersonName(m.attendeeName),
      recommendation: replaceNamesInText(m.recommendation)
    }))
  };
}
