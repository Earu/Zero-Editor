import React from "react";
import Angle from "../../gmodTypes/Angle";
import Color from "../../gmodTypes/Color";
import Vector from "../../gmodTypes/Vector";
import { Node, NodeProperty } from "../../nodes/Node";
import Graph from "./Graph";
import GraphNodeOutput from "./GraphNodeOutput";
import "./GraphNodeProperties.css";

interface IGraphNodePropertyProperties<T> {
	id: string;
	name: string;
	node: Node;
	property: NodeProperty<T>;
	graph: Graph;
}

export class BaseGraphNodeProperty<T> extends React.Component<IGraphNodePropertyProperties<T>> {
	protected _userSelectionRef: React.RefObject<any> | null = null;

	constructor(props: any) {
		super(props);
		this._userSelectionRef = React.createRef();
		this.props.property.addListener("update", () => this.update());
	}

	protected update(): void {}

	protected onMouseUp(): void {
		if (this.props.graph.selectedGraphNodeIO instanceof GraphNodeOutput) {
			const output = this.props.graph.selectedGraphNodeIO.props.output;
			if (this.props.property.trySetLinkedOutput(output)) {
				this.props.property.userSelector?.classList.add("linked");
				output.userSelector?.classList.add("linked");
			}

			this.props.graph.selectedGraphNodeIO = null;
			this.props.graph.isMoveable = true;
		}

		if (this.props.graph.selectedGraphNodeIO === this) {
			this.props.graph.selectedGraphNodeIO = null;
			this.props.graph.isMoveable =  true;
		}
	}

	protected onMouseDown(): void {
		this.props.property.userSelector?.classList.remove("linked");

		// only remove the style for the output selector if we know its not linked to any property
		const linkedOutput = this.props.property.linkedOutput;
		if (linkedOutput && linkedOutput.linkedProperties.length === 1) {
			linkedOutput.userSelector?.classList.remove("linked");
		}

		this.props.property.trySetLinkedOutput(null);
		this.props.graph.selectedGraphNodeIO = this;
		this.props.graph.isMoveable = false;
	}

	public componentDidMount(): void {
		if (!this._userSelectionRef) return;
		this.props.property.userSelector = this._userSelectionRef.current;
	}
}

export class GraphNodeNumberProperty extends BaseGraphNodeProperty<number> {
	private inputNumber: React.RefObject<HTMLInputElement>;

	constructor(props: any) {
		super(props);
		this.inputNumber = React.createRef();
	}

	protected update(): void {
		if (this.inputNumber.current) {
			this.inputNumber.current.value = this.props.property.getValue().toString();
		}

		this.updateNodeOutput();
	}

	private updateNodeOutput(): void {
		if (this.inputNumber.current) {
			const userInput: number = parseFloat(this.inputNumber.current?.value);
			if (!isNaN(userInput)) {
				this.props.property.staticValue = userInput;
			}
		}

		this.props.node.updateOutputs();
	}

	public render(): JSX.Element {
		return (<div className="graph-node-property" onMouseUp={this.onMouseUp.bind(this)} >
			<div className="user-selection" ref={this._userSelectionRef} onMouseDown={this.onMouseDown.bind(this)} />
			<label htmlFor={this.props.id}>{this.props.name}</label>
			<input className="graph-node-property-text-input" id={this.props.id} type="text" placeholder={this.props.name}
				defaultValue={this.props.property.getValue()} onChange={this.updateNodeOutput.bind(this)} ref={this.inputNumber} />
		</div>);
	}
}

export class GraphNodeBooleanProperty extends BaseGraphNodeProperty<boolean> {
	private inputBoolean: React.RefObject<HTMLInputElement>;

	constructor(props: any) {
		super(props);
		this.inputBoolean = React.createRef();
	}

	protected update(): void {
		if (this.inputBoolean.current) {
			this.inputBoolean.current.value = this.props.property.getValue().toString();
		}

		this.updateNodeOutput();
	}

