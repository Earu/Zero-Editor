import React from "react";
import NodeMenuCategory from "./NodeMenuCategory";
import "./NodeMenuSelector.css";

export default class NodeMenuSelector extends React.Component {
	public render(): JSX.Element {
		return (<div id="node-selector-menu">
			<input type="text" placeholder="search nodes..." />
			<hr />
			<NodeMenuCategory title="Data">
			</NodeMenuCategory>
			<NodeMenuCategory title="Entity">
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