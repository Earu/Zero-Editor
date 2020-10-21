import React from "react";
import "./NodeSelector.css";

export default class NodeSelector extends React.Component {
	public render(): JSX.Element {
		return (<div id="node-selector-menu">
			<input type="text" placeholder="search nodes..." />
			<hr />
		</div>);
	}
}

// TODO:
// NodeCategory: to categorize nodes in the menu
// NodeItem: an item to create a specific UINode
// UINode: the UI object that represents an instance of a node