function AllowedValues() {
    this.values = [1,2,3,4,5,6,7,8,9];
    this._valuesStr = null;
    this.isAllowed = function(value) {
        this._reset();
        return this._valuesStr.indexOf(value) != -1;
    }
    this._re = /([1-9])/;
    this.hasAllowed = function() {
        this._reset();
        return this._valuesStr.match(this._re);
    }
    this.getSingle = function() {
        if (this._valuesStr.match(this._re)) {
            return RegExp.$1;
        }
        return null;
    }
    this.getFirst = function() {
        for (var i in this.values) {
            if (this.values[i] != 0) return this.values[i];
        }
    }
    this.nextAfter = function(n) {
        var found = false;
        for (var i in this.values) {
            if (found) {
                if (this.values[i] != 0) return this.values[i];
            }
            else if (this.values[i] == n) {
                found = true;
            }
        }
        return -1;
    }
    this.removeThese = function(values) {
        for (var i = 0; i < values.length; i++) {
            this.qremove(values[i]);
        }
        this._reset();
    }
    this.remove = function(value) {
        this.qremove(value);
        this._reset();
        return this;
    }
    this.isAffected = true;
    this.count = 9;
    this.getCount = function() {
        return this.count;
    }
    this._reset = function() {
        if (this.isAffected) {
            this._valuesStr = this.values.join('');
            this.isAffected = false;
        }
    }
    this.qremove = function(value) {
        if (value != 0 && this.values[value - 1] != 0) {
            this.count--;
            this.isAffected = true;
            this.values[value - 1] = 0;
        }
    }
    this.qadd = function(value) {
        if (value != 0 && this.values[value - 1] == 0) {
            this.count++;
            this.isAffected = true;
            this.values[value - 1] = value;
        }
    }
    this.AND = function(av) {
        var newAV = new AllowedValues();
        for (var i = 0; i < 9; i++) {
            if (av.values[i] * this.values[i] == 0) {
                newAV.qremove(i + 1);
            }
        }
        return newAV;
    }

    this.showSelectWnd = function(x, y, caller) {
        var av = this;
        var overlay = document.getElementById('picker-overlay');
        var popup = document.getElementById('picker-popup');
        var tbl = document.getElementById('picker-table');

        tbl.innerHTML = '';

        var row1 = tbl.insertRow(0);
        for (var i = 1; i <= 5; i++) {
            (function(digit) {
                var td = row1.insertCell(-1);
                td.style.width = '36px';
                td.style.height = '36px';
                td.style.textAlign = 'center';
                td.style.fontSize = '18px';
                td.style.fontWeight = 'bold';
                td.style.userSelect = 'none';

                if (av.isAllowed(digit)) {
                    td.textContent = digit;
                    td.style.color = '#000000';
                    td.style.cursor = 'pointer';
                    td.style.background = '#fff';
                    td.onmouseover = function() { this.style.background = '#dce8f7'; }
                    td.onmouseout  = function() { this.style.background = '#fff'; }
                    td.onmousedown = function(e) {
                        e.stopPropagation();
                        overlay.style.display = 'none';
                        caller.onselect(digit);
                    }
                } else {
                    td.textContent = digit;
                                        td.style.color = '#313131';
                    td.style.cursor = 'default';
                    td.style.background = '#b1b1b1';
                }
            })(i);
        }

        var row2 = tbl.insertRow(1);
        for (var i = 6; i <= 9; i++) {
            (function(digit) {
                var td = row2.insertCell(-1);
                td.style.width = '36px';
                td.style.height = '36px';
                td.style.textAlign = 'center';
                td.style.fontSize = '18px';
                td.style.fontWeight = 'bold';
                td.style.userSelect = 'none';

                if (av.isAllowed(digit)) {
                    td.textContent = digit;
                    td.style.color = '#000000';
                    td.style.cursor = 'pointer';
                    td.style.background = '#fff';
                    td.onmouseover = function() { this.style.background = '#dce8f7'; }
                    td.onmouseout  = function() { this.style.background = '#fff'; }
                    td.onmousedown = function(e) {
                        e.stopPropagation();
                        overlay.style.display = 'none';
                        caller.onselect(digit);
                    }
                } else {
                    td.textContent = digit;
                    td.style.color = '#313131';
                    td.style.cursor = 'default';
                    td.style.background = '#b1b1b1';
                }
            })(i);
        }

        var tdClear = row2.insertCell(-1);
        tdClear.textContent = '✕';
        tdClear.style.width = '36px';
        tdClear.style.height = '36px';
        tdClear.style.textAlign = 'center';
        tdClear.style.fontSize = '16px';
        tdClear.style.color = '#e74c3c';
        tdClear.style.cursor = 'pointer';
        tdClear.style.background = '#fff';
        tdClear.onmouseover = function() { this.style.background = '#fdecea'; }
        tdClear.onmouseout  = function() { this.style.background = '#fff'; }
        tdClear.onmousedown = function(e) {
            e.stopPropagation();
            overlay.style.display = 'none';
            caller.onselect(0);
        }

        popup.style.left = x + 'px';
        popup.style.top  = y + 'px';
        overlay.style.display = 'block';

        setTimeout(function() {
            var rect = popup.getBoundingClientRect();
            if (rect.right > window.innerWidth - 8) {
                popup.style.left = (window.innerWidth - rect.width - 10) + 'px';
            }
            if (rect.bottom > window.innerHeight - 8) {
                popup.style.top = (window.innerHeight - rect.height - 10) + 'px';
            }
        }, 0);
    }
}

var grid = [];

