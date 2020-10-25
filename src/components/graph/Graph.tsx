import React from "react";
import "./grid.png";
import "./Graph.css";
import GraphControls from "./GraphControls";
import Editor from "../Editor";
import { Guid } from "guid-typescript";
import Node from "../../nodes/Node";
import GraphNode from "./GraphNode";

const GRID_SIZE: number = 10000; // in px
const GRID_SIZE_HALF: number = 5000; // in px
const ZOOM_COEF: number = 0.01;
const ZOOM_MAX: number = 5;
const ZOOM_MIN: number = 0.2;
const MOVING_FREEDOM: number = 250; // in px

interface IGraphProperties {
	editor: Editor;
}

interface IGraphState {
	nodes: Array<Node>;
}

export default class Graph extends React.Component<IGraphProperties, IGraphState> {
	private currentZoom: number = 1;
	private mouseDown: boolean = false;

	private initialGrabX: number = 0;
	private initialGrabY: number = 0;
	private xOffset: number = 0;
	private yOffset: number = 0;

	private nodeTable: Map<Guid, Node>;

	constructor(props: IGraphProperties) {
		super(props);
		this.props.editor.graph = this;
		this.nodeTable = new Map<Guid, Node>();
		this.state = { nodes: [] };
	}

	public getCurrentZoom(): number {
		return this.currentZoom;
	}

	public getXOffset(): number {
		return this.xOffset;
	}

	public getYOffset(): number {
		return this.yOffset;
	}

	public getSize(): number {
		return GRID_SIZE;
	}

	private updateTransform(): void {
		const graph: HTMLElement = document.getElementById("graph") as HTMLElement;
		if (graph) {
			graph.style.transform = `translateX(${-this.xOffset}px) translateY(${-this.yOffset}px) scale(${this.currentZoom})`;
		}

		const controls: HTMLElement = document.getElementById("graph-controls") as HTMLElement;
		if (!controls) return;

		const inputs = controls.getElementsByTagName("input");
		const inputX: HTMLInputElement = inputs[0];
		const inputY: HTMLInputElement = inputs[1];
		const inputZ: HTMLInputElement = inputs[2];

		inputX.value = (this.xOffset / this.currentZoom).toFixed(0);
		inputY.value = (this.yOffset / this.currentZoom).toFixed(0);
		inputZ.value = (this.currentZoom * 10).toFixed(2);
	}

	public setTransform(xOffset: number | null = null, yOffset: number | null = null, scale: number | null = null) {
		const scaleCoefTopLeft: number = (this.currentZoom * GRID_SIZE_HALF) + MOVING_FREEDOM;

		if (xOffset != null) {
			const scaleCoefRight: number = (this.currentZoom * GRID_SIZE_HALF) + MOVING_FREEDOM;

			if (xOffset > scaleCoefRight) {
				this.xOffset = scaleCoefRight;
			} else if (xOffset < -scaleCoefTopLeft) {
				this.xOffset = -scaleCoefTopLeft;
			} else {
				this.xOffset = xOffset;
			}
		}

		if (yOffset != null) {
			const scaleCoefBottom: number = (this.currentZoom * GRID_SIZE_HALF) + MOVING_FREEDOM;

			if (yOffset > scaleCoefBottom) {
				this.yOffset = scaleCoefBottom;
			} else if (yOffset < -scaleCoefTopLeft) {
				this.yOffset = -scaleCoefTopLeft;
			} else {
				this.yOffset = yOffset;
			}
		}

		if (scale != null) {
			this.currentZoom = scale >= ZOOM_MAX ? ZOOM_MAX : scale;
		}

		this.updateTransform();
	}

	public addNode(node: Node): void {
		this.nodeTable.set(node.getId(), node);
		this.state.nodes.push(node);
		this.setState({ nodes: this.state.nodes });
		this.updateTransform();
	}

	public getNode(id: Guid): Node | undefined {
		return this.nodeTable.get(id);
	}

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

		this.updateTransform();
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
		this.setTransform(this.initialGrabX - x, this.initialGrabY - y, this.currentZoom);
	}

	public componentDidMount(): void {
		const graph: HTMLElement = document.getElementById("graph") as HTMLElement;
		if (graph) {
			graph.onwheel = this.onWheel.bind(this);
			graph.onmousedown = this.onMouseDown.bind(this);
			graph.onmouseup = this.onMouseUp.bind(this);
			graph.onmouseleave = this.onMouseUp.bind(this);
			graph.onmousemove = this.onMouseMove.bind(this);
		}
	}

	private renderNodes(): Array<JSX.Element> {
		const ret: Array<JSX.Element> = [];
		for(const node of this.state.nodes) {
			ret.push(<GraphNode key={node.getId().toString()} graph={this} node={node} />);
		}

		return ret;
	}

	public render(): JSX.Element {
		return (<div>
			<GraphControls graph={this}/>
			<div id="graph" style={{
				width: GRID_SIZE, height: GRID_SIZE,
				left: -(GRID_SIZE_HALF - (window.innerWidth / 2)), top: -(GRID_SIZE_HALF - (window.innerHeight / 2))
			}}>
				{this.renderNodes()}
				<canvas />
			</div>
		</div>);
	}
}