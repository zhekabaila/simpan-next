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

export const getPaginationLabel = (pagination: Omit<PaginationType, "pages" | "sort" | "order"> | null) => {
  if (pagination) {
    const { limit, page, size } = pagination
    const start = page * limit - limit + 1
    const end = start + limit - 1
    const finalEnd = size < end ? size : end

    return `Menampilkan ${start} sampai ${finalEnd} dari ${size} baris`
  }
  return null
}
