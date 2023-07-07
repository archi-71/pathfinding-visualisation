const rows = 25;
const cols = 50;
var grid;
var start;
var end;
var state = "initial";
var explorations = 0;
var pathLength = -1;
var diagonals = false;
var delayDuration;
var delayFrequency;
var count = 0;
var mouseDown = false;
var draw;
var cellWidth;
var cellHeight;

$(document).ready(function() {
    createGrid();
    generate();
    updateSpeed();
    $(window).resize(resizeGrid);
    $("#generate").click(generate);
    $("#pathfind").click(pathfind);
    $("#cancel").click(reset);
    $("#reset").click(reset);
    $("#allowDiagonals").on('input', function() {
        diagonals = !diagonals;
    });
    $("#speed").on("input", updateSpeed);
    $(document).mousemove(function(event) {
        let row = Math.floor((event.pageY - $(".grid").offset().top) / cellHeight);
        let col = Math.floor((event.pageX - $(".grid").offset().left) / cellWidth);
        if (mouseDown) {
            clickCell(row, col);
        }
    });
});

function createGrid() {
    grid = [];
    for (let i = 0; i < rows; i++) {
        grid.push([]);
        for (let j = 0; j < cols; j++) {
            grid[i][j] = 0;
            $(".grid").append(`<div id='${i}-${j}' class='clear border'></div>`);
            $(`#${i}-${j}`).mousedown(function(){
                mouseDown = true;
                if (grid[i][j] === 0) {
                    if (start.row === i && start.col === j) {
                        draw = "start";
                    }
                    else if (end.row === i && end.col === j) {
                        draw = "end";
                    }
                    else {
                        draw = "block";
                    }
                }
                else {
                    draw = "clear";
                }
                clickCell(i, j);
            });
            $(`#${i}-${j}`).mouseup(function(){
                mouseDown = false;
            });
            $(`#${i}-${j}`).on('dragstart', function(event) { event.preventDefault(); });
        }
    }
    resizeGrid();
}

async function updateCell(row, col, state, instant) {
    if (state == "block") {
        grid[row][col] = 1;
    }
    else {
        grid[row][col] = 0;
    }
    $(`#${row}-${col}`).removeClass("clear block start end explored frontier path");
    $(`#${row}-${col}`).addClass(state);
    updateStatus();
    updateControls();
    if (!instant) {
        count++;
        if (count >= delayFrequency) {
            count = 0;
            await sleep(delayDuration);
        }
    }
}

function clickCell(row, col) {
    if (row < 0 || row >= rows || col < 0 || col >= cols) {
        mouseDown = false;
        return;
    }
    if (state === "initial") {
        if ((start.row === row && start.col === col) || (end.row === row && end.col === col)) {
            return;
        }
        if (draw === "start") {
            if (grid[row][col] === 0) {
                updateCell(start.row, start.col, "clear", true);
                start = {row:row, col:col};
                updateCell(start.row, start.col, "start", true);
            }
        }
        else if (draw === "end") {
            if (grid[row][col] === 0) {
                updateCell(end.row, end.col, "clear", true);
                end = {row:row, col:col};
                updateCell(end.row, end.col, "end", true);
            }
        }
        else if (draw === "block") {
            updateCell(row, col, "block", true);
        }
        else {
            updateCell(row, col, "clear", true);
        }
    }
}

function resizeGrid() {
    $(".grid").css("grid-template-columns", `repeat(${cols}, auto)`)
    $(".grid").css("grid-template-rows", `repeat(${rows}, auto)`)
    cellWidth = $(".grid div:first-child").outerWidth();
    cellHeight = $(".grid div:first-child").outerHeight();
}

function reset() {
    state = "initial";
    explorations = 0;
    pathLength = -1;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            $(`#${i}-${j}`).removeClass("explored frontier path");
        }
    }
    updateStatus();
    updateControls();
}

