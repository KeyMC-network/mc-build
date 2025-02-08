const workspace = document.getElementById('workspace');

// Funzioni Drag-and-Drop
document.querySelectorAll('.block').forEach(block => {
    block.addEventListener('dragstart', dragStart);
});

workspace.addEventListener('dragover', dragOver);
workspace.addEventListener('drop', drop);

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.type);
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    const type = e.dataTransfer.getData('text/plain');
    const newBlock = document.createElement('div');
    newBlock.classList.add('block', type);
    newBlock.textContent = type;
    newBlock.setAttribute("onclick", "editBlock(this)");
    workspace.appendChild(newBlock);
}

// Configurazione avanzata dei blocchi
function editBlock(block) {
    const blockType = block.dataset.type;
    let param = prompt(`Configura il blocco (${blockType}):`, "");
    if (param !== null) {
        block.setAttribute("data-param", param);
    }
}

// Genera codice Java
function generateCode() {
    const blocks = workspace.querySelectorAll('.block');
    let code = `// Codice generato automaticamente\n\n`;
    blocks.forEach(block => {
        const type = block.dataset.type;
        const param = block.getAttribute("data-param") || "";
        if (type === 'command') code += `registerCommand("${param}");\n`;
        else if (type === 'event') code += `@EventHandler\npublic void onEvent(${param} e) {}\n`;
        else if (type === 'sendMessage') code += `player.sendMessage("${param}");\n`;
        else if (type === 'teleport') code += `player.teleport(${param});\n`;
        else if (type === 'scoreboard') code += `createScoreboard("${param}");\n`;
    });
    console.log(code);
    alert("Codice generato! Controlla la console.");
}

// Salvataggio del progetto
function saveProject() {
    const blocks = [];
    workspace.querySelectorAll('.block').forEach(block => {
        blocks.push({
            type: block.dataset.type,
            param: block.getAttribute("data-param") || ""
        });
    });
    const json = JSON.stringify(blocks);
    const blob = new Blob([json], { type: "application/json" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = "progetto.json";
    link.click();
}

// Caricamento del progetto
function loadProject() {
    const input = document.createElement('input');
    input.type = "file";
    input.accept = ".json";
    input.addEventListener("change", function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function() {
            const blocks = JSON.parse(reader.result);
            workspace.innerHTML = ""; // Pulisce l'area di lavoro
            blocks.forEach(blockData => {
                const newBlock = document.createElement('div');
                newBlock.classList.add('block', blockData.type);
                newBlock.textContent = blockData.type;
                newBlock.setAttribute("data-param", blockData.param);
                newBlock.setAttribute("onclick", "editBlock(this)");
                workspace.appendChild(newBlock);
            });
        };
        reader.readAsText(file);
    });
    input.click();
}

// Scarica il codice generato
function downloadCode() {
    const blocks = workspace.querySelectorAll('.block');
    let code = "// Plugin generato automaticamente\n\n";
    blocks.forEach(block => {
        const type = block.dataset.type;
        const param = block.getAttribute("data-param") || "";
        if (type === 'command') code += `registerCommand("${param}");\n`;
        else if (type === 'event') code += `@EventHandler\npublic void onEvent(${param} e) {}\n`;
        else if (type === 'sendMessage') code += `player.sendMessage("${param}");\n`;
        else if (type === 'teleport') code += `player.teleport(${param});\n`;
        else if (type === 'scoreboard') code += `createScoreboard("${param}");\n`;
    });

    const blob = new Blob([code], { type: "text/plain" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = "plugin.java";
    link.click();
}

// Barra di ricerca per i blocchi
function searchBlocks() {
    const query = document.getElementById('search').value.toLowerCase();
    document.querySelectorAll('.block').forEach(block => {
        if (block.textContent.toLowerCase().includes(query)) {
            block.style.display = "block";
        } else {
            block.style.display = "none";
        }
    });
}
