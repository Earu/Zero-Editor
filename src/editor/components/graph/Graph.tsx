import React from "react";
import "./grid.png";
import "./Graph.css";
import GraphControls from "./GraphControls";
import Editor from "../Editor";
import { Guid } from "guid-typescript";
import Node from "../../nodes/Node";
import GraphNode from "./GraphNode";
import IPosition from "./IPosition";
import BaseGraphNodeProperty from "./GraphNodeProperties";
import GraphNodeOutput from "./GraphNodeOutput";
import NodeFactory from "../../nodes/NodeFactory";

const GRID_SIZE: number = 10000; // in px
const GRID_SIZE_HALF: number = 5000; // in px
const ZOOM_COEF: number = 0.02;
const ZOOM_MAX: number = 5;
const ZOOM_MIN: number = 0.2;
const MOVING_FREEDOM: number = 250; // in px

interface IGraphProperties {
	editor: Editor<NodeFactory>;
}

interface IGraphState {
	nodes: Array<Node>;
}

export default class Graph extends React.Component<IGraphProperties, IGraphState> {
	private DOMElementRef: React.RefObject<HTMLDivElement>;
	private _currentZoom: number;
	private mouseDown: boolean;

	private moveable: boolean;
	private initialGrabX: number;
	private initialGrabY: number;
	private _xOffset: number;
	private _yOffset: number;

	private _nodeTable: Map<Guid, Node>;
	private selectedGraphNodes: Map<Guid, GraphNode>;
	private _selectedGraphNodeIO: GraphNodeOutput<any> | BaseGraphNodeProperty<any> | null;

	private _canvas: HTMLCanvasElement | null;
	private _canvasContext: CanvasRenderingContext2D | null;

	private _mouseX: number;
	private _mouseY: number;

	constructor(props: IGraphProperties) {
		super(props);
		this.DOMElementRef = React.createRef();
		this._currentZoom = 1;
		this.mouseDown = false;

		this.moveable = true;
		this.initialGrabX = 0;
		this.initialGrabY = 0;
		this._xOffset = 0;
		this._yOffset = 0;

		this.selectedGraphNodes = new Map<Guid, GraphNode>();
		this._selectedGraphNodeIO = null;

		this._canvas = null;
		this._canvasContext = null;

		this._mouseX = 0;
		this._mouseY = 0;

		this.props.editor.graph = this;
		this._nodeTable = new Map<Guid, Node>();
		this.state = { nodes: [] };
	}

	public get editor(): Editor<NodeFactory> {
		return this.props.editor;
	}

	public get DOMElement(): HTMLDivElement | null {
		return this.DOMElementRef.current;
	}

	public get currentZoom(): number {
		return this._currentZoom;
	}

	public get xOffset(): number {
		return this._xOffset;
	}

	public get yOffset(): number {
		return this._yOffset;
	}

	public get size(): number {
		return GRID_SIZE;
	}

	public get nodeTable(): Map<Guid, Node> {
		return this._nodeTable;
	}

	public set selectedGraphNodeIO(IO: GraphNodeOutput<any> | BaseGraphNodeProperty<any> | null) {
		this._selectedGraphNodeIO = IO;
	}

	public get selectedGraphNodeIO(): GraphNodeOutput<any> | BaseGraphNodeProperty<any> | null {
		return this._selectedGraphNodeIO;
	}

	public selectGraphNode(graphNode: GraphNode): void {
		this.selectedGraphNodes.set(graphNode.props.node.id, graphNode);
		graphNode.setSelected(true);
	}

	public unselectGraphNode(graphNode: GraphNode): void {
		this.selectedGraphNodes.delete(graphNode.props.node.id);
		graphNode.setSelected(false);
	}

	public isGraphNodeSelected(graphNode: GraphNode): boolean {
		return this.selectedGraphNodes.has(graphNode.props.node.id);
	}

	public pageToGraphCoordinates(x: number, y: number): IPosition {
		const screenWidth: number = window.innerWidth;
		const screenHeight: number = window.innerHeight;

		const currentZoom: number = this._currentZoom;
		const xOffset: number = (this._xOffset - screenWidth / 2) / currentZoom;
		const yOffset: number = (this._yOffset - screenHeight / 2) / currentZoom;
		const halfSize: number = this.size / 2;

		return {
			x: halfSize + xOffset + x / currentZoom,
			y: halfSize + yOffset + y / currentZoom,
		};
	}

