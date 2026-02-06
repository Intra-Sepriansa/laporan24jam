# TODO - Implementasi 6 Menu Baru

## Phase 1: Database & Backend ✅

### Migrations ✅
- [x] `create_targets_table` — target bulanan per toko
- [x] `create_shift_notes_table` — catatan serah terima shift
- [x] `create_shift_checklists_table` — checklist shift
- [x] `add_extra_fields_to_stores_table` — tambah address, phone, photo_path, description

### Models ✅
- [x] `Target.php`
- [x] `ShiftNote.php`
- [x] `ShiftChecklist.php`
- [x] `Store.php` — updated with new relations

### Controllers ✅
- [x] `AnalyticsController.php` — analitik & perbandingan
- [x] `TargetController.php` — target & KPI
- [x] `EmployeeController.php` — manajemen karyawan
- [x] `StoreProfileController.php` — profil toko
- [x] `ShiftNoteController.php` — catatan & checklist
- [x] `SummaryController.php` — ringkasan & export center

### Routes ✅
- [x] `routes/web.php` — updated with all 6 new resource routes

## Phase 2: Frontend Pages ✅

- [x] `resources/js/pages/analytics/index.tsx` — Dashboard analitik dengan chart interaktif
- [x] `resources/js/pages/targets/index.tsx` — Target & KPI dengan progress bars & rings
- [x] `resources/js/pages/employees/index.tsx` — Daftar & kelola karyawan
- [x] `resources/js/pages/store/index.tsx` — Profil toko
- [x] `resources/js/pages/notes/index.tsx` — Catatan & checklist shift
- [x] `resources/js/pages/summary/index.tsx` — Export center & ringkasan

## Phase 3: Navigation Update ✅

- [x] `resources/js/components/app-sidebar.tsx` — tambah 6 menu baru
- [x] `resources/js/components/mobile-nav.tsx` — redesign dengan "More" menu

## Phase 4: Testing & Verification

- [x] Run migrations
- [ ] Verify all pages load correctly
- [ ] Test mobile responsiveness
