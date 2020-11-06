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
	private coerceValue: (value: T) => T;

	constructor(node: Node, name: string, typeName: string, defaultValue: T, coerceValue: (value: T) => T = (value: T) => value) {
		super();

		this._node = node;
		this._name = name;
		this._linkedOutput = null;
		this._staticValue = defaultValue;
		this._typeName = typeName;
		this.coerceValue = coerceValue;
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
		this._staticValue = this.coerceValue(value);
	}

	public get staticValue(): T {
		return this._staticValue;
	}

	public get linkedOutput(): NodeOutput<T> | null {
		return this._linkedOutput;
	}

	private outputExistsLaterInBranch(output: NodeOutput<T>): boolean {

		// Wew lads this is gonna be a doozy
		const nodeCheckStack: Node[] = [this.node];
		const branchingNodes: Node[] = [];

		while (nodeCheckStack.length > 0) {

			const checkingNode = nodeCheckStack.pop();
			if (!checkingNode) continue;

			branchingNodes.push(checkingNode);

			for (const [, checkingNodeOutput] of checkingNode.outputs) {
				if (!checkingNodeOutput.linkedProperties) continue;

				for (const linkedProperty of checkingNodeOutput.linkedProperties) {

					nodeCheckStack.push(linkedProperty.node);

				}
			}

		}

		for (const node of branchingNodes) {
			if (output.node === node) return true;
		}

		return false;
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
			
			if (!this.outputExistsLaterInBranch(output)) {
				this._linkedOutput = output;
				this._linkedOutput.linkedProperties.push(this);
				return true;
			}

			return false;
		}

		return false;
	}

	public getValue(): T {
		if (!this._linkedOutput) return this.coerceValue(this._staticValue);
		return this.coerceValue(this._linkedOutput.value);
	}
}
