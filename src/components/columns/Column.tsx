import React, { memo, useState } from 'react';
import styles from './Columns.module.scss';
import classnames from 'classnames';
import clickfocus from '../../util/clickfocus';
import ColumnControls from './ColumnControls';
import BrowserView from './BrowserView';
import { Draggable } from 'react-beautiful-dnd';
import { Column as ColumnType } from './ColumnState';

type Props = {
    controlMode: boolean;
    column: ColumnType;
    setFullscreen: React.Dispatch<React.SetStateAction<undefined | string>>;
    index: number;
};

export default memo(function Column({ column, index, controlMode, setFullscreen }: Props) {
    const columnClasses = classnames(styles.column, {
        [styles.column__controlMode]: controlMode,
    });

    const [webview, setWebview] = useState<HTMLWebViewElement | undefined>(undefined);

    return (
        <Draggable draggableId={column.id} index={index}>
            {({ draggableProps, innerRef, dragHandleProps }) => (
                <div className={styles.wrap} {...draggableProps} ref={innerRef}>
                    <div className={columnClasses}>
                        <div className={styles.content}>
                            <BrowserView
                                setWebview={setWebview}
                                mobile={column.mobileSite}
                                url={column.url}
                                id={column.id}
                                key={column.id}
                            />
                        </div>
                        <div
                            className={styles.dragCover}
                            {...dragHandleProps}
                            // hack to not deal with merging event handlers, lol
                            onMouseDownCapture={clickfocus}
                        />
                        <div className={styles.contentCover}>
                            <ColumnControls
                                webview={webview}
                                column={column}
                                setFullscreen={setFullscreen}
                            />
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
});
