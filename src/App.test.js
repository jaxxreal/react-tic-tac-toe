import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Game } from './game';
import { Shapes, GameState } from './constants/common';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
});

it('user should finish a game by left diagonal', () => {
    const game = new Game(3);
    game._gameMatrix = [
        [Shapes.Tick, 0, 0],
        [0, Shapes.Tick, 0],
        [0, 0, Shapes.Tick]
    ];
    game.isGameFinished();
    expect(game.getResult()).toEqual(GameState.UserWin);
});

it('user should finish a game by right diagonal', () => {
    const game = new Game(3);

    game._gameMatrix = [
        [0, 0, Shapes.Tick],
        [0, Shapes.Tick, 0],
        [Shapes.Tick, 0, 0]
    ];
    game.isGameFinished();
    expect(game.getResult()).toEqual(GameState.UserWin);
});

it('AI should finish a game by right diagonal', () => {
    const game = new Game(3);
    game._gameMatrix = [
        [0, 0, Shapes.Circle],
        [0, Shapes.Circle, 0],
        [Shapes.Circle, 0, 0]
    ];
    game.isGameFinished();
    expect(game.getResult()).toEqual(GameState.AIWin);

});

it('AI should finish a game by left diagonal', () => {
    const game = new Game(3);
    game._gameMatrix = [
        [Shapes.Circle, 0, 0],
        [0, Shapes.Circle, 0],
        [0, 0, Shapes.Circle]
    ];
    game.isGameFinished();
    expect(game.getResult()).toEqual(GameState.AIWin);
});
