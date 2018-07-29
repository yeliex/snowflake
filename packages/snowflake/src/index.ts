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
    public static endpointId = util.endpointId;

    public static MARK_LENGTH = 1;

    public static TIME_LENGTH = 41;

    public static WORKER_LENGTH = 10;

    public static SEQUENCE_LENGTH = 12;

    public static MAX_SEQUENCE = 4095;

    public readonly worker: string;

    public readonly mark: Props.SnowFlakeMark;

    public readonly offset: number;

    private base: Buffer;

    private lastTime = 0;

    private sequence = -1;

    constructor(options: Props.SnowFlake = {}) {
        if (options.mark) {
            assert([0, 1].includes(options.mark), `mark must be 0 or 1, but got ${options.mark}`);
        }
        this.mark = options.mark || 0;

        if (util.exist(options.endpoint)) {
            this.worker = util.padStart(Number(options.endpoint).toString(2), 10, '0');
        } else if (util.exist(options.worker)) {
            this.worker = [options.worker || 0, options.datacenter || 0].map((value) => {
                return util.padStart(Number(value).toString(2), 5, '0');
            }).join('');
        } else {
            this.worker = util.padStart(Number(util.endpointId).toString(2), 10, '0');
        }

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

    static toChar(number: number, length: number) {
        return util.padStart(Number(number).toString(2), length, '0');
    }

    async buildBase(time: number) {
        time = Date.now();
        this.lastTime = time;
        const base = `${this.mark}${SnowFlake.toChar(time, 41)}${this.worker}`;
        const buf = Buffer.alloc(SnowFlake.MARK_LENGTH + SnowFlake.TIME_LENGTH + SnowFlake.WORKER_LENGTH);

        // buf.writeInt16BE(base, 0, 6);

        return base;
    }

    async getNext(current: number) {
        // 处理时间同步后的不一致
        let base = this.base;
        if (base) {
            if (current === this.lastTime) {
                if (this.sequence >= SnowFlake.MAX_SEQUENCE) {
                    await SnowFlake.wait(1);
                    this.sequence = -1;
                    base = await this.buildBase(Date.now());
                }
            }
            else if (current < this.lastTime) {
                await SnowFlake.wait(this.lastTime - current + 1);
                this.sequence = -1;
                base = await this.buildBase(current);
            } else if (current > this.lastTime) {
                this.sequence = -1;
                base = await this.buildBase(current);
            }
        } else {
            base = await this.buildBase(current);
        }

        this.sequence = ++this.sequence;

        return this.buildSequence(base, this.sequence);
    }

    buildSequence(base: string, sequence: number = this.sequence) {
        const seqStr = util.padStart(Number.parseInt(`${sequence}`, 10).toString(2), SnowFlake.SEQUENCE_LENGTH, '0');
        const seq = Number.parseInt(`${base}${seqStr}`, 2).toString(16);
        console.log(base, seqStr, seq);
        return seq;
    }

    async next() {
        return this.getNext(Date.now());
    }
}
