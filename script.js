var GameOfLife = /** @class */ (function () {
    function GameOfLife(m, n) {
        if (m === void 0) { m = 30; }
        if (n === void 0) { n = 30; }
        this.m = m;
        this.n = n;
        this.color = '#3498db';
        this.delay = 500;
        this.start = false;
        this.isReset = false;
        this.isHold = false;
        this.cells = [];
        for (var i = 0; i < m; i++) {
            if (!this.cells[i])
                this.cells[i] = [];
            for (var j = 0; j < n; j++) {
                this.cells[i][j] = { isAlive: false, element: null };
            }
        }
    }
    GameOfLife.prototype.createField = function () {
        var _this = this;
        this.addEventListeners();
        var container = document === null || document === void 0 ? void 0 : document.getElementById('container');
        var _loop_1 = function (i) {
            var _loop_2 = function (j) {
                var square = document === null || document === void 0 ? void 0 : document.createElement('div');
                square.classList.add('square');
                square.setAttribute('id', "square-" + i + "-" + j);
                square.addEventListener('click', function () {
                    if (_this.start)
                        return;
                    if (_this.cells[i][j].isAlive) {
                        _this.removeColor(square);
                    }
                    _this.isReset = false;
                    _this.cells[i][j].isAlive = !_this.cells[i][j].isAlive;
                });
                square.addEventListener('mouseover', function (e) { return _this.handleChange(e, i, j); });
                square.addEventListener('mouseout', function (e) { return _this.handleChange(e, i, j); });
                this_1.cells[i][j].element = square;
                container.appendChild(square);
            };
            for (var j = 0; j < this_1.n; j++) {
                _loop_2(j);
            }
        };
        var this_1 = this;
        for (var i = 0; i < this.m; i++) {
            _loop_1(i);
        }
        var y = Math.floor(this.cells.length / 2);
        var x = Math.floor(this.cells[0].length / 2);
        this.initPattern(x, y);
        this.initPattern(x - 3, y - 3);
    };
    GameOfLife.prototype.handleChange = function (e, i, j) {
        if (this.start)
            return;
        switch (e.type) {
            case 'mouseover':
                if (this.isHold && this.cells[i][j].isAlive)
                    this.removeColor(this.cells[i][j].element);
                else if (!this.cells[i][j].isAlive)
                    this.setColor(this.cells[i][j].element);
                if (this.isHold) {
                    this.cells[i][j].isAlive = !this.cells[i][j].isAlive;
                    this.isReset = false;
                }
                break;
            case 'mouseout':
                if (!this.isHold && !this.cells[i][j].isAlive)
                    this.removeColor(this.cells[i][j].element);
                break;
            default:
                break;
        }
    };
    GameOfLife.prototype.setColor = function (element) {
        element.style.background = "" + this.color;
        element.style.boxShadow = "0 0 2px " + this.color + ", 0 0 10px " + this.color;
    };
    GameOfLife.prototype.removeColor = function (element) {
        element.style.background = '#1d1d1d';
        element.style.boxShadow = '0 0 2px #000';
    };
    GameOfLife.prototype.play = function () {
        var _this = this;
        setInterval(function () {
            if (_this.start)
                _this.applyRules();
        }, this.delay);
    };
    GameOfLife.prototype.applyRules = function () {
        var _this = this;
        var count = [];
        for (var i = 0; i < this.cells.length; i++) {
            count[i] = [];
            for (var j = 0; j < this.cells[i].length; j++) {
                count[i][j] = 0;
            }
        }
        this.cells.forEach(function (row, i) { return row.forEach(function (cell, j) {
            if (cell.isAlive)
                _this.findNeibhours(count, i, j, _this.cells.length - 1, _this.cells[j].length - 1);
        }); });
        count.forEach(function (row, i) { return row.forEach(function (element, j) {
            if (element < 2 || element > 3)
                _this.cells[i][j].isAlive = false;
            else if (!_this.cells[i][j].isAlive && element === 3)
                _this.cells[i][j].isAlive = true;
        }); });
        this.draw();
    };
    GameOfLife.prototype.findNeibhours = function (count, i, j, maxI, maxJ) {
        if (i > 0)
            count[i - 1][j] = count[i - 1][j] ? count[i - 1][j] + 1 : 1;
        if (j > 0)
            count[i][j - 1] = count[i][j - 1] ? count[i][j - 1] + 1 : 1;
        if (i > 0 && j > 0)
            count[i - 1][j - 1] = count[i - 1][j - 1] ? count[i - 1][j - 1] + 1 : 1;
        if (i < maxI)
            count[i + 1][j] = count[i + 1][j] ? count[i + 1][j] + 1 : 1;
        if (j < maxJ)
            count[i][j + 1] = count[i][j + 1] ? count[i][j + 1] + 1 : 1;
        if (j < maxJ && i < maxI)
            count[i + 1][j + 1] = count[i + 1][j + 1] ? count[i + 1][j + 1] + 1 : 1;
        if (i > 0 && j < maxJ)
            count[i - 1][j + 1] = count[i - 1][j + 1] ? count[i - 1][j + 1] + 1 : 1;
        if (j > 0 && i < maxI)
            count[i + 1][j - 1] = count[i + 1][j - 1] ? count[i + 1][j - 1] + 1 : 1;
    };
    GameOfLife.prototype.draw = function () {
        var _this = this;
        this.cells.forEach(function (row, i) { return row.forEach(function (cell, j) {
            if (cell.isAlive)
                _this.setColor(cell.element);
            else
                _this.removeColor(cell.element);
        }); });
    };
    GameOfLife.prototype.reset = function () {
        var _this = this;
        this.start = false;
        if (!this.isReset) {
            this.isReset = true;
            this.cells.forEach(function (row, i) { return row.forEach(function (cell, j) {
                _this.cells[i][j].isAlive = false;
                _this.removeColor(_this.cells[i][j].element);
            }); });
        }
    };
    GameOfLife.prototype.initPattern = function (x, y) {
        for (var i = y; i < y + 3; i++) {
            for (var j = x; j < x + 3; j++) {
                this.cells[i][j].isAlive = true;
                this.setColor(this.cells[i][j].element);
            }
        }
    };
    GameOfLife.prototype.addEventListeners = function () {
        var _this = this;
        document.addEventListener('mousedown', function () { _this.isHold = true; });
        document.addEventListener('mouseup', function () { _this.isHold = false; });
        var startBtn = document.getElementById('start');
        startBtn.addEventListener('click', function () {
            _this.start = !_this.start;
            startBtn.textContent = _this.start ? 'Stop' : 'Start';
        });
        document.getElementById('reset').addEventListener('click', function () {
            _this.reset();
            document.getElementById('start').textContent = 'Start';
        });
    };
    return GameOfLife;
}());
var game = new GameOfLife();
game.createField();
game.play.bind(game)();
