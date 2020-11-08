import { Guid } from "guid-typescript";
import GraphNode from "./graph/GraphNode";
import GraphNodeOutput from "./graph/GraphNodeOutput";
import BaseGraphNodeProperty from "./graph/GraphNodeProperties";

export default class UserSelectionState {
	private _selectedGraphNodes: Map<Guid, GraphNode>;
	private _selectedGraphNodeIO: GraphNodeOutput<any> | BaseGraphNodeProperty<any> | null;
	private _isGraphMoveable: boolean;

	constructor() {
		this._selectedGraphNodes = new Map<Guid, GraphNode>();
		this._selectedGraphNodeIO = null;
		this._isGraphMoveable = true;
	}

	public get selectedGraphNodes(): Map<Guid, GraphNode> {
		return this._selectedGraphNodes;
	}

	public set selectedGraphNodeIO(IO: GraphNodeOutput<any> | BaseGraphNodeProperty<any> | null) {
		this._selectedGraphNodeIO = IO;
	}

	public get selectedGraphNodeIO(): GraphNodeOutput<any> | BaseGraphNodeProperty<any> | null {
		return this._selectedGraphNodeIO;
	}

	public selectGraphNode(graphNode: GraphNode): void {
		this._selectedGraphNodes.set(graphNode.props.node.id, graphNode);
	}

	public unselectGraphNode(graphNode: GraphNode): void {
		this._selectedGraphNodes.delete(graphNode.props.node.id);
	}

	public set isGraphMoveable(moveable: boolean) {
		this._isGraphMoveable = moveable;
	}

	public get isGraphMoveable(): boolean {
		return this._isGraphMoveable;
	}

	public isGraphNodeSelected(graphNode: GraphNode): boolean {
		return this._selectedGraphNodes.has(graphNode.props.node.id);
	}
}