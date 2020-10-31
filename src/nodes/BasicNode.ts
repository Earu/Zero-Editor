import Editor from "../components/Editor";
import Angle from "../gmodTypes/Angle";
import Color from "../gmodTypes/Color";
import Vector from "../gmodTypes/Vector";
import Node from "./Node";

class BasicNode<T> extends Node {
	constructor(editor: Editor, name: string, value: T) {
		super(editor, name, editor.factory.GetNodeColor(name));
		this.properties.set("value", value);
	}

	public get value(): T {
		return this.properties.get("value") as T;
	}

	public set value(value: T) {
		this.properties.set("value", value);
	}
}

export class VectorNode extends BasicNode<Vector> {
	constructor(editor: Editor, value: Vector) {
		super (editor, "Vector", value);
	}
}

export class AngleNode extends BasicNode<Angle>{
	constructor(editor: Editor, value: Angle) {
		super (editor, "Angle", value);
	}
}

export class ToggleNode extends BasicNode<boolean> {
	constructor(editor: Editor, value: boolean) {
		super (editor, "Toggle", value);
	}
}

export class NumberNode extends BasicNode<number> {
	constructor(editor: Editor, value: number) {
		super (editor, "Number", value);
	}
}

export class ColorNode extends BasicNode<Color> {
	constructor(editor: Editor, value: Color) {
		super (editor, "Color", value);
	}
}

export class ChoiceNode extends BasicNode<Array<string>> {}
export class ModelNode extends BasicNode<string> {}
export class MaterialNode extends BasicNode<string> {}
export class InputNode extends BasicNode<string> {}