import { Guid } from "guid-typescript";
import Editor from "../Editor";

export default interface INode {
	id: Guid;
	editor: Editor;
}