export interface IJsonOutput {
	name: string;
	type: string;
	value: any
}

export interface IJsonProperty {
	name: string;
	type: string;
	staticValue: any;
	linkedOutput: { nodeId: string, outputName: string } | null
}

export interface IJsonNode {
	id: string;
	x: number;
	y: number;
	name: string;
	properties: Array<IJsonProperty>;
	outputs: Array<IJsonOutput>;
}