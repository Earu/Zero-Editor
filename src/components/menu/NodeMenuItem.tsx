import React from "react";
import "./NodeMenuItem.css";

interface INodeMenuItemProperties {
	name: string;
	color: string;
}

export default class NodeMenuItem extends React.Component<INodeMenuItemProperties> {
	public render(): JSX.Element {
		return (<div className="node-menu-item" style={{ backgroundImage: `linear-gradient(to right, ${this.props.color}, #111)` }}>
			<div>{this.props.name}</div>
		</div>);
	}
}