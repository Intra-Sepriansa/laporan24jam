# 🛠️ TECH STACK DETAILS - SISTEM LAPORAN SHIFT 3

## 📦 Current Stack Analysis

### ✅ Already Installed & Configured:

```json
{
  "backend": {
    "framework": "Laravel 11.x",
    "php": "8.2+",
    "database": "SQLite (dev) / MySQL (prod)",
    "authentication": "Laravel Fortify",
    "frontend_integration": "Inertia.js",
    "packages": [
      "laravel/fortify",
      "inertiajs/inertia-laravel"
    ]
  },
  "frontend": {
    "framework": "React 18.x",
    "language": "TypeScript 5.x",
    "ui_library": "shadcn/ui",
    "styling": "Tailwind CSS 3.x",
    "build_tool": "Vite 5.x",
    "components": [
      "Radix UI primitives",
      "Lucide React icons",
      "React Hook Form",
      "Zod validation"
    ]
  }
}
```

---

## 🎯 Why This Tech Stack?

### 1. **Laravel 11 + Inertia.js**
**Keuntungan:**
- ✅ Modern monolith architecture (best of both worlds)
- ✅ No API overhead (direct props passing)
- ✅ SEO-friendly (server-side rendering)
- ✅ Type-safe dengan TypeScript
- ✅ Hot module replacement (HMR)
- ✅ Shared data & validation
- ✅ Easy deployment (single codebase)

**Perfect untuk:**
- Dashboard applications
- Admin panels
- Internal tools
- CRUD applications

### 2. **React + TypeScript**
**Keuntungan:**
- ✅ Type safety (catch errors early)
- ✅ Better IDE support (autocomplete)
- ✅ Component reusability
- ✅ Large ecosystem
- ✅ Easy to maintain
- ✅ Great developer experience

### 3. **shadcn/ui + Tailwind CSS**
**Keuntungan:**
- ✅ Copy-paste components (no npm bloat)
- ✅ Fully customizable
- ✅ Accessible by default (Radix UI)
- ✅ Beautiful design
- ✅ Dark mode support
- ✅ Responsive out of the box
- ✅ Consistent design system

---

## 📦 Additional Packages to Install

### Backend Packages:

#### 1. **Laravel Excel** (Export/Import)
```bash
composer require maatwebsite/excel
```
**Use case:** Export laporan ke Excel format

#### 2. **DomPDF** (PDF Generation)
```bash
composer require barryvdh/laravel-dompdf
```
**Use case:** Generate PDF laporan

#### 3. **Laravel Debugbar** (Development)
```bash
composer require barryvdh/laravel-debugbar --dev
```
**Use case:** Debug queries & performance

#### 4. **Laravel Telescope** (Monitoring)
```bash
composer require laravel/telescope --dev
```
**Use case:** Monitor requests, queries, jobs, etc

#### 5. **Spatie Laravel Permission** (Roles & Permissions)
```bash
composer require spatie/laravel-permission
```
**Use case:** Role-based access control

#### 6. **Laravel Backup** (Database Backup)
```bash
composer require spatie/laravel-backup
```
**Use case:** Automated database backups

#### 7. **Laravel Activity Log** (Audit Trail)
```bash
composer require spatie/laravel-activitylog
```
**Use case:** Track user activities

---

### Frontend Packages:

#### 1. **TanStack Query** (Data Fetching)
```bash
npm install @tanstack/react-query
```
**Use case:** Server state management, caching

#### 2. **TanStack Table** (Advanced Tables)
```bash
npm install @tanstack/react-table
```
**Use case:** Sortable, filterable tables

#### 3. **Recharts** (Charts & Graphs)
```bash
npm install recharts
```
**Use case:** Sales charts, analytics

#### 4. **date-fns** (Date Handling)
```bash
npm install date-fns
```
**Use case:** Format dates, calculate ranges

#### 5. **Sonner** (Toast Notifications)
```bash
npm install sonner
```
**Use case:** Success/error notifications

#### 6. **React Dropzone** (File Upload)
```bash
npm install react-dropzone
```
**Use case:** Upload files (optional)

#### 7. **Framer Motion** (Animations)
```bash
npm install framer-motion
```
**Use case:** Smooth animations & transitions

---

## 🏗️ Architecture Patterns

### 1. **Repository Pattern** (Backend)

```php
// Interface
interface ShiftReportRepositoryInterface
{
    public function all();
    public function find($id);
    public function create(array $data);
    public function update($id, array $data);
    public function delete($id);
}

// Implementation
class ShiftReportRepository implements ShiftReportRepositoryInterface
{
    protected $model;

    public function __construct(ShiftReport $model)
    {
        $this->model = $model;
    }

    public function all()
    {
        return $this->model->with(['store', 'user', 'details'])->get();
    }

    // ... other methods
}

// Service
class ShiftReportService
{
    protected $repository;

    public function __construct(ShiftReportRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function createReport(array $data)
    {
        // Business logic here
        return $this->repository->create($data);
    }
}
```

