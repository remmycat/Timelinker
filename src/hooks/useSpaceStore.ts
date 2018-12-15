import useElectronStore from './useElectronStore';

export default function useSpaceStore<K extends keyof SpaceState>(
    key: K,
    defaultValue?: SpaceState[K]
) {
    return useElectronStore(window.SpaceStore, key, defaultValue);
}
