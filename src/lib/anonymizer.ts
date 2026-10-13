import { CaseFullPackage, Party, FactClaim, EvidenceItem, Statement } from '../types/case';

/**
 * Prompt injection protection:
 * Ensures all document contents are treated strictly as passive inert DATA and never instructions.
 * Strips active jailbreak phrases and wraps text in explicit non-executable data boundaries.
 */
export function wrapAsPassiveData(text: string, contextLabel = 'DOKUMEN'): string {
  if (!text) return '';

  // Neutralize common prompt injection patterns
  const sanitized = text
    .replace(/(?:ignore|disregard|forget)\s+(?:all\s+)?(?:previous|prior)\s+(?:instructions|prompts|rules)/gi, '[REDACTED_PROMPT_INJECTION_ATTEMPT]')
    .replace(/(?:system\s*prompt|system\s*instruction|developer\s*mode)/gi, '[REDACTED_SYSTEM_DIRECTIVE]')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '[REDACTED_SCRIPT]');

  return `[DATA_PASIF_${contextLabel}_MULAI]\n${sanitized}\n[DATA_PASIF_${contextLabel}_SELESAI]`;
}

/**
 * Masks a personal full name:
 * "Bambang Soedirgo" -> "B*** S***"
 */
export function maskName(fullName: string): string {
  if (!fullName) return '';
  return fullName
    .split(' ')
    .map(word => {
      if (word.length <= 1) return word;
      return word[0] + '*'.repeat(Math.min(3, word.length - 1));
    })
    .join(' ');
}

/**
 * Masks numeric IDs like NIK, bank accounts, or phone numbers:
 * "3174092104800001" -> "3174********0001"
 */
export function maskNumericIdentifiers(text: string): string {
  if (!text) return '';
  // Mask 16-digit NIK
  let res = text.replace(/\b(\d{4})\d{8}(\d{4})\b/g, '$1********$2 [NIK DISAMARKAN]');
  // Mask 10-12 digit bank account numbers
  res = res.replace(/\b(\d{3})\d{4,6}(\d{3})\b/g, '$1****$2 [REK DISAMARKAN]');
  // Mask phone numbers
  res = res.replace(/\b(08\d{2})[- ]?\d{4}[- ]?(\d{3,4})\b/g, '$1-****-$2 [TELP DISAMARKAN]');
  return res;
}

/**
 * Creates a redacted/anonymized duplicate package for safe preview presentations
 * or sharing without exposing real or sensitive identities.
 */
export function createRedactedPackage(pkg: CaseFullPackage): CaseFullPackage {
  // Map of party name -> masked name
  const nameMap = new Map<string, string>();
  pkg.parties.forEach(p => {
    nameMap.set(p.name, maskName(p.name));
  });

  const redactedParties: Party[] = pkg.parties.map(p => ({
    ...p,
    name: maskName(p.name),
    alias: p.alias && p.alias !== '-' ? maskName(p.alias) : p.alias,
    idSource: maskNumericIdentifiers(p.idSource),
    notes: maskNumericIdentifiers(p.notes)
  }));

  const redactedFacts: FactClaim[] = pkg.facts.map(f => {
    let raw = maskNumericIdentifiers(f.rawClaimText);
    nameMap.forEach((masked, original) => {
      raw = raw.split(original).join(masked);
    });
    return {
      ...f,
      subject: nameMap.get(f.subject) || maskName(f.subject),
      rawClaimText: raw,
      sourceRef: maskNumericIdentifiers(f.sourceRef)
    };
  });

  const redactedEvidences: EvidenceItem[] = pkg.evidences.map(e => ({
    ...e,
    label: maskNumericIdentifiers(e.label),
    description: maskNumericIdentifiers(e.description),
    origin: maskNumericIdentifiers(e.origin),
    chainOfCustodyNotes: maskNumericIdentifiers(e.chainOfCustodyNotes)
  }));

  const redactedStatements: Statement[] = pkg.statements.map(s => {
    let quote = maskNumericIdentifiers(s.quote);
    nameMap.forEach((masked, original) => {
      quote = quote.split(original).join(masked);
    });
    return {
      ...s,
      partyName: nameMap.get(s.partyName) || maskName(s.partyName),
      quote,
      documentSource: maskNumericIdentifiers(s.documentSource)
    };
  });

  return {
    ...pkg,
    matter: {
      ...pkg.matter,
      title: maskNumericIdentifiers(pkg.matter.title),
      leadInvestigator: maskName(pkg.matter.leadInvestigator),
      initialSummary: maskNumericIdentifiers(pkg.matter.initialSummary)
    },
    parties: redactedParties,
    facts: redactedFacts,
    evidences: redactedEvidences,
    statements: redactedStatements
  };
}
