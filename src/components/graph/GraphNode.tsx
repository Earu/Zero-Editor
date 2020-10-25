import React from "react";
import Node from "../../nodes/Node";
import Graph from "./Graph";
import "./GraphNode.css";

interface IGraphNodeProperties {
	graph: Graph;
	node: Node;
}

export default class GraphNode extends React.Component<IGraphNodeProperties> {

	public render(): JSX.Element {
		return <div className="graph-node" style={{
			position: "absolute",
			left: this.props.node.getX(),
			top: this.props.node.getY(),
		}}>
			<div style={{ backgroundImage: `linear-gradient(to right, ${this.props.node.getColor()}, #111)` }} className="header" >
				<div>{this.props.node.getName()}</div>
			</div>
			<div className="content"></div>
		</div>;
	}
}