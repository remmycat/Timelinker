import { SetStateAction } from 'react'; //eslint-disable-line
import useTransformers, { Transform, Dispatchers } from '../../hooks/useTransformers'; //eslint-disable-line
import { useSpaceStore } from '../../hooks/usePersistentState';
import { Preset } from '../presets/PresetState'; //eslint-disable-line
import UUID from 'uuid/v4';

export type Column = {
    id: string;
    presetId: string;
    url: string;
};

export type ColumnState = Column[];
type Trans = Transform<ColumnState>;

const ColumnTransformers = {
    addColumn(preset: Preset): Trans {
        return state => [...state, { id: UUID(), presetId: preset.id, url: preset.url }];
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

export type ColumnDispatchers = Dispatchers<ColumnState, typeof ColumnTransformers>;

const defaultState: ColumnState = [];

export default function useColumnState() {
    const [persistedState, saveState] = useSpaceStore('columns', defaultState);
    return useTransformers(ColumnTransformers, persistedState, saveState);
}
