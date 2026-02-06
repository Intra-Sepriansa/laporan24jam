<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

/**
 * @OA\Info(
 *     title="Alfamart Shift 3 Report API",
 *     version="1.0.0",
 *     description="API Documentation untuk Sistem Laporan Shift 3 Alfamart",
 *     @OA\Contact(
 *         email="support@alfamart.com",
 *         name="Alfamart IT Support"
 *     ),
 *     @OA\License(
 *         name="Proprietary",
 *         url="https://alfamart.com"
 *     )
 * )
 * 
 * @OA\Server(
 *     url="http://localhost:8000",
 *     description="Local Development Server"
 * )
 * 
 * @OA\Server(
 *     url="https://api.alfamart.com",
 *     description="Production Server"
 * )
 * 
 * @OA\SecurityScheme(
 *     securityScheme="sanctum",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT",
 *     description="Enter token in format: Bearer {token}"
 * )
 * 
 * @OA\Tag(
 *     name="Authentication",
 *     description="API Endpoints untuk autentikasi"
 * )
 * 
 * @OA\Tag(
 *     name="Dashboard",
 *     description="API Endpoints untuk dashboard"
 * )
 * 
 * @OA\Tag(
 *     name="Reports",
 *     description="API Endpoints untuk laporan shift"
 * )
 * 
 * @OA\Tag(
 *     name="Stores",
 *     description="API Endpoints untuk data toko"
 * )
 * 
 * @OA\Tag(
 *     name="Employees",
 *     description="API Endpoints untuk data karyawan"
 * )
 */
class ApiController extends Controller
{
    //
}
