import React, { useState, useCallback, useEffect } from 'react';

type Omit<T, U> = Pick<T, Exclude<keyof T, keyof U>>;
type Props = {
    fallbackValue?: string;
    onSet: (value: string) => any;
    customValue?: string;
} & Omit<React.HTMLProps<HTMLSpanElement>, { children: any; ref: any }>;

export default function SecondaryInput({ fallbackValue = '', onSet, customValue, ...rest }: Props) {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState<string | undefined>(customValue);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.currentTarget.value);
    }, []);

    const handleBlur = useCallback(
        (e: React.FocusEvent<HTMLInputElement>) => {
            const value = e.currentTarget.value;
            setValue(value);
            setEditing(false);
            onSet(value);
        },
        [onSet]
    );

    const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.currentTarget.blur();
            e.preventDefault();
        }
    }, []);

    const onClick = useCallback(
        () => {
            setValue(value => (value ? value : fallbackValue));
            setEditing(true);
        },
        [fallbackValue]
    );

    useEffect(
        () => {
            if (customValue) {
                setValue(value);
            }
        },
        [customValue]
    );

    if (editing)
        return (
            <input
                {...rest}
                placeholder={fallbackValue}
                value={value}
                onChange={handleChange}
                autoFocus
                onBlur={handleBlur}
                onKeyPress={handleKeyPress}
            />
        );

    return (
        <span {...rest} onClick={onClick}>
            {value || fallbackValue}
        </span>
    );
}
