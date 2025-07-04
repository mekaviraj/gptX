const extraFieldsList = [
  { id: "topic", label: "topic / subject" },
  { id: "context", label: "context / examples" },
  { id: "tone", label: "tone / style" },
  { id: "audience", label: "target audience" },
  { id: "format", label: "format" },
  { id: "role", label: "role" },
  { id: "keywords", label: "keywords" },
  { id: "positive", label: "positive / key words" },
  { id: "negative", label: "negative / constraints" },
  { id: "length", label: "length" }
];

const chatLog = [];

function renderExtraFields() {
  const container = document.getElementById('extra-fields');
  container.innerHTML = '';
  extraFieldsList.forEach(f => {
    const input = document.createElement('input');
    input.type = 'text';
    input.id = f.id;
    input.placeholder = f.label;
    input.className = "rounded border border-gray-300 dark:border-gray-700 p-2 bg-white dark:bg-gray-800";
    container.appendChild(input);
  });
}

function mergePrompt() {
  const main = document.getElementById('main-prompt').value.trim();
  let merged = main;
  extraFieldsList.forEach(f => {
    const val = document.getElementById(f.id)?.value.trim();
    if (val) merged += ` • ${f.label.split('/')[0].trim()}: ${val}`;
  });
  return merged;
}

function renderChat() {
  const chatWindow = document.getElementById('chat-window');
  chatWindow.innerHTML = '';
  chatLog.forEach((msg, idx) => {
    const align = msg.role === 'user' ? 'justify-end' : 'justify-start';
    const bubbleColor = msg.role === 'user'
      ? 'bg-blue-600 text-white'
      : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100';
    const bubble = document.createElement('div');
    bubble.className = `flex ${align}`;
    bubble.innerHTML = `
      <div class="max-w-xl px-4 py-2 rounded-lg shadow ${bubbleColor} whitespace-pre-wrap prose prose-sm dark:prose-invert">
        ${marked.parse(msg.content)}
      </div>
    `;
    chatWindow.appendChild(bubble);
  });
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function addToHistory(prompt) {
  const history = document.getElementById('chat-history');
  const li = document.createElement('li');
  li.className = "truncate cursor-pointer hover:underline";
  li.textContent = prompt.length > 40 ? prompt.slice(0, 40) + "..." : prompt;
  history.appendChild(li);
}

function fakeAIResponse(prompt) {
  // Replace with real AI call
  return "AI response for: " + prompt;
}

document.addEventListener('DOMContentLoaded', () => {
  renderExtraFields();

  const expandBtn = document.getElementById('expand-btn');
  const extraFields = document.getElementById('extra-fields');
  let expanded = false;
  expandBtn.addEventListener('click', () => {
    expanded = !expanded;
    extraFields.classList.toggle('hidden', !expanded);
  });

  document.getElementById('chat-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const prompt = mergePrompt();
    chatLog.push({ role: 'user', content: prompt });
    renderChat();
    addToHistory(prompt);

    // Simulate AI response
    setTimeout(() => {
      const aiResp = fakeAIResponse(prompt);
      chatLog.push({ role: 'ai', content: aiResp });
      renderChat();
    }, 500);

    document.getElementById('main-prompt').value = '';
    extraFieldsList.forEach(f => document.getElementById(f.id).value = '');
  });

  document.getElementById('export-btn').addEventListener('click', async () => {
    const resp = await fetch('/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(chatLog)
    });
    if (resp.ok) {
      const blob = await resp.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'chatlog.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    }
  });
});