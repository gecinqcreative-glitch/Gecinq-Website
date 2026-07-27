import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'GECINQ CREATIVE — Studio créatif, Lausanne';

const MARK =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="140" height="140" viewBox="0 0 100 100"><g fill="none" stroke="#f4f4f2" stroke-width="4"><rect x="12" y="26" width="76" height="30"/><circle cx="50" cy="56" r="24"/></g></svg>`,
  );

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          background: '#000',
          color: '#f4f4f2',
          padding: 80,
          fontFamily: 'sans-serif',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={MARK} width={130} height={130} alt="" style={{ marginBottom: 44 }} />
        <div style={{ fontSize: 92, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>
          GECINQ CREATIVE
        </div>
        <div style={{ fontSize: 32, opacity: 0.6, marginTop: 22, letterSpacing: -1 }}>
          Studio créatif — Lausanne (CH)
        </div>
      </div>
    ),
    size,
  );
}
