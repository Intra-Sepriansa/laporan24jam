<?php

use App\Http\Controllers\Auth\NikLoginController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

// Redirect root to login
Route::get('/', function () {
    return redirect()->route('login');
});

// NIK-based Authentication Routes
Route::middleware('guest')->group(function () {
    Route::get('login', [NikLoginController::class, 'create'])->name('login');
    Route::post('login', [NikLoginController::class, 'store']);
    Route::post('api/employee/by-nik', [NikLoginController::class, 'getEmployeeByNik'])->name('employee.by-nik');
});

Route::post('logout', [NikLoginController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

// Dashboard & Reports
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
    
    // Shift Reports
    Route::resource('reports', App\Http\Controllers\ShiftReportController::class);
});

require __DIR__.'/settings.php';
