import { Guid } from "guid-typescript";
import Editor from "../Editor";
import INode from "./INode";
import { ToggleNode } from "./BasicNode";

export default class Node implements INode {
	private _editor: Editor;

	protected _id: Guid;
	protected _isNsfw: ToggleNode;
	protected _enabled: ToggleNode;

	constructor(editor: Editor) {
		this._id = Guid.create();
		this._isNsfw = new ToggleNode(editor, false);
		this._enabled = new ToggleNode(editor, true);
	}

	public get id(): Guid {
		return this._id
	}

	public get editor(): Editor {
		return this._editor;
	}

	// is_explicit from pac
	public get isNsfw(): ToggleNode {
		return this._isNsfw;
	}

	// hide from pac
	public get isEnabled(): ToggleNode {
		return this._enabled;
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