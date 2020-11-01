import Editor from "../components/Editor";
import Angle from "../gmodTypes/Angle";
import Color from "../gmodTypes/Color";
import Vector from "../gmodTypes/Vector";
import { AngleNode, ColorNode, NumberNode, ToggleNode, VectorNode } from "./SingleOutputNode";
import { Node } from "./Node";

export default class NodeFactory {
	private editor: Editor;

	constructor (editor: Editor) {
		this.editor = editor;
	}

	public createNode<T>(name: string): T | null {
		let node: Node | null;
		switch (name) {
			case "Number":
				node = new NumberNode(this.editor, 0);
				break;
			case "Toggle":
				node = new ToggleNode(this.editor, false);
				break;
			case "Angle":
				node = new AngleNode(this.editor, new Angle(0, 0, 0));
				break;
			case "Vector":
				node = new VectorNode(this.editor, new Vector(0, 0, 0));
				break;
			case "Color":
				node = new ColorNode(this.editor, new Color(255, 255, 255, 255));
				break;
			default:
				node = null;
				break;
		}

		return node as unknown as T;
	}

	public getNodeColor(nodeName: string): string {
		switch (nodeName) {
			case "Number":
				return "#bc316d"; // red
			case "Toggle":
				return "#31bc87"; // green
			case "Vector":
				return "#3151bc"; // blue
			case "Angle":
				return "#5831bc"; // purple
			case "Color":
				return "#bc31ba"; // pink
			default:
				return "#8e8e8e"; // gray
		}
	}
}