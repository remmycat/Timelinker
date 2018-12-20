import useElectronState, { StateType } from './useElectronState';
import { SharedStore, SpaceEvents } from '../Injected';

export default function useSharedState<K extends keyof StateType<typeof SharedStore>>(
    key: K,
    defaultValue?: StateType<typeof SharedStore>[K]
) {
    return useElectronState(SharedStore, key, defaultValue, [SpaceEvents, 'shared-store-updated']);
}
