import React from "react";
import NodeMenu from "./menu/NodeMenu";
import Graph from "./graph/Graph";
import "./Editor.css";
import NodeFactory from "../nodes/NodeFactory";
import { IJsonNode } from "../nodes/JsonNode";
import EditorModal from "./EditorModal";

const DEFAULT_PROJECT_NAME: string = "Unknown Project";

interface INodeScheme {
	editor: Editor<NodeFactory>;
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
	showPrompt: boolean;
	promptTitle: string;
	promptMessage: string;
	showPromptInput: boolean;
	promptConfirm: (input: string | null) => void;
}

export default class Editor<T extends NodeFactory> extends React.Component<IEditorProperties<T>, IEditorState> {
	private _graph: Graph | null;
	private promptInput: React.RefObject<HTMLInputElement>;

	constructor(props: any) {
		super(props);
		this._graph = null;
		this.promptInput = React.createRef();
		this.props.factory.editor = this;
		this.state = {
			currentProjectName: null,
			showPrompt: false,
			promptTitle: "",
			promptMessage: "",
			showPromptInput: false,
			promptConfirm: () => {},
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

	private prompt(title: string, message: string, input: boolean, confirm: (input: string | null) => void): void {
		this.setState({
			currentProjectName: this.state.currentProjectName,
			showPrompt: true,
			promptTitle: title,
			promptMessage: message,
			showPromptInput: input,
			promptConfirm: confirm,
		})
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
			this.prompt("Reset Graph", "Are you sure that you want to reset the graph?", false, () => {
				const state: IEditorState = this.state;
				state.currentProjectName = null;
				this.setState(state);

				this._graph?.reset();
			});
			return;
		}

		const state: IEditorState = this.state;
		state.currentProjectName = null;
		this.setState(state);

		this._graph.reset();
	}

	// scompile our graph scheme to json
	private compileGraph(): string {
		if (!this._graph) return "";

		const jsonNodes: Array<IJsonNode> = [];
		for (const [, node] of this._graph.nodeTable) {
			jsonNodes.push(node.toJson());
		}

		return JSON.stringify(jsonNodes);
	}

	private onLoadProject(): void {
		const scheme: INodeScheme = { editor: this, value: "" };
		this.pushEvent("editorLoad", scheme);
		this.load(scheme.value);
	}

	private onSave(): void {
		if (this.state.currentProjectName === null) {
			this.prompt("Project Name", "Enter a name for your project", true, (projectName: string | null) => {
				if (!projectName) return;
				if (projectName.trim() === "") {
					projectName = DEFAULT_PROJECT_NAME;
				}

				const state: IEditorState = this.state;
				state.currentProjectName = projectName;
				this.setState(state);

				const json = this.compileGraph();
				this.pushEvent("editorSave", { editor: this, value: json });
			});
		}

		const json = this.compileGraph();
		this.pushEvent("editorSave", { editor: this, value: json });
	}

	private onContextMenu(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
		event.preventDefault();
	}

	private onPromptConfirm(): void {
		if (this.promptInput.current) {
			if (this.state.showPromptInput) {
				this.state.promptConfirm(this.promptInput.current.value);
			} else {
				this.state.promptConfirm(null);
			}

			const state: IEditorState = this.state;
			state.showPrompt = false;
			this.setState(state);
		}
	}

	private onPromptClose(): void {
		const state: IEditorState = this.state;
		state.showPrompt = false;
		this.setState(state);
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
			<EditorModal title={this.state.promptTitle} message={this.state.promptMessage} onClose={this.onPromptClose.bind(this)} style={{ display: this.state.showPrompt ? "block" : "none" }}>
				<input className="editor-prompt-input" type="text" placeholder="type here..." style={{ display: this.state.showPromptInput ? "block" : "none" }} ref={this.promptInput} />
				<div style={{ display: "inline-block", margin: "auto" }}>
					<button className="editor-prompt-btn" onClick={this.onPromptConfirm.bind(this)}>Ok</button>
					<button className="editor-prompt-btn" onClick={this.onPromptClose.bind(this)}>Cancel</button>
				</div>
			</EditorModal>
			<div id="editor-menu">
				<div>
					<button onClick={this.onLoadProject.bind(this)}>Load Project</button>
					<button onClick={this.onSave.bind(this)}>Save Project</button>
					<button onClick={this.resetGraph.bind(this)}>Reset Graph</button>
				</div>
				{this.renderMenu()}
				<span>{this.state.currentProjectName === null ? DEFAULT_PROJECT_NAME : this.state.currentProjectName}</span>
				<h1>{this.props.title}</h1>
			</div>
			<NodeMenu editor={this} />
			<Graph editor={this}/>
		</div>);
	}
}