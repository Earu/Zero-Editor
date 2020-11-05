import React from "react";
import Editor from "../components/Editor";
import Graph from "../components/graph/Graph";
import Node from "./Node";
import NodeProperty from "./NodeProperty";

export default class NodeFactory {
	private _editor: Editor<NodeFactory> | null;

	constructor() {
		this._editor = null;
	}

	public set editor(editor: Editor<NodeFactory> | null) {
		this._editor = editor;
	}

	public get editor(): Editor<NodeFactory> | null {
		return this._editor;
	}

	public createNode<T extends Node>(name: string): T | null {
		return null;
	}

	public createGraphNodeProperty(htmlId: string, node: Node, property: NodeProperty<any>, graph: Graph): JSX.Element {
		return <div />;
	}

	public getNodeColor(name: string): string {
		return "#8e8e8e"; // gray
	}
}