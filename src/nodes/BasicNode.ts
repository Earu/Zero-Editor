import Editor from "../components/Editor";
import Angle from "../gmodTypes/Angle";
import Color from "../gmodTypes/Color";
import Vector from "../gmodTypes/Vector";
import Node from "./Node";

class BasicNode<T> extends Node {
	private _value: T;

	constructor(editor: Editor, name: string, color: string, value: T) {
		super(editor, name, color);
		this._value = value;
	}

	public get value(): T {
		return this._value;
	}

	public set value(value: T) {
		this._value = value;
	}

	public fromJson(json: string): void {
		const jsonObj = JSON.parse(json);
		this.setId(jsonObj.id);
		this._value = jsonObj.value;
	}

	public toJson(): string {
		return JSON.stringify({
			id: super.getId(),
			value: this._value,
		});
	}
}

export class VectorNode extends BasicNode<Vector> {
	constructor(editor: Editor, value: Vector) {
		super (editor, "Vector", "#3151bc", value);
	}
}

export class AngleNode extends BasicNode<Angle>{
	constructor(editor: Editor, value: Angle) {
		super (editor, "Angle", "#5831bc", value);
	}
}

export class ToggleNode extends BasicNode<boolean> {
	constructor(editor: Editor, value: boolean) {
		super (editor, "Toggle", "#31bc87", value);
	}
}

export class NumberNode extends BasicNode<number> {
	constructor(editor: Editor, value: number) {
		super (editor, "Number", "#bc316d", value);
	}
}

export class ColorNode extends BasicNode<Color> {
	constructor(editor: Editor, value: Color) {
		super (editor, "Color", "#bc31ba", value);
	}
}

export class ChoiceNode extends BasicNode<Array<string>> {}
export class ModelNode extends BasicNode<string> {}
export class MaterialNode extends BasicNode<string> {}
export class InputNode extends BasicNode<string> {}