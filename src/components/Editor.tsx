import React from "react";
import "./Editor.css";
import NodeMenuSelector from "./menu/NodeMenuSelector";
import Graph from "./graph/Graph";
import NodeFactory from "../nodes/NodeFactory";
import { FileExplorerEvent } from "../GmodInterface";
import { IJsonNode } from "../nodes/JsonNode";

export default class Editor extends React.Component {
	private _graph: Graph | null;
	private _factory: NodeFactory;
	private currentExplorerCallbackId: number;
	private fileExplorerCallbacks: Array<(fileContents: string) => void>;

	constructor(props: any) {
		super(props);
		this._graph = null;
		this._factory = new NodeFactory(this);
		this.currentExplorerCallbackId = 0;
		this.fileExplorerCallbacks = [];
	}

	public get factory(): NodeFactory {
		return this._factory;
	}

	public get graph(): Graph | null {
		return this._graph;
	}

	public set graph(graph: Graph | null) {
		this._graph = graph;
	}

	private openFileExplorer(callback: (fileContents: string) => void): void {
		this.fileExplorerCallbacks[++this.currentExplorerCallbackId] = callback;
		gmodinterface?.openFileExplorer(this.currentExplorerCallbackId);
	}

	private onFileExplorerClosed(id: number, fileContents: string): void {
		if (this.fileExplorerCallbacks[id]) {
			this.fileExplorerCallbacks[id](fileContents);
		}
	}

	// load a pac json file and convert it to our
	// node scheme
	private loadPacJson(json: string): void {
		//const jsonObj = JSON.parse(json);

		// IMPL TODO
	}

	// this will compile our nodes to a pac json file
	// so that the pac renderer can display it
	private compileToPacJson(): string {
		// IMPL TODO
		return "";
	}

	// save our node scheme to an appropriate json scheme
	// NOT THE SAME AS PAC JSON FILES
	private save(): void {
		if (!this._graph) return;

		const jsonNodes: Array<IJsonNode> = [];
		for (const [, node] of this._graph.nodeTable) {
			jsonNodes.push(node.toJson());
		}

		const json = JSON.stringify(jsonNodes);
		gmodinterface?.saveFile("test.json", json);
	}

	// load a json scheme into our node scheme
	// NOT THE SAME AS PAC JSON FILES
	private load(json: string): void {
		// IMPL TODO
	}

	private resetGraph(): void {
		this._graph?.reset();
	}

	private onLoadProject(): void {
		this.openFileExplorer(this.load.bind(this));
	}

	private onImportPac3(): void {
		this.openFileExplorer(this.loadPacJson.bind(this));
	}

	public componentDidMount() {
		document.addEventListener("fileExplorerClosed", (ev: Event) => {
			const explorerEvent: FileExplorerEvent = ev as FileExplorerEvent;
			this.onFileExplorerClosed(explorerEvent.id, explorerEvent.fileContents);
		});
	}

	public render(): JSX.Element {
		return (<div id="editor">
			<div id="editor-menu">
				<div>
					<button onClick={this.onLoadProject.bind(this)}>Load Project</button>
					<button onClick={this.save.bind(this)}>Save Project</button>
					<button onClick={this.resetGraph.bind(this)}>Reset Graph</button>
				</div>
				<div>
					<button onClick={this.onImportPac3.bind(this)}>Import PAC3</button>
					<button onClick={this.compileToPacJson.bind(this)}>Export PAC3</button>
				</div>
				<h1>Zero Editor</h1>
			</div>
			<NodeMenuSelector editor={this} />
			<Graph editor={this}/>
		</div>);
	}
}