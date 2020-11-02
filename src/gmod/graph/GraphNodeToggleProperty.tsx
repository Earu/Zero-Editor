import React from "react";
import BaseGraphNodeProperty from "../../editor/components/graph/GraphNodeProperties";

export default class GraphNodeBooleanProperty extends BaseGraphNodeProperty<boolean> {
	private inputBoolean: React.RefObject<HTMLInputElement>;

	constructor(props: any) {
		super(props);
		this.inputBoolean = React.createRef();
	}

	protected update(): void {
		if (this.inputBoolean.current) {
			this.inputBoolean.current.value = this.props.property.getValue().toString();
			this.inputBoolean.current.disabled = this.props.property.linkedOutput !== null;
		}

		this.updateNodeOutput();
	}

	public updateNodeOutput(): void {
		if (this.inputBoolean.current) {
			const userInput: boolean = this.inputBoolean.current.value.toLowerCase() === "true";
			this.props.property.staticValue = userInput;
		}

		this.props.node.updateOutputs();
	}

	public render(): JSX.Element {
		return (<div className="graph-node-property" onMouseUp={this.onMouseUp.bind(this)} >
			<div className="user-selection" ref={this._userSelectionRef} onMouseDown={this.onMouseDown.bind(this)} />
			<input id={this.props.id} type="checkbox" placeholder={this.props.name}
				defaultChecked={this.props.property.getValue()} onChange={this.updateNodeOutput.bind(this)} ref={this.inputBoolean} />
			<label className="graph-node-property-checkbox-label" htmlFor={this.props.id}>{this.props.name}</label>
		</div>);
	}
}