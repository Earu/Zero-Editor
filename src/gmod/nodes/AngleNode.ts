import Editor from "../../editor/components/Editor";
import NodeProperty from "../../editor/nodes/NodeProperty";
import SingleOutputNode from "../../editor/nodes/SingleOutputNodes";
import GmodNodeFactory from "../GmodNodeFactory";
import Angle from "../types/Angle";

export default class AngleNode extends SingleOutputNode<Angle>{
	constructor(editor: Editor<GmodNodeFactory>, value: Angle) {
		super (editor, "Angle", value);
		this.properties.set("roll", new NodeProperty<number>(this, "roll", "Number", value.roll));
		this.properties.set("pitch", new NodeProperty<number>(this, "pitch", "Number", value.pitch));
		this.properties.set("yaw", new NodeProperty<number>(this, "yaw", "Number", value.yaw));
	}

	public updateOutputs(): void {
		const roll: number = this.properties.get("roll")?.getValue();
		const pitch: number = this.properties.get("pitch")?.getValue();
		const yaw: number = this.properties.get("yaw")?.getValue();
		this.output.value = new Angle(roll, pitch, yaw);
	}
}
