import React from 'react';
import PresetNew from './PresetNew';
import { Droppable, DragDropContext } from 'react-beautiful-dnd';
import styles from './Preset.module.scss';
import { useDispatchers } from '../State';
import { Preset as PresetType, PresetState } from './PresetState';
import Preset from './Preset';
import useDragEnd from '../../hooks/useDragEnd';

type Props = {
    id: string;
    onPresetOpen: (preset: PresetType) => any;
    presets: PresetState;
};

export default function PresetList({ id, onPresetOpen, presets }: Props) {
    const { movePreset } = useDispatchers().Preset;

    const onPresetDrag = useDragEnd(movePreset);
    return (
        <DragDropContext onDragEnd={onPresetDrag}>
            <Droppable droppableId={id} direction="vertical">
                {({ innerRef, droppableProps, placeholder }) => (
                    <div ref={innerRef} className={styles.list} {...droppableProps}>
                        <PresetNew key="new-preset" onPresetOpen={onPresetOpen} />
                        <hr className={styles.hr} />
                        {presets.map((preset, index) => (
                            <Preset
                                key={preset.id}
                                preset={preset}
                                index={index}
                                onPresetOpen={onPresetOpen}
                            />
                        ))}
                        {placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}
