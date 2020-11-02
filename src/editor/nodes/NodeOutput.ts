import Node from "./Node";
import NodeProperty from "./NodeProperty";

export default class NodeOutput<T> {
	private _node: Node;
	private _name: string;
	private _typeName: string;
	private _value: T;
	private _userSelector: HTMLElement | null = null;
	private _linkedProperties: Array<NodeProperty<T>>;

	constructor(node: Node, name: string, typeName: string, defaultValue: T) {
		this._node = node;
		this._name = name;
		this._typeName = typeName;
		this._value = defaultValue;
		this._linkedProperties = [];
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
		for (const property of this._linkedProperties) {
			property.emit("update");
		}
	}

	public get value(): T {
		return this._value;
	}

	public set userSelector(selector: HTMLElement | null) {
		this._userSelector = selector;
	}

	public get userSelector(): HTMLElement | null {
		return this._userSelector;
	}

	public get linkedProperties(): Array<NodeProperty<T>> {
		return this._linkedProperties;
	}

	public set linkedProperties(properties: Array<NodeProperty<T>>) {
		this._linkedProperties = properties;
	}
}
