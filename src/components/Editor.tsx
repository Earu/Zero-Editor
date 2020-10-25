import React from "react";
import "./Editor.css";
import NodeMenuSelector from "./menu/NodeMenuSelector";
import Graph from "./graph/Graph";

export default class Editor extends React.Component {
	private _graph: Graph | null;

	constructor(props: any) {
		super(props);
		this._graph = null;
	}

	public get graph(): Graph | null {
		return this._graph;
	}

	public set graph(graph: Graph | null) {
		this._graph = graph;
	}

	// load a pac json file and convert it to our
	// node scheme
	public loadPacJson(json: string): void {
		//const jsonObj = JSON.parse(json);

		// IMPL TODO
	}

	// this will compile our nodes to a pac json file
	// so that the pac renderer can display it
	public compileToPacJson(): string {
		// IMPL TODO
		return "";
	}

	// save our node scheme to an appropriate json scheme
	// NOT THE SAME AS PAC JSON FILES
	public save(): void {
		// IMPL TODO
	}

	// load a json scheme into our node scheme
	// NOT THE SAME AS PAC JSON FILES
	public load(json: string): void {
		// IMPL TODO
	}

	private onLoadProject(): void {}
	private onSaveProject(): void {}
	private onImportPac3(): void {}
	private onExportPac3(): void {}

	public render(): JSX.Element {
		return (<div id="editor">
			<div id="editor-menu">
				<div>
					<button onClick={this.onLoadProject}>Load Project</button>
					<button onClick={this.onSaveProject}>Save Project</button>
				</div>
				<div>
					<button onClick={this.onImportPac3}>Import PAC3</button>
					<button onClick={this.onExportPac3}>Export PAC3</button>
				</div>
				<h1>Zero Editor</h1>
			</div>
			<NodeMenuSelector editor={this} />
			<Graph editor={this}/>
		</div>);
	}
}