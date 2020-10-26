import React from "react";
import Node from "../../nodes/Node";
import Graph from "./Graph";
import "./GraphNode.css";

interface IGraphNodeProperties {
	graph: Graph;
	node: Node;
}

const NODE_HEADER_HEIGHT: number = 21;

export default class GraphNode extends React.Component<IGraphNodeProperties> {
	private mouseDown: boolean = false;

	private onMouseDown(): void {
		this.props.graph.isMoveable = false;
		this.mouseDown = true;
	}

	private onMouseUp(): void {
		this.mouseDown = false;
		this.props.graph.isMoveable = true;
	}

	private onMouseMove({ movementX, movementY }: MouseEvent): void {
		if (!this.mouseDown) return;

		const x = this.props.node.getX(), y = this.props.node.getY()
		this.props.node.setCoordinates(x + movementX, y + movementY);
		this.props.graph.updateNodes();
	}

	private onClose(): void {
		this.props.graph.removeNode(this.props.node.getId());
	}

	public componentDidMount(): void {
		const graph: HTMLElement = document.getElementById("graph") as HTMLElement;
		if (graph) {
			graph.addEventListener("mousemove", this.onMouseMove.bind(this));
		}
	}

	public componentWillUnmount(): void {
		const graph: HTMLElement = document.getElementById("graph") as HTMLElement;
		if (graph) {
			graph.removeEventListener("mousemove", this.onMouseMove);
		}
	}

	public render(): JSX.Element {
		return (<div className="graph-node"
			style={{
				position: "absolute",
				left: this.props.node.getX(),
				top: this.props.node.getY(),
				width: this.props.node.getWidth(),
			}}>
				<div
					style={{
						backgroundImage: `linear-gradient(to right, ${this.props.node.getColor()}, #111)`,
						height: NODE_HEADER_HEIGHT,
						cursor: "move"
					}}
					onMouseDown={this.onMouseDown.bind(this)}
					onMouseUp={this.onMouseUp.bind(this)}
					className="header"
				>
					<div>{this.props.node.getName()}</div>
					<button onClick={this.onClose.bind(this)}>x</button>
				</div>
			<div className="content"></div>
		</div>);
	}
}