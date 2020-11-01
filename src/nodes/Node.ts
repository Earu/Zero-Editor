import { Guid } from "guid-typescript";
import Editor from "../components/Editor";
import { IJsonNode, IJsonOutput, IJsonProperty } from "./JsonNode";

const DEFAULT_NODE_WIDTH: number = 125;

export class NodeOutput<T> {
	private _node: Node;
	private _name: string;
	private _typeName: string;
	private _value: T;
	private _userSelector: HTMLElement | null = null;

	constructor(node: Node, name: string, typeName: string, defaultValue: T) {
		this._node = node;
		this._name = name;
		this._typeName = typeName;
		this._value = defaultValue;
	}

	public set userSelector(selector: HTMLElement | null) {
		this._userSelector = selector;
	}

	public get userSelector(): HTMLElement | null {
		return this._userSelector;
	}

	public get node(): Node {
		return this._node;
	}

	public get name(): string {
		return this._name;
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
	private _node: Node;
	private _name: string;
	private _staticValue: T;
	private _linkedOutput: NodeOutput<T>| null;
	private _typeName: string;
	private _userSelector: HTMLElement | null = null;

	constructor(node: Node, name: string, typeName: string, defaultValue: T) {
		this._node = node;
		this._name = name;
		this._linkedOutput = null;
		this._staticValue = defaultValue;
		this._typeName = typeName;
	}

	public set userSelector(selector: HTMLElement | null) {
		this._userSelector = selector;
	}

	public get userSelector(): HTMLElement | null {
		return this._userSelector;
	}

	public get node(): Node {
		return this._node;
	}

	public get name(): string {
		return this._name;
	}

	public get typeName(): string {
		return this._typeName;
	}

	public set staticValue(value: T) {
		this._staticValue = value;
	}

	public get staticValue(): T {
		return this._staticValue;
	}

	public get linkedOutput(): NodeOutput<T> | null {
		return this._linkedOutput;
	}

	public trySetLinkedOutput(output: NodeOutput<T> | null): boolean {
		if (!output) {
			this._linkedOutput = null;
			return true;
		}

		if (output.typeName === this.typeName) {
			this._linkedOutput = output;

			return true;
		}

		return false;
	}

	public getValue(): T {
		if (!this._linkedOutput) return this._staticValue;
		return this._linkedOutput.value;
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

	constructor(editor: Editor, name: string) {
		this._id = Guid.create();
		this._editor = editor;
		this._x = 0;
		this._y = 0;
		this._width = DEFAULT_NODE_WIDTH;
		this._name = name;
		this._color = editor.factory.getNodeColor(name);
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

	public toJson(): IJsonNode {
		const jsonOutputs: Array<IJsonOutput> = [];
		for (const [outputName, output] of this._outputs) {
			jsonOutputs.push({
				name: outputName,
				type: output.typeName,
				value: output.value
			});
		}

		const jsonProperties: Array<IJsonProperty> = [];
		for (const [propertyName, property] of this._properties) {
			jsonProperties.push({
				name: propertyName,
				type: property.typeName,
				staticValue: property.staticValue,
				linkedOutput: property.linkedOutput == null ? null : {
					nodeId: property.linkedOutput.node._id.toString(),
					outputName: property.linkedOutput.name
				}
			});
		}

		return {
			id: this._id.toString(),
			x: this._x,
			y: this._y,
			name: this._name,
			outputs: jsonOutputs,
			properties: jsonProperties,
		};
	}
}