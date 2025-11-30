import { NextRequest, NextResponse } from 'next/server'
import { ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from '@/lib/r2'

export async function GET(req: NextRequest) {
  try {
    if (!R2_BUCKET_NAME) {
      return NextResponse.json({ error: 'R2 Bucket not configured' }, { status: 500 })
    }

    const command = new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
      MaxKeys: 100, // Limit for now, could add pagination later
    })

    const response = await r2Client.send(command)
    
    const files = response.Contents?.map(item => ({
      key: item.Key,
      url: `${R2_PUBLIC_URL}/${item.Key}`,
      lastModified: item.LastModified,
      size: item.Size,
    })).sort((a, b) => {
        // Sort by newest first
        return (b.lastModified?.getTime() || 0) - (a.lastModified?.getTime() || 0)
    }) || []

    return NextResponse.json({ files })
  } catch (error) {
    console.error('Error listing files:', error)
    return NextResponse.json({ error: 'Failed to list files' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { key } = await req.json()

    if (!key) {
      return NextResponse.json({ error: 'Missing file key' }, { status: 400 })
    }

    if (!R2_BUCKET_NAME) {
      return NextResponse.json({ error: 'R2 Bucket not configured' }, { status: 500 })
    }

    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    })

    await r2Client.send(command)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting file:', error)
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 })
  }
}
