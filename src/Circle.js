import React from 'react';
import ReactDOM from 'react-dom';
const Circle = (props) => {

  var color = "white";

  if (props.cell === 1) {
    color = "black";
  }
  else if (props.cell === 2) {
    color = "red";
  }
  var styles = {
    backgroundColor: color,
    border: "1px black solid",
    borderRadius: "100%",
    paddingTop: "98%",
  };
  return (
    <div style={styles}></div>
  );
};
const Cell = (props) => {
  var styles = {
    width: 50,
    height: 50,
    border: "1px solid black",
    backgroundColor: "yellow"
  };
  return (
    <div style={styles} onClick={() => props.handleClick(props.row, props.col)}>
      <Circle cell={props.cell} />
    </div>
  );

};
const Row = (props) => {
  let cells = [];
  for (let i = 0; i < 7; i++) {
    cells.push(<Cell key={i} row={props.row} col={i} cell={props.cells[i]} handleClick={props.handleClick} />);
  }
  return (
    <div style={{ display: "flex" }}>
      {cells}
    </div>
  );
};
const Grid = (props) => {
  let rows = [];
  for (let i = 5; i >= 0; i--) {
    rows.push(<Row key={i} row={i} cells={props.cells[i]} handleClick={props.handleClick} />);
  }
  return (
    <div>
      {rows}
    </div>
  );
};
class Game extends React.Component {
  constructor(props) {
    super(props);
    let cells = [];
    for (let i = 0; i < 6; i++) {
      cells.push(new Array(7).fill(0));
    }

    this.state = {
      player: false,
      cells: cells,
      winner: 0
    };
    this.handleClick = this.handleClick.bind(this);
  }

  findAvailableRow = (col) => {
    for (let i = 0; i < 6; i++) {
      if (this.state.cells[i][col] === 0) {
        return i;
      }
    }
    return -1;
  };

  checkHorizontal = (row, col) => {
    var c = this.state.cells;
    var val = this.state.player ? 1 : 2;
    var i = col;
    while (i >= 3) {
      if (c[row][i] === val && c[row][i - 1] === val && c[row][i - 2] === val && c[row][i - 3] === val) {
        return 1;
      }
      i--;
    }
    return 0;
  };

  checkVertical = (row, col) => {
    var c = this.state.cells;
    var val = this.state.player ? 2 : 1;
    var i = row;
    if (i >= 3) {
      if (c[i][col] === val && c[i - 1][col] === val && c[i - 2][col] === val && c[i - 3][col] === val) {
        return 1;
      }
    }
    return 0;
  };

  checkDiagonal = (row, col) => {
    var c = this.state.cells;
    var val = this.state.player ? 2 : 1;
    var cR = col;
    var rR = row;
    while (cR < 6 && rR < 5) {
      cR++;
      rR++;
    }
    while (rR >= 3 && cR >= 3) {
      if (c[rR][cR] === val && c[rR - 1][cR - 1] === val && c[rR - 2][cR - 2] === val && c[rR - 3][cR - 3] === val) {
        return 1;
      }
      rR--;
      cR--;
    }
    var rL = row;
    var cL = col;
    while (rL < 5 && cL > 0) {
      rL++;
      cL--;
    }
    while (cL <= 3 && rL >= 3) {
      if (c[rL][cL] === val && c[rL - 1][cL + 1] === val && c[rL - 2][cL + 2] === val && c[rL - 3][cL + 3] === val) {
        return 1;
      }
      rL--;
      cL++;
    }
    return 0;
  };

  checkVictory = (row, col) => {
    return this.checkVertical(row, col) || this.checkHorizontal(row, col) || this.checkDiagonal(row, col);
  };

  handleClick = (row, col) => {
    if (this.state.winner) {
      return;
    }
    console.log(`This row is ${row} and column is ${col}`);
    console.log(this.state.cells);
    var temp = [];
    for (let i = 0; i < 6; i++) {
      temp.push(this.state.cells[i].slice());
    }
    let r = this.findAvailableRow(col) === -1 ? window.alert("this row is filled") : this.findAvailableRow(col);
    temp[r][col] = this.state.player ? 1 : 2;
    this.setState({ cells: temp, player: !this.state.player }, () => {
      if (this.checkVictory(r, col) > 0) {
        console.log("winner");
        this.setState({ winner: this.state.player ? 2 : 1 });
      }
    });
  };

  handleReset = () => {
    var temp = [];
    for (let i = 0; i < 6; i++) {
      temp.push(new Array(7).fill(0));
    }
    this.setState({
      player: false,
      cells: temp,
      winner: 0,
    });
  };

  render() {
    return (
      <div>
        <h1>{this.state.winner > 0 ? this.state.winner === 1 ? "Black Wins" : "Red Wins" : this.state.player ? "Black's Turn" : "Red's Turn"}</h1>
        <Grid cells={this.state.cells} handleClick={this.handleClick} />
        <br />
        <button onClick={this.handleReset}>Restart</button>
      </div>
    );
  }
}
ReactDOM.render(<Game />, document.getElementById("root"));
