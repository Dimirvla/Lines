export function getRandomNumbersArray(limit, length) {
	let array = [];
	for (let i = 0; i < length; i++) {
		array.push(Math.floor(Math.random() * limit));
	}
	return array;
}

export function check(i, j, color, grid) {
	let candidates = getCandidates(i, j, grid);
	let data = candidates.map(candidate => checkCandidate(candidate, color)).filter(c => c !== 100);
	for (let x = 0; x < data.length; x++) {
		for (let y = 0; y < data[x].length; y++) {
			grid[data[x][y].i][data[x][y].j].status = "free";
		}
	}
	return { grid, data };
}

function checkCandidate(candidate, color) {
	let max = [];
	let current = [];

	for (let index = 0; index < candidate.length; index++) {
		if (candidate[index].status === color) {
			current.push(candidate[index]);
		} else {
			current = [];
		}
		max = max.length < current.length ? current : max;
	}
	if (max.length > 4) {
		return max;
	} else return 100;
}

function getCandidates(i, j, grid) {
	let candidates = [];
	candidates.push(grid[i]);
	candidates.push([
		grid[0][j],
		grid[1][j],
		grid[2][j],
		grid[3][j],
		grid[4][j],
		grid[5][j],
		grid[6][j],
		grid[7][j],
		grid[8][j]
	]);
	let temp = [];
	for (let x = 0; x < 9; x++) {
		for (let y = 0; y < 9; y++) {
			if (x - y === i - j) {
				temp.push(grid[x][y]);
			}
		}
	}
	temp.length > 4 && candidates.push(temp);
	temp = [];
	for (let x = 0; x < 9; x++) {
		for (let y = 0; y < 9; y++) {
			if (x + y === i + j) {
				temp.push(grid[x][y]);
			}
		}
	}
	temp.length > 4 && candidates.push(temp);
	return candidates;
}

export function findPath(x1, y1, x2, y2, grid) {
	let steps = [];
	let search_field = [
		[-1, -1, -1, -1, -1, -1, -1, -1, -1],
		[-1, -1, -1, -1, -1, -1, -1, -1, -1],
		[-1, -1, -1, -1, -1, -1, -1, -1, -1],
		[-1, -1, -1, -1, -1, -1, -1, -1, -1],
		[-1, -1, -1, -1, -1, -1, -1, -1, -1],
		[-1, -1, -1, -1, -1, -1, -1, -1, -1],
		[-1, -1, -1, -1, -1, -1, -1, -1, -1],
		[-1, -1, -1, -1, -1, -1, -1, -1, -1],
		[-1, -1, -1, -1, -1, -1, -1, -1, -1]
	];
	for (let i = 0; i < 9; i++) {
		for (let j = 0; j < 9; j++) {
			if (grid[i][j].status !== "free") {
				search_field[i][j] = -2;
			}
		}
	}
	search_field[x1][y1] = 0;

	steps.push({ x: x1, y: y1, step: 0 });
	let i = 0;
	while (true) {
		i++;
		if (!steps.length) {
			i = 85;
			break;
		}
		var cell = steps.shift();
		if (cell.y !== 0 && search_field[cell.x][cell.y - 1] === -1) {
			steps.push({ x: cell.x, y: cell.y - 1, step: cell.step + 1 });
			search_field[cell.x][cell.y - 1] = cell.step + 1;
		}
		if (cell.y !== 8 && search_field[cell.x][cell.y + 1] === -1) {
			steps.push({ x: cell.x, y: cell.y + 1, step: cell.step + 1 });
			search_field[cell.x][cell.y + 1] = cell.step + 1;
		}
		if (cell.x !== 0 && search_field[cell.x - 1][cell.y] === -1) {
			steps.push({ x: cell.x - 1, y: cell.y, step: cell.step + 1 });
			search_field[cell.x - 1][cell.y] = cell.step + 1;
		}
		if (cell.x !== 8 && search_field[cell.x + 1][cell.y] === -1) {
			steps.push({ x: cell.x + 1, y: cell.y, step: cell.step + 1 });
			search_field[cell.x + 1][cell.y] = cell.step + 1;
		}

		if (
			(cell.x === x2 && cell.y - 1 === y2) ||
			(cell.x === x2 && cell.y + 1 === y2) ||
			(cell.x - 1 === x2 && cell.y === y2) ||
			(cell.x + 1 === x2 && cell.y === y2)
		) {
			break;
		}
		if (i > 81) {
			break;
		}
	}
	if (i > 81) return null;

	let length = cell.step + 1;
	cell = { x: x2, y: y2, step: length };
	steps = [];
	while (cell.x !== x1 || cell.y !== y1) {
		if (cell.y !== 0 && search_field[cell.x][cell.y - 1] === cell.step - 1) {
			cell = { x: cell.x, y: cell.y - 1, step: cell.step - 1 };
			steps.push("R");
		} else if (cell.y !== 8 && search_field[cell.x][cell.y + 1] === cell.step - 1) {
			cell = { x: cell.x, y: cell.y + 1, step: cell.step - 1 };
			steps.push("L");
		} else if (cell.x !== 0 && search_field[cell.x - 1][cell.y] === cell.step - 1) {
			cell = { x: cell.x - 1, y: cell.y, step: cell.step - 1 };
			steps.push("D");
		} else if (cell.x !== 8 && search_field[cell.x + 1][cell.y] === cell.step - 1) {
			cell = { x: cell.x + 1, y: cell.y, step: cell.step - 1 };
			steps.push("U");
		}
	}
	console.log(steps.reverse());

	return steps.reverse();
}
