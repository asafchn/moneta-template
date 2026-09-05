import { useEffect, useRef } from 'react';
import { edges, nodes, type NodeId } from './data';

export type CanvasNode = { id: string; label: string; color: string; x: number; y: number };
export type CanvasEdge = { from: string; to: string };

export default function Graph({ selected, onSelect }: { selected: NodeId; onSelect: (id: NodeId) => void }) {
  return <CanvasGraph selected={selected} onSelect={id => onSelect(id as NodeId)} items={nodes} connections={edges} />;
}

export function CanvasGraph({ selected, onSelect, items, connections }: { selected: string; onSelect: (id: string) => void; items: readonly CanvasNode[]; connections: readonly CanvasEdge[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let disposed = false;
    const render = () => {
      if (disposed) return;
      const { width, height } = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      const compact = width < 440;
      const byId = new Map(items.map(node => [node.id, node]));
      const neighbors = new Set(connections.flatMap(edge => edge.from === selected ? [edge.to] : edge.to === selected ? [edge.from] : []));
      const point = (id: string) => {
        const node = byId.get(id)!;
        return { x: 25 + node.x * (width - 50), y: 28 + node.y * (height - 70) };
      };
      for (const edge of connections) {
        if (!byId.has(edge.from) || !byId.has(edge.to)) continue;
        const a = point(edge.from), b = point(edge.to);
        const active = edge.from === selected || edge.to === selected;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = active ? '#89917a' : '#d0d4c5';
        ctx.lineWidth = active ? 1.5 : 1; ctx.stroke();
        // Small midpoint diamond: relations have meaning in both directions.
        const x = (a.x + b.x) / 2, y = (a.y + b.y) / 2;
        ctx.fillStyle = active ? '#89917a' : '#d0d4c5';
        ctx.beginPath(); ctx.moveTo(x, y - 3); ctx.lineTo(x + 3, y); ctx.lineTo(x, y + 3); ctx.lineTo(x - 3, y); ctx.closePath(); ctx.fill();
      }
      for (const node of items) {
        const { x, y } = point(node.id);
        const active = node.id === selected;
        const radius = active ? 21 : 12;
        if (active) {
          ctx.beginPath(); ctx.arc(x, y, 29, 0, Math.PI * 2); ctx.strokeStyle = '#ae4b2e44'; ctx.lineWidth = 1; ctx.stroke();
        }
        ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = active ? '#ae4b2e' : '#f5f4ed'; ctx.fill();
        ctx.strokeStyle = active ? '#ae4b2e' : node.color; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.beginPath(); ctx.arc(x, y, active ? 4 : 3, 0, Math.PI * 2);
        ctx.fillStyle = active ? '#faf9f4' : node.color; ctx.fill();
        if (items.length > 40 && !active && !neighbors.has(node.id)) continue;
        const fullLabel = compact && node.id === 'responsibility' ? 'Responsibility' : compact && node.id === 'flow' ? 'Flow context' : node.label;
        const limit = compact ? 28 : 38;
        const label = fullLabel.length > limit ? fullLabel.slice(0, limit - 1) + '…' : fullLabel;
        ctx.font = `${active ? '600' : '400'} ${compact ? 10 : 12}px "DM Sans", sans-serif`;
        const labelWidth = ctx.measureText(label).width;
        const labelX = Math.max(labelWidth / 2 + 6, Math.min(width - labelWidth / 2 - 6, x));
        const labelY = y + radius + 18;
        ctx.fillStyle = '#eeefe6'; ctx.fillRect(labelX - labelWidth / 2 - 5, labelY - 11, labelWidth + 10, 17);
        ctx.textAlign = 'center'; ctx.fillStyle = active ? '#933e27' : '#454f42'; ctx.fillText(label, labelX, labelY);
      }
    };
    const observer = new ResizeObserver(render);
    observer.observe(canvas); render();
    void document.fonts.ready.then(render);
    return () => { disposed = true; observer.disconnect(); };
  }, [selected, items, connections]);

  return <canvas ref={canvasRef} className="graph-canvas" aria-label={`Knowledge graph with ${items.length} nodes. Use the node buttons to inspect each node and its relationships.`} role="img" onClick={event => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left, y = event.clientY - rect.top;
    const hit = items.find(node => Math.hypot(x - (25 + node.x * (rect.width - 50)), y - (28 + node.y * (rect.height - 70))) < 32);
    if (hit) onSelect(hit.id);
  }} />;
}