function updateControls() {
    $("#generationControls").css("display", state == "pathfinding" ? "none" : "inline");
    $("#algorithmLabel").css("display", state == "initial" ? "inline" : "none");
    $("#algorithm").css("display", state == "initial" ? "inline" : "none");
    $("#pathfind").css("display", state == "initial" ? "inline" : "none");
    $("#reset").css("display", state == "success" || state == "fail" ? "inline" : "none");
    $("#cancel").css("display", state == "pathfinding" ? "inline" : "none");
    $("#diagonalControls").css("display", state == "pathfinding" ? "none" : "inline");
    $("#instructions").css("display", state == "initial" ? "inline" : "none");
}

function updateStatus() {
    $("#status").removeClass("text-warning text-success text-danger")
    if (state === "initial") {
        $("#status").empty();
    }
    else {
        if (state === "pathfinding") {
            $("#status").html("Pathfinding...");
            $("#status").addClass("text-warning");
        }
        else if (state === "success") {
            $("#status").html("Pathfinding complete.");
            $("#status").addClass("text-success");
        }
        else if (state === "fail") {
            $("#status").html("Pathfinding failed.");
            $("#status").addClass("text-danger");
        }
        $("#status").append(` Explored: ${explorations.toLocaleString()} cells.`);
        if (pathLength != -1) {
            $("#status").append(` Path length: ${pathLength.toLocaleString()} cells.`);
        }
    }
}

function updateSpeed() {
    speed = parseInt($("#speed").val());
    $("#speedText").html("x" + (Math.pow(10, Math.floor(speed / 2)) * (speed % 2 == 0 ? 1 : 5)).toLocaleString())
    delayDuration = speed < 6 ? (Math.pow(10, 3 - Math.floor(speed / 2)) / (speed % 2 == 0 ? 1 : 2)): 1;
    delayFrequency = speed > 6 ? (Math.pow(10, Math.floor(speed / 2) - 3) * (speed % 2 == 0 ? 1 : 5)) : 1;
}

function generate() {
    generation = $("#generation").val();
    switch (generation) {
        case "blank":
            generateBlank();
            break;
        case "random":
            generateRandom();
            break;
        case "maze":
            generateMaze();
            break;
    }
    state = "initial";
    explorations = 0;
    pathLength = -1;
    updateStatus();
    updateControls();
}

function generateBlank() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            updateCell(i, j, "clear", true);
        }
    }
    selectStartAndEnd();
}

function generateRandom() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (Math.random() > 0.75) {
                updateCell(i, j, "block", true);
            }
            else {
                updateCell(i, j, "clear", true);
            }
        }
    }
    selectStartAndEnd();
}

function generateMaze() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            
            if ((i * j) % 2 == 1) {
                updateCell(i, j, "block", true);
            }
            else if ((i + j) % 2 == 0) {
                updateCell(i, j, "clear", true);
            }
            else if (Math.random() > 0.6667) {
                updateCell(i, j, "block", true);
            }
            else {
                updateCell(i, j, "clear", true);
            }
            
        }
    }
    selectStartAndEnd();
}

function selectStartAndEnd() {
    do {
        start = {row: Math.floor(Math.random() * rows), col: Math.floor(Math.random() * cols)};
        end = {row: Math.floor(Math.random() * rows), col: Math.floor(Math.random() * cols)};
    }
    while ((start.row === end.row && start.col === end.col) || grid[start.row][start.col] == 1 || grid[end.row][end.col] == 1)
    updateCell(start.row, start.col, "start", true);
    updateCell(end.row, end.col, "end", true);
}

async function pathfind() {
    algorithm = $("#algorithm").val();
    state = "pathfinding";
    switch (algorithm) {
        case "bfs":
            await BFS();
            break;
        case "dfs":
            await DFS();
            break;
        case "aStar":
            await aStar();
             break;
    }
    updateStatus();
    updateControls();

}

