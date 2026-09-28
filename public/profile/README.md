# Profile portrait

Keep exactly **one** portrait source image in this directory.

Supported formats:

- `.jpg`
- `.jpeg`
- `.png`

The filename itself does not matter. Before local development and production builds, `scripts/sync-profile-portrait.mjs` detects the source image, copies it to a content-hashed generated path, and updates the generated TypeScript manifest used by the homepage.

This means that replacing the portrait or changing between JPG and PNG produces a new image URL automatically, avoiding stale Next.js/CDN image caches.

If you change the file while `npm run dev` is already running, restart the dev server once so the portrait sync step runs again.
