import React, { useState, useMemo, useRef, SetStateAction, useEffect } from 'react';

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
    transformers: T,
    initialState: State,
    persist?: (state: React.SetStateAction<State>) => any
): [State, Dispatchers<State, T>] {
    const [state, setState] = useState<State>(initialState);
    const ref = useRef(state);
    const didChange = state === ref.current;
    ref.current = state;

    const boundTransformers: Dispatchers<State, T> = useMemo(
        () =>
            Object.keys(transformers).reduce((acc: any, key) => {
                // @ts-ignore (probably typable, but not worth it)
                acc[key] = (...args) => {
                    return setState(transformers[key](...args));
                };
                return acc;
            }, {}),
        [transformers]
    );

    useEffect(() => persist && persist(state), [persist, state]);

    return [state, boundTransformers];
}
