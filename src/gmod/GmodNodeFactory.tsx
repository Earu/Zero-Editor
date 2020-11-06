import React from "react";
import Graph from "../editor/components/graph/Graph";
import Node from "../editor/nodes/Node";
import NodeFactory from "../editor/nodes/NodeFactory";
import NodeProperty from "../editor/nodes/NodeProperty";
import AngleNode from "./nodes/AngleNode";
import ColorNode from "./nodes/ColorNode";
import NumberNode from "./nodes/NumberNode";
import ToggleNode from "./nodes/ToggleNode";
import VectorNode from "./nodes/VectorNode";
import ModelNode from "./nodes/ModelNode";
import TextNode from "./nodes/TextNode";
import Angle from "./types/Angle";
import Color from "./types/Color";
import Vector from "./types/Vector";
import GraphNodeAngleProperty from "./graph/GraphNodeAngleProperty";
import GraphNodeVectorProperty from "./graph/GraphNodeVectorProperty";
import GraphNodeColorProperty from "./graph/GraphNodeColorProperty";
import GraphNodeNumberProperty from "./graph/GraphNodeNumberProperty";
import GraphNodeToggleProperty from "./graph/GraphNodeToggleProperty";
import GraphNodeTextProperty from "./graph/GraphNodeTextProperty";

export default class GmodNodeFactory extends NodeFactory {
	public createNode<T extends Node>(name: string): T | null {
		if (!this.editor) return null;

		let node: Node | null;
		switch (name) {
			case "Number":
				node = new NumberNode(this.editor, 0);
				break;
			case "Text":
				node = new TextNode(this.editor, "");
				break;
			case "Toggle":
				node = new ToggleNode(this.editor, false);
				break;
			case "Angle":
				node = new AngleNode(this.editor, new Angle(0, 0, 0));
				break;
			case "Vector":
				node = new VectorNode(this.editor, new Vector(0, 0, 0));
				break;
			case "Color":
				node = new ColorNode(this.editor, new Color(255, 255, 255, 255));
				break;
			case "Model":
				node = new ModelNode(this.editor);
				break;
			default:
				node = null;
				break;
		}

		return node as unknown as T;
	}

	public createGraphNodeProperty(htmlId: string, node: Node, property: NodeProperty<any>, graph: Graph): JSX.Element {
		switch (property.typeName) {
			case "Toggle":
				return <GraphNodeToggleProperty id={htmlId} key={htmlId} node={node}
					name={property.name} property={property} graph={graph} />;
			case "Number":
				return <GraphNodeNumberProperty id={htmlId} key={htmlId} node={node}
					name={property.name} property={property} graph={graph} />;
			case "Vector":
				return <GraphNodeVectorProperty id={htmlId} key={htmlId} node={node}
					name={property.name} property={property} graph={graph} />;
			case "Angle":
				return <GraphNodeAngleProperty id={htmlId} key={htmlId} node={node}
					name={property.name} property={property} graph={graph}/>;
			case "Color":
				return <GraphNodeColorProperty id={htmlId} key={htmlId} node={node}
					name={property.name} property={property} graph={graph} />;
			case "Text":
				return <GraphNodeTextProperty id={htmlId} key={htmlId} node={node}
					name={property.name} property={property} graph={graph} />;
			default:
				return <div/>;
		}
	}

	public getNodeColor(nodeName: string): string {
		switch (nodeName) {
			case "Number":
				return "#bc316d"; // red
			case "Text":
				return "#db9a59"; // orange
			case "Toggle":
				return "#31bc87"; // green
			case "Vector":
				return "#3151bc"; // blue
			case "Angle":
				return "#5831bc"; // purple
			case "Color":
				return "#bc31ba"; // pink
			default:
				return "#8e8e8e"; // gray
		}
	}
}