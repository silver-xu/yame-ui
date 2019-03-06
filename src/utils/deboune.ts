export type Procedure = (...args: any[]) => void;

const timeout: { [funcName: string]: NodeJS.Timeout } = {};

export const debounce = <F extends Procedure>(func: F, wait: number) => {
    return (...args: any[]) => {
        if (timeout[func.name]) {
            clearTimeout(timeout[func.name]);
        }

        timeout[func.name] = setTimeout(() => {
            delete timeout[func.name];
            func.apply(null, args);
        }, wait);
    };
};
