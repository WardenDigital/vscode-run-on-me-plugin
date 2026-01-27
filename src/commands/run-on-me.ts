import * as vscode from "vscode";
import { exec } from "child_process";
import { Command } from "../types/command";

export default (context: vscode.ExtensionContext) => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("No active file");
    return;
  }

  const filePath = editor.document.fileName;

  const command = context.globalState.get<Array<Command>>("commands");

  if (!command) {
    vscode.window.showErrorMessage(
      'RunOnMe is not configured. Find "RunOnMe Settings" in Explorer',
    );
    return;
  }

  const fileName = filePath.split("/").pop() || "file";

  let commandNames = command.map(
    (cmd) => cmd.name.charAt(0).toUpperCase() + cmd.name.slice(1),
  );

  const ABORT_OPTION = "Abort";

  vscode.window
    .showInformationMessage(
      `Choose an command to run on ${fileName}`,
      ABORT_OPTION,
      ...commandNames,
    )
    .then((selection) => {
      if (!selection || selection === ABORT_OPTION) {
        return;
      }

      const cmdToRun = command.find((cmd) => cmd.name === selection);
      if (!cmdToRun) {
        vscode.window.showErrorMessage(`Command not found: ${selection}`);
        return;
      }

      const commandToExecute = cmdToRun.command.replaceAll("${ME}", filePath);
      vscode.window.showInformationMessage(`executing ${commandToExecute}`);

      exec(commandToExecute, (error, stdout, stderr) => {
        if (error) {
          vscode.window.showErrorMessage(stderr || error.message);
          return;
        }

        vscode.window.showInformationMessage(stdout || "Done");
      });
    });
};
