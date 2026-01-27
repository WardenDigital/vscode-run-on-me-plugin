import * as vscode from "vscode";
import { Command } from "../types/command";
import { Keys } from "../views/settings/keys";

export default (context: vscode.ExtensionContext) => {
  const settings = Setting.getInstance(context);
  settings.render();
};

class Setting {
  private static instance: Setting;
  private panel: vscode.WebviewPanel;
  private readonly extensionContext: vscode.ExtensionContext;

  public static getInstance(ctx: vscode.ExtensionContext): Setting {
    Setting.instance = new Setting(ctx);

    return Setting.instance;
  }

  constructor(ctx: vscode.ExtensionContext) {
    this.extensionContext = ctx;
    this.panel = vscode.window.createWebviewPanel(
      "runOnMeSettings",
      "RunOnMe Settings",
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.joinPath(
            this.extensionContext.extensionUri,
            "src",
            "views",
            "settings",
          ),
          vscode.Uri.joinPath(
            this.extensionContext.extensionUri,
            "node_modules",
            "@vscode",
            "codicons",
            "dist",
          ),
        ],
      },
    );

    this.panel.webview.onDidReceiveMessage((msg) => {
      const newCommands = msg.commands.filter(
        (cmd: Command) => cmd.name && cmd.command,
      );
      this.extensionContext.globalState.update("commands", newCommands);

      this.render();

      vscode.window.showInformationMessage("RunOnMe settings saved");
    });
  }

  /**
   * Renders the settings panel with the provided commands.
   *
   * @param commands - An array of Command objects to be rendered in the panel.
   */
  render = () => {
    const commands = this.getCommands();
    const template = this.getTemplate(commands);
    this.panel.webview.html = template;
  };

  /**
   * Retrieves the stored commands from the extension's global state.
   *
   * @returns An array of Command objects.
   */
  getCommands = (): Array<Command> => {
    return (
      this.extensionContext.globalState.get<Array<Command>>("commands") ?? []
    );
  };

  /**
   * Stores the provided commands in the extension's global state.
   *
   * @param commands - An array of Command objects to be stored.
   */
  storeCommands = (commands: Array<Command>) => {
    const sanitizedCommands = commands.filter((cmd) => cmd.name && cmd.command);
    this.extensionContext.globalState.update("commands", sanitizedCommands);
  };

  /**
   * Generates the HTML template for the settings panel.
   *
   * @param commands - An array of Command objects to be included in the template.
   *
   * @returns The complete HTML template as a string.
   */
  getTemplate = (commands: Array<Command>) => {
    const webview = this.panel.webview;

    const codiconsUri = this.panel.webview.asWebviewUri(
      vscode.Uri.joinPath(
        this.extensionContext.extensionUri,
        "node_modules",
        "@vscode/codicons",
        "dist",
        "codicon.css",
      ),
    );
    const stylePath = vscode.Uri.joinPath(
      this.extensionContext.extensionUri,
      "src",
      "views",
      "settings",
      "style.css",
    );
    const styleUri = webview.asWebviewUri(stylePath);
    const scriptPath = vscode.Uri.joinPath(
      this.extensionContext.extensionUri,
      "src",
      "views",
      "settings",
      "scripts.js",
    );
    const scriptUri = webview.asWebviewUri(scriptPath);

    const nonce = this.getNonce();

    let tmpl = `
        <!DOCTYPE html>
         <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="${codiconsUri}" rel="stylesheet">
                <link href="${styleUri}" rel="stylesheet">
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; font-src ${webview.cspSource}; style-src ${webview.cspSource}; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">

                <title>RunOnMe Settings</title>
            </head>
            <body>
                <div id="wrapper">
                    <h2>VSCode RunOnMe Settings</h2>
                    <div class="input-group-wrapper">
                        <div id="commands-container">
                            ${Keys.CONTENT}
                        </div>
                        <div class="add-command-wrapper">
                            <button id="add-command">
                                <i class="codicon codicon-add"></i>
                                Add Command
                            </button>
                        </div>
                    </div>
                    <button id="submit">Save</button>
                </div>
                <script nonce="${nonce}" src="${scriptUri}"></script>
            </body>
        </html>
        `;

    let commandsHTML = ``;
    commands.forEach((element, index) => {
      const commandTmpl = this.getCommandTemplate(element, index);
      commandsHTML += commandTmpl;
    });

    tmpl = tmpl.replace(Keys.CONTENT, commandsHTML);
    return tmpl;
  };

  /**
   * Generats the HTML template for a single command entry.
   *
   * @param element - The Command object containing name and command.
   * @param index - The index of the command in the list.
   *
   * @returns The HTML template for the command entry as a string.
   */
  getCommandTemplate = (element: Command, index: number): string => {
    return `<div class="input-wrapper" data-command-index="${index}">
        <div class="first-row">
            <div class="name-block">
                <label>Name:</label>
                <input data-identificator="command-name" data-index="${index}" id="command-name-${index}" value="${element.name}">
            </div>
            <i data-action="delete" data-index="${index}" class="codicon codicon-trash"></i>
        </div>
        <label>Command:</label>
        <textarea id="command-${index}">${element.command}</textarea>
    </div>`;
  };

  /**
   * Generates a random nonce string.
   *
   * @returns A random nonce string.
   */
  getNonce(): string {
    let text = "";
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
}
