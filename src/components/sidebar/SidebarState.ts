import useTransformers, { Transform } from '../../hooks/useTransformers';

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
    toggleArrangement(): Trans {
        return state => (state === SidebarState.control ? SidebarState.none : SidebarState.control);
    },
    closeArrangement(): Trans {
        return state => (state === SidebarState.control ? SidebarState.none : state);
    },
    resetSidebarState(): Trans {
        return state => SidebarState.none;
    },
};

export function useNewSidebarState(columnsOpen: number) {
    return useTransformers(
        SidebarTransformers,
        columnsOpen === 0 ? SidebarState.setupColumn : SidebarState.none
    );
}
