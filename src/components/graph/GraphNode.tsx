import React from "react";
import Node from "../../nodes/Node";
import Graph from "./Graph";
import "./GraphNode.css";
import { GraphNodeAngleProperty, GraphNodeBooleanProperty, GraphNodeColorProperty, GraphNodeNumberProperty, GraphNodeVectorProperty } from "./GraphNodeProperties";

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
		const x = this.props.node.getX(), y = this.props.node.getY()
		const screenPos = this.props.graph.graphToPageCoordinates(x, y);
		const zoom = this.props.graph.getCurrentZoom();
		this.offsetX = event.pageX - screenPos.x;
		this.offsetY = event.pageY - screenPos.y;
		this.offsetZoom = zoom;

		this.props.graph.setSelectedGraphNode(this);
		this.props.graph.isMoveable = false;
	}

	private onMouseUp(): void {
		if (this.props.graph.getSelectedGraphNode() !== this) return;

		this.props.graph.setSelectedGraphNode(null);
		this.props.graph.isMoveable = true;
	}

	private onMouseMove(event: MouseEvent): void {
		if (this.props.graph.getSelectedGraphNode() !== this) return;

		this.updatePosition(event);
	}

	private onClose(): void {
		this.props.graph.removeNode(this.props.node.getId());
	}

	public updatePosition(event: MouseEvent): void {
		const zoom = 1 + (this.props.graph.getCurrentZoom() - this.offsetZoom) / this.offsetZoom;
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

		console.debug(this.props.node.properties);
		for (const [propertyName, propertyValue] of this.props.node.properties.entries()) {
			const elementId: string = `${this.props.node.getId()}_${propertyName}`;

			console.debug(propertyValue.constructor.name);

			switch (propertyValue.constructor.name) {
				case "Boolean":
					elements.push(<GraphNodeBooleanProperty id={elementId} key={elementId} name={propertyName} value={propertyValue}/>);
					break;
				case "Number":
					elements.push(<GraphNodeNumberProperty id={elementId} key={elementId} name={propertyName} value={propertyValue}/>);
					break;
				case "Vector":
					elements.push(<GraphNodeVectorProperty id={elementId} key={elementId} name={propertyName} value={propertyValue}/>);
					break
				case "Angle":
					elements.push(<GraphNodeAngleProperty id={elementId} key={elementId} name={propertyName} value={propertyValue}/>);
					break;
				case "Color":
					elements.push(<GraphNodeColorProperty id={elementId} key={elementId} name={propertyName} value={propertyValue}/>);
					break;
				default:
					break;
			}

			//elements.push(<input key={propertyName}  placeholder={propertyName} value={propertyValue} />);
		}

		return elements;
	}

	public render(): JSX.Element {
		return (<div className="graph-node" style={{
					position: "absolute",
					left: this.props.node.getX(),
					top: this.props.node.getY(),
					width: this.props.node.getWidth()}}>
				<div style={{
						backgroundImage: `linear-gradient(to right, ${this.props.node.getColor()}, #111)`,
						height: NODE_HEADER_HEIGHT,
						cursor: "move"
					}}
					onMouseDown={this.onMouseDown.bind(this)}
					onMouseUp={this.onMouseUp.bind(this)}
					className="header">
					<div>{this.props.node.getName()}</div>
					<button onClick={this.onClose.bind(this)}>x</button>
				</div>
			<div className="content">
				{this.renderProperties()}
			</div>
		</div>);
	}
}