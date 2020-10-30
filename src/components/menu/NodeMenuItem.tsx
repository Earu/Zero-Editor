import { Guid } from "guid-typescript";
import React from "react";
import ReactDOM from "react-dom";
import Node from "../../nodes/Node";
import Editor from "../Editor";
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
		const node: Node | null = this.props.editor.factory.CreateNode(this.props.name);

		// not implemented ?
		if (node === null) return;

		// the graph can be null if its ran too early
		const graph = this.props.editor.graph;
		if (graph == null) return;

		const { x, y } = graph.pageToGraphCoordinates(pageX, pageY);
		node.setCoordinates(x, y);
		graph.addNode(node);
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
			if (stopEvent.shiftKey) {
				// multi drops
				this.onItemDropped(stopEvent.pageX, stopEvent.pageY);
				return;
			}

			document.removeEventListener("mousemove", onMouseMove);

			dragItem.onmouseup = null;
			dragItem.remove();
			this.onItemDropped(stopEvent.pageX, stopEvent.pageY);
		}

		const stopMultiDrop = (event: KeyboardEvent) => {
			// multiple checks because chromium is being dumb
			if (!event.shiftKey || event.key === "Shift" || event.which === 16) {
				document.removeEventListener("keyup", stopMultiDrop);

				dragItem.onmouseup = null;
				dragItem.remove();
			}
		}

		document.addEventListener("mousemove", onMouseMove);
		document.addEventListener("keyup", stopMultiDrop);
		dragItem.onmouseup = stopMove;

		// a hack so the drag n drop doesn't die when the user leaves the editor
		const onMouseOut = (event: MouseEvent) => {
			const mouseX = event.pageX;
			const mouseY = event.pageY;
			if ((mouseY >= 0 && mouseY <= window.innerHeight) && (mouseX >= 0 && mouseX <= window.innerWidth))
				return;

			stopMove(event);
			document.removeEventListener("mouseout", onMouseOut)
		}

		document.addEventListener("mouseout", onMouseOut);
	}

	public render(): JSX.Element {
		return (<div className="node-menu-item" style={{ backgroundImage: `linear-gradient(to right, ${this.props.color}, #111)` }}>
			<div onMouseDown={this.onMouseDown.bind(this)}>{this.props.name}</div>
		</div>);
	}
}