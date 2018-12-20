import ElectronStore from 'electron-store';
import { States } from './components/AppState';
import { EventEmitter } from 'events';

type SpaceState = States['Space'];
type SharedState = States['Shared'];

type Injected = {
    SpaceStore: ElectronStore<SpaceState>;
    SharedStore: ElectronStore<SharedState>;
    API: {
        openURL: (url: string) => boolean;
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
    SpaceEvents: EventEmitter;
};

declare global {
    interface Window {
        Injected: Injected;
    }
}

const { SpaceStore, SharedStore, API, Metadata, env, Logs, SpaceEvents } = window.Injected;

export { SpaceStore, SharedStore, API, Metadata, env, Logs, SpaceEvents };
