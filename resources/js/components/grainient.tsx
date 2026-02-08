import { useEffect, useRef, useState } from 'react';

interface GrainientProps {
    timeSpeed?: number;
    colorBalance?: number;
    warpStrength?: number;
    warpFrequency?: number;
    warpSpeed?: number;
    warpAmplitude?: number;
    blendAngle?: number;
    blendSoftness?: number;
    rotationAmount?: number;
    noiseScale?: number;
    grainAmount?: number;
    grainScale?: number;
    grainAnimated?: boolean;
    contrast?: number;
    gamma?: number;
    saturation?: number;
    centerX?: number;
    centerY?: number;
    zoom?: number;
    color1?: string;
    color2?: string;
    color3?: string;
    className?: string;
}

const hexToRgb = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return [1, 1, 1];
    return [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255];
};

// WebGL 1 compatible shaders
const vertexShader = `
attribute vec2 position;
void main() {
    gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uTimeSpeed;
uniform float uColorBalance;
uniform float uWarpStrength;
uniform float uWarpFrequency;
uniform float uWarpSpeed;
uniform float uWarpAmplitude;
uniform float uBlendAngle;
uniform float uBlendSoftness;
uniform float uRotationAmount;
uniform float uNoiseScale;
uniform float uGrainAmount;
uniform float uGrainScale;
uniform float uGrainAnimated;
uniform float uContrast;
uniform float uGamma;
uniform float uSaturation;
uniform vec2 uCenterOffset;
uniform float uZoom;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;

#define S(a,b,t) smoothstep(a,b,t)

mat2 Rot(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}

vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(2127.1, 81.17)), dot(p, vec2(1269.5, 283.37)));
    return fract(sin(p) * 43758.5453);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float n = mix(
        mix(dot(-1.0 + 2.0 * hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
            dot(-1.0 + 2.0 * hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
        mix(dot(-1.0 + 2.0 * hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
            dot(-1.0 + 2.0 * hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
        u.y
    );
    return 0.5 + 0.5 * n;
}

void main() {
    float t = iTime * uTimeSpeed;
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    float ratio = iResolution.x / iResolution.y;
    vec2 tuv = uv - 0.5 + uCenterOffset;
    tuv /= max(uZoom, 0.001);

    float degree = noise(vec2(t * 0.1, tuv.x * tuv.y) * uNoiseScale);
    tuv.y *= 1.0 / ratio;
    tuv *= Rot(radians((degree - 0.5) * uRotationAmount + 180.0));
    tuv.y *= ratio;

    float frequency = uWarpFrequency;
    float ws = max(uWarpStrength, 0.001);
    float amplitude = uWarpAmplitude / ws;
    float warpTime = t * uWarpSpeed;
    tuv.x += sin(tuv.y * frequency + warpTime) / amplitude;
    tuv.y += sin(tuv.x * (frequency * 1.5) + warpTime) / (amplitude * 0.5);

    vec3 colLav = uColor1;
    vec3 colOrg = uColor2;
    vec3 colDark = uColor3;
    float b = uColorBalance;
    float s = max(uBlendSoftness, 0.0);
    mat2 blendRot = Rot(radians(uBlendAngle));
    float blendX = (tuv * blendRot).x;
    float edge0 = -0.3 - b - s;
    float edge1 = 0.2 - b + s;
    float v0 = 0.5 - b + s;
    float v1 = -0.3 - b - s;
    vec3 layer1 = mix(colDark, colOrg, S(edge0, edge1, blendX));
    vec3 layer2 = mix(colOrg, colLav, S(edge0, edge1, blendX));
    vec3 col = mix(layer1, layer2, S(v0, v1, tuv.y));

    vec2 grainUv = uv * max(uGrainScale, 0.001);
    if (uGrainAnimated > 0.5) {
        grainUv += vec2(iTime * 0.05);
    }
    float grain = fract(sin(dot(grainUv, vec2(12.9898, 78.233))) * 43758.5453);
    col += (grain - 0.5) * uGrainAmount;

    col = (col - 0.5) * uContrast + 0.5;
    float luma = dot(col, vec3(0.2126, 0.7152, 0.0722));
    col = mix(vec3(luma), col, uSaturation);
    col = pow(max(col, vec3(0.0)), vec3(1.0 / max(uGamma, 0.001)));
    col = clamp(col, 0.0, 1.0);

    gl_FragColor = vec4(col, 1.0);
}
`;

