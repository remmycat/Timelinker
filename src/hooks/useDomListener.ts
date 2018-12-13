import { useEffect } from 'react';

interface DomEventEmitter<EventType> {
    addEventListener: (event: EventType, listener: any, capture?: boolean) => any;
    removeEventListener: (event: EventType, listener: any, capture?: boolean) => any;
}

export default function useDomListener<EventType>(
    ee: React.RefObject<DomEventEmitter<EventType>> | DomEventEmitter<EventType> | void,
    eventType: EventType,
    listener: any,
    inputs: Array<any> = [],
    useCapture?: boolean
) {
    useEffect(
        () => {
            if (!ee) return;
            const emitter = 'current' in ee ? ee.current! : ee;
            emitter.addEventListener(eventType, listener, useCapture);
            return () => emitter.removeEventListener(eventType, listener, useCapture);
        },
        [ee, ...inputs]
    );
}
