import useTransformers, { Transform } from '../../hooks/useTransformers';

/* eslint-disable no-unused-vars */
export enum SidebarState {
    setupColumn,
    control,
    none,
}
/* eslint-enable no-unused-vars */

type Trans = Transform<SidebarState>;

const SidebarTransformers = {
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

export default function useSidebarState(columnsOpen: number) {
    return useTransformers(
        SidebarTransformers,
        columnsOpen === 0 ? SidebarState.setupColumn : SidebarState.none
    );
}
