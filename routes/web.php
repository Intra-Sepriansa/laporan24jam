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

    // Analytics
    Route::get('analytics', [App\Http\Controllers\AnalyticsController::class, 'index'])->name('analytics.index');

    // Targets & KPI
    Route::get('targets', [App\Http\Controllers\TargetController::class, 'index'])->name('targets.index');
    Route::post('targets', [App\Http\Controllers\TargetController::class, 'store'])->name('targets.store');
    Route::delete('targets/{target}', [App\Http\Controllers\TargetController::class, 'destroy'])->name('targets.destroy');

    // Employees
    Route::get('employees', [App\Http\Controllers\EmployeeController::class, 'index'])->name('employees.index');
    Route::post('employees', [App\Http\Controllers\EmployeeController::class, 'store'])->name('employees.store');
    Route::put('employees/{employee}', [App\Http\Controllers\EmployeeController::class, 'update'])->name('employees.update');
    Route::delete('employees/{employee}', [App\Http\Controllers\EmployeeController::class, 'destroy'])->name('employees.destroy');

    // Store Profile
    Route::get('store', [App\Http\Controllers\StoreProfileController::class, 'index'])->name('store.index');
    Route::put('store', [App\Http\Controllers\StoreProfileController::class, 'update'])->name('store.update');

    // Notes & Checklists
    Route::get('notes', [App\Http\Controllers\ShiftNoteController::class, 'index'])->name('notes.index');
    Route::post('notes', [App\Http\Controllers\ShiftNoteController::class, 'storeNote'])->name('notes.store');
    Route::patch('notes/{shiftNote}/toggle', [App\Http\Controllers\ShiftNoteController::class, 'toggleResolved'])->name('notes.toggle');
    Route::delete('notes/{shiftNote}', [App\Http\Controllers\ShiftNoteController::class, 'destroyNote'])->name('notes.destroy');
    Route::post('checklists', [App\Http\Controllers\ShiftNoteController::class, 'storeChecklist'])->name('checklists.store');
    Route::put('checklists/{shiftChecklist}', [App\Http\Controllers\ShiftNoteController::class, 'updateChecklist'])->name('checklists.update');
    Route::delete('checklists/{shiftChecklist}', [App\Http\Controllers\ShiftNoteController::class, 'destroyChecklist'])->name('checklists.destroy');

    // Summary & Export Center
    Route::get('summary', [App\Http\Controllers\SummaryController::class, 'index'])->name('summary.index');
});

require __DIR__.'/settings.php';
