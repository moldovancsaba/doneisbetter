import dbConnect from '../../lib/db';
import Entry from '../../models/Entry';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.body;
  const ssoValidateUrl = process.env.SSO_VALIDATE_URL;

  if (!token || !ssoValidateUrl) {
    return res.status(400).json({ error: 'Token or SSO URL missing' });
  }

  try {
    const ssoResponse = await fetch(ssoValidateUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });

    const data = await ssoResponse.json();

    if (!ssoResponse.ok || !data.identifier) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await dbConnect();

    return res.status(200).json({ identifier: data.identifier });
  } catch (error) {
    console.error('[AUTH ERROR]', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
