import React from "react";
import Editor, { IEditorNodeCategory } from "../Editor";
import NodeMenuCategory from "./NodeMenuCategory";
import NodeMenuItem from "./NodeMenuItem";
import "./NodeMenu.css";

interface INodeMenuProperties {
	editor: Editor<any>;
}

interface INodeMenuState {
	searchResults: Array<IEditorNodeCategory>;
	isSearching: boolean;
}

export default class NodeMenu extends React.Component<INodeMenuProperties, INodeMenuState> {
	constructor(props: INodeMenuProperties) {
		super(props);
		this.state = { searchResults: this.props.editor.nodeCategories, isSearching: false };
	}

	private onSearch(event: React.FormEvent<HTMLInputElement>): void {
		let currentSearch: string = event.currentTarget.value;
		if (!currentSearch || currentSearch.trim() === "") {
			this.setState({ searchResults: this.props.editor.nodeCategories, isSearching: false });
			return;
		}

		currentSearch = currentSearch.trim().toLowerCase();
		const resultLayout: Array<IEditorNodeCategory> = [];
		for(const category of this.props.editor.nodeCategories) {
			resultLayout.push({
				name: category.name,
				nodeNames: category.nodeNames.filter(nodeName => nodeName.toLowerCase().includes(currentSearch))
			});
		}

		this.setState({ searchResults: resultLayout, isSearching: true });
	}

	private renderItems(): Array<JSX.Element> {
		const results: Array<JSX.Element> = [];
		for(const category of this.state.searchResults) {
			let categoryTitle = category.name;
			if (this.state.isSearching)
				categoryTitle += ` (${category.nodeNames.length})`;

			results.push(<NodeMenuCategory key={`node_menu_category_${category.name}`} title={categoryTitle}>
				{category.nodeNames.map(nodeName => <NodeMenuItem key={`node_menu_item_${category.name}_${nodeName}`} name={nodeName} editor={this.props.editor} />)}
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