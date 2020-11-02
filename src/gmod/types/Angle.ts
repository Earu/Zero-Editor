export default class Angle {
	private _roll: number;
	private _pitch: number;
	private _yaw: number;

	constructor(roll: number, pitch: number, yaw: number) {
		this._roll = roll;
		this._pitch = pitch;
		this._yaw = yaw;
	}

	public get roll(): number {
		return this._roll;
	}

	public get pitch(): number {
		return this._pitch;
	}

	public get yaw(): number {
		return this._yaw;
	}

	public toString(): string {
		return `Angle [ roll: ${this._roll} pitch: ${this._pitch} yaw: ${this.yaw} ]`;
	}
}