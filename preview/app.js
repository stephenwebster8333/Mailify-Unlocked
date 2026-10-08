const messages = [
  { id: 1, sender: 'Alex Morgan', email: 'alex@example.com', initials: 'AM', color: 'sage', subject: 'A fresh start for the workspace', preview: 'Everything is ready for a little exploration.', time: '10:24 AM', tag: 'Workspace', body: 'Hi there,\n\nWelcome to your mock workspace! We have put together a few fictional conversations so you can explore the inbox without connecting a real account.\n\nTry searching for a message or opening a different conversation. The domain utilities are also available in the sidebar, and everything runs locally in your browser.\n\nEnjoy exploring,\nAlex' },
  { id: 2, sender: 'Design Studio', email: 'studio@example.org', initials: 'DS', color: 'lavender', subject: 'Your weekly inspiration', preview: 'A few ideas worth keeping on your radar.', time: '9:10 AM', tag: 'Newsletter', body: 'Hello,\n\nThis week we are exploring thoughtful layouts, clear typography, and small details that make everyday tools feel better.\n\nOur fictional reading list: designing for focus, choosing calmer colors, and making space for the important things.\n\nUntil next week,\nThe Design Studio team' },
  { id: 3, sender: 'Jamie Chen', email: 'jamie@example.net', initials: 'JC', color: 'peach', subject: 'Coffee and a quick catch-up?', preview: 'How does Thursday afternoon sound?', time: 'Yesterday', tag: 'Personal', body: 'Hey,\n\nWant to grab a coffee and talk through the demo ideas on Thursday afternoon? I would love to hear what you think of the new inbox layout.\n\nThis is a fictional invitation, so no calendar booking is needed!\n\nJamie' },
  { id: 4, sender: 'Project Notes', email: 'notes@example.com', initials: 'PN', color: 'blue', subject: 'The small things, organized', preview: 'A short summary of our sample project.', time: 'Yesterday', tag: 'Workspace', body: 'Sample project summary\n\n• Explore the mock inbox.\n• Extract domains from sample text.\n• Keep everything offline and isolated.\n\nNo real messages, account checks, or external services are involved in this preview.' },
  { id: 5, sender: 'Demo Team', email: 'team@example.org', initials: 'DT', color: 'sage', subject: 'You are all set', preview: 'Your preview is ready. Take a look around.', time: 'Oct 6', tag: 'Updates', body: 'Welcome aboard,\n\nYour isolated demo is ready to explore. All messages are synthetic, and no original application modules are loaded or executed.\n\nThe domain utility only processes text you enter. It does not validate accounts, query mail servers, or perform network lookups.\n\nThe Demo Team' }
];
const $ = (id) => document.getElementById(id);
let selected = 1;
function el(tag, className, text) { const node = document.createElement(tag); node.className = className; if (text !== undefined) node.textContent = text; return node; }
function renderDetail(message) {
  const detail = $('message-detail'); detail.replaceChildren();
  if (!message) { detail.append(el('p', 'empty', 'No messages match your search.')); return; }
  detail.append(el('span', 'eyebrow', message.tag.toUpperCase()), el('h2', 'message-subject', message.subject));
  const sender = el('div', 'sender-row'); sender.append(el('span', `avatar ${message.color}`, message.initials));
  const meta = el('div', 'sender-meta'); meta.append(el('strong', '', message.sender), el('span', 'muted', `${message.email} · To: you@example.com`));
  sender.append(meta); detail.append(sender, el('div', 'message-body', message.body), el('div', 'message-note', 'FICTIONAL MESSAGE · FOR PREVIEW ONLY'));
}
function renderInbox() {
  const query = $('search').value.toLowerCase().trim();
  const visible = messages.filter(m => `${m.sender} ${m.subject} ${m.body} ${m.email}`.toLowerCase().includes(query));
  if (!visible.some(m => m.id === selected)) selected = visible[0]?.id;
  $('message-list').replaceChildren();
  for (const m of visible) {
    const button = el('button', `message-item${m.id === selected ? ' selected' : ''}`); button.setAttribute('aria-pressed', String(m.id === selected)); button.dataset.id = m.id;
    button.append(el('span', `avatar ${m.color}`, m.initials)); const text = el('span', 'message-summary');
    const top = el('span', 'message-top'); top.append(el('strong', '', m.sender), el('span', 'time', m.time));
    text.append(top, el('span', 'list-subject', m.subject), el('span', 'list-preview', m.preview)); button.append(text);
    button.addEventListener('click', () => { selected = m.id; renderInbox(); }); $('message-list').append(button);
  }
  renderDetail(visible.find(m => m.id === selected));
}
$('search').addEventListener('input', renderInbox);
for (const view of ['inbox', 'domains']) $(view + '-tab').addEventListener('click', () => {
  for (const name of ['inbox', 'domains']) { $(name + '-panel').hidden = name !== view; $(name + '-tab').classList.toggle('active', name === view); $(name + '-tab').setAttribute('aria-pressed', String(name === view)); }
  $('page-title').textContent = view === 'inbox' ? 'Mock inbox' : 'Domain utilities';
  $('page-description').textContent = view === 'inbox' ? 'A little clarity for your correspondence.' : 'Less clutter. Cleaner domain lists.';
});
function resetResults() { $('domain-results').replaceChildren(); $('domain-count').textContent = '0 domains'; $('domain-status').textContent = 'Your results will appear here.'; }
$('sample').addEventListener('click', () => { $('domain-input').value = 'hello@example.com\nhttps://docs.example.org/guide\nexample.net\nteam@example.com'; resetResults(); });
$('clear').addEventListener('click', () => { $('domain-input').value = ''; resetResults(); });
$('extract').addEventListener('click', () => {
  const lines = $('domain-input').value.split(/\r?\n/).map(v => v.trim()).filter(Boolean); const domains = new Set(); let skipped = 0;
  for (const line of lines) {
    let host;
    try {
      if (/^[^\s@:/]+@[^\s@:/]+$/.test(line)) host = line.split('@')[1];
      else if (/^https?:\/\//i.test(line)) { const url = new URL(line); if (url.username || url.password) throw new Error('Credentials are not accepted'); host = url.hostname; }
      else if (!/[\s/@:?#]/.test(line)) host = line;
      else throw new Error('Unsupported text');
      host = host.toLowerCase().replace(/\.$/, '');
      const labels = host.split('.');
      if (labels.length < 2 || host.length > 253 || !/^[a-z]{2,63}$/.test(labels.at(-1)) || labels.some(l => !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(l))) throw new Error('Invalid domain');
      domains.add(host);
    } catch { skipped++; }
  }
  $('domain-results').replaceChildren(...[...domains].sort().map(domain => el('li', '', domain)));
  $('domain-count').textContent = `${domains.size} domain${domains.size === 1 ? '' : 's'}`;
  $('domain-status').textContent = lines.length ? `${domains.size} unique domain${domains.size === 1 ? '' : 's'} extracted.${skipped ? ` ${skipped} unsupported or invalid line${skipped === 1 ? '' : 's'} skipped.` : ''}` : 'Enter some text to get started.';
});
renderInbox();
// Development-only refresh notification from the isolated static server.
const updates = new EventSource('/__reload'); updates.onmessage = () => window.location.reload();
