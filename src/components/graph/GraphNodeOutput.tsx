import React from "react";
import { NodeOutput } from "../../nodes/Node";
import "./GraphNodeOutput.css";

interface IGraphNodeOutputProperties<T> {
	name: string;
	output: NodeOutput<T>;
}

export default class GraphNodeOutput<T> extends React.Component<IGraphNodeOutputProperties<T>> {
	public render(): JSX.Element {
		return (<div className="graph-node-output">
			<span>{this.props.name}</span>
			<div className="user-selection"/>
		</div>);
	}
}