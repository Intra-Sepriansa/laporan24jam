<?php

/**
 * @OA\OpenApi(
 *     @OA\Info(
 *         title="Alfamart Shift 3 Report API",
 *         version="1.0.0",
 *         description="API Documentation untuk Sistem Laporan Shift 3 Alfamart - Dokumentasi lengkap untuk semua endpoint API",
 *         @OA\Contact(
 *             email="support@alfamart.com",
 *             name="Alfamart IT Support"
 *         ),
 *         @OA\License(
 *             name="Proprietary",
 *             url="https://alfamart.com"
 *         )
 *     ),
 *     @OA\Server(
 *         url="http://localhost:8000",
 *         description="Local Development Server"
 *     ),
 *     @OA\Server(
 *         url="https://api.alfamart.com",
 *         description="Production Server"
 *     ),
 *     @OA\SecurityScheme(
 *         securityScheme="sanctum",
 *         type="http",
 *         scheme="bearer",
 *         bearerFormat="JWT",
 *         description="Enter token in format: Bearer {token}"
 *     ),
 *     @OA\Tag(
 *         name="Authentication",
 *         description="API Endpoints untuk autentikasi user"
 *     ),
 *     @OA\Tag(
 *         name="Dashboard",
 *         description="API Endpoints untuk dashboard dan statistik"
 *     ),
 *     @OA\Tag(
 *         name="Reports",
 *         description="API Endpoints untuk CRUD laporan shift"
 *     )
 * )
 */
