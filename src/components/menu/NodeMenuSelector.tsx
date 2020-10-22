import React from "react";
import NodeMenuCategory from "./NodeMenuCategory";
import NodeMenuItem from "./NodeMenuItem";
import "./NodeMenuSelector.css";

export default class NodeMenuSelector extends React.Component {
	public render(): JSX.Element {
		return (<div id="node-selector-menu">
			<input type="text" placeholder="search nodes..." />
			<hr />
			<NodeMenuCategory title="Data">
				<NodeMenuItem name="Number" color="#bc316d" />
				<NodeMenuItem name="Toggle" color="#31bc87" />
				<NodeMenuItem name="Vector" color="#3151bc" />
				<NodeMenuItem name="Angle" color="#5831bc" />
				<NodeMenuItem name="Color" color="#bc31ba" />
			</NodeMenuCategory>
			<NodeMenuCategory title="Entity">
				<NodeMenuItem name="Model" color="#8e8e8e" />
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