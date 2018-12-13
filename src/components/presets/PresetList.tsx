import React from 'react';
import PresetNew from './PresetNew';
import { Droppable, DragDropContext, DragDropContextProps } from 'react-beautiful-dnd'; //eslint-disable-line
import styles from './Preset.module.scss';

type Props = {
    id: string;
    addPreset: (url: string) => any;
    children: React.ReactNode;
} & DragDropContextProps;

export default function PresetList({ id, addPreset, children, ...contextProps }: Props) {
    return (
        <DragDropContext {...contextProps}>
            <Droppable droppableId={id} direction="vertical">
                {({ innerRef, droppableProps, placeholder }) => (
                    <div ref={innerRef} className={styles.list} {...droppableProps}>
                        <PresetNew key="new-preset" onAdd={addPreset} />
                        <hr className={styles.hr} />
                        {children}
                        {placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}
