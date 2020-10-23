import React from "react";
import "./grid.png";
import "./Graph.css";

export default class Graph extends React.Component {
	private currentZoom: number = 1;
	private mouseDown: boolean = false;

	private initialGrabX: number = 0;
	private initialGrabY: number = 0;
	private xOffset: number = 0;
	private yOffset: number = 0;

	private onWheel(event: WheelEvent): void {
		event.preventDefault();

		if (event.deltaY > 0) {
			this.currentZoom -= 0.01;
		} else if(event.deltaY < 0) {
			this.currentZoom += 0.01;
		}

		// clamp the zooming
		this.currentZoom = this.currentZoom >= 5 ? 5 : this.currentZoom;
		this.currentZoom = this.currentZoom <= 0.2 ? 0.2 : this.currentZoom;

		const graph: HTMLElement = document.getElementById("graph") as HTMLElement;
		if (graph) {
			graph.style.transform = `translateX(${-this.xOffset}px) translateY(${-this.yOffset}px) scale(${this.currentZoom})`;
		}
	}

	private getMouseX(event: MouseEvent): number {
		return (window.Event) ? event.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
	}

	private getMouseY(event: MouseEvent): number {
		return (window.Event) ? event.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
	}

	private onMouseDown(event: MouseEvent): void {
		this.mouseDown = true;
		document.body.style.cursor = "grabbing";

		this.initialGrabX = this.getMouseX(event) + this.xOffset;
		this.initialGrabY = this.getMouseY(event) + this.yOffset;
	}

	private onMouseUp(): void {
		this.mouseDown = false;
		document.body.style.cursor = "auto";
	}

	private onMouseMove(event: MouseEvent): void {
		if (!this.mouseDown) return;

		const x: number = this.getMouseX(event);
		const y: number = this.getMouseY(event);

		this.xOffset = this.initialGrabX - x;
		this.yOffset = this.initialGrabY - y;

		const graph: HTMLElement = document.getElementById("graph") as HTMLElement;
		if (graph) {
			graph.style.transform = `translateX(${-this.xOffset}px) translateY(${-this.yOffset}px) scale(${this.currentZoom})`;
		}
	}

	public componentDidMount(): void {
		const body: HTMLElement = document.body;
		if (body) {
			body.onwheel = this.onWheel.bind(this);
			body.onmousedown = this.onMouseDown.bind(this);
			body.onmouseup = this.onMouseUp.bind(this);
			body.onmousemove = this.onMouseMove.bind(this);
		}
	}

	public render(): JSX.Element {
		return (<div id="graph">
			<canvas />
		</div>);
	}
}