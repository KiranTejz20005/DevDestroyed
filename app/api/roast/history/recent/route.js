import config from '../../../../../config.json';

export async function GET(req) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || config.url;
  const target = `${apiUrl}/api/roast/history/recent`;
  try {
    const res = await fetch(target);
    const body = await res.text();
    const headers = {};
    const contentType = res.headers.get('content-type');
    if (contentType) headers['Content-Type'] = contentType;
    return new Response(body, { status: res.status, headers });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
