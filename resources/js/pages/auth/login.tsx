import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Head, useForm } from '@inertiajs/react';
import { Store, User, Lock, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { login } from '@/routes';
import { byNik } from '@/routes/employee';

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

            <div className="min-h-svh flex items-center justify-center bg-gradient-to-br from-red-600 via-red-500 to-blue-600 p-4 relative overflow-hidden">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="w-full max-w-md relative z-10">
                    {/* Logo & Header */}
                    <div className="text-center mb-6 sm:mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-3xl mb-4 shadow-2xl transform hover:scale-105 transition-transform sm:w-24 sm:h-24 sm:mb-6">
                            <Store className="w-10 h-10 text-red-600 sm:w-14 sm:h-14" />
                        </div>
                        <h1 className="text-2xl font-black text-white mb-2 tracking-tight drop-shadow-lg sm:text-5xl">
                            ALFAMART
                        </h1>
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2 inline-block mb-1 sm:px-6 sm:py-3 sm:mb-2">
                            <p className="text-sm font-bold text-white sm:text-xl">
                                Sistem Laporan Shift 3
                            </p>
                        </div>
                        <p className="hidden text-sm text-white/90 font-medium sm:block sm:text-lg">
                            Belanja Puas, Harga Pas!
                        </p>
                    </div>

                    {/* Login Card */}
                    <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95">
                        <CardHeader className="space-y-1 pb-3 pt-5 sm:pb-6 sm:pt-8">
                            <CardTitle className="text-xl font-bold text-center text-gray-900 sm:text-3xl">
                                Selamat Datang
                            </CardTitle>
                            <CardDescription className="text-center text-xs text-gray-600 sm:text-base">
                                Masukkan NIK dan password untuk melanjutkan
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="px-4 pb-5 sm:px-8 sm:pb-8">
                            <form onSubmit={submit} className="space-y-4 sm:space-y-5">
                                {/* NIK Input */}
                                <div className="space-y-2">
                                    <Label htmlFor="nik" className="flex items-center gap-2 text-xs font-semibold text-gray-700 sm:text-base">
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
                                            className={`h-10 text-xs pr-12 border-2 focus:border-red-500 text-gray-900 placeholder:text-gray-400 bg-white sm:h-12 sm:text-base ${errors.nik || nikError ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
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
                                    <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                                <User className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-green-700 font-medium">Karyawan Ditemukan</p>
                                                <p className="text-lg font-bold text-green-900">{employeeData.name}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 gap-2 pl-13">
                                            <div className="flex items-center gap-2 text-green-800">
                                                <Store className="w-4 h-4" />
                                                <span className="font-semibold text-sm">{employeeData.store_code} - {employeeData.store_name}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-green-700">
                                                <MapPin className="w-4 h-4" />
                                                <span className="text-sm">{employeeData.area}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Password Input */}
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="flex items-center gap-2 text-xs font-semibold text-gray-700 sm:text-base">
                                        <Lock className="w-4 h-4 text-red-600 sm:w-5 sm:h-5" />
                                        Password
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Format: TB56#XXX"
                                        className={`h-10 text-xs border-2 focus:border-red-500 text-gray-900 placeholder:text-gray-400 bg-white sm:h-12 sm:text-base ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                        required
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                                            <span className="text-lg">⚠</span> {errors.password}
                                        </p>
                                    )}
                                    <p className="text-[0.7rem] text-gray-700 bg-gray-100 p-2 rounded-lg border border-gray-300 sm:text-xs sm:p-3">
                                        💡 Format: <span className="font-mono font-bold text-gray-900">KODE_TOKO#3_DIGIT_TERAKHIR_NIK</span>
                                    </p>
                                </div>

                                {/* Remember Me */}
                                <div className="flex items-center space-x-3 py-1">
                                    <Checkbox
                                        id="remember"
                                        checked={data.remember}
                                        onCheckedChange={(checked) => setData('remember', checked as boolean)}
                                        className="w-5 h-5"
                                    />
                                    <Label
                                        htmlFor="remember"
                                        className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-gray-900 sm:text-base"
                                    >
                                        Ingat saya selama 30 hari
                                    </Label>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    className="w-full h-11 text-sm font-bold bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed sm:h-14 sm:text-lg"
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

                            {/* Footer Info */}
                            <div className="mt-6 pt-5 border-t-2 border-gray-300 text-center space-y-2 hidden sm:block">
                                <p className="text-xs text-gray-700 font-semibold sm:text-sm">
                                    © 2026 PT Sumber Alfaria Trijaya Tbk
                                </p>
                                <p className="text-xs text-gray-600 font-medium">
                                    Toko TB56 - RY CANGKUDU CISOKA, BALARAJA
                                </p>
                                <p className="text-xs text-gray-500">
                                    Sistem Laporan Shift 3 v1.0
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Help Text */}
                    <div className="mt-6 text-center hidden sm:block">
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4 inline-block">
                            <p className="text-sm text-white font-medium">
                                💬 Butuh bantuan? Hubungi administrator toko
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
