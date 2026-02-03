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

            <div className="min-h-svh flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-blue-50 p-4">
                <div className="w-full max-w-md">
                    {/* Logo & Header */}
                    <div className="text-center mb-6 sm:mb-8">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-2xl mb-3 shadow-lg sm:w-20 sm:h-20 sm:mb-4">
                            <Store className="w-7 h-7 text-white sm:w-10 sm:h-10" />
                        </div>
                        <h1 className="text-xl font-bold text-gray-900 mb-2 sm:text-3xl">
                            ALFAMART
                        </h1>
                        <p className="text-sm font-semibold text-primary mb-1 sm:text-lg">
                            Sistem Laporan Shift 3
                        </p>
                        <p className="hidden text-sm text-gray-600 sm:block">
                            Belanja Puas, Harga Pas!
                        </p>
                    </div>

                    {/* Login Card */}
                    <Card className="shadow-xl border-2">
                        <CardHeader className="space-y-1 pb-3 pt-5 sm:pb-4">
                            <CardTitle className="text-lg font-bold text-center sm:text-2xl">
                                Masuk ke Sistem
                            </CardTitle>
                            <CardDescription className="text-center text-xs sm:text-sm">
                                Masukkan NIK dan password Anda
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={submit} className="space-y-4">
                                {/* NIK Input */}
                                <div className="space-y-2">
                                    <Label htmlFor="nik" className="flex items-center gap-2 text-xs sm:text-base">
                                        <User className="w-4 h-4" />
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
                                            className={`h-10 text-xs pr-10 sm:h-12 sm:text-base ${errors.nik || nikError ? 'border-red-500' : ''}`}
                                            autoFocus
                                            required
                                        />
                                        {isCheckingNik && (
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                <Spinner className="w-5 h-5" />
                                            </div>
                                        )}
                                    </div>
                                    {(errors.nik || nikError) && (
                                        <p className="text-sm text-red-600">{errors.nik || nikError}</p>
                                    )}
                                </div>

                                {/* Auto-filled Employee Info */}
                                {employeeData?.found && (
                                    <div className="p-3 bg-green-50 border-2 border-green-200 rounded-lg space-y-2">
                                        <div className="flex items-center gap-2 text-green-800">
                                            <User className="w-4 h-4" />
                                            <span className="text-sm font-semibold sm:text-base">{employeeData.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-green-700 text-xs sm:text-sm">
                                            <Store className="w-4 h-4" />
                                            <span>{employeeData.store_code} - {employeeData.store_name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-green-700 text-xs sm:text-sm">
                                            <MapPin className="w-4 h-4" />
                                            <span>{employeeData.area}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Password Input */}
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="flex items-center gap-2 text-xs sm:text-base">
                                        <Lock className="w-4 h-4" />
                                        Password
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Format: TB56#XXX"
                                        className={`h-10 text-xs sm:h-12 sm:text-base ${errors.password ? 'border-red-500' : ''}`}
                                        required
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-red-600">{errors.password}</p>
                                    )}
                                    <p className="text-[0.7rem] text-gray-500 sm:text-xs">
                                        Format: KODE_TOKO#3_DIGIT_TERAKHIR_NIK
                                    </p>
                                </div>

                                {/* Remember Me */}
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="remember"
                                        checked={data.remember}
                                        onCheckedChange={(checked) => setData('remember', checked as boolean)}
                                    />
                                    <Label
                                        htmlFor="remember"
                                        className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer sm:text-sm"
                                    >
                                        Ingat saya
                                    </Label>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    className="w-full h-11 text-sm font-semibold sm:h-12 sm:text-base"
                                    disabled={processing || isCheckingNik || !employeeData?.found}
                                >
                                    {processing ? (
                                        <>
                                            <Spinner className="mr-2" />
                                            Memproses...
                                        </>
                                    ) : (
                                        'Masuk'
                                    )}
                                </Button>
                            </form>

                            {/* Footer Info */}
                            <div className="mt-5 pt-4 border-t text-center hidden sm:block">
                                <p className="text-xs text-gray-500">
                                    © 2026 Alfamart. Sistem Laporan Shift 3
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Toko TB56 - RY CANGKUDU CISOKA, BALARAJA
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Help Text */}
                    <div className="mt-5 text-center hidden sm:block">
                        <p className="text-sm text-gray-600">
                            Butuh bantuan? Hubungi administrator toko
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
