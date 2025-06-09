import https from 'https';

export default async function handler(req, res) {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Missing token' });
  }

  const SSO_VALIDATE_URL = process.env.SSO_VALIDATE_URL;
  if (!SSO_VALIDATE_URL) {
    return res.status(500).json({ error: 'Missing SSO_VALIDATE_URL in environment' });
  }

  try {
    const response = await fetch(`${SSO_VALIDATE_URL}?token=${token}`, {
      agent: new https.Agent({ rejectUnauthorized: false }) // for local dev, optional
    });

    const data = await response.json();

    if (data.valid) {
      return res.status(200).json({ identifier: data.identifier });
    } else {
      return res.status(401).json({ error: 'Invalid token' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Token validation failed', details: err.message });
  }
}
