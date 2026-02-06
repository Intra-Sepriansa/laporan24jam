<?php

namespace App\Http\Controllers\Api;

use App\Models\Employee;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthApiController extends ApiController
{
    /**
     * @OA\Post(
     *     path="/api/auth/login",
     *     tags={"Authentication"},
     *     summary="Login dengan NIK dan Password",
     *     description="Autentikasi user menggunakan NIK (8 digit) dan password",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"nik","password"},
     *             @OA\Property(property="nik", type="string", example="14085061", description="NIK karyawan (8 digit)"),
     *             @OA\Property(property="password", type="string", example="TB56#061", description="Password format: KODE_TOKO#3_DIGIT_TERAKHIR_NIK"),
     *             @OA\Property(property="remember", type="boolean", example=false, description="Remember me")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Login berhasil",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Login berhasil"),
     *             @OA\Property(property="data", type="object",
     *                 @OA\Property(property="token", type="string", example="1|abc123..."),
     *                 @OA\Property(property="user", type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="nik", type="string", example="14085061"),
     *                     @OA\Property(property="name", type="string", example="SUNARDI"),
     *                     @OA\Property(property="email", type="string", example="sunardi@store.com"),
     *                     @OA\Property(property="employee", type="object",
     *                         @OA\Property(property="id", type="integer", example=1),
     *                         @OA\Property(property="nik", type="string", example="14085061"),
     *                         @OA\Property(property="name", type="string", example="SUNARDI"),
     *                         @OA\Property(property="store", type="object",
     *                             @OA\Property(property="id", type="integer", example=1),
     *                             @OA\Property(property="code", type="string", example="TB56"),
     *                             @OA\Property(property="name", type="string", example="RAYA CANGKUDU CISOKA")
     *                         )
     *                     )
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="NIK atau password salah")
     *         )
     *     )
     * )
     */
    public function login(Request $request)
    {
        $request->validate([
            'nik' => 'required|string|size:8',
            'password' => 'required|string',
            'remember' => 'boolean',
        ]);

        $user = User::where('nik', $request->nik)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'nik' => ['NIK atau password salah.'],
            ]);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil',
            'data' => [
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'nik' => $user->nik,
                    'name' => $user->name,
                    'email' => $user->email,
                    'employee' => [
                        'id' => $user->employee->id,
                        'nik' => $user->employee->nik,
                        'name' => $user->employee->name,
                        'store' => [
                            'id' => $user->employee->store->id,
                            'code' => $user->employee->store->code,
                            'name' => $user->employee->store->name,
                        ],
                    ],
                ],
            ],
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/auth/logout",
     *     tags={"Authentication"},
     *     summary="Logout user",
     *     description="Logout dan hapus token autentikasi",
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Logout berhasil",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Logout berhasil")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Unauthenticated.")
     *         )
     *     )
     * )
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil',
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/employee/by-nik",
     *     tags={"Authentication"},
     *     summary="Get employee by NIK",
     *     description="Mendapatkan data karyawan berdasarkan NIK untuk auto-fill form login",
     *     @OA\Parameter(
     *         name="nik",
     *         in="query",
     *         required=true,
     *         description="NIK karyawan (8 digit)",
     *         @OA\Schema(type="string", example="14085061")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Data karyawan ditemukan",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="object",
     *                 @OA\Property(property="nik", type="string", example="14085061"),
     *                 @OA\Property(property="name", type="string", example="SUNARDI"),
     *                 @OA\Property(property="store_code", type="string", example="TB56"),
     *                 @OA\Property(property="store_name", type="string", example="RAYA CANGKUDU CISOKA")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Karyawan tidak ditemukan",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Karyawan tidak ditemukan")
     *         )
     *     )
     * )
     */
    public function getEmployeeByNik(Request $request)
    {
        $request->validate([
            'nik' => 'required|string|size:8',
        ]);

        $employee = Employee::with('store')->where('nik', $request->nik)->first();

        if (!$employee) {
            return response()->json([
                'success' => false,
                'message' => 'Karyawan tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'nik' => $employee->nik,
                'name' => $employee->name,
                'store_code' => $employee->store->code,
                'store_name' => $employee->store->name,
            ],
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/auth/user",
     *     tags={"Authentication"},
     *     summary="Get authenticated user",
     *     description="Mendapatkan data user yang sedang login",
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Data user",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="nik", type="string", example="14085061"),
     *                 @OA\Property(property="name", type="string", example="SUNARDI"),
     *                 @OA\Property(property="email", type="string", example="sunardi@store.com")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     )
     * )
     */
    public function user(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => $request->user(),
        ]);
    }
}
