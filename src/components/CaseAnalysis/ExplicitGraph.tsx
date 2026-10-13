import React, { useState, useMemo } from 'react';
import {
  ExplicitLink,
  Party,
  FactClaim,
  CaseEvent,
  EvidenceItem,
  LegalElement,
  EntityType
} from '../../types/case';
import { GitBranch, Filter, Info, Eye, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface Props {
  links: ExplicitLink[];
  parties: Party[];
  facts: FactClaim[];
  events: CaseEvent[];
  evidences: EvidenceItem[];
  elements: LegalElement[];
}

interface GraphNode {
  id: string;
  type: EntityType;
  label: string;
  subtitle: string;
  x: number;
  y: number;
  color: string;
}

export const ExplicitGraph: React.FC<Props> = ({
  links,
  parties,
  facts,
  events,
  evidences,
  elements
}) => {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [selectedLink, setSelectedLink] = useState<ExplicitLink | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [zoom, setZoom] = useState<number>(1);

  // Filter only entities that actually appear in user-created explicit links!
  // Rule: "Graph hanya menggambar relasi yang benar-benar dibuat pengguna."
  const connectedEntityIds = useMemo(() => {
    const ids = new Set<string>();
    links.forEach((l) => {
      ids.add(l.sourceId);
      ids.add(l.targetId);
    });
    return ids;
  }, [links]);

  // Compute node positions in circular / layered layout
  const nodes = useMemo(() => {
    const list: GraphNode[] = [];

    // Columns/groups by entity type for clean hierarchical layout:
    // Left: Parties -> Facts -> Events -> Evidences -> Elements (Right)
    const typeOrder: EntityType[] = ['party', 'fact', 'event', 'evidence', 'element'];
    const columns: Record<EntityType, GraphNode[]> = {
      party: [],
      fact: [],
      event: [],
      evidence: [],
      element: []
    };

    parties.forEach((p) => {
      if (connectedEntityIds.has(p.id)) {
        columns.party.push({
          id: p.id,
          type: 'party',
          label: p.name,
          subtitle: p.role,
          x: 100,
          y: 0,
          color: '#1e293b' // slate
        });
      }
    });

    facts.forEach((f) => {
      if (connectedEntityIds.has(f.id)) {
        columns.fact.push({
          id: f.id,
          type: 'fact',
          label: `${f.subject}: ${f.action}`,
          subtitle: f.type,
          x: 280,
          y: 0,
          color: '#0284c7' // sky
        });
      }
    });

    events.forEach((ev) => {
      if (connectedEntityIds.has(ev.id)) {
        columns.event.push({
          id: ev.id,
          type: 'event',
          label: ev.title,
          subtitle: `${ev.startTime} (${ev.timeCertainty})`,
          x: 480,
          y: 0,
          color: '#d97706' // amber
        });
      }
    });

    evidences.forEach((e) => {
      if (connectedEntityIds.has(e.id)) {
        columns.evidence.push({
          id: e.id,
          type: 'evidence',
          label: e.label,
          subtitle: e.type,
          x: 680,
          y: 0,
          color: '#059669' // emerald
        });
      }
    });

    elements.forEach((el) => {
      if (connectedEntityIds.has(el.id)) {
        columns.element.push({
          id: el.id,
          type: 'element',
          label: `${el.elementCode}: ${el.title}`,
          subtitle: el.status,
          x: 880,
          y: 0,
          color: '#7c3aed' // purple
        });
      }
    });

    // Calculate Y coordinates per column
    typeOrder.forEach((t) => {
      const items = columns[t];
      const spacing = 110;
      const startY = 80;
      items.forEach((item, idx) => {
        item.y = startY + idx * spacing;
        list.push(item);
      });
    });

    return list;
  }, [parties, facts, events, evidences, elements, connectedEntityIds]);

  const nodeMap = useMemo(() => {
    const map = new Map<string, GraphNode>();
    nodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [nodes]);

  // Max SVG height
  const maxSvgHeight = useMemo(() => {
    let maxY = 450;
    nodes.forEach((n) => {
      if (n.y + 100 > maxY) maxY = n.y + 100;
    });
    return maxY;
  }, [nodes]);

  const getLinkColor = (type: string) => {
    switch (type) {
      case 'mendukung':
        return '#059669'; // emerald
      case 'membantah':
        return '#e11d48'; // rose
      case 'perlu_klarifikasi':
        return '#d97706'; // amber
      default:
        return '#64748b'; // slate
    }
  };

  return (
    <div className="space-y-4">
      {/* Sub-header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-amber-600" />
            <span>Grafik Hubungan Relasi Eksplisit</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Menampilkan <strong>hanya</strong> relasi pembuktian yang dibuat secara sadar oleh pengguna.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center bg-slate-100 rounded-lg p-1 text-slate-600">
            <button
              onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
              className="p-1 hover:text-slate-900 rounded"
              title="Perkecil"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-1.5">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom((z) => Math.min(1.4, z + 0.15))}
              className="p-1 hover:text-slate-900 rounded"
              title="Perbesar"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="p-1 hover:text-slate-900 rounded"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Legend Bar */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
        <span className="font-semibold text-slate-700">Legenda Garis Relasi:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-1 bg-emerald-600 rounded"></span>
          <span>Mendukung</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-1 bg-rose-600 rounded"></span>
          <span>Membantah (Sanggahan/Alibi)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-1 bg-amber-600 rounded"></span>
          <span>Perlu Klarifikasi</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-1 bg-slate-400 rounded"></span>
          <span>Belum Tersedia</span>
        </div>
      </div>

      {links.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
          <GitBranch className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-800">Belum Ada Relasi Eksplisit</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            Silakan buka tab <strong>&quot;Relasi Eksplisit&quot;</strong> pada Editor Berkas untuk menghubungkan bukti, fakta, dan unsur perkara secara sengaja.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs relative">
          <div className="overflow-auto max-h-[600px] p-4 bg-slate-50/50">
            <svg
              width={1000 * zoom}
              height={maxSvgHeight * zoom}
              viewBox={`0 0 1000 ${maxSvgHeight}`}
              className="mx-auto transition-transform duration-100"
            >
              {/* Arrow Marker Definitions */}
              <defs>
                <marker
                  id="arrow-mendukung"
                  markerWidth="8"
                  markerHeight="8"
                  refX="14"
                  refY="4"
                  orient="auto"
                >
                  <path d="M0,0 L8,4 L0,8 Z" fill="#059669" />
                </marker>
                <marker
                  id="arrow-membantah"
                  markerWidth="8"
                  markerHeight="8"
                  refX="14"
                  refY="4"
                  orient="auto"
                >
                  <path d="M0,0 L8,4 L0,8 Z" fill="#e11d48" />
                </marker>
                <marker
                  id="arrow-perlu_klarifikasi"
                  markerWidth="8"
                  markerHeight="8"
                  refX="14"
                  refY="4"
                  orient="auto"
                >
                  <path d="M0,0 L8,4 L0,8 Z" fill="#d97706" />
                </marker>
                <marker
                  id="arrow-belum_tersedia"
                  markerWidth="8"
                  markerHeight="8"
                  refX="14"
                  refY="4"
                  orient="auto"
                >
                  <path d="M0,0 L8,4 L0,8 Z" fill="#64748b" />
                </marker>
              </defs>

              {/* Render Directed Link Curves */}
              {links.map((link) => {
                const src = nodeMap.get(link.sourceId);
                const tgt = nodeMap.get(link.targetId);
                if (!src || !tgt) return null;

                const isSelected = selectedLink?.id === link.id;
                const strokeColor = getLinkColor(link.relationType);
                const midX = (src.x + tgt.x) / 2;
                const midY = (src.y + tgt.y) / 2;

                // Bezier curve
                const d = `M ${src.x + 60} ${src.y + 25} Q ${midX} ${midY - 20} ${tgt.x} ${tgt.y + 25}`;

                return (
                  <g key={link.id} className="cursor-pointer" onClick={() => setSelectedLink(link)}>
                    <path
                      d={d}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={isSelected ? 3 : 2}
                      strokeDasharray={link.relationType === 'membantah' ? '4 2' : 'none'}
                      markerEnd={`url(#arrow-${link.relationType})`}
                      className="transition-all hover:stroke-width-3"
                    />
                    {/* Link relation badge on curve */}
                    <rect
                      x={midX - 35}
                      y={midY - 28}
                      width="70"
                      height="16"
                      rx="3"
                      fill="#ffffff"
                      stroke={strokeColor}
                      strokeWidth="1"
                    />
                    <text
                      x={midX}
                      y={midY - 16}
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="bold"
                      fill={strokeColor}
                    >
                      {link.relationType.toUpperCase()}
                    </text>
                  </g>
                );
              })}

              {/* Render Entity Nodes */}
              {nodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x - 50}, ${node.y})`}
                    className="cursor-pointer"
                    onClick={() => setSelectedNode(node)}
                  >
                    <rect
                      width="160"
                      height="54"
                      rx="8"
                      fill="#ffffff"
                      stroke={isSelected ? '#f59e0b' : '#cbd5e1'}
                      strokeWidth={isSelected ? 2.5 : 1}
                      filter="drop-shadow(0 1px 2px rgba(0,0,0,0.05))"
                      className="hover:stroke-slate-400 transition"
                    />

                    {/* Header color accent */}
                    <rect width="4" height="54" rx="2" fill={node.color} />

                    {/* Node Type Label */}
                    <text
                      x="12"
                      y="16"
                      fontSize="8"
                      fontWeight="bold"
                      fill={node.color}
                      letterSpacing="0.05em"
                    >
                      {node.type.toUpperCase()}
                    </text>

                    {/* Node Title (Truncated) */}
                    <text
                      x="12"
                      y="32"
                      fontSize="10"
                      fontWeight="bold"
                      fill="#0f172a"
                      className="truncate"
                    >
                      {node.label.length > 22 ? node.label.substring(0, 20) + '…' : node.label}
                    </text>

                    {/* Node Subtitle */}
                    <text x="12" y="44" fontSize="8" fill="#64748b">
                      {node.subtitle.length > 24
                        ? node.subtitle.substring(0, 22) + '…'
                        : node.subtitle}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Inspector Panel when node or link selected */}
          {(selectedNode || selectedLink) && (
            <div className="border-t border-slate-200 bg-white p-4 flex flex-col sm:flex-row items-start justify-between gap-3">
              {selectedNode && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">
                      Inspeksi Node: [{selectedNode.type}]
                    </span>
                    <button
                      onClick={() => setSelectedNode(null)}
                      className="text-xs text-slate-400 hover:text-slate-600 underline"
                    >
                      Tutup
                    </button>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{selectedNode.label}</h4>
                  <p className="text-xs text-slate-600">{selectedNode.subtitle}</p>
                </div>
              )}

              {selectedLink && (
                <div className="space-y-1 sm:text-right">
                  <div className="flex sm:justify-end items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">
                      Inspeksi Relasi: [{selectedLink.relationType}]
                    </span>
                    <button
                      onClick={() => setSelectedLink(null)}
                      className="text-xs text-slate-400 hover:text-slate-600 underline"
                    >
                      Tutup
                    </button>
                  </div>
                  <p className="text-xs text-slate-700 font-medium">
                    {selectedLink.explanation || 'Tidak ada catatan penjelasan tambahan.'}
                  </p>
                  {selectedLink.sourceRef && (
                    <p className="text-[11px] text-slate-500 font-mono">
                      Sumber: {selectedLink.sourceRef}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
