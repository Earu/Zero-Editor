import React from "react";
import BaseGraphNodeProperty from "../../editor/components/graph/GraphNodeProperties";
import Vector from "../types/Vector";

export default class GraphNodeVectorProperty extends BaseGraphNodeProperty<Vector> {
	private inputX: React.RefObject<HTMLInputElement>;
	private inputY: React.RefObject<HTMLInputElement>;
	private inputZ: React.RefObject<HTMLInputElement>;

	constructor(props: any) {
		super(props);
		this.inputX = React.createRef();
		this.inputY = React.createRef();
		this.inputZ = React.createRef();
	}

	protected update(): void {
		const value: Vector = this.props.property.getValue();
		const isLinked: boolean = this.props.property.linkedOutput !== null;

		if (this.inputX.current) {
			this.inputX.current.value = value.x.toString();
			this.inputX.current.disabled = isLinked;
		}

		if (this.inputY.current) {
			this.inputY.current.value = value.y.toString();
			this.inputY.current.disabled = isLinked;
		}

		if (this.inputZ.current) {
			this.inputZ.current.value = value.z.toString();
			this.inputZ.current.disabled = isLinked;
		}

		this.updateNodeOutput();
	}

	public updateNodeOutput(): void {
		if (!this.inputX.current || !this.inputY.current || !this.inputZ.current) return;

		const x: number = parseFloat(this.inputX.current.value);
		const y: number = parseFloat(this.inputY.current.value);
		const z: number = parseFloat(this.inputZ.current.value);

		const oldVector = this.props.property.staticValue;
		this.props.property.staticValue = new Vector(
			isNaN(x) ? oldVector.x : x,
			isNaN(y) ? oldVector.y : y,
			isNaN(z) ? oldVector.z : z
		);

		this.props.node.updateOutputs();
	}

	public render(): JSX.Element {
		return (<div className="graph-node-property" onMouseUp={this.onMouseUp.bind(this)} >
			<div className="user-selection" ref={this._userSelectionRef} onMouseDown={this.onMouseDown.bind(this)} />
			<div>{this.props.name}</div>
			<label htmlFor={`${this.props.id}_x`}>X</label>
			<input className="graph-node-property-text-input" id={`${this.props.id}_x`} type="text" placeholder={this.props.name}
				defaultValue={this.props.property.getValue().x} onChange={this.updateNodeOutput.bind(this)} ref={this.inputX} />
			<label htmlFor={`${this.props.id}_y`}>Y</label>
			<input className="graph-node-property-text-input" id={`${this.props.id}_y`} type="text" placeholder={this.props.name}
				defaultValue={this.props.property.getValue().y} onChange={this.updateNodeOutput.bind(this)} ref={this.inputY} />
			<label htmlFor={`${this.props.id}_z`}>Z</label>
			<input className="graph-node-property-text-input" id={`${this.props.id}_z`} type="number" placeholder={this.props.name}
				defaultValue={this.props.property.getValue().z} onChange={this.updateNodeOutput.bind(this)} ref={this.inputZ} />
		</div>);
	}
}