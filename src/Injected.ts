import ElectronStore from 'electron-store';
import { States } from './components/AppState';
import { EventEmitter } from 'events';
import { RendererInterface, MenuItemConstructorOptions } from 'electron';

type SpaceState = States['Space'];
type SharedState = States['Shared'];

type Injected = {
    electron: RendererInterface;
    Stores: {
        SpaceStore: ElectronStore<SpaceState>;
        SharedStore: ElectronStore<SharedState>;
    };
    API: {
        openURL: (url: string) => boolean;
        openContextMenu: (template: MenuItemConstructorOptions[]) => undefined;
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

const {
    Stores: { SpaceStore, SharedStore },
    API,
    Metadata,
    env,
    Logs,
    SpaceEvents,
    electron,
} = window.Injected;

export { SpaceStore, SharedStore, API, Metadata, env, Logs, SpaceEvents, electron };
