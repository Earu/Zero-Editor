import React from "react";
import BaseGraphNodeProperty from "../../editor/components/graph/GraphNodeProperties";
import Color from "../types/Color";

export default class GraphNodeColorProperty extends BaseGraphNodeProperty<Color> {
	private inputRed: React.RefObject<HTMLInputElement>;
	private inputGreen: React.RefObject<HTMLInputElement>;
	private inputBlue: React.RefObject<HTMLInputElement>;
	private inputAlpha: React.RefObject<HTMLInputElement>;
	private colorPreview: React.RefObject<HTMLDivElement>;

	constructor(props: any) {
		super(props);
		this.inputRed = React.createRef();
		this.inputGreen = React.createRef();
		this.inputBlue = React.createRef();
		this.inputAlpha = React.createRef();
		this.colorPreview = React.createRef();
	}

	protected update(): void {
		const value: Color = this.props.property.getValue();
		const isLinked: boolean = this.props.property.linkedOutput !== null;

		if (this.inputRed.current) {
			this.inputRed.current.value = value.red.toString();
			this.inputRed.current.disabled = isLinked;
		}

		if (this.inputGreen.current) {
			this.inputGreen.current.value = value.green.toString();
			this.inputGreen.current.disabled = isLinked;
		}

		if (this.inputBlue.current) {
			this.inputBlue.current.value = value.blue.toString();
			this.inputBlue.current.disabled = isLinked;
		}

		if (this.inputAlpha.current) {
			this.inputAlpha.current.value = value.alpha.toString();
			this.inputAlpha.current.disabled = isLinked;
		}

		if (this.colorPreview.current) {
			this.colorPreview.current.style.borderBottom = `1px solid rgba(${value.red},${value.green},${value.blue},${value.alpha/255})`;
		}

		this.updateNodeOutput();
	}

	public updateNodeOutput(): void {
		if (!this.inputRed.current || !this.inputGreen.current || !this.inputBlue.current || !this.inputAlpha.current) return;

		const red: number = parseInt(this.inputRed.current.value);
		const green: number = parseInt(this.inputGreen.current.value);
		const blue: number = parseInt(this.inputBlue.current.value);
		const alpha: number = parseInt(this.inputAlpha.current.value);

		const oldColor: Color = this.props.property.staticValue;
		this.props.property.staticValue = new Color(
			isNaN(red) ? oldColor.red : red,
			isNaN(green) ? oldColor.green : green,
			isNaN(blue) ? oldColor.blue : blue,
			isNaN(alpha) ? oldColor.alpha : alpha
		);

		if (this.colorPreview.current) {
			this.colorPreview.current.style.borderBottom = `1px solid rgba(${red},${green},${blue},${alpha/255})`;
		}

		this.props.node.updateOutputs();
	}

	public render(): JSX.Element {
		return (<div className="graph-node-property" onMouseUp={this.onMouseUp.bind(this)} >
			<div className="user-selection" ref={this._userSelectionRef} onMouseDown={this.onMouseDown.bind(this)} />
			<div>{this.props.name}</div>
			<div style={{ display: "inline-block", borderBottom: "1px solid white" }} ref={this.colorPreview}>
				<input className="graph-node-property-color-input" type="text" min={0} max={255} placeholder={this.props.name}
					defaultValue={this.props.property.getValue().red} onChange={this.updateNodeOutput.bind(this)} ref={this.inputRed} />
				<input className="graph-node-property-color-input" type="text" min={0} max={255} placeholder={this.props.name}
					defaultValue={this.props.property.getValue().green} onChange={this.updateNodeOutput.bind(this)} ref={this.inputGreen} />
				<input className="graph-node-property-color-input" type="text" min={0} max={255} placeholder={this.props.name}
					defaultValue={this.props.property.getValue().blue} onChange={this.updateNodeOutput.bind(this)} ref={this.inputBlue} />
				<input className="graph-node-property-color-input" type="text" min={0} max={255} placeholder={this.props.name}
					defaultValue={this.props.property.getValue().blue} onChange={this.updateNodeOutput.bind(this)} ref={this.inputAlpha} />
				<div className="graph-node-property-color-preview" />
			</div>
		</div>);
	}
}