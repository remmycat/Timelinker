import React from 'react';
import styles from './Columns.module.scss';
import { Droppable, DragDropContext, DragDropContextProps } from 'react-beautiful-dnd'; // eslint-disable-line

type Props = {
    id: string;
    children: React.ReactNode;
} & DragDropContextProps;

export default function ColumnLayout({ children, id, ...contextProps }: Props) {
    return (
        <DragDropContext {...contextProps}>
            <Droppable droppableId={id} direction="horizontal">
                {({ innerRef, droppableProps, placeholder }) => (
                    <div ref={innerRef} className={styles.row} {...droppableProps}>
                        {React.Children.map(children, (child, i) => (
                            <>
                                {i !== 0 && <div className={styles.spacer} />}
                                {child}
                            </>
                        ))}
                        {placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}
