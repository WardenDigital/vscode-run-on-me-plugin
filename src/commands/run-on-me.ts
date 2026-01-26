import * as vscode from 'vscode';
import { exec } from 'child_process';

export default (context: vscode.ExtensionContext) => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage('No active file');
        return;
      }

      const filePath = editor.document.fileName;

      const command = context.globalState.get<string>('command');

      if (!command) {
        vscode.window.showErrorMessage('RunOnMe is not configured. Find "RunOnMe Settings" in Explorer');
        return;
      }

      const commandToExecute = command.replaceAll("${FILE}", filePath);
      vscode.window.showInformationMessage(`executing ${commandToExecute}`);

      exec(commandToExecute, (error, stdout, stderr) => {
        if (error) {
          vscode.window.showErrorMessage(stderr || error.message);
          return;
        }

        vscode.window.showInformationMessage(stdout || 'Done');
      });
    }