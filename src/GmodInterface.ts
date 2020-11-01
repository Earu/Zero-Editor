declare global {
    namespace globalThis {
        var gmodinterface: GmodInterface | undefined;
    }
}

export interface IGmodInterface {
	// to be overriden by gmod
	openFileExplorer(id: number): void;
	saveFile(fileName: string, fileContents: string): void;

	// don't override
	onFileExplorerClosed(id: number, fileContents: string): void;
}

export class FileExplorerEvent extends Event {
	private _id: number = -1
	private _fileContents: string = "";

	public get id(): number {
		return this._id;
	}

	public set id(newId: number) {
		this._id = newId;
	}

	public get fileContents(): string {
		return this._fileContents;
	}

	public set fileContents(contents: string) {
		this._fileContents = contents;
	}
}

class GmodInterface implements IGmodInterface {
	openFileExplorer(id: number): void {}
	saveFile(fileName: string, fileContents: string): void {}

	// don't override
	onFileExplorerClosed(id: number, fileContents: string): void {
		const event: FileExplorerEvent = new FileExplorerEvent("fileExplorerClosed");
		document.dispatchEvent(event);
	}
}