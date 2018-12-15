import useTransformers, { Transform } from '../../hooks/useTransformers';
import useSpaceStore from '../../hooks/useSpaceStore';
import { Preset } from '../presets/PresetState';
import UUID from 'uuid/v4';
import { WebContents } from 'electron';

export type Column = {
    id: string;
    presetId: string;
    url: string;
    mobileSite: boolean;
    zoomLevel: number;
};

export type ColumnState = Column[];
type Trans = Transform<ColumnState>;

export const ColumnTransformers = {
    addColumn(preset: Preset): Trans {
        return state => [
            ...state,
            { id: UUID(), presetId: preset.id, url: preset.url, mobileSite: true, zoomLevel: 0 },
        ];
    },
    switchMobileMode(id: string, mobileSite: boolean): Trans {
        return state =>
            state.map(column => {
                if (column.id !== id) return column;
                return { ...column, mobileSite };
            });
    },
    setZoomLevel(id: string, zoomLevel: number, webContents?: WebContents): Trans {
        if (webContents) webContents.setZoomLevel(zoomLevel);
        return state =>
            state.map(column => {
                if (column.id !== id) return column;
                return { ...column, zoomLevel };
            });
    },
    removeColumn(id: string): Trans {
        return state => state.filter(column => column.id !== id);
    },
    moveColumn(fromIndex: number, toIndex: number): Trans {
        return state => {
            const newState = [...state];
            const [moved] = newState.splice(fromIndex, 1);
            newState.splice(toIndex, 0, moved);
            return newState;
        };
    },
};

const defaultState: ColumnState = [];

export function useNewColumnState() {
    const [persistedState, saveState] = useSpaceStore('columns', defaultState);
    return useTransformers(ColumnTransformers, persistedState, saveState);
}
