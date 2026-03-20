import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url: fileUrl, fileName: inputFileName } = body

    const targetUrl = fileUrl

    if (!targetUrl) {
      return NextResponse.json(
        { error: 'image or url is required' },
        { status: 400 }
      )
    }

    let url: URL
    try {
      url = new URL(targetUrl)
    } catch (error) {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
    }

    const fileResponse = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    })

    if (!fileResponse.ok) {
      return NextResponse.json(
        {
          error: `Failed to fetch file: ${fileResponse.status} ${fileResponse.statusText}`,
        },
        { status: fileResponse.status }
      )
    }

    const contentType =
      fileResponse.headers.get('content-type') || 'application/octet-stream'
    const contentLength = fileResponse.headers.get('content-length')

    const fileBuffer = await fileResponse.arrayBuffer()

    const base64 = Buffer.from(fileBuffer).toString('base64')
    const mimeType = contentType
    const base64Data = `data:${mimeType};base64,${base64}`

    const getExtensionFromMimeType = (mimeType: string): string => {
      const mimeToExtension: Record<string, string> = {
        'text/plain': '.txt',
        'text/html': '.html',
        'text/css': '.css',
        'text/javascript': '.js',
        'text/csv': '.csv',
        'application/json': '.json',
        'application/xml': '.xml',
        'application/pdf': '.pdf',
        'application/msword': '.doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          '.docx',
        'application/vnd.ms-excel': '.xls',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
          '.xlsx',
        'application/vnd.ms-powerpoint': '.ppt',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation':
          '.pptx',
        'application/zip': '.zip',
        'application/x-rar-compressed': '.rar',
        'application/x-7z-compressed': '.7z',
        'image/jpeg': '.jpg',
        'image/png': '.png',
        'image/gif': '.gif',
        'image/webp': '.webp',
        'image/svg+xml': '.svg',
        'audio/mpeg': '.mp3',
        'audio/wav': '.wav',
        'video/mp4': '.mp4',
        'video/quicktime': '.mov',
        'video/x-msvideo': '.avi',
      }

      return mimeToExtension[mimeType] || ''
    }

    const urlPath = url.pathname
    const urlFilename =
      urlPath.substring(urlPath.lastIndexOf('/') + 1) || 'downloaded-file'

    const filename =
      inputFileName && inputFileName.trim() ? inputFileName.trim() : urlFilename
    const originalFilename = filename

    const fileExtension = filename.substring(filename.lastIndexOf('.'))
    const correctExtension = getExtensionFromMimeType(mimeType)

    let correctedFilename = filename

    if (fileExtension === '.bin' && correctExtension) {
      correctedFilename = filename.replace(/\.bin$/, correctExtension)
   
    } else if (correctExtension && !filename.includes('.')) {
      correctedFilename = filename + correctExtension
    } else if (
      correctExtension &&
      fileExtension &&
      fileExtension !== correctExtension
    ) {
      correctedFilename = filename.replace(/\.[^.]+$/, correctExtension)
    }

    return NextResponse.json({
      success: true,
      base64: base64Data,
      mimeType,
      size: fileBuffer.byteLength,
      filename: correctedFilename,
      originalFilename,
      inputFileName: inputFileName || null,
      urlFilename: urlFilename,
      originalUrl: targetUrl,
      contentLength: contentLength
        ? parseInt(contentLength)
        : fileBuffer.byteLength,
      corrected: correctedFilename !== originalFilename,
      wasInputProvided: !!(inputFileName && inputFileName.trim()),
    })
  } catch (error) {

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'File to Base64 API endpoint',
    usage:
      'Send POST request with { "url": "your-file-url", "fileName": "optional-custom-filename" }',
    example: {
      method: 'POST',
      body: {
        url: 'https://example.com/file.pdf',
        fileName: 'my-document.pdf',
      },
    },
    supportedFormats:
      'All file types supported (images, PDFs, documents, etc.)',
    features: [
      'Automatic extension correction based on MIME type',
      'Custom filename support via fileName parameter',
      'Converts .bin files to correct extensions',
    ],
  })
}
