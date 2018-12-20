import React, { useContext, createContext, useMemo } from 'react';
import { Dispatchers } from '../hooks/useTransformers';
import { useNewColumnState, ColumnState, ColumnTransformers } from './columns/ColumnState';
import { useNewPresetState, PresetTransformers, PresetState } from './presets/PresetState';
import { useNewSidebarState, SidebarTransformers, SidebarState } from './sidebar/SidebarState';

export type States = {
    Shared: {
        presets: PresetState;
    };
    Space: {
        columns: ColumnState;
    };
    Local: {
        sidebar: SidebarState;
    };
};

export type AppState = States['Shared'] & States['Space'] & States['Local'];

type Dispatchs = {
    Column: Dispatchers<ColumnState, typeof ColumnTransformers>;
    Preset: Dispatchers<PresetState, typeof PresetTransformers>;
    Sidebar: Dispatchers<SidebarState, typeof SidebarTransformers>;
};

const DispatchContext = createContext<Dispatchs>(undefined as any);

export function useDispatchers() {
    return useContext(DispatchContext);
}

type Props = {
    children: (state: AppState) => React.ReactNode;
};

export default function State({ children }: Props) {
    const [columnState, columnsDispatchers] = useNewColumnState();
    const [presetState, presetDispatchers] = useNewPresetState();
    const [sidebarState, sidebarDispatchers] = useNewSidebarState(columnState.length);

    const dispatchers = useMemo(
        () => ({
            Column: columnsDispatchers,
            Preset: presetDispatchers,
            Sidebar: sidebarDispatchers,
        }),
        [sidebarDispatchers, presetDispatchers, columnsDispatchers]
    );

    return (
        <DispatchContext.Provider value={dispatchers}>
            {children({
                columns: columnState,
                presets: presetState,
                sidebar: sidebarState,
            })}
        </DispatchContext.Provider>
    );
}
