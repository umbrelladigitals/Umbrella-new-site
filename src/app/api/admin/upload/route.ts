import { NextRequest, NextResponse } from 'next/server'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from '@/lib/r2'

export async function POST(req: NextRequest) {
  try {
    const { filename, contentType } = await req.json()

    if (!filename || !contentType) {
      return NextResponse.json({ error: 'Missing filename or contentType' }, { status: 400 })
    }

    if (!R2_BUCKET_NAME) {
        return NextResponse.json({ error: 'R2 Bucket not configured' }, { status: 500 })
    }

    const uniqueFilename = `${Date.now()}-${filename.replace(/\s+/g, '-')}`
    
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: uniqueFilename,
      ContentType: contentType,
    })

    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 })

    return NextResponse.json({
      uploadUrl: signedUrl,
      fileUrl: `${R2_PUBLIC_URL}/${uniqueFilename}`,
    })
  } catch (error) {
    console.error('Error generating signed URL:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
