import React from 'react';
import classnames from 'classnames';
import styles from './TrafficLights.module.scss';

type Props = {
    size?: number;
    onMax?: (e: React.MouseEvent<HTMLButtonElement>) => any;
    onMin?: (e: React.MouseEvent<HTMLButtonElement>) => any;
    onClose?: (e: React.MouseEvent<HTMLButtonElement>) => any;
    className?: string;
};

export default function TrafficLights({ size = 1, onClose, onMax, onMin, className }: Props) {
    const style = {
        fontSize: `${size * 16}px`,
    };
    if (!onClose && !onMax && !onMin) return null;
    return (
        <div style={style} className={classnames(styles.trafficLights, className)}>
            {onClose && <button className={styles.trafficLight_close} onClick={onClose} />}
            {onMin && <button className={styles.trafficLight_minimize} onClick={onMin} />}
            {onMax && <button className={styles.trafficLight_maximize} onClick={onMax} />}
        </div>
    );
}
