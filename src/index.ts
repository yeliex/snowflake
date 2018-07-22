export namespace Props {
  export type SnowFlakeMark = 0 | 1;

  export interface SnowFlake {
    mark?: SnowFlakeMark
    datacenterId?: number
    workerId?: number
    timestampLeft?: number

  }
}

export default class SnowFlake {
  public readonly workerId: number;

  public readonly datacenterId: number;

  public readonly mark: Props.SnowFlakeMark;

  constructor(options: Props.SnowFlake = {}) {
    this.datacenterId = options.datacenterId || 0;

  }
}
