import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

const MARK =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 100 100"><g fill="none" stroke="#f4f4f2" stroke-width="4.5"><rect x="16" y="27" width="68" height="30"/><circle cx="50" cy="57" r="22"/></g></svg>`,
  );

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0a',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={MARK} width={120} height={120} alt="" />
      </div>
    ),
    size,
  );
}
