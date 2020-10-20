import { Guid } from "guid-typescript";
import Editor from "../components/Editor";
import { ToggleNode } from "./BasicNode";

export default interface INode {
	getId(): Guid;
	setId(id: Guid): void;
	isNsfw(): ToggleNode;
	setNsfw(isNsfw: ToggleNode): void;
	isEnabled(): ToggleNode;
	setEnabled(enabled: ToggleNode): void;
	getEditor(editor: Editor): void;
	toJson(): string;
	fromJson(json: string): void;
}