<?php

namespace Database\Seeders;

use App\Models\CashCategory;
use Illuminate\Database\Seeder;

class CashCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            // Income Categories
            [
                'name' => 'Penjualan Tunai',
                'type' => 'income',
                'icon' => 'ShoppingCart',
                'color' => '#10B981',
                'description' => 'Pemasukan dari penjualan tunai',
            ],
            [
                'name' => 'Penjualan Non-Tunai',
                'type' => 'income',
                'icon' => 'CreditCard',
                'color' => '#3B82F6',
                'description' => 'Pemasukan dari penjualan non-tunai (EDC, QRIS)',
            ],
            [
                'name' => 'Lain-lain',
                'type' => 'income',
                'icon' => 'Plus',
                'color' => '#8B5CF6',
                'description' => 'Pemasukan lain-lain',
            ],

            // Expense Categories
            [
                'name' => 'Gaji Karyawan',
                'type' => 'expense',
                'icon' => 'Users',
                'color' => '#EF4444',
                'description' => 'Pengeluaran untuk gaji karyawan',
            ],
            [
                'name' => 'Operasional Toko',
                'type' => 'expense',
                'icon' => 'Store',
                'color' => '#F59E0B',
                'description' => 'Biaya operasional toko (listrik, air, dll)',
            ],
            [
                'name' => 'Pembelian Barang',
                'type' => 'expense',
                'icon' => 'Package',
                'color' => '#EC4899',
                'description' => 'Pembelian stok barang',
            ],
            [
                'name' => 'Perawatan & Perbaikan',
                'type' => 'expense',
                'icon' => 'Wrench',
                'color' => '#6366F1',
                'description' => 'Biaya perawatan dan perbaikan',
            ],
            [
                'name' => 'Transportasi',
                'type' => 'expense',
                'icon' => 'Truck',
                'color' => '#14B8A6',
                'description' => 'Biaya transportasi dan pengiriman',
            ],
            [
                'name' => 'Administrasi',
                'type' => 'expense',
                'icon' => 'FileText',
                'color' => '#64748B',
                'description' => 'Biaya administrasi dan ATK',
            ],
            [
                'name' => 'Lain-lain',
                'type' => 'expense',
                'icon' => 'Minus',
                'color' => '#94A3B8',
                'description' => 'Pengeluaran lain-lain',
            ],
        ];

        foreach ($categories as $category) {
            CashCategory::create($category);
        }
    }
}
