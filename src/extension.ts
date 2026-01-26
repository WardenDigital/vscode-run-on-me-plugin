import * as vscode from 'vscode';
import runOnMe from './commands/run-on-me';
import openSettings from './commands/setting';

export function activate(context: vscode.ExtensionContext) {

    const disposables = [];

    disposables.push(vscode.commands.registerCommand('vscode-run-on-me.run-on-me', () => runOnMe(context)));
    disposables.push(vscode.commands.registerCommand('vscode-run-on-me.settings', () => openSettings(context)));


    context.subscriptions.push(...disposables);
}

export function deactivate() { }
