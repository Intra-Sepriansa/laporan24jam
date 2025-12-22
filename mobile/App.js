import React, { useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native'
import { StatusBar } from 'expo-status-bar'
import * as Clipboard from 'expo-clipboard'
import { useAuth } from './src/hooks/useAuth'
import { useLaporanShift3 } from './src/hooks/useLaporanShift3'
import { bulanList } from './src/constants/bulan'
import { formatNumber } from './src/utils/formatNumber'
import { exportLaporanToExcel } from './src/utils/exportExcel'

const buildReportText = (meta, rows) => {
  const bulanName = bulanList[meta.bulan - 1]?.toUpperCase() ?? ''
  const header = [
    '*Format laporan shift 3*',
    `*KODE : ${meta.kodeToko || '-'}*`,
    `*TOKO : ${meta.namaToko || '-'}*`,
    `*BULAN : ${bulanName} ${meta.tahun || ''}*`,
    '',
    'No / Tanggal / SPD / STD / APC / PULSA',
  ]

  const detailLines = rows
    .filter((row) => row.tanggal !== null || row.spd !== null || row.std !== null || (row.pulsa ?? 0) > 0)
    .map((row, idx) => {
      const tanggalText = row.tanggal ?? ''
      const spdText = row.spd !== null ? formatNumber(row.spd) : ''
      const stdText = row.std !== null ? formatNumber(row.std) : ''
      const apc = row.std && row.std > 0 && row.spd ? Math.round(row.spd / row.std) : row.apc ? row.apc : null
      const apcText = apc ? formatNumber(apc) : ''
      const pulsaText = row.pulsa && row.pulsa > 0 ? formatNumber(row.pulsa) : ''
      return `${idx + 1}. ${tanggalText}/${spdText}/${stdText}/${apcText}/${pulsaText}`
    })

  return [...header, ...detailLines].join('\n')
}

const Button = ({ label, onPress, variant = 'primary', disabled = false, style }) => {
  const background =
    variant === 'primary' ? '#0f60c4' : variant === 'danger' ? '#d64545' : variant === 'secondary' ? '#0ea568' : '#e5e7eb'
  const textColor = variant === 'ghost' ? '#111827' : '#fff'

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        { backgroundColor: background, opacity: disabled ? 0.6 : 1 },
        variant === 'ghost' ? styles.buttonGhost : null,
        style,
      ]}
    >
      <Text style={[styles.buttonText, { color: textColor }]}>{label}</Text>
    </TouchableOpacity>
  )
}

