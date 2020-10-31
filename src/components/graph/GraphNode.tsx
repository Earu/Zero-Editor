import React from "react";
import { Node } from "../../nodes/Node";
import Graph from "./Graph";
import "./GraphNode.css";
import { GraphNodeAngleProperty, GraphNodeBooleanProperty as GraphNodeToggleProperty, GraphNodeColorProperty, GraphNodeNumberProperty, GraphNodeVectorProperty } from "./GraphNodeProperties";

interface IGraphNodeProperties {
	graph: Graph;
	node: Node;
}

const NODE_HEADER_HEIGHT: number = 21;

export default class GraphNode extends React.Component<IGraphNodeProperties> {
	private offsetX: number = 0;
	private offsetY: number = 0;
	private offsetZoom: number = 0;

	private onMouseDown(event: React.MouseEvent): void {
		const x = this.props.node.x, y = this.props.node.y
		const screenPos = this.props.graph.graphToPageCoordinates(x, y);
		const zoom = this.props.graph.currentZoom;
		this.offsetX = event.pageX - screenPos.x;
		this.offsetY = event.pageY - screenPos.y;
		this.offsetZoom = zoom;

		this.props.graph.selectedGraphNode = this;
		this.props.graph.isMoveable = false;
	}

	private onMouseUp(): void {
		if (this.props.graph.selectedGraphNode !== this) return;

		this.props.graph.selectedGraphNode = null;
		this.props.graph.isMoveable = true;
	}

	private onMouseMove(event: MouseEvent): void {
		if (this.props.graph.selectedGraphNode !== this) return;

		this.updatePosition(event);
	}

	private onClose(): void {
		this.props.graph.removeNode(this.props.node.id);
	}

	public updatePosition(event: MouseEvent): void {
		const zoom = 1 + (this.props.graph.currentZoom - this.offsetZoom) / this.offsetZoom;
		const graphPos = this.props.graph.pageToGraphCoordinates(event.pageX - this.offsetX * zoom, event.pageY - this.offsetY * zoom);

		this.props.node.setCoordinates(graphPos.x, graphPos.y);
		this.props.graph.updateNodes();
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

	private renderProperties(): Array<JSX.Element> {
		const elements: Array<JSX.Element> = [];
		for (const [propertyName, property ] of this.props.node.properties.entries()) {
			const elementId: string = `${this.props.node.id}_${propertyName}`;
			switch (property.typeName) {
				case "Toggle":
					elements.push(<GraphNodeToggleProperty id={elementId} key={elementId} node={this.props.node} name={propertyName} value={property.getValue()}/>);
					break;
				case "Number":
					elements.push(<GraphNodeNumberProperty id={elementId} key={elementId} node={this.props.node} name={propertyName} value={property.getValue()}/>);
					break;
				case "Vector":
					elements.push(<GraphNodeVectorProperty id={elementId} key={elementId} node={this.props.node} name={propertyName} value={property.getValue()}/>);
					break
				case "Angle":
					elements.push(<GraphNodeAngleProperty id={elementId} key={elementId} node={this.props.node} name={propertyName} value={property.getValue()}/>);
					break;
				case "Color":
					elements.push(<GraphNodeColorProperty id={elementId} key={elementId} node={this.props.node} name={propertyName} value={property.getValue()}/>);
					break;
				default:
					break;
			}
		}

		return elements;
	}

	public render(): JSX.Element {
		return (<div className="graph-node" style={{
					position: "absolute",
					left: this.props.node.x,
					top: this.props.node.y,
					width: this.props.node.width}}>
				<div style={{
						backgroundImage: `linear-gradient(to right, ${this.props.node.color}, #111)`,
						height: NODE_HEADER_HEIGHT,
						cursor: "move"
					}}
					onMouseDown={this.onMouseDown.bind(this)}
					onMouseUp={this.onMouseUp.bind(this)}
					className="header">
					<div>{this.props.node.name}</div>
					<button onClick={this.onClose.bind(this)}>x</button>
				</div>
			<div className="content">
				{this.renderProperties()}
			</div>
		</div>);
	}
}