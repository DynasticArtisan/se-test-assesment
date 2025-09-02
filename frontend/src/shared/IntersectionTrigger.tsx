import { useEffect, useRef } from "react";

interface IntersectionTrigger {
    enabled?: boolean;
    threshold?: number;
    onIntersecting: () => void;
}

const IntersectionTrigger: React.FC<IntersectionTrigger> = ({ enabled = true, threshold = 0.1, onIntersecting }) => {
    const observerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if(enabled) {
            const observer = new IntersectionObserver(
                ([entry]) => entry.isIntersecting && onIntersecting(),
                { threshold }
            );
            if (observerRef.current) {
                observer.observe(observerRef.current);
            }
            return () => observer.disconnect()
        }
    }, [enabled])

    if (!enabled) return null;
    return (
        <span ref={observerRef}></span>
    )
}

export default IntersectionTrigger;