**Benefits:**
- ✅ Separation of concerns
- ✅ Easy to test
- ✅ Reusable code
- ✅ Easy to swap implementations

---

### 2. **Action Pattern** (Backend)

```php
// Single responsibility actions
class CreateShiftReport
{
    public function execute(array $data): ShiftReport
    {
        DB::beginTransaction();
        
        try {
            $report = ShiftReport::create([
                'store_id' => $data['store_id'],
                'user_id' => auth()->id(),
                'report_date' => $data['report_date'],
                'shift' => $data['shift'],
                'month_year' => $data['month_year'],
            ]);

            foreach ($data['details'] as $detail) {
                $report->details()->create($detail);
            }

            DB::commit();
            
            event(new ShiftReportCreated($report));
            
            return $report;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}

// Usage in controller
public function store(ShiftReportRequest $request)
{
    $report = app(CreateShiftReport::class)->execute($request->validated());
    
    return redirect()->route('reports.show', $report)
        ->with('success', 'Laporan berhasil dibuat!');
}
```

**Benefits:**
- ✅ Single responsibility
- ✅ Testable
- ✅ Reusable
- ✅ Clean controllers

---

### 3. **Custom Hooks Pattern** (Frontend)

```typescript
// hooks/useShiftReport.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { shiftReportService } from '@/services/shiftReportService';

export function useShiftReports(filters?: ReportFilters) {
  return useQuery({
    queryKey: ['shift-reports', filters],
    queryFn: () => shiftReportService.getAll(filters),
  });
}

export function useShiftReport(id: number) {
  return useQuery({
    queryKey: ['shift-report', id],
    queryFn: () => shiftReportService.getById(id),
  });
}

export function useCreateShiftReport() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: shiftReportService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shift-reports'] });
    },
  });
}

export function useUpdateShiftReport() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ShiftReportData }) =>
      shiftReportService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['shift-report', id] });
      queryClient.invalidateQueries({ queryKey: ['shift-reports'] });
    },
  });
}

// Usage in component
function ReportList() {
  const { data: reports, isLoading } = useShiftReports();
  const createReport = useCreateShiftReport();
  
  const handleCreate = (data: ShiftReportData) => {
    createReport.mutate(data, {
      onSuccess: () => {
        toast.success('Laporan berhasil dibuat!');
      },
    });
  };
  
  // ... render
}
```

**Benefits:**
- ✅ Reusable logic
- ✅ Automatic caching
- ✅ Optimistic updates
- ✅ Error handling
- ✅ Loading states

---

### 4. **Component Composition** (Frontend)

```typescript
// Atomic Design Pattern

// Atoms (smallest components)
const Button = ({ children, ...props }) => (
  <button className="btn" {...props}>{children}</button>
);

const Input = ({ label, error, ...props }) => (
  <div>
    <label>{label}</label>
    <input {...props} />
    {error && <span className="error">{error}</span>}
  </div>
);

// Molecules (combination of atoms)
const FormField = ({ label, name, error, ...props }) => (
  <div className="form-field">
    <Input label={label} error={error} {...props} />
  </div>
);

// Organisms (complex components)
const ReportForm = ({ onSubmit, initialData }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField
        label="Tanggal"
        {...register('report_date')}
        error={errors.report_date?.message}
      />
      <FormField
        label="Shift"
        {...register('shift')}
        error={errors.shift?.message}
      />
      <Button type="submit">Simpan</Button>
    </form>
  );
};

// Templates (page layouts)
const DashboardTemplate = ({ header, sidebar, content }) => (
  <div className="dashboard-layout">
    <Header>{header}</Header>
    <Sidebar>{sidebar}</Sidebar>
    <Content>{content}</Content>
  </div>
);

// Pages (full pages)
const DashboardPage = () => (
  <DashboardTemplate
    header={<DashboardHeader />}
    sidebar={<DashboardSidebar />}
    content={<DashboardContent />}
  />
);
```

**Benefits:**
- ✅ Reusable components
- ✅ Easy to maintain
- ✅ Consistent UI
- ✅ Easy to test

---

## 🔥 Advanced Features Implementation

### 1. **Real-time Updates** (Laravel Echo + Pusher)

