import React, { useMemo } from 'react';
import styles from './Columns.module.scss';
import classnames from 'classnames';
import clickfocus from '../../util/clickfocus';
import { Draggable } from 'react-beautiful-dnd';

type Props = {
    children: React.ReactNode;
    controlMode: boolean;
    id: string;
    index: number;
    renderControls: (id: string) => React.ReactNode;
};

export default function Column({ children, id, index, controlMode, renderControls }: Props) {
    const columnClasses = classnames(styles.column, {
        [styles.column__controlMode]: controlMode,
    });

    const controls = useMemo(() => renderControls(id), [renderControls, id]);

    return (
        <Draggable draggableId={id} index={index}>
            {({ draggableProps, innerRef, dragHandleProps }) => (
                <div className={styles.wrap} {...draggableProps} ref={innerRef}>
                    <div className={columnClasses}>
                        <div className={styles.content}>{children}</div>
                        <div
                            className={styles.dragCover}
                            {...dragHandleProps}
                            // hack to not deal with merging event handlers, lol
                            onMouseDownCapture={clickfocus}
                        />
                        <div className={styles.contentCover}>{controls}</div>
                    </div>
                </div>
            )}
        </Draggable>
    );
}
