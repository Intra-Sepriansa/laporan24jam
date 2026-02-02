<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Password format: KODE_TOKO#3_DIGIT_TERAKHIR_NIK
     */
    public function run(): void
    {
        $employees = DB::table('employees')->get();

        foreach ($employees as $employee) {
            $store = DB::table('stores')->where('id', $employee->store_id)->first();
            
            if ($store) {
                // Ambil 3 digit terakhir NIK
                $last3Digits = substr($employee->nik, -3);
                
                // Format password: KODE_TOKO#3_DIGIT_TERAKHIR
                $password = $store->code . '#' . $last3Digits;
                
                DB::table('users')->insert([
                    'employee_id' => $employee->id,
                    'nik' => $employee->nik,
                    'name' => $employee->name,
                    'email' => strtolower(str_replace(' ', '', $employee->name)) . '@store.com',
                    'password' => Hash::make($password),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
