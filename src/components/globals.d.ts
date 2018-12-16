import Store from 'electron-store';
import { WebContents } from 'electron';
import { PresetState } from './presets/PresetState';
import { ColumnState } from './columns/ColumnState';

declare global {
    interface ElectronStore<T> extends Store<T> {}
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
        Logs: {
            [key: string]: undefined | Array<[number, string]>;
        };
    }

    interface HTMLWebViewElement {
        send: (channel: string, ...args: any[]) => undefined;
        getWebContents: () => WebContents;
    }
}
