import Editor from "../../editor/components/Editor";
import NodeProperty from "../../editor/nodes/NodeProperty";
import SingleOutputNode from "../../editor/nodes/SingleOutputNode";
import GmodNodeFactory from "../GmodNodeFactory";

export default class ToggleNode extends SingleOutputNode<boolean> {
	constructor(editor: Editor<GmodNodeFactory>, value: boolean) {
		super (editor, "Toggle", value);
		this.properties.set("value", new NodeProperty<boolean>(this, "value", "Toggle", value));
	}

	public updateOutputs(): void {
		this.output.value = this.properties.get("value")?.getValue();
	}
}