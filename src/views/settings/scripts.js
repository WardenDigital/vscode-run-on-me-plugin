(function () {

    const vscode = acquireVsCodeApi();

    document.getElementById("submit").addEventListener("click", save);
    document.querySelectorAll("[data-action='delete']").forEach((button) => {
        button.addEventListener("click", drop);
    });
    document.getElementById("add-command").addEventListener("click", () => {
        const index = document.querySelectorAll('[data-command-index]').length;
        addCommandRow(index);
    });

    function drop(event) {
        const index = event.target.dataset.index;
        const row = document.querySelector(`[data-command-index='${index}']`);
        row.remove();
    }

    function addCommandRow(index, name = "", command = "") {
        const rowTemplate = `
     <div class="input-wrapper" data-command-index="${index}">
        <div class="first-row">
            <div class="name-block">
                <label>Name:</label>
                <input data-identificator="command-name" data-index="${index}" id="command-name-${index}" value="${name}">
            </div>
            <i data-action="delete" data-index="${index}" class="codicon codicon-trash"></i>
        </div>
        <label>Command:</label>
        <textarea id="command-${index}">${command}</textarea>
    </div>`;

        const container = document.getElementById("commands-container");
        container.insertAdjacentHTML("beforeend", rowTemplate);

        const deleteButton = container.querySelector(
            `[data-action="delete"][data-index="${index}"]`,
        );
        deleteButton.addEventListener("click", drop);
    };


    function save() {
        const commands = [];

        let elements = document.querySelectorAll(
            '[data-identificator="command-name"]',
        );

        for (let elem of elements) {
            const index = elem.dataset.index;
            const name = document.getElementById("command-name-" + index).value;
            const command = document.getElementById("command-" + index).value;

            const cmd = {
                name,
                command,
            };

            commands.push(cmd);
        }
        vscode.postMessage({
            commands,
        });
    }

})();
