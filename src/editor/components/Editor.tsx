import React from "react";
import NodeMenu from "./menu/NodeMenu";
import Graph from "./graph/Graph";
import "./Editor.css";
import NodeFactory from "../nodes/NodeFactory";
import { IJsonNode } from "../nodes/JsonNode";

interface INodeScheme {
	editor: Editor<any>;
	value: string;
}

export class NodeSchemeEvent extends Event {
	private _scheme: INodeScheme;

	constructor(name: string, scheme: INodeScheme) {
		super(name);
		this._scheme = scheme;
	}

	public set scheme(scheme: INodeScheme) {
		this._scheme = scheme;
	}

	public get scheme(): INodeScheme{
		return this._scheme;
	}
}

interface IEditorMenuButton {
	name: string;
	callback: (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

interface IEditorMenuCategory {
	buttons: Array<IEditorMenuButton>;
}

export interface IEditorNodeCategory {
	name: string;
	nodeNames: Array<string>;
}

interface IEditorProperties<T extends NodeFactory> {
	title: string;
	factory: T;
	menu: Array<IEditorMenuCategory>;
	nodeCategories: Array<IEditorNodeCategory>;
}

interface IEditorState {
	currentProjectName: string | null;
}

export default class Editor<T extends NodeFactory> extends React.Component<IEditorProperties<T>, IEditorState> {
	private _graph: Graph | null;

	constructor(props: any) {
		super(props);
		this._graph = null;
		this.props.factory.editor = this;
		this.state = {
			currentProjectName: null
		}
	}

	public get factory(): NodeFactory {
		return this.props.factory;
	}

	public get nodeCategories(): Array<IEditorNodeCategory> {
		return this.props.nodeCategories;
	}

	public get graph(): Graph | null {
		return this._graph;
	}

	public set graph(graph: Graph | null) {
		this._graph = graph;
	}

	private pushEvent(name: string, scheme: INodeScheme): void {
		document.dispatchEvent(new NodeSchemeEvent(name, scheme));
	}

	// load a json scheme into our node scheme
	private load(json: string): void {
		// IMPL TODO
	}

	private resetGraph(): void {
		if (!this._graph) return;

		if (this._graph.nodeTable.size > 0) {
			if (!window.confirm("You have unsaved changes, are you sure you want to reset the graph?")) {
				return;
			}
		}

		this._graph.reset();
	}

	private onLoadProject(): void {
		const scheme: INodeScheme = { editor: this, value: "" };
		this.pushEvent("editorLoad", scheme);
		this.load(scheme.value);
	}

	// save our node scheme to an appropriate json scheme
	private onSave(): void {
		if (!this._graph) return;

		if (this.state.currentProjectName === null) {
			const projectName: string | null = window.prompt("Enter a name for your project");
			if (!projectName) return;

			this.setState({ currentProjectName: projectName })
		}


		const jsonNodes: Array<IJsonNode> = [];
		for (const [, node] of this._graph.nodeTable) {
			jsonNodes.push(node.toJson());
		}

		const json: string = JSON.stringify(jsonNodes);
		this.pushEvent("editorSave", { editor: this, value: json });
	}

	private onContextMenu(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
		event.preventDefault();
	}

	private renderMenu(): Array<JSX.Element> {
		const categories: Array<JSX.Element> = [];
		let i: number = 0;
		for (const category of this.props.menu) {
			const category_key = `editor_menu_${i++}`
			categories.push(<div key={category_key}>
				{category.buttons.map(btn => <button key={`${category_key}_${btn.name}`} onClick={btn.callback}>{btn.name}</button>)}
			</div>);
		}

		return categories;
	}

	public render(): JSX.Element {
		return (<div id="editor" onContextMenu={this.onContextMenu}>
			<div id="editor-menu">
				<div>
					<button onClick={this.onLoadProject.bind(this)}>Load Project</button>
					<button onClick={this.onSave.bind(this)}>Save Project</button>
					<button onClick={this.resetGraph.bind(this)}>Reset Graph</button>
				</div>
				{this.renderMenu()}
				<span>{this.state.currentProjectName === null ? "Unknown" : this.state.currentProjectName}</span>
				<h1>{this.props.title}</h1>
			</div>
			<NodeMenu editor={this} />
			<Graph editor={this}/>
		</div>);
	}
}