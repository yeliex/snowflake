import * as assert from 'assert';
import * as util from './libs/util';

export namespace Props {
    export type SnowFlakeMark = 0 | 1;

    export interface SnowFlake {
        mark?: SnowFlakeMark
        datacenter?: number
        worker?: number
        endpoint?: number
        offset?: number
    }
}

export default class SnowFlake {
    static default = SnowFlake;

    public static readonly endpointId = util.endpointId;

    public static readonly MAX_SEQUENCE = 0xFFF;

    public static readonly MAX_ENDPOINT = 0x3FF;

    public static readonly MAX_WORKER = 0x1F;

    public static readonly MAX_DATACENTER = 0x1F;

    public readonly worker: number;

    public readonly mark: Props.SnowFlakeMark;

    public readonly offset: number;

    private base: Buffer;

    private lastTime = 0;

    private timeCache2 = 0;
    private timeCache3 = 0;

    private sequence = -1;

    private clear = true;

    constructor(options: Props.SnowFlake = {}) {
        if (options.mark) {
            assert([0, 1].includes(options.mark), `mark must be 0 or 1, but got ${options.mark}`);
        }
        this.mark = options.mark || 0;

        if (util.exist(options.endpoint)) {
            this.worker = <any>options.endpoint & SnowFlake.MAX_ENDPOINT;
        } else if (util.exist(options.worker)) {
            this.worker = (((options.datacenter || 0) & SnowFlake.MAX_DATACENTER) << 5) | ((options.worker || 0) & SnowFlake.MAX_WORKER);
        } else {
            this.worker = <any>SnowFlake.endpointId & SnowFlake.MAX_ENDPOINT;
        }

        this.worker <<= 11;

        if (options.offset) {
            assert(!Number.isNaN(options.offset), `offset must be number of timestamp, but got ${typeof options.offset}`);
        }

        this.offset = options.offset || 0;
    }

    static async wait(ms: number) {
        return new Promise((rec) => {
            setTimeout(rec, ms);
        });
    }

    private genBase(current: number) {
        const id = Buffer.alloc(8, 0);
        const timeUInt = util.padStart(Number(current - this.offset).toString(2), 41);
        const time = Number.parseInt(`${this.mark}${timeUInt}`, 2);

        id.writeUInt16BE(Math.floor(time / (1 << 27) & 0xFFFF), 0);
        id.writeUInt16BE(Math.floor(time / (1 << 11) & 0xFFFF), 2);

        this.timeCache2 = (time & 0x7) << 21;
        this.timeCache3 = Math.floor(time / (1 << 3) & 0xFF);

        this.base = id;
        this.clear = false;
        return id;
    }

    private genId(current: number) {
        const sequence = this.sequence = this.clear ? 0 : this.sequence + 1;
        const id = Buffer.from(this.clear ? this.genBase(current) : this.base);
        id.writeInt32BE(this.timeCache2 | this.worker | sequence, 4);
        id.writeUInt8(this.timeCache3, 4);
        return id;
    }

    async next(encoding?: BufferEncoding) {
        const current = Date.now();

        if (current === this.lastTime && this.sequence < SnowFlake.MAX_SEQUENCE) {
            return this.genId(current);
        } else if (current > this.lastTime) {
            // 更新时间
            this.lastTime = current;
            this.clear = true;
            const id = this.genId(current);
            return encoding ? id.toString(encoding) : id;
        } else if (current < this.lastTime) {
            // 当前时间小于上次时间, 则等待时间一致
            await SnowFlake.wait(this.lastTime - current);
            this.clear = true;
        } else if (this.sequence >= SnowFlake.MAX_SEQUENCE) {
            // sequence已经用完了 续一秒
            await SnowFlake.wait(1);
            this.clear = true;
        }
        const time = this.lastTime = Date.now();
        const id = this.genId(time);
        return encoding ? id.toString(encoding) : id;
    }
}
