export default class Vector {
	private _x: number;
	private _y: number;
	private _z: number;

	constructor(x: number, y: number, z: number) {
		this._x = x;
		this._y = y;
		this._z = z;
	}

	public get x(): number {
		return this._x;
	}

	public get y(): number {
		return this._y;
	}

	public get z(): number {
		return this._z;
	}
}