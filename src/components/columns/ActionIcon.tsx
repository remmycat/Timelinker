import React from 'react';
import styles from './Columns.module.scss';
import classnames from 'classnames';

type Props = {
    onClick: () => any;
    children: React.ReactElement<any>;
    className?: string;
    right?: boolean;
    disabled?: boolean;
    small?: boolean;
};

export default function SidebarIcon({
    onClick,
    children,
    className,
    right,
    disabled,
    small,
}: Props) {
    const classes = classnames(styles.action, className, {
        [styles.action__right]: right,
        [styles.action__small]: small,
    });
    return (
        <button
            className={classes}
            disabled={disabled}
            onClick={disabled ? undefined : onClick}
            type="button">
            {children}
        </button>
    );
}
