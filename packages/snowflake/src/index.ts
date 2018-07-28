import * as assert from 'assert';

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
    public static MARK_LENGTH = 1;

    public static TIME_LENGTH = 41;

    public static WORKER_LENGTH = 10;

    public static SEQUENCE_LENGTH = 12;

    public readonly worker: string;

    public readonly mark: Props.SnowFlakeMark;

    public readonly offset: number;

    private base: string;

    private lastTime = 0;

    private sequence = 0;

    constructor(options: Props.SnowFlake = {}) {
        if (options.mark) {
            assert([0, 1].includes(options.mark), `mark must be 0 or 1, but got ${options.mark}`);
        }
        this.mark = options.mark || 0;

        assert((options.worker || options.worker === 0) || (options.endpoint || options.worker === 0), 'worker or endpoint must not be null');

        if (options.endpoint) {
            this.worker = Number(options.endpoint).toString(2).padStart(10, '0');
        } else {
            this.worker = [options.worker || 0, options.datacenter || 0].map((value) => {
                return Number(value).toString(2).padStart(5, '0');
            }).join('');
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
        return Number(number).toString(2).padStart(length, '0');
    }

    async buildBase(current: number) {
        if (current < this.lastTime) {
            await SnowFlake.wait(this.lastTime - current);
            this.sequence = 0;
        }
        const time = Date.now();
        this.lastTime = time;
        const base = `${this.mark}${SnowFlake.toChar(time, 41)}${this.worker}`;
        this.base = base;
        return base;
    }

    buildSequence(base: string) {
        const sequence = ++this.sequence;

        return Number.parseInt(`${base}${sequence}`, 2).toString(16);
    }

    async next() {
        const current = Date.now();
        const base = current === this.lastTime ? this.base : await this.buildBase(current);
        return this.buildSequence(base);
    }
}
