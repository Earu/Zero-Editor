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
	}

	protected onMouseUp(): void {
		if (this.props.graph.selectedGraphNodeIO instanceof GraphNodeOutput) {
			this.props.property.trySetLinkedOutput(this.props.graph.selectedGraphNodeIO.props.output);
			this.props.graph.selectedGraphNodeIO = null;
			this.props.graph.isMoveable = true;
		}
		if (this.props.graph.selectedGraphNodeIO === this) {
			this.props.graph.selectedGraphNodeIO = null;
			this.props.graph.isMoveable =  true;
		}
	}

	protected onMouseDown(): void {
		this.props.property.trySetLinkedOutput(null);
		this.props.graph.selectedGraphNodeIO = this;
		this.props.graph.isMoveable = false;
	}

	public update(): void {
		this.props.node.updateOutputs();
	}

	public componentDidMount(): void {
		if (!this._userSelectionRef) return;
		this.props.property.userSelector = this._userSelectionRef.current;
	}
}

export class GraphNodeNumberProperty extends BaseGraphNodeProperty<number> {
	public render(): JSX.Element {
		return (<div className="graph-node-property" onMouseUp={this.onMouseUp.bind(this)} >
			<div className="user-selection" ref={this._userSelectionRef} onMouseDown={this.onMouseDown.bind(this)} />
			<label htmlFor={this.props.id}>{this.props.name}</label>
			<input className="graph-node-property-text-input" id={this.props.id} type="text" placeholder={this.props.name}
				defaultValue={this.props.property.getValue()} onChange={this.update.bind(this)} />
		</div>);
	}
}

export class GraphNodeBooleanProperty extends BaseGraphNodeProperty<boolean> {
	public render(): JSX.Element {
		return (<div className="graph-node-property" onMouseUp={this.onMouseUp.bind(this)} >
			<div className="user-selection" ref={this._userSelectionRef} onMouseDown={this.onMouseDown.bind(this)} />
			<input id={this.props.id} type="checkbox" placeholder={this.props.name}
				defaultChecked={this.props.property.getValue()} onChange={this.update.bind(this)} />
			<label className="graph-node-property-checkbox-label" htmlFor={this.props.id}>{this.props.name}</label>
		</div>);
	}
}

export class GraphNodeVectorProperty extends BaseGraphNodeProperty<Vector> {
	public render(): JSX.Element {
		return (<div className="graph-node-property" onMouseUp={this.onMouseUp.bind(this)} >
			<div className="user-selection" ref={this._userSelectionRef} onMouseDown={this.onMouseDown.bind(this)} />
			<div>{this.props.name}</div>
			<label htmlFor={`${this.props.id}_x`}>X</label>
			<input className="graph-node-property-text-input" id={`${this.props.id}_x`} type="text" placeholder={this.props.name}
				defaultValue={this.props.property.getValue().x} onChange={this.update.bind(this)} />
			<label htmlFor={`${this.props.id}_y`}>Y</label>
			<input className="graph-node-property-text-input" id={`${this.props.id}_y`} type="text" placeholder={this.props.name}
				defaultValue={this.props.property.getValue().y} onChange={this.update.bind(this)} />
			<label htmlFor={`${this.props.id}_z`}>Z</label>
			<input className="graph-node-property-text-input" id={`${this.props.id}_z`} type="number" placeholder={this.props.name}
				defaultValue={this.props.property.getValue().z} onChange={this.update.bind(this)} />
		</div>);
	}
}

export class GraphNodeAngleProperty extends BaseGraphNodeProperty<Angle>{
	public render(): JSX.Element {
		return (<div className="graph-node-property" onMouseUp={this.onMouseUp.bind(this)} >
			<div className="user-selection" ref={this._userSelectionRef} onMouseDown={this.onMouseDown.bind(this)} />
			<div>{this.props.name}</div>
			<label htmlFor={`${this.props.id}_roll`}>Roll</label>
			<input className="graph-node-property-text-input" id={`${this.props.id}_roll`} type="text" min={-360} max={360}
				placeholder={this.props.name} defaultValue={this.props.property.getValue().roll} onChange={this.update.bind(this)} />
			<label htmlFor={`${this.props.id}_pitch`}>Pitch</label>
			<input className="graph-node-property-text-input" id={`${this.props.id}_pitch`} type="text" min={-360} max={360}
				placeholder={this.props.name} defaultValue={this.props.property.getValue().pitch} onChange={this.update.bind(this)} />
			<label htmlFor={`${this.props.id}_yaw`}>Yaw</label>
			<input className="graph-node-property-text-input" id={`${this.props.id}_yaw`} type="text" min={-360} max={360}
				placeholder={this.props.name} defaultValue={this.props.property.getValue().yaw} onChange={this.update.bind(this)} />
		</div>);
	}
}

export class GraphNodeColorProperty extends BaseGraphNodeProperty<Color> {
	public render(): JSX.Element {
		return (<div className="graph-node-property" onMouseUp={this.onMouseUp.bind(this)} >
			<div className="user-selection" ref={this._userSelectionRef} onMouseDown={this.onMouseDown.bind(this)} />
			<div>{this.props.name}</div>
			<label htmlFor={`${this.props.id}_red`}>Red</label>
			<input className="graph-node-property-text-input" id={`${this.props.id}_red`} type="text" min={0} max={255}
				placeholder={this.props.name} defaultValue={this.props.property.getValue().red} onChange={this.update.bind(this)} />
			<label htmlFor={`${this.props.id}_green`}>Green</label>
			<input className="graph-node-property-text-input" id={`${this.props.id}_green`} type="text" min={0} max={255}
				placeholder={this.props.name} defaultValue={this.props.property.getValue().green} onChange={this.update.bind(this)} />
			<label htmlFor={`${this.props.id}_blue`}>Blue</label>
			<input className="graph-node-property-text-input" id={`${this.props.id}_blue`} type="text" min={0} max={255}
				placeholder={this.props.name} defaultValue={this.props.property.getValue().blue} onChange={this.update.bind(this)} />
		</div>);
	}
}