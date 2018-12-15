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

    // interface NewWindowEvent extends UIEvent {
    //     readonly url: string;
    // }

    // interface FaviconChangeEvent extends UIEvent {
    //     readonly favicons: string[];
    // }

    // interface TitleChangeEvent extends UIEvent {
    //     readonly title: string;
    //     readonly explicitSet: boolean;
    // }

    // interface ConsoleEvent extends UIEvent {
    //     readonly level: number;
    //     readonly message: string;
    //     readonly line: number;
    //     readonly sourceId: string;
    // }
}