```php
// Backend - Broadcasting
class ShiftReportCreated implements ShouldBroadcast
{
    public $report;

    public function broadcastOn()
    {
        return new Channel('reports');
    }

    public function broadcastAs()
    {
        return 'report.created';
    }
}

// Frontend - Listening
import Echo from 'laravel-echo';

const echo = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_PUSHER_APP_KEY,
});

echo.channel('reports')
  .listen('.report.created', (e) => {
    toast.success(`Laporan baru: ${e.report.month_year}`);
    queryClient.invalidateQueries(['shift-reports']);
  });
```

---

### 2. **Optimistic Updates**

```typescript
const updateReport = useMutation({
  mutationFn: shiftReportService.update,
  onMutate: async (newData) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries(['shift-report', newData.id]);
    
    // Snapshot previous value
    const previous = queryClient.getQueryData(['shift-report', newData.id]);
    
    // Optimistically update
    queryClient.setQueryData(['shift-report', newData.id], newData);
    
    return { previous };
  },
  onError: (err, newData, context) => {
    // Rollback on error
    queryClient.setQueryData(
      ['shift-report', newData.id],
      context.previous
    );
  },
  onSettled: (data, error, variables) => {
    // Refetch after mutation
    queryClient.invalidateQueries(['shift-report', variables.id]);
  },
});
```

---

### 3. **Infinite Scroll**

```typescript
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useInfiniteQuery({
  queryKey: ['shift-reports'],
  queryFn: ({ pageParam = 1 }) =>
    shiftReportService.getAll({ page: pageParam }),
  getNextPageParam: (lastPage) => lastPage.nextPage,
});

// Usage with Intersection Observer
const { ref, inView } = useInView();

useEffect(() => {
  if (inView && hasNextPage) {
    fetchNextPage();
  }
}, [inView, hasNextPage]);
```

---

### 4. **Form Validation** (Zod + React Hook Form)

```typescript
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const shiftReportSchema = z.object({
  report_date: z.string().min(1, 'Tanggal wajib diisi'),
  shift: z.number().min(1).max(3),
  month_year: z.string().min(1),
  details: z.array(z.object({
    day_number: z.number().min(1).max(31),
    spd: z.number().min(0),
    std: z.number().min(0),
    pulsa: z.number().min(0).optional(),
  })),
});

type ShiftReportFormData = z.infer<typeof shiftReportSchema>;

function ReportForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShiftReportFormData>({
    resolver: zodResolver(shiftReportSchema),
  });

  const onSubmit = (data: ShiftReportFormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* form fields */}
    </form>
  );
}
```

---

## 🚀 Performance Optimization Techniques

### 1. **Database Query Optimization**

```php
// ❌ Bad (N+1 problem)
$reports = ShiftReport::all();
foreach ($reports as $report) {
    echo $report->store->name; // N queries
}

// ✅ Good (Eager loading)
$reports = ShiftReport::with('store')->get();
foreach ($reports as $report) {
    echo $report->store->name; // 1 query
}

// ✅ Better (Select only needed columns)
$reports = ShiftReport::with('store:id,name')
    ->select('id', 'store_id', 'month_year')
    ->get();
```

### 2. **Caching Strategy**

```php
// Cache expensive queries
$statistics = Cache::remember('dashboard.statistics', 3600, function () {
    return [
        'total_sales' => ShiftReportDetail::sum('spd'),
        'total_reports' => ShiftReport::count(),
        'total_stores' => Store::count(),
    ];
});

// Cache with tags (easier invalidation)
Cache::tags(['reports', 'statistics'])->remember('monthly.stats', 3600, function () {
    return ShiftReport::whereMonth('report_date', now()->month)->get();
});

// Invalidate cache
Cache::tags(['reports'])->flush();
```

### 3. **Code Splitting** (Frontend)

```typescript
// Lazy load pages
const Dashboard = lazy(() => import('@/pages/dashboard'));
const Reports = lazy(() => import('@/pages/reports'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </Suspense>
  );
}
```

---

## 📊 Monitoring & Debugging

### Laravel Telescope
```bash
# Install
composer require laravel/telescope --dev
php artisan telescope:install
php artisan migrate

# Access at: /telescope
```

**Features:**
- Request monitoring
- Query logging
- Job tracking
- Exception tracking
- Cache monitoring

### React DevTools
- Component tree inspection
- Props & state debugging
- Performance profiling
- Hook debugging

---

## 🎯 Summary

**This tech stack provides:**
- ✅ Modern, maintainable codebase
- ✅ Type-safe development
- ✅ Great developer experience
- ✅ High performance
- ✅ Scalable architecture
- ✅ Easy deployment
- ✅ Rich ecosystem
- ✅ Active community support

**Perfect for:**
- Internal business applications
- Dashboard & admin panels
- CRUD applications
- Data-heavy applications
- Real-time applications

**Ready to build something amazing!** 🚀
