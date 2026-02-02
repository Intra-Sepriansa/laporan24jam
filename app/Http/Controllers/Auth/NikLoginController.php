<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class NikLoginController extends Controller
{
    /**
     * Display the NIK login view.
     */
    public function create()
    {
        return Inertia::render('auth/nik-login');
    }

    /**
     * Get employee name by NIK (for auto-fill).
     */
    public function getEmployeeByNik(Request $request)
    {
        $request->validate([
            'nik' => 'required|string|size:8',
        ]);

        $user = User::with('employee.store')
            ->where('nik', $request->nik)
            ->first();

        if (!$user) {
            return response()->json([
                'found' => false,
                'message' => 'NIK tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'found' => true,
            'name' => $user->name,
            'store_code' => $user->employee->store->code,
            'store_name' => $user->employee->store->name,
            'area' => $user->employee->store->area,
        ]);
    }

    /**
     * Handle an incoming NIK authentication request.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nik' => 'required|string|size:8',
            'password' => 'required|string',
            'remember' => 'boolean',
        ]);

        // Rate limiting
        $key = 'login.' . $request->ip();
        
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            
            throw ValidationException::withMessages([
                'nik' => "Terlalu banyak percobaan login. Silakan coba lagi dalam {$seconds} detik.",
            ]);
        }

        // Find user by NIK
        $user = User::with('employee.store')->where('nik', $request->nik)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            RateLimiter::hit($key, 60);

            throw ValidationException::withMessages([
                'nik' => 'NIK atau password salah.',
            ]);
        }

        // Clear rate limiter on successful login
        RateLimiter::clear($key);

        // Login user
        Auth::login($user, $request->boolean('remember'));

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard'));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
