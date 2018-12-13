import { useCallback } from 'react';
import { DropResult } from 'react-beautiful-dnd'; //eslint-disable-line

export default function useDragEnd(move: (from: number, to: number) => any) {
    return useCallback(
        ({ destination, source }: DropResult) => {
            if (!destination) return;
            move(source.index, destination.index);
        },
        [move]
    );
}
