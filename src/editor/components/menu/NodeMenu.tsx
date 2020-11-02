import React from "react";
import Editor from "../Editor";
import NodeMenuCategory from "./NodeMenuCategory";
import NodeMenuItem from "./NodeMenuItem";
import "./NodeMenu.css";

interface INodeMenuProperties {
	editor: Editor<any>;
}

interface INodeMenuState {
	searchResults: Map<string, Array<string>>;
	isSearching: boolean;
}

const MENU_LAYOUT: Map<string, Array<string>> = new Map<string, Array<string>>();
MENU_LAYOUT.set("Data", [ "Number", "Toggle", "Vector", "Angle", "Color" ]);
MENU_LAYOUT.set("Entity", [ "Model" ]);
MENU_LAYOUT.set("Model", []);
MENU_LAYOUT.set("Effects", []);
MENU_LAYOUT.set("Model", []);
MENU_LAYOUT.set("Modifiers", []);

export default class NodeMenu extends React.Component<INodeMenuProperties, INodeMenuState> {
	constructor(props: INodeMenuProperties) {
		super(props);
		this.state = { searchResults: MENU_LAYOUT, isSearching: false };
	}

	private onSearch(event: React.FormEvent<HTMLInputElement>): void {
		let currentSearch: string = event.currentTarget.value;
		if (!currentSearch || currentSearch.trim() === "") {
			this.setState({ searchResults: MENU_LAYOUT, isSearching: false });
			return;
		}

		currentSearch = currentSearch.trim().toLowerCase();
		const resultLayout = new Map<string, Array<string>>();
		for(const [categoryName, itemNames] of MENU_LAYOUT) {
			resultLayout.set(categoryName, itemNames.filter(itemName => itemName.toLowerCase().includes(currentSearch)));
		}

		this.setState({ searchResults: resultLayout, isSearching: true });
	}

	private renderItems(): Array<JSX.Element> {
		const results: Array<JSX.Element> = [];
		for(const [categoryName, itemNames] of this.state.searchResults) {
			let categoryTitle = categoryName;
			if (this.state.isSearching)
				categoryTitle += ` (${itemNames.length})`;

			results.push(<NodeMenuCategory key={`node_menu_category_${categoryName}`} title={categoryTitle}>
				{itemNames.map(itemName => <NodeMenuItem key={`node_menu_item_${categoryName}_${itemName}`} name={itemName} editor={this.props.editor} />)}
			</NodeMenuCategory>);
		}

		return results;
	}

	public render(): JSX.Element {
		return (<div id="node-selector-menu">
			<input type="text" placeholder="search nodes..." onInput={this.onSearch.bind(this)} />
			<hr />
			{this.renderItems()}
		</div>);
	}
}