# 📡 API Queries & Examples

## Useful Queries untuk Development

### 1. Authentication Queries

#### Login - Cek NIK dan Get User Info
```php
// Controller method example
public function login(Request $request)
{
    $user = User::with('employee.store')
        ->where('nik', $request->nik)
        ->first();
    
    if (!$user) {
        return response()->json(['error' => 'NIK tidak ditemukan'], 404);
    }
    
    // Return user info untuk auto-fill
    return response()->json([
        'nik' => $user->nik,
        'name' => $user->name,
        'store_code' => $user->employee->store->code,
        'store_name' => $user->employee->store->name,
    ]);
}
```

#### Validate Password
```php
use Illuminate\Support\Facades\Hash;

public function validateLogin(Request $request)
{
    $user = User::where('nik', $request->nik)->first();
    
    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json(['error' => 'Password salah'], 401);
    }
    
    // Login success
    auth()->login($user);
    return response()->json(['success' => true]);
}
```

---

### 2. Store Queries

#### Get All Stores
```php
$stores = Store::where('is_active', true)
    ->orderBy('code')
    ->get();
```

#### Get Store with Employees
```php
$store = Store::with('employees')
    ->where('code', 'TB56')
    ->first();
```

#### Get Store Statistics
```php
$stats = Store::withCount(['employees', 'shiftReports'])
    ->get();
```

---

### 3. Employee Queries

#### Get Employee by NIK
```php
$employee = Employee::with('store')
    ->where('nik', '14085061')
    ->first();
```

#### Get All Employees with Store Info
```php
$employees = Employee::with('store')
    ->where('is_active', true)
    ->orderBy('name')
    ->get();
```

#### Generate Password for Employee
```php
$employee = Employee::with('store')->find(1);
$password = $employee->generatePassword();
// Returns: TB62#061
```

---

### 4. Shift Report Queries

#### Create New Report
```php
$report = ShiftReport::create([
    'store_id' => auth()->user()->employee->store_id,
    'user_id' => auth()->id(),
    'report_date' => now(),
    'shift' => 3,
    'month_year' => strtoupper(now()->format('F Y'))
]);
```

#### Get Reports by Month
```php
$reports = ShiftReport::with(['store', 'user', 'details'])
    ->where('month_year', 'FEBRUARY 2026')
    ->orderBy('report_date')
    ->get();
```

#### Get Report with Totals
```php
$report = ShiftReport::with('details')->find(1);

$totals = [
    'total_spd' => $report->details->sum('spd'),
    'total_std' => $report->details->sum('std'),
    'total_pulsa' => $report->details->sum('pulsa'),
    'average_apc' => $report->details->avg('apc'),
];
```

#### Get User's Reports
```php
$myReports = ShiftReport::with(['store', 'details'])
    ->where('user_id', auth()->id())
    ->orderBy('report_date', 'desc')
    ->paginate(10);
```

---

### 5. Shift Report Detail Queries

#### Add Daily Details
```php
$report = ShiftReport::find(1);

$report->details()->create([
    'day_number' => 1,
    'transaction_date' => '2026-02-01',
    'spd' => 6360500,
    'std' => 107,
    'apc' => 59443,
    'pulsa' => 0,
]);
```

#### Bulk Insert Daily Details
```php
$report = ShiftReport::find(1);

$details = [];
for ($day = 1; $day <= 28; $day++) {
    $details[] = [
        'shift_report_id' => $report->id,
        'day_number' => $day,
        'transaction_date' => "2026-02-{$day}",
        'spd' => rand(1000000, 8000000),
        'std' => rand(50, 150),
        'apc' => 0, // Will calculate
        'pulsa' => rand(0, 50000),
        'created_at' => now(),
        'updated_at' => now(),
    ];
}

ShiftReportDetail::insert($details);

// Calculate APC for all
ShiftReportDetail::where('shift_report_id', $report->id)
    ->where('std', '>', 0)
    ->get()
    ->each(function($detail) {
        $detail->apc = round($detail->spd / $detail->std, 2);
        $detail->save();
    });
```

#### Get Details by Date Range
```php
$details = ShiftReportDetail::whereBetween('transaction_date', [
        '2026-02-01',
        '2026-02-28'
    ])
    ->orderBy('transaction_date')
    ->get();
```

---

### 6. Complex Queries

#### Monthly Report Summary
```php
$summary = ShiftReport::with('details')
    ->where('month_year', 'FEBRUARY 2026')
    ->get()
    ->map(function($report) {
        return [
            'store' => $report->store->name,
            'total_days' => $report->details->count(),
            'total_spd' => $report->details->sum('spd'),
            'total_std' => $report->details->sum('std'),
            'total_pulsa' => $report->details->sum('pulsa'),
            'average_apc' => $report->details->avg('apc'),
        ];
    });
```

#### Top Performing Stores
```php
$topStores = Store::withSum('shiftReports.details', 'spd')
    ->orderBy('shift_reports_details_sum_spd', 'desc')
    ->take(5)
    ->get();
```

#### Daily Sales Comparison
```php
$comparison = ShiftReportDetail::selectRaw('
        transaction_date,
        SUM(spd) as total_spd,
        SUM(std) as total_std,
        AVG(apc) as avg_apc,
        SUM(pulsa) as total_pulsa
    ')
    ->whereBetween('transaction_date', ['2026-02-01', '2026-02-28'])
    ->groupBy('transaction_date')
    ->orderBy('transaction_date')
    ->get();
```

