import Store from 'electron-store';
import { SetStateAction } from 'react';
import { WebContents, WebviewTag } from 'electron';
import { PresetState } from './presets/PresetState';
import { ColumnState } from './columns/ColumnState';

declare global {
    interface ElectronStore<T> extends Store<T> {
        update(key: keyof T, updater: SetStateAction<T>): void;
    }
    type SharedState = {
        presets: PresetState;
    };
    type SpaceState = {
        columns: ColumnState;
    };
    type SharedStore = ElectronStore<SharedState>;
    type SpaceStore = ElectronStore<SpaceState>;

    interface Window {
        SpaceStore: SpaceStore;
        SharedStore: SharedStore;
        API: {
            openURL: (url: string) => boolean;
            resetChildZoomBoundaries: () => void;
        };
        Metadata: {
            SpaceId: string;
        };
        env: {
            macos: boolean;
            linux: boolean;
            windows: boolean;
            main: boolean;
            renderer: boolean;
            development: boolean;
            usingAsar: boolean;
            macAppStore: boolean;
            windowsStore: boolean;
        };
        Logs: {
            [key: string]: undefined | Array<[number, string]>;
        };
    }

    interface HTMLWebviewElement extends WebviewTag {}
}
