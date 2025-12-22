type Props = {
  size?: number
}

export const Logo = ({ size = 42 }: Props) => {
  const dim = `${size}px`
  return (
    <div className="flex items-center justify-center" style={{ width: dim, height: dim }}>
      <img
        src="/logo-alfamart.png"
        alt="Alfamart"
        className="h-full w-full object-contain rounded-xl border border-slate-200 shadow-sm bg-white"
      />
    </div>
  )
}
