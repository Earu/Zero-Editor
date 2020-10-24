import React from "react";
import Graph from "./Graph";
import "./GraphControls.css"

interface IGraphControlsProperties {
	graph: Graph;
}

export default class GraphControls extends React.Component<IGraphControlsProperties> {
	private onResetTransform(): void {
		this.props.graph.setTransform(0, 0, 1);
	}

	private onChangeX(event: React.ChangeEvent<HTMLInputElement>): void {
		const x = parseInt(event.target.value);
		if (isNaN(x)) return;

		this.props.graph.setTransform(x, null, null);
	}

	private onChangeY(event: React.ChangeEvent<HTMLInputElement>): void {
		const y = parseInt(event.target.value);
		if (isNaN(y)) return;

		this.props.graph.setTransform(null, y, null);
	}

	private onChangeZ(event: React.ChangeEvent<HTMLInputElement>): void {
		const z = parseFloat(event.target.value);
		if (isNaN(z)) return;

		this.props.graph.setTransform(null, null, z);
	}

	private setInputFilter(input: HTMLInputElement, inputFilter: (value: string) => boolean): void {
		const callback = (event: Event) => {
			if (!inputFilter(input.value)) {
				event.preventDefault();
				return false;
			}
		}

		["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"]
			.forEach(eventName => input.addEventListener(eventName, callback));
	}

	public componentDidMount(): void {
		// Allow digits and '.' only, using a RegExp
		const pattern: RegExp = /^-?[0-9]*\.?[0-9]*$/;
		const inputX: HTMLInputElement = document.getElementById("graph-control-x") as HTMLInputElement;
		const inputY: HTMLInputElement = document.getElementById("graph-control-y") as HTMLInputElement;
		const inputZ: HTMLInputElement = document.getElementById("graph-control-z") as HTMLInputElement;

		if (!inputX || !inputY || !inputZ) return;

		this.setInputFilter(inputX, value => pattern.test(value));
		this.setInputFilter(inputY, value => pattern.test(value));
		this.setInputFilter(inputZ, value => pattern.test(value));
	}

	public render(): JSX.Element {
		return (<div id="graph-controls">
			<button onClick={this.onResetTransform.bind(this)}>⟲</button>
			<label htmlFor="graph-control-x">X</label>
			<input id="graph-control-x" type="text" placeholder="X" defaultValue="0" onChange={this.onChangeX.bind(this)} />
			<label htmlFor="graph-control-y">Y</label>
			<input id="graph-control-y" type="text" placeholder="Y" defaultValue="0" onChange={this.onChangeY.bind(this)} />
			<label htmlFor="graph-control-z">Z</label>
			<input id="graph-control-z" type="text" placeholder="Z" defaultValue="1" onChange={this.onChangeZ.bind(this)} />
		</div>);
	}
}