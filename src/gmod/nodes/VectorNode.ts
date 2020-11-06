import Editor from "../../editor/components/Editor";
import NodeProperty from "../../editor/nodes/NodeProperty";
import SingleOutputNode from "../../editor/nodes/SingleOutputNode";
import GmodNodeFactory from "../GmodNodeFactory";
import Vector from "../types/Vector";

export default class VectorNode extends SingleOutputNode<Vector> {
	constructor(editor: Editor<GmodNodeFactory>, value: Vector) {
		super (editor, "Vector", value);
		this.properties.set("x", new NodeProperty<number>(this, "x", "Number", value.x));
		this.properties.set("y", new NodeProperty<number>(this, "y", "Number", value.y));
		this.properties.set("z", new NodeProperty<number>(this, "z", "Number", value.z));
	}

	public updateOutputs(): void {
		const x: number = this.properties.get("x")?.getValue();
		const y: number = this.properties.get("y")?.getValue();
		const z: number = this.properties.get("z")?.getValue();
		this.output.value = new Vector(x, y, z);
	}
}