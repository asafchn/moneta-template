import { useState } from 'react';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Chip from '@mui/material/Chip';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import Graph from './Graph';
import { nodes, edges, learningSteps, edgePairs, relatedPreview, type NodeId } from './data';

const sourceUrl = 'https://github.com/asafchn/moneta-template';

function SectionTitle({ number, eyebrow, title, text }: { number: string; eyebrow: string; title: string; text: string }) {
  return <div className="section-heading"><span className="section-number">{number}</span><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2><p className="section-intro">{text}</p></div></div>;
}

export default function App() {
  const [selected, setSelected] = useState<NodeId>('guidelines');
  const [step, setStep] = useState(0);
  const [host, setHost] = useState('codex');
  const [installRoute, setInstallRoute] = useState('native');
  const [extension, setExtension] = useState('decisions');
  const [extensionStep, setExtensionStep] = useState(0);
  const [notice, setNotice] = useState('');
  const node = nodes.find(n => n.id === selected)!;
  const lesson = learningSteps[step];
  const slug = extension.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'decisions';
  const commands = installRoute === 'skills'
    ? `npx skills add ${sourceUrl}/tree/main/distribution/moneta-setup --global --agent ${host}`
    : host === 'codex'
      ? 'codex plugin marketplace add asafchn/moneta-template\ncodex plugin add moneta-setup@moneta-setup'
      : 'claude plugin marketplace add asafchn/moneta-template\nclaude plugin install moneta-setup@moneta-setup';
  const invocation = installRoute === 'skills' ? host === 'codex' ? '$moneta-setup' : '/moneta-setup' : host === 'codex' ? '$init' : '/moneta-setup:init';

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header wrap">
      <a className="wordmark" href="#" aria-label="Moneta home"><img src="/favicon.svg" width="30" height="30" alt="" />moneta<span className="wordmark-dot">.</span></a>
      <nav aria-label="Main navigation"><a href="#how-it-works">The loop</a><a href="#node-types">The knowledge</a><a href="#extend">Make it yours</a></nav>
      <Button variant="outlined" size="small" href="#install">Get started <span className="arrow">↗</span></Button>
    </header>
    <main id="main">
      <section className="hero wrap" aria-labelledby="hero-title">
        <div className="hero-copy"><p className="eyebrow"><span className="status-dot" /> A FIELD GUIDE TO AGENT MEMORY</p>
          <h1 id="hero-title">Good feedback.<br />Lasting <em>memory.</em></h1>
          <p className="hero-description">You already teach your agent.<br />Give those lessons somewhere to live.</p>
          <p className="hero-detail">Moneta turns useful corrections into reviewed, connected knowledge your agent can retrieve the next time it matters.</p>
          <div className="hero-actions"><Button variant="contained" href="#install">Give your agent a memory <span className="arrow">↗</span></Button><a className="text-link" href="#how-it-works">Follow a lesson ↓</a></div>
          <div className="compatibility"><span>Built for</span><strong>Codex</strong><span className="cross">×</span><strong>Claude Code</strong></div>
        </div>
        <div className="graph-paper">
          <div className="graph-toolbar"><span><span className="status-dot" /> memory / general</span><Chip size="small" variant="outlined" label="Interactive example" /></div>
          <Graph selected={selected} onSelect={setSelected} />
          <div className="graph-caption"><span>01 — A lesson, in context</span><span>Select a node ↖</span></div>
          <div className="graph-selector" role="group" aria-label="Select a graph node">{nodes.map(n => <ButtonBase key={n.id} aria-pressed={selected === n.id} onClick={() => setSelected(n.id)} className={`node-choice ${selected === n.id ? 'chosen' : ''}`}><span style={{ background: n.color }} />{n.label}</ButtonBase>)}</div>
          <div className="node-inspector" aria-live="polite"><span className="eyebrow">{node.type}</span><h3>{node.example}</h3><p>{node.body}</p><div className="relation-list">{edges.filter(e => e.from === selected || e.to === selected).map(e => {
            const outgoing = e.from === selected;
            const related = nodes.find(n => n.id === (outgoing ? e.to : e.from))!;
            return <button key={`${e.from}-${e.to}`} onClick={() => setSelected(related.id)} title={`Reverse: ${outgoing ? e.inverse : e.forward}`}><span>{outgoing ? e.forward : e.inverse}</span> ↔ {related.label}</button>;
          })}</div></div>
        </div>
      </section>
      <div className="principles wrap"><span>Markdown you can read</span><i>✳</i><span>Git history you can review</span><i>✳</i><span>Knowledge you own</span><i>✳</i><span>Context your agent can use</span></div>

      <section id="how-it-works" className="section wrap">
        <SectionTitle number="01" eyebrow="THE LEARNING LOOP" title="From “please change this” to next time." text="One useful correction. A deliberate path into memory." />
        <Tabs value={step} onChange={(_, value: number) => setStep(value)} variant="scrollable" scrollButtons="auto" aria-label="Learning loop" className="flow-tabs">{learningSteps.map((item, i) => <Tab key={item.name} id={`step-tab-${i}`} aria-controls="step-panel" label={<span><small>0{i + 1}</small>{item.name}</span>} />)}</Tabs>
        <div className="lesson-panel" id="step-panel" role="tabpanel" aria-labelledby={`step-tab-${step}`}>
          <div><h3>{lesson.title}</h3><p>{lesson.text}</p><Button onClick={() => setStep((step + 1) % learningSteps.length)}>{step === 4 ? 'Follow it again' : 'Next step'} <span className="arrow">→</span></Button></div>
          <div className="lesson-note"><span className="eyebrow">{lesson.tag}</span><pre>{lesson.content}</pre><span className="note-foot">MONETA / EXAMPLE {String(step + 1).padStart(2, '0')}</span></div>
        </div>
        <p className="margin-note">The learning lives in your knowledge repository. Model weights stay untouched.</p>
      </section>

      <section id="node-types" className="section library-section">
        <div className="wrap"><SectionTitle number="02" eyebrow="THE STARTER COLLECTION" title="Eight types. Room for your thinking." text="Each node is a Markdown file. Metadata helps discover it. The body holds the detail. Named edges explain how it connects." />
          <div className="library-layout"><div className="node-catalog">{nodes.map((n, i) => <ButtonBase key={n.id} onClick={() => setSelected(n.id)} aria-pressed={selected === n.id} className={`catalog-row ${selected === n.id ? 'active' : ''}`}><span className="catalog-number">0{i + 1}</span><span className="catalog-dot" style={{ background: n.color }} /><span><strong>{n.label}</strong><small>{n.description}</small></span><span aria-hidden="true">↗</span></ButtonBase>)}</div>
            <aside className="file-preview" aria-live="polite"><div className="file-top"><span className="file-icon">↳</span>{node.id}.md<Chip label="Example" size="small" variant="outlined" /></div><div className="file-content"><span className="code-comment"># Discovery metadata</span><pre>{`---\nnode-type: ${node.type}\nslug: ${node.id}\ndescription: ${node.example}\nrelated:\n${relatedPreview(selected)}\n---`}</pre><div className="file-divider" /><span className="code-comment"># The knowledge itself</span><h3>{node.example}</h3><p>{node.body}</p></div><div className="file-foot">Simplified preview · runtime schemas define the full contract.</div></aside>
          </div>
          <div className="edge-catalog"><p className="eyebrow">FIVE RELATIONSHIPS. BOTH DIRECTIONS.</p>{edgePairs.map(([forward, inverse, meaning]) => <div key={forward}><code>[[{forward}]] ↔ [[{inverse}]]</code><span>{meaning}</span></div>)}</div><div className="scope-note"><span className="scope-symbol">⌘</span><p><strong>The right memory, for the right agent.</strong> No agent slug? Use <code>general</code>. An explicit slug selects only that agent’s area. No cross-agent reads or fallback to general.</p></div>
        </div>
      </section>

      <section id="extend" className="section wrap">
        <SectionTitle number="03" eyebrow="MAKE IT YOURS" title="Your work has its own vocabulary." text="The extend skill helps decide whether a concept fits an existing node, needs a new type, or needs no change at all." />
        <div className="extend-layout"><div><p className="example-label">TRY A SCHEMA PROPOSAL <span>UI mock</span></p><TextField label="A concept your team wants to remember" value={extension} onChange={event => setExtension(event.target.value)} inputProps={{ maxLength: 48 }} fullWidth helperText="Example: decisions, incidents, design principles" />
          <div className="extend-steps">{['Find the right home', 'Define the shape', 'Name the connection'].map((label, i) => <ButtonBase className={`extend-step ${i === extensionStep ? 'active' : ''}`} key={label} onClick={() => setExtensionStep(i)} aria-pressed={extensionStep === i}><span>0{i + 1}</span>{label}<span>→</span></ButtonBase>)}</div><p className="small-copy">Propose through a PR or MR. Validate schemas, existing nodes, indexes and both directions of each edge before merge.</p></div>
          <div className="extension-preview" aria-live="polite"><span className="eyebrow">EXTEND / {String(extensionStep + 1).padStart(2, '0')}</span>{extensionStep === 0 ? <><h3>Does “{slug}” need a type?</h3><p>Start with a retrieval question. Could a coding guideline or domain-knowledge node already answer it?</p><div className="query-note">“Why did we choose this API pattern?”</div><p>Only add a type if its purpose or required fields are meaningfully different. An isolated node is fine.</p></> : extensionStep === 1 ? <><h3>A schema with a purpose.</h3><pre>{JSON.stringify({ title: slug, type: 'object', required: ['rationale', 'source'], properties: { rationale: { type: 'string' }, source: { type: 'string' } } }, null, 2)}</pre><p className="small-copy">Illustrative type-specific fields. Extend also updates the shared contract and indexes.</p></> : <><h3>A relation should explain itself.</h3><div className="edge-preview"><span>{slug}</span><div>informs →<br />← informed by</div><span>coding-guidelines</span></div><p>Define allowed endpoints and the meaning from each side. Keep the two directions consistent.</p><p className="small-copy">Example relation names; the wizard checks your existing edge vocabulary first.</p></>}</div>
        </div>
      </section>

      <section id="install" className="section install-section"><div className="wrap">
        <SectionTitle number="04" eyebrow="A HOME FOR THE KNOWLEDGE" title="Set it up once. Keep making it yours." text="Moneta Setup creates a new brain or connects to your team’s existing one, then installs its native plugin. Use it in any project or chat, with no codebase binding." />
        <div className="install-layout"><div className="terminal"><div className="terminal-top"><span>INSTALL MONETA SETUP</span><span>↙ your terminal</span></div><Tabs value={host} onChange={(_, value: string) => setHost(value)} aria-label="Agent host"><Tab label="Codex" value="codex" /><Tab label="Claude Code" value="claude-code" /></Tabs><div className="route-switch" role="group" aria-label="Installation method"><Button size="small" variant={installRoute === 'native' ? 'contained' : 'text'} onClick={() => setInstallRoute('native')} aria-pressed={installRoute === 'native'}>Native plugin</Button><Button size="small" variant={installRoute === 'skills' ? 'contained' : 'text'} onClick={() => setInstallRoute('skills')} aria-pressed={installRoute === 'skills'}>Via skills.sh</Button></div><pre data-testid="install-command">{commands}</pre><Button className="copy-button" variant="outlined" onClick={async () => { try { await navigator.clipboard.writeText(commands); setNotice('Install command copied'); } catch { setNotice('Clipboard unavailable. Select and copy the command above.'); } }}>Copy command <span className="arrow">⧉</span></Button><div className="invoke-note">Then open a fresh chat and run <code>{invocation}</code></div></div>
          <div className="wizard-description"><p className="eyebrow">THE WIZARD TAKES IT FROM HERE</p><ol><li><strong>Choose where it lives.</strong><span>Start fresh or join an existing team brain. GitHub or GitLab; your account or organization.</span></li><li><strong>Tell it what the memory is for.</strong><span>Optional context shapes your README. Use your memory across projects and chats; no codebase binding required.</span></li><li><strong>Review your first graph.</strong><span>New brain: review the setup PR/MR. Joining: reuse the existing graph and plugin. Open a fresh chat; approve hook trust if your host asks.</span></li></ol></div>
        </div>
        <div className="setup-notes"><p><strong>Before you start</strong> Git, Node.js, your agent host, and authenticated <code>gh</code> or <code>glab</code>. This template is currently private; installation requires repository access.</p><p><strong>You control the boundary</strong> Your memory works across projects by default. Agent areas stay isolated. Repository or group restrictions are optional. With write access blocked, setup prepares local files and explains the remaining manual steps.</p></div>
      </div></section>
      <section className="local-preview wrap"><div><p className="eyebrow">YOUR GRAPH, ON YOUR MACHINE</p><h2>See what your agent knows.</h2><p>Run <code>moneta-show</code> in your generated plugin. A local canvas opens your selected memory area, with node details and named connections. Custom types come from your own registry.</p></div><div className="local-command"><span>LOCALHOST · READ ONLY</span><code>moneta-show</code><p>General by default. One explicit agent slug at a time. Reads use your local clone. Moneta pulls before operations when the last successful pull is an hour old.</p></div></section><section className="closing wrap"><p className="eyebrow">LESS REPEATING. MORE BUILDING.</p><h2>The next session<br />starts with <em>what you learned.</em></h2><Button variant="contained" href="#install">Start with Moneta <span className="arrow">↗</span></Button></section>
    </main>
    <footer className="wrap"><a className="wordmark" href="#">moneta.</a><span>A memory you own. A history you can read.</span><a href="/LICENSE.txt">PolyForm Shield</a><a href="/NOTICE.txt">Copyright &amp; notices</a><a href={sourceUrl} target="_blank" rel="noreferrer">Source repository ↗</a></footer>
    <Snackbar open={Boolean(notice)} autoHideDuration={3500} onClose={() => setNotice('')} message={notice} />
  </>;
}