const AuthScreen = ({ onLogin, onRegister, error }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('login')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      if (mode === 'login') {
        await onLogin(email, password)
      } else {
        await onRegister(email, password)
      }
    } catch (err) {
      console.error(err)
      Alert.alert('Gagal', err?.message || 'Cek kembali email/password')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <SafeAreaView style={[styles.container, { justifyContent: 'center' }]}>
      <StatusBar style="dark" />
      <View style={styles.card}>
        <Text style={styles.title}>Laporan Shift 3</Text>
        <Text style={styles.subtitle}>Masuk dengan email & password</Text>
        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
            placeholder="nama@contoh.com"
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            placeholder="Minimal 6 karakter"
          />
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Button label={submitting ? 'Memproses...' : mode === 'login' ? 'Masuk' : 'Daftar'} onPress={handleSubmit} disabled={submitting} />
        <TouchableOpacity onPress={() => setMode(mode === 'login' ? 'register' : 'login')} style={{ marginTop: 12 }}>
          <Text style={{ color: '#0f60c4', textAlign: 'center' }}>
            {mode === 'login' ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default function App() {
  const { user, loading: authLoading, error: authError, login, register, logout } = useAuth()
  const {
    meta,
    rows,
    addRow,
    updateRow,
    deleteRow,
    updateMetaField,
    getSummary,
    resetReport,
    manualSave,
    applySeedData,
  } = useLaporanShift3(user?.uid ?? null)

  const summary = useMemo(() => getSummary(), [getSummary])
  const [reportText, setReportText] = useState('')
  const [statusText, setStatusText] = useState('')
  const [savingMeta, setSavingMeta] = useState(false)
  const [savingData, setSavingData] = useState(false)
  const [exporting, setExporting] = useState(false)

  const notify = (message) => {
    setStatusText(message)
    if (Platform.OS === 'android') ToastAndroid.show(message, ToastAndroid.SHORT)
  }

  const handleGenerate = () => {
    const text = buildReportText(meta, rows)
    setReportText(text)
    notify('Laporan digenerate.')
  }

  const handleCopy = async () => {
    const text = reportText || buildReportText(meta, rows)
    setReportText(text)
    try {
      await Clipboard.setStringAsync(text)
      notify('Teks laporan disalin.')
    } catch (err) {
      console.error(err)
      Alert.alert('Gagal', 'Tidak bisa menyalin ke clipboard.')
    }
  }

  const handleExport = async () => {
    if (exporting) return
    setExporting(true)
    try {
      const { fileName } = await exportLaporanToExcel(meta, rows, summary)
      notify(`File ${fileName} siap dibagikan.`)
    } catch (err) {
      console.error(err)
      Alert.alert('Gagal', 'Tidak bisa membuat file Excel.')
    } finally {
      setExporting(false)
    }
  }

  const handleReset = () => {
    Alert.alert('Reset laporan', 'Hapus semua data untuk meta ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Ya, hapus',
        style: 'destructive',
        onPress: () => {
          resetReport()
          setReportText('')
          notify('Laporan direset.')
        },
      },
    ])
  }

  const handleSave = async (type) => {
    const setter = type === 'meta' ? setSavingMeta : setSavingData
    const savingState = type === 'meta' ? savingMeta : savingData
    if (savingState) return
    setter(true)
    try {
      await manualSave()
      notify('Data tersimpan.')
    } catch (err) {
      console.error(err)
      Alert.alert('Gagal', 'Tidak bisa menyimpan.')
    } finally {
      setter(false)
    }
  }

  if (authLoading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center' }]}>
        <StatusBar style="dark" />
        <ActivityIndicator size="large" color="#0f60c4" />
        <Text style={{ marginTop: 12 }}>Memuat...</Text>
      </SafeAreaView>
    )
  }

  if (!user) {
    return <AuthScreen onLogin={login} onRegister={register} error={authError} />
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <View style={[styles.card, styles.rowBetween]}>
          <View>
            <Text style={styles.title}>Laporan Shift 3</Text>
            <Text style={styles.subtitle}>SPD / STD / APC</Text>
          </View>
          <View>
            <Text style={styles.badge}>{user.email}</Text>
            <Button label="Keluar" onPress={logout} variant="ghost" />
          </View>
        </View>

        {statusText ? (
          <View style={[styles.card, { backgroundColor: '#e0f2fe', borderColor: '#bfdbfe' }]}>
            <Text style={{ color: '#0f60c4' }}>{statusText}</Text>
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Meta Laporan</Text>
          <View style={styles.fieldRow}>
            <View style={styles.field}>
              <Text style={styles.label}>Kode Toko</Text>
              <TextInput
                value={meta.kodeToko}
                onChangeText={(v) => updateMetaField('kodeToko', (v || '').toUpperCase())}
                style={styles.input}
                placeholder="TF81, TB56"
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Nama Toko</Text>
              <TextInput
                value={meta.namaToko}
                onChangeText={(v) => updateMetaField('namaToko', (v || '').toUpperCase())}
                style={styles.input}
                placeholder="SOLEAR"
              />
            </View>
          </View>
          <View style={styles.fieldRow}>
            <View style={styles.field}>
              <Text style={styles.label}>Bulan (1-12)</Text>
              <TextInput
                value={String(meta.bulan)}
                keyboardType="numeric"
                onChangeText={(v) => updateMetaField('bulan', Number(v) || 1)}
                style={styles.input}
                placeholder="1"
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Tahun</Text>
              <TextInput
                value={String(meta.tahun)}
                keyboardType="numeric"
                onChangeText={(v) => updateMetaField('tahun', Number(v) || 2025)}
                style={styles.input}
                placeholder="2025"
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Shift</Text>
              <TextInput
                value={String(meta.shift)}
                keyboardType="numeric"
                onChangeText={(v) => updateMetaField('shift', Number(v) || 3)}
                style={styles.input}
                placeholder="3"
              />
            </View>
          </View>
          <View style={[styles.rowBetween, { gap: 8, marginTop: 8 }]}>
            <Button label="Isi Contoh Data" onPress={applySeedData} variant="ghost" />
            <Button label="Reset" onPress={handleReset} variant="danger" />
            <Button label={savingMeta ? 'Menyimpan...' : 'Simpan Meta'} onPress={() => handleSave('meta')} disabled={savingMeta} />
          </View>
          <Text style={{ marginTop: 8, fontSize: 12, color: '#6b7280' }}>
            Data otomatis tersimpan ke Firestore + cache. Tombol simpan untuk paksa simpan manual.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Input Harian</Text>
            <Button label="+ Tambah Baris" onPress={addRow} />
          </View>
          {rows.length === 0 ? (
            <Text style={{ color: '#6b7280', marginTop: 8 }}>Belum ada baris.</Text>
          ) : (
            <View style={{ gap: 12, marginTop: 8 }}>
              {rows.map((row, index) => (
                <View key={`${index}-${row.tanggal}`} style={styles.rowCard}>
                  <View style={[styles.rowBetween, { marginBottom: 8 }]}>
                    <Text style={{ fontWeight: '600' }}>Baris {index + 1}</Text>
                    <TouchableOpacity onPress={() => deleteRow(index)}>
                      <Text style={{ color: '#d64545' }}>Hapus</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.fieldRow}>
                    <View style={styles.field}>
                      <Text style={styles.label}>Tanggal</Text>
                      <TextInput
                        value={row.tanggal !== null ? String(row.tanggal) : ''}
                        keyboardType="numeric"
                        onChangeText={(v) => updateRow(index, 'tanggal', v === '' ? null : Number(v))}
                        style={styles.input}
                      />
                    </View>
                    <View style={styles.field}>
                      <Text style={styles.label}>SPD</Text>
                      <TextInput
                        value={row.spd !== null ? String(row.spd) : ''}
                        keyboardType="numeric"
                        onChangeText={(v) => updateRow(index, 'spd', v === '' ? null : Number(v))}
                        style={styles.input}
                      />
                    </View>
                  </View>
                  <View style={styles.fieldRow}>
                    <View style={styles.field}>
                      <Text style={styles.label}>STD</Text>
                      <TextInput
                        value={row.std !== null ? String(row.std) : ''}
                        keyboardType="numeric"
                        onChangeText={(v) => updateRow(index, 'std', v === '' ? null : Number(v))}
                        style={styles.input}
                      />
                    </View>
                    <View style={styles.field}>
                      <Text style={styles.label}>APC (auto)</Text>
                      <TextInput
                        value={
                          row.std && row.std > 0 && row.spd ? formatNumber(Math.round(row.spd / row.std)) : row.apc ? formatNumber(row.apc) : ''
                        }
                        editable={false}
                        style={[styles.input, { backgroundColor: '#f1f5f9' }]}
                      />
                    </View>
                  </View>
                  <View style={styles.field}>
                    <Text style={styles.label}>Pulsa</Text>
                    <TextInput
                      value={row.pulsa !== null ? String(row.pulsa) : '0'}
                      keyboardType="numeric"
                      onChangeText={(v) => updateRow(index, 'pulsa', v === '' ? 0 : Number(v))}
                      style={styles.input}
                    />
                  </View>
                </View>
              ))}
            </View>
          )}
          <Button
            label={savingData ? 'Menyimpan...' : 'Simpan Data'}
            onPress={() => handleSave('data')}
            disabled={savingData}
            style={{ marginTop: 12 }}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Ringkasan</Text>
          <View style={styles.summaryRow}>
            <SummaryItem label="Total SPD" value={formatNumber(summary.totalSpd)} color="#0f60c4" />
            <SummaryItem label="Total STD" value={formatNumber(summary.totalStd)} color="#4f46e5" />
          </View>
          <View style={styles.summaryRow}>
            <SummaryItem label="Rata-rata APC" value={formatNumber(summary.avgApc)} color="#0ea568" />
            <SummaryItem label="Total Pulsa" value={formatNumber(summary.totalPulsa)} color="#d97706" />
          </View>
          <Text style={{ marginTop: 8, fontSize: 12, color: '#6b7280' }}>Hari terisi: {summary.filledDays}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Format Laporan</Text>
            <Button label="Generate" onPress={handleGenerate} />
          </View>
          <TextInput
            multiline
            editable={false}
            value={reportText}
            placeholder="Belum ada teks laporan. Isi data lalu klik Generate."
            style={[styles.input, { height: 180, textAlignVertical: 'top', backgroundColor: '#0f172a', color: '#e2e8f0', fontSize: 13 }]}
          />
          <View style={[styles.rowBetween, { gap: 8 }]}>
            <Button label="Copy" onPress={handleCopy} variant="ghost" />
            <Button label={exporting ? 'Membuat Excel...' : 'Download Excel'} onPress={handleExport} disabled={exporting} variant="secondary" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const SummaryItem = ({ label, value, color }) => (
  <View style={[styles.summaryItem, { borderColor: color + '30', backgroundColor: '#f8fafc' }]}>
    <Text style={{ fontSize: 12, color: '#475569' }}>{label}</Text>
    <Text style={{ fontSize: 18, fontWeight: '700', color }}>{value || '-'}</Text>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  field: {
    flex: 1,
    marginBottom: 8,
  },
  fieldRow: {
    flexDirection: 'row',
    gap: 8,
  },
  label: {
    fontSize: 12,
    color: '#4b5563',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonGhost: {
    backgroundColor: '#e5e7eb',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#f8fafc',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 8,
  },
  summaryItem: {
    flex: 1,
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
  },
  badge: {
    fontSize: 12,
    color: '#0f60c4',
    marginBottom: 6,
  },
  errorText: {
    color: '#d64545',
    marginBottom: 8,
  },
})
