import Editor from "../../editor/components/Editor";
import NodeProperty from "../../editor/nodes/NodeProperty";
import SingleOutputNode from "../../editor/nodes/SingleOutputNodes";
import GmodNodeFactory from "../GmodNodeFactory";
import Color from "../types/Color";

export default class ColorNode extends SingleOutputNode<Color> {
	constructor(editor: Editor<GmodNodeFactory>, value: Color) {
		super (editor, "Color", value);
		this.properties.set("red", new NodeProperty<number>(this, "red", "Number", value.red, this.coerceValue));
		this.properties.set("green", new NodeProperty<number>(this, "green", "Number", value.green, this.coerceValue));
		this.properties.set("blue", new NodeProperty<number>(this, "blue", "Number", value.blue, this.coerceValue));
		this.properties.set("alpha", new NodeProperty<number>(this, "alpha", "Number", value.alpha, this.coerceValue));
	}

	public coerceValue(n: number): number {
		return Math.max(Math.min(n, 255), -255);
	}

	public updateOutputs(): void {
		const red: number = this.properties.get("red")?.getValue();
		const green: number = this.properties.get("green")?.getValue();
		const blue: number = this.properties.get("blue")?.getValue();
		const alpha: number = this.properties.get("alpha")?.getValue();
		this.output.value = new Color(red, green, blue, alpha);
	}
}