	public graphToPageCoordinates(x: number, y: number): IPosition {
		const screenWidth: number = window.innerWidth;
		const screenHeight: number = window.innerHeight;

		const currentZoom: number = this._currentZoom;
		const xOffset: number = (this._xOffset - screenWidth / 2) / currentZoom;
		const yOffset: number = (this._yOffset - screenHeight / 2) / currentZoom;
		const halfSize: number = this.size / 2;

		return {
			x: (x - halfSize - xOffset) * currentZoom,
			y: (y - halfSize - yOffset) * currentZoom,
		};
	}

	private updateTransform(): void {
		const graph = this.DOMElementRef.current;
		if (graph) {
			graph.style.transform = `translateX(${-this._xOffset}px) translateY(${-this._yOffset}px) scale(${this._currentZoom})`;
		}

		const controls: HTMLElement = document.getElementById("graph-controls") as HTMLElement;
		if (!controls) return;

		const inputs = controls.getElementsByTagName("input");
		const inputX: HTMLInputElement = inputs[0];
		const inputY: HTMLInputElement = inputs[1];
		const inputZ: HTMLInputElement = inputs[2];

		inputX.value = (this._xOffset / this._currentZoom).toFixed(0);
		inputY.value = (this._yOffset / this._currentZoom).toFixed(0);
		inputZ.value = (this._currentZoom * 10).toFixed(2);
	}

	public set isMoveable(moveable: boolean) {
		this.moveable = moveable;
	}

	public get isMoveable(): boolean {
		return this.moveable;
	}

	public setTransform(xOffset: number | null = null, yOffset: number | null = null, scale: number | null = null) {
		if (!this.moveable) return;

		const scaleCoefTopLeft: number = (this._currentZoom * GRID_SIZE_HALF) + MOVING_FREEDOM;

		if (xOffset != null) {
			const scaleCoefRight: number = (this._currentZoom * GRID_SIZE_HALF) + MOVING_FREEDOM;

			if (xOffset > scaleCoefRight) {
				this._xOffset = scaleCoefRight;
			} else if (xOffset < -scaleCoefTopLeft) {
				this._xOffset = -scaleCoefTopLeft;
			} else {
				this._xOffset = xOffset;
			}
		}

		if (yOffset != null) {
			const scaleCoefBottom: number = (this._currentZoom * GRID_SIZE_HALF) + MOVING_FREEDOM;

			if (yOffset > scaleCoefBottom) {
				this._yOffset = scaleCoefBottom;
			} else if (yOffset < -scaleCoefTopLeft) {
				this._yOffset = -scaleCoefTopLeft;
			} else {
				this._yOffset = yOffset;
			}
		}

		if (scale != null) {
			this._currentZoom = scale >= ZOOM_MAX ? ZOOM_MAX : scale;
		}

		this.updateTransform();
	}

	public addNode(node: Node): void {
		this._nodeTable.set(node.id, node);
		this.state.nodes.push(node);
		this.updateNodes();
	}

	public removeNode(id: Guid): void {
		const nodes = this.state.nodes.filter(node => node.id !== id);
		this._nodeTable.delete(id);

		this.setState({ nodes });
		this.updateTransform();
	}

	public getNode(id: Guid): Node | undefined {
		return this._nodeTable.get(id);
	}

	public updateNodes(): void {
		this.setState({ nodes: this.state.nodes });
		this.updateTransform();
	}

	public reset(): void {
		this.setState({ nodes: [] });
		this.setTransform(0, 0, 1);
	}

	private backplaneMouseUp(): void {
		if (!this._selectedGraphNodeIO) return;
		this._selectedGraphNodeIO = null;
		this.moveable = true;
	}

	private graphMouseLeave(): void {
		if (!this._selectedGraphNodeIO) return;
		this._selectedGraphNodeIO = null;
		this.moveable = true;
	}

	private onWheel(event: WheelEvent): void {
		event.preventDefault();

		if (event.deltaY > 0) {
			this._currentZoom -= ZOOM_COEF;
		} else if(event.deltaY < 0) {
			this._currentZoom += ZOOM_COEF;
		}

		// clamp the zooming
		this._currentZoom = this._currentZoom >= ZOOM_MAX ? ZOOM_MAX : this._currentZoom;
		this._currentZoom = this._currentZoom <= ZOOM_MIN ? ZOOM_MIN : this._currentZoom;

		this.updateTransform();

		for (const [, graphNode] of this.selectedGraphNodes) {
			graphNode.updatePosition(event);
		}
	}

