import dbConnect from '../../lib/db';
import Entry from '../../models/Entry';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, id, text } = req.body;

  if (!token || !id || typeof text !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid fields' });
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
      return res.status(403).json({
        error: 'Unauthorized',
        reason: !data.valid ? 'Token invalid/expired' : 'Author mismatch',
        entryAuthor: entry.author,
        identifier: data.identifier
      });
    }

    entry.text = text;
    entry.updatedAt = new Date();

    if (!entry.activities) entry.activities = [];
    entry.activities.push({ type: 'edited', timestamp: new Date() });

    await entry.save();
    console.log(`[UPDATED] Entry ${entry._id} by ${entry.author} @ ${new Date().toISOString()}: "${entry.text}"`);

    return res.status(200).json({ success: true, entry });
  } catch (error) {
    console.error('[UPDATE ERROR]', error);
    return res.status(500).json({ error: 'Failed to update entry', details: error.message });
  }
}
