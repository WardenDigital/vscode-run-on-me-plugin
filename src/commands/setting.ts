import * as vscode from 'vscode';
import wrapper from '../views/settings/wrapper';
import scripts from '../views/settings/scripts';
import styles from '../views/settings/styles';
import command from '../views/settings/command';
import { Command } from '../types/command';
import { Keys } from '../views/settings/keys';

export default (context: vscode.ExtensionContext) => {
    const panel = vscode.window.createWebviewPanel(
        'runOnMeSettings',
        'RunOnMe Settings',
        vscode.ViewColumn.One,
        { enableScripts: true }
    );

    const commands = []//context.globalState.get<Array<Command>>('commands') ?? [];
    // Extra command as a new entry for UX purposes
    commands.push({name: '', command: ''});

    let template = wrapper;
    let commandsHTML = ``;

    commands.forEach((element, index) => {
      const tmpl = command.replaceAll(Keys.INDEX, String(index)).replace(Keys.COMMAND, element.command).replace(Keys.NAME, element.name);
      commandsHTML += tmpl;
    });


    template = template.replace(Keys.CONTENT, commandsHTML);
    template = template.replace(Keys.STYLES, styles).replace(Keys.SCRIPTS, scripts);

    panel.webview.html = template;

    panel.webview.onDidReceiveMessage(msg => {
        console.log(msg);
        context.globalState.update('commands', msg.commands);
        vscode.window.showInformationMessage('RunOnMe settings saved');
    });
};