	private getMouseX(event: MouseEvent): number {
		return (window.Event) ? event.pageX : event.clientX +
			(document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
	}

	private getMouseY(event: MouseEvent): number {
		return (window.Event) ? event.pageY : event.clientY +
			(document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
	}

	private onMouseDown(event: MouseEvent): void {
		this.mouseDown = true;
		document.body.style.cursor = "grabbing";

		this.initialGrabX = this.getMouseX(event) + this._xOffset;
		this.initialGrabY = this.getMouseY(event) + this._yOffset;
	}

	private onMouseUp(): void {
		this.mouseDown = false;
		document.body.style.cursor = "auto";
	}

	private onMouseMove(event: MouseEvent): void {
		this._mouseX = this.getMouseX(event);
		this._mouseY = this.getMouseY(event);

		if (!this.mouseDown) return;

		const x: number = this.getMouseX(event);
		const y: number = this.getMouseY(event);
		this.setTransform(this.initialGrabX - x, this.initialGrabY - y, this._currentZoom);
	}

	public componentDidMount(): void {
		const graph = this.DOMElementRef.current;
		if (!graph) return;

		if (graph) {
			graph.addEventListener("wheel", this.onWheel.bind(this));
			graph.addEventListener("mousedown", this.onMouseDown.bind(this));
			graph.addEventListener("mouseup", this.onMouseUp.bind(this));
			graph.addEventListener("mouseleave", this.onMouseUp.bind(this));
			graph.addEventListener("mousemove", this.onMouseMove.bind(this));
		}

		this._canvas = document.getElementById("canvas") as HTMLCanvasElement;
		if (this._canvas) {
			this._canvasContext = this._canvas.getContext("2d");
			window.requestAnimationFrame(this.renderNodesCanvas.bind(this));
		}
	}

	private renderNodesCanvas(): void {
		if (!this._canvas) return;
		if (!this._canvasContext) return;

		const canvas = this._canvas;
		const context = this._canvasContext;

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		context.clearRect(0, 0, canvas.width, canvas.height);
		context.strokeStyle = "#eeeeee";
		context.lineWidth = 3 * this._currentZoom;

		if (this._selectedGraphNodeIO) {
			const selector: HTMLElement | null = (this._selectedGraphNodeIO instanceof BaseGraphNodeProperty) ?
				this._selectedGraphNodeIO.props.property.userSelector :
				this._selectedGraphNodeIO.props.output.userSelector;

			if (selector) {
				const rect = selector.getBoundingClientRect();
				const x = (rect.left + rect.right) / 2, y = (rect.top + rect.bottom) / 2;
				context.beginPath();
				context.moveTo(x, y);
				context.lineTo(this._mouseX, this._mouseY);
				context.stroke();
			}
		}

		for (const node of this.state.nodes) {
			for (const [, property] of node.properties) {
				if (property.linkedOutput && property.userSelector && property.linkedOutput.userSelector) {

					const propertyRect = property.userSelector.getBoundingClientRect();
					const outputRect = property.linkedOutput.userSelector.getBoundingClientRect();

					const propertyX = (propertyRect.left + propertyRect.right) / 2;
					const propertyY = (propertyRect.top + propertyRect.bottom) / 2;
					const outputX = (outputRect.left + outputRect.right) / 2;
					const outputY = (outputRect.top + outputRect.bottom) / 2;

					const bezierOffset = Math.abs(propertyX - outputX) / (outputX < propertyX ? 2 : 1);

					context.beginPath();
					context.moveTo(propertyX, propertyY);
					context.bezierCurveTo(propertyX - bezierOffset, propertyY, outputX + bezierOffset, outputY, outputX, outputY);
					context.stroke();
				}
			}
		}

		window.requestAnimationFrame(this.renderNodesCanvas.bind(this));
	}

	private renderNodes(): Array<JSX.Element> {
		const elements: Array<JSX.Element> = [];
		for(const node of this.state.nodes) {
			elements.push(<GraphNode key={node.id.toString()} graph={this} node={node} />);
		}

		return elements;
	}

	public render(): JSX.Element {
		return (<div>
			<GraphControls graph={this}/>
			<div id="graph" style={{
				width: GRID_SIZE, height: GRID_SIZE,
				left: -(GRID_SIZE_HALF - (window.innerWidth / 2)), top: -(GRID_SIZE_HALF - (window.innerHeight / 2))
			}} onMouseLeave={this.graphMouseLeave.bind(this)} ref={this.DOMElementRef}>
				<div id="backplane" onMouseUp={this.backplaneMouseUp.bind(this)} />
				{this.renderNodes()}
			</div>
			<canvas id="canvas" />
		</div>);
	}
}