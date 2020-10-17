import { Guid } from "guid-typescript";
import Editor from "../Editor";
import INode from "./INode";

export default class BaseNode implements INode {
	editor: Editor;
	id: Guid;

	toJson(): string {
		return JSON.stringify(this);
	}

	static fromJson<T extends BaseNode>(editor: Editor, json: string): T {
		try {
			const jsonObj: T = JSON.parse(json);
			jsonObj.editor = editor;
			return jsonObj;
		} catch {
			return null;
		}
	}

	static createNew<T extends BaseNode>(editor: Editor): T {
		const newNode = new BaseNode();
		newNode.id = Guid.create();
		newNode.editor = editor;

		return newNode as T;
	}
}