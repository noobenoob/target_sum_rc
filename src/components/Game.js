import React from 'react';
import PropTypes from 'prop-types';
import {View, StyleSheet, Text, Button} from 'react-native';
import RandomNumber from './RandomNumber.js';
import shuffle from 'lodash.shuffle';

class Game extends React.Component {
  static propTypes = {
    randomNumberCount: PropTypes.number.isRequired,
    initialSeconds: PropTypes.number.isRequired,
    onPlayAgain: PropTypes.func.isRequired,
  };

  state = {selectedIds: [], remainingSeconds: this.props.initialSeconds};

  gameStatus = 'PLAYING';
  randomNumbers = Array.from({length: this.props.randomNumberCount}).map(
    () => 1 + Math.floor(10 * Math.random()),
  );
  target = this.randomNumbers
    .slice(0, this.props.randomNumberCount - 2)
    .reduce((acc, curr) => acc + curr, 0);
  shuffledRandomNumbers = shuffle(this.randomNumbers);

  componentDidMount() {
    this.intervalId = setInterval(() => {
      this.setState(
        currentState => {
          return {remainingSeconds: currentState.remainingSeconds - 1};
        },
        () => {
          if (this.state.remainingSeconds === 0) {
            clearInterval(this.intervalId);
            this.gameStatus === 'LOST';
          }
        },
      );
    }, 1000);
  }
  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      nextState.selectedIds !== this.state.selectedIds ||
      nextState.remainingSeconds === 0
    ) {
      this.gameStatus = this.calcGameStatus(nextState);
      if (this.gameStatus !== 'PLAYING') {
        clearInterval(this.intervalId);
        this.gameStatus === 'test';
      }
    }
  }

  isNumberSelected = numberIndex => {
    return this.state.selectedIds.indexOf(numberIndex) >= 0;
  };

  selectNumber = numberIndex => {
    this.setState(currentState => ({
      selectedIds: [...currentState.selectedIds, numberIndex],
    }));
  };

  calcGameStatus = nextState => {
    const sumSelected = nextState.selectedIds.reduce((acc, curr) => {
      return acc + this.shuffledRandomNumbers[curr];
    }, 0);
    if (nextState.remainingSeconds === 0) {
      return 'LOST';
    }
    if (sumSelected < this.target) {
      return 'PLAYING';
    }
    if (sumSelected === this.target) {
      return 'WON';
    }
    if (sumSelected > this.target) {
      return 'LOST';
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={[styles.target, styles[`STATUS_${this.gameStatus}`]]}>
          {this.target}
        </Text>
        <View style={styles.randomContainer}>
          {this.shuffledRandomNumbers.map((randomNumber, index) => (
            <RandomNumber
              key={index}
              id={index}
              number={randomNumber}
              isDisabled={
                this.isNumberSelected(index) || this.gameStatus !== 'PLAYING'
              }
              onPress={this.selectNumber}
            />
          ))}
        </View>
        <>
          {this.gameStatus !== 'PLAYING' && (
            <Button title="Play Again" onPress={this.props.onPlayAgain} />
          )}

          <Text>{this.state.remainingSeconds}</Text>
          <Text style={[styles.target, styles[`STATUS_${this.gameStatus}`]]}>
            {this.gameStatus}
          </Text>
        </>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'pink',
    flex: 1,
    paddingTop: 30,
  },
  target: {
    fontSize: 40,
    backgroundColor: 'deeppink',
    marginHorizontal: 50,
    textAlign: 'center',
  },
  randomContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  selected: {
    opacity: 0.3,
  },
  STATUS_PLAYING: {
    backgroundColor: 'deeppink',
  },
  STATUS_WON: {
    backgroundColor: 'lightgreen',
  },
  STATUS_LOST: {
    backgroundColor: 'red',
  },
});

export default Game;
