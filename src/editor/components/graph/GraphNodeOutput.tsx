import React from "react";
import NodeOutput from "../../nodes/NodeOutput";
import Graph from "./Graph";
import "./GraphNodeOutput.css";
import BaseGraphNodeProperty from "./GraphNodeProperties";

interface IGraphNodeOutputProperties<T> {
	name: string;
	output: NodeOutput<T>;
	graph: Graph;
}

export default class GraphNodeOutput<T> extends React.Component<IGraphNodeOutputProperties<T>> {
	private _userSelectionRef: React.RefObject<HTMLDivElement>;

	constructor(props: any) {
		super(props);
		this._userSelectionRef = React.createRef();
	}

	private onMouseDown(): void {
		this.props.graph.selectionService.selectedGraphNodeIO = this;
		this.props.graph.selectionService.isGraphMoveable = false;
	}

	private onMouseUp(): void {
		const graph: Graph = this.props.graph;
		if (graph.selectionService.selectedGraphNodeIO instanceof BaseGraphNodeProperty) {
			const property = graph.selectionService.selectedGraphNodeIO.props.property;
			if (property.trySetLinkedOutput(this.props.output)) {
				property.userSelector?.classList.add("linked");
				this.props.output.userSelector?.classList.add("linked");
				property.emit("update");
			}

			graph.selectionService.selectedGraphNodeIO = null;
			graph.selectionService.isGraphMoveable = true;
		}

		if (graph.selectionService.selectedGraphNodeIO === this) {
			graph.selectionService.selectedGraphNodeIO = null;
			graph.selectionService.isGraphMoveable = true;
		}
	}

	public componentDidMount(): void {
		this.props.output.userSelector = this._userSelectionRef.current;
	}

	public componentWillUnmount(): void {
		this.props.output.userSelector?.classList.remove("linked");
		for (const linkedProperty of this.props.output.linkedProperties) {
			linkedProperty.userSelector?.classList.remove("linked");
			linkedProperty.trySetLinkedOutput(null);
			linkedProperty.emit("update");
		}
	}

	public render(): JSX.Element {
		return (<div className="graph-node-output" onMouseDown={this.onMouseDown.bind(this)} onMouseUp={this.onMouseUp.bind(this)}>
			<span>{this.props.name}</span>
			<div className="user-selection" ref={this._userSelectionRef}/>
		</div>);
	}
}