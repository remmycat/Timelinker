import React, { useMemo, SetStateAction, Dispatch } from 'react';

type AnyFunction = (...args: any[]) => any;
type ArgType<T extends AnyFunction> = T extends (...args: infer A) => any ? A : any;

export type Transform<State> = SetStateAction<State>;

type TransformerObject<State> = {
    [key: string]: (...args: any) => React.SetStateAction<State>;
};

export type Dispatchers<State, T extends TransformerObject<State>> = {
    [K in keyof T]: (...args: ArgType<T[K]>) => ReturnType<React.Dispatch<ReturnType<T[K]>>>
};

export default function useTransformers<State, T extends TransformerObject<State>>(
    setState: Dispatch<SetStateAction<State>>,
    transformers: T
): Dispatchers<State, T> {
    return useMemo(
        () =>
            Object.keys(transformers).reduce((acc: any, key) => {
                // @ts-ignore (probably typable, but not worth it)
                acc[key] = (...args) => {
                    return setState(transformers[key](...args));
                };
                return acc;
            }, {}),
        [setState, transformers]
    );
}
