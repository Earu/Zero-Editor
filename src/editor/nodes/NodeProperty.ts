import { EventEmitter } from "events";
import Node from "./Node";
import NodeOutput from "./NodeOutput";

export default class NodeProperty<T> extends EventEmitter {
	private _node: Node;
	private _name: string;
	private _staticValue: T;
	private _linkedOutput: NodeOutput<T>| null;
	private _typeName: string;
	private _userSelector: HTMLElement | null = null;

	constructor(node: Node, name: string, typeName: string, defaultValue: T) {
		super();

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
			if (this._linkedOutput) {
				this._linkedOutput.linkedProperties = this._linkedOutput.linkedProperties
					.filter(prop => prop !== this);
			}

			this._linkedOutput = null;
			return true;
		}

		if (output.typeName === this.typeName && output.node.id !== this._node.id) {
			this._linkedOutput = output;
			this._linkedOutput.linkedProperties.push(this);

			return true;
		}

		return false;
	}

	public getValue(): T {
		if (!this._linkedOutput) return this._staticValue;
		return this._linkedOutput.value;
	}
}
