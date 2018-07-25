export default class RequestError extends Error {
    public readonly code: number;

    constructor(code: number)
    constructor(code: number, message: string)
    constructor(message: string)
    constructor(code: number | string, message?: string) {
        if (!message && typeof code === 'string') {
            message = code;
            code = 500;
        }
        super(message);
        this.code = <number>code;
    }
}
