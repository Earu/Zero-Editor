import { Guid } from "guid-typescript";
import React from "react";
import ReactDOM from "react-dom";
import "./NodeMenuItem.css";

interface INodeMenuItemProperties {
	name: string;
	color: string;
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

		ReactDOM.render(<NodeMenuItem name={this.props.name} color={this.props.color} />, dragParent);

		return dragParent;
	}

	private onItemDropped(pageX: number, pageY: number): void {
		console.log(pageX, pageY);
	}

	private onMouseDown(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
		const dragItem = this.createDragItem();

		document.body.append(dragItem);

		// move the text along the coordinates (pageX, pageY)
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