import { Guid } from "guid-typescript";
import Editor from "../components/Editor";

interface INode {
	getId(): Guid;
	setId(id: Guid): void;
	getEditor(editor: Editor): void;
	toJson(): string;
	fromJson(json: string): void;
}

export default class Node implements INode {
	private _editor: Editor;
	private _id: Guid;

	constructor(editor: Editor) {
		this._id = Guid.create();
		this._editor = editor;
	}

	public getId(): Guid {
		return this._id
	}

	public setId(id: Guid): void {
		this._id = id;
	}

	public getEditor(): Editor {
		return this._editor;
	}

	public toJson(): string {
		return JSON.stringify({
			id: this._id,
		});
	}

	public fromJson(json: string): void {
		const jsonObj = JSON.parse(json);
		this._id = jsonObj.id;
	}
}