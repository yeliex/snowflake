import { resolve } from 'path';
import * as fs from 'fs';
import { strict as assert } from 'assert';
import { load } from 'js-yaml';
import { cloneDeep, defaultsDeep, get, set } from 'lodash-es';
import Debug from 'debug';
import { fileURLToPath } from 'url';
import DefaultConfig from './DefaultConfig.js';

const debug = Debug('snowflake:config');

export namespace Props {
    export interface Configs {
        server: {
            listenPort: number;
        },
        snowflake: {
            offset?: number;
            datacenter?: number;
            worker?: number;
            endpoint?: number;
        },
        security: {
            token: string[];
        }
    }

    export interface InputConfig {
        [key: string]: any;
    }
}

const custromConfig = process.env.NODE_ENV === 'production' ? resolve('/snowflake/config/config.yml') : resolve(
    fileURLToPath(import.meta.url),
    '../../../config/config.yml',
);

class Config {
    static load() {
        debug('start load');

        const config = new Config(defaultsDeep(Config.loadFile(custromConfig), DefaultConfig));

        return config;
    }

    private static loadFile(path: string) {
        const fileExist = fs.statSync(path);
        if (!fileExist) {
            return {};
        }
        assert(fileExist.isFile(), `config file is not a valid file: ${path}`);

        const str = fs.readFileSync(path, 'utf8');

        const config = load(str);

        if (!config) {
            return {};
        }

        assert(typeof config === 'object', 'config set must be object');

        return config;
    }

    static check(obj: Props.InputConfig): Props.Configs {
        const config = <Props.Configs> cloneDeep(obj);

        ['server.listenPort'].forEach((key) => {
            const value = Number(get(config, key));

            assert(value && !Number.isNaN(value), `${key} must be number, but got ${typeof get(obj, key)}`);
            set(config, key, value);
        });

        (() => {
            const key = 'security.token';
            const value = get(config, key);
            if (value) {
                assert(Array.isArray(value), `${key} must be string[], but got ${typeof value}`);
            }
        })();

        (() => {
            const key = 'snowflake.offset';
            const value = Number(get(config, key));
            if (value) {
                assert(!Number.isNaN(value), `${key} must be number of timestamp, but got ${typeof get(obj, key)}`);
            }
            set(config, key, value);
        })();

        ['snowflake.worker', 'snowflake.datacenter', 'snowflake.endpoint'].forEach((key) => {
            const value = Number(get(config, key));
            if (value) {
                assert(!Number.isNaN(value), `${key} must be number, but got ${typeof get(obj, key)}`);
            }
        });

        return config;
    }

    protected readonly config: Props.Configs;

    constructor(config: Props.InputConfig) {
        this.config = this.getter(Config.check(config));
    }

    private getter<T>(obj: T): T {
        const config = {};

        if (typeof obj !== 'object' || obj === null || obj === undefined) {
            return obj;
        }

        Object.defineProperties(config, Object.keys(obj).reduce((total: any, key) => {
            const value = (<any> obj)[key];

            total[key] = <PropertyDescriptor> {
                enumerable: true,
                get: () => {
                    return (typeof value === 'object' && !Array.isArray(value)) ? this.getter(value) : value;
                },
            };
            return total;
        }, {}));

        return <T> config;
    }

    get server() {
        return this.config.server;
    }

    get security() {
        return this.config.security;
    }

    get snowflake() {
        return this.config.snowflake;
    }
}

const config = Config.load();

debug(JSON.stringify(config));

export default config;
