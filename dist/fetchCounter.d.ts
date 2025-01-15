import type { ResponseData } from './types.js';
export declare function fetchVersions(image: string): Promise<ResponseData>;
declare function fetchCounter(image: string, prefix: string, options?: {
    fetcher?: typeof fetchVersions;
}): Promise<number>;
export default fetchCounter;
