import React, { useMemo, useState, memo } from 'react';
import styles from './Columns.module.scss';
import { Droppable, DragDropContext } from 'react-beautiful-dnd'; // eslint-disable-line
import Column from './Column';
import { ColumnState } from './ColumnState';
import useDragEnd from '../../hooks/useDragEnd';
import { useDispatchers } from '../AppState';

type Props = {
    id: string;
    controlMode: boolean;
    columns: ColumnState;
};

export default memo(function ColumnLayout({ columns, id, controlMode }: Props) {
    const [fullscreenColumn, setFullscreen] = useState<string | undefined>(undefined);
    const { moveColumn } = useDispatchers().Column;
    const shownColumns = useMemo(
        () => columns.filter(column => !fullscreenColumn || column.id === fullscreenColumn),
        [columns, fullscreenColumn]
    );

    const contents = useMemo(
        () =>
            shownColumns.map((column, index) => (
                <React.Fragment key={column.id}>
                    {index !== 0 && <div className={styles.spacer} />}
                    <Column
                        setFullscreen={setFullscreen}
                        controlMode={controlMode}
                        column={column}
                        index={index}
                    />
                </React.Fragment>
            )),
        [shownColumns, controlMode]
    );

    const onDragEnd = useDragEnd(moveColumn);

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId={id} direction="horizontal">
                {({ innerRef, droppableProps, placeholder }) => (
                    <div ref={innerRef} className={styles.row} {...droppableProps}>
                        {contents}
                        {placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
});
