import { Keys } from "./keys";

export default `
    <div class="input-wrapper">
        <label>Name:</label>
        <input data-identificator="command-name" data-index="${Keys.INDEX}" id="command-name-${Keys.INDEX}" value="${Keys.NAME}">
        <label>Command:</label>
        <textarea id="command-${Keys.INDEX}">${Keys.COMMAND}</textarea>
    </div>
`;