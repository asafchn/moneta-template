import { useEffect, useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import { CanvasGraph } from './Graph';

type Node = { id: string; type: string; description: string; body: string };
type Edge = { from: string; to: string; type: string; inverse: string; description: string };
type Snapshot = { scope: string; nodes: Node[]; edges: Edge[]; warnings: string[]; loadedAt: string };
const colors = ['#ae4b2e', '#536c84', '#73744d', '#77678b', '#947044', '#63715e'];

export default function Viewer() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  async function refresh(signal?: AbortSignal) {
    setLoading(true);
    try {
      const response = await fetch('/graph.json', { signal, cache: 'no-store' });
      if (!response.ok) throw new Error('Graph unavailable. Check the selected area and its frontmatter, then refresh.');
      const data = await response.json() as Snapshot;
      setSnapshot(data); setSelected(previous => data.nodes.some(n => n.id === previous) ? previous : data.nodes[0]?.id || ''); setError('');
    } catch (cause) {
      if (!signal?.aborted) setError(cause instanceof Error ? cause.message : 'Graph unavailable.');
    } finally { if (!signal?.aborted) setLoading(false); }
  }
  useEffect(() => { const controller = new AbortController(); void refresh(controller.signal); return () => controller.abort(); }, []);
  const visible = useMemo(() => snapshot?.nodes.filter(n => `${n.id} ${n.type} ${n.description}`.toLowerCase().includes(query.toLowerCase())) || [], [snapshot, query]);
  const graphNodes = useMemo(() => {
    const types = [...new Set(visible.map(n => n.type))];
    return visible.map((n, i) => {
      const angle = i * 2.399963229728653;
      const radius = .42 * Math.sqrt((i + .5) / Math.max(visible.length, 1));
      return { id: n.id, label: n.id, color: colors[types.indexOf(n.type) % colors.length], x: .5 + Math.cos(angle) * radius, y: .5 + Math.sin(angle) * radius };
    });
  }, [visible]);
  const connections = useMemo(() => {
    const seen = new Set<string>();
    return (snapshot?.edges || []).filter(e => {
      const key = [e.from, e.to].sort().join('\0');
      if (seen.has(key)) return false;
      seen.add(key); return true;
    });
  }, [snapshot]);
  const node = snapshot?.nodes.find(n => n.id === selected);
  return <main className="viewer-shell"><header className="viewer-header"><div><a className="wordmark" href="/">moneta.</a><p className="eyebrow">YOUR LOCAL KNOWLEDGE GRAPH</p></div><div><span>{snapshot?.scope || 'Loading area'} · read only</span><Button variant="outlined" disabled={loading} onClick={() => void refresh()}>{loading ? 'Loading…' : 'Refresh'}</Button></div></header>
    {error ? <Alert severity="error">{error}{snapshot ? ' Showing the previous snapshot; it may be stale.' : ''}</Alert> : null}
    {snapshot?.warnings.map(warning => <Alert severity="warning" key={warning}>{warning}</Alert>)}
    <div className="viewer-layout"><aside className="viewer-list"><TextField label="Find a node" size="small" value={query} onChange={e => setQuery(e.target.value)} fullWidth /><p className="small-copy">{visible.length} of {snapshot?.nodes.length || 0} nodes · metadata search</p><div role="group" aria-label="Knowledge nodes">{visible.map(n => <ButtonBase key={n.id} className={`viewer-node ${n.id === selected ? 'active' : ''}`} aria-pressed={n.id === selected} onClick={() => setSelected(n.id)}><strong>{n.id}</strong><span>{n.type}</span></ButtonBase>)}</div>{!loading && !visible.length ? <p>No nodes match. An empty area has no Markdown nodes yet.</p> : null}</aside>
      <section className="viewer-graph"><div className="graph-paper"><CanvasGraph items={graphNodes} connections={connections} selected={selected} onSelect={setSelected} /><div className="graph-caption"><span>Select a node or use the list.</span><span>{snapshot ? new Date(snapshot.loadedAt).toLocaleTimeString() : ''}</span></div></div><p className="small-copy">Canvas lines group connections between nodes. The inspector lists every named direction. Search narrows the drawing.</p>
        {node ? <article className="viewer-detail" aria-live="polite"><p className="eyebrow">{node.type}</p><h1>{node.id}</h1><p>{node.description}</p><div className="viewer-relations">{snapshot?.edges.filter(e => e.from === selected).map(e => <Button key={`${e.type}-${e.to}`} onClick={() => { setSelected(e.to); setQuery(''); }} title={`${e.description} Inverse: ${e.inverse}`}><code>[[{e.type}]]</code> : {e.to}</Button>)}</div><pre>{node.body}</pre></article> : null}
      </section></div><footer><span>Local snapshot. Nothing is uploaded. Stop the viewer process to close access.</span></footer></main>;
}
