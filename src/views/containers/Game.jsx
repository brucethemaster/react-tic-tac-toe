import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Grid from "@material-ui/core/Grid";

import { playTurn, checkWinner, newGame } from "../../utils/operations";

import Board from "../components/Board.jsx";
import PlayerInfo from "../components/PlayerInfo.jsx";
import GameoverDialog from "../components/GameoverDialog.jsx";
import { Typography } from "@material-ui/core";

class Game extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = { showDialog: false };

    // binding 'this' to the handler so we can use 'this' to refer to props of this class
    this.handleBoardOnMove = this.handleBoardOnMove.bind(this);
    this.handleDialogClick = this.handleDialogClick.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
  }

  handleBoardOnMove(square) {
    // when a square is clicked we want to mark that square for the current player

    const { board, player, gameover, playTurn, checkWinner } = this.props;
    const { row, col } = square;

    // only mark if the game is still in progress and the square is empty (none)
    // otherwise, ignore the play
    if (gameover || board[row][col] !== 0) {
      return;
    }

    // make a play for the player
    playTurn(player, row, col);
    // then check for a winner
    const hasWinner = checkWinner(board, player);

    if (hasWinner) {
      this.setState({ showDialog: true });
    }
  }

  handleDialogClick(answer) {
    // we only want to start a new game if the player clicks 'yes'
    if (answer) {
      this.props.newGame();
    }

    // we always want to close the dialog
    this.setState({ showDialog: false });
  }

  handleDialogClose() {
    // close the dialog
    this.setState({ showDialog: false });
  }

  render() {
    const { showDialog } = this.state;
    const { board, player, gameover, winner } = this.props;
    const draw = winner === 0;

    return (
      // at extra-small (xs) size the grid show have two rows
      // at small (sm+) and above we want 2 columns
      // Grid 'item' in a container must have columns (xs, sm, md, etc.) that add up to 12, per grid docs:
      // https://material-ui-next.com/layout/grid/
      <div>
        <Grid container spacing={10}>
          <Grid item xs={12} sm={6} md={4}>
            <Board board={board} onMove={this.handleBoardOnMove} />
          </Grid>
          <Grid item xs={12} sm={6} md={8}>
            <PlayerInfo player={player} gameover={gameover} />
          </Grid>
          <Grid item xs={12} sm={6} md={8}>
            <Typography>player One Wins:{this.props.winnercount[1]}</Typography>
            <Typography>player Two Wins:{this.props.winnercount[2]}</Typography>
            <Typography>player draws:{this.props.winnercount[0]}</Typography>
          </Grid>
        </Grid>
        <GameoverDialog
          open={showDialog}
          isDraw={draw}
          player={winner}
          onClick={this.handleDialogClick}
          onClose={this.handleDialogClose}
        />
      </div>
    );
  }
}

const { arrayOf, number, func, bool } = PropTypes;

// we want to list our props for validation even though
// we are using react-redux to map our state and dispatch
// to the props of this Game component
Game.propTypes = {
  board: arrayOf(arrayOf(number)).isRequired,
  player: number.isRequired,
  winner: number.isRequired,
  gameover: bool.isRequired,
  playTurn: func.isRequired,
  checkWinner: func.isRequired,
  newGame: func.isRequired
};

const mapStateToProps = (state) => {
  const { gameState } = state;

  return {
    board: gameState.board,
    player: gameState.player,
    gameover: gameState.gameover,
    winner: gameState.winner,
    winnercount: gameState.winnercount
  };
};

const mapDispatchToProps = {
  playTurn,
  checkWinner,
  newGame
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);
