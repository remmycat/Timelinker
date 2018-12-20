import { useMemo, useState, useCallback, SetStateAction } from 'react';
import ElectronStore from 'electron-store';
import useNodeListener from './useNodeListener';
import { EventEmitter } from 'events';

export type StateType<T> = T extends ElectronStore<infer A> ? A : any;

type FunctionalSetState<S> = (old: S) => S;

function isFunctionalSetState<S>(action: React.SetStateAction<S>): action is FunctionalSetState<S> {
    return typeof action === 'function';
}

export default function useElectronState<
    Store extends ElectronStore<any>,
    K extends keyof StateType<Store>
>(
    store: Store,
    key: K,
    defaultValue?: StateType<Store>[K],
    updateTrigger?: [EventEmitter, string]
) {
    const initialState: StateType<Store>[K] = useMemo(() => store.get(key, defaultValue), [key]);
    const [state, setState] = useState(initialState);

    const monkeyPatchedSetState = useCallback(
        (update: SetStateAction<StateType<Store>[K]>) => {
            const newState = isFunctionalSetState(update)
                ? update(store.get(key, defaultValue))
                : update;
            store.set(key, newState);
            return setState(newState);
        },
        [key]
    );

    const ee = updateTrigger && updateTrigger[0];
    const eeKey = updateTrigger && updateTrigger[1];
    // we know eeKey is defined as soon as ee is defined
    useNodeListener(ee, eeKey!, () => setState(store.get(key)), [key]);

    return [state, monkeyPatchedSetState] as [StateType<Store>[K], typeof setState];
}
