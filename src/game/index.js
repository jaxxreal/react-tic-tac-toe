import { Shapes, GameState } from '../constants/common';
import { clone } from '../utils';

export class Game {
    _states = [];
    _result = GameState.Running;

    constructor(size) {
        this._size = size;
        this._gameMatrix = this._createMatrix(size);
        this._winningLines = this._getWinningLines(size);
    }

    /**
     * Build a game matrix
     * @param size
     * @returns {Array.<T>|*}
     * @private
     */
    _createMatrix(size) {
        return Array(size).fill(Array(size).fill(Shapes.Empty));
    }

    /**
     * generate all possible winning positions
     * @param size
     * @return {Array.<*>}
     * @private
     */
    _getWinningLines(size) {
        let winingRows = [];
        let winingCols = [];

        // rows & cols
        Array(size).fill(1).forEach((v, idx) => {
            winingRows = Array(size).fill([]).map((v, row) => {
                return Array(size).fill([]).map((v, col) => [row, col]);
            });
            winingCols = Array(size).fill([]).map((v, col) => {
                return Array(size).fill([]).map((v, row) => [row, col]);
            });
        });

        // diagonals
        const winingDiagonals = [[], []];
        for (let i = 0, j = size; i < size && j > 0; i++, j--) {
            winingDiagonals[0].push([i, i]);
            winingDiagonals[1].push([i, j - 1]);
        }
        return winingRows.concat(winingCols, winingDiagonals);
    }

    /**
     * Get the game state
     * @returns {Array.<T>|*}
     * @public
     */
    getState() {
        return clone(this._gameMatrix);
    }

    /**
     * get current game status
     * @return {string}
     */
    getResult() {
        return this._result;
    }

    /**
     * Set the new game state
     * @param nextMatrix
     * @returns void
     * @private
     */
    _setState(nextMatrix) {
        this._gameMatrix = clone(nextMatrix);
    }

    /**
     * Make a new game turn
     * @param value
     * @param rowIdx
     * @param cellIdx
     * @return {Array.<T>|*}
     */
    turn({ value, rowIdx, cellIdx }) {
        if (value === Shapes.Empty && !this.isGameFinished()) {
            this._states.push(this.getState());

            const matrixAfterUserTurn = this._userTurn({ value, rowIdx, cellIdx });
            this._setState(matrixAfterUserTurn);

            if (this.isGameFinished()) {
                return this.getState();
            }

            const matrixAfterAiTurn = this._aiTurn({ value, rowIdx, cellIdx }, matrixAfterUserTurn);
            this._setState(matrixAfterAiTurn);
            this.isGameFinished();
        }
        return this.getState();
    }

    /**
     * Make a user turn
     * @param rowIdx
     * @param cellIdx
     * @return {Array.<T>|*}
     * @private
     */
    _userTurn({ rowIdx, cellIdx }) {
        const matrix = this.getState();
        matrix[rowIdx][cellIdx] = Shapes.Tick;
        return matrix;
    }

    /**
     * Make an AI turn
     * @param value
     * @param rowIdx
     * @param cellIdx
     * @param matrixAfterUserTurn
     * @return {*}
     * @private
     */
    /*
    Special note: on the end of my time, I found a better idea how to implement AI,
    but unfortunately - time is just a time - always need a little more
     */
    _aiTurn({ value, rowIdx, cellIdx }, matrixAfterUserTurn) {
        const matrix = matrixAfterUserTurn.slice();
        const [row, col] = this._findBestTurn(matrix);
        matrix[row][col] = Shapes.Circle;
        return matrix;
    }

    /**
     * Attempt to create AI
     * @param matrix
     * @return {*}
     * @private
     */
    _findBestTurn(matrix) {
        let bestTurnForRow;
        // const depth = 2;
        const diagonalLeft = [];
        const diagonalRight = [];
        let cols;

        for (let idx = 0; idx < this._size; idx++) {
            const row = matrix[idx];
            diagonalLeft.push(row[idx]);
            diagonalRight.push(row[matrix.length - idx - 1]);
            cols = matrix.map(row => row[idx]);
            bestTurnForRow = this._walkTroughRow(row);
        }

        if (bestTurnForRow.every(t => t !== undefined)) {
            return bestTurnForRow;
        } else {
            for (let idx = 0; idx < this._size; idx++) {
                const col = cols[idx];
                const bestTurnForCol = this._walkTroughCol(col);
                if (bestTurnForCol !== undefined) {
                    return [bestTurnForCol, idx];
                }
            }

            const bestTurnForDiagonalLeft = this._walkThroughDiagonal(diagonalLeft);
            if (bestTurnForDiagonalLeft.every(t => t !== undefined)) {
                return bestTurnForDiagonalLeft;
            }

            const bestTurnForDiagonalRight = this._walkThroughDiagonal(diagonalRight);
            if (bestTurnForDiagonalRight.every(t => t !== undefined)) {
                return bestTurnForDiagonalRight;
            }
        }

        return this._findFreeCell(matrix);
    }