	public updateNodeOutput(): void {
		if (this.inputBoolean.current) {
			const userInput: boolean = this.inputBoolean.current.value.toLowerCase() === "true";
			this.props.property.staticValue = userInput;
		}

		this.props.node.updateOutputs();
	}

	public render(): JSX.Element {
		return (<div className="graph-node-property" onMouseUp={this.onMouseUp.bind(this)} >
			<div className="user-selection" ref={this._userSelectionRef} onMouseDown={this.onMouseDown.bind(this)} />
			<input id={this.props.id} type="checkbox" placeholder={this.props.name}
				defaultChecked={this.props.property.getValue()} onChange={this.updateNodeOutput.bind(this)} ref={this.inputBoolean} />
			<label className="graph-node-property-checkbox-label" htmlFor={this.props.id}>{this.props.name}</label>
		</div>);
	}
}

export class GraphNodeVectorProperty extends BaseGraphNodeProperty<Vector> {
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

		if (this.inputX.current) {
			this.inputX.current.value = value.x.toString();
		}

		if (this.inputY.current) {
			this.inputY.current.value = value.y.toString();
		}

		if (this.inputZ.current) {
			this.inputZ.current.value = value.z.toString();
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

export class GraphNodeAngleProperty extends BaseGraphNodeProperty<Angle>{
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

		if (this.inputRoll.current) {
			this.inputRoll.current.value = value.roll.toString();
		}

		if (this.inputPitch.current) {
			this.inputPitch.current.value = value.pitch.toString();
		}

		if (this.inputYaw.current) {
			this.inputYaw.current.value = value.yaw.toString();
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

export class GraphNodeColorProperty extends BaseGraphNodeProperty<Color> {
	private inputRed: React.RefObject<HTMLInputElement>;
	private inputGreen: React.RefObject<HTMLInputElement>;
	private inputBlue: React.RefObject<HTMLInputElement>;
	private inputAlpha: React.RefObject<HTMLInputElement>;

	constructor(props: any) {
		super(props);
		this.inputRed = React.createRef();
		this.inputGreen = React.createRef();
		this.inputBlue = React.createRef();
		this.inputAlpha = React.createRef();
	}

	protected update(): void {
		const value: Color = this.props.property.getValue();

		if (this.inputRed.current) {
			this.inputRed.current.value = value.red.toString();
		}

		if (this.inputGreen.current) {
			this.inputGreen.current.value = value.green.toString();
		}

		if (this.inputBlue.current) {
			this.inputBlue.current.value = value.blue.toString();
		}

		if (this.inputAlpha.current) {
			this.inputAlpha.current.value = value.alpha.toString();
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

		this.props.node.updateOutputs();
	}

	public render(): JSX.Element {
		return (<div className="graph-node-property" onMouseUp={this.onMouseUp.bind(this)} >
			<div className="user-selection" ref={this._userSelectionRef} onMouseDown={this.onMouseDown.bind(this)} />
			<div>{this.props.name}</div>
			<label htmlFor={`${this.props.id}_red`}>Red</label>
			<input className="graph-node-property-text-input" id={`${this.props.id}_red`} type="text" min={0} max={255}
				placeholder={this.props.name} defaultValue={this.props.property.getValue().red} onChange={this.updateNodeOutput.bind(this)} />
			<label htmlFor={`${this.props.id}_green`}>Green</label>
			<input className="graph-node-property-text-input" id={`${this.props.id}_green`} type="text" min={0} max={255}
				placeholder={this.props.name} defaultValue={this.props.property.getValue().green} onChange={this.updateNodeOutput.bind(this)} />
			<label htmlFor={`${this.props.id}_blue`}>Blue</label>
			<input className="graph-node-property-text-input" id={`${this.props.id}_blue`} type="text" min={0} max={255}
				placeholder={this.props.name} defaultValue={this.props.property.getValue().blue} onChange={this.updateNodeOutput.bind(this)} />
		</div>);
	}
}