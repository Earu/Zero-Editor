import { Guid } from "guid-typescript";
import Editor from "../components/Editor";

const DEFAULT_NODE_WIDTH: number = 125;

export class NodeOutput<T> {
	private _typeName: string;
	private _value: T;

	constructor(defaultValue: T, typeName: string) {
		this._typeName = typeName;
		this._value = defaultValue;
	}

	public get typeName(): string {
		return this._typeName;
	}

	public set value(value: T) {
		this._value = value;
	}

	public get value(): T {
		return this._value;
	}
}

export class NodeProperty<T> {
	private staticValue: T;
	private linkedOutput: NodeOutput<T>| null;
	private _typeName: string;

	constructor(defaultValue: T, typeName: string) {
		this.linkedOutput = null;
		this.staticValue = defaultValue;
		this._typeName = typeName;
	}

	public get typeName(): string {
		return this._typeName;
	}

	public setStaticValue(value: T): void {
		this.staticValue = value;
	}

	public trySetLinkedOutput(output: NodeOutput<T>): boolean {
		if (output.typeName === this.typeName) {
			this.linkedOutput = output;

			return true;
		}

		return false;
	}

	public getValue(): T {
		if (!this.linkedOutput) return this.staticValue;
		return this.linkedOutput.value;
	}
}

export class Node {
	private _editor: Editor;
	private _id: Guid;

	private _x: number;
	private _y: number;
	private _width: number;
	private _name: string;
	private _color: string;
	private _properties: Map<string, NodeProperty<any>>;
	private _outputs: Map<string, NodeOutput<any>>;

	constructor(editor: Editor, name: string, color: string) {
		this._id = Guid.create();
		this._editor = editor;
		this._x = 0;
		this._y = 0;
		this._width = DEFAULT_NODE_WIDTH;
		this._name = name;
		this._color = color;
		this._properties = new Map<string, NodeProperty<any>>();
		this._outputs = new Map<string, NodeOutput<any>>();
	}

	public get properties(): Map<string, NodeProperty<any>> {
		return this._properties;
	}

	public get outputs(): Map<string, NodeOutput<any>> {
		return this._outputs;
	}

	public get hasOutput(): boolean {
		return this._outputs.size > 0;
	}

	public updateOutputs(): void {}

	public getProperty<T>(name: string): NodeProperty<T> | null {
		const property = this._properties.get(name);
		if (property === null) return null;

		return property as NodeProperty<T>;
	}

	public setCoordinates(x: number, y: number): void {
		this._x = x;
		this._y = y;
	}

	public get id(): Guid {
		return this._id;
	}

	public set id(id: Guid) {
		this._id = id;
	}

	public get editor(): Editor {
		return this._editor;
	}

	public get x(): number {
		return this._x;
	}

	public get y(): number {
		return this._y;
	}

	public get width(): number {
		return this._width;
	}

	public get name(): string {
		return this._name;
	}

	public get color(): string {
		return this._color;
	}
}