async function BFS() {
    let paths = [[start]];
    let visited = [start];
    explorations = 0;
    while (paths.length > 0) {
        let path = paths.shift();
        let current = path[path.length - 1];
        if (current.row != start.row || current.col != start.col) {
            await updateCell(current.row, current.col, "explored", false);
        }
        for (const cell of getAdjacent(current.row, current.col)) {
            if (state != "pathfinding") {
                return;
            }
            if (cell.row === end.row && cell.col === end.col) {
                await showPath(path);
                return;
            }
            let hasBeenVisited = false;
            for (let i = 0; i < visited.length; i++) {
                if (cell.row === visited[i].row && cell.col === visited[i].col) {
                    hasBeenVisited = true;
                    break;
                }
            }
            if (!hasBeenVisited) {
                visited.push(cell);
                explorations++;
                let newPath = path.slice();
                newPath.push(cell);
                paths.push(newPath);
                await updateCell(cell.row, cell.col, "frontier", false);
            }
        }
    }
    state = "fail";
}

async function DFS() {
    let paths = [[start]];
    let visited = [start];
    while (paths.length > 0) {
        let path = paths.pop();
        let current = path[path.length - 1];
        if (current.row != start.row || current.col != start.col) {
            await updateCell(current.row, current.col, "explored", false);
        }
        for (const cell of getAdjacent(current.row, current.col)) {
            if (state != "pathfinding") {
                return;
            }
            if (cell.row === end.row && cell.col === end.col) {
                await showPath(path);
                return;
            }
            let hasBeenVisited = false;
            for (let i = 0; i < visited.length; i++) {
                if (cell.row === visited[i].row && cell.col === visited[i].col) {
                    hasBeenVisited = true;
                    break;
                }
            }
            if (!hasBeenVisited) {
                visited.push(cell);
                explorations++;
                let newPath = path.slice();
                newPath.push(cell);
                paths.push(newPath);
                await updateCell(cell.row, cell.col, "frontier", false);
            }
        }
    }
    state = "fail";
}

async function aStar() {
    let paths = [[[start], 1 + heuristic(start, end)]];
    let visited = [start];
    while (paths.length > 0) {
        let path = paths.shift();
        let current = path[0][path[0].length - 1];
        if (current.row != start.row || current.col != start.col) {
            await updateCell(current.row, current.col, "explored", false);
        }
        for (const cell of getAdjacent(current.row, current.col)) {
            if (state != "pathfinding") {
                return;
            }
            if (cell.row === end.row && cell.col === end.col) {
                await showPath(path[0]);
                return;
            }
            let hasBeenVisited = false;
            for (let i = 0; i < visited.length; i++) {
                if (cell.row === visited[i].row && cell.col === visited[i].col) {
                    hasBeenVisited = true;
                    break;
                }
            }
            if (!hasBeenVisited) {
                visited.push(cell);
                explorations++;
                let newPath = path[0].slice();
                newPath.push(cell);
                let priority = newPath.length + heuristic(cell, end);
                let index = paths.length - 1;
                while (index > 0 && paths[index][1] > priority) {
                    index--;
                }
                paths.splice(index + 1, 0, [newPath, priority])
                await updateCell(cell.row, cell.col, "frontier", false);
            }
        }
    }
    state = "fail";
}

function heuristic(cell1, cell2) {
    return Math.sqrt((cell1.row - cell2.row) ** 2 + (cell1.col - cell2.col) ** 2);
}

function getAdjacent(row, col) {
    adjacent = [];
    if (diagonals) {
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                if ((i != 0 || j != 0) && (row + i >= 0 && row + i < rows && col + j >= 0 && col + j < cols && grid[row + i][col + j] == 0)) {
                    adjacent.push({row: row + i, col: col + j})
                }
            }
        }
    }
    else {
        for (let i = -1; i < 2; i += 2) {
            if (row + i >= 0 && row + i < rows && grid[row + i][col] == 0) {
                adjacent.push({row: row + i, col: col})
            }
        }
        for (let j = -1; j < 2; j += 2) {
            if (col + j >= 0 && col + j < cols && grid[row][col + j] == 0) {
                adjacent.push({row: row, col: col + j})
            }
        }
    }
    return adjacent;
}

async function showPath(path) {
    pathLength = 0;
    for (let i = 1; i < path.length; i++) {
        if (state != "pathfinding") {
            return;
        }
        pathLength++;
        await updateCell(path[i].row, path[i].col, "path", false);
    }
    state = "success";
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}