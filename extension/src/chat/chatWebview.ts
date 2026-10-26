export class ChatWebviewProvider {
  public static getWebviewContent(apiKeyConfigured: boolean, modelName: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RIPOSTE AI Assistant</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 12px;
      background-color: var(--vscode-sideBar-background, #18181b);
      color: var(--vscode-sideBar-foreground, #f4f4f5);
      font-size: 13px;
    }
    .status-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      background: var(--vscode-editor-background, #09090b);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      margin-bottom: 12px;
    }
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-weight: 600;
      font-size: 11px;
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: ${apiKeyConfigured ? '#22c55e' : '#eab308'};
    }
    .chat-messages {
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-height: calc(100vh - 180px);
      overflow-y: auto;
      margin-bottom: 12px;
    }
    .msg {
      padding: 10px 12px;
      border-radius: 8px;
      line-height: 1.5;
    }
    .msg.user {
      background: rgba(59, 130, 246, 0.15);
      border: 1px solid rgba(59, 130, 246, 0.3);
      align-self: flex-end;
      max-width: 90%;
    }
    .msg.ai {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      align-self: flex-start;
      max-width: 95%;
    }
    pre {
      background: #000;
      padding: 8px;
      border-radius: 4px;
      overflow-x: auto;
      font-family: 'Fira Code', monospace;
      font-size: 11px;
    }
    .input-box {
      display: flex;
      gap: 8px;
    }
    textarea {
      flex: 1;
      background: var(--vscode-input-background, #27272a);
      color: var(--vscode-input-foreground, #fff);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 6px;
      padding: 8px;
      resize: vertical;
      min-height: 40px;
    }
    button {
      background: #0284c7;
      color: #fff;
      border: none;
      padding: 8px 14px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
    }
    button:hover {
      background: #0369a1;
    }
    .actions-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 10px;
    }
    .btn-action {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #e4e4e7;
      padding: 4px 8px;
      font-size: 11px;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-action:hover {
      background: rgba(255, 255, 255, 0.18);
    }
  </style>
</head>
<body>
  <div class="status-bar">
    <div class="status-badge">
      <span class="dot"></span>
      <span>${apiKeyConfigured ? 'Gemini 3.8 Flash Active' : 'API Key Warning'}</span>
    </div>
    <span style="font-size:11px; opacity:0.7;">${modelName}</span>
  </div>

  <div class="actions-bar">
    <button class="btn-action" onclick="sendQuickPrompt('Explain selected code')">🔍 Explain Code</button>
    <button class="btn-action" onclick="sendQuickPrompt('Explain Rust borrowing error')">🦀 Rust Error</button>
    <button class="btn-action" onclick="sendQuickPrompt('Propose AI refactor patch')">⚡ Refactor Patch</button>
    <button class="btn-action" onclick="sendQuickPrompt('Review security of selection')">🛡️ Security Review</button>
  </div>

  <div class="chat-messages" id="messages">
    <div class="msg ai">
      👋 Welcome to <strong>RIPOSTE AI</strong>! I am your native Clang/LLVM + Rust + Gemini assistant.<br>
      How can I assist your C/C++ or Rust codebase today?
    </div>
  </div>

  <div class="input-box">
    <textarea id="promptInput" placeholder="Ask RIPOSTE about your Rust or C/C++ code..."></textarea>
    <button onclick="sendPrompt()">Send</button>
  </div>

  <script>
    const vscode = acquireVsCodeApi();

    function sendPrompt() {
      const input = document.getElementById('promptInput');
      const val = input.value.trim();
      if (!val) return;
      
      appendMessage(val, 'user');
      input.value = '';
      vscode.postMessage({ type: 'userPrompt', prompt: val });
    }

    function sendQuickPrompt(action) {
      appendMessage(action, 'user');
      vscode.postMessage({ type: 'userPrompt', prompt: action });
    }

    function appendMessage(text, role) {
      const msgs = document.getElementById('messages');
      const div = document.createElement('div');
      div.className = 'msg ' + role;
      div.innerHTML = text.replace(/\\n/g, '<br>');
      msgs.appendChild(div);
      msgs.scrollTop = msgs.scrollHeight;
    }

    window.addEventListener('message', event => {
      const msg = event.data;
      if (msg.type === 'aiResponse') {
        appendMessage(msg.text, 'ai');
      }
    });
  </script>
</body>
</html>`;
  }
}
