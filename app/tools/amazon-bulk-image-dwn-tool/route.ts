import JSZip from 'jszip';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// 🔒 Free tier limit (change later for Pro)
const MAX_IMAGES_FREE = 100;

export async function POST(req: Request) {
  try {
    const { rawData } = await req.json();

    const zip = new JSZip();
    const errors: { asin: string; url: string; reason: string }[] = [];

    const lines = rawData.trim().split('\n');

    let totalImages = 0;

    for (const line of lines) {
      const parts = line.split('\t');
      const asin = parts[0]?.trim();
      const urls = parts.slice(1);

      if (!asin) continue;

      const folder = zip.folder(asin);
      if (!folder) continue;

      for (let i = 0; i < urls.length; i++) {
        if (totalImages >= MAX_IMAGES_FREE) {
          errors.push({
            asin,
            url: '',
            reason: 'Free limit reached',
          });
          break;
        }

        const url = urls[i]?.trim();
        if (!url) continue;

        try {
          const res = await fetch(url);

          if (!res.ok) {
            errors.push({ asin, url, reason: 'Fetch failed' });
            continue;
          }

          const buffer = await res.arrayBuffer();

          const filename =
            i === 0
              ? `${asin}.MAIN.jpg`
              : `${asin}.PT${String(i).padStart(2, '0')}.jpg`;

          folder.file(filename, new Uint8Array(buffer));
          totalImages++;
        } catch {
          errors.push({ asin, url, reason: 'Download error' });
        }
      }
    }

    // 📄 Add error report (if any)
    if (errors.length) {
      const errorText = errors
        .map(e => `${e.asin}\t${e.url}\t${e.reason}`)
        .join('\n');

      zip.file('error-report.txt', errorText);
    }

    const zipData = await zip.generateAsync({
  type: 'uint8array',
  compression: 'DEFLATE',
});

return new NextResponse(Buffer.from(zipData), {

  headers: {
    'Content-Type': 'application/zip',
    'Content-Disposition': 'attachment; filename="amazon-images.zip"',
  },
});
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'ZIP generation failed' },
      { status: 500 }
    );
  }
}
