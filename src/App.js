import React, { Component } from 'react';

import Gameboard from './components/Gameboard';
import { Overlay } from './components/Overlay';
import { GameState } from './constants/common';

import { Game } from './game';

import ticTacToe from './images/tic-tac-toe-game.svg';

import './styles/app.css';
import './styles/overlay.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.game = new Game(3);
        this.state = {
            matrix: this.game.getState(),
            result: this.game.getResult()
        };
    }

    onPlayerTurn = ({ value, rowIdx, cellIdx }) => {
        return () => {
            const matrix = this.game.turn({ value, rowIdx, cellIdx });
            const result = this.game.getResult();
            this.setState({ matrix, result });
        };
    };

    restartGame = () => {
        this.game.restartGame();
        const matrix = this.game.getState();
        const result = this.game.getResult();
        this.setState({ matrix, result });
    };

    render() {
        const { result } = this.state;
        const isEndGame = result === GameState.AIWin || result === GameState.UserWin;
        return (
            <div className="app">
                <div className="app__header">
                    <img src={ticTacToe} className="app__logo" alt="logo"/>
                    <h2>Welcome to Tic-Tac-Toe!</h2>
                </div>
                <Gameboard
                    onTurn={this.onPlayerTurn}
                    matrix={this.state.matrix}
                />
                <Overlay
                    title={ isEndGame ? result : ''}
                    visibility={isEndGame}
                    onClick={this.restartGame}
                />
            </div>
        );
    }
}

export default App;
