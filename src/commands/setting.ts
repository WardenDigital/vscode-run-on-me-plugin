import * as vscode from 'vscode'

export default (context: vscode.ExtensionContext) => {
    const panel = vscode.window.createWebviewPanel(
        'runOnMeSettings',
        'RunOnMe Settings',
        vscode.ViewColumn.One,
        { enableScripts: true }
    );

    const command = context.globalState.get<string>('command') ?? '';

    panel.webview.html = `
    <html>
      <head>
      <style>
        #wrapper {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
        }
        label {
            margin-bottom: 1rem;
            font-size: 1rem;
        }
        
        .input-group-wrapper {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 2rem;
            padding: 1rem;
            border: 1px solid #fff;
            border-radius: 1rem;
        }

        .input-wrapper {
            width: 100%;
            display:flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        textarea {
            width: 80%;
            padding: 0.8rem;
            font-size: 1rem;
            border: 1px solid #fff;
            border-radius: 1rem;
            color: #fff;
            background: none;
        }

        #submit {
            background: none;
            border: 1px solid #fff;
            border-radius: 1rem;
            width: fit-content;
            padding: 0.5rem 1rem;
            color: white;
            font-size: 1rem;
            font-weight: bold;
        }
      </style>
      </head>
      <body>

        <div id="wrapper">
            <h2>VSCode RunOnMe Settings</h2>
            <div class="input-group-wrapper">
                <div class="input-wrapper">
                    <label id="command-label">Executable/Command (use <b>\${FILE}</b> as current file absolute path).</label>
                    <textarea id="command">${command}</textarea>
                </div>
            </div>
            <button id="submit" onclick="save()">Save</button>
        </div>

        <script>
          const vscode = acquireVsCodeApi();
          function save() {
            vscode.postMessage({
              command: document.getElementById('command').value,
            });
          }
        </script>
      </body>
    </html>
  `;

    panel.webview.onDidReceiveMessage(msg => {
        context.globalState.update('command', msg.command);
        vscode.window.showInformationMessage('RunOnMe settings saved');
    });
}
