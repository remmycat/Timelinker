import useTransformers, { Transform } from '../../hooks/useTransformers';
import { useState } from 'react';

export enum SidebarState {
    setupColumn,
    control,
    none,
}

type Trans = Transform<SidebarState>;

export const SidebarTransformers = {
    toggleSetup(): Trans {
        return state =>
            state === SidebarState.setupColumn ? SidebarState.none : SidebarState.setupColumn;
    },
    closeSetup(): Trans {
        return state => (state === SidebarState.setupColumn ? SidebarState.none : state);
    },
    openSetup(): Trans {
        return SidebarState.setupColumn;
    },
    toggleArrangement(): Trans {
        return state => (state === SidebarState.control ? SidebarState.none : SidebarState.control);
    },
    closeArrangement(): Trans {
        return state => (state === SidebarState.control ? SidebarState.none : state);
    },
    openArrangement(): Trans {
        return SidebarState.control;
    },
    resetSidebarState(): Trans {
        return SidebarState.none;
    },
};

export function useNewSidebarState(columnsOpen: number) {
    const defaultState = columnsOpen === 0 ? SidebarState.setupColumn : SidebarState.none;
    const [state, setState] = useState(defaultState);
    const transformers = useTransformers(setState, SidebarTransformers);
    return [state, transformers] as [typeof state, typeof transformers];
}
