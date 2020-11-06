import Editor from "../../editor/components/Editor";
import Node from "../../editor/nodes/Node";
import NodeProperty from "../../editor/nodes/NodeProperty";
import GmodNodeFactory from "../GmodNodeFactory";
import Color from "../types/Color";

export default class ModelNode extends Node {
	constructor(editor: Editor<GmodNodeFactory>) {
		super (editor, "Model");
		this.properties.set("path", new NodeProperty<string>(this, "path", "Text", ""));
		this.properties.set("texture", new NodeProperty<string>(this, "texture", "Text", ""));
		this.properties.set("color", new NodeProperty<Color>(this, "color", "Color", new Color(255, 255, 255)));
	}
}