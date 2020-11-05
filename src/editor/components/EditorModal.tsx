import React from "react";
import "./EditorModal.css";

interface IEditorModalProperties {
	title: string;
	message: string;
	onClose: () => void;
	style: React.CSSProperties;
}

export default class EditorModal extends React.Component<IEditorModalProperties> {
	public render(): JSX.Element {
		return (<div className="modal" style={this.props.style}>
			<div className="header">
				<span>{this.props.title}</span>
				<button onClick={this.props.onClose}>x</button>
			</div>
			<div className="content">
				<div className="message">{this.props.message}</div>
				{this.props.children}
			</div>
		</div>);
	}
}