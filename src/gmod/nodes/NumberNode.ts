import Editor from "../../editor/components/Editor";
import NodeProperty from "../../editor/nodes/NodeProperty";
import SingleOutputNode from "../../editor/nodes/SingleOutputNodes";
import GmodNodeFactory from "../GmodNodeFactory";

export default class NumberNode extends SingleOutputNode<number> {
	constructor(editor: Editor<GmodNodeFactory>, value: number) {
		super (editor, "Number", value);
		this.properties.set("value", new NodeProperty<number>(this, "value", "Number", value));
	}

	public updateOutputs(): void {
		this.output.value = this.properties.get("value")?.getValue();
	}
}