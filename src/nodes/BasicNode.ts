import Editor from "../Editor";
import Angle from "../gmodTypes/Angle";
import Color from "../gmodTypes/Color";
import Vector from "../gmodTypes/Vector";
import Node from "./Node";

class BasicNode<T> extends Node {
	private _value: T;

	constructor(editor: Editor, value: T) {
		super(editor);
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
		this._id = jsonObj.id;
		this._value = jsonObj.value;
	}

	public toJson(): string {
		return JSON.stringify({
			id: super._id,
			isNsfw: super._isNsfw,
			value: this._value,
		});
	}
}

export class VectorNode extends BasicNode<Vector> {}
export class AngleNode extends BasicNode<Angle>{}
export class ToggleNode extends BasicNode<boolean> {}
export class NumberNode extends BasicNode<number> {}
export class ColorNode extends BasicNode<Color> {}
export class ChoiceNode extends BasicNode<Array<string>> {}
export class ModelNode extends BasicNode<string> {}
export class MaterialNode extends BasicNode<string> {}
export class InputNode extends BasicNode<string> {}