type StatusVariant =
  | 'menunggu'
  | 'ditinjau'
  | 'disetujui'
  | 'ditolak'
  | 'diterima'
  | 'duplikat'
  | 'gagal'
  | 'akan_datang'
  | 'aktif'
  | 'selesai'
  | 'sembako'
  | 'tunai'
  | 'bpnt'
  | 'pkh'
  | 'lainnya'

interface StatusBadgeProps {
  status: StatusVariant
  label?: string
}

const variantConfig: Record<StatusVariant, { bg: string; text: string; dot: string; defaultLabel: string }> = {
  menunggu: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
    defaultLabel: 'Menunggu'
  },
  ditinjau: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
    defaultLabel: 'Ditinjau'
  },
  disetujui: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    dot: 'bg-green-500',
    defaultLabel: 'Disetujui'
  },
  ditolak: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    dot: 'bg-red-500',
    defaultLabel: 'Ditolak'
  },
  diterima: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    dot: 'bg-green-500',
    defaultLabel: 'Diterima'
  },
  duplikat: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
    defaultLabel: 'Duplikat'
  },
  gagal: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    dot: 'bg-red-500',
    defaultLabel: 'Gagal'
  },
  akan_datang: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
    defaultLabel: 'Akan Datang'
  },
  aktif: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    dot: 'bg-green-500',
    defaultLabel: 'Aktif'
  },
  selesai: {
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    dot: 'bg-slate-400',
    defaultLabel: 'Selesai'
  },
  sembako: {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    dot: 'bg-orange-500',
    defaultLabel: 'Sembako'
  },
  tunai: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
    defaultLabel: 'Tunai'
  },
  bpnt: {
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    dot: 'bg-cyan-500',
    defaultLabel: 'BPNT'
  },
  pkh: {
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    dot: 'bg-violet-500',
    defaultLabel: 'PKH'
  },
  lainnya: {
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    dot: 'bg-gray-400',
    defaultLabel: 'Lainnya'
  }
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  // Fallback config untuk status yang tidak ditemukan
  const fallbackConfig = {
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    dot: 'bg-gray-400',
    defaultLabel: 'Unknown'
  }
  
  const config = variantConfig[status] ?? fallbackConfig
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {label ?? config.defaultLabel}
    </span>
  )
}
