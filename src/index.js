import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
const NUMCOLS = 3;
const NUMROWS = 3;

function Square(props) {
  const color = props.winner ? {background : 'red'} : null;

  return (
    <button className="square" style={color} onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square 
      	key = {i}
    		value={this.props.squares[i]}
    		onClick={() => this.props.onClick(i)}
        winner={this.props.winners && this.props.winners.includes(i)}
      />
     );
  }

  render() {
  	var rows = [];
  	for (var i = 0; i < NUMROWS; i++) {
  		var squares = [];
  		for (var j = 0; j < NUMCOLS; j ++) {
  			squares.push(this.renderSquare(NUMROWS * i + j));
  		}
  		rows.push(<div className="board-row" key={i}> {squares} </div>)
  	}
    return (
      <div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {

	constructor() {
		super();
		this.state = {
			history: [{
				squares: Array(9).fill(null),
			}],
			stepNumber: 0,
			xIsNext: true,
		}
	}

  handleClick(i) {
	 	const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
    	return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
    	history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
    	xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
  	this.setState({
  		stepNumber: step,
  		xIsNext: (step % 2) === 0,
  	});
  }

  render() {
  	const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winnerSquares = calculateWinner(current.squares);
    const winner = winnerSquares? current.squares[winnerSquares[0]] : null;

    const moves = history.map((step, move) => {
      const desc = move ?
        'Move #' + move :
        'Game start';
      const styledDesc = (this.state.stepNumber === move) ? <b> {desc} </b> : desc;
      return (
        <li key={move}>
          <a href="#" onClick={() => this.jumpTo(move)}>{styledDesc}</a>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            winners={winnerSquares}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
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
      return [a, b, c];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
