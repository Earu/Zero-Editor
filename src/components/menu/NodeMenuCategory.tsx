import React from "react";
import "./NodeMenuCategory.css";

interface INodeMenuCategoryProperties {
	title: string;
}

export default class NodeMenuCategory extends React.Component<INodeMenuCategoryProperties> {
	private onShowHide(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
		const target = event.currentTarget;

		// we do that because this is either fired from the header btn either from the header itself
		const category = target.className === "header" ?
			target.parentElement : target.parentElement?.parentElement;

		if (!category) return;

		const contentContainer: HTMLElement = category.getElementsByClassName("content")[0] as HTMLElement;
		const header: HTMLElement = category.getElementsByClassName("header")[0] as HTMLElement;
		if (!header || !contentContainer) return;

		const btn: HTMLButtonElement = header.getElementsByTagName("button")[0];
		if (!btn) return;

		const isHidden = contentContainer.style.display === "none";
		if (!isHidden) {
			contentContainer.style.display = "none";
			btn.textContent = "+";
		} else {
			contentContainer.style.display = "block";
			btn.textContent = "-";
		}
	}

	public render(): JSX.Element {
		return (<div className="node-menu-category">
			<div className="header" onClick={this.onShowHide}>
				<span>{this.props.title}</span>
				<button disabled>-</button>
			</div>
			<div className="content">
				{this.props.children}
			</div>
		</div>);
	}
}