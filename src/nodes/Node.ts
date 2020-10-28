import { Guid } from "guid-typescript";
import Editor from "../components/Editor";
import Graph from "../components/graph/Graph";

const DEFAULT_NODE_WIDTH: number = 125;

interface INode {
	getId(): Guid;
	setId(id: Guid): void;
	getEditor(editor: Editor): void;
	getX(): number;
	getY(): number;
	getWidth(): number;
	getName(): string;
	getColor(): string;
	properties: Map<string, any>;
}

interface IPosition {
	x: number;
	y: number
}

export default class Node implements INode {
	private _editor: Editor;
	private _id: Guid;

	private x: number;
	private y: number;
	private width: number;
	private name: string;
	private color: string;
	private _properties: Map<string, any>;

	constructor(editor: Editor, name: string, color: string) {
		this._id = Guid.create();
		this._editor = editor;
		this.x = 0;
		this.y = 0;
		this.width = DEFAULT_NODE_WIDTH;
		this.name = name;
		this.color = color;

		this._properties = new Map<string, any>();
		this._properties.set("enabled", true);
		this._properties.set("nsfw", false);
	}

	public get properties(): Map<string, any> {
		return this._properties;
	}

	public computeCoordinates(graph: Graph, pageX: number, pageY: number): IPosition {
		const screenWidth: number = window.innerWidth;
		const screenHeight: number = window.innerHeight;

		const currentZoom: number = graph.getCurrentZoom();
		const xOffset: number = graph.getXOffset() / currentZoom - screenWidth / 2 / currentZoom;
		const yOffset: number = graph.getYOffset() / currentZoom - screenHeight / 2 / currentZoom;
		const halfSize: number = graph.getSize() / 2;

		return {
			x: halfSize + xOffset + pageX / currentZoom,
			y: halfSize + yOffset + pageY / currentZoom,
		};
	}

	public setCoordinates(x: number, y: number): void {
		this.x = x;
		this.y = y;
	}

	public getId(): Guid {
		return this._id;
	}

	public setId(id: Guid): void {
		this._id = id;
	}

	public getEditor(): Editor {
		return this._editor;
	}

	public getX(): number {
		return this.x;
	}

	public getY(): number {
		return this.y;
	}

	public getWidth(): number {
		return this.width;
	}

	public getName(): string {
		return this.name;
	}

	public getColor(): string {
		return this.color;
	}
}