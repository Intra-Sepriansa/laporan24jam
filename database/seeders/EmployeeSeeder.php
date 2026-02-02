<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employees = [
            ['nik' => '14085061', 'name' => 'SUNARDI', 'store_code' => 'TB56'],
            ['nik' => '17110563', 'name' => 'AAN', 'store_code' => 'TB56'],
            ['nik' => '19085703', 'name' => 'TAQWA', 'store_code' => 'TB56'],
            ['nik' => '19050173', 'name' => 'RIKA', 'store_code' => 'TB56'],
            ['nik' => '22103779', 'name' => 'DEKON', 'store_code' => 'TB56'],
            ['nik' => '23067788', 'name' => 'ISNAN', 'store_code' => 'TB56'],
            ['nik' => '23082187', 'name' => 'NAUFAL', 'store_code' => 'TB56'],
            ['nik' => '22051086', 'name' => 'INTRA', 'store_code' => 'TB56'],
            ['nik' => '26015149', 'name' => 'AMAR', 'store_code' => 'TB56'],
            ['nik' => '23052003', 'name' => 'ROS', 'store_code' => 'TB56'],
            ['nik' => '25062196', 'name' => 'AULIA', 'store_code' => 'TB56'],
            ['nik' => '23072045', 'name' => 'ULPAH', 'store_code' => 'TB56'],
        ];

        foreach ($employees as $employee) {
            $store = DB::table('stores')->where('code', $employee['store_code'])->first();
            
            DB::table('employees')->insert([
                'nik' => $employee['nik'],
                'name' => $employee['name'],
                'store_id' => $store ? $store->id : null,
                'position' => 'Staff',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
