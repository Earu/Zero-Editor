import React from "react";
import Editor from "../Editor";
import NodeMenuCategory from "./NodeMenuCategory";
import NodeMenuItem from "./NodeMenuItem";
import "./NodeMenuSelector.css";

interface INodeMenuSelectorProperties {
	editor: Editor;
}

export default class NodeMenuSelector extends React.Component<INodeMenuSelectorProperties> {
	public render(): JSX.Element {
		return (<div id="node-selector-menu">
			<input type="text" placeholder="search nodes..." />
			<hr />
			<NodeMenuCategory title="Data">
				<NodeMenuItem name="Number" color="#bc316d" editor={this.props.editor} />
				<NodeMenuItem name="Toggle" color="#31bc87" editor={this.props.editor} />
				<NodeMenuItem name="Vector" color="#3151bc" editor={this.props.editor} />
				<NodeMenuItem name="Angle" color="#5831bc" editor={this.props.editor} />
				<NodeMenuItem name="Color" color="#bc31ba" editor={this.props.editor} />
			</NodeMenuCategory>
			<NodeMenuCategory title="Entity">
				<NodeMenuItem name="Model" color="#8e8e8e" editor={this.props.editor} />
			</NodeMenuCategory>
			<NodeMenuCategory title="Model">
			</NodeMenuCategory>
			<NodeMenuCategory title="Effects">
			</NodeMenuCategory>
			<NodeMenuCategory title="Modifiers">
			</NodeMenuCategory>
		</div>);
	}
}

// TODO:
// NodeCategory: to categorize nodes in the menu
// NodeItem: an item to create a specific UINode
// UINode: the UI object that represents an instance of a node