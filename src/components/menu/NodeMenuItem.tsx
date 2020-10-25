import { Guid } from "guid-typescript";
import React from "react";
import ReactDOM from "react-dom";
import Angle from "../../gmodTypes/Angle";
import Color from "../../gmodTypes/Color";
import Vector from "../../gmodTypes/Vector";
import { AngleNode, ColorNode, NumberNode, ToggleNode, VectorNode } from "../../nodes/BasicNode";
import Node from "../../nodes/Node";
import Editor from "../Editor";
import GraphNode from "../graph/GraphNode";
import "./NodeMenuItem.css";

interface INodeMenuItemProperties {
	name: string;
	color: string;
	editor: Editor;
}

export default class NodeMenuItem extends React.Component<INodeMenuItemProperties> {
	private createDragItem(): HTMLElement {
		const dragId: string = Guid.toString();
		const dragParent = document.createElement("div");
		dragParent.id = dragId;
		dragParent.style.position = "absolute";
		dragParent.style.zIndex = "9995"; // 9999 is the navbar, 9998 is the node menu
		dragParent.style.width = "100px";
		dragParent.style.height = "25px";

		ReactDOM.render(<NodeMenuItem name={this.props.name} color={this.props.color} editor={this.props.editor} />, dragParent);

		return dragParent;
	}

	private onItemDropped(pageX: number, pageY: number): void {
		let node: Node | null;
		switch (this.props.name) {
			case "Number":
				node = new NumberNode(this.props.editor, 0);
				break;
			case "Toggle":
				node = new ToggleNode(this.props.editor, false);
				break;
			case "Angle":
				node = new AngleNode(this.props.editor, new Angle(0, 0, 0));
				break;
			case "Vector":
				node = new VectorNode(this.props.editor, new Vector(0, 0, 0));
				break;
			case "Color":
				node = new ColorNode(this.props.editor, new Color(255, 255, 255, 255));
				break;
			default:
				node = null;
				break;
		}

		// not implemented ?
		if (node === null) return;

		const graphElement: HTMLElement = document.getElementById("graph") as HTMLElement;
		if (!graphElement) return;

		const graph = this.props.editor.graph;
		if (!graph) return;

		this.props.editor.nodeTable.set(node.getId(), node);
		// this will generate a warning by React in debug mode
		// but React's solution is to call setState on our Graph component
		// this would re-render the whole graph, and we do NOT want that
		ReactDOM.render(<GraphNode graph={graph} node={node} x={pageX} y={pageY} />, graphElement);
	}

	private onMouseDown(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
		const dragItem: HTMLElement = this.createDragItem();
		document.body.append(dragItem);

		// move the item along the coordinates (pageX, pageY)
		const moveAt = (pageX: number, pageY: number) => {
			dragItem.style.left = `${pageX - 50}px`;
			dragItem.style.top = `${pageY - 12.5}px`;
		}

		moveAt(event.pageX, event.pageY);
		const onMouseMove = (event: MouseEvent) => {
			moveAt(event.pageX, event.pageY);
		}

		const stopMove = (stopEvent: MouseEvent) => {
			document.removeEventListener("mousemove", onMouseMove);
			dragItem.onmouseup = null;
			dragItem.remove();
			this.onItemDropped(stopEvent.pageX, stopEvent.pageY);
		}

		document.addEventListener("mousemove", onMouseMove);
		dragItem.onmouseup = stopMove;
		dragItem.onmouseleave = stopMove;
	}

	public render(): JSX.Element {
		return (<div className="node-menu-item"
			onMouseDown={this.onMouseDown.bind(this)}
			style={{ backgroundImage: `linear-gradient(to right, ${this.props.color}, #111)` }}>
			<div>{this.props.name}</div>
		</div>);
	}
}