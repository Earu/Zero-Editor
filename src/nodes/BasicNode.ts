import Editor from "../components/Editor";
import Angle from "../gmodTypes/Angle";
import Color from "../gmodTypes/Color";
import Vector from "../gmodTypes/Vector";
import { Node, NodeOutput, NodeProperty } from "./Node";

class SingleOutputNode<T> extends Node {
	constructor(editor: Editor, name: string, value: T) {
		super (editor, name, editor.factory.getNodeColor(name));
		this.outputs.set("value", new NodeOutput<T>(value, name));
	}

	public get output(): NodeOutput<T> {
		return this.outputs.get("value") as NodeOutput<T>;
	}
}

export class VectorNode extends SingleOutputNode<Vector> {
	constructor(editor: Editor, value: Vector) {
		super (editor, "Vector", value);
		this.properties.set("x", new NodeProperty<number>(value.x, "Number"));
		this.properties.set("y", new NodeProperty<number>(value.y, "Number"));
		this.properties.set("z", new NodeProperty<number>(value.z, "Number"));
	}

	public updateOutputs(): void {
		const x: number = this.properties.get("x")?.getValue();
		const y: number = this.properties.get("y")?.getValue();
		const z: number = this.properties.get("z")?.getValue();
		this.output.value = new Vector(x, y, z);
	}
}

export class AngleNode extends SingleOutputNode<Angle>{
	constructor(editor: Editor, value: Angle) {
		super (editor, "Angle", value);
		this.properties.set("roll", new NodeProperty<number>(value.roll, "Number"));
		this.properties.set("pitch", new NodeProperty<number>(value.pitch, "Number"));
		this.properties.set("yaw", new NodeProperty<number>(value.yaw, "Number"));
	}

	public updateOutputs(): void {
		const roll: number = this.properties.get("roll")?.getValue();
		const pitch: number = this.properties.get("pitch")?.getValue();
		const yaw: number = this.properties.get("yaw")?.getValue();
		this.output.value = new Angle(roll, pitch, yaw);
	}
}

export class ToggleNode extends SingleOutputNode<boolean> {
	constructor(editor: Editor, value: boolean) {
		super (editor, "Toggle", value);
		this.properties.set("value", new NodeProperty<boolean>(value, "Toggle"));
	}

	public updateOutputs(): void {
		this.output.value = this.properties.get("value")?.getValue();
	}
}

export class NumberNode extends SingleOutputNode<number> {
	constructor(editor: Editor, value: number) {
		super (editor, "Number", value);
		this.properties.set("value", new NodeProperty<number>(value, "Number"));
	}

	public updateOutputs(): void {
		this.output.value = this.properties.get("value")?.getValue();
	}
}

export class ColorNode extends SingleOutputNode<Color> {
	constructor(editor: Editor, value: Color) {
		super (editor, "Color", value);
		this.properties.set("red", new NodeProperty<number>(value.red, "Number"));
		this.properties.set("green", new NodeProperty<number>(value.green, "Number"));
		this.properties.set("blue", new NodeProperty<number>(value.blue, "Number"));
		this.properties.set("alpha", new NodeProperty<number>(value.alpha, "Number"));
	}

	public updateOutputs(): void {
		const red: number = this.properties.get("red")?.getValue();
		const green: number = this.properties.get("green")?.getValue();
		const blue: number = this.properties.get("blue")?.getValue();
		const alpha: number = this.properties.get("alpha")?.getValue();
		this.output.value = new Color(red, green, blue, alpha);
	}
}

export class ChoiceNode extends SingleOutputNode<Array<string>> {}
export class ModelNode extends SingleOutputNode<string> {}
export class MaterialNode extends SingleOutputNode<string> {}
export class InputNode extends SingleOutputNode<string> {}