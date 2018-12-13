import Store from 'electron-store'; //eslint-disable-line
import { PresetState } from './presets/PresetState'; //eslint-disable-line
import { ColumnState } from './columns/ColumnState'; //eslint-disable-line

declare global {
    interface ElectronStore<T> extends Store<T> {
        update<K extends keyof T>(key: K, updater: (old: T[K]) => T[K]): T[K];
    }
    type AppState = {
        presets: PresetState;
    };
    type SpaceState = {
        columns: ColumnState;
    };
    type AppStore = ElectronStore<AppState>;
    type SpaceStore = ElectronStore<SpaceState>;

    interface Window {
        SpaceId: string;
        SpaceStore: SpaceStore;
        AppStore: AppStore;
        API: {
            openURL: (url: string) => boolean;
        };
    }
}
