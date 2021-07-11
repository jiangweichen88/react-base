import { ConsoleSqlOutlined } from '@ant-design/icons';
import React from 'react';
import './demo.less';
import styles from './demo.less';
import {deepClone} from '@/utils/common';
function Square(props) {
    return (
        <button className='square' onClick={props.onClick}>
            {props.value}
        </button>
    );
}
class Board extends React.Component {
    itemClick(i) {
        this.props.onClick(i)
    }
    renderSquare(i) {
        return <Square value={this.props.squares[i]} onClick={() => this.itemClick(i)} />;
    }

    render() {
        return (
            <div>
                <div className={styles['board-row']}>
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}
class Game extends React.Component {
    constructor(props) {
        super(props);
        let squares = Array(9).fill(null);
        this.state = {
            history: [{
                squares: squares,
            }],
            xIsNext: true,
            stepNumber:0,
            current: {
                squares:deepClone(squares),
            }
        }
    }
    jumpTO(i) {
        let { history} = this.state;
        this.setState({
            current: deepClone(history[i]),
            xIsNext:i%2===0?true:false,
            stepNumber: i,
        })
    }
    itemClick(i) {
        const _this = this;
        let { history,xIsNext, current,stepNumber} = this.state;
        let squares =  current.squares;
        if (calculateWinner(squares) || squares[i]) {//落子以后不能更改；获胜以后不再可点
            return;
        }
        squares[i] = xIsNext ? 'x' : 'o';
        this.setState({ 
            stepNumber:stepNumber+1,
            history:history.slice(0,stepNumber+1).concat({squares:deepClone(squares)}),
            current:{squares:deepClone(squares) } ,
             xIsNext: !xIsNext
             }, function () {
        }
        );
    }
    render() {
        let { history, xIsNext, current } = this.state;
        console.log(history,current);
        const winner = calculateWinner(current);
        let status;
        if (winner) {
            status = 'winner: ' + winner
        } else {
            status = 'Next player: ' + (xIsNext ? 'x' : 'o');
        }
        console.log(winner);
        let TODO = history.map((item, i) => {
            return (
                <li key={i}>
                    <button onClick={() => { this.jumpTO(i) }}>
                        {'goto move ' + i}
                    </button>
                </li>
            )
        })
        return (
            <div>
                <div className={['game',"tx-c"].join(' ')}>
                    <div className="game-board">
                        <Board squares={current.squares} onClick={(i) => this.itemClick(i)} />
                    </div>
                    <div className="game-info">
                        <div>{status}</div>
                        <ol>{TODO}</ol>
                    </div>
                </div>
            </div>
        )
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}
export default (): React.ReactNode => (
    <Game></Game>
)
