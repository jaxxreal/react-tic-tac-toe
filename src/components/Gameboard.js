import React, { Component, PropTypes } from 'react';

import { Shapes, GAMEBOARD_CELL_SIZE } from '../constants/common';

// styles
import '../styles/gameboard.css';

// images
import tick from '../images/tick.svg';
import circle from '../images/circle.svg';

const RULER_WIDTH = 6;

class Gameboard extends Component {
    static propTypes = {
        matrix: PropTypes.arrayOf(PropTypes.array).isRequired,
        onTurn: PropTypes.func.isRequired,
    };

    render() {
        const { matrix } = this.props;
        const style = {
            width: GAMEBOARD_CELL_SIZE * matrix.length,
            height: GAMEBOARD_CELL_SIZE * matrix.length,
        };

        const cellSize = {
            width: GAMEBOARD_CELL_SIZE,
            height: GAMEBOARD_CELL_SIZE,
        };
        return (
            <div className="gameboard" style={style}>
                { matrix.map((row, rowIdx) => (
                    <div key={rowIdx} className="gameboard__row">
                        { matrix[rowIdx].map((cellValue, cellIdx) => (
                            <div key={cellIdx}>
                                <div
                                    style={cellSize}
                                    onClick={ this.props.onTurn({ value: cellValue, rowIdx, cellIdx }) }
                                    className={ `gameboard__cell gameboard__cell-${rowIdx}-${cellIdx}` }
                                >
                                    { cellValue !== Shapes.Empty ? <img src={ this.getIcon(cellValue) } alt="" /> : null }
                                </div>
                                { row.length !== cellIdx + 1
                                    ? (
                                        <div
                                            style={{ left: GAMEBOARD_CELL_SIZE * (cellIdx + 1) - RULER_WIDTH / 2 }}
                                            className="gameboard__ruler gameboard__ruler_vertical"
                                        />
                                    )
                                    : null
                                }
                            </div>
                        ))}
                        { matrix.length !== rowIdx + 1
                            ? (
                                <div
                                    style={{ top: GAMEBOARD_CELL_SIZE * (rowIdx + 1) - RULER_WIDTH / 2 }}
                                    className="gameboard__ruler gameboard__ruler_horizontal"
                                />
                            )
                            : null
                        }
                    </div>
                ))}
            </div>
        );
    }

    getIcon(cellValue) {
        switch (cellValue) {
            case Shapes.Empty:
                return '';
            case Shapes.Tick:
                return tick;
            case Shapes.Circle:
                return circle;
            default:
                return '';
        }
    }
}

export default Gameboard;