const Grainient: React.FC<GrainientProps> = ({
    timeSpeed = 1.0,
    colorBalance = 0.0,
    warpStrength = 1.0,
    warpFrequency = 5.0,
    warpSpeed = 2.0,
    warpAmplitude = 50.0,
    blendAngle = 0.0,
    blendSoftness = 0.05,
    rotationAmount = 500.0,
    noiseScale = 2.0,
    grainAmount = 0.1,
    grainScale = 2.0,
    grainAnimated = false,
    contrast = 1.5,
    gamma = 1.0,
    saturation = 1.0,
    centerX = 0.0,
    centerY = 0.0,
    zoom = 0.9,
    color1 = '#FF9FFC',
    color2 = '#5227FF',
    color3 = '#B19EEF',
    className = ''
}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Get WebGL context
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
        if (!gl) {
            setError('WebGL not supported');
            console.error('WebGL not supported');
            return;
        }

        // Compile shader
        const compileShader = (source: string, type: number): WebGLShader | null => {
            const shader = gl.createShader(type);
            if (!shader) return null;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error('Shader compile error:', gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        };

        const vs = compileShader(vertexShader, gl.VERTEX_SHADER);
        const fs = compileShader(fragmentShader, gl.FRAGMENT_SHADER);
        if (!vs || !fs) {
            setError('Shader compilation failed');
            return;
        }

        // Create program
        const program = gl.createProgram();
        if (!program) {
            setError('Failed to create WebGL program');
            return;
        }
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program link error:', gl.getProgramInfoLog(program));
            setError('Shader linking failed');
            return;
        }
        gl.useProgram(program);

        // Create fullscreen quad
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

        const positionLoc = gl.getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(positionLoc);
        gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

        // Get uniform locations
        const uniforms = {
            iResolution: gl.getUniformLocation(program, 'iResolution'),
            iTime: gl.getUniformLocation(program, 'iTime'),
            uTimeSpeed: gl.getUniformLocation(program, 'uTimeSpeed'),
            uColorBalance: gl.getUniformLocation(program, 'uColorBalance'),
            uWarpStrength: gl.getUniformLocation(program, 'uWarpStrength'),
            uWarpFrequency: gl.getUniformLocation(program, 'uWarpFrequency'),
            uWarpSpeed: gl.getUniformLocation(program, 'uWarpSpeed'),
            uWarpAmplitude: gl.getUniformLocation(program, 'uWarpAmplitude'),
            uBlendAngle: gl.getUniformLocation(program, 'uBlendAngle'),
            uBlendSoftness: gl.getUniformLocation(program, 'uBlendSoftness'),
            uRotationAmount: gl.getUniformLocation(program, 'uRotationAmount'),
            uNoiseScale: gl.getUniformLocation(program, 'uNoiseScale'),
            uGrainAmount: gl.getUniformLocation(program, 'uGrainAmount'),
            uGrainScale: gl.getUniformLocation(program, 'uGrainScale'),
            uGrainAnimated: gl.getUniformLocation(program, 'uGrainAnimated'),
            uContrast: gl.getUniformLocation(program, 'uContrast'),
            uGamma: gl.getUniformLocation(program, 'uGamma'),
            uSaturation: gl.getUniformLocation(program, 'uSaturation'),
            uCenterOffset: gl.getUniformLocation(program, 'uCenterOffset'),
            uZoom: gl.getUniformLocation(program, 'uZoom'),
            uColor1: gl.getUniformLocation(program, 'uColor1'),
            uColor2: gl.getUniformLocation(program, 'uColor2'),
            uColor3: gl.getUniformLocation(program, 'uColor3'),
        };

        // Set static uniforms
        gl.uniform1f(uniforms.uTimeSpeed, timeSpeed);
        gl.uniform1f(uniforms.uColorBalance, colorBalance);
        gl.uniform1f(uniforms.uWarpStrength, warpStrength);
        gl.uniform1f(uniforms.uWarpFrequency, warpFrequency);
        gl.uniform1f(uniforms.uWarpSpeed, warpSpeed);
        gl.uniform1f(uniforms.uWarpAmplitude, warpAmplitude);
        gl.uniform1f(uniforms.uBlendAngle, blendAngle);
        gl.uniform1f(uniforms.uBlendSoftness, blendSoftness);
        gl.uniform1f(uniforms.uRotationAmount, rotationAmount);
        gl.uniform1f(uniforms.uNoiseScale, noiseScale);
        gl.uniform1f(uniforms.uGrainAmount, grainAmount);
        gl.uniform1f(uniforms.uGrainScale, grainScale);
        gl.uniform1f(uniforms.uGrainAnimated, grainAnimated ? 1.0 : 0.0);
        gl.uniform1f(uniforms.uContrast, contrast);
        gl.uniform1f(uniforms.uGamma, gamma);
        gl.uniform1f(uniforms.uSaturation, saturation);
        gl.uniform2f(uniforms.uCenterOffset, centerX, centerY);
        gl.uniform1f(uniforms.uZoom, zoom);
        gl.uniform3fv(uniforms.uColor1, hexToRgb(color1));
        gl.uniform3fv(uniforms.uColor2, hexToRgb(color2));
        gl.uniform3fv(uniforms.uColor3, hexToRgb(color3));

        // Resize handler
        const resize = () => {
            const rect = canvas.parentElement?.getBoundingClientRect();
            if (!rect) return;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.floor(rect.width * dpr);
            canvas.height = Math.floor(rect.height * dpr);
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.uniform2f(uniforms.iResolution, canvas.width, canvas.height);
        };

        const ro = new ResizeObserver(resize);
        if (canvas.parentElement) {
            ro.observe(canvas.parentElement);
        }
        resize();

        // Animation loop
        let raf = 0;
        const t0 = performance.now();
        const render = (now: number) => {
            const elapsed = (now - t0) * 0.001;
            gl.uniform1f(uniforms.iTime, elapsed);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            raf = requestAnimationFrame(render);
        };
        raf = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            gl.deleteProgram(program);
            gl.deleteShader(vs);
            gl.deleteShader(fs);
            gl.deleteBuffer(buffer);
        };
    }, [
        timeSpeed, colorBalance, warpStrength, warpFrequency, warpSpeed, warpAmplitude,
        blendAngle, blendSoftness, rotationAmount, noiseScale, grainAmount, grainScale,
        grainAnimated, contrast, gamma, saturation, centerX, centerY, zoom, color1, color2, color3
    ]);

    if (error) {
        // Fallback gradient if WebGL fails
        return (
            <div
                className={`relative h-full w-full overflow-hidden ${className}`.trim()}
                style={{
                    background: `linear-gradient(135deg, ${color1}, ${color2}, ${color3})`
                }}
            />
        );
    }

    return (
        <canvas
            ref={canvasRef}
            className={`absolute inset-0 w-full h-full ${className}`.trim()}
            style={{ display: 'block' }}
        />
    );
};

export default Grainient;
