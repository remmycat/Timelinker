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
            isFunctionalSetState(update) ? store.update(key, update) : store.set(key, update);
        },
        [key]
    );
    return [persistedState, setState] as [StateType<Store>[K], typeof setState];
}

export function useSpaceStore<K extends keyof SpaceState>(key: K, defaultValue?: SpaceState[K]) {
    return useElectronStore(window.SpaceStore, key, defaultValue);
}

export function useAppStore<K extends keyof AppState>(key: K) {
    return useElectronStore(window.AppStore, key);
}

// export function useSpaceState<K extends keyof SpaceState>(key: K, defaultValue?: SpaceState[K]) {
//     const store = window.SpaceStore;
//     const persistedState = useMemo(() => store.get(key, defaultValue), [key]);
//     const setValue = useCallback((value: SpaceState[K]) => store.set(key, value), [key]);
//     return [persistedState, setValue] as [SpaceState[K], typeof setValue];
// }

// export function useAppState<K extends keyof AppState>(key: K) {
//     const store = window.AppStore;
//     const persistedState = useMemo(() => store.get(key), [key]);
//     const updateValue = useCallback(
//         (updater: (old: AppState[K]) => AppState[K]) => store.update(key, updater),
//         [key]
//     );

//     return [persistedState, updateValue] as [AppState[K], typeof updateValue];
// }
