import React from "react";
import Node from "../../nodes/Node";
import NodeProperty from "../../nodes/NodeProperty";
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

export default class BaseGraphNodeProperty<T> extends React.Component<IGraphNodePropertyProperties<T>> {
	protected _userSelectionRef: React.RefObject<any>;

	constructor(props: any) {
		super(props);
		this._userSelectionRef = React.createRef();
		this.props.property.addListener("update", () => this.update());
	}

	protected update(): void {}

	protected onMouseUp(): void {
		const graph: Graph = this.props.graph;
		if (graph.selectionService.selectedGraphNodeIO instanceof GraphNodeOutput) {
			const output = graph.selectionService.selectedGraphNodeIO.props.output;
			if (this.props.property.trySetLinkedOutput(output)) {
				this.props.property.userSelector?.classList.add("linked");
				output.userSelector?.classList.add("linked");
				this.props.property.emit("update");
			}

			graph.selectionService.selectedGraphNodeIO = null;
			graph.selectionService.isGraphMoveable = true;
		}

		if (graph.selectionService.selectedGraphNodeIO === this) {
			graph.selectionService.selectedGraphNodeIO = null;
			graph.selectionService.isGraphMoveable = true;
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
		this.props.property.emit("update");
		this.props.graph.selectionService.selectedGraphNodeIO = this;
		this.props.graph.selectionService.isGraphMoveable = false;
	}

	public componentDidMount(): void {
		this.props.property.userSelector = this._userSelectionRef.current;
	}

	public componentWillUnmount(): void {
		// only remove the style for the output selector if we know its not linked to any property
		const linkedOutput = this.props.property.linkedOutput;
		if (linkedOutput && linkedOutput.linkedProperties.length === 1) {
			linkedOutput.userSelector?.classList.remove("linked");
		}

		this.props.property.userSelector?.classList.remove("linked");
		this.props.property.trySetLinkedOutput(null);
		this.props.property.emit("update");
	}
}