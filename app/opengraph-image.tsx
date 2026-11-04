import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { ImageResponse } from 'next/og'
import sharp from 'sharp'

import { siteProfile } from '@/content/site'

export const alt = `${siteProfile.name}, academic website`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Default social preview, generated at build time from the portrait source.
export default async function OpenGraphImage() {
  const portrait = await sharp(
    await readFile(
      path.join(process.cwd(), 'assets', 'sources', 'profile', 'avatar.png')
    )
  )
    .resize({ width: 400, height: 500, fit: 'cover', position: 'top' })
    .png()
    .toBuffer()

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 64,
          padding: '0 80px',
          background: '#002147',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain img elements. */}
        <img
          src={`data:image/png;base64,${portrait.toString('base64')}`}
          width={400}
          height={500}
          alt=""
          style={{ borderRadius: 24, border: '6px solid #fe615a' }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ fontSize: 30, color: '#fe615a', letterSpacing: 3 }}>
            ACADEMIC WEBSITE
          </div>
          <div
            style={{
              marginTop: 18,
              fontSize: 64,
              lineHeight: 1.1,
              color: '#ffffff',
              fontWeight: 700,
            }}
          >
            {siteProfile.name}
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 30,
              lineHeight: 1.35,
              color: '#d9d8d6',
            }}
          >
            Comparative politics · Government · Computational social science
          </div>
          <div style={{ marginTop: 40, fontSize: 28, color: '#b9d6f2' }}>
            bgonzalezbustamante.com
          </div>
        </div>
      </div>
    ),
    size
  )
}
