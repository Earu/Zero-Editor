import { Guid } from "guid-typescript";
import Editor from "../components/Editor";
import { IJsonNode, IJsonOutput, IJsonProperty } from "./JsonNode";
import NodeOutput from "./NodeOutput";
import NodeProperty from "./NodeProperty";

const DEFAULT_NODE_WIDTH: number = 125;

export default class Node {
	private _editor: Editor<any>;
	private _id: Guid;

	private _x: number;
	private _y: number;
	private _width: number;
	private _name: string;
	private _color: string;
	private _properties: Map<string, NodeProperty<any>>;
	private _outputs: Map<string, NodeOutput<any>>;

	constructor(editor: Editor<any>, name: string) {
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

	public get editor(): Editor<any> {
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