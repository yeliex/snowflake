import { accessSync, PathLike, readFileSync } from 'fs';
import { resolve } from 'path';
import * as os from 'os';

export const padStart = (string: string, maxLength: number, fillString?: string) => {
    const length = string.length;
    if (length === maxLength) {
        return string;
    }
    if (length > maxLength) {
        return string.substr(0, maxLength);
    }
    return string.padStart(maxLength, fillString);
};

export const exist = (str?: string | number) => {
    return !!(str || str === 0 || str === '');
};

export namespace fs {
    export const existSync = (path: PathLike, mode?: number) => {
        try {
            accessSync(path, mode);
            return true;
        } catch (e) {
            return false;
        }
    };
}

const filePaths = {
    initFile: resolve('/.dockerinit'),
    envFile: resolve('/.dockerenv'),
    cgroup: resolve('/proc/1/cgroup')
};

let isContainer = fs.existSync(filePaths.initFile) || fs.existSync(filePaths.envFile);

if (!isContainer && fs.existSync(filePaths.cgroup)) {
    isContainer = (readFileSync(filePaths.cgroup, 'utf8') || '').includes('docker');
}

export const pidInt16 = Number(process.pid).toString(16);

export const ip = ((os.networkInterfaces().en0 || []).filter(({family}) => family === 'IPv4')[0] || {}).address || '';

export const ipInt16 = (() => {
    return ip.split('.').map((str) => {
        return padStart(Number(str).toString(16), 2, '0');
    }).join('');
})();

let id: string;
if (isContainer && process.env.HOSTNAME) {
    id = padStart(Number.parseInt(process.env.HOSTNAME, 36).toString(2), 10, '0');
} else {
    id = padStart(Number.parseInt(ipInt16, 16).toString(2), 10, '0');
}

export const endpointId = id;
