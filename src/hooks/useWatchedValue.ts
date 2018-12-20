import { useRef } from 'react';

export default function useWatchedValue<T>(value: T, onChange: (t: T) => any) {
    const ref = useRef(value);
    const didChange = value !== ref.current;
    ref.current = value;
    if (didChange) onChange(value);
}
