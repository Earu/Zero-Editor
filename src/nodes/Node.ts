import { Guid } from "guid-typescript";
import INode from "./INode";
import { ToggleNode } from "./BasicNode";
import Editor from "../components/Editor";

export default class Node implements INode {
	private _editor: Editor;
	private _id: Guid;
	private _isNsfw: ToggleNode;
	private _enabled: ToggleNode;

	constructor(editor: Editor) {
		this._id = Guid.create();
		this._isNsfw = new ToggleNode(editor, false);
		this._enabled = new ToggleNode(editor, true);
		this._editor = editor;
	}

	public getId(): Guid {
		return this._id
	}

	public setId(id: Guid): void {
		this._id = id;
	}

	// is_explicit from pac
	public isNsfw(): ToggleNode {
		return this._isNsfw;
	}

	public setNsfw(isNsfw: ToggleNode): void {
		this._isNsfw = isNsfw;
	}

	// hide from pac
	public isEnabled(): ToggleNode {
		return this._enabled;
	}

	public setEnabled(enabled: ToggleNode): void {
		this._enabled = enabled;
	}

	public getEditor(): Editor {
		return this._editor;
	}

	public toJson(): string {
		return JSON.stringify({
			id: this._id,
			isNsfw: this._isNsfw,
		});
	}

	public fromJson(json: string): void {
		const jsonObj = JSON.parse(json);
		this._id = jsonObj.id;
		this._isNsfw = jsonObj.isNsfw;
	}
}