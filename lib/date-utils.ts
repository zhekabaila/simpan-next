/**
 * Format ISO datetime string to YYYY-MM-DD for date input
 * @param dateString ISO 8601 format like "2026-03-18T00:00:00.000000Z"
 * @returns Formatted date string like "2026-03-18"
 */
export function formatDateForInput(dateString: string | undefined | null): string {
  if (!dateString) return ''
  
  try {
    // Extract date part from ISO string
    // Handles both "2026-03-18T00:00:00.000000Z" and "2026-03-18"
    const [datePart] = dateString.split('T')
    return datePart || ''
  } catch {
    return ''
  }
}

/**
 * Format date input value back to ISO format for API
 * @param dateString YYYY-MM-DD format like "2026-03-18"
 * @returns ISO format like "2026-03-18T00:00:00.000000Z"
 */
export function formatDateForAPI(dateString: string | undefined | null): string {
  if (!dateString) return ''
  
  try {
    // Convert YYYY-MM-DD to ISO format with midnight UTC
    return `${dateString}T00:00:00.000000Z`
  } catch {
    return ''
  }
}

/**
 * Format date for display (Indonesian format)
 * @param dateString ISO format or YYYY-MM-DD
 * @returns Indonesian format like "18 Maret 2026"
 */
export function formatDateForDisplay(dateString: string | undefined | null): string {
  if (!dateString) return '-'
  
  try {
    const [datePart] = dateString.split('T')
    const date = new Date(datePart + 'T00:00:00')
    
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  } catch {
    return '-'
  }
}
