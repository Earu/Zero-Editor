import React from "react";
import { NodeOutput } from "../../nodes/Node";
import Graph from "./Graph";
import "./GraphNodeOutput.css";
import { BaseGraphNodeProperty } from "./GraphNodeProperties";

interface IGraphNodeOutputProperties<T> {
	name: string;
	output: NodeOutput<T>;
	graph: Graph;
}

export default class GraphNodeOutput<T> extends React.Component<IGraphNodeOutputProperties<T>> {
	private _userSelectionRef: React.RefObject<any> | null = null;

	constructor(props: any) {
		super(props);
		this._userSelectionRef = React.createRef();
	}

	private onMouseDown(): void {
		this.props.graph.selectedGraphNodeIO = this;
		this.props.graph.isMoveable = false;
	}

	private onMouseUp(): void {
		if (this.props.graph.selectedGraphNodeIO instanceof BaseGraphNodeProperty) {
			const property = this.props.graph.selectedGraphNodeIO.props.property;
			if (property.trySetLinkedOutput(this.props.output)) {
				property.userSelector?.classList.add("linked");
				this.props.output.userSelector?.classList.add("linked");
			}

			this.props.graph.selectedGraphNodeIO = null;
			this.props.graph.isMoveable = true;
		}

		if (this.props.graph.selectedGraphNodeIO === this) {
			this.props.graph.selectedGraphNodeIO = null;
			this.props.graph.isMoveable = true;
		}
	}

	public componentDidMount(): void {
		if (!this._userSelectionRef) return;
		this.props.output.userSelector = this._userSelectionRef.current;
	}

	public render(): JSX.Element {
		return (<div className="graph-node-output" onMouseDown={this.onMouseDown.bind(this)} onMouseUp={this.onMouseUp.bind(this)}>
			<span>{this.props.name}</span>
			<div className="user-selection" ref={this._userSelectionRef}/>
		</div>);
	}
}