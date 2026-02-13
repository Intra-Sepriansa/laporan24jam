interface Bar3DShapeProps {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    fill?: string;
    depth?: number;
}

function darkenColor(hex: string, amount: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.max(0, (num >> 16) - amount);
    const g = Math.max(0, ((num >> 8) & 0x00ff) - amount);
    const b = Math.max(0, (num & 0x0000ff) - amount);
    return `rgb(${r},${g},${b})`;
}

function lightenColor(hex: string, amount: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, (num >> 16) + amount);
    const g = Math.min(255, ((num >> 8) & 0x00ff) + amount);
    const b = Math.min(255, (num & 0x0000ff) + amount);
    return `rgb(${r},${g},${b})`;
}

export function Bar3DShape({ x = 0, y = 0, width = 0, height = 0, fill = '#8884d8', depth = 8 }: Bar3DShapeProps) {
    if (height <= 0 || width <= 0) return null;

    const frontFill = fill;
    const sideFill = darkenColor(fill, 40);
    const topFill = lightenColor(fill, 30);
    const uniqueId = `bar3d-${x}-${y}-${Math.random().toString(36).substr(2, 5)}`;

    return (
        <g>
            {/* Front face gradient */}
            <defs>
                <linearGradient id={`front-grad-${uniqueId}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={lightenColor(fill, 20)} stopOpacity={1} />
                    <stop offset="100%" stopColor={darkenColor(fill, 15)} stopOpacity={1} />
                </linearGradient>
                <linearGradient id={`side-grad-${uniqueId}`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={sideFill} stopOpacity={0.9} />
                    <stop offset="100%" stopColor={darkenColor(fill, 60)} stopOpacity={0.9} />
                </linearGradient>
            </defs>

            {/* Shadow */}
            <rect
                x={x + 3}
                y={y + 3}
                width={width}
                height={height}
                rx={4}
                ry={4}
                fill="rgba(0,0,0,0.08)"
                filter="blur(3px)"
            />

            {/* Right side face */}
            <path
                d={`
                    M ${x + width} ${y}
                    L ${x + width + depth} ${y - depth}
                    L ${x + width + depth} ${y + height - depth}
                    L ${x + width} ${y + height}
                    Z
                `}
                fill={`url(#side-grad-${uniqueId})`}
            />

            {/* Top face */}
            <path
                d={`
                    M ${x} ${y}
                    L ${x + depth} ${y - depth}
                    L ${x + width + depth} ${y - depth}
                    L ${x + width} ${y}
                    Z
                `}
                fill={topFill}
                opacity={0.85}
            />

            {/* Front face */}
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                rx={3}
                ry={3}
                fill={`url(#front-grad-${uniqueId})`}
            />

            {/* Shine highlight on front face */}
            <rect
                x={x + 2}
                y={y}
                width={Math.max(0, width * 0.3)}
                height={height}
                rx={2}
                ry={2}
                fill="rgba(255,255,255,0.15)"
            />
        </g>
    );
}

// Factory function to create a 3D bar shape with specific color
export function createBar3DShape(color: string, depth?: number) {
    return (props: any) => <Bar3DShape {...props} fill={color} depth={depth || 8} />;
}
