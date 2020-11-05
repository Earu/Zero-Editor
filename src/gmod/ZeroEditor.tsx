import React from "react";
import Editor, { NodeSchemeEvent } from "../editor/components/Editor";
import { FileExplorerEvent } from "./GmodInterface";
import GmodNodeFactory from "./GmodNodeFactory";

class BaseZeroEditor extends Editor<GmodNodeFactory> {
	private currentExplorerCallbackId: number;
	private fileExplorerCallbacks: Array<(fileContents: string) => void>;

	constructor(props: any) {
		super(props);
		this.currentExplorerCallbackId = 0;
		this.fileExplorerCallbacks = [];
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

	public componentDidMount() {
		document.addEventListener("editorLoad", (event: Event) => {
			const schemeEvent: NodeSchemeEvent = event as NodeSchemeEvent;
			console.debug(schemeEvent.scheme.editor.state.currentProjectName);
		});

		document.addEventListener("editorSave", (event: Event) => {
			const schemeEvent: NodeSchemeEvent = event as NodeSchemeEvent;
			console.debug(schemeEvent.scheme.editor.state.currentProjectName);
		});

		document.addEventListener("fileExplorerClosed", (ev: Event) => {
			const explorerEvent: FileExplorerEvent = ev as FileExplorerEvent;
			this.onFileExplorerClosed(explorerEvent.id, explorerEvent.fileContents);
		});
	}
}

export default class ZeroEditor extends React.Component {
	public render(): JSX.Element {
		const factory: GmodNodeFactory = new GmodNodeFactory();
		return (<BaseZeroEditor title="Zero Editor" factory={factory}
			menu={[
				{ buttons: [
					{ name: "Import PAC3", callback: () => {} },
					{ name: "Export PAC3", callback: () => {} },
				] },
			]}
			nodeCategories={[
				{ name: "Data", nodeNames: [ "Number", "Toggle", "Vector", "Angle", "Color" ] },
				{ name: "Entity", nodeNames: [ "Model" ] },
				{ name: "Effects", nodeNames: [] },
				{ name: "Model", nodeNames: [] },
				{ name: "Modifiers", nodeNames: [] },
			]}
		/>);
	}
}