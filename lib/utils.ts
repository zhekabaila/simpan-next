import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatIDRCurrency = (amount: number): string => {
  return `Rp${amount.toLocaleString('id-ID')}`
}

export const formatDate = (date: Date): string => {
  return !!date ? format(date, 'dd MMMM yyyy') : '-'
}

/**
 * Format UTC datetime string to display UTC time WITHOUT timezone conversion
 * Backend sends: "2026-04-05T12:27:11.000000Z" (UTC)
 * Expected display: "05/04/2026 12:27" (UTC, NOT converted to local timezone)
 */
export const formatUTCDate = (
  dateString: string | null | undefined,
  formatPattern: 'date' | 'datetime' = 'date'
): string => {
  if (!dateString) return '-'

  try {
    const date = new Date(dateString)

    if (formatPattern === 'datetime') {
      // Format: dd/MM/yyyy HH:mm
      return date
        .toLocaleString('en-US', {
          timeZone: 'UTC',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })
        .replace(/(\d+)\/(\d+)\/(\d+),\s(\d+):(\d+)/, '$2/$1/$3 $4:$5')
    } else {
      // Format: dd/MM/yyyy
      return date
        .toLocaleString('en-US', {
          timeZone: 'UTC',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        })
        .replace(/(\d+)\/(\d+)\/(\d+)/, '$2/$1/$3')
    }
  } catch {
    return '-'
  }
}

export const downloadFile = async (fileUrl: string, fileName: string) => {
  try {
    const file = await fetchFileToBase64(fileUrl, fileName)
    if (!file) throw new Error('File not found')

    const link = document.createElement('a')
    link.href = file.base64
    link.download = file.filename
    link.target = '_blank'
    link.style.display = 'none'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    try {
      const fallbackLink = document.createElement('a')
      fallbackLink.href = fileUrl
      fallbackLink.download = fileName
      fallbackLink.target = '_blank'
      fallbackLink.rel = 'noopener noreferrer'
      fallbackLink.style.display = 'none'

      document.body.appendChild(fallbackLink)
      fallbackLink.click()
      document.body.removeChild(fallbackLink)
    } catch (fallbackError) {
      window.open(fileUrl, '_blank', 'noopener,noreferrer')
    }
  }
}

export const fetchFileToBase64 = async (
  fileUrl: string,
  fileName?: string
): Promise<{ base64: string; filename: string; corrected: boolean } | null> => {
  const res = await fetch('/api/image-to-base64', {
    method: 'POST',
    body: JSON.stringify({ url: fileUrl, fileName }),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(async (res) => {
    if (res.ok) {
      const { base64, corrected, originalFilename, filename } = await res.json()
      const payload = {
        base64,
        corrected,
        filename: corrected ? filename : originalFilename
      }
      return payload
    } else {
      return null
    }
  })
  return res
}

export const getNameAliases = (name: string): string => {
  if (!name) return ''

  return name
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .filter((char) => char)
    .map((char) => char.toUpperCase())
    .join('')
}

export interface PaginationType {
  limit: number
  page: number
  size: number
  pages: number
  sort: number
  order: string
}

export const getPaginationLabel = (pagination: Omit<PaginationType, 'pages' | 'sort' | 'order'> | null) => {
  if (pagination) {
    const { limit, page, size } = pagination
    const start = page * limit - limit + 1
    const end = start + limit - 1
    const finalEnd = size < end ? size : end

    return `Menampilkan ${start} sampai ${finalEnd} dari ${size} baris`
  }
  return null
}
