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

	private getMouseX(event: MouseEvent): number {
		return (window.Event) ? event.pageX : event.clientX +
			(document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
	}

	private getMouseY(event: MouseEvent): number {
		return (window.Event) ? event.pageY : event.clientY +
			(document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
	}

	private onMouseDown(): void {
		this.props.graph.isMoveable = false;
		this.mouseDown = true;
		document.body.style.cursor = "move";
	}

	private onMouseUp(): void {
		this.mouseDown = false;
		document.body.style.cursor = "auto";
		this.props.graph.isMoveable = true;
	}

	private onMouseMove(event: MouseEvent): void {
		if (!this.mouseDown) return;

		this.props.node.computeCoordinates(this.props.graph,
			this.getMouseX(event) - (this.props.node.getWidth() / 2),
			this.getMouseY(event) - (NODE_HEADER_HEIGHT / 2));
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
			onMouseDown={this.onMouseDown.bind(this)}
			onMouseUp={this.onMouseUp.bind(this)}
			style={{
				position: "absolute",
				left: this.props.node.getX(),
				top: this.props.node.getY(),
				width: this.props.node.getWidth(),
			}}>
				<div style={{
					backgroundImage: `linear-gradient(to right, ${this.props.node.getColor()}, #111)`,
					height: NODE_HEADER_HEIGHT
				}} className="header">
					<div>{this.props.node.getName()}</div>
					<button onClick={this.onClose.bind(this)}>x</button>
				</div>
			<div className="content"></div>
		</div>);
	}
}