<?php

use App\Http\Controllers\Api\AuthApiController;
use App\Http\Controllers\Api\DashboardApiController;
use App\Http\Controllers\Api\ReportApiController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::post('/auth/login', [AuthApiController::class, 'login']);
Route::get('/employee/by-nik', [AuthApiController::class, 'getEmployeeByNik']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/auth/logout', [AuthApiController::class, 'logout']);
    Route::get('/auth/user', [AuthApiController::class, 'user']);

    // Dashboard
    Route::get('/dashboard/statistics', [DashboardApiController::class, 'statistics']);
    Route::get('/dashboard/sales-trend', [DashboardApiController::class, 'salesTrend']);
    Route::get('/dashboard/recent-reports', [DashboardApiController::class, 'recentReports']);

    // Reports
    Route::get('/reports', [ReportApiController::class, 'index']);
    Route::post('/reports', [ReportApiController::class, 'store']);
    Route::get('/reports/{id}', [ReportApiController::class, 'show']);
    Route::put('/reports/{id}', [ReportApiController::class, 'update']);
    Route::delete('/reports/{id}', [ReportApiController::class, 'destroy']);
});
