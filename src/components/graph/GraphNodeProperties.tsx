import React from "react";
import Angle from "../../gmodTypes/Angle";
import Color from "../../gmodTypes/Color";
import Vector from "../../gmodTypes/Vector";
import "./GraphNodeProperties.css";

interface IGraphNodePropertyProperties<T> {
	id: string;
	name: string;
	value: T;
}

export class GraphNodeNumberProperty extends React.Component<IGraphNodePropertyProperties<number>> {
	public render(): JSX.Element {
		return (<div className="graph-node-property">
			<label htmlFor={this.props.id}>{this.props.name}</label>
			<input className="graph-node-property-text-input" id={this.props.id} type="number" placeholder={this.props.name} defaultValue={this.props.value} />
		</div>);
	}
}

export class GraphNodeBooleanProperty extends React.Component<IGraphNodePropertyProperties<boolean>> {
	public render(): JSX.Element {
		return (<div className="graph-node-property">
			<input id={this.props.id} type="checkbox" placeholder={this.props.name} defaultChecked={this.props.value} />
			<label className="graph-node-property-checkbox-label" htmlFor={this.props.id}>{this.props.name}</label>
		</div>);
	}
}

export class GraphNodeVectorProperty extends React.Component<IGraphNodePropertyProperties<Vector>> {
	public render(): JSX.Element {
		return (<div className="graph-node-property">
			<div>{this.props.name}</div>
			<label htmlFor={`${this.props.id}_x`}>X</label>
			<input className="graph-node-property-text-input" id={`${this.props.id}_x`} type="number" placeholder={this.props.name} defaultValue={this.props.value.x} />
			<label htmlFor={`${this.props.id}_y`}>Y</label>
			<input className="graph-node-property-text-input" id={`${this.props.id}_y`} type="number" placeholder={this.props.name} defaultValue={this.props.value.y} />
			<label htmlFor={`${this.props.id}_z`}>Z</label>
			<input className="graph-node-property-text-input" id={`${this.props.id}_z`} type="number" placeholder={this.props.name} defaultValue={this.props.value.z} />
		</div>);
	}
}

export class GraphNodeAngleProperty extends React.Component<IGraphNodePropertyProperties<Angle>> {
	public render(): JSX.Element {
		return (<div className="graph-node-property">
			<div>{this.props.name}</div>
			<label htmlFor={`${this.props.id}_roll`}>Roll</label>
			<input className="graph-node-property-text-input" id={`${this.props.id}_roll`} type="number" min="-360" max="360"
				placeholder={this.props.name} defaultValue={this.props.value.roll} />
			<label htmlFor={`${this.props.id}_pitch`}>Pitch</label>
			<input className="graph-node-property-text-input" id={`${this.props.id}_pitch`} type="number" min="-360" max="360"
				placeholder={this.props.name} defaultValue={this.props.value.pitch} />
			<label htmlFor={`${this.props.id}_yaw`}>Yaw</label>
			<input className="graph-node-property-text-input" id={`${this.props.id}_yaw`} type="number" min="-360" max="360"
				placeholder={this.props.name} defaultValue={this.props.value.yaw} />
		</div>);
	}
}

export class GraphNodeColorProperty extends React.Component<IGraphNodePropertyProperties<Color>> {
	public render(): JSX.Element {
		return (<div className="graph-node-property">
			<div>{this.props.name}</div>
			<label htmlFor={`${this.props.id}_red`}>Red</label>
			<input className="graph-node-property-text-input" id={`${this.props.id}_red`} type="number" min="0" max="255"
				placeholder={this.props.name} defaultValue={this.props.value.red} />
			<label htmlFor={`${this.props.id}_green`}>Green</label>
			<input className="graph-node-property-text-input" id={`${this.props.id}_green`} type="number" min="0" max="255"
				placeholder={this.props.name} defaultValue={this.props.value.green} />
			<label htmlFor={`${this.props.id}_blue`}>Blue</label>
			<input className="graph-node-property-text-input" id={`${this.props.id}_blue`} type="number" min="0" max="255"
				placeholder={this.props.name} defaultValue={this.props.value.blue} />
		</div>);
	}
}