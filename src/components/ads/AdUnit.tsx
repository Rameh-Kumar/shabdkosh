import React, { useEffect, useRef } from 'react';

interface AdUnitProps {
    slot: string;
    format?: 'in-article' | 'auto';
    layout?: string;
    className?: string;
}

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

/**
 * Reusable AdSense ad unit component
 * Handles SPA navigation and React re-renders gracefully
 */
const AdUnit: React.FC<AdUnitProps> = ({
    slot,
    format = 'in-article',
    layout = 'in-article',
    className = ''
}) => {
    const adRef = useRef<HTMLModElement>(null);
    const isInitialized = useRef(false);

    useEffect(() => {
        // Prevent double initialization
        if (isInitialized.current) return;

        try {
            // Push ad only if adsbygoogle is available
            if (window.adsbygoogle && adRef.current) {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
                isInitialized.current = true;
            }
        } catch (error) {
            console.error('AdSense error:', error);
        }
    }, []);

    return (
        <div className={`ad-container my-6 ${className}`}>
            <ins
                ref={adRef}
                className="adsbygoogle"
                style={{ display: 'block', textAlign: 'center' }}
                data-ad-layout={layout}
                data-ad-format={format === 'in-article' ? 'fluid' : format}
                data-ad-client="ca-pub-4077008126781068"
                data-ad-slot={slot}
            />
        </div>
    );
};

export default AdUnit;
