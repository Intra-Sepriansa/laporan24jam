import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Head, useForm } from '@inertiajs/react';
import { Store, User, Lock } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { login } from '@/routes';
import { byNik } from '@/routes/employee';
import Grainient from '@/components/grainient';

interface EmployeeData {
    found: boolean;
    name?: string;
    store_code?: string;
    store_name?: string;
    area?: string;
    message?: string;
}

export default function NikLogin() {
    const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);
    const [isCheckingNik, setIsCheckingNik] = useState(false);
    const [nikError, setNikError] = useState<string>('');

    const { data, setData, post, processing, errors } = useForm({
        nik: '',
        password: '',
        remember: false,
    });

    // Auto-fill nama saat NIK diketik (8 digit)
    useEffect(() => {
        if (data.nik.length === 8) {
            checkNik(data.nik);
        } else {
            setEmployeeData(null);
            setNikError('');
        }
    }, [data.nik]);

    const checkNik = async (nik: string) => {
        setIsCheckingNik(true);
        setNikError('');

        try {
            const response = await axios.post<EmployeeData>(byNik.url(), { nik });

            if (response.data.found) {
                setEmployeeData(response.data);
            }
        } catch (error: any) {
            if (error.response?.status === 404) {
                setNikError('NIK tidak ditemukan');
                setEmployeeData(null);
            }
        } finally {
            setIsCheckingNik(false);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(login.url());
    };

    return (
        <>
            <Head title="Login - Sistem Laporan Shift 3" />

            <div className="min-h-svh flex items-center justify-center p-4 relative overflow-hidden">
                {/* Animated Grainient Background */}
                <div className="absolute inset-0 z-0">
                    <Grainient
                        color1="#FF4444"
                        color2="#1E3A8A"
                        color3="#DC2626"
                        timeSpeed={0.15}
                        colorBalance={0.1}
                        warpStrength={0.8}
                        warpFrequency={4}
                        warpSpeed={1.5}
                        warpAmplitude={60}
                        blendAngle={15}
                        blendSoftness={0.1}
                        rotationAmount={400}
                        noiseScale={1.5}
                        grainAmount={0.08}
                        grainScale={1.5}
                        grainAnimated={true}
                        contrast={1.3}
                        gamma={1.1}
                        saturation={1.2}
                        centerX={0}
                        centerY={0}
                        zoom={0.85}
                    />
                </div>

                <div className="w-full max-w-5xl relative z-10 px-4">
                    {/* Main Card Container */}
                    <Card className="shadow-2xl border border-white/20 backdrop-blur-lg bg-white/80 overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            {/* Left Column: Illustration */}
                            <div className="hidden lg:flex items-center justify-center p-8 relative">
                                <div className="relative w-full h-full min-h-[500px] flex items-center justify-center">
                                    <img
                                        src="/assets/image.png"
                                        alt="Alfamart Learning Illustration"
                                        className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                                    />
                                    {/* Optional decorative elements could go here */}
                                </div>
                            </div>

                            {/* Right Column: Login Form */}
                            <div className="p-8 sm:p-12 flex flex-col justify-center">
                                <CardHeader className="space-y-1 pb-3 pt-0 flex flex-col items-center">
                                    <div className="w-32 h-32 mb-6 sm:w-40 sm:h-40">
                                        <img
                                            src="/assets/logo bendera alfamart.png"
                                            alt="Logo Alfamart"
                                            className="w-full h-full object-contain filter drop-shadow-md"
                                        />
                                    </div>
                                    <CardTitle className="text-xl font-bold text-center text-gray-900 sm:text-2xl">
                                        Masuk
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="px-0 pb-0">
                                    <form onSubmit={submit} className="space-y-4">
                                        {/* NIK Input */}
                                        <div className="space-y-2">
                                            <Label htmlFor="nik" className="flex items-center gap-2 text-xs font-semibold text-gray-700 sm:text-sm">
                                                <User className="w-4 h-4 text-red-600 sm:w-5 sm:h-5" />
                                                NIK (8 digit)
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    id="nik"
                                                    type="text"
                                                    value={data.nik}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/\D/g, '').slice(0, 8);
                                                        setData('nik', value);
                                                    }}
                                                    placeholder="Contoh: 14085061"
                                                    maxLength={8}
                                                    className={`h-11 text-xs pr-12 border-2 focus:border-red-500 text-gray-900 placeholder:text-gray-400 bg-white sm:text-sm ${errors.nik || nikError ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                                    autoFocus
                                                    required
                                                />
                                                {isCheckingNik && (
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                                        <Spinner className="w-4 h-4 text-red-600 sm:w-5 sm:h-5" />
                                                    </div>
                                                )}
                                            </div>
                                            {(errors.nik || nikError) && (
                                                <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                                                    <span className="text-lg">⚠</span> {errors.nik || nikError}
                                                </p>
                                            )}
                                        </div>

                                        {/* Auto-filled Employee Info */}
                                        {employeeData?.found && (
                                            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-900 sm:text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                                                <p className="font-semibold">{employeeData.name}</p>
                                                <p className="text-emerald-700">
                                                    {employeeData.store_code} - {employeeData.store_name}
                                                    {employeeData.area ? ` • ${employeeData.area}` : ''}
                                                </p>
                                            </div>
                                        )}

                                        {/* Password Input */}
                                        <div className="space-y-2">
                                            <Label htmlFor="password" className="flex items-center gap-2 text-xs font-semibold text-gray-700 sm:text-sm">
                                                <Lock className="w-4 h-4 text-red-600 sm:w-5 sm:h-5" />
                                                Password
                                            </Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder="Format: TB56#XXX"
                                                className={`h-11 text-xs border-2 focus:border-red-500 text-gray-900 placeholder:text-gray-400 bg-white sm:text-sm ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                                required
                                            />
                                            {errors.password && (
                                                <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                                                    <span className="text-lg">⚠</span> {errors.password}
                                                </p>
                                            )}
                                            <p className="text-[0.7rem] text-gray-600 sm:text-xs">
                                                Format: <span className="font-mono font-semibold text-gray-900">KODE_TOKO#3_DIGIT_TERAKHIR_NIK</span>
                                            </p>
                                        </div>

                                        {/* Remember Me */}
                                        <div className="flex items-center space-x-3 py-1">
                                            <Checkbox
                                                id="remember"
                                                checked={data.remember}
                                                onCheckedChange={(checked) => setData('remember', checked as boolean)}
                                                className="w-5 h-5 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                                            />
                                            <Label
                                                htmlFor="remember"
                                                className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-gray-900 sm:text-sm"
                                            >
                                                Ingat saya selama 30 hari
                                            </Label>
                                        </div>

                                        {/* Submit Button */}
                                        <Button
                                            type="submit"
                                            className="w-full h-12 text-sm font-bold bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed sm:text-base mt-4"
                                            disabled={processing || isCheckingNik}
                                        >
                                            {processing ? (
                                                <>
                                                    <Spinner className="mr-2 text-white" />
                                                    Memproses Login...
                                                </>
                                            ) : (
                                                <>
                                                    <Lock className="w-5 h-5 mr-2" />
                                                    Masuk ke Sistem
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </CardContent>

                                <div className="mt-6 text-center">
                                    <p className="text-xs text-gray-500">
                                        &copy; {new Date().getFullYear()} PT Sumber Alfaria Trijaya Tbk
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </>
    );
}
