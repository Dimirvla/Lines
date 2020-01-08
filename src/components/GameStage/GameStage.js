import React, { Component } from "react";
import Square from "./Square/Square";
import classes from "./GameStage.module.scss";
import { getRandomNumbersArray, check, findPath } from "../../utils/functions";

export default class GameStage extends Component {
	state = {
		rows: 9,
		columns: 9,
		grid: [
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0]
		],
		nextColors: getRandomNumbersArray(5, 3),
		start: false,
		onMove: false,
		score: 0
	};

	componentDidMount() {
		this.getGrid();
		this.newCircles();
	}

	getGrid = (x, y) => {
		let grid = [...this.state.grid];
		for (let i = 0; i < this.state.rows; i++) {
			for (let j = 0; j < this.state.columns; j++) {
				grid[i][j] = { i, j, status: "free", active: false };
			}
		}
		this.setState({ grid, start: true });
	};

	getFreeSquares = () => {
		let freeSquares = [];
		let grid = [...this.state.grid];
		for (let i = 0; i < this.state.rows; i++) {
			for (let j = 0; j < this.state.columns; j++) {
				if (grid[i][j].status === "free") {
					freeSquares.push(i * 9 + j);
				}
			}
		}
		return freeSquares;
	};
	getNextColors = (len = 3) => {
		return getRandomNumbersArray(5, len);
	};

	onClick = (i, j, status) => {
		if (status !== "free") {
			this.moveFrom(i, j, status);
		} else if (this.state.onMove && status === "free") {
			this.moveTo(i, j);
		}
	};
	moveFrom = (i, j, color) => {
		let grid = [...this.state.grid];

		if (this.state.onMove) {
			grid[this.state.onMove.i][this.state.onMove.j].active = false;
		}

		grid[i][j].active = true;

		this.setState({ onMove: { i, j, color }, grid });
	};

	moveTo = (i, j) => {
		if (!findPath(this.state.onMove.i, this.state.onMove.j, i, j, [...this.state.grid])) {
			return;
		}
		let grid = [...this.state.grid];
		let color = this.state.onMove.color;
		grid[i][j].status = color;
		grid[this.state.onMove.i][this.state.onMove.j].status = "free";
		grid[this.state.onMove.i][this.state.onMove.j].active = false;

		this.setState({ grid, onMove: false }, () => {
			let score = 0;
			setTimeout(() => {
				score = this.checkForLines(i, j, color);
			}, 500);
			setTimeout(() => {
				score || this.newCircles();
			}, 1000);
		});
	};
	newCircles = () => {
		let locations = [];
		let grid = [...this.state.grid];
		for (let i = 0; i < this.state.nextColors.length; i++) {
			let fS = this.getFreeSquares();
			if (!fS.length) break;
			let location = fS[Math.floor(Math.random() * fS.length)];
			locations.push({ i: Math.floor(location / 9), j: location % 9, status: this.state.nextColors[i] });
			grid[Math.floor(location / 9)][location % 9].status = this.state.nextColors[i];
		}

		this.setState({ grid, nextColors: this.getNextColors() });

		setTimeout(() => {
			locations.map((square, i) => setTimeout(() => this.checkForLines(square.i, square.j, square.status), 1));
		}, 500);
	};
	checkForLines = (i, j, color) => {
		if (this.state.gameOver) return;
		let { grid, data } = check(i, j, color, [...this.state.grid]);
		if (!data.length && !this.getFreeSquares().length) {
			this.setState({ gameOver: true });
			alert("Game Over");
		}
		let score = data.length ? data.map(a => a.length).reduce((a, b) => a + b, 0) - data.length + 1 : 0;
		score = score ? 5 * Math.pow(2, score - 5) : 0;
		this.setState({ grid, score: this.state.score + score });
		return score;
	};

	render() {
		return (
			<>
				<div className={classes.newColors}>
					<div className={classes.score}>SCORE: {this.state.score}</div>

					{this.state.start && this.state.nextColors.map((col, index) => <Square key={index} status={col} />)}
				</div>
				<div className={classes.gameStage}>
					{this.state.start &&
						this.state.grid.map(row =>
							row.map(({ i, j, status, active }) => (
								<Square
									active={active}
									key={i * 9 + j}
									cordinates={i * 9 + j}
									status={status}
									onClick={() => this.onClick(i, j, status)}
								/>
							))
						)}
				</div>
			</>
		);
	}
}
