import useTransformers, { Transform, Dispatchers } from '../../hooks/useTransformers'; //eslint-disable-line
import { useAppStore } from '../../hooks/usePersistentState';
import UUID from 'uuid/v4';

export type Preset = {
    id: string;
    url: string;
    isDefault: boolean;
    favicons?: string[];
};

export type PresetState = Preset[];

// const defaultSites = ['https://mobile.twitter.com'];

export const defaultSuggestion = 'mastodon.social';

// const getNewPreset = (url: string, isDefault: boolean, favicons?: string[]) => ({
//     id: UUID(),
//     url,
//     isDefault,
//     favicons,
// });

type Trans = Transform<PresetState>;

// const defaultState: PresetState = defaultSites.map(site => getNewPreset(site, true));

const PresetTransformers = {
    updateFavicons(presetId: string, favicons: string[]): Trans {
        return state =>
            state.map(preset => {
                if (preset.id !== presetId) return preset;
                return {
                    ...preset,
                    favicons,
                };
            });
    },
    addUserPreset(url: string, openColumn: (preset: Preset) => any): Trans {
        return state => {
            const oldPreset = state.find(p => p.url === url);
            if (oldPreset) {
                openColumn(oldPreset);
                return state;
            }

            const newPreset = {
                url,
                id: UUID(),
                isDefault: false,
            };
            openColumn(newPreset);
            return [...state, newPreset];
        };
    },
    removePreset(id: string): Trans {
        return state => state.filter(preset => preset.id !== id);
    },
    movePreset(fromIndex: number, toIndex: number): Trans {
        return state => {
            const newState = [...state];
            const [moved] = newState.splice(fromIndex, 1);
            newState.splice(toIndex, 0, moved);
            return newState;
        };
    },
};

export type PresetDispatchers = Dispatchers<PresetState, typeof PresetTransformers>;

export default function usePresetState() {
    const [initialState, saveState] = useAppStore('presets');
    return useTransformers(PresetTransformers, initialState, saveState);
}
