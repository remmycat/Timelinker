import React, { useContext, createContext, useMemo } from 'react';
import { Dispatchers } from '../hooks/useTransformers';
import { useNewColumnState, ColumnState, ColumnTransformers } from './columns/ColumnState';
import { useNewPresetState, PresetTransformers, PresetState } from './presets/PresetState';
import { useNewSidebarState, SidebarTransformers, SidebarState } from './sidebar/SidebarState';

export type StateObject = {
    columns: ColumnState;
    presets: PresetState;
    sidebar: SidebarState;
};

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
    children: (state: StateObject) => React.ReactNode;
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
