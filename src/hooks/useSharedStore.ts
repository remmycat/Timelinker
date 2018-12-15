import useElectronStore from './useElectronStore';

export default function useSharedStore<K extends keyof SharedState>(
    key: K,
    defaultValue?: SharedState[K]
) {
    return useElectronStore(window.SharedStore, key, defaultValue);
}