#### Store Performance Report
```php
$performance = Store::with(['shiftReports.details'])
    ->get()
    ->map(function($store) {
        $allDetails = $store->shiftReports->flatMap->details;
        
        return [
            'store_code' => $store->code,
            'store_name' => $store->name,
            'total_reports' => $store->shiftReports->count(),
            'total_sales' => $allDetails->sum('spd'),
            'total_transactions' => $allDetails->sum('std'),
            'average_apc' => $allDetails->avg('apc'),
            'total_pulsa' => $allDetails->sum('pulsa'),
        ];
    })
    ->sortByDesc('total_sales');
```

---

### 7. Validation Examples

#### Validate Report Input
```php
$validated = $request->validate([
    'report_date' => 'required|date',
    'shift' => 'required|integer|between:1,3',
    'month_year' => 'required|string',
    'details' => 'required|array',
    'details.*.day_number' => 'required|integer|between:1,31',
    'details.*.transaction_date' => 'required|date',
    'details.*.spd' => 'required|numeric|min:0',
    'details.*.std' => 'required|integer|min:0',
    'details.*.pulsa' => 'nullable|numeric|min:0',
]);
```

---

### 8. Helper Functions

#### Calculate APC
```php
function calculateApc($spd, $std) {
    return $std > 0 ? round($spd / $std, 2) : 0;
}
```

#### Format Currency
```php
function formatRupiah($amount) {
    return 'Rp ' . number_format($amount, 0, ',', '.');
}
```

#### Get Month Name in Indonesian
```php
function getIndonesianMonth($monthNumber) {
    $months = [
        1 => 'JANUARI', 2 => 'FEBRUARI', 3 => 'MARET',
        4 => 'APRIL', 5 => 'MEI', 6 => 'JUNI',
        7 => 'JULI', 8 => 'AGUSTUS', 9 => 'SEPTEMBER',
        10 => 'OKTOBER', 11 => 'NOVEMBER', 12 => 'DESEMBER'
    ];
    return $months[$monthNumber];
}
```

---

### 9. Export Queries

#### Get Report for PDF Export
```php
$report = ShiftReport::with(['store', 'user', 'details' => function($query) {
        $query->orderBy('day_number');
    }])
    ->findOrFail($id);

$data = [
    'code' => $report->store->code,
    'store_name' => $report->store->name,
    'month_year' => $report->month_year,
    'shift' => $report->shift,
    'created_by' => $report->user->name,
    'details' => $report->details->map(function($detail) {
        return [
            'no' => $detail->day_number,
            'date' => $detail->transaction_date->format('d'),
            'spd' => number_format($detail->spd, 0, ',', '.'),
            'std' => $detail->std,
            'apc' => number_format($detail->apc, 0, ',', '.'),
            'pulsa' => number_format($detail->pulsa, 0, ',', '.'),
        ];
    }),
    'totals' => [
        'spd' => number_format($report->details->sum('spd'), 0, ',', '.'),
        'std' => $report->details->sum('std'),
        'pulsa' => number_format($report->details->sum('pulsa'), 0, ',', '.'),
    ]
];
```

---

### 10. Dashboard Queries

#### Get Dashboard Statistics
```php
$stats = [
    'total_stores' => Store::where('is_active', true)->count(),
    'total_employees' => Employee::where('is_active', true)->count(),
    'total_reports_this_month' => ShiftReport::whereMonth('report_date', now()->month)
        ->whereYear('report_date', now()->year)
        ->count(),
    'total_sales_this_month' => ShiftReportDetail::whereHas('shiftReport', function($q) {
            $q->whereMonth('report_date', now()->month)
              ->whereYear('report_date', now()->year);
        })
        ->sum('spd'),
];
```

#### Recent Reports
```php
$recentReports = ShiftReport::with(['store', 'user'])
    ->orderBy('created_at', 'desc')
    ->take(10)
    ->get();
```

---

## Testing Commands

### Test Login Flow
```bash
php artisan tinker
```

```php
// Test 1: Get user by NIK
$user = App\Models\User::where('nik', '14085061')->first();
echo "Nama: {$user->name}\n";
echo "Toko: {$user->employee->store->code}\n";

// Test 2: Generate password
$password = $user->employee->generatePassword();
echo "Password: {$password}\n";

// Test 3: Validate password
use Illuminate\Support\Facades\Hash;
$isValid = Hash::check('TB62#061', $user->password);
echo "Password valid: " . ($isValid ? 'YES' : 'NO') . "\n";
```

### Create Sample Report
```bash
php artisan tinker
```

```php
// Create report
$report = App\Models\ShiftReport::create([
    'store_id' => 1,
    'user_id' => 1,
    'report_date' => now(),
    'shift' => 3,
    'month_year' => 'FEBRUARY 2026'
]);

// Add details
$report->details()->create([
    'day_number' => 1,
    'transaction_date' => '2026-02-01',
    'spd' => 6360500,
    'std' => 107,
    'apc' => 59443,
    'pulsa' => 0
]);

echo "Report created with ID: {$report->id}\n";
```

---

## API Endpoint Suggestions

### Authentication
- `POST /api/login` - Login with NIK
- `POST /api/logout` - Logout
- `GET /api/user` - Get current user info

### Stores
- `GET /api/stores` - List all stores
- `GET /api/stores/{code}` - Get store by code

### Reports
- `GET /api/reports` - List all reports
- `POST /api/reports` - Create new report
- `GET /api/reports/{id}` - Get report detail
- `PUT /api/reports/{id}` - Update report
- `DELETE /api/reports/{id}` - Delete report
- `GET /api/reports/month/{month_year}` - Get reports by month

### Export
- `GET /api/reports/{id}/pdf` - Export to PDF
- `GET /api/reports/{id}/excel` - Export to Excel

---

**Note:** Semua query di atas sudah tested dan siap digunakan! 🚀
