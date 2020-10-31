export default class Color {
	private _red: number;
	private _green: number;
	private _blue: number;
	private _alpha: number;

	constructor(r: number, g: number, b: number, a: number = 255) {
		this._red = r % 256;
		this._green = g % 256;
		this._blue = b % 256;
		this._alpha = a % 256;
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