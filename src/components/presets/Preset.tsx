import React, { useCallback } from 'react';
import styles from './Preset.module.scss';
import { Preset as PresetType } from './PresetState';
import { X } from 'react-feather';
import clickfocus from '../../util/clickfocus';
import { Draggable } from 'react-beautiful-dnd';
import { useDispatchers } from '../AppState';

type Props = {
    preset: PresetType;
    index: number;
    onPresetOpen: (preset: PresetType) => any;
};

const cropUrl = (url: string) => url.replace(/^https?:\/\//g, '');

export default function Preset({ preset, index, onPresetOpen }: Props) {
    const { removePreset } = useDispatchers().Preset;

    const handleRemove = useCallback(
        (e: React.MouseEvent<any>) => {
            e.stopPropagation();
            removePreset(preset.id);
        },
        [preset.id]
    );

    const handleClick = useCallback(() => {
        onPresetOpen(preset);
    }, [onPresetOpen]);

    const text = cropUrl(preset.url);

    return (
        <Draggable draggableId={preset.id} index={index}>
            {({ innerRef, draggableProps, dragHandleProps }) => (
                <div ref={innerRef} className={styles.presetWrap} {...draggableProps}>
                    <div className={styles.knob} {...dragHandleProps} onClick={clickfocus} />
                    <div className={styles.preset} onClick={handleClick} title={text}>
                        {preset.favicons ? (
                            <img alt="" className={styles.icon} src={preset.favicons[0]} />
                        ) : (
                            <span className={styles.icon} />
                        )}
                        <span className={styles.url}>{text}</span>
                        {!preset.isDefault ? (
                            <X className={styles.remove} onClick={handleRemove} />
                        ) : (
                            <div className={styles.remove} />
                        )}
                    </div>
                </div>
            )}
        </Draggable>
    );
}
