import React, { useState, useCallback, useRef } from 'react';
import styles from './Preset.module.scss';
import { defaultSuggestion, Preset } from './PresetState'; // eslint-disable-line
import { ArrowRightCircle } from 'react-feather';
import prependHttps from '../../util/prependHttps';

type Props = {
    onAdd: (url: string) => any;
};

export default function PresetNew({ onAdd }: Props) {
    const [value, setValue] = useState('');
    const valueRef = useRef(value);
    valueRef.current = value;

    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.currentTarget.value);
    }, []);

    const submit = useCallback(
        () => {
            const { current } = valueRef;
            if (current) onAdd(prependHttps(current));
        },
        [onAdd]
    );

    const handleKeyPress = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
                e.stopPropagation();
                e.preventDefault();
                submit();
            }
        },
        [submit]
    );

    return (
        <div className={styles.presetWrap}>
            <div className={styles.preset}>
                <input
                    value={value}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    className={styles.input}
                    placeholder={defaultSuggestion}
                />
                <ArrowRightCircle onClick={submit} className={styles.submitButton} />
            </div>
        </div>
    );
}
