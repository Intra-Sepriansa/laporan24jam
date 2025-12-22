import { useEffect, useRef, useState } from 'react'

type Props = {
  open: boolean
  targetLabel: string
  onClose: () => void
  onCapture: (file: File) => void
  onError?: (message: string) => void
}

export const CameraCapture = ({ open, targetLabel, onClose, onCapture, onError }: Props) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [capturing, setCapturing] = useState(false)

  useEffect(() => {
    if (!open) return

    let activeStream: MediaStream | null = null

    const start = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        })
        activeStream = mediaStream
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
          await videoRef.current.play()
        }
      } catch (err) {
        console.error(err)
        setCameraError('Tidak bisa mengakses kamera. Pastikan izin kamera diaktifkan.')
        onError?.('Tidak bisa mengakses kamera.')
      }
    }

    start()

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop())
      }
      setCameraError(null)
      setCapturing(false)
    }
  }, [open, onError])

  if (!open) return null

  const handleCapture = async () => {
    if (!videoRef.current) return
    setCapturing(true)
    const video = videoRef.current
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth || 1280
    canvas.height = video.videoHeight || 720
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      onError?.('Gagal membaca kamera.')
      setCapturing(false)
      return
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          onError?.('Gagal mengambil foto.')
          setCapturing(false)
          return
        }
        const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' })
        onCapture(file)
        setCapturing(false)
      },
      'image/jpeg',
      0.95,
    )
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Ambil foto {targetLabel}</p>
            <p className="text-xs text-slate-500">Izinkan akses kamera, bidik angka lalu klik ambil foto.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 text-sm px-2"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        <div className="relative bg-black aspect-video">
          {cameraError ? (
            <div className="absolute inset-0 flex items-center justify-center px-4 text-center text-sm text-white">
              {cameraError}
            </div>
          ) : (
            <video ref={videoRef} className="w-full h-full object-contain bg-black" playsInline muted />
          )}
        </div>

        <div className="px-4 py-3 flex items-center justify-end gap-2 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white hover:bg-slate-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleCapture}
            disabled={capturing || !!cameraError}
            className="px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 shadow-sm"
          >
            {capturing ? 'Memproses...' : 'Ambil Foto'}
          </button>
        </div>
      </div>
    </div>
  )
}
