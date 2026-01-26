export default `
          const vscode = acquireVsCodeApi();

          function save() {
            const commands = [];

            let elements = document.querySelectorAll('[data-identificator="command-name"]');

            for (let elem of elements) {
              const index = elem.dataset.index;
              const name = document.getElementById('command-name-' + index).value
              const command = document.getElementById('command-' + index).value

              const cmd = {
                name,
                command,
              };

              commands.push(cmd)

            }
            vscode.postMessage({
              commands
            });
          }
`;