var solutionPattern = [
    [1,2,3, 4,5,6, 7,8,9],
    [4,5,6, 7,8,9, 1,2,3],
    [7,8,9, 1,2,3, 4,5,6],
    [2,3,1, 5,6,4, 8,9,7],
    [5,6,4, 8,9,7, 2,3,1],
    [8,9,7, 2,3,1, 5,6,4],
    [3,1,2, 6,4,5, 9,7,8],
    [6,4,5, 9,7,8, 3,1,2],
    [9,7,8, 3,1,2, 6,4,5]
];

function shufflePattern() {
    var matrix = JSON.parse(JSON.stringify(solutionPattern));
    for (var i = 0; i < 5; i++) {
        var block = Math.floor(Math.random() * 3) * 3;
        var r1 = block + Math.floor(Math.random() * 3);
        var r2 = block + Math.floor(Math.random() * 3);
        var temp = matrix[r1];
        matrix[r1] = matrix[r2];
        matrix[r2] = temp;
    }
    return matrix;
}

function updateAllowedValues() {
    for (var r = 0; r < 9; r++) {
        for (var c = 0; c < 9; c++) {
            grid[r][c].allowedValues = new AllowedValues();
        }
    }

    for (var r = 0; r < 9; r++) {
        for (var c = 0; c < 9; c++) {
            var val = grid[r][c].value;
            if (val !== 0) {
                for (var i = 0; i < 9; i++) {
                    if (i !== c) grid[r][i].allowedValues.qremove(val);
                    if (i !== r) grid[i][c].allowedValues.qremove(val);
                }
                var boxR = Math.floor(r / 3) * 3;
                var boxC = Math.floor(c / 3) * 3;
                for (var i = boxR; i < boxR + 3; i++) {
                    for (var j = boxC; j < boxC + 3; j++) {
                        if (i !== r || j !== c) {
                            grid[i][j].allowedValues.qremove(val);
                        }
                    }
                }
            }
        }
    }
}

function createNewGame() {
    var currentSolution = shufflePattern();
    var table = document.querySelector('.sudoku-board');
    var rows = table.getElementsByTagName('tr');

    for (var r = 0; r < 9; r++) {
        var cells = rows[r].getElementsByTagName('td');
        for (var c = 0; c < 9; c++) {
            var td = cells[c];
            td.style.textAlign = 'center';
            td.style.fontSize = '20px';
            td.style.fontWeight = 'bold';
            td.style.cursor = 'pointer';
            td.style.userSelect = 'none';

            var cellData = grid[r][c];
            cellData.solution = currentSolution[r][c];
            
            if (Math.random() > 0.6) {
                cellData.value = cellData.solution;
                cellData.isFixed = true;
                td.textContent = cellData.solution;
                td.style.color = '#2c3e50';
                td.style.backgroundColor = '#f4f6f8';
            } else {
                cellData.value = 0;
                cellData.isFixed = false;
                td.textContent = '';
                td.style.color = '#4a90e2';
                td.style.backgroundColor = '#ffffff';
            }
        }
    }
    updateAllowedValues();
}

function verifyBoard() {
    var completed = true;
    var correct = true;
    var wrongCells = [];

    for (var r = 0; r < 9; r++) {
        for (var c = 0; c < 9; c++) {
            var cellData = grid[r][c];
            if (!cellData.isFixed) {
                cellData.td.style.backgroundColor = cellData.value === 0 ? '#ffffff' : '#e8f0fe';
            }
            if (cellData.value === 0) {
                completed = false;
                wrongCells.push(cellData);
            } else if (cellData.value !== cellData.solution) {
                correct = false;
                cellData.td.style.backgroundColor = '#fdecea';
                wrongCells.push(cellData);
            }
        }
    }

    if (completed && correct) {
        alert('You Win!');
    } else {
        if (wrongCells.length > 0) {
            var randomCell = wrongCells[Math.floor(Math.random() * wrongCells.length)];
            randomCell.td.style.backgroundColor = '#fff2cc';
            alert('Hint: In row ' + (randomCell.row + 1) + ', column ' + (randomCell.col + 1) + ' try placing number ' + randomCell.solution);
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var table = document.querySelector('.sudoku-board');
    var rows = table.getElementsByTagName('tr');
    var overlay = document.getElementById('picker-overlay');

    for (var r = 0; r < 9; r++) {
        grid[r] = [];
        var cells = rows[r].getElementsByTagName('td');
        for (var c = 0; c < 9; c++) {
            (function(row, col, tdElement) {
                var cellObj = {
                    row: row,
                    col: col,
                    td: tdElement,
                    value: 0,
                    solution: 0,
                    isFixed: false,
                    allowedValues: new AllowedValues(),
                    onselect: function(digit) {
                        if (this.isFixed) return;
                        this.value = digit;
                        if (digit === 0) {
                            this.td.textContent = '';
                            this.td.style.backgroundColor = '#ffffff';
                        } else {
                            this.td.textContent = digit;
                            this.td.style.backgroundColor = '#e8f0fe';
                        }
                        updateAllowedValues();
                    }
                };
                grid[row][col] = cellObj;

                tdElement.addEventListener('mousedown', function(e) {
                    e.stopPropagation();
                    if (grid[row][col].isFixed) return;
                    var x = e.clientX;
                    var y = e.clientY;
                    grid[row][col].allowedValues.showSelectWnd(x, y, grid[row][col]);
                });
            })(r, c, cells[c]);
        }
    }

    overlay.addEventListener('mousedown', function(e) {
        if (e.target === overlay) {
            overlay.style.display = 'none';
        }
    });

    var links = document.querySelectorAll('.nav_link');
    
    links[0].addEventListener('click', function(e) {
        e.preventDefault();
        createNewGame();
    });

    links[1].addEventListener('click', function(e) {
        e.preventDefault();
        verifyBoard();
    });

    createNewGame();
});