// @ts-ignore
import prependHttp from 'prepend-http';

export default function prepend(url: string): string {
    return prependHttp(url, { https: true });
}
