import React from "react";
import classes from "./Square.module.scss";

export default function Square({ cordinates, status, onClick, active }) {
	let colors = ["red", "blue", "green", "yellow", "pink"];
	let free = " free";

	return (
		<div className={classes.Square + ` ${active ? classes.active : ""}`} onClick={onClick}>
			<div className={classes.circle + ` ${status === "free" ? free : colors[status]}`}></div>
		</div>
	);
}
