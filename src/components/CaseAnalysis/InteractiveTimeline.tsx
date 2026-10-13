import React, { useState, useMemo } from 'react';
import {
  CaseEvent,
  EvidenceItem,
  Party,
  TimeCertainty,
  CaseFullPackage
} from '../../types/case';
import {
  Clock,
  Calendar,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Package,
  FileText,
  Cpu,
  UserCheck,
  Filter,
  Plus,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Eye,
  X,
  MapPin,
  Users,
  Search,
  Hash,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  Info
} from 'lucide-react';

interface Props {
  casePackage: CaseFullPackage;
  onUpdateEvent: (updatedEvent: CaseEvent, actionDesc?: string) => void;
  onAddEvent?: (newEvent: CaseEvent) => void;
}

interface ParsedGap {
  index: number;
  prevEvent: CaseEvent;
  nextEvent: CaseEvent;
  durationMs: number;
  durationHours: number;
  durationDays: number;
  formattedText: string;
  severity: 'normal' | 'significant' | 'critical';
}

export const InteractiveTimeline: React.FC<Props> = ({
  casePackage,
  onUpdateEvent,
  onAddEvent
}) => {
  const { events, evidences, parties } = casePackage;

  // Filter & control states
  const [highlightGaps, setHighlightGaps] = useState<boolean>(true);
  const [onlyPhysicalEvidence, setOnlyPhysicalEvidence] = useState<boolean>(false);
  const [evidenceFilter, setEvidenceFilter] = useState<string>('all');
  const [certaintyFilter, setCertaintyFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Inspection modal for clicked evidence
  const [inspectedEvidence, setInspectedEvidence] = useState<EvidenceItem | null>(null);

  // Quick event insertion modal at gap
  const [insertingAtGap, setInsertingAtGap] = useState<ParsedGap | null>(null);
  const [gapNewEventTitle, setGapNewEventTitle] = useState('');
  const [gapNewEventPlace, setGapNewEventPlace] = useState('');
  const [gapNewEventTime, setGapNewEventTime] = useState('');
  const [gapNewEventDesc, setGapNewEventDesc] = useState('');

  // Editing state for event shifting
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [draftStartTime, setDraftStartTime] = useState<string>('');
  const [draftCertainty, setDraftCertainty] = useState<TimeCertainty>('Pasti');

  // Helper to parse dates into timestamp
  const parseEventDate = (dateStr: string): number => {
    if (!dateStr) return 0;
    // Replace space with T if needed for date parsing (e.g. 2026-03-10 10:00 -> 2026-03-10T10:00:00)
    const normalized = dateStr.includes('T')
      ? dateStr
      : dateStr.replace(' ', 'T');
    const ts = Date.parse(normalized);
    return isNaN(ts) ? 0 : ts;
  };

  // Helper to format date nicely
  const formatDisplayDateTime = (dateStr: string): string => {
    if (!dateStr) return 'Waktu Belum Tercatat';
    const ts = parseEventDate(dateStr);
    if (ts === 0) return dateStr;
    const d = new Date(ts);
    return d.toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: dateStr.includes(':') ? '2-digit' : undefined,
      minute: dateStr.includes(':') ? '2-digit' : undefined
    });
  };

  // Sort and filter events
  const sortedAndFilteredEvents = useMemo(() => {
    let list = [...events];

    // Filter by certainty
    if (certaintyFilter !== 'all') {
      list = list.filter((e) => e.timeCertainty === certaintyFilter);
    }

    // Filter by specific evidence
    if (evidenceFilter !== 'all') {
      list = list.filter((e) =>
        e.supportingEvidenceIds.includes(evidenceFilter) ||
        e.opposingEvidenceIds.includes(evidenceFilter)
      );
    }

    // Filter only events that have Physical Evidence (Barang Bukti Fisik)
    if (onlyPhysicalEvidence) {
      list = list.filter((e) => {
        const allEvIds = [...e.supportingEvidenceIds, ...e.opposingEvidenceIds];
        return allEvIds.some((evId) => {
          const item = evidences.find((ev) => ev.id === evId);
          return item && item.type === 'Barang Bukti Fisik';
        });
      });
    }

    // Sort chronologically
    list.sort((a, b) => {
      const tsA = parseEventDate(a.startTime);
      const tsB = parseEventDate(b.startTime);
      return sortOrder === 'asc' ? tsA - tsB : tsB - tsA;
    });

    return list;
  }, [events, certaintyFilter, evidenceFilter, onlyPhysicalEvidence, sortOrder, evidences]);

  // Compute gaps between consecutive events
  const gapsBetweenEvents = useMemo(() => {
    const gaps: Record<number, ParsedGap> = {};
    if (sortedAndFilteredEvents.length < 2) return gaps;

    for (let i = 0; i < sortedAndFilteredEvents.length - 1; i++) {
      const current = sortedAndFilteredEvents[i];
      const next = sortedAndFilteredEvents[i + 1];

      const timeA = parseEventDate(current.endTime || current.startTime);
      const timeB = parseEventDate(next.startTime);

      if (timeA > 0 && timeB > 0 && timeB > timeA) {
        const diffMs = timeB - timeA;
        const diffHours = diffMs / (1000 * 60 * 60);
        const days = Math.floor(diffHours / 24);
        const hours = Math.round(diffHours % 24);

        let formattedText = '';
        if (days > 0 && hours > 0) {
          formattedText = `${days} Hari ${hours} Jam`;
        } else if (days > 0) {
          formattedText = `${days} Hari`;
        } else {
          formattedText = `${Math.round(diffHours * 10) / 10} Jam`;
        }

        let severity: 'normal' | 'significant' | 'critical' = 'normal';
        if (diffHours >= 48) {
          severity = 'critical';
        } else if (diffHours >= 12) {
          severity = 'significant';
        }

        gaps[i] = {
          index: i,
          prevEvent: current,
          nextEvent: next,
          durationMs: diffMs,
          durationHours: diffHours,
          durationDays: days,
          formattedText,
          severity
        };
      }
    }

    return gaps;
  }, [sortedAndFilteredEvents]);

  // Handle Event Shifting
  const handleShiftEventHours = (evt: CaseEvent, deltaHours: number) => {
    const currentTs = parseEventDate(evt.startTime);
    if (currentTs === 0) {
      alert('Format waktu peristiwa belum valid untuk digeser.');
      return;
    }

    const newTs = currentTs + deltaHours * 60 * 60 * 1000;
    const newDate = new Date(newTs);
    const yyyy = newDate.getFullYear();
    const mm = String(newDate.getMonth() + 1).padStart(2, '0');
    const dd = String(newDate.getDate()).padStart(2, '0');
    const hh = String(newDate.getHours()).padStart(2, '0');
    const min = String(newDate.getMinutes()).padStart(2, '0');
    const newTimeString = `${yyyy}-${mm}-${dd} ${hh}:${min}`;

    let newEndTime = evt.endTime;
    if (evt.endTime) {
      const endTs = parseEventDate(evt.endTime);
      if (endTs > 0) {
        const newEndTs = endTs + deltaHours * 60 * 60 * 1000;
        const eDate = new Date(newEndTs);
        newEndTime = `${eDate.getFullYear()}-${String(eDate.getMonth() + 1).padStart(2, '0')}-${String(eDate.getDate()).padStart(2, '0')} ${String(eDate.getHours()).padStart(2, '0')}:${String(eDate.getMinutes()).padStart(2, '0')}`;
      }
    }

    const updated: CaseEvent = {
      ...evt,
      startTime: newTimeString,
      endTime: newEndTime,
      updatedAt: new Date().toISOString()
    };

    const actionText = deltaHours > 0
      ? `Geser maju tempus +${deltaHours >= 24 ? deltaHours / 24 + ' Hari' : deltaHours + ' Jam'}: "${evt.title}"`
      : `Geser mundur tempus ${deltaHours <= -24 ? deltaHours / 24 + ' Hari' : deltaHours + ' Jam'}: "${evt.title}"`;

    onUpdateEvent(updated, actionText);
  };

  const handleStartEdit = (evt: CaseEvent) => {
    setEditingEventId(evt.id);
    setDraftStartTime(evt.startTime);
    setDraftCertainty(evt.timeCertainty);
  };

  const handleSaveEdit = (evt: CaseEvent) => {
    const updated: CaseEvent = {
      ...evt,
      startTime: draftStartTime.trim() || evt.startTime,
      timeCertainty: draftCertainty,
      updatedAt: new Date().toISOString()
    };
    onUpdateEvent(
      updated,
      `Koreksi manual tempus kronologi: "${evt.title}" menjadi ${draftStartTime}`
    );
    setEditingEventId(null);
  };

  // Quick insertion at gap
  const handleOpenInsertAtGap = (gap: ParsedGap) => {
    setInsertingAtGap(gap);
    setGapNewEventTitle('');
    setGapNewEventPlace(gap.prevEvent.place || '');
    setGapNewEventDesc('');

    // Prepopulate midpoint date
    const midTs = parseEventDate(gap.prevEvent.startTime) + gap.durationMs / 2;
    const midDate = new Date(midTs);
    const yyyy = midDate.getFullYear();
    const mm = String(midDate.getMonth() + 1).padStart(2, '0');
    const dd = String(midDate.getDate()).padStart(2, '0');
    const hh = String(midDate.getHours()).padStart(2, '0');
    const min = String(midDate.getMinutes()).padStart(2, '0');
    setGapNewEventTime(`${yyyy}-${mm}-${dd} ${hh}:${min}`);
  };

  const handleConfirmInsertAtGap = () => {
    if (!gapNewEventTitle.trim()) {
      alert('Mohon isi judul rekonstruksi peristiwa.');
      return;
    }
    if (!onAddEvent) {
      alert('Fungsi penambahan peristiwa tidak tersedia.');
      return;
    }

    const newEvent: CaseEvent = {
      id: 'event-gap-' + Math.random().toString(36).substring(2, 8),
      matterId: casePackage.matter.id,
      title: gapNewEventTitle.trim(),
      startTime: gapNewEventTime.trim(),
      timeCertainty: 'Perkiraan / Sekitar',
      place: gapNewEventPlace.trim() || 'Lokasi Belum Terverifikasi',
      description: gapNewEventDesc.trim() || 'Peristiwa disisipkan untuk mengisi celah kronologi.',
      relatedPartyIds: [],
      supportingEvidenceIds: [],
      opposingEvidenceIds: [],
      sourceRef: 'Catatan Rekonstruksi Celah Tempus (Analis)',
      reviewStatus: 'Perlu Klarifikasi',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onAddEvent(newEvent);
    setInsertingAtGap(null);
  };

  // Helper to render evidence badge
  const renderEvidenceBadge = (evId: string, isOpposing = false) => {
    const item = evidences.find((e) => e.id === evId);
    if (!item) return null;

    const isPhysical = item.type === 'Barang Bukti Fisik';
    const isElectronic = item.type === 'Bukti Elektronik';
    const isDoc = item.type === 'Surat / Dokumen';

    let badgeColor = 'bg-slate-100 text-slate-800 border-slate-300';
    let icon = <FileText className="w-3 h-3 text-slate-600" />;

    if (isPhysical) {
      badgeColor = 'bg-emerald-100 text-emerald-950 border-emerald-400 font-bold';
      icon = <Package className="w-3.5 h-3.5 text-emerald-700" />;
    } else if (isElectronic) {
      badgeColor = 'bg-sky-100 text-sky-950 border-sky-300';
      icon = <Cpu className="w-3 h-3 text-sky-700" />;
    } else if (isDoc) {
      badgeColor = 'bg-amber-100 text-amber-950 border-amber-300';
      icon = <FileText className="w-3 h-3 text-amber-700" />;
    }

    return (
      <button
        key={item.id}
        onClick={() => setInspectedEvidence(item)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] border shadow-2xs hover:scale-102 transition cursor-pointer text-left ${badgeColor}`}
        title={`Klik untuk inspeksi: ${item.label} (${item.type})`}
      >
        {icon}
        <span className="truncate max-w-[190px]">{item.label}</span>
        {isPhysical && (
          <span className="bg-emerald-700 text-white text-[9px] px-1 py-0.2 rounded font-mono uppercase">
            FISIK
          </span>
        )}
        {isOpposing && (
          <span className="bg-rose-700 text-white text-[9px] px-1 py-0.2 rounded font-mono uppercase">
            BANTAHAN
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Non-Conclusive Reminder */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <Clock className="w-5 h-5 text-amber-600" />
            <span>Visualisasi Kronologi & Rekonstruksi Tempus Interaktif</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Simulasikan pergeseran jam peristiwa, deteksi celah waktu tanpa alibi (<em>time gap</em>), dan petakan bukti fisik yang menyertai setiap peristiwa secara langsung.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setHighlightGaps(!highlightGaps)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
              highlightGaps
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-900'
                : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className={`w-3.5 h-3.5 ${highlightGaps ? 'text-amber-600' : 'text-slate-400'}`} />
            <span>Sorot Celah Waktu (Gaps): {highlightGaps ? 'AKTIF' : 'NONAKTIF'}</span>
          </button>
        </div>
      </div>

      {/* 2. Filter & Interactive Control Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Physical Evidence Toggle */}
          <label className="flex items-center gap-2 font-semibold text-slate-800 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100">
            <input
              type="checkbox"
              checked={onlyPhysicalEvidence}
              onChange={(e) => setOnlyPhysicalEvidence(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500 cursor-pointer"
            />
            <Package className="w-3.5 h-3.5 text-emerald-600" />
            <span>Hanya Event dengan Barang Bukti Fisik</span>
          </label>

          {/* Evidence Filter Dropdown */}
          <div className="flex items-center gap-1.5 text-slate-600">
            <span className="font-semibold text-slate-700">Filter Bukti:</span>
            <select
              aria-label="Filter berdasarkan Barang Bukti"
              value={evidenceFilter}
              onChange={(e) => setEvidenceFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-xs font-medium text-slate-800 cursor-pointer max-w-[210px] truncate"
            >
              <option value="all">Semua Bukti ({evidences.length})</option>
              {evidences.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  [{ev.type.split('/')[0].trim()}] {ev.label}
                </option>
              ))}
            </select>
          </div>

          {/* Certainty Filter */}
          <div className="flex items-center gap-1.5 text-slate-600">
            <span className="font-semibold text-slate-700">Kepastian Tempus:</span>
            <select
              aria-label="Filter Tingkat Kepastian Waktu"
              value={certaintyFilter}
              onChange={(e) => setCertaintyFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-xs font-medium text-slate-800 cursor-pointer"
            >
              <option value="all">Semua Tingkat Kepastian</option>
              <option value="Pasti">Hanya Waktu Pasti</option>
              <option value="Perkiraan / Sekitar">Hanya Perkiraan / Sekitar</option>
              <option value="Diperselisihkan">Hanya Diperselisihkan</option>
            </select>
          </div>
        </div>

        {/* Sort order toggle */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Urutan:</span>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-slate-700 font-semibold cursor-pointer"
          >
            {sortOrder === 'asc' ? '▲ Kronologis (Terlama → Terbaru)' : '▼ Mundur (Terbaru → Terlama)'}
          </button>
        </div>
      </div>

      {/* 3. Main Timeline Track */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-300 space-y-6 ml-2 sm:ml-4">
        {sortedAndFilteredEvents.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-xs text-slate-500">
            Tidak ada peristiwa kronologi yang cocok dengan filter yang dipilih.
          </div>
        ) : (
          sortedAndFilteredEvents.map((evt, idx) => {
            const hasGapAfter = gapsBetweenEvents[idx] !== undefined;
            const gapData = gapsBetweenEvents[idx];
            const isEditing = editingEventId === evt.id;

            // Resolve related parties
            const relatedParties = evt.relatedPartyIds
              .map((id) => parties.find((p) => p.id === id))
              .filter(Boolean) as Party[];

            // Resolve physical evidences
            const physicalEvidences = [...evt.supportingEvidenceIds, ...evt.opposingEvidenceIds]
              .map((id) => evidences.find((e) => e.id === id))
              .filter((e) => e && e.type === 'Barang Bukti Fisik') as EvidenceItem[];

            return (
              <React.Fragment key={evt.id}>
                {/* Event Card Container */}
                <div className="relative group">
                  {/* Timeline Node Point */}
                  <div
                    className={`absolute -left-[31px] sm:-left-[39px] top-4 w-5 h-5 rounded-full border-4 border-white flex items-center justify-center shadow-xs transition ${
                      evt.timeCertainty === 'Diperselisihkan'
                        ? 'bg-rose-600'
                        : evt.timeCertainty === 'Perkiraan / Sekitar'
                        ? 'bg-amber-500'
                        : 'bg-slate-900'
                    }`}
                  ></div>

                  {/* Event Card */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition space-y-4">
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          {/* DateTime badge */}
                          <div className="flex items-center gap-1.5 bg-slate-900 text-amber-300 px-2.5 py-1 rounded-md font-mono text-xs font-bold shadow-2xs">
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            <span>{formatDisplayDateTime(evt.startTime)}</span>
                            {evt.endTime && (
                              <>
                                <span className="text-slate-400">s/d</span>
                                <span>{formatDisplayDateTime(evt.endTime)}</span>
                              </>
                            )}
                          </div>

                          {/* Certainty badge */}
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                              evt.timeCertainty === 'Pasti'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : evt.timeCertainty === 'Perkiraan / Sekitar'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-rose-50 text-rose-800 border-rose-200'
                            }`}
                          >
                            Tempus: {evt.timeCertainty}
                          </span>

                          {/* Physical evidence indicator badge */}
                          {physicalEvidences.length > 0 && (
                            <span className="flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs">
                              <Package className="w-3 h-3" />
                              <span>{physicalEvidences.length} Barang Bukti Fisik Terkait</span>
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm font-bold text-slate-950 tracking-tight">
                          {evt.title}
                        </h3>

                        {evt.place && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{evt.place}</span>
                          </div>
                        )}
                      </div>

                      {/* Interactive Time Shifter Buttons */}
                      <div className="flex flex-wrap items-center gap-1.5 shrink-0 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-500 font-semibold px-1">
                          Geser Tempus:
                        </span>

                        <button
                          onClick={() => handleShiftEventHours(evt, -24)}
                          className="px-1.5 py-1 text-[10px] font-bold bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 rounded cursor-pointer transition"
                          title="Geser mundur 1 hari (-24 jam)"
                        >
                          -1 Hari
                        </button>

                        <button
                          onClick={() => handleShiftEventHours(evt, -1)}
                          className="px-1.5 py-1 text-[10px] font-bold bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 rounded cursor-pointer transition"
                          title="Geser mundur 1 jam (-1 jam)"
                        >
                          -1 Jam
                        </button>

                        <button
                          onClick={() => handleShiftEventHours(evt, 1)}
                          className="px-1.5 py-1 text-[10px] font-bold bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 rounded cursor-pointer transition"
                          title="Geser maju 1 jam (+1 jam)"
                        >
                          +1 Jam
                        </button>

                        <button
                          onClick={() => handleShiftEventHours(evt, 24)}
                          className="px-1.5 py-1 text-[10px] font-bold bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 rounded cursor-pointer transition"
                          title="Geser maju 1 hari (+24 jam)"
                        >
                          +1 Hari
                        </button>

                        <button
                          onClick={() => (isEditing ? setEditingEventId(null) : handleStartEdit(evt))}
                          className="px-2 py-1 text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-amber-300 rounded cursor-pointer ml-1"
                        >
                          {isEditing ? 'Batal' : 'Edit Tempus'}
                        </button>
                      </div>
                    </div>

                    {/* Inline Manual Shifter Form */}
                    {isEditing && (
                      <div className="bg-amber-50/60 border border-amber-200 rounded-lg p-3 space-y-3 text-xs animate-in fade-in duration-150">
                        <div className="font-bold text-amber-950 flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5 text-amber-700" />
                          <span>Simulasi Penyesuaian Rekonstruksi Waktu:</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Waktu Baru (Format: YYYY-MM-DD HH:mm)
                            </label>
                            <input
                              type="text"
                              value={draftStartTime}
                              onChange={(e) => setDraftStartTime(e.target.value)}
                              className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 rounded bg-white text-slate-900"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Tingkat Kepastian Waktu
                            </label>
                            <select
                              aria-label="Pilih Tingkat Kepastian Waktu"
                              value={draftCertainty}
                              onChange={(e) => setDraftCertainty(e.target.value as TimeCertainty)}
                              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-900 font-medium"
                            >
                              <option value="Pasti">Pasti (Ada Bukti Jam & Tanggal Sah)</option>
                              <option value="Perkiraan / Sekitar">Perkiraan / Sekitar (Kira-kira)</option>
                              <option value="Diperselisihkan">Diperselisihkan (Ada Sanggahan/Alibi)</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            onClick={() => setEditingEventId(null)}
                            className="px-2.5 py-1 text-slate-600 hover:text-slate-800 font-medium"
                          >
                            Batal
                          </button>
                          <button
                            onClick={() => handleSaveEdit(evt)}
                            className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded cursor-pointer"
                          >
                            Simpan Perubahan Tempus
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Description Body */}
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {evt.description}
                    </p>

                    {/* Related Parties & Sources */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                      {relatedParties.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-semibold text-slate-700">Pihak Terkait:</span>
                          <span className="text-slate-600">
                            {relatedParties.map((p) => `${p.name} (${p.role})`).join(', ')}
                          </span>
                        </div>
                      )}

                      {evt.sourceRef && (
                        <div className="text-[11px] text-slate-500 italic">
                          Sumber: {evt.sourceRef}
                        </div>
                      )}
                    </div>

                    {/* DIRECT PHYSICAL & DIGITAL EVIDENCE CORRELATION */}
                    <div className="border-t border-slate-100 pt-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <span>Korelasi Alat Bukti Terdaftar (Pasal 184 KUHAP):</span>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {evt.supportingEvidenceIds.length + evt.opposingEvidenceIds.length} Bukti Terhubung
                        </span>
                      </div>

                      {evt.supportingEvidenceIds.length === 0 && evt.opposingEvidenceIds.length === 0 ? (
                        <div className="p-2.5 bg-amber-50/50 border border-amber-200/60 rounded-lg text-xs text-amber-900 flex items-center gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>
                            <strong>Celah Pembuktian:</strong> Belum ada alat bukti sah yang ditautkan ke peristiwa ini.
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {evt.supportingEvidenceIds.map((id) => renderEvidenceBadge(id, false))}
                          {evt.opposingEvidenceIds.map((id) => renderEvidenceBadge(id, true))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 4. TEMPORAL GAP HIGHLIGHTER BETWEEN EVENTS */}
                {hasGapAfter && highlightGaps && (
                  <div
                    className={`my-3 p-3.5 rounded-xl border-2 border-dashed flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition ${
                      gapData.severity === 'critical'
                        ? 'bg-rose-50/70 border-rose-300 text-rose-950'
                        : gapData.severity === 'significant'
                        ? 'bg-amber-50/70 border-amber-300 text-amber-950'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                          gapData.severity === 'critical'
                            ? 'bg-rose-200 text-rose-800'
                            : gapData.severity === 'significant'
                            ? 'bg-amber-200 text-amber-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs uppercase tracking-wide">
                            {gapData.severity === 'critical'
                              ? '⚠ Celah Waktu Kritis (> 48 Jam Tanpa Catatan)'
                              : gapData.severity === 'significant'
                              ? '⚡ Jeda Kronologi Signifikan (> 12 Jam)'
                              : 'Interval Waktu Antar-Peristiwa'}
                          </span>
                          <span className="font-mono font-bold text-xs bg-white px-2 py-0.5 rounded border border-current shadow-2xs">
                            {gapData.formattedText}
                          </span>
                        </div>
                        <p className="text-[11px] mt-0.5 text-slate-600">
                          Antara: <strong>&ldquo;{gapData.prevEvent.title}&rdquo;</strong> ke{' '}
                          <strong>&ldquo;{gapData.nextEvent.title}&rdquo;</strong>.
                          {gapData.severity === 'critical' &&
                            ' Waktu luang tanpa alibi ini berpotensi menjadi celah rekonstruksi fakta materiel yang perlu dikonfirmasi saksi.'}
                        </p>
                      </div>
                    </div>

                    {onAddEvent && (
                      <button
                        onClick={() => handleOpenInsertAtGap(gapData)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-semibold rounded-lg shrink-0 cursor-pointer shadow-2xs"
                        title="Sisipkan dugaan peristiwa atau alibi di celah waktu ini"
                      >
                        <Plus className="w-3.5 h-3.5 text-amber-600" />
                        <span>Sisipkan Catatan di Gap Ini</span>
                      </button>
                    )}
                  </div>
                )}
              </React.Fragment>
            );
          })
        )}
      </div>

      {/* 5. MODAL INSPEKSI BUKTI LENGKAP */}
      {inspectedEvidence && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold tracking-tight">
                  Inspeksi Detail Barang Bukti Terdaftar
                </h3>
              </div>
              <button
                onClick={() => setInspectedEvidence(null)}
                className="text-slate-400 hover:text-white p-1 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                  {inspectedEvidence.type}
                </span>
                <h4 className="text-base font-bold text-slate-950 mt-1.5">
                  {inspectedEvidence.label}
                </h4>
                <p className="text-slate-600 mt-1 leading-relaxed">
                  {inspectedEvidence.description}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 font-mono text-[11px]">
                <div>
                  <span className="text-slate-500">Asal Perolehan:</span>{' '}
                  <strong className="text-slate-800">{inspectedEvidence.origin}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Tanggal Sita/Perolehan:</span>{' '}
                  <strong className="text-slate-800">{inspectedEvidence.acquisitionDate}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Hash / Register Sita:</span>{' '}
                  <strong className="text-amber-800 break-all">{inspectedEvidence.manualHash || '-'}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Lokasi Simpan Fisik:</span>{' '}
                  <strong className="text-slate-800">{inspectedEvidence.storageLocation}</strong>
                </div>
                {inspectedEvidence.mockFileRef && (
                  <div>
                    <span className="text-slate-500">Berkas / Foto Pratinjau:</span>{' '}
                    <strong className="text-sky-800">{inspectedEvidence.mockFileRef}</strong>
                  </div>
                )}
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-slate-700">
                <span className="font-bold text-emerald-950 block mb-0.5">
                  Catatan Rantai Simpan (Chain of Custody):
                </span>
                <p className="italic text-slate-600">
                  {inspectedEvidence.chainOfCustodyNotes || 'Belum ada catatan rantai simpan.'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                <span>Status Telaah: <strong>{inspectedEvidence.reviewStatus}</strong></span>
                <button
                  onClick={() => setInspectedEvidence(null)}
                  className="px-3 py-1.5 bg-slate-900 text-amber-300 font-bold rounded-lg cursor-pointer"
                >
                  Tutup Inspeksi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL SISIPKAN PERISTIWA DI GAP WAKTU */}
      {insertingAtGap && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold tracking-tight">
                  Sisipkan Peristiwa di Celah Waktu ({insertingAtGap.formattedText})
                </h3>
              </div>
              <button
                onClick={() => setInsertingAtGap(null)}
                className="text-slate-400 hover:text-white p-1 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <p className="text-slate-600">
                Menyisipkan rekonstruksi aktivitas baru antara{' '}
                <strong>&ldquo;{insertingAtGap.prevEvent.title}&rdquo;</strong> dan{' '}
                <strong>&ldquo;{insertingAtGap.nextEvent.title}&rdquo;</strong>.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Judul Rekonstruksi Peristiwa <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={gapNewEventTitle}
                  onChange={(e) => setGapNewEventTitle(e.target.value)}
                  placeholder="Contoh: Terlapor Menghubungi Saksi Lewat Telepon"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Waktu / Tempus (YYYY-MM-DD HH:mm)
                  </label>
                  <input
                    type="text"
                    value={gapNewEventTime}
                    onChange={(e) => setGapNewEventTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tempat / Locus
                  </label>
                  <input
                    type="text"
                    value={gapNewEventPlace}
                    onChange={(e) => setGapNewEventPlace(e.target.value)}
                    placeholder="Lokasi kejadian"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Deskripsi / Keterangan Fakta
                </label>
                <textarea
                  rows={3}
                  value={gapNewEventDesc}
                  onChange={(e) => setGapNewEventDesc(e.target.value)}
                  placeholder="Uraian apa yang diduga terjadi pada celah waktu ini berdasarkan saksi/rekaman..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setInsertingAtGap(null)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-800 font-medium cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmInsertAtGap}
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-lg cursor-pointer"
                >
                  Simpan Peristiwa Baru
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
