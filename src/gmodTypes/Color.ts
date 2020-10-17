export default class Color {
	private _red: number;
	private _green: number;
	private _blue: number;
	private _alpha: number;

	constructor(r: number, g: number, b: number, a: number = 255) {
		this._red = r % 255;
		this._green = g % 255;
		this._blue = b % 255;
		this._alpha = a % 255;
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
}