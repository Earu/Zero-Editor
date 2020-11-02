import React from "react";
import BaseGraphNodeProperty from "../../editor/components/graph/GraphNodeProperties";

export default class GraphNodeNumberProperty extends BaseGraphNodeProperty<number> {
	private inputNumber: React.RefObject<HTMLInputElement>;

	constructor(props: any) {
		super(props);
		this.inputNumber = React.createRef();
	}

	protected update(): void {
		if (this.inputNumber.current) {
			this.inputNumber.current.value = this.props.property.getValue().toString();
			this.inputNumber.current.disabled = this.props.property.linkedOutput !== null;
		}

		this.updateNodeOutput();
	}

	private updateNodeOutput(): void {
		if (this.inputNumber.current) {
			const userInput: number = parseFloat(this.inputNumber.current?.value);
			if (!isNaN(userInput)) {
				this.props.property.staticValue = userInput;
			}
		}

		this.props.node.updateOutputs();
	}

	public render(): JSX.Element {
		return (<div className="graph-node-property" onMouseUp={this.onMouseUp.bind(this)} >
			<div className="user-selection" ref={this._userSelectionRef} onMouseDown={this.onMouseDown.bind(this)} />
			<label htmlFor={this.props.id}>{this.props.name}</label>
			<input className="graph-node-property-text-input" id={this.props.id} type="text" placeholder={this.props.name}
				defaultValue={this.props.property.getValue()} onChange={this.updateNodeOutput.bind(this)} ref={this.inputNumber} />
		</div>);
	}
}
