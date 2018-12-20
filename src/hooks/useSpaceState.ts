import useElectronState, { StateType } from './useElectronState';
import { SpaceStore } from '../Injected';

export default function useSpaceState<K extends keyof StateType<typeof SpaceStore>>(
    key: K,
    defaultValue?: StateType<typeof SpaceStore>[K]
) {
    return useElectronState(SpaceStore, key, defaultValue);
}
