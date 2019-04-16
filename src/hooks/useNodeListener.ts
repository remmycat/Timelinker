import { useEffect } from 'react';

interface NodeEventEmitter<EventType> {
    //on: (event: EventType, listener: any) => any;
    addListener: (event: EventType, listener: any) => any;
    removeListener: (event: EventType, listener: any) => any;
}

export default function useNodeListener<EventType>(
    ee: React.RefObject<NodeEventEmitter<EventType>> | NodeEventEmitter<EventType> | void,
    eventType: EventType,
    listener: any,
    inputs: Array<any> = []
) {
    useEffect(() => {
        if (!ee) return;
        const emitter = 'current' in ee ? ee.current! : ee;
        emitter.addListener(eventType, listener);
        return () => emitter.removeListener(eventType, listener);
    }, [ee, ...inputs]);
}
