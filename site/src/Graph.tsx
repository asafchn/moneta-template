import { useEffect, useRef, useState } from 'react';
import ButtonBase from '@mui/material/ButtonBase';
import useMediaQuery from '@mui/material/useMediaQuery';
import { edges, nodes, type NodeId } from './data';

export type CanvasNode = { id: string; label: string; color: string; x: number; y: number };
export type CanvasEdge = { from: string; to: string };

export default function Graph({ selected, onSelect }: { selected: NodeId; onSelect: (id: NodeId) => void }) {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [motionChoice, setMotionChoice] = useState<boolean | null>(null);
  const moving = motionChoice ?? !reducedMotion;
  return <div className="graph-stage">
    <CanvasGraph selected={selected} onSelect={id => onSelect(id as NodeId)} items={nodes} connections={edges} ambient={moving} />
    <ButtonBase className="motion-toggle" onClick={() => setMotionChoice(!moving)}>{moving ? 'Pause motion' : 'Play motion'}</ButtonBase>
  </div>;
}

export function CanvasGraph({ selected, onSelect, items, connections, ambient = false }: { selected: string; onSelect: (id: string) => void; items: readonly CanvasNode[]; connections: readonly CanvasEdge[]; ambient?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hitPoints = useRef(new Map<string, { x: number; y: number }>());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let disposed = false;
    let frame = 0;
    let lastFrame = 0;
    let visible = true;
    const byId = new Map(items.map(node => [node.id, node]));
    const neighbors = new Set(connections.flatMap(edge => edge.from === selected ? [edge.to] : edge.to === selected ? [edge.from] : []));
    const render = () => {
      if (disposed) return;
      const { width, height } = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== Math.round(width * dpr)) canvas.width = Math.round(width * dpr);
      if (canvas.height !== Math.round(height * dpr)) canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      const compact = width < 440;
      const time = performance.now() / 1000;
      // A drifting background network adds depth without competing with labels.
      if (ambient) {
        const background = Array.from({ length: 16 }, (_, index) => ({
          x: (0.06 + (index * 0.618034) % 0.88) * width + Math.sin(time * 0.5 + index * 1.7) * 18,
          y: (0.08 + (index * 0.381966) % 0.8) * height + Math.cos(time * 0.4 + index) * 13,
        }));
        ctx.lineWidth = 0.7;
        for (let i = 0; i < background.length; i++) {
          const a = background[i];
          for (let j = i + 1; j < background.length; j++) {
            const b = background[j];
            if (Math.hypot(a.x - b.x, a.y - b.y) > 100) continue;
            ctx.strokeStyle = '#73825f30';
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
          ctx.strokeStyle = '#73825f80'; ctx.fillStyle = '#a3ae8b50';
          ctx.beginPath(); ctx.arc(a.x, a.y, 3.5 + Math.sin(time + i) * 0.8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        }
      }
      const point = (id: string) => {
        const node = byId.get(id)!;
        return {
          x: 25 + node.x * (width - 50),
          y: 28 + node.y * (height - 70),
        };
      };
      hitPoints.current = new Map(items.map(node => [node.id, point(node.id)]));
      for (const [index, edge] of connections.entries()) {
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
        if (ambient) {
          // Paired signals make the two-way connections visible in motion.
          const progress = (time / 4.5 + index * 0.19) % 1;
          for (const travel of [progress, 1 - progress]) {
            const px = a.x + (b.x - a.x) * travel, py = a.y + (b.y - a.y) * travel;
            ctx.beginPath(); ctx.arc(px, py, active ? 6 : 4, 0, Math.PI * 2);
            ctx.fillStyle = active ? '#ae4b2e18' : '#68744e15'; ctx.fill();
            ctx.beginPath(); ctx.arc(px, py, active ? 3 : 2, 0, Math.PI * 2);
            ctx.fillStyle = active ? '#ae4b2e' : '#7f8d67'; ctx.fill();
          }
        }
      }
      for (const node of items) {
        const { x, y } = point(node.id);
        const active = node.id === selected;
        const radius = active ? 21 : 12;
        if (active) {
          ctx.beginPath(); ctx.arc(x, y, 28, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(174,75,46,0.45)'; ctx.lineWidth = 1.2; ctx.stroke();
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
    const tick = (now: number) => {
      if (disposed) return;
      if (now - lastFrame >= 1000 / 30) { render(); lastFrame = now; }
      frame = requestAnimationFrame(tick);
    };
    const updateMotion = () => {
      cancelAnimationFrame(frame);
      render();
      if (ambient && visible && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const visibility = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; updateMotion(); });
    visibility.observe(canvas);
    document.addEventListener('visibilitychange', updateMotion);
    const observer = new ResizeObserver(render);
    observer.observe(canvas); updateMotion();
    void document.fonts.ready.then(render);
    return () => { disposed = true; cancelAnimationFrame(frame); observer.disconnect(); visibility.disconnect(); document.removeEventListener('visibilitychange', updateMotion); };
  }, [selected, items, connections, ambient]);

  return <canvas ref={canvasRef} className="graph-canvas" aria-label={`Knowledge graph with ${items.length} nodes. Use the node buttons to inspect each node and its relationships.`} role="img" onClick={event => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left, y = event.clientY - rect.top;
    const hit = items.find(node => { const point = hitPoints.current.get(node.id); return point && Math.hypot(x - point.x, y - point.y) < 32; });
    if (hit) onSelect(hit.id);
  }} />;
}
