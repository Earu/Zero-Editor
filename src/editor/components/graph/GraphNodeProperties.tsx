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
				this.props.property.emit("update");
				output.userSelector?.classList.add("linked");
			}

			this.props.graph.selectedGraphNodeIO = null;
			this.props.graph.isMoveable = true;
		}

		if (this.props.graph.selectedGraphNodeIO === this) {
			this.props.graph.selectedGraphNodeIO = null;
			this.props.graph.isMoveable = true;
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
		this.props.graph.selectedGraphNodeIO = this;
		this.props.graph.isMoveable = false;
	}

	public componentDidMount(): void {
		if (!this._userSelectionRef) return;
		this.props.property.userSelector = this._userSelectionRef.current;
	}
}