<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\Employee;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class AttendanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Data jadwal dari gambar (Februari 2026)
        // Format: [nik => [tanggal => shift]]
        $scheduleData = [
            '14085061' => [ // SUNARDI
                1 => 1, 2 => null, 3 => 2, 4 => 3, 5 => 2, 6 => null, 7 => 3, 8 => 2, 9 => 3, 10 => 2, 
                11 => 1, 12 => null, 13 => 3, 14 => 2, 15 => 1,
                16 => 1, 17 => 1, 18 => null, 19 => 3, 20 => 2, 21 => 2, 22 => 1, 23 => 1, 24 => null, 
                25 => 3, 26 => 2, 27 => 1, 28 => 1
            ],
            '17110563' => [ // AAN
                1 => null, 2 => 3, 3 => null, 4 => null, 5 => 3, 6 => 2, 7 => null, 8 => 3, 9 => null, 10 => 3, 
                11 => 2, 12 => null, 13 => null, 14 => 3, 15 => 3,
                16 => 3, 17 => 2, 18 => 1, 19 => null, 20 => 3, 21 => 3, 22 => 3, 23 => 2, 24 => 1, 
                25 => null, 26 => 3, 27 => 3, 28 => 3
            ],
            '19085703' => [ // TAQWA
                1 => 3, 2 => 2, 3 => 1, 4 => 1, 5 => null, 6 => 3, 7 => 2, 8 => 3, 9 => 2, 10 => 1, 
                11 => null, 12 => 3, 13 => 2, 14 => 1, 15 => 3,
                16 => null, 17 => null, 18 => 3, 19 => 3, 20 => 2, 21 => 1, 22 => 1, 23 => null, 24 => 3, 
                25 => 3, 26 => 2, 27 => 1, 28 => null, 29 => 3
            ],
            '19050173' => [ // RIKA
                1 => 2, 2 => 1, 3 => null, 4 => 2, 5 => 1, 6 => 1, 7 => 1, 8 => 1, 9 => 1, 10 => null, 
                11 => 2, 12 => 1, 13 => 1, 14 => 1, 15 => null, 16 => 2,
                17 => null, 18 => 1, 19 => 2, 20 => 1, 21 => null, 22 => null, 23 => 2, 24 => 2, 25 => 1, 
                26 => null, 27 => 2, 28 => 2
            ],
            '22103779' => [ // DEKON
                1 => 11, 2 => 2, 3 => 1, 4 => null, 5 => 3, 6 => 2, 7 => 1, 8 => null, 9 => 3, 10 => 2, 
                11 => 1, 12 => 1, 13 => null, 14 => 2, 15 => 3,
                16 => 2, 17 => 2, 18 => 1, 19 => null, 20 => 2, 21 => 1, 22 => 1, 23 => 2, 24 => 1, 
                25 => null, 26 => 2, 27 => 1, 28 => 2
            ],
            '23067788' => [ // ISNAN
                1 => 2, 2 => 1, 3 => 2, 4 => 1, 5 => 1, 6 => 2, 7 => 2, 8 => 1, 9 => 1, 10 => null, 
                11 => null, 12 => 2, 13 => 2, 14 => 1, 15 => 1,
                16 => 1, 17 => null, 18 => 2, 19 => 1, 20 => 2, 21 => 1, 22 => 1, 23 => null, 24 => null, 
                25 => 2, 26 => 1, 27 => 2, 28 => 1
            ],
            '23082187' => [ // NAUFAL
                1 => 1, 2 => null, 3 => 3, 4 => 2, 5 => 2, 6 => 1, 7 => null, 8 => 2, 9 => 1, 10 => 1, 
                11 => 2, 12 => null, 13 => 1, 14 => 1, 15 => 2,
                16 => 1, 17 => 1, 18 => 2, 19 => 1, 20 => null, 21 => 3, 22 => 2, 23 => 1, 24 => 1, 
                25 => 1, 26 => null, 27 => 3, 28 => 2
            ],
            '22051086' => [ // INTRA
                1 => 3, 2 => 3, 3 => 3, 4 => 3, 5 => null, 6 => 3, 7 => 3, 8 => 3, 9 => null, 10 => 3, 
                11 => 3, 12 => 3, 13 => 3, 14 => 3, 15 => 3,
                16 => 3, 17 => 3, 18 => 3, 19 => 3, 20 => 3, 21 => null, 22 => 3, 23 => 3, 24 => 3, 
                25 => 3, 26 => 3, 27 => null, 28 => 3
            ],
            '26015149' => [ // AMAR
                1 => 1, 2 => 1, 3 => 1, 4 => null, 5 => 2, 6 => 1, 7 => 1, 8 => 2, 9 => null, 10 => 2, 
                11 => 2, 12 => 2, 13 => 1, 14 => 1, 15 => 2,
                16 => null, 17 => 2, 18 => 1, 19 => 1, 20 => 1, 21 => 2, 22 => null, 23 => 2, 24 => 2, 
                25 => 2, 26 => 1, 27 => 2, 28 => 1
            ],
            '26015419' => [ // NUYAN
                1 => null, 2 => null, 3 => null, 4 => null, 5 => null, 6 => 2, 7 => 1, 8 => 2, 9 => 2, 10 => 1, 
                11 => 1, 12 => null, 13 => 1, 14 => 2, 15 => 1,
                16 => 1, 17 => 1, 18 => null, 19 => 3, 20 => 2, 21 => 2, 22 => 1, 23 => 1, 24 => null, 
                25 => 2, 26 => 1, 27 => 2, 28 => 1, 29 => 1
            ],
            '23052003' => [ // ROS
                1 => 2, 2 => 1, 3 => 2, 4 => 2, 5 => 1, 6 => null, 7 => 2, 8 => 1, 9 => 2, 10 => 2, 
                11 => 1, 12 => null, 13 => 2, 14 => 2, 15 => 1, 16 => 2,
                17 => 2, 18 => 1, 19 => null, 20 => 2, 21 => 2, 22 => 2, 23 => 2, 24 => 1, 25 => null, 
                26 => 2, 27 => 2, 28 => 1, 29 => 2
            ],
            '25062196' => [ // AULIA
                1 => 1, 2 => 2, 3 => 2, 4 => 1, 5 => null, 6 => 2, 7 => 1, 8 => 1, 9 => 1, 10 => 1, 
                11 => null, 12 => 2, 13 => 2, 14 => 2, 15 => 1,
                16 => 1, 17 => null, 18 => 2, 19 => 1, 20 => 2, 21 => 1, 22 => 1, 23 => null, 24 => 2, 
                25 => 1, 26 => 1, 27 => 2, 28 => 1
            ],
            '23072045' => [ // ULPAH
                1 => null, 2 => 2, 3 => 1, 4 => 2, 5 => 2, 6 => 1, 7 => 2, 8 => 2, 9 => 1, 10 => null, 
                11 => 2, 12 => 1, 13 => 1, 14 => 2, 15 => 1,
                16 => null, 17 => 2, 18 => 1, 19 => 2, 20 => 1, 21 => null, 22 => 2, 23 => 2, 24 => 1, 
                25 => 1, 26 => 2, 27 => 1, 28 => null
            ],
        ];

        // Get store TB56
        $store = \App\Models\Store::where('code', 'TB56')->first();

        if (!$store) {
            $this->command->error('Store TB56 not found!');
            return;
        }

        // Generate attendance data for February 2026
        foreach ($scheduleData as $nik => $schedule) {
            $employee = Employee::where('nik', $nik)->first();
            
            if (!$employee) {
                $this->command->warn("Employee with NIK {$nik} not found, skipping...");
                continue;
            }

            foreach ($schedule as $day => $shift) {
                if ($shift === null) {
                    // Day off - create attendance with status 'off'
                    $date = Carbon::create(2026, 2, $day);
                    
                    Attendance::create([
                        'employee_id' => $employee->id,
                        'store_id' => $store->id,
                        'attendance_date' => $date->format('Y-m-d'),
                        'clock_in' => null,
                        'clock_out' => null,
                        'shift' => 3, // Default shift 3
                        'status' => 'off',
                        'notes' => 'Libur',
                    ]);
                } else {
                    // Working day - create attendance with clock in/out
                    $date = Carbon::create(2026, 2, $day);
                    
                    // Generate realistic clock in/out times based on shift
                    $clockIn = null;
                    $clockOut = null;
                    $status = 'present';
                    
                    if ($shift == 1) {
                        // Shift 1 (Pagi): 06:00 - 14:00
                        $clockIn = '06:' . str_pad(rand(0, 15), 2, '0', STR_PAD_LEFT);
                        $clockOut = '14:' . str_pad(rand(0, 30), 2, '0', STR_PAD_LEFT);
                    } elseif ($shift == 2) {
                        // Shift 2 (Siang): 14:00 - 22:00
                        $clockIn = '14:' . str_pad(rand(0, 15), 2, '0', STR_PAD_LEFT);
                        $clockOut = '22:' . str_pad(rand(0, 30), 2, '0', STR_PAD_LEFT);
                    } elseif ($shift == 3) {
                        // Shift 3 (Malam): 22:00 - 06:00
                        $clockIn = '22:' . str_pad(rand(0, 30), 2, '0', STR_PAD_LEFT);
                        $clockOut = '06:' . str_pad(rand(0, 30), 2, '0', STR_PAD_LEFT);
                        
                        // Random late status (10% chance)
                        if (rand(1, 10) == 1) {
                            $clockIn = '22:' . str_pad(rand(20, 45), 2, '0', STR_PAD_LEFT);
                            $status = 'late';
                        }
                    } elseif ($shift == 11) {
                        // Special case for shift 11 (maybe training or special duty)
                        $clockIn = '08:00';
                        $clockOut = '16:00';
                        $status = 'present';
                    }
                    
                    Attendance::create([
                        'employee_id' => $employee->id,
                        'store_id' => $store->id,
                        'attendance_date' => $date->format('Y-m-d'),
                        'clock_in' => $clockIn,
                        'clock_out' => $clockOut,
                        'shift' => $shift == 11 ? 1 : $shift, // Convert shift 11 to shift 1
                        'status' => $status,
                        'notes' => $shift == 11 ? 'Training/Special Duty' : null,
                    ]);
                }
            }
            
            $this->command->info("Created attendance records for {$employee->name} ({$nik})");
        }

        $this->command->info('Attendance seeder completed successfully!');
    }
}
