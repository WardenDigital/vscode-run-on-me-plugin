import { Keys } from "./keys";
export default `
 <html>
    <head>
        <style>
            ${Keys.STYLES}
        </style>
    </head>
    <body>
        <div id="wrapper">
            <h2>VSCode RunOnMe Settings</h2>
            <div class="input-group-wrapper">
                ${Keys.CONTENT}
            </div>
            <button id="submit" onclick="save()">Save</button>
        </div>
        <script>
            ${Keys.SCRIPTS}
        </script>
    </body>
</html>
`;