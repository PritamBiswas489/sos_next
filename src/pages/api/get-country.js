export default async function handler(req, res) {
  // Vercel sets x-vercel-ip-country, Cloudflare sets cf-ipcountry
  const country =
    req.headers["x-vercel-ip-country"] ||
    req.headers["cf-ipcountry"] ||
    null;

  if (country) {
    return res.status(200).json({ country_code: country });
  }

  // Fallback: server-side lookup (no CORS issues)
  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
      req.socket.remoteAddress;

    // Loopback addresses can't be looked up — return null (uses client fallback)
    const isLocalhost =
      !ip || ip === "::1" || ip === "127.0.0.1" || ip.startsWith("::ffff:127.");

    if (isLocalhost) {
      return res.status(200).json({ country_code: null });
    }

    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await response.json();

    return res.status(200).json({ country_code: data?.country_code || null });
  } catch {
    return res.status(200).json({ country_code: null });
  }
}
