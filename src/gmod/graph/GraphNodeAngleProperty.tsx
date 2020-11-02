import React from "react";
import BaseGraphNodeProperty from "../../editor/components/graph/GraphNodeProperties";
import Angle from "../types/Angle";

export default class GraphNodeAngleProperty extends BaseGraphNodeProperty<Angle>{
	private inputRoll: React.RefObject<HTMLInputElement>;
	private inputPitch: React.RefObject<HTMLInputElement>;
	private inputYaw: React.RefObject<HTMLInputElement>;

	constructor(props: any) {
		super(props);
		this.inputRoll = React.createRef();
		this.inputPitch = React.createRef();
		this.inputYaw = React.createRef();
	}

	protected update(): void {
		const value: Angle = this.props.property.getValue();
		const isLinked: boolean = this.props.property.linkedOutput !== null;

		if (this.inputRoll.current) {
			this.inputRoll.current.value = value.roll.toString();
			this.inputRoll.current.disabled = isLinked;
		}

		if (this.inputPitch.current) {
			this.inputPitch.current.value = value.pitch.toString();
			this.inputPitch.current.disabled = isLinked;
		}

		if (this.inputYaw.current) {
			this.inputYaw.current.value = value.yaw.toString();
			this.inputYaw.current.disabled = isLinked;
		}

		this.updateNodeOutput();
	}

	public updateNodeOutput(): void {
		if (!this.inputPitch.current || !this.inputRoll.current || !this.inputYaw.current) return;

		const roll: number = parseFloat(this.inputRoll.current.value);
		const pitch: number = parseFloat(this.inputPitch.current.value);
		const yaw: number = parseFloat(this.inputYaw.current.value);

		const oldAngle = this.props.property.staticValue;
		this.props.property.staticValue = new Angle(
			isNaN(roll) ? oldAngle.roll : roll,
			isNaN(pitch) ? oldAngle.pitch : pitch,
			isNaN(yaw) ? oldAngle.yaw : yaw
		);

		this.props.node.updateOutputs();
	}

	public render(): JSX.Element {
		return (<div className="graph-node-property" onMouseUp={this.onMouseUp.bind(this)} >
			<div className="user-selection" ref={this._userSelectionRef} onMouseDown={this.onMouseDown.bind(this)} />
			<div>{this.props.name}</div>
			<label htmlFor={`${this.props.id}_roll`}>Roll</label>
			<input className="graph-node-property-text-input" id={`${this.props.id}_roll`} type="text" min={-360} max={360}
				placeholder={this.props.name} defaultValue={this.props.property.getValue().roll} onChange={this.updateNodeOutput.bind(this)} ref={this.inputRoll} />
			<label htmlFor={`${this.props.id}_pitch`}>Pitch</label>
			<input className="graph-node-property-text-input" id={`${this.props.id}_pitch`} type="text" min={-360} max={360}
				placeholder={this.props.name} defaultValue={this.props.property.getValue().pitch} onChange={this.updateNodeOutput.bind(this)} ref={this.inputPitch} />
			<label htmlFor={`${this.props.id}_yaw`}>Yaw</label>
			<input className="graph-node-property-text-input" id={`${this.props.id}_yaw`} type="text" min={-360} max={360}
				placeholder={this.props.name} defaultValue={this.props.property.getValue().yaw} onChange={this.updateNodeOutput.bind(this)} ref={this.inputYaw} />
		</div>);
	}
}
