import React from "react";
import "./grid.png";
import "./Graph.css";

const GRID_SIZE: number = 10000; // in px
const GRID_SIZE_HALF: number = 5000; // in px
const ZOOM_COEF: number = 0.01;
const ZOOM_MAX: number = 5;
const ZOOM_MIN: number = 0.2;
const MOVING_FREEDOM: number = 250; // in px

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
			this.currentZoom -= ZOOM_COEF;
		} else if(event.deltaY < 0) {
			this.currentZoom += ZOOM_COEF;
		}

		// clamp the zooming
		this.currentZoom = this.currentZoom >= ZOOM_MAX ? ZOOM_MAX : this.currentZoom;
		this.currentZoom = this.currentZoom <= ZOOM_MIN ? ZOOM_MIN : this.currentZoom;

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

		const scaleCoefTopLeft: number = (this.currentZoom * GRID_SIZE_HALF) + MOVING_FREEDOM;
		const scaleCoefBottom: number = (this.currentZoom * (GRID_SIZE_HALF - window.innerHeight)) + MOVING_FREEDOM;
		const scaleCoefRight: number = (this.currentZoom * (GRID_SIZE_HALF - window.innerWidth)) + MOVING_FREEDOM;

		// clamp the movement so we cant go past the grid
		this.xOffset = this.initialGrabX - x;
		if (this.xOffset > scaleCoefRight) {
			this.xOffset = scaleCoefRight;
		} else if (this.xOffset < -scaleCoefTopLeft) {
			this.xOffset = -scaleCoefTopLeft;
		}

		this.yOffset = this.initialGrabY - y;
		if (this.yOffset > scaleCoefBottom) {
			this.yOffset = scaleCoefBottom;
		} else if (this.yOffset < -scaleCoefTopLeft) {
			this.yOffset = -scaleCoefTopLeft;
		}

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
		return (<div id="graph" style={{
			width: GRID_SIZE, height: GRID_SIZE,
			left: -GRID_SIZE_HALF, top: -GRID_SIZE_HALF
		}}>
			<canvas />
		</div>);
	}
}