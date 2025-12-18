import fs from "fs/promises"
import path from "path"
import crypto from "crypto"

const UPLOAD_DIR = "/tmp/remotion"

export async function ensureUploadDir() {
    await fs.mkdir(UPLOAD_DIR, { recursive: true })
}

export async function generateVideoId() {
    return crypto.randomUUID()
}

export function getVideoPath(videoId: string) {
    return path.join(UPLOAD_DIR, `${videoId}.mp4`)
}