import { Guid } from "guid-typescript";
import React from "react";
import INode from "../nodes/INode";

export default class Editor extends React.Component {
	private nodeTable: Map<Guid, INode>;

	constructor(props: any) {
		super(props);

		this.nodeTable = new Map<Guid, INode>();
	}

	// load a pac json file and convert it to our
	// node scheme
	public loadPacJson(json: string): void {
		const jsonObj = JSON.parse(json);

		// IMPL TODO
	}

	// this will compile our nodes to a pac json file
	// so that the pac renderer can display it
	public compileToPacJson(): string {
		// IMPL TODO
		return "";
	}

	// save our node scheme to an appropriate json scheme
	// NOT THE SAME AS PAC JSON FILES
	public save(): void {
		// IMPL TODO
	}

	// load a json scheme into our node scheme
	// NOT THE SAME AS PAC JSON FILES
	public load(json: string): void {
		// IMPL TODO
	}

	public render(): JSX.Element {
		return <div/>;
	}
}