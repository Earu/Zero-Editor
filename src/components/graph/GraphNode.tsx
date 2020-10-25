import React from "react";
import Node from "../../nodes/Node";
import Graph from "./Graph";

interface IGraphNodeProperties {
	graph: Graph;
	node: Node;
	x: number;
	y: number;
}

export default class GraphNode extends React.Component<IGraphNodeProperties> {
	private computeCoordinates(): Array<number> {
		return [ this.props.x, this.props.y ];
	}

	public render(): JSX.Element {
		const coordinates = this.computeCoordinates();
		return <button style={{
			position: "absolute",
			top: coordinates[0],
			left: coordinates[1],
		}}>GRAPH NODE</button>;
	}
}