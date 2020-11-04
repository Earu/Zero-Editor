export default class Color {
	private _red: number;
	private _green: number;
	private _blue: number;
	private _alpha: number;

	constructor(r: number, g: number, b: number, a: number = 255) {
		this._red = r;
		this._green = g;
		this._blue = b;
		this._alpha = a;
	}

	public get red(): number {
		return this._red;
	}

	public get green(): number {
		return this._green;
	}

	public get blue(): number {
		return this._blue;
	}

	public get alpha(): number {
		return this._alpha;
	}

	public toString(): string {
		return `Color [ r: ${this._red} g: ${this._green} b: ${this._blue} ]`;
	}
}