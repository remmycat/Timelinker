import { useMemo, useCallback } from 'react';

type StateType<T> = T extends ElectronStore<infer A> ? A : any;
type StateKey<T> = keyof StateType<T>;

type FunctionalSetState<S> = (old: S) => S;

function isFunctionalSetState<S>(action: React.SetStateAction<S>): action is FunctionalSetState<S> {
    return typeof action === 'function';
}

export default function useElectronStore<
    Store extends ElectronStore<any>,
    K extends keyof StateType<Store>
>(store: Store, key: K, defaultValue?: StateType<Store>[K]) {
    const persistedState: StateType<Store>[K] = useMemo(() => store.get(key, defaultValue), [key]);
    const setState = useCallback(
        (update: React.SetStateAction<StateType<Store>[K]>) => {
            isFunctionalSetState(update)
                ? store.set(key, update(store.get(key, defaultValue)))
                : store.set(key, update);
        },
        [key]
    );
    return [persistedState, setState] as [StateType<Store>[K], typeof setState];
}
