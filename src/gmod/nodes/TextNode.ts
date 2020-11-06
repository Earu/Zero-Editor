import Editor from "../../editor/components/Editor";
import NodeProperty from "../../editor/nodes/NodeProperty";
import SingleOutputNode from "../../editor/nodes/SingleOutputNodes";
import GmodNodeFactory from "../GmodNodeFactory";

export default class TextNode extends SingleOutputNode<string> {
	constructor(editor: Editor<GmodNodeFactory>, value: string) {
		super (editor, "Text", value);
		this.properties.set("value", new NodeProperty<string>(this, "value", "Text", value));
	}

	public updateOutputs(): void {
		this.output.value = this.properties.get("value")?.getValue();
	}
}