    _walkTroughRow(positions) {
        let bestRow;
        let bestCol;
        for (let i = 0; i < this._size; i++) {
            if (positions[i] === Shapes.Tick && positions[i + 1] === Shapes.Tick) {
                if (positions[i + 2] === Shapes.Empty) {
                    bestCol = i + 2;
                }
                if (positions[i - 1] === Shapes.Empty) {
                    bestCol = i - 1;
                }
                bestRow = i;
                return [bestRow, bestCol];
            }
        }
        return [bestRow, bestCol];
    }

    _walkTroughCol(positions) {
        let bestRow;
        for (let i = 0; i < this._size; i++) {
            if (positions[i] === Shapes.Tick && positions[i + 1] === Shapes.Tick) {
                if (positions[i + 2] === Shapes.Empty) {
                    bestRow = i + 2;
                }
                if (positions[i - 1] === Shapes.Empty) {
                    bestRow = i - 1;
                }
            }
        }
        return bestRow;
    }

    _walkThroughDiagonal(positions) {
        let bestIdx;
        for (let i = 0; i < this._size; i++) {
            if (positions[i] === Shapes.Tick && positions[i + 1] === Shapes.Tick) {
                if (positions[i + 2] === Shapes.Empty) {
                    bestIdx = i + 2;
                }
                if (positions[i - 1] === Shapes.Empty) {
                    bestIdx = i - 1;
                }
            }
        }
        return [bestIdx, bestIdx];
    }

    /**
     * Find a free cell, dummy AI
     * @param matrix
     * @return {*}
     * @private
     */
    _findFreeCell(matrix) {
        let available = [];
        matrix.forEach((row, rowIdx) => {
            row.forEach((cell, cellIdx) => {
                if (cell === Shapes.Empty) {
                    available.push([rowIdx, cellIdx]);
                }
            });
        });
        return available;
    }

    _getRandomMove(matrix) {
        const availableMoves = this._findFreeCell(matrix);
        const randIdx = this._getRandomBetween(availableMoves.length, 0);
        return availableMoves[randIdx];
    }

    /**
     *
     * @param high
     * @param low
     * @return {number}
     * @private
     */
    _getRandomBetween(high, low) {
        return Math.floor(Math.random() * (high - low) + low);
    }

    /**
     * check line availability to turn
     * @param matrix
     * @param row
     * @param col
     * @param shape
     * @return {boolean}
     * @private
     */
    _isPossibleLine(matrix, [row, col], shape) {
        const candidateLines = this._winningLines.filter((candidate) => {
            const result = candidate.filter(cell => {
                    return cell[0] === row && cell[1] === col
                }).length > 0;

            if (result) {
                const opponent = shape === Shapes.Circle
                    ? Shapes.Circle
                    : Shapes.Tick;
                const lineContent = this._getLineContent(matrix, candidate).join('');
                if (lineContent.indexOf(opponent) > -1) {
                    return false
                }
                return true
            }
        });
        // get candiate lines content
        return candidateLines.length > 0
    }

    /**
     * get line values to check - is it containing user turn?
     * @param matrix
     * @param line
     * @return {*}
     * @private
     */
    _getLineContent(matrix, line) {
        return line.reduce((contents, [row, col]) => {
            contents.push(matrix[row][col]);
            return contents
        }, []);
    };

    /**
     * Checks a game status and updates a game result
     * @return {boolean}
     */
    isGameFinished() {
        const matrix = this.getState();
        const diagonalLeft = [];
        const diagonalRight = [];

        for (let idx = 0; idx < this._size; idx++) {
            const row = matrix[idx];
            diagonalLeft.push(row[idx]);
            diagonalRight.push(row[matrix.length - idx - 1]);

            // check rows
            if (row.every(cell => cell === Shapes.Circle)) {
                this._result = GameState.AIWin;
                return true;
            }
            if (row.every(cell => cell === Shapes.Tick)) {
                this._result = GameState.UserWin;
                return true;
            }

            // check columns
            const col = matrix.map(row => row[idx]);
            if (col.every(cell => cell === Shapes.Circle)) {
                this._result = GameState.AIWin;
                return true;
            }
            if (col.every(cell => cell === Shapes.Tick)) {
                this._result = GameState.UserWin;
                return true;
            }

        }

        // check diagonals
        if (diagonalLeft.every(cell => cell === Shapes.Circle)) {
            this._result = GameState.AIWin;
            return true;
        }

        if (diagonalRight.every(cell => cell === Shapes.Circle)) {
            this._result = GameState.AIWin;
            return true;
        }

        if (diagonalLeft.every(cell => cell === Shapes.Tick)) {
            this._result = GameState.UserWin;
            return true;
        }

        if (diagonalRight.every(cell => cell === Shapes.Tick)) {
            this._result = GameState.UserWin;
            return true;
        }

        return false;
    }

    /**
     * Recreate a game
     */
    restartGame() {
        this._result = GameState.Running;
        this._setState(this._createMatrix(this._size));
        this._states = [];
    }
}
