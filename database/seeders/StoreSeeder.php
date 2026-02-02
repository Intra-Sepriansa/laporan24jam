<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StoreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $stores = [
            ['code' => 'TB62', 'name' => 'TAMAN KIRANA 2 (F)', 'area' => 'BALARAJA'],
            ['code' => 'T156', 'name' => 'TAMAN KIRANA', 'area' => 'BALARAJA'],
            ['code' => 'TA21', 'name' => 'CISOKA 2', 'area' => 'BALARAJA'],
            ['code' => 'TB35', 'name' => 'RAYA MEGU', 'area' => 'BALARAJA'],
            ['code' => 'TB50', 'name' => 'PASANGGRAHAN', 'area' => 'BALARAJA'],
            ['code' => 'TE13', 'name' => 'TAMAN ADIYASA 2', 'area' => 'BALARAJA'],
            ['code' => 'TE47', 'name' => 'CILELES CIKASUNGKA', 'area' => 'BALARAJA'],
            ['code' => 'TF81', 'name' => 'PESANGGRAHAN SOLEART', 'area' => 'BALARAJA'],
            ['code' => 'TE22', 'name' => 'KP JEUNJING', 'area' => 'BALARAJA'],
            ['code' => 'TB08', 'name' => 'SYECH MUBAROK 3', 'area' => 'BALARAJA'],
            ['code' => 'TG41', 'name' => 'TAMAN ADIYASA', 'area' => 'BALARAJA'],
            ['code' => 'TD10', 'name' => 'MUNJUL 2 (F)', 'area' => 'BALARAJA'],
            ['code' => 'TB49', 'name' => 'MUNJUL', 'area' => 'BALARAJA'],
            ['code' => 'TH69', 'name' => 'RAYA SOLEART', 'area' => 'BALARAJA'],
            ['code' => 'TB56', 'name' => 'RY CANGKUDU CISOKA', 'area' => 'BALARAJA'],
            ['code' => 'TB96', 'name' => 'PINANG TIGARAKSA', 'area' => 'BALARAJA'],
            ['code' => 'TE52', 'name' => 'SODONG 3RAKSA', 'area' => 'BALARAJA'],
        ];

        foreach ($stores as $store) {
            DB::table('stores')->insert([
                'code' => $store['code'],
                'name' => $store['name'],
                'area' => $store['area'],
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
