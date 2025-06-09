import dbConnect from '../../lib/db';
import Entry from '../../models/Entry';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, id } = req.body;

  if (!token || !id) {
    return res.status(400).json({ error: 'Missing token or id' });
  }

  try {
    await dbConnect();

    const entry = await Entry.findById(id);
    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    const validateURL = process.env.SSO_VALIDATE_URL;
    const response = await fetch(`${validateURL}?token=${token}`);
    const data = await response.json();

    if (!data.valid || data.identifier !== entry.author) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await Entry.deleteOne({ _id: id });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete entry', details: error.message });
  }
}
