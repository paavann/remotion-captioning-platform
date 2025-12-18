import fs from 'fs/promises'
import { ensureUploadDir, generateVideoId, getVideoPath } from '@/lib/upload'

export const runtime = "nodejs"

export async function POST(req: Request) {
    try {
        const formData = await req.formData()
        const file = formData.get('file')
        if(!file || !(file instanceof File))
            return Response.json(
                { error: 'No file uploaded' }, { status: 400 },
            )

        const filename = file.name.toLowerCase()
        const isMp4 = file.type === 'video/mp4' || filename.endsWith('.mp4')
        if(!isMp4) {
            console.log('Invalid file type:', file.type)
            return Response.json(
                { error: 'Invalid file type. Only MP4 videos are allowed.' }, { status: 400 },
            )
        }

        await ensureUploadDir()
        const videoId = await generateVideoId()
        const videoPath = getVideoPath(videoId)

        const buffer = Buffer.from(await file.arrayBuffer())
        await fs.writeFile(videoPath, buffer)

        return Response.json({
            videoId,
            filename,
            size: buffer.length,
        })
    } catch(err) {
        console.error('Upload error:', err)
        return Response.json(
            { error: 'Internal server error' }, { status: 500 },
        )
    }
}