<?php

use App\Http\Controllers\Auth\NikLoginController;
use App\Http\Controllers\GridPhotoController;
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
    Route::get('grid/display', [App\Http\Controllers\GridPhotoController::class, 'display'])->name('grid.display');
    Route::get('grid/edit', [App\Http\Controllers\GridPhotoController::class, 'edit'])->name('grid.edit');
    Route::resource('grid', App\Http\Controllers\GridPhotoController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::post('grid/batch', [App\Http\Controllers\GridPhotoController::class, 'batch'])->name('grid.batch');
    
    // Shift Reports
    Route::resource('reports', App\Http\Controllers\ShiftReportController::class);
    
    // Export
    Route::get('reports/{report}/export/pdf', [App\Http\Controllers\ExportController::class, 'exportPdf'])->name('reports.export.pdf');
    Route::get('reports/{report}/export/excel', [App\Http\Controllers\ExportController::class, 'exportExcel'])->name('reports.export.excel');
});

require __DIR__.'/settings.php';
