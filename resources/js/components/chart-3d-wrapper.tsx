import { ReactNode } from 'react';

interface Chart3DWrapperProps {
    children: ReactNode;
    className?: string;
    intensity?: 'light' | 'medium' | 'strong';
}

export function Chart3DWrapper({ children, className = '', intensity = 'medium' }: Chart3DWrapperProps) {
    const transforms = {
        light: 'perspective(1200px) rotateX(5deg)',
        medium: 'perspective(1000px) rotateX(8deg)',
        strong: 'perspective(800px) rotateX(12deg)',
    };

    return (
        <div
            className={`relative ${className}`}
            style={{
                transform: transforms[intensity],
                transformOrigin: 'center bottom',
                transformStyle: 'preserve-3d',
            }}
        >
            {/* 3D Floor Shadow */}
            <div
                className="absolute -bottom-3 left-4 right-4 h-6 rounded-xl opacity-20 blur-md"
                style={{
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 100%)',
                    transform: 'translateZ(-10px)',
                }}
            />
            {/* Chart Content */}
            <div className="relative" style={{ transform: 'translateZ(0px)' }}>
                {children}
            </div>
        </div>
    );
}

export function Chart3DTooltipStyle(): React.CSSProperties {
    return {
        borderRadius: '16px',
        border: 'none',
        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.2), 0 8px 16px -8px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)',
        background: 'rgba(255,255,255,0.95)',
        padding: '12px 16px',
    };
}
