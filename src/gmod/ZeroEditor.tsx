import React from "react";
import Editor from "../editor/components/Editor";
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
		document.addEventListener("editorLoad", scheme => {
			console.log(scheme);
		});

		document.addEventListener("editorSave", scheme => {
			console.log(scheme);
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
		/>);
	}
}